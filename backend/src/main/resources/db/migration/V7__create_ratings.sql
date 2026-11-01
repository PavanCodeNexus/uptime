-- V7: Ratings & Trust Module

CREATE TABLE job_ratings (
  id                  BIGSERIAL PRIMARY KEY,
  job_id              BIGINT NOT NULL REFERENCES jobs(id),
  owner_id            BIGINT NOT NULL REFERENCES users(id),
  technician_id       BIGINT NOT NULL REFERENCES technicians(id),
  technician_rating   DECIMAL(3,2),         -- Owner rates tech (1–5)
  owner_rating        DECIMAL(3,2),         -- Tech rates owner (1–5)
  tech_review_text    TEXT,
  owner_review_text   TEXT,
  owner_rated_at      TIMESTAMPTZ,
  tech_rated_at       TIMESTAMPTZ,
  is_blind            BOOLEAN DEFAULT TRUE,  -- Hidden until both submit
  is_published        BOOLEAN DEFAULT FALSE,
  is_reported         BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_ratings_job ON job_ratings(job_id);
CREATE INDEX idx_ratings_tech ON job_ratings(technician_id);
CREATE UNIQUE INDEX uq_rating_job ON job_ratings(job_id);


CREATE TABLE rating_categories (
  id              BIGSERIAL PRIMARY KEY,
  job_rating_id   BIGINT NOT NULL REFERENCES job_ratings(id),
  category        VARCHAR(50) NOT NULL,   -- PUNCTUALITY/QUALITY/BEHAVIOUR/CLEANLINESS
  score           DECIMAL(3,2) NOT NULL,
  rated_by        VARCHAR(20) NOT NULL,   -- OWNER/TECHNICIAN
  created_at      TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE technician_trust_scores (
  id                    BIGSERIAL PRIMARY KEY,
  technician_id         BIGINT UNIQUE NOT NULL REFERENCES technicians(id),
  overall_score         DECIMAL(5,2) DEFAULT 100.00,
  quality_score         DECIMAL(5,2) DEFAULT 100.00,
  punctuality_score     DECIMAL(5,2) DEFAULT 100.00,
  behaviour_score       DECIMAL(5,2) DEFAULT 100.00,
  dispute_penalty       DECIMAL(5,2) DEFAULT 0.00,
  fraud_penalty         DECIMAL(5,2) DEFAULT 0.00,
  ratings_count         INT DEFAULT 0,
  last_calculated_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ);


CREATE TABLE owner_trust_scores (
  id                BIGSERIAL PRIMARY KEY,
  owner_id          BIGINT UNIQUE NOT NULL REFERENCES users(id),
  overall_score     DECIMAL(5,2) DEFAULT 100.00,
  payment_score     DECIMAL(5,2) DEFAULT 100.00,
  behaviour_score   DECIMAL(5,2) DEFAULT 100.00,
  cancellation_penalty DECIMAL(5,2) DEFAULT 0.00,
  dispute_penalty   DECIMAL(5,2) DEFAULT 0.00,
  ratings_count     INT DEFAULT 0,
  updated_at        TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE platform_nps (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id),
  user_type       VARCHAR(20) NOT NULL,
  score           INT NOT NULL,           -- 0–10
  category        VARCHAR(20),           -- PROMOTER/PASSIVE/DETRACTOR
  feedback        TEXT,
  trigger_event   VARCHAR(50),           -- AFTER_JOB/MONTHLY/QUARTERLY
  job_id          BIGINT REFERENCES jobs(id),
  created_at      TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE review_reports (
  id              BIGSERIAL PRIMARY KEY,
  rating_id       BIGINT NOT NULL REFERENCES job_ratings(id),
  reported_by     BIGINT NOT NULL,
  reported_by_type VARCHAR(20),
  reason          VARCHAR(50),
  description     TEXT,
  status          VARCHAR(20) DEFAULT 'PENDING',
  resolved_by     BIGINT,
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE rating_analytics (
  id                  BIGSERIAL PRIMARY KEY,
  period_type         VARCHAR(20) NOT NULL,  -- DAILY/WEEKLY/MONTHLY
  period_start        DATE NOT NULL,
  industry            VARCHAR(20),
  avg_tech_rating     DECIMAL(3,2),
  avg_owner_rating    DECIMAL(3,2),
  total_ratings       INT DEFAULT 0,
  five_star_count     INT DEFAULT 0,
  one_star_count      INT DEFAULT 0,
  dispute_rate        DECIMAL(5,2),
  created_at          TIMESTAMPTZ DEFAULT NOW());

