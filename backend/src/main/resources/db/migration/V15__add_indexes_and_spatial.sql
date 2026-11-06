-- V15: Deferred Foreign Keys, Spatial Indexes & Performance Indexes

-- Deferred Cross-Module Foreign Keys
ALTER TABLE user_sessions ADD CONSTRAINT fk_user_sessions_device_id FOREIGN KEY (device_id) REFERENCES user_devices(id);
ALTER TABLE refresh_tokens ADD CONSTRAINT fk_refresh_tokens_device_id FOREIGN KEY (device_id) REFERENCES user_devices(id);
ALTER TABLE referrals ADD CONSTRAINT fk_referrals_campaign_id FOREIGN KEY (campaign_id) REFERENCES referral_campaigns(id);
ALTER TABLE technician_documents ADD CONSTRAINT fk_technician_documents_verified_by FOREIGN KEY (verified_by) REFERENCES admin_users(id);
ALTER TABLE technician_verification ADD CONSTRAINT fk_technician_verification_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES admin_users(id);
ALTER TABLE jobs ADD CONSTRAINT fk_jobs_surge_pricing_id FOREIGN KEY (surge_pricing_id) REFERENCES surge_pricing(id);
ALTER TABLE jobs ADD CONSTRAINT fk_jobs_negotiation_id FOREIGN KEY (negotiation_id) REFERENCES job_negotiations(id);
ALTER TABLE jobs ADD CONSTRAINT fk_jobs_live_stream_id FOREIGN KEY (live_stream_id) REFERENCES job_live_streams(id);
ALTER TABLE jobs ADD CONSTRAINT fk_jobs_micro_insurance_id FOREIGN KEY (micro_insurance_id) REFERENCES job_micro_insurance(id);
ALTER TABLE job_parts_used ADD CONSTRAINT fk_job_parts_used_marketplace_product_id FOREIGN KEY (marketplace_product_id) REFERENCES marketplace_products(id);
ALTER TABLE job_disputes ADD CONSTRAINT fk_job_disputes_resolved_by FOREIGN KEY (resolved_by) REFERENCES admin_users(id);
ALTER TABLE silent_killer_alerts ADD CONSTRAINT fk_silent_killer_alerts_device_id FOREIGN KEY (device_id) REFERENCES devices(id);
ALTER TABLE ai_prompt_versions ADD CONSTRAINT fk_ai_prompt_versions_created_by FOREIGN KEY (created_by) REFERENCES admin_users(id);
ALTER TABLE review_reports ADD CONSTRAINT fk_review_reports_resolved_by FOREIGN KEY (resolved_by) REFERENCES admin_users(id);
ALTER TABLE vehicles ADD CONSTRAINT fk_vehicles_engine_fingerprint_id FOREIGN KEY (engine_fingerprint_id) REFERENCES engine_fingerprints(id);
ALTER TABLE insurance_claims ADD CONSTRAINT fk_insurance_claims_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES admin_users(id);
ALTER TABLE marketplace_products ADD CONSTRAINT fk_marketplace_products_seller_id FOREIGN KEY (seller_id) REFERENCES marketplace_sellers(id);
ALTER TABLE mass_notifications ADD CONSTRAINT fk_mass_notifications_created_by FOREIGN KEY (created_by) REFERENCES admin_users(id);
ALTER TABLE admin_users ADD CONSTRAINT fk_admin_users_role_id FOREIGN KEY (role_id) REFERENCES admin_roles(id);

-- All GIST indexes for PostGIS spatial queries
CREATE INDEX IF NOT EXISTS idx_user_addresses_location
  ON user_addresses USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_tech_locations_current
  ON technician_locations USING GIST(current_location);

CREATE INDEX IF NOT EXISTS idx_tech_service_areas_center
  ON technician_service_areas USING GIST(center_location);

CREATE INDEX IF NOT EXISTS idx_jobs_owner_location
  ON jobs USING GIST(owner_location);

CREATE INDEX IF NOT EXISTS idx_vehicle_fuel_location
  ON vehicle_fuel_logs USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_insurance_claims_location
  ON insurance_claims USING GIST(incident_location);

CREATE INDEX IF NOT EXISTS idx_live_tracking_location
  ON live_location_tracking USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_iot_sensor_readings_device
  ON iot_sensor_readings(device_id);

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_wiki_fulltext
  ON wiki_articles
  USING gin(to_tsvector('english',
    title || ' ' || fault_category || ' ' || fault_description));

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_jobs_owner_status
  ON jobs(owner_id, status)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_jobs_tech_status
  ON jobs(technician_id, status)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_matching_scores_job_rank
  ON matching_scores(job_id, rank_position);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread
  ON notifications(recipient_id, is_read)
  WHERE is_read = FALSE;

