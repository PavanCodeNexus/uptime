-- V6: Payments & Finance Module

CREATE TABLE transactions (
  id                    BIGSERIAL PRIMARY KEY,
  transaction_number    VARCHAR(30) UNIQUE NOT NULL,
  job_id                BIGINT REFERENCES jobs(id),
  owner_id              BIGINT NOT NULL REFERENCES users(id),
  technician_id         BIGINT REFERENCES technicians(id),
  amount                DECIMAL(10,2) NOT NULL,
  currency              VARCHAR(5) DEFAULT 'INR',
  payment_method        VARCHAR(30),
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
  idempotency_key       VARCHAR(100) UNIQUE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ
);

CREATE INDEX idx_transactions_job ON transactions(job_id);
CREATE INDEX idx_transactions_owner ON transactions(owner_id);
CREATE INDEX idx_transactions_status ON transactions(status);

CREATE TABLE wallet_transactions (
  id              BIGSERIAL PRIMARY KEY,
  technician_id   BIGINT NOT NULL REFERENCES technicians(id),
  type            VARCHAR(20) NOT NULL,
  amount          DECIMAL(10,2) NOT NULL,
  balance_after   DECIMAL(10,2) NOT NULL,
  reference_type  VARCHAR(30),
  reference_id    BIGINT,
  description     TEXT,
  payout_status   VARCHAR(20) DEFAULT 'PENDING',
  payout_eligible_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wallet_tech ON wallet_transactions(technician_id);
CREATE INDEX idx_wallet_type ON wallet_transactions(type);
CREATE INDEX idx_wallet_payout ON wallet_transactions(payout_status);

CREATE TABLE payouts (
  id                    BIGSERIAL PRIMARY KEY,
  payout_number         VARCHAR(30) UNIQUE NOT NULL,
  technician_id         BIGINT NOT NULL REFERENCES technicians(id),
  bank_account_id       BIGINT REFERENCES technician_bank_accounts(id),
  amount                DECIMAL(10,2) NOT NULL,
  tds_amount            DECIMAL(10,2) DEFAULT 0.00,
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

CREATE TABLE subscription_plans (
  id                BIGSERIAL PRIMARY KEY,
  plan_name         VARCHAR(50) UNIQUE NOT NULL,
  display_name      VARCHAR(100),
  price_monthly     DECIMAL(10,2) NOT NULL,
  jobs_per_month    INT,
  machines_limit    INT,
  ai_calls_limit    INT,
  priority_matching BOOLEAN DEFAULT FALSE,
  video_consults    INT DEFAULT 0,
  marketplace_discount DECIMAL(5,2) DEFAULT 0.00,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE invoices (
  id                BIGSERIAL PRIMARY KEY,
  invoice_number    VARCHAR(30) UNIQUE NOT NULL,
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
  invoice_url       VARCHAR(500),
  hash_value        VARCHAR(64),
  is_tamper_locked  BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gst_records (
  id                BIGSERIAL PRIMARY KEY,
  job_id            BIGINT REFERENCES jobs(id),
  invoice_id        BIGINT REFERENCES invoices(id),
  owner_gstin       VARCHAR(20),
  technician_gstin  VARCHAR(20),
  supply_type       VARCHAR(20),
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

CREATE TABLE payment_methods (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id),
  method_type     VARCHAR(20) NOT NULL,
  display_name    VARCHAR(100),
  upi_id          VARCHAR(100),
  card_last_four  VARCHAR(4),
  card_network    VARCHAR(20),
  razorpay_token  VARCHAR(200),
  is_default      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

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
