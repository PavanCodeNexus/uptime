-- V8: Industry Specific Module

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
  deleted_at          TIMESTAMPTZ);

CREATE INDEX idx_machines_owner ON machines(owner_id);
CREATE INDEX idx_machines_type  ON machines(machine_type);
CREATE INDEX idx_machines_status ON machines(current_status);


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
  created_at              TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_machine_svc_machine ON machine_service_history(machine_id);


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
  engine_fingerprint_id   BIGINT,
  is_active               BOOLEAN DEFAULT TRUE,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ,
  deleted_at              TIMESTAMPTZ);

CREATE INDEX idx_vehicles_owner ON vehicles(owner_id);
CREATE INDEX idx_vehicles_type  ON vehicles(vehicle_type);
CREATE INDEX idx_vehicles_reg   ON vehicles(registration_number);
CREATE INDEX idx_vehicles_insurance_exp ON vehicles(insurance_expiry);
CREATE INDEX idx_vehicles_puc_exp ON vehicles(puc_expiry);


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
  updated_at          TIMESTAMPTZ);

CREATE INDEX idx_veh_docs_vehicle ON vehicle_documents(vehicle_id);
CREATE INDEX idx_veh_docs_expiry  ON vehicle_documents(expiry_date);


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
  created_at          TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_fuel_logs_vehicle ON vehicle_fuel_logs(vehicle_id);
CREATE INDEX idx_fuel_logs_location ON vehicle_fuel_logs USING GIST(location);


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
  created_at              TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_safety_scores_owner ON driver_safety_scores(owner_id);
CREATE INDEX idx_safety_scores_vehicle ON driver_safety_scores(vehicle_id);


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
  created_at              TIMESTAMPTZ DEFAULT NOW());


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
  deleted_at              TIMESTAMPTZ);

CREATE INDEX idx_devices_owner    ON devices(owner_id);
CREATE INDEX idx_devices_category ON devices(device_category);
CREATE INDEX idx_devices_status   ON devices(current_status);
CREATE INDEX idx_devices_warranty ON devices(warranty_expiry);
CREATE INDEX idx_devices_amc      ON devices(amc_expiry);


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
  logged_at             TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_device_health_device ON device_health_logs(device_id);
CREATE INDEX idx_device_health_anomaly ON device_health_logs(anomaly_detected);


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
  created_at              TIMESTAMPTZ DEFAULT NOW());


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
  updated_at              TIMESTAMPTZ);

CREATE UNIQUE INDEX uq_smart_home ON smart_home_connections(owner_id, platform);

