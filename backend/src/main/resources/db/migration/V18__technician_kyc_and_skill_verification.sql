-- V18__technician_kyc_and_skill_verification.sql

ALTER TABLE technicians
  ADD COLUMN IF NOT EXISTS verification_level  SMALLINT    NOT NULL DEFAULT 0,   -- 0..3
  ADD COLUMN IF NOT EXISTS is_provisional      BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS identity_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS kyc_status          VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED';
  -- kyc_status: NOT_STARTED | IN_PROGRESS | UNDER_REVIEW | VERIFIED | REJECTED | SUSPENDED

ALTER TABLE technician_documents
  ADD COLUMN IF NOT EXISTS doc_category          VARCHAR(20),   -- IDENTITY | SKILL | LICENCE | BUSINESS | BACKGROUND | BANK
  ADD COLUMN IF NOT EXISTS status                VARCHAR(20) NOT NULL DEFAULT 'UPLOADED',
                                                               -- UPLOADED | UNDER_REVIEW | APPROVED | REJECTED | EXPIRED | DELETED
  ADD COLUMN IF NOT EXISTS issuer                VARCHAR(200),
  ADD COLUMN IF NOT EXISTS document_number_masked VARCHAR(40),
  ADD COLUMN IF NOT EXISTS expires_at            DATE,
  ADD COLUMN IF NOT EXISTS reviewed_by           BIGINT,
  ADD COLUMN IF NOT EXISTS reviewed_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason_code VARCHAR(30),
  ADD COLUMN IF NOT EXISTS storage_ref           VARCHAR(300),  -- private storage key, NOT a public URL
  ADD COLUMN IF NOT EXISTS delete_after          TIMESTAMPTZ;   -- auto-purge date for raw ID images

CREATE TABLE technician_identity_verifications (
  id                   BIGSERIAL PRIMARY KEY,
  technician_id        BIGINT       NOT NULL REFERENCES technicians(id),
  method               VARCHAR(30)  NOT NULL,   -- AADHAAR_QR | AADHAAR_OFFLINE_EKYC | DIGILOCKER | PARTNER_API | MOCK | MANUAL_ADMIN
  provider             VARCHAR(40),
  provider_reference   VARCHAR(100),
  aadhaar_last4        CHAR(4),
  name_on_id           VARCHAR(200),
  name_match_score     DECIMAL(5,2),
  year_of_birth        SMALLINT,
  is_adult             BOOLEAN,
  status               VARCHAR(20)  NOT NULL DEFAULT 'PENDING',  -- PENDING | VERIFIED | UNDER_REVIEW | FAILED
  failure_reason       VARCHAR(200),
  consent_text_version VARCHAR(20)  NOT NULL,
  consent_at           TIMESTAMPTZ  NOT NULL,
  consent_ip           VARCHAR(45),
  verified_at          TIMESTAMPTZ,
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ
);
CREATE INDEX idx_tiv_technician ON technician_identity_verifications(technician_id);

CREATE TABLE technician_face_checks (
  id                       BIGSERIAL PRIMARY KEY,
  technician_id            BIGINT      NOT NULL REFERENCES technicians(id),
  identity_verification_id BIGINT      REFERENCES technician_identity_verifications(id),
  engine                   VARCHAR(30) NOT NULL,         -- MOCK | REKOGNITION | MANUAL
  face_match_score         DECIMAL(5,2),
  liveness_passed          BOOLEAN,
  result                   VARCHAR(10) NOT NULL,         -- PASS | REVIEW | FAIL
  duplicate_of_technician  BIGINT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_tfc_technician ON technician_face_checks(technician_id);

CREATE TABLE technician_skill_verifications (
  id            BIGSERIAL PRIMARY KEY,
  technician_id BIGINT      NOT NULL REFERENCES technicians(id),
  trade_code    VARCHAR(60) NOT NULL,                    -- UPTIME skill tag, e.g. cnc_machine_repair
  evidence_type VARCHAR(30) NOT NULL,                    -- ITI_NCVT | NSDC | OEM_TRAINING | DIPLOMA_DEGREE | EXPERIENCE_LETTER | BUSINESS_PROOF | LICENCE | SKILL_TEST | REFERENCE
  document_id   BIGINT      REFERENCES technician_documents(id),
  status        VARCHAR(20) NOT NULL DEFAULT 'PENDING',  -- PENDING | VERIFIED | REJECTED | EXPIRED | REVOKED
  level_granted SMALLINT,                                -- 2 or 3
  verified_by   BIGINT,
  verified_at   TIMESTAMPTZ,
  expires_at    DATE,
  notes         VARCHAR(500),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ
);
CREATE INDEX idx_tsv_technician_trade ON technician_skill_verifications(technician_id, trade_code);
CREATE INDEX idx_tsv_expiry ON technician_skill_verifications(expires_at) WHERE status = 'VERIFIED';

CREATE TABLE technician_skill_tests (
  id            BIGSERIAL PRIMARY KEY,
  technician_id BIGINT      NOT NULL REFERENCES technicians(id),
  trade_code    VARCHAR(60) NOT NULL,
  attempt_no    SMALLINT    NOT NULL,
  questions     JSONB       NOT NULL,
  answers       JSONB,
  score         DECIMAL(5,2),
  passed        BOOLEAN,
  practical_video_ref VARCHAR(300),
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at  TIMESTAMPTZ,
  cooldown_until TIMESTAMPTZ
);
CREATE INDEX idx_tst_technician_trade ON technician_skill_tests(technician_id, trade_code);

CREATE TABLE technician_references (
  id            BIGSERIAL PRIMARY KEY,
  technician_id BIGINT       NOT NULL REFERENCES technicians(id),
  ref_name      VARCHAR(150) NOT NULL,
  ref_phone     VARCHAR(15)  NOT NULL,
  relationship  VARCHAR(20)  NOT NULL,                   -- EMPLOYER | CUSTOMER | WORKSHOP_OWNER | COLLEAGUE
  organisation  VARCHAR(200),
  status        VARCHAR(20)  NOT NULL DEFAULT 'PENDING', -- PENDING | CONFIRMED | UNREACHABLE | NEGATIVE
  checked_by    BIGINT,
  checked_at    TIMESTAMPTZ,
  notes         VARCHAR(500),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_tref_technician ON technician_references(technician_id);

CREATE TABLE trade_license_requirements (
  id            BIGSERIAL PRIMARY KEY,
  trade_code    VARCHAR(60)  NOT NULL,
  license_type  VARCHAR(60)  NOT NULL,
  is_mandatory  BOOLEAN      NOT NULL DEFAULT TRUE,
  notes         VARCHAR(300),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX uq_tlr_trade_license ON trade_license_requirements(trade_code, license_type);
-- Seed from Section 3.3 in V17 (or V18b).

