-- V10: Marketplace Module

CREATE TABLE marketplace_products (
  id                  BIGSERIAL PRIMARY KEY,
  seller_id           BIGINT NOT NULL,
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
  deleted_at          TIMESTAMPTZ);

CREATE INDEX idx_products_seller   ON marketplace_products(seller_id);
CREATE INDEX idx_products_category ON marketplace_products(category);
CREATE INDEX idx_products_quality  ON marketplace_products(part_quality);


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
  updated_at          TIMESTAMPTZ);


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
  updated_at          TIMESTAMPTZ);

CREATE INDEX idx_orders_buyer  ON marketplace_orders(buyer_id);
CREATE INDEX idx_orders_job    ON marketplace_orders(job_id);
CREATE INDEX idx_orders_status ON marketplace_orders(order_status);


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
  created_at        TIMESTAMPTZ DEFAULT NOW());


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
  created_at          TIMESTAMPTZ DEFAULT NOW());


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
  created_at            TIMESTAMPTZ DEFAULT NOW());

