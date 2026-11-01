-- V2: Technicians Module

CREATE TABLE technicians (
  id                      BIGSERIAL PRIMARY KEY,
  user_id                 BIGINT UNIQUE NOT NULL REFERENCES users(id),
  full_name               VARCHAR(100) NOT NULL,
  phone                   VARCHAR(15) NOT NULL,
  profile_photo_url       VARCHAR(500),
  industry_type           VARCHAR(20) NOT NULL,    -- INDUSTRIAL/AUTOMOBILE/ELECTRONICS/ALL
  experience_years        DECIMAL(4,1),
  bio                     TEXT,
  aadhaar_number_masked   VARCHAR(20),             -- Last 4 digits only
  is_available            BOOLEAN DEFAULT FALSE,
  verification_status     VARCHAR(20) DEFAULT 'PENDING',
  rating_avg              DECIMAL(3,2) DEFAULT 0.00,
  total_jobs_completed    INT DEFAULT 0,
  wallet_balance          DECIMAL(12,2) DEFAULT 0.00,
  preferred_language      VARCHAR(10) DEFAULT 'en',
  fatigue_score           DECIMAL(5,2) DEFAULT 0.00,
  is_fatigue_restricted   BOOLEAN DEFAULT FALSE,
  green_points_balance    INT DEFAULT 0,
  gst_number              VARCHAR(20),
  pan_number_masked       VARCHAR(15),
  avg_response_time_secs  INT,
  is_workshop_owner       BOOLEAN DEFAULT FALSE,
  workshop_name           VARCHAR(200),
  is_active               BOOLEAN DEFAULT TRUE,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ,
  deleted_at              TIMESTAMPTZ);

CREATE INDEX idx_technicians_user_id ON technicians(user_id);
CREATE INDEX idx_technicians_industry ON technicians(industry_type);
CREATE INDEX idx_technicians_available ON technicians(is_available);
CREATE INDEX idx_technicians_rating ON technicians(rating_avg);
CREATE INDEX idx_technicians_status ON technicians(verification_status);


