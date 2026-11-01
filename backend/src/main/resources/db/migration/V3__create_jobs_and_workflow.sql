-- V3: Jobs & Workflow Module

CREATE TABLE jobs (
  id                      BIGSERIAL PRIMARY KEY,
  job_number              VARCHAR(20) UNIQUE NOT NULL,  -- UPT-2026-00234
  owner_id                BIGINT NOT NULL REFERENCES users(id),
  technician_id           BIGINT REFERENCES technicians(id),
  industry                VARCHAR(20) NOT NULL,
  asset_id                BIGINT,
  asset_type              VARCHAR(30),                   -- MACHINE/VEHICLE/DEVICE
  status                  VARCHAR(30) DEFAULT 'POSTED',
  urgency                 VARCHAR(20) DEFAULT 'MEDIUM',
  job_type                VARCHAR(30) DEFAULT 'STANDARD', -- STANDARD/EMERGENCY/AUCTION/PREVENTIVE
  owner_location          geography(POINT, 4326) NOT NULL,
  owner_address_text      TEXT,
  fault_description       TEXT,
  fault_media_urls        JSONB DEFAULT '[]',
  ai_fault_category       VARCHAR(100),
  ai_skill_tags           JSONB DEFAULT '[]',
  ai_urgency_override     VARCHAR(20),
  estimated_cost_min      DECIMAL(10,2),
  estimated_cost_max      DECIMAL(10,2),
  final_cost              DECIMAL(10,2),
  labour_cost             DECIMAL(10,2),
  parts_cost              DECIMAL(10,2),
  platform_commission     DECIMAL(10,2),
  gst_amount              DECIMAL(10,2),
  surge_multiplier        DECIMAL(4,2) DEFAULT 1.00,
  surge_pricing_id        BIGINT,
  negotiation_id          BIGINT,
  live_stream_id          BIGINT,
  micro_insurance_id      BIGINT,
  carbon_credit_earned    DECIMAL(6,2) DEFAULT 0.00,
  language_used           VARCHAR(10) DEFAULT 'en',
  scheduled_at            TIMESTAMPTZ,
  accepted_at             TIMESTAMPTZ,
  arrived_at              TIMESTAMPTZ,
  started_at              TIMESTAMPTZ,
  completed_at            TIMESTAMPTZ,
  cancelled_at            TIMESTAMPTZ,
  hash_value              VARCHAR(64),                   -- SHA-256
  is_tamper_proof_locked  BOOLEAN DEFAULT FALSE,
  cancellation_reason     TEXT,
  owner_notes             TEXT,
  tech_notes              TEXT,
  is_rated_by_owner       BOOLEAN DEFAULT FALSE,
  is_rated_by_tech        BOOLEAN DEFAULT FALSE,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ,
  deleted_at              TIMESTAMPTZ);

