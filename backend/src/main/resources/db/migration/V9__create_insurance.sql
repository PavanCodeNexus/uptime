-- V9: Insurance & Warranty Module

CREATE TABLE insurance_policies (
  id                    BIGSERIAL PRIMARY KEY,
  policy_number         VARCHAR(30) UNIQUE NOT NULL,
  owner_id              BIGINT NOT NULL REFERENCES users(id),
  policy_type           VARCHAR(30) NOT NULL,  -- DEVICE_SHIELD/APPLIANCE_GUARD/JOB_INSURANCE
  industry              VARCHAR(20),
  asset_id              BIGINT,
  asset_type            VARCHAR(30),
  coverage_amount       DECIMAL(12,2) NOT NULL,
  premium_amount        DECIMAL(10,2) NOT NULL,
  premium_cycle         VARCHAR(20),           -- MONTHLY/YEARLY/PER_JOB
  deductible_amount     DECIMAL(10,2) DEFAULT 0.00,
  claims_allowed_per_year INT DEFAULT 2,
  claims_used           INT DEFAULT 0,
  covers_accidental     BOOLEAN DEFAULT TRUE,
  covers_theft          BOOLEAN DEFAULT FALSE,
  covers_liquid         BOOLEAN DEFAULT FALSE,
  covers_breakdown      BOOLEAN DEFAULT TRUE,
  partner_insurer       VARCHAR(100),
  partner_policy_id     VARCHAR(200),
  status                VARCHAR(20) DEFAULT 'ACTIVE',
  start_date            DATE NOT NULL,
  end_date              DATE NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ);


CREATE TABLE insurance_claims (
  id                  BIGSERIAL PRIMARY KEY,
  claim_number        VARCHAR(30) UNIQUE NOT NULL,
  policy_id           BIGINT NOT NULL REFERENCES insurance_policies(id),
  job_id              BIGINT REFERENCES jobs(id),
  owner_id            BIGINT NOT NULL REFERENCES users(id),
  claim_type          VARCHAR(30) NOT NULL,
  description         TEXT NOT NULL,
  incident_date       DATE NOT NULL,
  incident_location   geography(POINT, 4326),
  evidence_urls       JSONB DEFAULT '[]',
  fir_number          VARCHAR(100),
  fir_url             VARCHAR(500),
  claimed_amount      DECIMAL(10,2) NOT NULL,
  approved_amount     DECIMAL(10,2) DEFAULT 0.00,
  ai_assessment       TEXT,
  ai_verdict          VARCHAR(20),            -- VALID/INVALID/SUSPICIOUS
  ai_confidence       DECIMAL(5,2),
  fraud_score         DECIMAL(5,2) DEFAULT 0.00,
  status              VARCHAR(20) DEFAULT 'FILED',
  rejection_reason    TEXT,
  settlement_method   VARCHAR(20),
  settled_at          TIMESTAMPTZ,
  reviewed_by         BIGINT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ);

CREATE INDEX idx_claims_policy ON insurance_claims(policy_id);
CREATE INDEX idx_claims_status ON insurance_claims(status);
CREATE INDEX idx_claims_location ON insurance_claims USING GIST(incident_location);


CREATE TABLE warranties (
  id                BIGSERIAL PRIMARY KEY,
  owner_id          BIGINT NOT NULL REFERENCES users(id),
  device_id         BIGINT REFERENCES devices(id),
  vehicle_id        BIGINT REFERENCES vehicles(id),
  machine_id        BIGINT REFERENCES machines(id),
  warranty_type     VARCHAR(20) NOT NULL,  -- MANUFACTURER/EXTENDED/UPTIME
  product_name      VARCHAR(200) NOT NULL,
  brand             VARCHAR(100) NOT NULL,
  serial_number     VARCHAR(100),
  purchase_date     DATE NOT NULL,
  purchase_amount   DECIMAL(12,2),
  warranty_card_url VARCHAR(500),
  ai_extracted_data JSONB,               -- OCR result
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  coverage_details  TEXT,
  status            VARCHAR(20) DEFAULT 'ACTIVE',
  reminder_30_sent  BOOLEAN DEFAULT FALSE,
  reminder_90_sent  BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ);

CREATE INDEX idx_warranties_owner  ON warranties(owner_id);
CREATE INDEX idx_warranties_end    ON warranties(end_date);
CREATE INDEX idx_warranties_status ON warranties(status);


CREATE TABLE amc_contracts (
  id                  BIGSERIAL PRIMARY KEY,
  contract_number     VARCHAR(30) UNIQUE NOT NULL,
  owner_id            BIGINT NOT NULL REFERENCES users(id),
  device_id           BIGINT REFERENCES devices(id),
  machine_id          BIGINT REFERENCES machines(id),
  provider            VARCHAR(20) NOT NULL, -- UPTIME/MANUFACTURER/THIRD_PARTY
  provider_name       VARCHAR(100),
  plan_name           VARCHAR(100) NOT NULL,
  annual_cost         DECIMAL(10,2) NOT NULL,
  visits_allowed      INT,
  visits_used         INT DEFAULT 0,
  covers_parts        BOOLEAN DEFAULT FALSE,
  covers_labour       BOOLEAN DEFAULT TRUE,
  response_time_hours INT DEFAULT 24,
  status              VARCHAR(20) DEFAULT 'ACTIVE',
  start_date          DATE NOT NULL,
  end_date            DATE NOT NULL,
  auto_renewal        BOOLEAN DEFAULT FALSE,
  renewal_reminder_sent BOOLEAN DEFAULT FALSE,
  contract_url        VARCHAR(500),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ);


CREATE TABLE extended_warranties (
  id                    BIGSERIAL PRIMARY KEY,
  warranty_id           BIGINT NOT NULL REFERENCES warranties(id),
  owner_id              BIGINT NOT NULL REFERENCES users(id),
  provider              VARCHAR(100) NOT NULL,
  plan_name             VARCHAR(100) NOT NULL,
  coverage_amount       DECIMAL(12,2) NOT NULL,
  premium_paid          DECIMAL(10,2) NOT NULL,
  start_date            DATE NOT NULL,
  end_date              DATE NOT NULL,
  status                VARCHAR(20) DEFAULT 'ACTIVE',
  policy_document_url   VARCHAR(500),
  created_at            TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE job_micro_insurance (
  id                    BIGSERIAL PRIMARY KEY,
  job_id                BIGINT UNIQUE NOT NULL REFERENCES jobs(id),
  owner_id              BIGINT NOT NULL REFERENCES users(id),
  technician_id         BIGINT REFERENCES technicians(id),
  coverage_tier         VARCHAR(20) NOT NULL,  -- BASIC/STANDARD/PREMIUM
  coverage_amount       DECIMAL(10,2) NOT NULL,
  premium_amount        DECIMAL(10,2) NOT NULL,
  premium_paid_by       VARCHAR(20),           -- PLATFORM/OWNER
  policy_number         VARCHAR(30) UNIQUE,
  covers_failed_repair  BOOLEAN DEFAULT TRUE,
  covers_damage         BOOLEAN DEFAULT FALSE,
  covers_parts_failure  BOOLEAN DEFAULT TRUE,
  status                VARCHAR(20) DEFAULT 'ACTIVE',
  valid_days            INT DEFAULT 30,
  expires_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW());

