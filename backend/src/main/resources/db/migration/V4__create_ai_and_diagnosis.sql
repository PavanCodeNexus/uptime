-- V4: AI & Diagnosis Module

CREATE TABLE ai_fault_diagnoses (
  id                  BIGSERIAL PRIMARY KEY,
  job_id              BIGINT UNIQUE NOT NULL REFERENCES jobs(id),
  input_text          TEXT,
  input_language      VARCHAR(10),
  input_media_count   INT DEFAULT 0,
  has_audio           BOOLEAN DEFAULT FALSE,
  has_video           BOOLEAN DEFAULT FALSE,
  fault_category      VARCHAR(100),
  urgency             VARCHAR(20),
  confidence          DECIMAL(5,2),
  estimated_cost_min  DECIMAL(10,2),
  estimated_cost_max  DECIMAL(10,2),
  estimated_time_hrs  DECIMAL(4,1),
  skill_tags          JSONB DEFAULT '[]',
  required_tools      JSONB DEFAULT '[]',
  diagnosis_text      TEXT,
  safety_warnings     JSONB DEFAULT '[]',
  diy_possible        BOOLEAN DEFAULT FALSE,
  diy_instructions    TEXT,
  gemini_model        VARCHAR(50),
  prompt_version      VARCHAR(20),
  tokens_used         INT,
  response_time_ms    INT,
  is_fallback         BOOLEAN DEFAULT FALSE,   -- true if AI failed
  created_at          TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE ai_sound_analyses (
  id                BIGSERIAL PRIMARY KEY,
  job_id            BIGINT REFERENCES jobs(id),
  asset_id          BIGINT,
  asset_type        VARCHAR(30),
  audio_url         VARCHAR(500) NOT NULL,
  duration_secs     INT,
  file_size_bytes   BIGINT,
  fault_type        VARCHAR(100),
  severity          VARCHAR(20),
  confidence        DECIMAL(5,2),
  frequency_anomaly TEXT,
  fft_data          JSONB,                     -- frequency analysis data
  description       TEXT,
  recommended_action TEXT,
  gemini_model      VARCHAR(50),
  tokens_used       INT,
  created_at        TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE ai_image_analyses (
  id                  BIGSERIAL PRIMARY KEY,
  job_id              BIGINT REFERENCES jobs(id),
  job_media_id        BIGINT REFERENCES job_media(id),
  image_url           VARCHAR(500) NOT NULL,
  analysis_purpose    VARCHAR(30),             -- FAULT/CHECKLIST_VERIFY/PRE_PURCHASE
  damage_type         VARCHAR(100),
  severity            VARCHAR(20),
  confidence          DECIMAL(5,2),
  affected_components JSONB DEFAULT '[]',
  bounding_boxes      JSONB DEFAULT '[]',      -- annotation coordinates
  description         TEXT,
  requires_immediate_attention BOOLEAN DEFAULT FALSE,
  tokens_used         INT,
  created_at          TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE digital_twins (
  id                BIGSERIAL PRIMARY KEY,
  asset_id          BIGINT NOT NULL,
  asset_type        VARCHAR(20) NOT NULL,      -- MACHINE/VEHICLE/DEVICE
  owner_id          BIGINT NOT NULL REFERENCES users(id),
  health_score      DECIMAL(5,2) DEFAULT 100.00,
  health_status     VARCHAR(20) DEFAULT 'EXCELLENT',
  total_repairs     INT DEFAULT 0,
  total_repair_cost DECIMAL(12,2) DEFAULT 0.00,
  total_downtime_hrs DECIMAL(10,2) DEFAULT 0.00,
  last_updated_at   TIMESTAMPTZ DEFAULT NOW(),
  created_at        TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_twins_asset ON digital_twins(asset_id, asset_type);
CREATE INDEX idx_twins_owner ON digital_twins(owner_id);


CREATE TABLE digital_twin_components (
  id              BIGSERIAL PRIMARY KEY,
  twin_id         BIGINT NOT NULL REFERENCES digital_twins(id),
  component_name  VARCHAR(100) NOT NULL,
  component_type  VARCHAR(50),
  health_score    DECIMAL(5,2) DEFAULT 100.00,
  last_replaced_at TIMESTAMPTZ,
  estimated_life_months INT,
  months_remaining INT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ);

CREATE INDEX idx_twin_components_twin ON digital_twin_components(twin_id);


CREATE TABLE repair_predictions (
  id                    BIGSERIAL PRIMARY KEY,
  twin_id               BIGINT NOT NULL REFERENCES digital_twins(id),
  asset_id              BIGINT NOT NULL,
  asset_type            VARCHAR(20) NOT NULL,
  owner_id              BIGINT NOT NULL REFERENCES users(id),
  predicted_fault       VARCHAR(100) NOT NULL,
  probability           DECIMAL(5,2) NOT NULL,
  predicted_date        DATE,
  estimated_cost        DECIMAL(10,2),
  recommended_action    TEXT,
  is_notified           BOOLEAN DEFAULT FALSE,
  notified_at           TIMESTAMPTZ,
  is_resolved           BOOLEAN DEFAULT FALSE,
  resolved_job_id       BIGINT REFERENCES jobs(id),
  gemini_model          VARCHAR(50),
  prompt_version        VARCHAR(20),
  created_at            TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_predictions_twin ON repair_predictions(twin_id);
CREATE INDEX idx_predictions_owner ON repair_predictions(owner_id);
CREATE INDEX idx_predictions_date ON repair_predictions(predicted_date);


CREATE TABLE ai_copilot_sessions (
  id                BIGSERIAL PRIMARY KEY,
  job_id            BIGINT UNIQUE NOT NULL REFERENCES jobs(id),
  technician_id     BIGINT NOT NULL REFERENCES technicians(id),
  fault_category    VARCHAR(100),
  total_steps       INT DEFAULT 0,
  completed_steps   INT DEFAULT 0,
  current_step      INT DEFAULT 1,
  is_complete       BOOLEAN DEFAULT FALSE,
  started_at        TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE ai_copilot_steps (
  id              BIGSERIAL PRIMARY KEY,
  session_id      BIGINT NOT NULL REFERENCES ai_copilot_sessions(id),
  step_number     INT NOT NULL,
  title           VARCHAR(200) NOT NULL,
  instruction     TEXT NOT NULL,
  safety_warning  TEXT,
  tool_needed     VARCHAR(100),
  expected_result TEXT,
  photo_required  BOOLEAN DEFAULT FALSE,
  photo_url       VARCHAR(500),
  ai_verified     BOOLEAN DEFAULT FALSE,
  ai_verify_score DECIMAL(5,2),
  is_completed    BOOLEAN DEFAULT FALSE,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_copilot_steps_session ON ai_copilot_steps(session_id);


CREATE TABLE epidemic_detections (
  id                  BIGSERIAL PRIMARY KEY,
  device_brand        VARCHAR(100),
  device_model        VARCHAR(200),
  fault_category      VARCHAR(100) NOT NULL,
  industry            VARCHAR(20),
  affected_count      INT NOT NULL,
  detection_window_hrs INT DEFAULT 24,
  severity            VARCHAR(20),
  fault_pattern       TEXT,
  is_active           BOOLEAN DEFAULT TRUE,
  manufacturer_notified BOOLEAN DEFAULT FALSE,
  manufacturer_notified_at TIMESTAMPTZ,
  admin_alerted       BOOLEAN DEFAULT FALSE,
  resolution_notes    TEXT,
  resolved_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE epidemic_affected_users (
  id              BIGSERIAL PRIMARY KEY,
  epidemic_id     BIGINT NOT NULL REFERENCES epidemic_detections(id),
  user_id         BIGINT NOT NULL REFERENCES users(id),
  job_id          BIGINT REFERENCES jobs(id),
  notified        BOOLEAN DEFAULT FALSE,
  notified_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE silent_killer_alerts (
  id              BIGSERIAL PRIMARY KEY,
  device_id       BIGINT,
  owner_id        BIGINT NOT NULL REFERENCES users(id),
  hazard_type     VARCHAR(50) NOT NULL,     -- GAS_LEAK/ELECTRICAL/RADIATION/CO/FIRE
  severity        VARCHAR(20) NOT NULL,     -- LOW/MEDIUM/HIGH/CRITICAL
  confidence      DECIMAL(5,2),
  description     TEXT,
  immediate_action TEXT,
  sensor_data     JSONB,
  is_resolved     BOOLEAN DEFAULT FALSE,
  owner_notified  BOOLEAN DEFAULT FALSE,
  notified_at     TIMESTAMPTZ,
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE ai_prompt_versions (
  id              BIGSERIAL PRIMARY KEY,
  prompt_name     VARCHAR(100) NOT NULL,
  version         VARCHAR(20) NOT NULL,
  prompt_text     TEXT NOT NULL,
  is_active       BOOLEAN DEFAULT TRUE,
  performance_score DECIMAL(5,2),
  notes           TEXT,
  created_by      BIGINT,
  created_at      TIMESTAMPTZ DEFAULT NOW());

CREATE UNIQUE INDEX uq_prompt_version ON ai_prompt_versions(prompt_name, version);