CREATE INDEX idx_jobs_owner_id ON jobs(owner_id);
CREATE INDEX idx_jobs_technician_id ON jobs(technician_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_industry ON jobs(industry);
CREATE INDEX idx_jobs_created ON jobs(created_at);
CREATE INDEX idx_jobs_location ON jobs USING GIST(owner_location);


CREATE TABLE job_media (
  id              BIGSERIAL PRIMARY KEY,
  job_id          BIGINT NOT NULL REFERENCES jobs(id),
  media_type      VARCHAR(20) NOT NULL,  -- PHOTO/VIDEO/AUDIO/DOCUMENT
  media_stage     VARCHAR(20) NOT NULL,  -- FAULT_REPORT/DURING_REPAIR/BEFORE/AFTER/CERTIFICATE
  url             VARCHAR(500) NOT NULL,
  thumbnail_url   VARCHAR(500),
  file_size_bytes BIGINT,
  duration_secs   INT,                   -- for video/audio
  uploaded_by     BIGINT,
  uploaded_by_type VARCHAR(20),
  cloudinary_id   VARCHAR(200),
  created_at      TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_job_media_job_id ON job_media(job_id);
CREATE INDEX idx_job_media_type ON job_media(media_type);


CREATE TABLE job_status_history (
  id              BIGSERIAL PRIMARY KEY,
  job_id          BIGINT NOT NULL REFERENCES jobs(id),
  from_status     VARCHAR(30),
  to_status       VARCHAR(30) NOT NULL,
  changed_by_id   BIGINT,
  changed_by_type VARCHAR(20),           -- OWNER/TECHNICIAN/ADMIN/SYSTEM
  reason          TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_job_status_hist_job ON job_status_history(job_id);


CREATE TABLE job_checklist (
  id              BIGSERIAL PRIMARY KEY,
  job_id          BIGINT UNIQUE NOT NULL REFERENCES jobs(id),
  template_name   VARCHAR(100),
  total_steps     INT DEFAULT 0,
  completed_steps INT DEFAULT 0,
  is_complete     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ);


CREATE TABLE job_checklist_items (
  id              BIGSERIAL PRIMARY KEY,
  checklist_id    BIGINT NOT NULL REFERENCES job_checklist(id),
  step_number     INT NOT NULL,
  title           VARCHAR(200) NOT NULL,
  instruction     TEXT,
  photo_required  BOOLEAN DEFAULT FALSE,
  photo_url       VARCHAR(500),
  is_completed    BOOLEAN DEFAULT FALSE,
  completed_at    TIMESTAMPTZ,
  ai_verified     BOOLEAN DEFAULT FALSE,
  ai_verify_score DECIMAL(5,2),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_checklist_items_checklist ON job_checklist_items(checklist_id);


CREATE TABLE job_parts_used (
  id              BIGSERIAL PRIMARY KEY,
  job_id          BIGINT NOT NULL REFERENCES jobs(id),
  part_name       VARCHAR(200) NOT NULL,
  part_number     VARCHAR(100),
  brand           VARCHAR(100),
  quality         VARCHAR(20),           -- OEM/COMPATIBLE/REFURBISHED
  quantity        INT DEFAULT 1,
  unit_cost       DECIMAL(10,2),
  total_cost      DECIMAL(10,2),
  warranty_months INT DEFAULT 0,
  warranty_expires_at TIMESTAMPTZ,
  marketplace_product_id BIGINT,
  created_at      TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_parts_job_id ON job_parts_used(job_id);


CREATE TABLE job_timeline (
  id              BIGSERIAL PRIMARY KEY,
  job_id          BIGINT NOT NULL REFERENCES jobs(id),
  event_type      VARCHAR(50) NOT NULL,
  event_title     VARCHAR(200) NOT NULL,
  event_body      TEXT,
  actor_id        BIGINT,
  actor_type      VARCHAR(20),
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_timeline_job_id ON job_timeline(job_id);


CREATE TABLE job_cancellations (
  id              BIGSERIAL PRIMARY KEY,
  job_id          BIGINT UNIQUE NOT NULL REFERENCES jobs(id),
  cancelled_by_id BIGINT NOT NULL,
  cancelled_by_type VARCHAR(20) NOT NULL,
  reason_code     VARCHAR(50),
  reason_text     TEXT,
  cancellation_fee DECIMAL(10,2) DEFAULT 0.00,
  refund_amount   DECIMAL(10,2) DEFAULT 0.00,
  created_at      TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE job_disputes (
  id                BIGSERIAL PRIMARY KEY,
  dispute_number    VARCHAR(20) UNIQUE NOT NULL,
  job_id            BIGINT NOT NULL REFERENCES jobs(id),
  raised_by_id      BIGINT NOT NULL,
  raised_by_type    VARCHAR(20) NOT NULL,
  dispute_type      VARCHAR(50) NOT NULL,    -- QUALITY/OVERCHARGE/NO_SHOW/DAMAGE
  description       TEXT NOT NULL,
  evidence_urls     JSONB DEFAULT '[]',
  claimed_amount    DECIMAL(10,2),
  status            VARCHAR(20) DEFAULT 'OPEN',
  ai_verdict        VARCHAR(20),
  ai_confidence     DECIMAL(5,2),
  admin_verdict     TEXT,
  resolution_amount DECIMAL(10,2),
  resolved_by       BIGINT,
  resolved_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ);

CREATE INDEX idx_disputes_job_id ON job_disputes(job_id);
CREATE INDEX idx_disputes_status ON job_disputes(status);


CREATE TABLE job_auction (
  id                  BIGSERIAL PRIMARY KEY,
  job_id              BIGINT UNIQUE NOT NULL REFERENCES jobs(id),
  base_amount         DECIMAL(10,2) NOT NULL,
  current_bonus       DECIMAL(10,2) DEFAULT 0.00,
  max_bonus           DECIMAL(10,2),
  bonus_increment     DECIMAL(10,2) DEFAULT 50.00,
  increment_every_mins INT DEFAULT 2,
  techs_notified      INT DEFAULT 0,
  techs_competing     INT DEFAULT 0,
  winner_tech_id      BIGINT REFERENCES technicians(id),
  status              VARCHAR(20) DEFAULT 'ACTIVE',
  starts_at           TIMESTAMPTZ NOT NULL,
  ends_at             TIMESTAMPTZ,
  won_at              TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE job_auction_bids (
  id              BIGSERIAL PRIMARY KEY,
  auction_id      BIGINT NOT NULL REFERENCES job_auction(id),
  technician_id   BIGINT NOT NULL REFERENCES technicians(id),
  bid_amount      DECIMAL(10,2) NOT NULL,
  eta_mins        INT,
  distance_km     DECIMAL(6,2),
  status          VARCHAR(20) DEFAULT 'PLACED',
  placed_at       TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_auction_bids_auction ON job_auction_bids(auction_id);
CREATE INDEX idx_auction_bids_tech ON job_auction_bids(technician_id);


CREATE TABLE job_otp_verifications (
  id                      BIGSERIAL PRIMARY KEY,
  job_id                  BIGINT NOT NULL REFERENCES jobs(id),
  otp_hash                VARCHAR(255) NOT NULL,
  technician_location     geography(POINT, 4326),
  owner_location          geography(POINT, 4326),
  distance_meters         DECIMAL(8,2),
  gps_verified            BOOLEAN DEFAULT FALSE,
  gps_match_radius_meters DECIMAL(8,2) DEFAULT 500,
  device_id_verified      BOOLEAN DEFAULT FALSE,
  is_verified             BOOLEAN DEFAULT FALSE,
  verified_at             TIMESTAMPTZ,
  expires_at              TIMESTAMPTZ NOT NULL,
  owner_notified_at       TIMESTAMPTZ,
  owner_notification_channel VARCHAR(20),
  attempt_count           INT DEFAULT 0,
  created_at              TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_otp_verif_job ON job_otp_verifications(job_id);

