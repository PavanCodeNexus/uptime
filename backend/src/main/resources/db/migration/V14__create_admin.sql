-- V14: Admin, Platform & Additional Tables

CREATE TABLE admin_users (
  id                  BIGSERIAL PRIMARY KEY,
  full_name           VARCHAR(100) NOT NULL,
  email               VARCHAR(150) UNIQUE NOT NULL,
  phone               VARCHAR(15) UNIQUE,
  password_hash       VARCHAR(255) NOT NULL,      -- bcrypt 12 rounds
  role_id             BIGINT,
  profile_photo_url   VARCHAR(500),
  is_active           BOOLEAN DEFAULT TRUE,
  is_2fa_enabled      BOOLEAN DEFAULT TRUE,       -- mandatory
  two_fa_secret       TEXT,                       -- encrypted TOTP secret
  allowed_ips         JSONB DEFAULT '[]',         -- IP whitelist
  last_login_at       TIMESTAMPTZ,
  last_login_ip       VARCHAR(45),
  failed_login_count  INT DEFAULT 0,
  locked_until        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ,
  deleted_at          TIMESTAMPTZ);


CREATE TABLE admin_roles (
  id          BIGSERIAL PRIMARY KEY,
  role_name   VARCHAR(100) UNIQUE NOT NULL,
  role_slug   VARCHAR(50) UNIQUE NOT NULL,   -- SUPER_ADMIN/OPS_ADMIN/FINANCE_ADMIN
  description TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE admin_permissions (
  id          BIGSERIAL PRIMARY KEY,
  role_id     BIGINT NOT NULL REFERENCES admin_roles(id),
  permission  VARCHAR(100) NOT NULL,           -- VERIFY_TECHNICIAN/RESOLVE_DISPUTE etc.
  can_read    BOOLEAN DEFAULT TRUE,
  can_create  BOOLEAN DEFAULT FALSE,
  can_update  BOOLEAN DEFAULT FALSE,
  can_delete  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW());

CREATE UNIQUE INDEX uq_role_permission ON admin_permissions(role_id, permission);


CREATE TABLE platform_settings (
  id                BIGSERIAL PRIMARY KEY,
  setting_key       VARCHAR(100) UNIQUE NOT NULL,
  setting_value     TEXT NOT NULL,
  value_type        VARCHAR(20) NOT NULL,  -- STRING/INTEGER/DECIMAL/BOOLEAN/JSON
  description       TEXT,
  industry          VARCHAR(20) DEFAULT 'ALL',
  is_sensitive      BOOLEAN DEFAULT FALSE,
  last_modified_by  BIGINT REFERENCES admin_users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ);


CREATE TABLE feature_flags (
  id                    BIGSERIAL PRIMARY KEY,
  feature_name          VARCHAR(100) UNIQUE NOT NULL,
  feature_slug          VARCHAR(100) UNIQUE NOT NULL,
  description           TEXT,
  is_enabled            BOOLEAN DEFAULT FALSE,
  enabled_for           VARCHAR(30) DEFAULT 'ALL',   -- ALL/BETA/PREMIUM/SPECIFIC
  enabled_user_ids      JSONB DEFAULT '[]',
  industry              VARCHAR(20) DEFAULT 'ALL',
  rollout_percentage    INT DEFAULT 100,
  last_modified_by      BIGINT REFERENCES admin_users(id),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ);


CREATE TABLE cookie_consents (
  id                  BIGSERIAL PRIMARY KEY,
  user_id             BIGINT REFERENCES users(id),
  session_id          VARCHAR(100),
  ip_address          VARCHAR(45) NOT NULL,
  essential_cookies   BOOLEAN DEFAULT TRUE,
  functional_cookies  BOOLEAN DEFAULT FALSE,
  analytics_cookies   BOOLEAN DEFAULT FALSE,
  marketing_cookies   BOOLEAN DEFAULT FALSE,
  consent_version     VARCHAR(20) NOT NULL,
  platform            VARCHAR(20) NOT NULL,
  user_agent          VARCHAR(300),
  consented_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ,
  withdrawn_at        TIMESTAMPTZ);


CREATE TABLE end_of_life_records (
  id                    BIGSERIAL PRIMARY KEY,
  owner_id              BIGINT NOT NULL REFERENCES users(id),
  device_id             BIGINT REFERENCES devices(id),
  vehicle_id            BIGINT REFERENCES vehicles(id),
  machine_id            BIGINT REFERENCES machines(id),
  asset_name            VARCHAR(200) NOT NULL,
  asset_type            VARCHAR(20) NOT NULL,
  years_of_service      DECIMAL(4,1),
  total_repairs         INT DEFAULT 0,
  total_repair_cost     DECIMAL(12,2) DEFAULT 0.00,
  photos_count          INT DEFAULT 0,
  videos_count          INT DEFAULT 0,
  farewell_note         TEXT,
  memory_reel_url       VARCHAR(500),
  memory_reel_generated BOOLEAN DEFAULT FALSE,
  life_certificate_url  VARCHAR(500),
  data_wiped            BOOLEAN DEFAULT FALSE,
  data_wipe_cert_url    VARCHAR(500),
  disposal_method       VARCHAR(30) NOT NULL,  -- RECYCLED/SOLD_PARTS/DONATED/DISPOSED
  disposal_partner      VARCHAR(100),
  co2_saved_kg          DECIMAL(8,2) DEFAULT 0.00,
  green_points_earned   INT DEFAULT 0,
  social_shares_count   INT DEFAULT 0,
  memorial_wall_posted  BOOLEAN DEFAULT FALSE,
  hash_value            VARCHAR(64),
  created_at            TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE engine_fingerprints (
  id                      BIGSERIAL PRIMARY KEY,
  vehicle_id              BIGINT NOT NULL REFERENCES vehicles(id),
  owner_id                BIGINT NOT NULL REFERENCES users(id),
  baseline_recording_url  VARCHAR(500),
  frequency_data          JSONB,               -- FFT frequency components
  harmonic_patterns       JSONB,
  cylinder_firing_data    JSONB,
  health_match_percentage DECIMAL(5,2) DEFAULT 100.00,
  last_recorded_at        TIMESTAMPTZ,
  recordings_count        INT DEFAULT 0,
  status                  VARCHAR(20) DEFAULT 'ACTIVE',  -- ACTIVE/DEGRADED/CRITICAL
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ);

CREATE INDEX idx_engine_fp_vehicle ON engine_fingerprints(vehicle_id);


CREATE TABLE vehicle_mood_scores (
  id                    BIGSERIAL PRIMARY KEY,
  vehicle_id            BIGINT NOT NULL REFERENCES vehicles(id),
  owner_id              BIGINT NOT NULL REFERENCES users(id),
  mood_score            DECIMAL(5,2) NOT NULL,
  mood_status           VARCHAR(20),   -- EXCELLENT/HAPPY/NEUTRAL/UNHAPPY/STRESSED/CRITICAL
  engine_score          DECIMAL(5,2),
  tyre_score            DECIMAL(5,2),
  battery_score         DECIMAL(5,2),
  brake_score           DECIMAL(5,2),
  fuel_system_score     DECIMAL(5,2),
  suspension_score      DECIMAL(5,2),
  electrical_score      DECIMAL(5,2),
  weather_factor        DECIMAL(5,2),
  usage_factor          DECIMAL(5,2),
  environmental_factor  DECIMAL(5,2),
  ai_recommendation     TEXT,
  trip_recommendation   TEXT,
  recorded_date         DATE NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_mood_scores_vehicle ON vehicle_mood_scores(vehicle_id);
CREATE INDEX idx_mood_scores_date    ON vehicle_mood_scores(recorded_date);


CREATE TABLE virtual_consultations (
  id                    BIGSERIAL PRIMARY KEY,
  job_id                BIGINT REFERENCES jobs(id),
  owner_id              BIGINT NOT NULL REFERENCES users(id),
  technician_id         BIGINT NOT NULL REFERENCES technicians(id),
  industry              VARCHAR(20) NOT NULL,
  consultation_type     VARCHAR(20) NOT NULL,   -- QUICK_CHECK/FULL_DIAGNOSIS/EXTENDED
  fee_charged           DECIMAL(10,2),
  fee_deductible        BOOLEAN DEFAULT TRUE,
  call_platform         VARCHAR(20) DEFAULT 'AGORA',
  agora_channel         VARCHAR(100),
  agora_token_owner     TEXT,
  agora_token_tech      TEXT,
  call_status           VARCHAR(20) DEFAULT 'SCHEDULED',
  outcome               VARCHAR(30),            -- FIXED_REMOTELY/VISIT_NEEDED/INCONCLUSIVE
  remote_fix_description TEXT,
  visit_booked_after    BOOLEAN DEFAULT FALSE,
  physical_job_id       BIGINT REFERENCES jobs(id),
  ai_diagnosis_during   TEXT,
  call_recording_url    VARCHAR(500),
  call_highlights_url   VARCHAR(500),
  ai_report_url         VARCHAR(500),
  annotations_data      JSONB DEFAULT '[]',
  screen_shared         BOOLEAN DEFAULT FALSE,
  duration_secs         INT,
  owner_rating          DECIMAL(3,2),
  technician_rating     DECIMAL(3,2),
  scheduled_at          TIMESTAMPTZ,
  started_at            TIMESTAMPTZ,
  ended_at              TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE job_live_streams (
  id                      BIGSERIAL PRIMARY KEY,
  job_id                  BIGINT NOT NULL REFERENCES jobs(id),
  technician_id           BIGINT NOT NULL REFERENCES technicians(id),
  owner_id                BIGINT NOT NULL REFERENCES users(id),
  stream_url              VARCHAR(500),
  recording_url           VARCHAR(500),
  agora_channel           VARCHAR(100),
  stream_status           VARCHAR(20) DEFAULT 'ACTIVE',
  ai_monitoring_enabled   BOOLEAN DEFAULT TRUE,
  ai_alerts_generated     JSONB DEFAULT '[]',
  owner_watched           BOOLEAN DEFAULT FALSE,
  owner_watch_duration_secs INT DEFAULT 0,
  stream_duration_secs    INT DEFAULT 0,
  is_recorded             BOOLEAN DEFAULT FALSE,
  recording_expires_at    TIMESTAMPTZ,
  started_at              TIMESTAMPTZ,
  ended_at                TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE job_negotiations (
  id                      BIGSERIAL PRIMARY KEY,
  job_id                  BIGINT NOT NULL REFERENCES jobs(id),
  owner_id                BIGINT NOT NULL REFERENCES users(id),
  technician_id           BIGINT NOT NULL REFERENCES technicians(id),
  ai_suggested_min        DECIMAL(10,2),
  ai_suggested_max        DECIMAL(10,2),
  owner_offered_price     DECIMAL(10,2),
  technician_asked_price  DECIMAL(10,2),
  negotiation_rounds      JSONB DEFAULT '[]',
  final_agreed_price      DECIMAL(10,2),
  ai_fairness_verdict     VARCHAR(20),          -- FAIR/SLIGHTLY_HIGH/OVERPRICED/UNDERPAID
  status                  VARCHAR(20) DEFAULT 'ONGOING',
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ);


CREATE TABLE nft_transactions (
  id                BIGSERIAL PRIMARY KEY,
  badge_id          BIGINT NOT NULL REFERENCES technician_badges(id),
  technician_id     BIGINT NOT NULL REFERENCES technicians(id),
  blockchain        VARCHAR(20) DEFAULT 'POLYGON',
  contract_address  VARCHAR(200),
  token_id          VARCHAR(200),
  transaction_hash  VARCHAR(200) UNIQUE,
  wallet_address    VARCHAR(200),
  mint_status       VARCHAR(20) DEFAULT 'PENDING',
  gas_fee           DECIMAL(10,6),
  minted_at         TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE workshop_inventory (
  id                BIGSERIAL PRIMARY KEY,
  technician_id     BIGINT NOT NULL REFERENCES technicians(id),
  part_name         VARCHAR(200) NOT NULL,
  part_number       VARCHAR(100),
  category          VARCHAR(100),
  brand             VARCHAR(100),
  current_stock     INT DEFAULT 0,
  min_stock_level   INT DEFAULT 1,
  unit_cost         DECIMAL(10,2),
  total_value       DECIMAL(10,2),
  last_restocked_at TIMESTAMPTZ,
  reorder_triggered BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ);


CREATE TABLE iot_sensor_readings (
  id              BIGSERIAL PRIMARY KEY,
  device_id       BIGINT NOT NULL REFERENCES devices(id),
  owner_id        BIGINT NOT NULL REFERENCES users(id),
  connection_id   BIGINT REFERENCES smart_home_connections(id),
  sensor_type     VARCHAR(30) NOT NULL,  -- TEMPERATURE/VIBRATION/POWER/SOUND/HUMIDITY
  reading_value   DECIMAL(10,4) NOT NULL,
  reading_unit    VARCHAR(20),
  is_anomaly      BOOLEAN DEFAULT FALSE,
  anomaly_score   DECIMAL(5,2),
  recorded_at     TIMESTAMPTZ NOT NULL);

CREATE INDEX idx_iot_device ON iot_sensor_readings(device_id);
CREATE INDEX idx_iot_anomaly ON iot_sensor_readings(is_anomaly);


CREATE TABLE carbon_credits (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id),
  user_type       VARCHAR(20) NOT NULL,
  credit_type     VARCHAR(30) NOT NULL,  -- REPAIR_INSTEAD_REPLACE/REFURBISHED/ECO_DISPOSAL
  credits_earned  DECIMAL(8,2) NOT NULL,
  credits_balance DECIMAL(8,2) NOT NULL,
  credits_redeemed DECIMAL(8,2) DEFAULT 0.00,
  job_id          BIGINT REFERENCES jobs(id),
  device_id       BIGINT REFERENCES devices(id),
  co2_saved_kg    DECIMAL(8,2),
  created_at      TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE auction_bonus_history (
  id                    BIGSERIAL PRIMARY KEY,
  auction_id            BIGINT NOT NULL REFERENCES job_auction(id),
  previous_bonus        DECIMAL(10,2),
  new_bonus             DECIMAL(10,2) NOT NULL,
  increment_reason      VARCHAR(30),  -- TIME_ELAPSED/NO_TAKERS/MANUAL_BOOST
  technicians_notified_count INT DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE tamper_proof_verifications (
  id                BIGSERIAL PRIMARY KEY,
  entity_type       VARCHAR(30) NOT NULL,  -- JOB/INVOICE/SCAN/CERTIFICATE
  entity_id         BIGINT NOT NULL,
  hash_value        VARCHAR(64) NOT NULL,
  verification_status VARCHAR(20) NOT NULL, -- VALID/TAMPERED/UNKNOWN
  verified_by_id    BIGINT,
  verified_by_type  VARCHAR(20),
  verified_at       TIMESTAMPTZ DEFAULT NOW(),
  ip_address        VARCHAR(45));


CREATE TABLE app_versions (
  id                    BIGSERIAL PRIMARY KEY,
  platform              VARCHAR(20) NOT NULL,  -- ANDROID/IOS/WEB
  app_type              VARCHAR(20) NOT NULL,  -- OWNER/TECHNICIAN/ADMIN
  version_number        VARCHAR(20) NOT NULL,
  version_code          INT,
  release_notes         JSONB,                 -- multilingual
  is_force_update       BOOLEAN DEFAULT FALSE,
  min_supported_version VARCHAR(20),
  download_url          VARCHAR(500),
  is_active             BOOLEAN DEFAULT TRUE,
  released_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE referral_campaigns (
  id                  BIGSERIAL PRIMARY KEY,
  campaign_name       VARCHAR(100) NOT NULL,
  campaign_type       VARCHAR(30) NOT NULL,
  referrer_reward     DECIMAL(8,2) NOT NULL,
  referred_reward     DECIMAL(8,2) NOT NULL,
  total_referrals     INT DEFAULT 0,
  total_conversions   INT DEFAULT 0,
  total_rewards_paid  DECIMAL(12,2) DEFAULT 0.00,
  is_active           BOOLEAN DEFAULT TRUE,
  start_date          DATE NOT NULL,
  end_date            DATE,
  created_at          TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE platform_health_scores (
  id                      BIGSERIAL PRIMARY KEY,
  health_score            DECIMAL(5,2) NOT NULL,
  active_tech_ratio       DECIMAL(5,2),
  job_success_rate        DECIMAL(5,2),
  dispute_rate            DECIMAL(5,2),
  ai_accuracy_rate        DECIMAL(5,2),
  avg_response_time_secs  INT,
  payment_success_rate    DECIMAL(5,2),
  app_crash_rate          DECIMAL(5,2),
  epidemic_count          INT DEFAULT 0,
  silent_killer_alerts    INT DEFAULT 0,
  carbon_credits_issued   DECIMAL(8,2) DEFAULT 0.00,
  wiki_articles_added     INT DEFAULT 0,
  nft_badges_minted       INT DEFAULT 0,
  status                  VARCHAR(20),   -- EXCELLENT/GOOD/FAIR/POOR
  alerts_generated        JSONB DEFAULT '[]',
  recorded_at             TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE vehicle_scan_details (
  id                BIGSERIAL PRIMARY KEY,
  scan_id           BIGINT NOT NULL REFERENCES pre_purchase_scans(id),
  inspection_area   VARCHAR(30) NOT NULL,  -- BODY_PAINT/ENGINE/ELECTRICAL/CHASSIS
  findings          JSONB,
  photos_taken      JSONB DEFAULT '[]',
  ai_analysis_result TEXT,
  severity          VARCHAR(20),           -- PASS/MINOR/MAJOR/FAIL
  recommendation    TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE rate_limit_logs (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT,
  user_type       VARCHAR(20),
  ip_address      VARCHAR(45) NOT NULL,
  endpoint        VARCHAR(200),
  limit_type      VARCHAR(30),
  requests_count  INT,
  limit_exceeded  BOOLEAN DEFAULT FALSE,
  window_start    TIMESTAMPTZ,
  window_end      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE content_translations (
  id                BIGSERIAL PRIMARY KEY,
  content_type      VARCHAR(50) NOT NULL,   -- FAULT_CATEGORY/AI_DIAGNOSIS/WIKI_ARTICLE
  content_id        BIGINT NOT NULL,
  original_language VARCHAR(10) NOT NULL,
  translated_language VARCHAR(10) NOT NULL,
  original_text     TEXT NOT NULL,
  translated_text   TEXT NOT NULL,
  translation_method VARCHAR(20) DEFAULT 'AI',  -- AI/HUMAN
  is_verified       BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW());

CREATE UNIQUE INDEX uq_translation
  ON content_translations(content_type, content_id, translated_language);

