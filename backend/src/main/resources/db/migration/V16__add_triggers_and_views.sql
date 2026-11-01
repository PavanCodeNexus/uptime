-- V16: Database Views, Triggers & Stored Procedures

-- View 1: Active jobs with full details
CREATE VIEW v_active_jobs AS
SELECT
  j.id, j.job_number, j.status, j.industry, j.urgency,
  j.owner_location, j.created_at, j.estimated_cost_min, j.estimated_cost_max,
  u.full_name AS owner_name, u.phone AS owner_phone,
  t.full_name AS tech_name, t.phone AS tech_phone, t.rating_avg AS tech_rating,
  tl.current_location AS tech_location,
  ms.total_score AS match_score, ms.eta_mins,
  afd.fault_category, afd.urgency AS ai_urgency
FROM jobs j
JOIN users u ON j.owner_id = u.id
LEFT JOIN technicians t ON j.technician_id = t.id
LEFT JOIN technician_locations tl ON t.id = tl.technician_id
LEFT JOIN matching_scores ms ON j.id = ms.job_id
  AND ms.technician_id = j.technician_id
LEFT JOIN ai_fault_diagnoses afd ON j.id = afd.job_id
WHERE j.status NOT IN ('COMPLETED','CANCELLED')
  AND j.deleted_at IS NULL;

-- View 2: Technician dashboard summary
CREATE VIEW v_technician_dashboard AS
SELECT
  t.id, t.full_name, t.rating_avg, t.is_available,
  t.wallet_balance, t.fatigue_score, t.is_fatigue_restricted,
  ts.total_jobs, ts.total_earnings,
  ts.jobs_this_month, ts.earnings_this_month,
  ts.acceptance_rate, ts.completion_rate,
  COUNT(DISTINCT tb.id) AS badges_earned,
  COUNT(DISTINCT ts2.id) AS skills_count
FROM technicians t
JOIN technician_statistics ts ON t.id = ts.technician_id
LEFT JOIN technician_badges tb ON t.id = tb.technician_id
LEFT JOIN technician_skills ts2 ON t.id = ts2.technician_id
WHERE t.deleted_at IS NULL
GROUP BY t.id, t.full_name, t.rating_avg, t.is_available,
  t.wallet_balance, t.fatigue_score, t.is_fatigue_restricted,
  ts.total_jobs, ts.total_earnings,
  ts.jobs_this_month, ts.earnings_this_month,
  ts.acceptance_rate, ts.completion_rate;

-- View 3: Platform summary for admin dashboard
CREATE VIEW v_platform_summary AS
SELECT
  (SELECT COUNT(*) FROM jobs
   WHERE status NOT IN ('COMPLETED','CANCELLED')
     AND deleted_at IS NULL)         AS active_jobs,
  (SELECT COUNT(*) FROM jobs
   WHERE created_at > NOW() - INTERVAL '24 hours'
     AND deleted_at IS NULL)         AS jobs_today,
  (SELECT COUNT(*) FROM technicians
   WHERE is_available = TRUE
     AND deleted_at IS NULL)         AS online_techs,
  (SELECT COUNT(*) FROM technicians
   WHERE verification_status = 'PENDING')  AS pending_verifications,
  (SELECT COUNT(*) FROM job_disputes
   WHERE status = 'OPEN')            AS open_disputes,
  (SELECT COUNT(*) FROM epidemic_detections
   WHERE is_active = TRUE)           AS active_epidemics,
  (SELECT SUM(net_revenue)
   FROM platform_revenue
   WHERE date = CURRENT_DATE)        AS revenue_today;


-- Trigger 1: Auto-update technician stats after job completion
CREATE OR REPLACE FUNCTION update_tech_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'COMPLETED' AND OLD.status != 'COMPLETED' THEN
    UPDATE technician_statistics
    SET
      total_jobs = total_jobs + 1,
      total_earnings = total_earnings + COALESCE(NEW.final_cost * 0.9, 0),
      jobs_this_month = jobs_this_month + 1,
      earnings_this_month = earnings_this_month + COALESCE(NEW.final_cost * 0.9, 0),
      last_job_at = NEW.completed_at,
      updated_at = NOW()
    WHERE technician_id = NEW.technician_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_job_complete
  AFTER UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_tech_stats();

