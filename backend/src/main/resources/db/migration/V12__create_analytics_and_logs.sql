-- V12: Analytics & Logs Module

CREATE TABLE platform_analytics (
  id            BIGSERIAL PRIMARY KEY,
  date          DATE NOT NULL,
  industry      VARCHAR(20) NOT NULL,
  city          VARCHAR(100),
  metric_type   VARCHAR(50) NOT NULL,
  metric_value  DECIMAL(15,2) NOT NULL,
  period_type   VARCHAR(20) NOT NULL,    -- DAILY/WEEKLY/MONTHLY
  created_at    TIMESTAMPTZ DEFAULT NOW());

CREATE UNIQUE INDEX uq_platform_analytics
  ON platform_analytics(date, industry, city, metric_type, period_type);


CREATE TABLE search_logs (
  id                BIGSERIAL PRIMARY KEY,
  user_id           BIGINT,
  user_type         VARCHAR(20),
  search_query      TEXT NOT NULL,
  search_type       VARCHAR(30) NOT NULL, -- TECHNICIAN/WIKI/PARTS/JOBS
  results_count     INT DEFAULT 0,
  clicked_result_id BIGINT,
  platform          VARCHAR(20) NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_search_logs_type ON search_logs(search_type);
CREATE INDEX idx_search_logs_user ON search_logs(user_id);


CREATE TABLE api_logs (
  id                BIGSERIAL PRIMARY KEY,
  user_id           BIGINT,
  user_type         VARCHAR(20),
  endpoint          VARCHAR(200) NOT NULL,
  method            VARCHAR(10) NOT NULL,
  status_code       SMALLINT NOT NULL,
  request_size_bytes INT,
  response_size_bytes INT,
  response_time_ms  INT,
  ip_address        VARCHAR(45),
  user_agent        VARCHAR(300),
  request_id        VARCHAR(50),
  is_error          BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL) PARTITION BY RANGE (EXTRACT(YEAR FROM created_at));

CREATE INDEX idx_api_logs_endpoint ON api_logs(endpoint);
CREATE INDEX idx_api_logs_error    ON api_logs(is_error);
CREATE INDEX idx_api_logs_created  ON api_logs(created_at);


CREATE TABLE error_logs (
  id            BIGSERIAL PRIMARY KEY,
  error_type    VARCHAR(30) NOT NULL,  -- API/AI/PAYMENT/NOTIFICATION/SYSTEM
  severity      VARCHAR(20) NOT NULL,  -- LOW/MEDIUM/HIGH/CRITICAL
  error_code    VARCHAR(50),
  message       TEXT NOT NULL,
  stack_trace   TEXT,
  context       JSONB,
  user_id       BIGINT,
  endpoint      VARCHAR(200),
  request_id    VARCHAR(50),
  is_resolved   BOOLEAN DEFAULT FALSE,
  resolved_at   TIMESTAMPTZ,
  sentry_id     VARCHAR(100),
  created_at    TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_error_logs_severity ON error_logs(severity);
CREATE INDEX idx_error_logs_type     ON error_logs(error_type);
CREATE INDEX idx_error_logs_resolved ON error_logs(is_resolved);


CREATE TABLE audit_logs (
  id              BIGSERIAL PRIMARY KEY,
  actor_id        BIGINT NOT NULL,
  actor_type      VARCHAR(20) NOT NULL,  -- OWNER/TECHNICIAN/ADMIN/SYSTEM
  action          VARCHAR(100) NOT NULL,
  entity_type     VARCHAR(50) NOT NULL,
  entity_id       BIGINT NOT NULL,
  old_values      JSONB,
  new_values      JSONB,
  ip_address      VARCHAR(45),
  user_agent      VARCHAR(300),
  request_id      VARCHAR(50),
  created_at      TIMESTAMPTZ DEFAULT NOW());
-- Audit logs are IMMUTABLE — trigger prevents UPDATE/DELETE

CREATE INDEX idx_audit_actor    ON audit_logs(actor_id);
CREATE INDEX idx_audit_entity   ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_action   ON audit_logs(action);
CREATE INDEX idx_audit_created  ON audit_logs(created_at);


CREATE TABLE user_activity_logs (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  user_type       VARCHAR(20) NOT NULL,
  activity_type   VARCHAR(50) NOT NULL,
  platform        VARCHAR(20) NOT NULL,
  metadata        JSONB,
  ip_address      VARCHAR(45),
  created_at      TIMESTAMPTZ NOT NULL) PARTITION BY RANGE (EXTRACT(YEAR FROM created_at));

CREATE INDEX idx_activity_user ON user_activity_logs(user_id);
CREATE INDEX idx_activity_type ON user_activity_logs(activity_type);

