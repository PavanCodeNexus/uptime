# UPTIME — Complete Database Documentation

> **Version:** 1.0  
> **Database:** Supabase (PostgreSQL 15 + PostGIS)  
> **Total Tables:** 141+  
> **Total Modules:** 14  
> **Project:** UPTIME — AI-Assisted On-Demand Technician Dispatch Platform  
> **Institution:** DSATM Bengaluru — VTU — 2026-27  

---

## Table of Contents

1. [Database Overview](#1-database-overview)
2. [Design Principles](#2-design-principles)
3. [Module 1 — Users & Auth](#3-module-1--users--auth)
4. [Module 2 — Technicians](#4-module-2--technicians)
5. [Module 3 — Jobs & Workflow](#5-module-3--jobs--workflow)
6. [Module 4 — AI & Diagnosis](#6-module-4--ai--diagnosis)
7. [Module 5 — Matching & Dispatch](#7-module-5--matching--dispatch)
8. [Module 6 — Payments & Finance](#8-module-6--payments--finance)
9. [Module 7 — Ratings & Trust](#9-module-7--ratings--trust)
10. [Module 8 — Industry Specific](#10-module-8--industry-specific)
11. [Module 9 — Insurance & Warranty](#11-module-9--insurance--warranty)
12. [Module 10 — Marketplace](#12-module-10--marketplace)
13. [Module 11 — Notifications](#13-module-11--notifications)
14. [Module 12 — Analytics & Logs](#14-module-12--analytics--logs)
15. [Module 13 — Wiki & Knowledge](#15-module-13--wiki--knowledge)
16. [Module 14 — Admin & Platform](#16-module-14--admin--platform)
17. [Additional Tables](#17-additional-tables)
18. [Database Views](#18-database-views)
19. [Triggers](#19-triggers)
20. [Stored Procedures](#20-stored-procedures)
21. [Indexes & Spatial](#21-indexes--spatial)
22. [Partitioned Tables](#22-partitioned-tables)
23. [Complete ER Summary](#23-complete-er-summary)

---

## 1. Database Overview

```
Provider:        Supabase (managed PostgreSQL 15)
Extensions:      PostGIS (geospatial), pg_crypto (hashing)
Free tier:       500MB DB storage, 1GB file storage
Pro tier:        8GB DB, 100GB storage, PITR backups
Connection:      JDBC over SSL (Spring Boot + HikariCP)
Pool size:       10 connections max (Railway free tier)
Migrations:      Flyway V1–V17
Schema:          public (all tables)
Encoding:        UTF8 (supports all Indian languages)
Collation:       en_US.UTF-8

Summary:
  Total tables:     141+
  Total columns:    1,700+
  Total indexes:    500+
  Geospatial cols:  8 (POINT geography)
  Soft-delete tbls: 15
  Tamper-proof:     5 (SHA-256 hash)
  Partitioned:      5 (high-volume)
  JSON columns:     45+
  Triggers:         4
  Views:            3
  Procedures:       2
```

---

## 2. Design Principles

```sql
-- 1. All tables use BIGSERIAL primary keys
id BIGSERIAL PRIMARY KEY

-- 2. All tables have audit timestamps
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ

-- 3. User-facing tables have soft delete
deleted_at TIMESTAMPTZ  -- NULL = active, NOT NULL = deleted

-- 4. All text uses TEXT or VARCHAR with limits
-- Never use CHAR (wastes space)

-- 5. Money values use DECIMAL(10,2)
amount DECIMAL(10,2)  -- never FLOAT (rounding errors)

-- 6. Geospatial uses PostGIS geography type
location geography(POINT, 4326)  -- WGS84 coordinates

-- 7. Flexible arrays use JSONB
skill_tags JSONB DEFAULT '[]'

-- 8. Enums defined as PostgreSQL types
CREATE TYPE job_status AS ENUM (
  'POSTED','AI_ANALYZING','MATCHED','ACCEPTED',
  'EN_ROUTE','ARRIVED','IN_PROGRESS','COMPLETED',
  'CANCELLED','DISPUTED'
);

-- 9. Foreign keys always indexed
CREATE INDEX idx_{table}_{col} ON {table}({col});

-- 10. SHA-256 for tamper-proof records
hash_value VARCHAR(64)  -- hex-encoded SHA-256
is_tamper_proof_locked BOOLEAN DEFAULT FALSE
```

---

## 3. Module 1 — Users & Auth

**Tables: 8**

---

### Table: `users`

```sql
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
  deleted_at            TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
```

---

### Table: `user_addresses`

```sql
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
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_user_addresses_location ON user_addresses USING GIST(location);
```

---

### Table: `user_sessions`

```sql
CREATE TABLE user_sessions (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id),
  session_token   VARCHAR(255) UNIQUE NOT NULL,
  device_id       BIGINT REFERENCES user_devices(id),
  ip_address      VARCHAR(45),
  user_agent      VARCHAR(300),
  platform        VARCHAR(20),                        -- WEB/ANDROID/IOS
  is_active       BOOLEAN DEFAULT TRUE,
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  last_used_at    TIMESTAMPTZ
);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);
```

---

### Table: `otp_verifications`

```sql
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
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_otp_phone ON otp_verifications(phone);
CREATE INDEX idx_otp_expires ON otp_verifications(expires_at);
```

---

### Table: `refresh_tokens`

```sql
CREATE TABLE refresh_tokens (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id),
  token_hash      VARCHAR(255) UNIQUE NOT NULL,
  device_id       BIGINT REFERENCES user_devices(id),
  is_revoked      BOOLEAN DEFAULT FALSE,
  revoked_at      TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
```

---

### Table: `user_devices`

```sql
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
  updated_at      TIMESTAMPTZ
);

CREATE INDEX idx_devices_user_id ON user_devices(user_id);
CREATE INDEX idx_devices_fcm_token ON user_devices(fcm_token);
```

---

### Table: `user_preferences`

```sql
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
  updated_at            TIMESTAMPTZ
);
```

---

### Table: `referrals`

```sql
CREATE TABLE referrals (
  id                    BIGSERIAL PRIMARY KEY,
  referrer_id           BIGINT NOT NULL REFERENCES users(id),
  referred_id           BIGINT NOT NULL REFERENCES users(id),
  referral_code         VARCHAR(20) NOT NULL,
  campaign_id           BIGINT REFERENCES referral_campaigns(id),
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
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_id);
CREATE UNIQUE INDEX uq_referrals_pair ON referrals(referrer_id, referred_id);
```

---

## 4. Module 2 — Technicians

**Tables: 10**

---

### Table: `technicians`

```sql
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
  deleted_at              TIMESTAMPTZ
);

CREATE INDEX idx_technicians_user_id ON technicians(user_id);
CREATE INDEX idx_technicians_industry ON technicians(industry_type);
CREATE INDEX idx_technicians_available ON technicians(is_available);
CREATE INDEX idx_technicians_rating ON technicians(rating_avg);
CREATE INDEX idx_technicians_status ON technicians(verification_status);
```

---

### Table: `technician_skills`

```sql
CREATE TABLE technician_skills (
  id                BIGSERIAL PRIMARY KEY,
  technician_id     BIGINT NOT NULL REFERENCES technicians(id),
  skill_category    VARCHAR(100) NOT NULL,     -- e.g. motor_repair
  skill_name        VARCHAR(100) NOT NULL,
  proficiency       VARCHAR(20) DEFAULT 'INTERMEDIATE', -- BEGINNER/INTERMEDIATE/EXPERT
  years_experience  DECIMAL(4,1),
  is_certified      BOOLEAN DEFAULT FALSE,
  certificate_url   VARCHAR(500),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tech_skills_tech_id ON technician_skills(technician_id);
CREATE INDEX idx_tech_skills_category ON technician_skills(skill_category);
```

---

### Table: `technician_documents`

```sql
CREATE TABLE technician_documents (
  id              BIGSERIAL PRIMARY KEY,
  technician_id   BIGINT NOT NULL REFERENCES technicians(id),
  document_type   VARCHAR(30) NOT NULL,    -- AADHAAR/PAN/CERTIFICATE/PHOTO/GST
  document_url    VARCHAR(500) NOT NULL,
  document_number VARCHAR(100),
  is_verified     BOOLEAN DEFAULT FALSE,
  verified_by     BIGINT REFERENCES admin_users(id),
  verified_at     TIMESTAMPTZ,
  rejection_reason TEXT,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tech_docs_tech_id ON technician_documents(technician_id);
CREATE INDEX idx_tech_docs_type ON technician_documents(document_type);
```

---

### Table: `technician_verification`

```sql
CREATE TABLE technician_verification (
  id                    BIGSERIAL PRIMARY KEY,
  technician_id         BIGINT UNIQUE NOT NULL REFERENCES technicians(id),
  submitted_at          TIMESTAMPTZ,
  reviewed_at           TIMESTAMPTZ,
  reviewed_by           BIGINT REFERENCES admin_users(id),
  status                VARCHAR(20) DEFAULT 'PENDING',
  aadhaar_verified      BOOLEAN DEFAULT FALSE,
  face_match_score      DECIMAL(5,2),
  background_check      VARCHAR(20) DEFAULT 'PENDING',
  rejection_reason      TEXT,
  resubmission_count    INT DEFAULT 0,
  approved_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ
);
```

---

### Table: `technician_locations`

```sql
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
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tech_loc_tech_id ON technician_locations(technician_id);
CREATE INDEX idx_tech_loc_location ON technician_locations USING GIST(current_location);
```

---

### Table: `technician_availability`

```sql
CREATE TABLE technician_availability (
  id                BIGSERIAL PRIMARY KEY,
  technician_id     BIGINT NOT NULL REFERENCES technicians(id),
  day_of_week       INT NOT NULL,            -- 0=Sunday, 6=Saturday
  start_time        TIME NOT NULL,
  end_time          TIME NOT NULL,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tech_avail_tech_id ON technician_availability(technician_id);
```

---

### Table: `technician_service_areas`

```sql
CREATE TABLE technician_service_areas (
  id              BIGSERIAL PRIMARY KEY,
  technician_id   BIGINT NOT NULL REFERENCES technicians(id),
  center_location geography(POINT, 4326),
  radius_km       DECIMAL(6,2) DEFAULT 10.00,
  city            VARCHAR(100),
  pincode         VARCHAR(10),
  is_primary      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tech_areas_tech_id ON technician_service_areas(technician_id);
CREATE INDEX idx_tech_areas_location ON technician_service_areas USING GIST(center_location);
```

---

### Table: `technician_statistics`

```sql
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
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `technician_badges`

```sql
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
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_badges_tech_id ON technician_badges(technician_id);
CREATE INDEX idx_badges_type ON technician_badges(badge_type);
```

---

### Table: `technician_bank_accounts`

```sql
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
  updated_at            TIMESTAMPTZ
);

CREATE INDEX idx_bank_tech_id ON technician_bank_accounts(technician_id);
```

---

## 5. Module 3 — Jobs & Workflow

**Tables: 12**

---

### Table: `jobs`

```sql
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
  surge_pricing_id        BIGINT REFERENCES surge_pricing(id),
  negotiation_id          BIGINT REFERENCES job_negotiations(id),
  live_stream_id          BIGINT REFERENCES job_live_streams(id),
  micro_insurance_id      BIGINT REFERENCES job_micro_insurance(id),
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
  deleted_at              TIMESTAMPTZ
);

CREATE INDEX idx_jobs_owner_id ON jobs(owner_id);
CREATE INDEX idx_jobs_technician_id ON jobs(technician_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_industry ON jobs(industry);
CREATE INDEX idx_jobs_created ON jobs(created_at);
CREATE INDEX idx_jobs_location ON jobs USING GIST(owner_location);
```

---

### Table: `job_media`

```sql
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
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_job_media_job_id ON job_media(job_id);
CREATE INDEX idx_job_media_type ON job_media(media_type);
```

---

### Table: `job_status_history`

```sql
CREATE TABLE job_status_history (
  id              BIGSERIAL PRIMARY KEY,
  job_id          BIGINT NOT NULL REFERENCES jobs(id),
  from_status     VARCHAR(30),
  to_status       VARCHAR(30) NOT NULL,
  changed_by_id   BIGINT,
  changed_by_type VARCHAR(20),           -- OWNER/TECHNICIAN/ADMIN/SYSTEM
  reason          TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_job_status_hist_job ON job_status_history(job_id);
```

---

### Table: `job_checklist`

```sql
CREATE TABLE job_checklist (
  id              BIGSERIAL PRIMARY KEY,
  job_id          BIGINT UNIQUE NOT NULL REFERENCES jobs(id),
  template_name   VARCHAR(100),
  total_steps     INT DEFAULT 0,
  completed_steps INT DEFAULT 0,
  is_complete     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ
);
```

---

### Table: `job_checklist_items`

```sql
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
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_checklist_items_checklist ON job_checklist_items(checklist_id);
```

---

### Table: `job_parts_used`

```sql
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
  marketplace_product_id BIGINT REFERENCES marketplace_products(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_parts_job_id ON job_parts_used(job_id);
```

---

### Table: `job_timeline`

```sql
CREATE TABLE job_timeline (
  id              BIGSERIAL PRIMARY KEY,
  job_id          BIGINT NOT NULL REFERENCES jobs(id),
  event_type      VARCHAR(50) NOT NULL,
  event_title     VARCHAR(200) NOT NULL,
  event_body      TEXT,
  actor_id        BIGINT,
  actor_type      VARCHAR(20),
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_timeline_job_id ON job_timeline(job_id);
```

---

### Table: `job_cancellations`

```sql
CREATE TABLE job_cancellations (
  id              BIGSERIAL PRIMARY KEY,
  job_id          BIGINT UNIQUE NOT NULL REFERENCES jobs(id),
  cancelled_by_id BIGINT NOT NULL,
  cancelled_by_type VARCHAR(20) NOT NULL,
  reason_code     VARCHAR(50),
  reason_text     TEXT,
  cancellation_fee DECIMAL(10,2) DEFAULT 0.00,
  refund_amount   DECIMAL(10,2) DEFAULT 0.00,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `job_disputes`

```sql
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
  resolved_by       BIGINT REFERENCES admin_users(id),
  resolved_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ
);

CREATE INDEX idx_disputes_job_id ON job_disputes(job_id);
CREATE INDEX idx_disputes_status ON job_disputes(status);
```

---

### Table: `job_auction`

```sql
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
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `job_auction_bids`

```sql
CREATE TABLE job_auction_bids (
  id              BIGSERIAL PRIMARY KEY,
  auction_id      BIGINT NOT NULL REFERENCES job_auction(id),
  technician_id   BIGINT NOT NULL REFERENCES technicians(id),
  bid_amount      DECIMAL(10,2) NOT NULL,
  eta_mins        INT,
  distance_km     DECIMAL(6,2),
  status          VARCHAR(20) DEFAULT 'PLACED',
  placed_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_auction_bids_auction ON job_auction_bids(auction_id);
CREATE INDEX idx_auction_bids_tech ON job_auction_bids(technician_id);
```

---

### Table: `job_otp_verifications`

```sql
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
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_otp_verif_job ON job_otp_verifications(job_id);
```

---

## 6. Module 4 — AI & Diagnosis

**Tables: 12**

---

### Table: `ai_fault_diagnoses`

```sql
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
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `ai_sound_analyses`

```sql
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
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `ai_image_analyses`

```sql
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
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `digital_twins`

```sql
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
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_twins_asset ON digital_twins(asset_id, asset_type);
CREATE INDEX idx_twins_owner ON digital_twins(owner_id);
```

---

### Table: `digital_twin_components`

```sql
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
  updated_at      TIMESTAMPTZ
);

CREATE INDEX idx_twin_components_twin ON digital_twin_components(twin_id);
```

---

### Table: `repair_predictions`

```sql
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
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_predictions_twin ON repair_predictions(twin_id);
CREATE INDEX idx_predictions_owner ON repair_predictions(owner_id);
CREATE INDEX idx_predictions_date ON repair_predictions(predicted_date);
```

---

### Table: `ai_copilot_sessions`

```sql
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
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `ai_copilot_steps`

```sql
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
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_copilot_steps_session ON ai_copilot_steps(session_id);
```

---

### Table: `epidemic_detections`

```sql
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
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `epidemic_affected_users`

```sql
CREATE TABLE epidemic_affected_users (
  id              BIGSERIAL PRIMARY KEY,
  epidemic_id     BIGINT NOT NULL REFERENCES epidemic_detections(id),
  user_id         BIGINT NOT NULL REFERENCES users(id),
  job_id          BIGINT REFERENCES jobs(id),
  notified        BOOLEAN DEFAULT FALSE,
  notified_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `silent_killer_alerts`

```sql
CREATE TABLE silent_killer_alerts (
  id              BIGSERIAL PRIMARY KEY,
  device_id       BIGINT REFERENCES devices(id),
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
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `ai_prompt_versions`

```sql
CREATE TABLE ai_prompt_versions (
  id              BIGSERIAL PRIMARY KEY,
  prompt_name     VARCHAR(100) NOT NULL,
  version         VARCHAR(20) NOT NULL,
  prompt_text     TEXT NOT NULL,
  is_active       BOOLEAN DEFAULT TRUE,
  performance_score DECIMAL(5,2),
  notes           TEXT,
  created_by      BIGINT REFERENCES admin_users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_prompt_version ON ai_prompt_versions(prompt_name, version);
```

---

## 7. Module 5 — Matching & Dispatch

**Tables: 6**

---

### Table: `matching_requests`

```sql
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
  created_at            TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `matching_scores`

```sql
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
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_match_scores_job ON matching_scores(job_id);
CREATE INDEX idx_match_scores_tech ON matching_scores(technician_id);
CREATE INDEX idx_match_scores_rank ON matching_scores(rank_position);
```

---

### Table: `technician_dispatch_history`

```sql
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
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dispatch_tech ON technician_dispatch_history(technician_id);
CREATE INDEX idx_dispatch_job  ON technician_dispatch_history(job_id);
```

---

### Table: `surge_pricing`

```sql
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
  ended_at            TIMESTAMPTZ
);
```

---

### Table: `live_location_tracking`

```sql
CREATE TABLE live_location_tracking (
  id              BIGSERIAL PRIMARY KEY,
  job_id          BIGINT NOT NULL REFERENCES jobs(id),
  technician_id   BIGINT NOT NULL REFERENCES technicians(id),
  location        geography(POINT, 4326) NOT NULL,
  speed_kmph      DECIMAL(6,2),
  heading_degrees DECIMAL(6,2),
  accuracy_meters DECIMAL(8,2),
  battery_level   INT,
  recorded_at     TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (EXTRACT(MONTH FROM recorded_at));

CREATE INDEX idx_live_tracking_job  ON live_location_tracking(job_id);
CREATE INDEX idx_live_tracking_tech ON live_location_tracking(technician_id);
CREATE INDEX idx_live_tracking_loc  ON live_location_tracking USING GIST(location);
```

---

### Table: `job_notifications_sent`

```sql
CREATE TABLE job_notifications_sent (
  id              BIGSERIAL PRIMARY KEY,
  job_id          BIGINT NOT NULL REFERENCES jobs(id),
  technician_id   BIGINT NOT NULL REFERENCES technicians(id),
  channel         VARCHAR(20),             -- PUSH/SMS/WEBSOCKET
  sent_at         TIMESTAMPTZ DEFAULT NOW(),
  delivered       BOOLEAN DEFAULT FALSE,
  opened          BOOLEAN DEFAULT FALSE
);
```

---

## 8. Module 6 — Payments & Finance

**Tables: 10**

---

### Table: `transactions`

```sql
CREATE TABLE transactions (
  id                    BIGSERIAL PRIMARY KEY,
  transaction_number    VARCHAR(30) UNIQUE NOT NULL,
  job_id                BIGINT REFERENCES jobs(id),
  owner_id              BIGINT NOT NULL REFERENCES users(id),
  technician_id         BIGINT REFERENCES technicians(id),
  amount                DECIMAL(10,2) NOT NULL,
  currency              VARCHAR(5) DEFAULT 'INR',
  payment_method        VARCHAR(30),        -- UPI/CARD/WALLET/EMI/NETBANKING
  razorpay_order_id     VARCHAR(100),
  razorpay_payment_id   VARCHAR(100),
  razorpay_signature    VARCHAR(500),
  status                VARCHAR(20) DEFAULT 'INITIATED',
  failure_reason        TEXT,
  refunded_amount       DECIMAL(10,2) DEFAULT 0.00,
  platform_fee          DECIMAL(10,2),
  gst_amount            DECIMAL(10,2),
  technician_amount     DECIMAL(10,2),
  is_webhook_received   BOOLEAN DEFAULT FALSE,
  webhook_received_at   TIMESTAMPTZ,
  idempotency_key       VARCHAR(100) UNIQUE, -- prevent duplicate processing
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ
);

CREATE INDEX idx_transactions_job ON transactions(job_id);
CREATE INDEX idx_transactions_owner ON transactions(owner_id);
CREATE INDEX idx_transactions_status ON transactions(status);
```

---

### Table: `wallet_transactions`

```sql
CREATE TABLE wallet_transactions (
  id              BIGSERIAL PRIMARY KEY,
  technician_id   BIGINT NOT NULL REFERENCES technicians(id),
  type            VARCHAR(20) NOT NULL,     -- CREDIT/DEBIT
  amount          DECIMAL(10,2) NOT NULL,
  balance_after   DECIMAL(10,2) NOT NULL,
  reference_type  VARCHAR(30),             -- JOB/PAYOUT/BONUS/REFUND
  reference_id    BIGINT,
  description     TEXT,
  payout_status   VARCHAR(20) DEFAULT 'PENDING',
  payout_eligible_at TIMESTAMPTZ,          -- 24h after job complete
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wallet_tech ON wallet_transactions(technician_id);
CREATE INDEX idx_wallet_type ON wallet_transactions(type);
CREATE INDEX idx_wallet_payout ON wallet_transactions(payout_status);
```

---

### Table: `payouts`

```sql
CREATE TABLE payouts (
  id                    BIGSERIAL PRIMARY KEY,
  payout_number         VARCHAR(30) UNIQUE NOT NULL,
  technician_id         BIGINT NOT NULL REFERENCES technicians(id),
  bank_account_id       BIGINT REFERENCES technician_bank_accounts(id),
  amount                DECIMAL(10,2) NOT NULL,
  tds_amount            DECIMAL(10,2) DEFAULT 0.00,  -- 1% TDS above ₹30K
  net_amount            DECIMAL(10,2) NOT NULL,
  razorpay_payout_id    VARCHAR(100),
  razorpay_fund_account VARCHAR(100),
  status                VARCHAR(20) DEFAULT 'INITIATED',
  failure_reason        TEXT,
  initiated_at          TIMESTAMPTZ DEFAULT NOW(),
  processed_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payouts_tech ON payouts(technician_id);
CREATE INDEX idx_payouts_status ON payouts(status);
```

---

### Table: `subscription_plans`

```sql
CREATE TABLE subscription_plans (
  id                BIGSERIAL PRIMARY KEY,
  plan_name         VARCHAR(50) UNIQUE NOT NULL,  -- FREE/BASIC/STANDARD/PREMIUM
  display_name      VARCHAR(100),
  price_monthly     DECIMAL(10,2) NOT NULL,
  jobs_per_month    INT,                          -- NULL = unlimited
  machines_limit    INT,
  ai_calls_limit    INT,
  priority_matching BOOLEAN DEFAULT FALSE,
  video_consults    INT DEFAULT 0,
  marketplace_discount DECIMAL(5,2) DEFAULT 0.00,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `subscriptions`

```sql
CREATE TABLE subscriptions (
  id                    BIGSERIAL PRIMARY KEY,
  user_id               BIGINT NOT NULL REFERENCES users(id),
  plan_id               BIGINT NOT NULL REFERENCES subscription_plans(id),
  status                VARCHAR(20) DEFAULT 'ACTIVE',
  jobs_used_this_month  INT DEFAULT 0,
  billing_cycle_start   DATE NOT NULL,
  billing_cycle_end     DATE NOT NULL,
  auto_renewal          BOOLEAN DEFAULT TRUE,
  cancelled_at          TIMESTAMPTZ,
  grace_period_ends_at  TIMESTAMPTZ,
  razorpay_subscription_id VARCHAR(100),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

---

### Table: `invoices`

```sql
CREATE TABLE invoices (
  id                BIGSERIAL PRIMARY KEY,
  invoice_number    VARCHAR(30) UNIQUE NOT NULL,  -- INV-2026-00234
  job_id            BIGINT REFERENCES jobs(id),
  transaction_id    BIGINT REFERENCES transactions(id),
  owner_id          BIGINT NOT NULL REFERENCES users(id),
  technician_id     BIGINT REFERENCES technicians(id),
  subtotal          DECIMAL(10,2) NOT NULL,
  labour_amount     DECIMAL(10,2),
  parts_amount      DECIMAL(10,2),
  gst_amount        DECIMAL(10,2),
  discount_amount   DECIMAL(10,2) DEFAULT 0.00,
  total_amount      DECIMAL(10,2) NOT NULL,
  invoice_url       VARCHAR(500),              -- PDF in Cloudinary
  hash_value        VARCHAR(64),               -- SHA-256 tamper proof
  is_tamper_locked  BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `gst_records`

```sql
CREATE TABLE gst_records (
  id                BIGSERIAL PRIMARY KEY,
  job_id            BIGINT REFERENCES jobs(id),
  invoice_id        BIGINT REFERENCES invoices(id),
  owner_gstin       VARCHAR(20),
  technician_gstin  VARCHAR(20),
  supply_type       VARCHAR(20),          -- INTRA_STATE/INTER_STATE
  taxable_amount    DECIMAL(10,2) NOT NULL,
  cgst_rate         DECIMAL(5,2),
  sgst_rate         DECIMAL(5,2),
  igst_rate         DECIMAL(5,2),
  cgst_amount       DECIMAL(10,2) DEFAULT 0.00,
  sgst_amount       DECIMAL(10,2) DEFAULT 0.00,
  igst_amount       DECIMAL(10,2) DEFAULT 0.00,
  total_tax         DECIMAL(10,2) NOT NULL,
  hsn_code          VARCHAR(20),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `refunds`

```sql
CREATE TABLE refunds (
  id                    BIGSERIAL PRIMARY KEY,
  refund_number         VARCHAR(30) UNIQUE NOT NULL,
  transaction_id        BIGINT NOT NULL REFERENCES transactions(id),
  job_id                BIGINT REFERENCES jobs(id),
  owner_id              BIGINT NOT NULL REFERENCES users(id),
  amount                DECIMAL(10,2) NOT NULL,
  reason                TEXT,
  razorpay_refund_id    VARCHAR(100),
  status                VARCHAR(20) DEFAULT 'INITIATED',
  processed_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `payment_methods`

```sql
CREATE TABLE payment_methods (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id),
  method_type     VARCHAR(20) NOT NULL,   -- UPI/CARD/NETBANKING/WALLET
  display_name    VARCHAR(100),
  upi_id          VARCHAR(100),
  card_last_four  VARCHAR(4),
  card_network    VARCHAR(20),
  razorpay_token  VARCHAR(200),
  is_default      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `platform_revenue`

```sql
CREATE TABLE platform_revenue (
  id                  BIGSERIAL PRIMARY KEY,
  date                DATE NOT NULL,
  industry            VARCHAR(20),
  city                VARCHAR(100),
  total_jobs          INT DEFAULT 0,
  gross_revenue       DECIMAL(12,2) DEFAULT 0.00,
  platform_commission DECIMAL(12,2) DEFAULT 0.00,
  gst_collected       DECIMAL(12,2) DEFAULT 0.00,
  refunds_issued      DECIMAL(12,2) DEFAULT 0.00,
  net_revenue         DECIMAL(12,2) DEFAULT 0.00,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_revenue_date ON platform_revenue(date, industry, city);
```

---

## 9. Module 7 — Ratings & Trust

**Tables: 7**

---

### Table: `job_ratings`

```sql
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
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ratings_job ON job_ratings(job_id);
CREATE INDEX idx_ratings_tech ON job_ratings(technician_id);
CREATE UNIQUE INDEX uq_rating_job ON job_ratings(job_id);
```

---

### Table: `rating_categories`

```sql
CREATE TABLE rating_categories (
  id              BIGSERIAL PRIMARY KEY,
  job_rating_id   BIGINT NOT NULL REFERENCES job_ratings(id),
  category        VARCHAR(50) NOT NULL,   -- PUNCTUALITY/QUALITY/BEHAVIOUR/CLEANLINESS
  score           DECIMAL(3,2) NOT NULL,
  rated_by        VARCHAR(20) NOT NULL,   -- OWNER/TECHNICIAN
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `technician_trust_scores`

```sql
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
  updated_at            TIMESTAMPTZ
);
```

---

### Table: `owner_trust_scores`

```sql
CREATE TABLE owner_trust_scores (
  id                BIGSERIAL PRIMARY KEY,
  owner_id          BIGINT UNIQUE NOT NULL REFERENCES users(id),
  overall_score     DECIMAL(5,2) DEFAULT 100.00,
  payment_score     DECIMAL(5,2) DEFAULT 100.00,
  behaviour_score   DECIMAL(5,2) DEFAULT 100.00,
  cancellation_penalty DECIMAL(5,2) DEFAULT 0.00,
  dispute_penalty   DECIMAL(5,2) DEFAULT 0.00,
  ratings_count     INT DEFAULT 0,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `platform_nps`

```sql
CREATE TABLE platform_nps (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id),
  user_type       VARCHAR(20) NOT NULL,
  score           INT NOT NULL,           -- 0–10
  category        VARCHAR(20),           -- PROMOTER/PASSIVE/DETRACTOR
  feedback        TEXT,
  trigger_event   VARCHAR(50),           -- AFTER_JOB/MONTHLY/QUARTERLY
  job_id          BIGINT REFERENCES jobs(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `review_reports`

```sql
CREATE TABLE review_reports (
  id              BIGSERIAL PRIMARY KEY,
  rating_id       BIGINT NOT NULL REFERENCES job_ratings(id),
  reported_by     BIGINT NOT NULL,
  reported_by_type VARCHAR(20),
  reason          VARCHAR(50),
  description     TEXT,
  status          VARCHAR(20) DEFAULT 'PENDING',
  resolved_by     BIGINT REFERENCES admin_users(id),
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `rating_analytics`

```sql
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
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 10. Module 8 — Industry Specific

**Tables: 12 + additional**

---

### Table: `machines`

```sql
CREATE TABLE machines (
  id                  BIGSERIAL PRIMARY KEY,
  owner_id            BIGINT NOT NULL REFERENCES users(id),
  machine_name        VARCHAR(200) NOT NULL,
  machine_type        VARCHAR(50) NOT NULL,   -- CNC/LATHE/CONVEYOR/MOTOR/PUMP etc.
  brand               VARCHAR(100),
  model_number        VARCHAR(100),
  serial_number       VARCHAR(100) UNIQUE,
  purchase_year       INT,
  purchase_cost       DECIMAL(12,2),
  location_in_factory VARCHAR(200),
  factory_address_id  BIGINT REFERENCES user_addresses(id),
  current_status      VARCHAR(30) DEFAULT 'OPERATIONAL',
  health_score        DECIMAL(5,2) DEFAULT 100.00,
  total_repair_cost   DECIMAL(12,2) DEFAULT 0.00,
  total_repairs       INT DEFAULT 0,
  last_repair_at      TIMESTAMPTZ,
  last_service_at     TIMESTAMPTZ,
  next_service_due    TIMESTAMPTZ,
  manual_url          VARCHAR(500),
  photo_url           VARCHAR(500),
  twin_id             BIGINT REFERENCES digital_twins(id),
  notes               TEXT,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ,
  deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_machines_owner ON machines(owner_id);
CREATE INDEX idx_machines_type  ON machines(machine_type);
CREATE INDEX idx_machines_status ON machines(current_status);
```

---

### Table: `machine_service_history`

```sql
CREATE TABLE machine_service_history (
  id                      BIGSERIAL PRIMARY KEY,
  machine_id              BIGINT NOT NULL REFERENCES machines(id),
  job_id                  BIGINT REFERENCES jobs(id),
  service_type            VARCHAR(30) NOT NULL,
  fault_category          VARCHAR(100),
  work_done               TEXT NOT NULL,
  parts_replaced          JSONB DEFAULT '[]',
  technician_id           BIGINT REFERENCES technicians(id),
  technician_name         VARCHAR(100),
  cost                    DECIMAL(10,2) DEFAULT 0.00,
  downtime_hours          DECIMAL(8,2),
  before_health_score     DECIMAL(5,2),
  after_health_score      DECIMAL(5,2),
  next_service_due        TIMESTAMPTZ,
  service_certificate_url VARCHAR(500),
  service_date            DATE NOT NULL,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_machine_svc_machine ON machine_service_history(machine_id);
```

---

### Table: `vehicles`

```sql
CREATE TABLE vehicles (
  id                      BIGSERIAL PRIMARY KEY,
  owner_id                BIGINT NOT NULL REFERENCES users(id),
  registration_number     VARCHAR(20) UNIQUE NOT NULL,
  vehicle_type            VARCHAR(20) NOT NULL,   -- CAR/BIKE/TRUCK/AUTO/BUS/EV_CAR
  brand                   VARCHAR(100) NOT NULL,
  model                   VARCHAR(100) NOT NULL,
  variant                 VARCHAR(100),
  manufacture_year        INT NOT NULL,
  purchase_date           DATE,
  fuel_type               VARCHAR(20) NOT NULL,   -- PETROL/DIESEL/CNG/ELECTRIC/HYBRID
  transmission            VARCHAR(20) DEFAULT 'MANUAL',
  color                   VARCHAR(50),
  chassis_number          VARCHAR(50) UNIQUE,
  engine_number           VARCHAR(50),
  current_odometer_km     INT DEFAULT 0,
  last_odometer_updated   TIMESTAMPTZ,
  insurance_policy_number VARCHAR(100),
  insurance_expiry        DATE,
  puc_number              VARCHAR(50),
  puc_expiry              DATE,
  health_score            DECIMAL(5,2) DEFAULT 100.00,
  mood_score              DECIMAL(5,2) DEFAULT 100.00,
  monsoon_readiness_score DECIMAL(5,2),
  last_mood_score_date    DATE,
  total_repair_cost       DECIMAL(12,2) DEFAULT 0.00,
  total_repairs           INT DEFAULT 0,
  photo_url               VARCHAR(500),
  twin_id                 BIGINT REFERENCES digital_twins(id),
  engine_fingerprint_id   BIGINT REFERENCES engine_fingerprints(id),
  is_active               BOOLEAN DEFAULT TRUE,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ,
  deleted_at              TIMESTAMPTZ
);

CREATE INDEX idx_vehicles_owner ON vehicles(owner_id);
CREATE INDEX idx_vehicles_type  ON vehicles(vehicle_type);
CREATE INDEX idx_vehicles_reg   ON vehicles(registration_number);
CREATE INDEX idx_vehicles_insurance_exp ON vehicles(insurance_expiry);
CREATE INDEX idx_vehicles_puc_exp ON vehicles(puc_expiry);
```

---

### Table: `vehicle_documents`

```sql
CREATE TABLE vehicle_documents (
  id                  BIGSERIAL PRIMARY KEY,
  vehicle_id          BIGINT NOT NULL REFERENCES vehicles(id),
  owner_id            BIGINT NOT NULL REFERENCES users(id),
  document_type       VARCHAR(30) NOT NULL,  -- RC_BOOK/INSURANCE/PUC/FITNESS_CERT
  document_number     VARCHAR(100),
  issuing_authority   VARCHAR(200),
  document_url        VARCHAR(500) NOT NULL,
  issue_date          DATE,
  expiry_date         DATE,
  is_verified         BOOLEAN DEFAULT FALSE,
  reminder_sent       BOOLEAN DEFAULT FALSE,
  reminder_sent_at    TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ
);

CREATE INDEX idx_veh_docs_vehicle ON vehicle_documents(vehicle_id);
CREATE INDEX idx_veh_docs_expiry  ON vehicle_documents(expiry_date);
```

---

### Table: `vehicle_fuel_logs`

```sql
CREATE TABLE vehicle_fuel_logs (
  id                  BIGSERIAL PRIMARY KEY,
  vehicle_id          BIGINT NOT NULL REFERENCES vehicles(id),
  owner_id            BIGINT NOT NULL REFERENCES users(id),
  fuel_type           VARCHAR(20) NOT NULL,
  quantity            DECIMAL(8,2) NOT NULL,
  unit                VARCHAR(10) NOT NULL,     -- LITRES/KWH/KG
  cost_per_unit       DECIMAL(8,2) NOT NULL,
  total_cost          DECIMAL(10,2) NOT NULL,
  odometer_reading    INT NOT NULL,
  fuel_station        VARCHAR(200),
  location            geography(POINT, 4326),
  mileage_kmpl        DECIMAL(6,2),
  adulteration_flag   BOOLEAN DEFAULT FALSE,
  adulteration_notes  TEXT,
  filled_at           TIMESTAMPTZ NOT NULL,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fuel_logs_vehicle ON vehicle_fuel_logs(vehicle_id);
CREATE INDEX idx_fuel_logs_location ON vehicle_fuel_logs USING GIST(location);
```

---

### Table: `driver_safety_scores`

```sql
CREATE TABLE driver_safety_scores (
  id                      BIGSERIAL PRIMARY KEY,
  owner_id                BIGINT NOT NULL REFERENCES users(id),
  vehicle_id              BIGINT NOT NULL REFERENCES vehicles(id),
  trip_date               DATE NOT NULL,
  overall_score           DECIMAL(5,2) NOT NULL,
  speed_score             DECIMAL(5,2),
  braking_score           DECIMAL(5,2),
  acceleration_score      DECIMAL(5,2),
  cornering_score         DECIMAL(5,2),
  phone_usage_score       DECIMAL(5,2),
  night_driving_score     DECIMAL(5,2),
  distance_km             DECIMAL(8,2),
  duration_mins           INT,
  hard_braking_count      INT DEFAULT 0,
  harsh_acceleration_count INT DEFAULT 0,
  sharp_corner_count      INT DEFAULT 0,
  phone_usage_count       INT DEFAULT 0,
  speeding_instances      INT DEFAULT 0,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_safety_scores_owner ON driver_safety_scores(owner_id);
CREATE INDEX idx_safety_scores_vehicle ON driver_safety_scores(vehicle_id);
```

---

### Table: `pre_purchase_scans`

```sql
CREATE TABLE pre_purchase_scans (
  id                      BIGSERIAL PRIMARY KEY,
  scan_number             VARCHAR(30) UNIQUE NOT NULL,
  requested_by            BIGINT NOT NULL REFERENCES users(id),
  technician_id           BIGINT NOT NULL REFERENCES technicians(id),
  vehicle_registration    VARCHAR(20) NOT NULL,
  vehicle_brand           VARCHAR(100),
  vehicle_model           VARCHAR(100),
  asking_price            DECIMAL(12,2),
  scan_type               VARCHAR(20) NOT NULL,  -- BASIC/STANDARD/PREMIUM
  overall_score           DECIMAL(5,2),
  body_paint_score        DECIMAL(5,2),
  engine_score            DECIMAL(5,2),
  electrical_score        DECIMAL(5,2),
  chassis_score           DECIMAL(5,2),
  document_score          DECIMAL(5,2),
  odometer_score          DECIMAL(5,2),
  accident_detected       BOOLEAN DEFAULT FALSE,
  flood_damage_detected   BOOLEAN DEFAULT FALSE,
  odometer_fraud_detected BOOLEAN DEFAULT FALSE,
  loan_pending            BOOLEAN DEFAULT FALSE,
  loan_amount_pending     DECIMAL(12,2),
  theft_record            BOOLEAN DEFAULT FALSE,
  pending_challans        INT DEFAULT 0,
  challan_amount          DECIMAL(10,2) DEFAULT 0.00,
  fair_price_estimate     DECIMAL(12,2),
  ai_verdict              TEXT,
  report_url              VARCHAR(500),
  hash_value              VARCHAR(64),
  scan_fee_paid           DECIMAL(10,2),
  status                  VARCHAR(20) DEFAULT 'PENDING',
  scanned_at              TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `devices`

```sql
CREATE TABLE devices (
  id                      BIGSERIAL PRIMARY KEY,
  owner_id                BIGINT NOT NULL REFERENCES users(id),
  device_category         VARCHAR(30) NOT NULL, -- SMARTPHONE/LAPTOP/AC/REFRIGERATOR etc.
  device_type             VARCHAR(30) NOT NULL, -- PERSONAL_ELECTRONICS/HOME_APPLIANCE
  brand                   VARCHAR(100) NOT NULL,
  model                   VARCHAR(200) NOT NULL,
  variant                 VARCHAR(100),
  serial_number           VARCHAR(100),
  imei_number             VARCHAR(20),
  purchase_date           DATE,
  purchase_cost           DECIMAL(12,2),
  color                   VARCHAR(50),
  storage_gb              INT,
  ram_gb                  INT,
  os_type                 VARCHAR(20),
  os_version              VARCHAR(50),
  health_score            DECIMAL(5,2) DEFAULT 100.00,
  battery_health          DECIMAL(5,2),
  current_status          VARCHAR(20) DEFAULT 'WORKING',
  total_repairs           INT DEFAULT 0,
  total_repair_cost       DECIMAL(12,2) DEFAULT 0.00,
  repair_count_this_year  INT DEFAULT 0,
  warranty_expiry         DATE,
  extended_warranty_expiry DATE,
  amc_expiry              DATE,
  photo_url               VARCHAR(500),
  twin_id                 BIGINT REFERENCES digital_twins(id),
  room_location           VARCHAR(100),
  is_smart_device         BOOLEAN DEFAULT FALSE,
  smart_home_id           VARCHAR(200),
  silent_killer_risk_score DECIMAL(5,2),
  last_silent_killer_check TIMESTAMPTZ,
  electricity_consumption_watts DECIMAL(8,2),
  is_active               BOOLEAN DEFAULT TRUE,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ,
  deleted_at              TIMESTAMPTZ
);

CREATE INDEX idx_devices_owner    ON devices(owner_id);
CREATE INDEX idx_devices_category ON devices(device_category);
CREATE INDEX idx_devices_status   ON devices(current_status);
CREATE INDEX idx_devices_warranty ON devices(warranty_expiry);
CREATE INDEX idx_devices_amc      ON devices(amc_expiry);
```

---

### Table: `device_health_logs`

```sql
CREATE TABLE device_health_logs (
  id                    BIGSERIAL PRIMARY KEY,
  device_id             BIGINT NOT NULL REFERENCES devices(id),
  owner_id              BIGINT NOT NULL REFERENCES users(id),
  log_type              VARCHAR(30) NOT NULL,  -- MANUAL/SMART_HOME/AI/SERVICE
  health_score          DECIMAL(5,2),
  battery_health        DECIMAL(5,2),
  storage_used_percent  DECIMAL(5,2),
  performance_score     DECIMAL(5,2),
  temperature_celsius   DECIMAL(5,2),
  power_consumption_watts DECIMAL(8,2),
  anomaly_detected      BOOLEAN DEFAULT FALSE,
  anomaly_type          VARCHAR(100),
  anomaly_description   TEXT,
  ai_recommendation     TEXT,
  raw_data              JSONB,
  logged_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_device_health_device ON device_health_logs(device_id);
CREATE INDEX idx_device_health_anomaly ON device_health_logs(anomaly_detected);
```

---

### Table: `device_service_history`

```sql
CREATE TABLE device_service_history (
  id                      BIGSERIAL PRIMARY KEY,
  device_id               BIGINT NOT NULL REFERENCES devices(id),
  job_id                  BIGINT REFERENCES jobs(id),
  service_type            VARCHAR(30) NOT NULL,
  fault_category          VARCHAR(100),
  work_done               TEXT NOT NULL,
  parts_replaced          JSONB DEFAULT '[]',
  technician_id           BIGINT REFERENCES technicians(id),
  cost                    DECIMAL(10,2) DEFAULT 0.00,
  data_wiped              BOOLEAN DEFAULT FALSE,
  data_protection_cert_url VARCHAR(500),
  before_health_score     DECIMAL(5,2),
  after_health_score      DECIMAL(5,2),
  service_certificate_url VARCHAR(500),
  service_date            DATE NOT NULL,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `smart_home_connections`

```sql
CREATE TABLE smart_home_connections (
  id                      BIGSERIAL PRIMARY KEY,
  owner_id                BIGINT NOT NULL REFERENCES users(id),
  platform                VARCHAR(30) NOT NULL, -- GOOGLE_HOME/ALEXA/SMARTTHINGS etc.
  platform_user_id        VARCHAR(200),
  access_token_encrypted  TEXT,                 -- AES-256
  refresh_token_encrypted TEXT,
  token_expires_at        TIMESTAMPTZ,
  connected_devices_count INT DEFAULT 0,
  is_active               BOOLEAN DEFAULT TRUE,
  last_sync_at            TIMESTAMPTZ,
  sync_frequency_mins     INT DEFAULT 15,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ
);

CREATE UNIQUE INDEX uq_smart_home ON smart_home_connections(owner_id, platform);
```

---

## 11. Module 9 — Insurance & Warranty

**Tables: 6**

---

### Table: `insurance_policies`

```sql
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
  updated_at            TIMESTAMPTZ
);
```

---

### Table: `insurance_claims`

```sql
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
  reviewed_by         BIGINT REFERENCES admin_users(id),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ
);

CREATE INDEX idx_claims_policy ON insurance_claims(policy_id);
CREATE INDEX idx_claims_status ON insurance_claims(status);
CREATE INDEX idx_claims_location ON insurance_claims USING GIST(incident_location);
```

---

### Table: `warranties`

```sql
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
  updated_at        TIMESTAMPTZ
);

CREATE INDEX idx_warranties_owner  ON warranties(owner_id);
CREATE INDEX idx_warranties_end    ON warranties(end_date);
CREATE INDEX idx_warranties_status ON warranties(status);
```

---

### Table: `amc_contracts`

```sql
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
  updated_at          TIMESTAMPTZ
);
```

---

### Table: `extended_warranties`

```sql
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
  created_at            TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `job_micro_insurance`

```sql
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
  created_at            TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 12. Module 10 — Marketplace

**Tables: 6**

---

### Table: `marketplace_products`

```sql
CREATE TABLE marketplace_products (
  id                  BIGSERIAL PRIMARY KEY,
  seller_id           BIGINT NOT NULL REFERENCES marketplace_sellers(id),
  product_name        VARCHAR(200) NOT NULL,
  product_type        VARCHAR(30) NOT NULL,  -- SPARE_PART/TOOL/CONSUMABLE/REFURBISHED
  category            VARCHAR(100) NOT NULL,
  brand               VARCHAR(100),
  model_compatibility JSONB DEFAULT '[]',
  sku                 VARCHAR(100) UNIQUE,
  part_number         VARCHAR(100),
  part_quality        VARCHAR(20) NOT NULL,  -- OEM/COMPATIBLE/REFURBISHED
  description         TEXT,
  images              JSONB DEFAULT '[]',
  price               DECIMAL(10,2) NOT NULL,
  discounted_price    DECIMAL(10,2),
  stock_quantity      INT DEFAULT 0,
  min_order_quantity  INT DEFAULT 1,
  warranty_months     INT DEFAULT 0,
  weight_grams        INT,
  is_active           BOOLEAN DEFAULT TRUE,
  is_featured         BOOLEAN DEFAULT FALSE,
  avg_rating          DECIMAL(3,2) DEFAULT 0.00,
  total_sold          INT DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ,
  deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_products_seller   ON marketplace_products(seller_id);
CREATE INDEX idx_products_category ON marketplace_products(category);
CREATE INDEX idx_products_quality  ON marketplace_products(part_quality);
```

---

### Table: `marketplace_sellers`

```sql
CREATE TABLE marketplace_sellers (
  id                  BIGSERIAL PRIMARY KEY,
  user_id             BIGINT REFERENCES users(id),
  technician_id       BIGINT REFERENCES technicians(id),
  seller_name         VARCHAR(200) NOT NULL,
  seller_type         VARCHAR(30) NOT NULL,  -- AUTHORIZED_DEALER/TECH/UPTIME_OFFICIAL
  gst_number          VARCHAR(20),
  gst_verified        BOOLEAN DEFAULT FALSE,
  shop_address        TEXT,
  city                VARCHAR(100),
  pincode             VARCHAR(10),
  avg_rating          DECIMAL(3,2) DEFAULT 0.00,
  total_orders        INT DEFAULT 0,
  is_verified         BOOLEAN DEFAULT FALSE,
  verification_status VARCHAR(20) DEFAULT 'PENDING',
  commission_rate     DECIMAL(5,2) DEFAULT 10.00,
  bank_account_id     BIGINT REFERENCES technician_bank_accounts(id),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ
);
```

---

### Table: `marketplace_orders`

```sql
CREATE TABLE marketplace_orders (
  id                  BIGSERIAL PRIMARY KEY,
  order_number        VARCHAR(30) UNIQUE NOT NULL,
  buyer_id            BIGINT NOT NULL,
  buyer_type          VARCHAR(20) NOT NULL,    -- OWNER/TECHNICIAN
  job_id              BIGINT REFERENCES jobs(id),
  delivery_address_id BIGINT REFERENCES user_addresses(id),
  subtotal            DECIMAL(10,2) NOT NULL,
  delivery_charge     DECIMAL(10,2) DEFAULT 0.00,
  discount_amount     DECIMAL(10,2) DEFAULT 0.00,
  gst_amount          DECIMAL(10,2) DEFAULT 0.00,
  total_amount        DECIMAL(10,2) NOT NULL,
  payment_status      VARCHAR(20) DEFAULT 'PENDING',
  order_status        VARCHAR(20) DEFAULT 'PLACED',
  delivery_type       VARCHAR(20) NOT NULL,    -- EXPRESS/SAME_DAY/STANDARD
  estimated_delivery  TIMESTAMPTZ,
  delivered_at        TIMESTAMPTZ,
  tracking_number     VARCHAR(100),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ
);

CREATE INDEX idx_orders_buyer  ON marketplace_orders(buyer_id);
CREATE INDEX idx_orders_job    ON marketplace_orders(job_id);
CREATE INDEX idx_orders_status ON marketplace_orders(order_status);
```

---

### Table: `marketplace_order_items`

```sql
CREATE TABLE marketplace_order_items (
  id                BIGSERIAL PRIMARY KEY,
  order_id          BIGINT NOT NULL REFERENCES marketplace_orders(id),
  product_id        BIGINT NOT NULL REFERENCES marketplace_products(id),
  seller_id         BIGINT NOT NULL REFERENCES marketplace_sellers(id),
  product_name      VARCHAR(200) NOT NULL,
  part_quality      VARCHAR(20) NOT NULL,
  quantity          INT NOT NULL DEFAULT 1,
  unit_price        DECIMAL(10,2) NOT NULL,
  total_price       DECIMAL(10,2) NOT NULL,
  warranty_months   INT DEFAULT 0,
  warranty_expires_at DATE,
  status            VARCHAR(20) DEFAULT 'PENDING',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `marketplace_refurbished`

```sql
CREATE TABLE marketplace_refurbished (
  id                  BIGSERIAL PRIMARY KEY,
  product_id          BIGINT NOT NULL REFERENCES marketplace_products(id),
  device_category     VARCHAR(30) NOT NULL,
  brand               VARCHAR(100) NOT NULL,
  model               VARCHAR(200) NOT NULL,
  grade               VARCHAR(10) NOT NULL,   -- A_PLUS/A/B/C
  original_price      DECIMAL(12,2),
  refurbished_price   DECIMAL(12,2) NOT NULL,
  condition_report    TEXT NOT NULL,
  defects_disclosed   TEXT,
  battery_health      DECIMAL(5,2),
  storage_gb          INT,
  color               VARCHAR(50),
  imei_verified       BOOLEAN DEFAULT FALSE,
  imei_clean          BOOLEAN DEFAULT FALSE,  -- not stolen
  data_wiped          BOOLEAN DEFAULT FALSE,
  certified_by        BIGINT REFERENCES technicians(id),
  certification_date  DATE,
  warranty_months     INT DEFAULT 6,
  images              JSONB DEFAULT '[]',
  video_url           VARCHAR(500),
  co2_saved_kg        DECIMAL(6,2),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `spare_parts_requests`

```sql
CREATE TABLE spare_parts_requests (
  id                    BIGSERIAL PRIMARY KEY,
  requester_id          BIGINT NOT NULL,
  requester_type        VARCHAR(20) NOT NULL,
  part_name             VARCHAR(200) NOT NULL,
  part_number           VARCHAR(100),
  device_brand          VARCHAR(100),
  device_model          VARCHAR(200),
  description           TEXT,
  max_budget            DECIMAL(10,2),
  urgency               VARCHAR(20) DEFAULT 'NORMAL',
  status                VARCHAR(20) DEFAULT 'OPEN',
  responses_count       INT DEFAULT 0,
  fulfilled_by_seller_id BIGINT REFERENCES marketplace_sellers(id),
  expires_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 13. Module 11 — Notifications

**Tables: 6**

---

### Table: `notifications`

```sql
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
  expires_at        TIMESTAMPTZ
);

CREATE INDEX idx_notif_recipient ON notifications(recipient_id, recipient_type);
CREATE INDEX idx_notif_type      ON notifications(notification_type);
CREATE INDEX idx_notif_unread    ON notifications(is_read);
CREATE INDEX idx_notif_created   ON notifications(created_at);
```

---

### Table: `notification_templates`

```sql
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
  updated_at        TIMESTAMPTZ
);

CREATE UNIQUE INDEX uq_notif_template ON notification_templates(template_name, language, channel);
```

---

### Table: `notification_preferences`

```sql
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
  updated_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX uq_notif_pref ON notification_preferences(user_id, notification_type);
```

---

### Table: `mass_notifications`

```sql
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
  created_by        BIGINT REFERENCES admin_users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `notification_analytics`

```sql
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
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_notif_analytics ON notification_analytics(notification_type, channel, date);
```

---

### Table: `push_delivery_logs`

```sql
CREATE TABLE push_delivery_logs (
  id              BIGSERIAL PRIMARY KEY,
  notification_id BIGINT NOT NULL REFERENCES notifications(id),
  device_id       BIGINT REFERENCES user_devices(id),
  fcm_message_id  VARCHAR(200),
  delivery_status VARCHAR(20) DEFAULT 'SENT',  -- SENT/DELIVERED/FAILED/BOUNCED/OPENED
  failure_reason  TEXT,
  sent_at         TIMESTAMPTZ DEFAULT NOW(),
  delivered_at    TIMESTAMPTZ,
  opened_at       TIMESTAMPTZ
);

CREATE INDEX idx_push_logs_notif ON push_delivery_logs(notification_id);
```

---

## 14. Module 12 — Analytics & Logs

**Tables: 6**

---

### Table: `platform_analytics`

```sql
CREATE TABLE platform_analytics (
  id            BIGSERIAL PRIMARY KEY,
  date          DATE NOT NULL,
  industry      VARCHAR(20) NOT NULL,
  city          VARCHAR(100),
  metric_type   VARCHAR(50) NOT NULL,
  metric_value  DECIMAL(15,2) NOT NULL,
  period_type   VARCHAR(20) NOT NULL,    -- DAILY/WEEKLY/MONTHLY
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_platform_analytics
  ON platform_analytics(date, industry, city, metric_type, period_type);
```

---

### Table: `search_logs`

```sql
CREATE TABLE search_logs (
  id                BIGSERIAL PRIMARY KEY,
  user_id           BIGINT,
  user_type         VARCHAR(20),
  search_query      TEXT NOT NULL,
  search_type       VARCHAR(30) NOT NULL, -- TECHNICIAN/WIKI/PARTS/JOBS
  results_count     INT DEFAULT 0,
  clicked_result_id BIGINT,
  platform          VARCHAR(20) NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_logs_type ON search_logs(search_type);
CREATE INDEX idx_search_logs_user ON search_logs(user_id);
```

---

### Table: `api_logs`

```sql
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
  created_at        TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (EXTRACT(YEAR FROM created_at));

CREATE INDEX idx_api_logs_endpoint ON api_logs(endpoint);
CREATE INDEX idx_api_logs_error    ON api_logs(is_error);
CREATE INDEX idx_api_logs_created  ON api_logs(created_at);
```

---

### Table: `error_logs`

```sql
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
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_error_logs_severity ON error_logs(severity);
CREATE INDEX idx_error_logs_type     ON error_logs(error_type);
CREATE INDEX idx_error_logs_resolved ON error_logs(is_resolved);
```

---

### Table: `audit_logs`

```sql
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
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
-- Audit logs are IMMUTABLE — trigger prevents UPDATE/DELETE

CREATE INDEX idx_audit_actor    ON audit_logs(actor_id);
CREATE INDEX idx_audit_entity   ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_action   ON audit_logs(action);
CREATE INDEX idx_audit_created  ON audit_logs(created_at);
```

---

### Table: `user_activity_logs`

```sql
CREATE TABLE user_activity_logs (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  user_type       VARCHAR(20) NOT NULL,
  activity_type   VARCHAR(50) NOT NULL,
  platform        VARCHAR(20) NOT NULL,
  metadata        JSONB,
  ip_address      VARCHAR(45),
  created_at      TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (EXTRACT(YEAR FROM created_at));

CREATE INDEX idx_activity_user ON user_activity_logs(user_id);
CREATE INDEX idx_activity_type ON user_activity_logs(activity_type);
```

---

## 15. Module 13 — Wiki & Knowledge

**Tables: 5**

---

### Table: `wiki_articles`

```sql
CREATE TABLE wiki_articles (
  id                    BIGSERIAL PRIMARY KEY,
  title                 VARCHAR(300) NOT NULL,
  slug                  VARCHAR(300) UNIQUE NOT NULL,
  industry              VARCHAR(20) NOT NULL,
  device_brand          VARCHAR(100),
  device_model          VARCHAR(200),
  fault_category        VARCHAR(100) NOT NULL,
  fault_description     TEXT NOT NULL,
  root_cause            TEXT,
  fix_steps             JSONB NOT NULL,
  difficulty            VARCHAR(20) NOT NULL,   -- EASY/MEDIUM/HARD/PROFESSIONAL
  tools_required        JSONB DEFAULT '[]',
  parts_required        JSONB DEFAULT '[]',
  estimated_cost_min    DECIMAL(10,2),
  estimated_cost_max    DECIMAL(10,2),
  estimated_time_mins   INT,
  success_rate          DECIMAL(5,2) DEFAULT 0.00,
  total_attempts        INT DEFAULT 0,
  total_successes       INT DEFAULT 0,
  is_diy_safe           BOOLEAN DEFAULT FALSE,
  safety_warnings       JSONB DEFAULT '[]',
  india_specific        BOOLEAN DEFAULT FALSE,
  india_region          VARCHAR(50),
  climate_condition     VARCHAR(30),
  monsoon_specific      BOOLEAN DEFAULT FALSE,
  power_quality_note    TEXT,
  language              VARCHAR(10) DEFAULT 'en',
  is_auto_generated     BOOLEAN DEFAULT FALSE,
  is_verified           BOOLEAN DEFAULT FALSE,
  is_featured           BOOLEAN DEFAULT FALSE,
  views_count           INT DEFAULT 0,
  helpful_count         INT DEFAULT 0,
  not_helpful_count     INT DEFAULT 0,
  created_by            BIGINT,
  created_by_type       VARCHAR(20),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ,
  deleted_at            TIMESTAMPTZ
);

CREATE UNIQUE INDEX uq_wiki_slug ON wiki_articles(slug);
CREATE INDEX idx_wiki_industry  ON wiki_articles(industry);
CREATE INDEX idx_wiki_fault     ON wiki_articles(fault_category);
CREATE INDEX idx_wiki_verified  ON wiki_articles(is_verified);
CREATE INDEX idx_wiki_fulltext  ON wiki_articles
  USING gin(to_tsvector('english', title || ' ' || fault_category || ' ' || fault_description));
```

---

### Table: `wiki_versions`

```sql
CREATE TABLE wiki_versions (
  id                BIGSERIAL PRIMARY KEY,
  article_id        BIGINT NOT NULL REFERENCES wiki_articles(id),
  version_number    INT NOT NULL,
  content_snapshot  JSONB NOT NULL,
  change_summary    TEXT,
  changed_by        BIGINT NOT NULL,
  changed_by_type   VARCHAR(20) NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wiki_versions_article ON wiki_versions(article_id);
```

---

### Table: `wiki_contributions`

```sql
CREATE TABLE wiki_contributions (
  id                BIGSERIAL PRIMARY KEY,
  article_id        BIGINT NOT NULL REFERENCES wiki_articles(id),
  contributor_id    BIGINT NOT NULL,
  contributor_type  VARCHAR(20) NOT NULL,
  contribution_type VARCHAR(30) NOT NULL,  -- CREATED/EDITED/VERIFIED/FIX_ADDED
  points_earned     INT DEFAULT 0,
  job_reference_id  BIGINT REFERENCES jobs(id),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `wiki_votes`

```sql
CREATE TABLE wiki_votes (
  id            BIGSERIAL PRIMARY KEY,
  article_id    BIGINT NOT NULL REFERENCES wiki_articles(id),
  voter_id      BIGINT NOT NULL,
  voter_type    VARCHAR(20) NOT NULL,
  vote_type     VARCHAR(20) NOT NULL,  -- HELPFUL/NOT_HELPFUL
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_wiki_vote ON wiki_votes(article_id, voter_id);
```

---

### Table: `wiki_comments`

```sql
CREATE TABLE wiki_comments (
  id              BIGSERIAL PRIMARY KEY,
  article_id      BIGINT NOT NULL REFERENCES wiki_articles(id),
  parent_id       BIGINT REFERENCES wiki_comments(id),
  commenter_id    BIGINT NOT NULL,
  commenter_type  VARCHAR(20) NOT NULL,
  comment_text    TEXT NOT NULL,
  language        VARCHAR(10) DEFAULT 'en',
  is_verified_fix BOOLEAN DEFAULT FALSE,
  helpful_votes   INT DEFAULT 0,
  is_reported     BOOLEAN DEFAULT FALSE,
  is_hidden       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ,
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_wiki_comments_article ON wiki_comments(article_id);
CREATE INDEX idx_wiki_comments_parent  ON wiki_comments(parent_id);
```

---

## 16. Module 14 — Admin & Platform

**Tables: 7**

---

### Table: `admin_users`

```sql
CREATE TABLE admin_users (
  id                  BIGSERIAL PRIMARY KEY,
  full_name           VARCHAR(100) NOT NULL,
  email               VARCHAR(150) UNIQUE NOT NULL,
  phone               VARCHAR(15) UNIQUE,
  password_hash       VARCHAR(255) NOT NULL,      -- bcrypt 12 rounds
  role_id             BIGINT REFERENCES admin_roles(id),
  profile_photo_url   VARCHAR(500),
  is_active           BOOLEAN DEFAULT TRUE,
  is_2fa_enabled      BOOLEAN DEFAULT TRUE,       -- mandatory
  two_fa_secret       TEXT,                       -- encrypted TOTP secret
  allowed_ips         JSONB DEFAULT '[]',         -- IP whitelist
  last_login_at       TIMESTAMPTZ,
  last_login_ip       VARCHAR(45),
  failed_login_count  INT DEFAULT 0,
  locked_until        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ,
  deleted_at          TIMESTAMPTZ
);
```

---

### Table: `admin_roles`

```sql
CREATE TABLE admin_roles (
  id          BIGSERIAL PRIMARY KEY,
  role_name   VARCHAR(100) UNIQUE NOT NULL,
  role_slug   VARCHAR(50) UNIQUE NOT NULL,   -- SUPER_ADMIN/OPS_ADMIN/FINANCE_ADMIN
  description TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `admin_permissions`

```sql
CREATE TABLE admin_permissions (
  id          BIGSERIAL PRIMARY KEY,
  role_id     BIGINT NOT NULL REFERENCES admin_roles(id),
  permission  VARCHAR(100) NOT NULL,           -- VERIFY_TECHNICIAN/RESOLVE_DISPUTE etc.
  can_read    BOOLEAN DEFAULT TRUE,
  can_create  BOOLEAN DEFAULT FALSE,
  can_update  BOOLEAN DEFAULT FALSE,
  can_delete  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_role_permission ON admin_permissions(role_id, permission);
```

---

### Table: `platform_settings`

```sql
CREATE TABLE platform_settings (
  id                BIGSERIAL PRIMARY KEY,
  setting_key       VARCHAR(100) UNIQUE NOT NULL,
  setting_value     TEXT NOT NULL,
  value_type        VARCHAR(20) NOT NULL,  -- STRING/INTEGER/DECIMAL/BOOLEAN/JSON
  description       TEXT,
  industry          VARCHAR(20) DEFAULT 'ALL',
  is_sensitive      BOOLEAN DEFAULT FALSE,
  last_modified_by  BIGINT REFERENCES admin_users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ
);
```

---

### Table: `feature_flags`

```sql
CREATE TABLE feature_flags (
  id                    BIGSERIAL PRIMARY KEY,
  feature_name          VARCHAR(100) UNIQUE NOT NULL,
  feature_slug          VARCHAR(100) UNIQUE NOT NULL,
  description           TEXT,
  is_enabled            BOOLEAN DEFAULT FALSE,
  enabled_for           VARCHAR(30) DEFAULT 'ALL',   -- ALL/BETA/PREMIUM/SPECIFIC
  enabled_user_ids      JSONB DEFAULT '[]',
  industry              VARCHAR(20) DEFAULT 'ALL',
  rollout_percentage    INT DEFAULT 100,
  last_modified_by      BIGINT REFERENCES admin_users(id),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ
);
```

---

### Table: `cookie_consents`

```sql
CREATE TABLE cookie_consents (
  id                  BIGSERIAL PRIMARY KEY,
  user_id             BIGINT REFERENCES users(id),
  session_id          VARCHAR(100),
  ip_address          VARCHAR(45) NOT NULL,
  essential_cookies   BOOLEAN DEFAULT TRUE,
  functional_cookies  BOOLEAN DEFAULT FALSE,
  analytics_cookies   BOOLEAN DEFAULT FALSE,
  marketing_cookies   BOOLEAN DEFAULT FALSE,
  consent_version     VARCHAR(20) NOT NULL,
  platform            VARCHAR(20) NOT NULL,
  user_agent          VARCHAR(300),
  consented_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ,
  withdrawn_at        TIMESTAMPTZ
);
```

---

### Table: `end_of_life_records`

```sql
CREATE TABLE end_of_life_records (
  id                    BIGSERIAL PRIMARY KEY,
  owner_id              BIGINT NOT NULL REFERENCES users(id),
  device_id             BIGINT REFERENCES devices(id),
  vehicle_id            BIGINT REFERENCES vehicles(id),
  machine_id            BIGINT REFERENCES machines(id),
  asset_name            VARCHAR(200) NOT NULL,
  asset_type            VARCHAR(20) NOT NULL,
  years_of_service      DECIMAL(4,1),
  total_repairs         INT DEFAULT 0,
  total_repair_cost     DECIMAL(12,2) DEFAULT 0.00,
  photos_count          INT DEFAULT 0,
  videos_count          INT DEFAULT 0,
  farewell_note         TEXT,
  memory_reel_url       VARCHAR(500),
  memory_reel_generated BOOLEAN DEFAULT FALSE,
  life_certificate_url  VARCHAR(500),
  data_wiped            BOOLEAN DEFAULT FALSE,
  data_wipe_cert_url    VARCHAR(500),
  disposal_method       VARCHAR(30) NOT NULL,  -- RECYCLED/SOLD_PARTS/DONATED/DISPOSED
  disposal_partner      VARCHAR(100),
  co2_saved_kg          DECIMAL(8,2) DEFAULT 0.00,
  green_points_earned   INT DEFAULT 0,
  social_shares_count   INT DEFAULT 0,
  memorial_wall_posted  BOOLEAN DEFAULT FALSE,
  hash_value            VARCHAR(64),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 17. Additional Tables

---

### Table: `engine_fingerprints`

```sql
CREATE TABLE engine_fingerprints (
  id                      BIGSERIAL PRIMARY KEY,
  vehicle_id              BIGINT NOT NULL REFERENCES vehicles(id),
  owner_id                BIGINT NOT NULL REFERENCES users(id),
  baseline_recording_url  VARCHAR(500),
  frequency_data          JSONB,               -- FFT frequency components
  harmonic_patterns       JSONB,
  cylinder_firing_data    JSONB,
  health_match_percentage DECIMAL(5,2) DEFAULT 100.00,
  last_recorded_at        TIMESTAMPTZ,
  recordings_count        INT DEFAULT 0,
  status                  VARCHAR(20) DEFAULT 'ACTIVE',  -- ACTIVE/DEGRADED/CRITICAL
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ
);

CREATE INDEX idx_engine_fp_vehicle ON engine_fingerprints(vehicle_id);
```

---

### Table: `vehicle_mood_scores`

```sql
CREATE TABLE vehicle_mood_scores (
  id                    BIGSERIAL PRIMARY KEY,
  vehicle_id            BIGINT NOT NULL REFERENCES vehicles(id),
  owner_id              BIGINT NOT NULL REFERENCES users(id),
  mood_score            DECIMAL(5,2) NOT NULL,
  mood_status           VARCHAR(20),   -- EXCELLENT/HAPPY/NEUTRAL/UNHAPPY/STRESSED/CRITICAL
  engine_score          DECIMAL(5,2),
  tyre_score            DECIMAL(5,2),
  battery_score         DECIMAL(5,2),
  brake_score           DECIMAL(5,2),
  fuel_system_score     DECIMAL(5,2),
  suspension_score      DECIMAL(5,2),
  electrical_score      DECIMAL(5,2),
  weather_factor        DECIMAL(5,2),
  usage_factor          DECIMAL(5,2),
  environmental_factor  DECIMAL(5,2),
  ai_recommendation     TEXT,
  trip_recommendation   TEXT,
  recorded_date         DATE NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mood_scores_vehicle ON vehicle_mood_scores(vehicle_id);
CREATE INDEX idx_mood_scores_date    ON vehicle_mood_scores(recorded_date);
```

---

### Table: `virtual_consultations`

```sql
CREATE TABLE virtual_consultations (
  id                    BIGSERIAL PRIMARY KEY,
  job_id                BIGINT REFERENCES jobs(id),
  owner_id              BIGINT NOT NULL REFERENCES users(id),
  technician_id         BIGINT NOT NULL REFERENCES technicians(id),
  industry              VARCHAR(20) NOT NULL,
  consultation_type     VARCHAR(20) NOT NULL,   -- QUICK_CHECK/FULL_DIAGNOSIS/EXTENDED
  fee_charged           DECIMAL(10,2),
  fee_deductible        BOOLEAN DEFAULT TRUE,
  call_platform         VARCHAR(20) DEFAULT 'AGORA',
  agora_channel         VARCHAR(100),
  agora_token_owner     TEXT,
  agora_token_tech      TEXT,
  call_status           VARCHAR(20) DEFAULT 'SCHEDULED',
  outcome               VARCHAR(30),            -- FIXED_REMOTELY/VISIT_NEEDED/INCONCLUSIVE
  remote_fix_description TEXT,
  visit_booked_after    BOOLEAN DEFAULT FALSE,
  physical_job_id       BIGINT REFERENCES jobs(id),
  ai_diagnosis_during   TEXT,
  call_recording_url    VARCHAR(500),
  call_highlights_url   VARCHAR(500),
  ai_report_url         VARCHAR(500),
  annotations_data      JSONB DEFAULT '[]',
  screen_shared         BOOLEAN DEFAULT FALSE,
  duration_secs         INT,
  owner_rating          DECIMAL(3,2),
  technician_rating     DECIMAL(3,2),
  scheduled_at          TIMESTAMPTZ,
  started_at            TIMESTAMPTZ,
  ended_at              TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `job_live_streams`

```sql
CREATE TABLE job_live_streams (
  id                      BIGSERIAL PRIMARY KEY,
  job_id                  BIGINT NOT NULL REFERENCES jobs(id),
  technician_id           BIGINT NOT NULL REFERENCES technicians(id),
  owner_id                BIGINT NOT NULL REFERENCES users(id),
  stream_url              VARCHAR(500),
  recording_url           VARCHAR(500),
  agora_channel           VARCHAR(100),
  stream_status           VARCHAR(20) DEFAULT 'ACTIVE',
  ai_monitoring_enabled   BOOLEAN DEFAULT TRUE,
  ai_alerts_generated     JSONB DEFAULT '[]',
  owner_watched           BOOLEAN DEFAULT FALSE,
  owner_watch_duration_secs INT DEFAULT 0,
  stream_duration_secs    INT DEFAULT 0,
  is_recorded             BOOLEAN DEFAULT FALSE,
  recording_expires_at    TIMESTAMPTZ,
  started_at              TIMESTAMPTZ,
  ended_at                TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `job_negotiations`

```sql
CREATE TABLE job_negotiations (
  id                      BIGSERIAL PRIMARY KEY,
  job_id                  BIGINT NOT NULL REFERENCES jobs(id),
  owner_id                BIGINT NOT NULL REFERENCES users(id),
  technician_id           BIGINT NOT NULL REFERENCES technicians(id),
  ai_suggested_min        DECIMAL(10,2),
  ai_suggested_max        DECIMAL(10,2),
  owner_offered_price     DECIMAL(10,2),
  technician_asked_price  DECIMAL(10,2),
  negotiation_rounds      JSONB DEFAULT '[]',
  final_agreed_price      DECIMAL(10,2),
  ai_fairness_verdict     VARCHAR(20),          -- FAIR/SLIGHTLY_HIGH/OVERPRICED/UNDERPAID
  status                  VARCHAR(20) DEFAULT 'ONGOING',
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ
);
```

---

### Table: `nft_transactions`

```sql
CREATE TABLE nft_transactions (
  id                BIGSERIAL PRIMARY KEY,
  badge_id          BIGINT NOT NULL REFERENCES technician_badges(id),
  technician_id     BIGINT NOT NULL REFERENCES technicians(id),
  blockchain        VARCHAR(20) DEFAULT 'POLYGON',
  contract_address  VARCHAR(200),
  token_id          VARCHAR(200),
  transaction_hash  VARCHAR(200) UNIQUE,
  wallet_address    VARCHAR(200),
  mint_status       VARCHAR(20) DEFAULT 'PENDING',
  gas_fee           DECIMAL(10,6),
  minted_at         TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `workshop_inventory`

```sql
CREATE TABLE workshop_inventory (
  id                BIGSERIAL PRIMARY KEY,
  technician_id     BIGINT NOT NULL REFERENCES technicians(id),
  part_name         VARCHAR(200) NOT NULL,
  part_number       VARCHAR(100),
  category          VARCHAR(100),
  brand             VARCHAR(100),
  current_stock     INT DEFAULT 0,
  min_stock_level   INT DEFAULT 1,
  unit_cost         DECIMAL(10,2),
  total_value       DECIMAL(10,2),
  last_restocked_at TIMESTAMPTZ,
  reorder_triggered BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ
);
```

---

### Table: `iot_sensor_readings`

```sql
CREATE TABLE iot_sensor_readings (
  id              BIGSERIAL PRIMARY KEY,
  device_id       BIGINT NOT NULL REFERENCES devices(id),
  owner_id        BIGINT NOT NULL REFERENCES users(id),
  connection_id   BIGINT REFERENCES smart_home_connections(id),
  sensor_type     VARCHAR(30) NOT NULL,  -- TEMPERATURE/VIBRATION/POWER/SOUND/HUMIDITY
  reading_value   DECIMAL(10,4) NOT NULL,
  reading_unit    VARCHAR(20),
  is_anomaly      BOOLEAN DEFAULT FALSE,
  anomaly_score   DECIMAL(5,2),
  recorded_at     TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (EXTRACT(MONTH FROM recorded_at));

CREATE INDEX idx_iot_device ON iot_sensor_readings(device_id);
CREATE INDEX idx_iot_anomaly ON iot_sensor_readings(is_anomaly);
```

---

### Table: `carbon_credits`

```sql
CREATE TABLE carbon_credits (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id),
  user_type       VARCHAR(20) NOT NULL,
  credit_type     VARCHAR(30) NOT NULL,  -- REPAIR_INSTEAD_REPLACE/REFURBISHED/ECO_DISPOSAL
  credits_earned  DECIMAL(8,2) NOT NULL,
  credits_balance DECIMAL(8,2) NOT NULL,
  credits_redeemed DECIMAL(8,2) DEFAULT 0.00,
  job_id          BIGINT REFERENCES jobs(id),
  device_id       BIGINT REFERENCES devices(id),
  co2_saved_kg    DECIMAL(8,2),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `auction_bonus_history`

```sql
CREATE TABLE auction_bonus_history (
  id                    BIGSERIAL PRIMARY KEY,
  auction_id            BIGINT NOT NULL REFERENCES job_auction(id),
  previous_bonus        DECIMAL(10,2),
  new_bonus             DECIMAL(10,2) NOT NULL,
  increment_reason      VARCHAR(30),  -- TIME_ELAPSED/NO_TAKERS/MANUAL_BOOST
  technicians_notified_count INT DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `tamper_proof_verifications`

```sql
CREATE TABLE tamper_proof_verifications (
  id                BIGSERIAL PRIMARY KEY,
  entity_type       VARCHAR(30) NOT NULL,  -- JOB/INVOICE/SCAN/CERTIFICATE
  entity_id         BIGINT NOT NULL,
  hash_value        VARCHAR(64) NOT NULL,
  verification_status VARCHAR(20) NOT NULL, -- VALID/TAMPERED/UNKNOWN
  verified_by_id    BIGINT,
  verified_by_type  VARCHAR(20),
  verified_at       TIMESTAMPTZ DEFAULT NOW(),
  ip_address        VARCHAR(45)
);
```

---

### Table: `app_versions`

```sql
CREATE TABLE app_versions (
  id                    BIGSERIAL PRIMARY KEY,
  platform              VARCHAR(20) NOT NULL,  -- ANDROID/IOS/WEB
  app_type              VARCHAR(20) NOT NULL,  -- OWNER/TECHNICIAN/ADMIN
  version_number        VARCHAR(20) NOT NULL,
  version_code          INT,
  release_notes         JSONB,                 -- multilingual
  is_force_update       BOOLEAN DEFAULT FALSE,
  min_supported_version VARCHAR(20),
  download_url          VARCHAR(500),
  is_active             BOOLEAN DEFAULT TRUE,
  released_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `referral_campaigns`

```sql
CREATE TABLE referral_campaigns (
  id                  BIGSERIAL PRIMARY KEY,
  campaign_name       VARCHAR(100) NOT NULL,
  campaign_type       VARCHAR(30) NOT NULL,
  referrer_reward     DECIMAL(8,2) NOT NULL,
  referred_reward     DECIMAL(8,2) NOT NULL,
  total_referrals     INT DEFAULT 0,
  total_conversions   INT DEFAULT 0,
  total_rewards_paid  DECIMAL(12,2) DEFAULT 0.00,
  is_active           BOOLEAN DEFAULT TRUE,
  start_date          DATE NOT NULL,
  end_date            DATE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `platform_health_scores`

```sql
CREATE TABLE platform_health_scores (
  id                      BIGSERIAL PRIMARY KEY,
  health_score            DECIMAL(5,2) NOT NULL,
  active_tech_ratio       DECIMAL(5,2),
  job_success_rate        DECIMAL(5,2),
  dispute_rate            DECIMAL(5,2),
  ai_accuracy_rate        DECIMAL(5,2),
  avg_response_time_secs  INT,
  payment_success_rate    DECIMAL(5,2),
  app_crash_rate          DECIMAL(5,2),
  epidemic_count          INT DEFAULT 0,
  silent_killer_alerts    INT DEFAULT 0,
  carbon_credits_issued   DECIMAL(8,2) DEFAULT 0.00,
  wiki_articles_added     INT DEFAULT 0,
  nft_badges_minted       INT DEFAULT 0,
  status                  VARCHAR(20),   -- EXCELLENT/GOOD/FAIR/POOR
  alerts_generated        JSONB DEFAULT '[]',
  recorded_at             TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `vehicle_scan_details`

```sql
CREATE TABLE vehicle_scan_details (
  id                BIGSERIAL PRIMARY KEY,
  scan_id           BIGINT NOT NULL REFERENCES pre_purchase_scans(id),
  inspection_area   VARCHAR(30) NOT NULL,  -- BODY_PAINT/ENGINE/ELECTRICAL/CHASSIS
  findings          JSONB,
  photos_taken      JSONB DEFAULT '[]',
  ai_analysis_result TEXT,
  severity          VARCHAR(20),           -- PASS/MINOR/MAJOR/FAIL
  recommendation    TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `rate_limit_logs`

```sql
CREATE TABLE rate_limit_logs (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT,
  user_type       VARCHAR(20),
  ip_address      VARCHAR(45) NOT NULL,
  endpoint        VARCHAR(200),
  limit_type      VARCHAR(30),
  requests_count  INT,
  limit_exceeded  BOOLEAN DEFAULT FALSE,
  window_start    TIMESTAMPTZ,
  window_end      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `content_translations`

```sql
CREATE TABLE content_translations (
  id                BIGSERIAL PRIMARY KEY,
  content_type      VARCHAR(50) NOT NULL,   -- FAULT_CATEGORY/AI_DIAGNOSIS/WIKI_ARTICLE
  content_id        BIGINT NOT NULL,
  original_language VARCHAR(10) NOT NULL,
  translated_language VARCHAR(10) NOT NULL,
  original_text     TEXT NOT NULL,
  translated_text   TEXT NOT NULL,
  translation_method VARCHAR(20) DEFAULT 'AI',  -- AI/HUMAN
  is_verified       BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_translation
  ON content_translations(content_type, content_id, translated_language);
```

---

## 18. Database Views

```sql
-- View 1: Active jobs with full details
CREATE VIEW v_active_jobs AS
SELECT
  j.id, j.job_number, j.status, j.industry, j.urgency,
  j.owner_location, j.created_at, j.estimated_cost_min, j.estimated_cost_max,
  u.full_name AS owner_name, u.phone AS owner_phone,
  t.full_name AS tech_name, t.phone AS tech_phone, t.rating_avg AS tech_rating,
  tl.current_location AS tech_location,
  ms.total_score AS match_score, ms.eta_mins,
  afd.fault_category, afd.urgency AS ai_urgency
FROM jobs j
JOIN users u ON j.owner_id = u.id
LEFT JOIN technicians t ON j.technician_id = t.id
LEFT JOIN technician_locations tl ON t.id = tl.technician_id
LEFT JOIN matching_scores ms ON j.id = ms.job_id
  AND ms.technician_id = j.technician_id
LEFT JOIN ai_fault_diagnoses afd ON j.id = afd.job_id
WHERE j.status NOT IN ('COMPLETED','CANCELLED')
  AND j.deleted_at IS NULL;

-- View 2: Technician dashboard summary
CREATE VIEW v_technician_dashboard AS
SELECT
  t.id, t.full_name, t.rating_avg, t.is_available,
  t.wallet_balance, t.fatigue_score, t.is_fatigue_restricted,
  ts.total_jobs, ts.total_earnings,
  ts.jobs_this_month, ts.earnings_this_month,
  ts.acceptance_rate, ts.completion_rate,
  COUNT(DISTINCT tb.id) AS badges_earned,
  COUNT(DISTINCT ts2.id) AS skills_count
FROM technicians t
JOIN technician_statistics ts ON t.id = ts.technician_id
LEFT JOIN technician_badges tb ON t.id = tb.technician_id
LEFT JOIN technician_skills ts2 ON t.id = ts2.technician_id
WHERE t.deleted_at IS NULL
GROUP BY t.id, t.full_name, t.rating_avg, t.is_available,
  t.wallet_balance, t.fatigue_score, t.is_fatigue_restricted,
  ts.total_jobs, ts.total_earnings,
  ts.jobs_this_month, ts.earnings_this_month,
  ts.acceptance_rate, ts.completion_rate;

-- View 3: Platform summary for admin dashboard
CREATE VIEW v_platform_summary AS
SELECT
  (SELECT COUNT(*) FROM jobs
   WHERE status NOT IN ('COMPLETED','CANCELLED')
     AND deleted_at IS NULL)         AS active_jobs,
  (SELECT COUNT(*) FROM jobs
   WHERE created_at > NOW() - INTERVAL '24 hours'
     AND deleted_at IS NULL)         AS jobs_today,
  (SELECT COUNT(*) FROM technicians
   WHERE is_available = TRUE
     AND deleted_at IS NULL)         AS online_techs,
  (SELECT COUNT(*) FROM technicians
   WHERE verification_status = 'PENDING')  AS pending_verifications,
  (SELECT COUNT(*) FROM job_disputes
   WHERE status = 'OPEN')            AS open_disputes,
  (SELECT COUNT(*) FROM epidemic_detections
   WHERE is_active = TRUE)           AS active_epidemics,
  (SELECT SUM(net_revenue)
   FROM platform_revenue
   WHERE date = CURRENT_DATE)        AS revenue_today;
```

---

## 19. Triggers

```sql
-- Trigger 1: Auto-update technician stats after job completion
CREATE OR REPLACE FUNCTION update_tech_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'COMPLETED' AND OLD.status != 'COMPLETED' THEN
    UPDATE technician_statistics
    SET
      total_jobs = total_jobs + 1,
      total_earnings = total_earnings + COALESCE(NEW.final_cost * 0.9, 0),
      jobs_this_month = jobs_this_month + 1,
      earnings_this_month = earnings_this_month + COALESCE(NEW.final_cost * 0.9, 0),
      last_job_at = NEW.completed_at,
      updated_at = NOW()
    WHERE technician_id = NEW.technician_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_job_complete
  AFTER UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_tech_stats();

-- Trigger 2: Auto-update technician rating average
CREATE OR REPLACE FUNCTION update_rating_avg()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE technicians
  SET
    rating_avg = (
      SELECT COALESCE(AVG(technician_rating), 0)
      FROM job_ratings
      WHERE technician_id = NEW.technician_id
        AND technician_rating IS NOT NULL
    ),
    updated_at = NOW()
  WHERE id = NEW.technician_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_rating_insert
  AFTER INSERT OR UPDATE ON job_ratings
  FOR EACH ROW
  WHEN (NEW.technician_rating IS NOT NULL)
  EXECUTE FUNCTION update_rating_avg();

-- Trigger 3: Prevent modification of audit logs
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable — modification not allowed';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_immutable
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION prevent_audit_modification();

-- Trigger 4: Auto-update digital twin on job completion
CREATE OR REPLACE FUNCTION update_digital_twin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'COMPLETED' AND OLD.status != 'COMPLETED'
     AND NEW.asset_id IS NOT NULL THEN
    UPDATE digital_twins
    SET
      total_repairs = total_repairs + 1,
      total_repair_cost = total_repair_cost + COALESCE(NEW.final_cost, 0),
      last_updated_at = NOW()
    WHERE asset_id = NEW.asset_id AND asset_type = NEW.asset_type;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_job_complete_twin
  AFTER UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_digital_twin();
```

---

## 20. Stored Procedures

```sql
-- Procedure 1: Calculate matching score for a technician
CREATE OR REPLACE FUNCTION sp_calculate_match_score(
  p_distance_km DECIMAL,
  p_skill_tags_tech JSONB,
  p_skill_tags_job JSONB,
  p_rating_avg DECIMAL,
  p_total_jobs INT,
  p_avg_response_secs INT,
  p_is_fatigue_restricted BOOLEAN
) RETURNS DECIMAL AS $$
DECLARE
  v_distance_score DECIMAL;
  v_skill_score DECIMAL;
  v_base_score DECIMAL;
  v_modifier DECIMAL := 0;
  v_matched_skills INT;
  v_total_job_skills INT;
BEGIN
  -- Distance score
  v_distance_score := CASE
    WHEN p_distance_km < 2  THEN 100
    WHEN p_distance_km < 5  THEN 80
    WHEN p_distance_km < 10 THEN 60
    WHEN p_distance_km < 20 THEN 40
    ELSE 20
  END;

  -- Skill score
  v_total_job_skills := jsonb_array_length(p_skill_tags_job);
  IF v_total_job_skills = 0 THEN
    v_skill_score := 50;
  ELSE
    SELECT COUNT(*) INTO v_matched_skills
    FROM jsonb_array_elements_text(p_skill_tags_job) js
    WHERE p_skill_tags_tech @> jsonb_build_array(js);

    v_skill_score := CASE
      WHEN v_matched_skills = v_total_job_skills THEN 100
      WHEN v_matched_skills::DECIMAL / v_total_job_skills > 0.5 THEN 70
      WHEN v_matched_skills::DECIMAL / v_total_job_skills > 0.25 THEN 40
      WHEN v_matched_skills > 0 THEN 20
      ELSE 0
    END;
  END IF;

  -- Base score (40% distance, 60% skill)
  v_base_score := (v_distance_score * 0.40) + (v_skill_score * 0.60);

  -- Modifiers
  IF p_rating_avg > 4.5 THEN v_modifier := v_modifier + 10; END IF;
  IF p_rating_avg > 4.0 AND p_rating_avg <= 4.5 THEN v_modifier := v_modifier + 5; END IF;
  IF p_total_jobs > 100 THEN v_modifier := v_modifier + 5; END IF;
  IF p_avg_response_secs IS NOT NULL AND p_avg_response_secs < 120 THEN
    v_modifier := v_modifier + 5;
  END IF;
  IF p_is_fatigue_restricted THEN v_modifier := v_modifier - 50; END IF;

  RETURN LEAST(100, GREATEST(0, v_base_score + v_modifier));
END;
$$ LANGUAGE plpgsql;


-- Procedure 2: Generate unique job number
CREATE OR REPLACE FUNCTION sp_generate_job_number()
RETURNS VARCHAR AS $$
DECLARE
  v_year INT := EXTRACT(YEAR FROM NOW());
  v_count INT;
  v_number VARCHAR(20);
BEGIN
  SELECT COUNT(*) + 1 INTO v_count
  FROM jobs
  WHERE EXTRACT(YEAR FROM created_at) = v_year;

  v_number := 'UPT-' || v_year || '-' || LPAD(v_count::TEXT, 5, '0');
  RETURN v_number;
END;
$$ LANGUAGE plpgsql;
```

---

## 21. Indexes & Spatial

```sql
-- All GIST indexes for PostGIS spatial queries
CREATE INDEX idx_user_addresses_location
  ON user_addresses USING GIST(location);

CREATE INDEX idx_tech_locations_current
  ON technician_locations USING GIST(current_location);

CREATE INDEX idx_tech_service_areas_center
  ON technician_service_areas USING GIST(center_location);

CREATE INDEX idx_jobs_owner_location
  ON jobs USING GIST(owner_location);

CREATE INDEX idx_vehicle_fuel_location
  ON vehicle_fuel_logs USING GIST(location);

CREATE INDEX idx_insurance_claims_location
  ON insurance_claims USING GIST(incident_location);

CREATE INDEX idx_live_tracking_location
  ON live_location_tracking USING GIST(location);

CREATE INDEX idx_iot_sensor_readings_device
  ON iot_sensor_readings(device_id);

-- Full-text search
CREATE INDEX idx_wiki_fulltext
  ON wiki_articles
  USING gin(to_tsvector('english',
    title || ' ' || fault_category || ' ' || fault_description));

-- Composite indexes for common queries
CREATE INDEX idx_jobs_owner_status
  ON jobs(owner_id, status)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_jobs_tech_status
  ON jobs(technician_id, status)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_matching_scores_job_rank
  ON matching_scores(job_id, rank_position);

CREATE INDEX idx_notifications_recipient_unread
  ON notifications(recipient_id, is_read)
  WHERE is_read = FALSE;
```

---

## 22. Partitioned Tables

```sql
-- Partition 1: live_location_tracking by month
CREATE TABLE live_location_tracking_jan
  PARTITION OF live_location_tracking
  FOR VALUES FROM (1) TO (2);

CREATE TABLE live_location_tracking_feb
  PARTITION OF live_location_tracking
  FOR VALUES FROM (2) TO (3);
-- ... partitions for all 12 months

-- Partition 2: api_logs by year
CREATE TABLE api_logs_2026
  PARTITION OF api_logs
  FOR VALUES FROM (2026) TO (2027);

CREATE TABLE api_logs_2027
  PARTITION OF api_logs
  FOR VALUES FROM (2027) TO (2028);

-- Partition 3: iot_sensor_readings by month (high volume)
-- Similar pattern as live_location_tracking

-- Partition 4: user_activity_logs by year
-- Similar pattern as api_logs

-- Partition 5: jobs by year (future scale)
-- jobs table itself not partitioned yet
-- Plan: partition when > 1M rows
```

---

## 23. Complete ER Summary

```
CORE RELATIONSHIPS:

users (1) ──────────────────── (M) jobs [as owner]
users (1) ──────────────────── (M) user_addresses
users (1) ──────────────────── (1) user_preferences
users (1) ──────────────────── (M) user_devices
users (1) ──────────────────── (M) machines
users (1) ──────────────────── (M) vehicles
users (1) ──────────────────── (M) devices
users (1) ──────────────────── (M) insurance_policies
users (1) ──────────────────── (1) owner_trust_scores

technicians (1) ─────────────── (M) jobs [as assignee]
technicians (1) ─────────────── (M) technician_skills
technicians (1) ─────────────── (M) technician_documents
technicians (1) ─────────────── (1) technician_locations
technicians (1) ─────────────── (1) technician_statistics
technicians (1) ─────────────── (M) technician_badges
technicians (1) ─────────────── (1) technician_bank_accounts
technicians (1) ─────────────── (1) technician_trust_scores

jobs (1) ────────────────────── (1) ai_fault_diagnoses
jobs (1) ────────────────────── (M) job_media
jobs (1) ────────────────────── (M) job_status_history
jobs (1) ────────────────────── (1) job_checklist
jobs (1) ────────────────────── (M) job_parts_used
jobs (1) ────────────────────── (M) job_timeline
jobs (1) ────────────────────── (1) job_disputes
jobs (1) ────────────────────── (1) job_auction
jobs (1) ────────────────────── (1) job_otp_verifications
jobs (1) ────────────────────── (1) matching_requests
jobs (1) ────────────────────── (M) matching_scores
jobs (1) ────────────────────── (M) live_location_tracking
jobs (1) ────────────────────── (1) transactions
jobs (1) ────────────────────── (1) job_ratings
jobs (1) ────────────────────── (1) ai_copilot_sessions
jobs (1) ────────────────────── (1) virtual_consultations
jobs (1) ────────────────────── (1) job_micro_insurance
jobs (1) ────────────────────── (1) job_negotiations

machines  → (1) digital_twins → (M) digital_twin_components
vehicles  → (1) digital_twins
devices   → (1) digital_twins

digital_twins (1) ────────────── (M) repair_predictions

vehicles (1) → (1) engine_fingerprints
vehicles (1) → (M) vehicle_mood_scores
vehicles (1) → (M) vehicle_documents
vehicles (1) → (M) vehicle_fuel_logs
vehicles (1) → (M) driver_safety_scores
vehicles (1) → (M) pre_purchase_scans → (M) vehicle_scan_details

devices (1) → (M) device_health_logs
devices (1) → (M) device_service_history
devices (1) → (M) iot_sensor_readings
devices (1) → (M) silent_killer_alerts

TOTAL TABLE COUNT:
  Module 1  (Users & Auth):         8
  Module 2  (Technicians):          10
  Module 3  (Jobs & Workflow):      12
  Module 4  (AI & Diagnosis):       12
  Module 5  (Matching):              6
  Module 6  (Payments):             10
  Module 7  (Ratings):               7
  Module 8  (Industry Specific):    12
  Module 9  (Insurance):             6
  Module 10 (Marketplace):           6
  Module 11 (Notifications):         6
  Module 12 (Analytics & Logs):      6
  Module 13 (Wiki):                  5
  Module 14 (Admin):                 7
  Additional tables:                18
  ────────────────────────────────────
  TOTAL:                           141+ tables
```

---

*UPTIME Database Documentation — v1.0*  
*"Downtime ends here."*  
*DSATM Bengaluru — VTU — 2026-27*

---

## Appendix — Missing Table & Business Rules

### Table: `vehicle_service_history`

```sql
CREATE TABLE vehicle_service_history (
  id                      BIGSERIAL PRIMARY KEY,
  vehicle_id              BIGINT NOT NULL REFERENCES vehicles(id),
  job_id                  BIGINT REFERENCES jobs(id),
  service_type            VARCHAR(30) NOT NULL,
  -- REPAIR/PERIODIC_SERVICE/OIL_CHANGE/TYRE_ROTATION
  -- INSURANCE_REPAIR/ROADSIDE/INSPECTION/PRE_PURCHASE_SCAN
  fault_category          VARCHAR(100),
  workshop_name           VARCHAR(200),
  technician_id           BIGINT REFERENCES technicians(id),
  odometer_at_service     INT,
  work_done               TEXT NOT NULL,
  parts_replaced          JSONB DEFAULT '[]',
  cost                    DECIMAL(10,2) DEFAULT 0.00,
  next_service_km         INT,
  next_service_date       DATE,
  service_certificate_url VARCHAR(500),
  service_date            DATE NOT NULL,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_veh_svc_vehicle ON vehicle_service_history(vehicle_id);
CREATE INDEX idx_veh_svc_job     ON vehicle_service_history(job_id);
CREATE INDEX idx_veh_svc_date    ON vehicle_service_history(service_date);
```

---

### Payment Escrow Rules

```
Escrow flow for all job payments:

1. Owner pays → money held in platform escrow
   (Razorpay order captured, NOT released to tech)

2. Job completed → 24-hour hold begins
   wallet_transactions.payout_status = 'PENDING'
   wallet_transactions.payout_eligible_at = completed_at + 24h

3. During 24 hours:
   → Owner can raise dispute → hold extended
   → No dispute → auto-release at 24h mark

4. PayoutScheduler (11 AM daily):
   → Finds all eligible wallet_transactions
   → WHERE payout_status = 'PENDING'
     AND payout_eligible_at < NOW()
     AND no open dispute for this job
   → Initiates Razorpay payout to tech bank
   → Updates payout_status = 'PROCESSED'

5. Dispute raised:
   → Payout held until admin resolves
   → Admin verdict: refund owner OR release to tech
   → Either way escrow is released

Escrow tracked via:
  transactions.status         = CAPTURED (held)
  wallet_transactions.payout_status = PENDING → PROCESSED
  payouts.status              = INITIATED → PROCESSED
```



---

## 24. Migration V18 — Technician KYC & Skill Verification

> **Added per TECHNICIAN_VERIFICATION.md Section 8.** V2 remains untouched. This migration adds verification levels (L0-L3), provisional tracking, document categorization, identity verifications, trade verifications, skill tests, references, and KYC audit logs.

## 8. Database Migration (V18)

> V2 is already planned. Do NOT edit V2 if it has been applied; add this new migration.

```sql
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
```

---