-- Trigger 2: Auto-update technician rating average
CREATE OR REPLACE FUNCTION update_rating_avg()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE technicians
  SET
    rating_avg = (
      SELECT COALESCE(AVG(technician_rating), 0)
      FROM job_ratings
      WHERE technician_id = NEW.technician_id
        AND technician_rating IS NOT NULL
    ),
    updated_at = NOW()
  WHERE id = NEW.technician_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_rating_insert
  AFTER INSERT OR UPDATE ON job_ratings
  FOR EACH ROW
  WHEN (NEW.technician_rating IS NOT NULL)
  EXECUTE FUNCTION update_rating_avg();

-- Trigger 3: Prevent modification of audit logs
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable — modification not allowed';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_immutable
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION prevent_audit_modification();

-- Trigger 4: Auto-update digital twin on job completion
CREATE OR REPLACE FUNCTION update_digital_twin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'COMPLETED' AND OLD.status != 'COMPLETED'
     AND NEW.asset_id IS NOT NULL THEN
    UPDATE digital_twins
    SET
      total_repairs = total_repairs + 1,
      total_repair_cost = total_repair_cost + COALESCE(NEW.final_cost, 0),
      last_updated_at = NOW()
    WHERE asset_id = NEW.asset_id AND asset_type = NEW.asset_type;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_job_complete_twin
  AFTER UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_digital_twin();


-- Procedure 1: Calculate matching score for a technician
CREATE OR REPLACE FUNCTION sp_calculate_match_score(
  p_distance_km DECIMAL,
  p_skill_tags_tech JSONB,
  p_skill_tags_job JSONB,
  p_rating_avg DECIMAL,
  p_total_jobs INT,
  p_avg_response_secs INT,
  p_is_fatigue_restricted BOOLEAN
) RETURNS DECIMAL AS $$
DECLARE
  v_distance_score DECIMAL;
  v_skill_score DECIMAL;
  v_base_score DECIMAL;
  v_modifier DECIMAL := 0;
  v_matched_skills INT;
  v_total_job_skills INT;
BEGIN
  -- Distance score
  v_distance_score := CASE
    WHEN p_distance_km < 2  THEN 100
    WHEN p_distance_km < 5  THEN 80
    WHEN p_distance_km < 10 THEN 60
    WHEN p_distance_km < 20 THEN 40
    ELSE 20
  END;

  -- Skill score
  v_total_job_skills := jsonb_array_length(p_skill_tags_job);
  IF v_total_job_skills = 0 THEN
    v_skill_score := 50;
  ELSE
    SELECT COUNT(*) INTO v_matched_skills
    FROM jsonb_array_elements_text(p_skill_tags_job) js
    WHERE p_skill_tags_tech @> jsonb_build_array(js);

    v_skill_score := CASE
      WHEN v_matched_skills = v_total_job_skills THEN 100
      WHEN v_matched_skills::DECIMAL / v_total_job_skills > 0.5 THEN 70
      WHEN v_matched_skills::DECIMAL / v_total_job_skills > 0.25 THEN 40
      WHEN v_matched_skills > 0 THEN 20
      ELSE 0
    END;
  END IF;

  -- Base score (40% distance, 60% skill)
  v_base_score := (v_distance_score * 0.40) + (v_skill_score * 0.60);

  -- Modifiers
  IF p_rating_avg > 4.5 THEN v_modifier := v_modifier + 10; END IF;
  IF p_rating_avg > 4.0 AND p_rating_avg <= 4.5 THEN v_modifier := v_modifier + 5; END IF;
  IF p_total_jobs > 100 THEN v_modifier := v_modifier + 5; END IF;
  IF p_avg_response_secs IS NOT NULL AND p_avg_response_secs < 120 THEN
    v_modifier := v_modifier + 5;
  END IF;
  IF p_is_fatigue_restricted THEN v_modifier := v_modifier - 50; END IF;

  RETURN LEAST(100, GREATEST(0, v_base_score + v_modifier));
END;
$$ LANGUAGE plpgsql;


-- Procedure 2: Generate unique job number
CREATE OR REPLACE FUNCTION sp_generate_job_number()
RETURNS VARCHAR AS $$
DECLARE
  v_year INT := EXTRACT(YEAR FROM NOW());
  v_count INT;
  v_number VARCHAR(20);
BEGIN
  SELECT COUNT(*) + 1 INTO v_count
  FROM jobs
  WHERE EXTRACT(YEAR FROM created_at) = v_year;

  v_number := 'UPT-' || v_year || '-' || LPAD(v_count::TEXT, 5, '0');
  RETURN v_number;
END;
$$ LANGUAGE plpgsql;

