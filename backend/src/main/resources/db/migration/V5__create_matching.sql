-- V5: Matching & Dispatch Module

CREATE TABLE matching_requests (
  id                    BIGSERIAL PRIMARY KEY,
  job_id                BIGINT UNIQUE NOT NULL REFERENCES jobs(id),
  search_radius_km      DECIMAL(6,2) DEFAULT 20.00,
  distance_weight       DECIMAL(3,2) DEFAULT 0.40,
  skill_weight          DECIMAL(3,2) DEFAULT 0.60,
  rating_weight         DECIMAL(3,2) DEFAULT 0.10,
  techs_found           INT DEFAULT 0,
  techs_notified        INT DEFAULT 0,
  techs_declined        INT DEFAULT 0,
  matched_tech_id       BIGINT REFERENCES technicians(id),
  status                VARCHAR(20) DEFAULT 'SEARCHING',
  search_started_at     TIMESTAMPTZ DEFAULT NOW(),
  matched_at            TIMESTAMPTZ,
  timeout_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE matching_scores (
  id              BIGSERIAL PRIMARY KEY,
  job_id          BIGINT NOT NULL REFERENCES jobs(id),
  technician_id   BIGINT NOT NULL REFERENCES technicians(id),
  total_score     DECIMAL(5,2) NOT NULL,
  distance_score  DECIMAL(5,2),
  skill_score     DECIMAL(5,2),
  rating_score    DECIMAL(5,2),
  response_score  DECIMAL(5,2),
  surge_factor    DECIMAL(4,2) DEFAULT 1.00,
  fatigue_penalty DECIMAL(5,2) DEFAULT 0.00,
  distance_km     DECIMAL(6,2),
  eta_mins        INT,
  skill_match_tags JSONB DEFAULT '[]',
  rank_position   INT,
  response        VARCHAR(20) DEFAULT 'PENDING',
  responded_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_match_scores_job ON matching_scores(job_id);
CREATE INDEX idx_match_scores_tech ON matching_scores(technician_id);
CREATE INDEX idx_match_scores_rank ON matching_scores(rank_position);


CREATE TABLE technician_dispatch_history (
  id                BIGSERIAL PRIMARY KEY,
  technician_id     BIGINT NOT NULL REFERENCES technicians(id),
  job_id            BIGINT NOT NULL REFERENCES jobs(id),
  action            VARCHAR(20) NOT NULL,   -- NOTIFIED/ACCEPTED/DECLINED/TIMEOUT
  rank_at_time      INT,
  score_at_time     DECIMAL(5,2),
  surge_applied     BOOLEAN DEFAULT FALSE,
  surge_multiplier  DECIMAL(4,2) DEFAULT 1.00,
  bonus_earned      DECIMAL(10,2) DEFAULT 0.00,
  response_time_secs INT,
  created_at        TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_dispatch_tech ON technician_dispatch_history(technician_id);
CREATE INDEX idx_dispatch_job  ON technician_dispatch_history(job_id);


CREATE TABLE surge_pricing (
  id                  BIGSERIAL PRIMARY KEY,
  city                VARCHAR(100) NOT NULL,
  industry            VARCHAR(20) NOT NULL,
  multiplier          DECIMAL(4,2) NOT NULL DEFAULT 1.00,
  reason              TEXT,
  available_techs     INT,
  active_jobs         INT,
  trigger_threshold   INT DEFAULT 3,        -- techs below this → surge
  is_active           BOOLEAN DEFAULT TRUE,
  started_at          TIMESTAMPTZ DEFAULT NOW(),
  ended_at            TIMESTAMPTZ);


CREATE TABLE live_location_tracking (
  id              BIGSERIAL PRIMARY KEY,
  job_id          BIGINT NOT NULL REFERENCES jobs(id),
  technician_id   BIGINT NOT NULL REFERENCES technicians(id),
  location        geography(POINT, 4326) NOT NULL,
  speed_kmph      DECIMAL(6,2),
  heading_degrees DECIMAL(6,2),
  accuracy_meters DECIMAL(8,2),
  battery_level   INT,
  recorded_at     TIMESTAMPTZ NOT NULL) PARTITION BY RANGE (EXTRACT(MONTH FROM recorded_at));

CREATE INDEX idx_live_tracking_job  ON live_location_tracking(job_id);
CREATE INDEX idx_live_tracking_tech ON live_location_tracking(technician_id);
CREATE INDEX idx_live_tracking_loc  ON live_location_tracking USING GIST(location);


CREATE TABLE job_notifications_sent (
  id              BIGSERIAL PRIMARY KEY,
  job_id          BIGINT NOT NULL REFERENCES jobs(id),
  technician_id   BIGINT NOT NULL REFERENCES technicians(id),
  channel         VARCHAR(20),             -- PUSH/SMS/WEBSOCKET
  sent_at         TIMESTAMPTZ DEFAULT NOW(),
  delivered       BOOLEAN DEFAULT FALSE,
  opened          BOOLEAN DEFAULT FALSE);