CREATE TABLE technician_skills (
  id                BIGSERIAL PRIMARY KEY,
  technician_id     BIGINT NOT NULL REFERENCES technicians(id),
  skill_category    VARCHAR(100) NOT NULL,     -- e.g. motor_repair
  skill_name        VARCHAR(100) NOT NULL,
  proficiency       VARCHAR(20) DEFAULT 'INTERMEDIATE', -- BEGINNER/INTERMEDIATE/EXPERT
  years_experience  DECIMAL(4,1),
  is_certified      BOOLEAN DEFAULT FALSE,
  certificate_url   VARCHAR(500),
  created_at        TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_tech_skills_tech_id ON technician_skills(technician_id);
CREATE INDEX idx_tech_skills_category ON technician_skills(skill_category);


CREATE TABLE technician_documents (
  id              BIGSERIAL PRIMARY KEY,
  technician_id   BIGINT NOT NULL REFERENCES technicians(id),
  document_type   VARCHAR(30) NOT NULL,    -- AADHAAR/PAN/CERTIFICATE/PHOTO/GST
  document_url    VARCHAR(500) NOT NULL,
  document_number VARCHAR(100),
  is_verified     BOOLEAN DEFAULT FALSE,
  verified_by     BIGINT,
  verified_at     TIMESTAMPTZ,
  rejection_reason TEXT,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_tech_docs_tech_id ON technician_documents(technician_id);
CREATE INDEX idx_tech_docs_type ON technician_documents(document_type);


CREATE TABLE technician_verification (
  id                    BIGSERIAL PRIMARY KEY,
  technician_id         BIGINT UNIQUE NOT NULL REFERENCES technicians(id),
  submitted_at          TIMESTAMPTZ,
  reviewed_at           TIMESTAMPTZ,
  reviewed_by           BIGINT,
  status                VARCHAR(20) DEFAULT 'PENDING',
  aadhaar_verified      BOOLEAN DEFAULT FALSE,
  face_match_score      DECIMAL(5,2),
  background_check      VARCHAR(20) DEFAULT 'PENDING',
  rejection_reason      TEXT,
  resubmission_count    INT DEFAULT 0,
  approved_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ);


CREATE TABLE technician_locations (
  id                BIGSERIAL PRIMARY KEY,
  technician_id     BIGINT UNIQUE NOT NULL REFERENCES technicians(id),
  current_location  geography(POINT, 4326) NOT NULL,
  city              VARCHAR(100),
  state             VARCHAR(100),
  accuracy_meters   DECIMAL(8,2),
  speed_kmph        DECIMAL(6,2),
  heading_degrees   DECIMAL(6,2),
  battery_level     INT,
  updated_at        TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_tech_loc_tech_id ON technician_locations(technician_id);
CREATE INDEX idx_tech_loc_location ON technician_locations USING GIST(current_location);


CREATE TABLE technician_availability (
  id                BIGSERIAL PRIMARY KEY,
  technician_id     BIGINT NOT NULL REFERENCES technicians(id),
  day_of_week       INT NOT NULL,            -- 0=Sunday, 6=Saturday
  start_time        TIME NOT NULL,
  end_time          TIME NOT NULL,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_tech_avail_tech_id ON technician_availability(technician_id);


CREATE TABLE technician_service_areas (
  id              BIGSERIAL PRIMARY KEY,
  technician_id   BIGINT NOT NULL REFERENCES technicians(id),
  center_location geography(POINT, 4326),
  radius_km       DECIMAL(6,2) DEFAULT 10.00,
  city            VARCHAR(100),
  pincode         VARCHAR(10),
  is_primary      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_tech_areas_tech_id ON technician_service_areas(technician_id);
CREATE INDEX idx_tech_areas_location ON technician_service_areas USING GIST(center_location);


CREATE TABLE technician_statistics (
  id                      BIGSERIAL PRIMARY KEY,
  technician_id           BIGINT UNIQUE NOT NULL REFERENCES technicians(id),
  total_jobs              INT DEFAULT 0,
  total_earnings          DECIMAL(12,2) DEFAULT 0.00,
  total_distance_km       DECIMAL(10,2) DEFAULT 0.00,
  avg_job_duration_mins   INT DEFAULT 0,
  jobs_this_month         INT DEFAULT 0,
  earnings_this_month     DECIMAL(10,2) DEFAULT 0.00,
  jobs_this_week          INT DEFAULT 0,
  acceptance_rate         DECIMAL(5,2) DEFAULT 0.00,
  completion_rate         DECIMAL(5,2) DEFAULT 0.00,
  on_time_arrival_rate    DECIMAL(5,2) DEFAULT 0.00,
  last_job_at             TIMESTAMPTZ,
  updated_at              TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE technician_badges (
  id                BIGSERIAL PRIMARY KEY,
  technician_id     BIGINT NOT NULL REFERENCES technicians(id),
  badge_name        VARCHAR(100) NOT NULL,
  badge_type        VARCHAR(50) NOT NULL,    -- SKILL/MILESTONE/SPECIAL/NFT
  badge_icon_url    VARCHAR(500),
  description       TEXT,
  industry          VARCHAR(20),
  earned_at         TIMESTAMPTZ NOT NULL,
  jobs_required     INT,
  jobs_at_earn      INT,
  nft_token_id      VARCHAR(200),            -- Polygon NFT token ID
  nft_contract      VARCHAR(200),
  nft_tx_hash       VARCHAR(200),
  nft_mint_status   VARCHAR(20) DEFAULT 'PENDING',
  created_at        TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_badges_tech_id ON technician_badges(technician_id);
CREATE INDEX idx_badges_type ON technician_badges(badge_type);


CREATE TABLE technician_bank_accounts (
  id                    BIGSERIAL PRIMARY KEY,
  technician_id         BIGINT NOT NULL REFERENCES technicians(id),
  account_holder_name   VARCHAR(100) NOT NULL,
  account_number_encrypted TEXT NOT NULL,   -- AES-256 encrypted
  ifsc_code             VARCHAR(15) NOT NULL,
  bank_name             VARCHAR(100),
  account_type          VARCHAR(20) DEFAULT 'SAVINGS',
  upi_id                VARCHAR(100),
  razorpay_fund_account_id VARCHAR(100),    -- Razorpay payout reference
  is_verified           BOOLEAN DEFAULT FALSE,
  is_primary            BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ);

CREATE INDEX idx_bank_tech_id ON technician_bank_accounts(technician_id);

