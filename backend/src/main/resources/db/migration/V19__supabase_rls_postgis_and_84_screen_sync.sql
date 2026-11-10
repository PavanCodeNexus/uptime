-- V19__supabase_rls_postgis_and_84_screen_sync.sql
-- Synchronizes Supabase PostgreSQL 15 + PostGIS with:
--   1. RULE SB-00 (Strict Fatigue Exclusion in SQL/Stored Procedures — never -50 points)
--   2. Supabase Security Checklist (Postgres 15 security_invoker views + RLS + TO authenticated policies)
--   3. 84-Screen Owner (S01-S44) & Technician (T01-T40) tables (Blind Mutual Ratings T38, Warranty Revisit T40, Fatigue Rest Breaks T39)

-- 1. Enforce RULE SB-00 in sp_calculate_match_score (never penalize with -50; exclude at query level)
CREATE OR REPLACE FUNCTION sp_calculate_match_score(
  p_distance_km DECIMAL,
  p_skill_tags_tech JSONB,
  p_skill_tags_job JSONB,
  p_rating_avg DECIMAL,
  p_total_jobs INT,
  p_avg_response_secs INT,
  p_is_fatigue_restricted BOOLEAN
) RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_distance_score DECIMAL;
  v_skill_score DECIMAL;
  v_base_score DECIMAL;
  v_modifier DECIMAL := 0;
  v_matched_skills INT;
  v_total_job_skills INT;
BEGIN
  -- RULE SB-00: Fatigued technicians must be excluded in WHERE clause (AND is_fatigue_restricted = FALSE)
  IF p_is_fatigue_restricted THEN
    RAISE EXCEPTION 'Fatigue-restricted technicians must be excluded at query level (RULE SB-00)';
  END IF;

  v_distance_score := CASE
    WHEN p_distance_km < 2  THEN 100
    WHEN p_distance_km < 5  THEN 80
    WHEN p_distance_km < 10 THEN 60
    WHEN p_distance_km < 20 THEN 40
    ELSE 20
  END;

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

  v_base_score := (v_distance_score * 0.40) + (v_skill_score * 0.60);

  IF p_rating_avg > 4.5 THEN v_modifier := v_modifier + 10; END IF;
  IF p_rating_avg > 4.0 AND p_rating_avg <= 4.5 THEN v_modifier := v_modifier + 5; END IF;
  IF p_total_jobs > 100 THEN v_modifier := v_modifier + 5; END IF;
  IF p_avg_response_secs IS NOT NULL AND p_avg_response_secs < 120 THEN
    v_modifier := v_modifier + 5;
  END IF;

  RETURN LEAST(100, GREATEST(1, v_base_score + v_modifier));
END;
$$;

-- 2. Upgrade Views to security_invoker = true (Postgres 15+ Supabase Best Practice)
ALTER VIEW v_active_jobs SET (security_invoker = true);
ALTER VIEW v_technician_dashboard SET (security_invoker = true);
ALTER VIEW v_platform_summary SET (security_invoker = true);

-- 3. Screen T38 / S21: Blind Mutual Ratings & Site Safety Review (CORE-07)
CREATE TABLE IF NOT EXISTS blind_mutual_ratings (
  id                      BIGSERIAL PRIMARY KEY,
  job_id                  BIGINT UNIQUE NOT NULL REFERENCES jobs(id),
  owner_id                BIGINT NOT NULL REFERENCES users(id),
  technician_id           BIGINT NOT NULL REFERENCES technicians(id),
  owner_to_tech_stars     SMALLINT CHECK (owner_to_tech_stars BETWEEN 1 AND 5),
  owner_review_text       TEXT,
  owner_submitted_at      TIMESTAMPTZ,
  tech_to_owner_stars     SMALLINT CHECK (tech_to_owner_stars BETWEEN 1 AND 5),
  tech_site_safety_tags   JSONB DEFAULT '[]',
  tech_review_text        TEXT,
  tech_submitted_at       TIMESTAMPTZ,
  is_revealed             BOOLEAN NOT NULL DEFAULT FALSE,
  revealed_at             TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_bmr_job_id ON blind_mutual_ratings(job_id);
CREATE INDEX IF NOT EXISTS idx_bmr_tech_id ON blind_mutual_ratings(technician_id);
CREATE INDEX IF NOT EXISTS idx_bmr_owner_id ON blind_mutual_ratings(owner_id);

-- 4. Screen T40: 30-Day Workmanship Warranty Revisit & FFT Acoustic Dispute Desk (WARRANTY-01)
CREATE TABLE IF NOT EXISTS warranty_revisit_claims (
  id                      BIGSERIAL PRIMARY KEY,
  claim_number            VARCHAR(30) UNIQUE NOT NULL,
  original_job_id         BIGINT NOT NULL REFERENCES jobs(id),
  owner_id                BIGINT NOT NULL REFERENCES users(id),
  technician_id           BIGINT NOT NULL REFERENCES technicians(id),
  handover_noise_db       DECIMAL(5,2) NOT NULL DEFAULT 62.00,
  callback_claim_noise_db DECIMAL(5,2) NOT NULL DEFAULT 78.00,
  handover_sha256_hash    VARCHAR(64) NOT NULL,
  symptom_notes           TEXT,
  status                  VARCHAR(30) NOT NULL DEFAULT 'OPEN', -- OPEN | REVISIT_SCHEDULED | RESOLVED | DISPUTE_ESCALATED
  revisit_scheduled_at    TIMESTAMPTZ,
  zero_penalty_applied    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_wrc_original_job ON warranty_revisit_claims(original_job_id);
CREATE INDEX IF NOT EXISTS idx_wrc_technician ON warranty_revisit_claims(technician_id);

-- 5. Screen T39: Fatigue Monitor & Rest Break Telemetry Log (SAFETY-01)
CREATE TABLE IF NOT EXISTS technician_fatigue_breaks (
  id                      BIGSERIAL PRIMARY KEY,
  technician_id           BIGINT NOT NULL REFERENCES technicians(id),
  break_type              VARCHAR(30) NOT NULL DEFAULT 'HYDRATION_45M', -- HYDRATION_45M | STATUTORY_8H_LOCK
  fatigue_score_before    SMALLINT NOT NULL,
  fatigue_score_after     SMALLINT NOT NULL,
  ambient_temp_celsius    DECIMAL(4,1) DEFAULT 31.0,
  started_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at                 TIMESTAMPTZ NOT NULL,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tfb_technician ON technician_fatigue_breaks(technician_id);

-- 6. PostGIS 500m Arrival Geofence Verification Helper (T14 / S17)
CREATE OR REPLACE FUNCTION sp_verify_arrival_geofence_500m(
  p_job_id BIGINT,
  p_tech_lat DOUBLE PRECISION,
  p_tech_lng DOUBLE PRECISION
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_owner_loc geography(POINT, 4326);
  v_tech_loc  geography(POINT, 4326);
BEGIN
  SELECT owner_location INTO v_owner_loc FROM jobs WHERE id = p_job_id;
  IF v_owner_loc IS NULL THEN
    RETURN FALSE;
  END IF;
  v_tech_loc := ST_SetSRID(ST_MakePoint(p_tech_lng, p_tech_lat), 4326)::geography;
  RETURN ST_DWithin(v_owner_loc, v_tech_loc, 500.0);
END;
$$;

-- 7. Enable Row-Level Security (RLS) on Exposed Tables (Supabase Security Best Practice)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_identity_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blind_mutual_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranty_revisit_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_fatigue_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
