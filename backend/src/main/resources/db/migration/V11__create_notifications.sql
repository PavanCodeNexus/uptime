-- V11: Notifications Module

CREATE TABLE notifications (
  id                BIGSERIAL PRIMARY KEY,
  recipient_id      BIGINT NOT NULL,
  recipient_type    VARCHAR(20) NOT NULL,    -- OWNER/TECHNICIAN/ADMIN
  notification_type VARCHAR(50) NOT NULL,
  title             VARCHAR(200) NOT NULL,
  body              TEXT NOT NULL,
  language          VARCHAR(10) DEFAULT 'en',
  data              JSONB DEFAULT '{}',      -- deep link + metadata
  channels_sent     JSONB DEFAULT '[]',      -- [PUSH, SMS, EMAIL]
  is_read           BOOLEAN DEFAULT FALSE,
  is_archived       BOOLEAN DEFAULT FALSE,
  priority          VARCHAR(20) DEFAULT 'NORMAL',
  reference_type    VARCHAR(50),
  reference_id      BIGINT,
  read_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  expires_at        TIMESTAMPTZ);

CREATE INDEX idx_notif_recipient ON notifications(recipient_id, recipient_type);
CREATE INDEX idx_notif_type      ON notifications(notification_type);
CREATE INDEX idx_notif_unread    ON notifications(is_read);
CREATE INDEX idx_notif_created   ON notifications(created_at);


CREATE TABLE notification_templates (
  id                BIGSERIAL PRIMARY KEY,
  template_name     VARCHAR(100) NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  language          VARCHAR(10) NOT NULL,
  channel           VARCHAR(20) NOT NULL,   -- PUSH/EMAIL/SMS/WHATSAPP
  title_template    VARCHAR(200),
  body_template     TEXT NOT NULL,
  email_subject     VARCHAR(200),
  email_html        TEXT,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ);

CREATE UNIQUE INDEX uq_notif_template ON notification_templates(template_name, language, channel);


CREATE TABLE notification_preferences (
  id                  BIGSERIAL PRIMARY KEY,
  user_id             BIGINT NOT NULL,
  user_type           VARCHAR(20) NOT NULL,
  notification_type   VARCHAR(50) NOT NULL,
  push_enabled        BOOLEAN DEFAULT TRUE,
  email_enabled       BOOLEAN DEFAULT TRUE,
  sms_enabled         BOOLEAN DEFAULT FALSE,
  whatsapp_enabled    BOOLEAN DEFAULT FALSE,
  dnd_enabled         BOOLEAN DEFAULT FALSE,
  dnd_start           TIME,
  dnd_end             TIME,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ);

CREATE UNIQUE INDEX uq_notif_pref ON notification_preferences(user_id, notification_type);


CREATE TABLE mass_notifications (
  id                BIGSERIAL PRIMARY KEY,
  title             VARCHAR(200) NOT NULL,
  body              TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  target_audience   VARCHAR(30) NOT NULL,   -- ALL/OWNERS/TECHNICIANS/CITY
  target_industry   VARCHAR(20),
  target_city       VARCHAR(100),
  languages         JSONB DEFAULT '["en"]',
  channels          JSONB DEFAULT '["PUSH"]',
  total_recipients  INT DEFAULT 0,
  delivered_count   INT DEFAULT 0,
  read_count        INT DEFAULT 0,
  status            VARCHAR(20) DEFAULT 'DRAFT',
  scheduled_at      TIMESTAMPTZ,
  sent_at           TIMESTAMPTZ,
  created_by        BIGINT,
  created_at        TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE notification_analytics (
  id                BIGSERIAL PRIMARY KEY,
  notification_type VARCHAR(50) NOT NULL,
  channel           VARCHAR(20) NOT NULL,
  date              DATE NOT NULL,
  sent_count        INT DEFAULT 0,
  delivered_count   INT DEFAULT 0,
  read_count        INT DEFAULT 0,
  click_count       INT DEFAULT 0,
  delivery_rate     DECIMAL(5,2) DEFAULT 0.00,
  open_rate         DECIMAL(5,2) DEFAULT 0.00,
  created_at        TIMESTAMPTZ DEFAULT NOW());

CREATE UNIQUE INDEX uq_notif_analytics ON notification_analytics(notification_type, channel, date);


CREATE TABLE push_delivery_logs (
  id              BIGSERIAL PRIMARY KEY,
  notification_id BIGINT NOT NULL REFERENCES notifications(id),
  device_id       BIGINT REFERENCES user_devices(id),
  fcm_message_id  VARCHAR(200),
  delivery_status VARCHAR(20) DEFAULT 'SENT',  -- SENT/DELIVERED/FAILED/BOUNCED/OPENED
  failure_reason  TEXT,
  sent_at         TIMESTAMPTZ DEFAULT NOW(),
  delivered_at    TIMESTAMPTZ,
  opened_at       TIMESTAMPTZ);

CREATE INDEX idx_push_logs_notif ON push_delivery_logs(notification_id);

