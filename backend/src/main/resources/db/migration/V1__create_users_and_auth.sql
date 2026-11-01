-- V1: Users & Auth Module
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id                    BIGSERIAL PRIMARY KEY,
  full_name             VARCHAR(100) NOT NULL,
  email                 VARCHAR(150) UNIQUE,
  phone                 VARCHAR(15)  UNIQUE NOT NULL,
  phone_verified        BOOLEAN DEFAULT FALSE,
  email_verified        BOOLEAN DEFAULT FALSE,
  profile_photo_url     VARCHAR(500),
  date_of_birth         DATE,                         -- age verification (18+)
  gender                VARCHAR(20),
  user_type             VARCHAR(20) DEFAULT 'OWNER',  -- OWNER
  industry_preference   VARCHAR(20),                  -- INDUSTRIAL/AUTOMOBILE/ELECTRONICS
  green_points_balance  INT DEFAULT 0,
  carbon_credits_balance DECIMAL(8,2) DEFAULT 0.00,
  referral_code         VARCHAR(20) UNIQUE,
  referred_by_id        BIGINT REFERENCES users(id),
  nps_last_asked_at     TIMESTAMPTZ,
  preferred_app_version VARCHAR(20),
  is_active             BOOLEAN DEFAULT TRUE,
  is_blocked            BOOLEAN DEFAULT FALSE,
  blocked_reason        TEXT,
  last_login_at         TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ,
  deleted_at            TIMESTAMPTZ);

-- Indexes
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);


CREATE TABLE user_addresses (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id),
  label           VARCHAR(50),                        -- Home, Office, Factory
  address_line1   VARCHAR(200) NOT NULL,
  address_line2   VARCHAR(200),
  city            VARCHAR(100) NOT NULL,
  state           VARCHAR(100) NOT NULL,
  pincode         VARCHAR(10) NOT NULL,
  country         VARCHAR(50) DEFAULT 'India',
  location        geography(POINT, 4326),             -- PostGIS geospatial
  is_default      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ,
  deleted_at      TIMESTAMPTZ);

CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_user_addresses_location ON user_addresses USING GIST(location);


CREATE TABLE user_sessions (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id),
  session_token   VARCHAR(255) UNIQUE NOT NULL,
  device_id       BIGINT,
  ip_address      VARCHAR(45),
  user_agent      VARCHAR(300),
  platform        VARCHAR(20),                        -- WEB/ANDROID/IOS
  is_active       BOOLEAN DEFAULT TRUE,
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  last_used_at    TIMESTAMPTZ);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);


CREATE TABLE otp_verifications (
  id              BIGSERIAL PRIMARY KEY,
  phone           VARCHAR(15) NOT NULL,
  otp_hash        VARCHAR(255) NOT NULL,              -- bcrypt hashed
  purpose         VARCHAR(30) NOT NULL,               -- LOGIN/SIGNUP/ARRIVAL/PAYMENT
  attempt_count   INT DEFAULT 0,
  is_used         BOOLEAN DEFAULT FALSE,
  is_locked       BOOLEAN DEFAULT FALSE,
  locked_until    TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ NOT NULL,
  used_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_otp_phone ON otp_verifications(phone);
CREATE INDEX idx_otp_expires ON otp_verifications(expires_at);


CREATE TABLE refresh_tokens (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id),
  token_hash      VARCHAR(255) UNIQUE NOT NULL,
  device_id       BIGINT,
  is_revoked      BOOLEAN DEFAULT FALSE,
  revoked_at      TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);


CREATE TABLE user_devices (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id),
  user_type       VARCHAR(20) NOT NULL,               -- OWNER/TECHNICIAN/ADMIN
  device_name     VARCHAR(100),
  platform        VARCHAR(20) NOT NULL,               -- ANDROID/IOS/WEB
  os_version      VARCHAR(50),
  app_version     VARCHAR(20),
  fcm_token       VARCHAR(500),
  is_active       BOOLEAN DEFAULT TRUE,
  last_used_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ);

CREATE INDEX idx_devices_user_id ON user_devices(user_id);
CREATE INDEX idx_devices_fcm_token ON user_devices(fcm_token);


CREATE TABLE user_preferences (
  id                    BIGSERIAL PRIMARY KEY,
  user_id               BIGINT UNIQUE NOT NULL REFERENCES users(id),
  language              VARCHAR(10) DEFAULT 'en',
  timezone              VARCHAR(50) DEFAULT 'Asia/Kolkata',
  date_format           VARCHAR(20) DEFAULT 'DD/MM/YYYY',
  currency_format       VARCHAR(20) DEFAULT 'INR_INDIAN',
  number_format         VARCHAR(20) DEFAULT 'INDIAN_SYSTEM',
  distance_unit         VARCHAR(10) DEFAULT 'KM',
  temperature_unit      VARCHAR(10) DEFAULT 'CELSIUS',
  dark_mode             BOOLEAN DEFAULT FALSE,
  high_contrast         BOOLEAN DEFAULT FALSE,
  large_text            BOOLEAN DEFAULT FALSE,
  dnd_enabled           BOOLEAN DEFAULT FALSE,
  dnd_start             TIME,
  dnd_end               TIME,
  push_enabled          BOOLEAN DEFAULT TRUE,
  sms_enabled           BOOLEAN DEFAULT FALSE,
  email_enabled         BOOLEAN DEFAULT TRUE,
  whatsapp_enabled      BOOLEAN DEFAULT FALSE,
  essential_cookies     BOOLEAN DEFAULT TRUE,
  functional_cookies    BOOLEAN DEFAULT FALSE,
  analytics_cookies     BOOLEAN DEFAULT FALSE,
  marketing_cookies     BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ);


CREATE TABLE referrals (
  id                    BIGSERIAL PRIMARY KEY,
  referrer_id           BIGINT NOT NULL REFERENCES users(id),
  referred_id           BIGINT NOT NULL REFERENCES users(id),
  referral_code         VARCHAR(20) NOT NULL,
  campaign_id           BIGINT,
  referrer_reward       DECIMAL(8,2) DEFAULT 0.00,
  referred_reward       DECIMAL(8,2) DEFAULT 0.00,
  reward_given          BOOLEAN DEFAULT FALSE,
  reward_given_at       TIMESTAMPTZ,
  same_device_flag      BOOLEAN DEFAULT FALSE,
  same_ip_flag          BOOLEAN DEFAULT FALSE,
  same_bank_flag        BOOLEAN DEFAULT FALSE,
  fraud_score           DECIMAL(5,2) DEFAULT 0.00,
  fraud_status          VARCHAR(20) DEFAULT 'CLEAN',  -- CLEAN/SUSPICIOUS/FRAUD
  fraud_checked_at      TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_id);
CREATE UNIQUE INDEX uq_referrals_pair ON referrals(referrer_id, referred_id);

