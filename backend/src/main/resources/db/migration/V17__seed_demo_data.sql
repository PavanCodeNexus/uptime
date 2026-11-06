-- V17: Seed Demo Data for UPTIME (Admin with TOTP, Demo Owners, Demo Technicians, Plans)

INSERT INTO admin_roles (role_name, role_slug, description)
VALUES
  ('Super Administrator', 'SUPER_ADMIN', 'Full platform access including admin management and commission settings'),
  ('Operations Admin', 'OPS_ADMIN', 'Verification queue, KYC review, and dispute resolution'),
  ('Finance Admin', 'FINANCE_ADMIN', 'Payouts, GST reports, and refunds')
ON CONFLICT (role_slug) DO NOTHING;

INSERT INTO admin_permissions (role_id, permission, can_read, can_create, can_update, can_delete)
SELECT r.id, p.permission, TRUE, TRUE, TRUE, TRUE
FROM admin_roles r
CROSS JOIN (VALUES ('KYC_REVIEWER'), ('DISPUTE_RESOLVER'), ('MASS_NOTIFIER'), ('FEATURE_FLAG_MANAGER')) AS p(permission)
WHERE r.role_slug = 'SUPER_ADMIN';

-- Demo Super Admin (password: Admin@123 -> BCrypt 12 rounds, TOTP secret: JBSWY3DPEHPK3PXP)
INSERT INTO admin_users (full_name, email, phone, password_hash, role_id, is_active, is_2fa_enabled, two_fa_secret)
SELECT
  'Pavan B C (Super Admin)',
  'admin@uptime.in',
  '9876543210',
  '$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW',
  id,
  TRUE,
  TRUE,
  'JBSWY3DPEHPK3PXP'
FROM admin_roles WHERE role_slug = 'SUPER_ADMIN'
ON CONFLICT (email) DO NOTHING;

-- Seed Demo Owners
INSERT INTO users (full_name, email, phone, phone_verified, email_verified, user_type, industry_preference, referral_code, is_active)
VALUES
  ('Ramesh Sharma (MSME Owner)', 'ramesh@peenyacnc.in', '9876543210', TRUE, TRUE, 'OWNER', 'INDUSTRIAL', 'UPT-RAMESH01', TRUE),
  ('Karthik Gowda (Fleet Owner)', 'karthik@bengalurutransport.in', '9876543211', TRUE, TRUE, 'OWNER', 'AUTOMOBILE', 'UPT-KARTHIK2', TRUE),
  ('Priya Nair (Appliance Owner)', 'priya@indiranagar.in', '9876543212', TRUE, TRUE, 'OWNER', 'ELECTRONICS', 'UPT-PRIYA003', TRUE)
ON CONFLICT (phone) DO NOTHING;

-- Seed Platform Settings
INSERT INTO platform_settings (setting_key, setting_value, value_type, description)
VALUES
  ('platform.commission.percent', '12.0', 'DECIMAL', 'Default platform commission percentage'),
  ('platform.gst.percent', '18.0', 'DECIMAL', 'Standard GST rate on service fee'),
  ('matching.radius.km', '20', 'INTEGER', 'Default PostGIS search radius in km'),
  ('arrival.radius.meters', '500', 'INTEGER', 'Maximum GPS distance for arrival OTP verification')
ON CONFLICT (setting_key) DO NOTHING;

-- Seed Feature Flags
INSERT INTO feature_flags (feature_name, feature_slug, description, is_enabled, rollout_percentage)
VALUES
  ('AI Repair Copilot', 'ai-repair-copilot', 'Enable step-by-step AI Repair Copilot in Wave 1', TRUE, 100),
  ('Virtual Video Consultation', 'virtual-video-consultation', 'Enable Agora live video consultation (Wave 3)', FALSE, 0),
  ('Machine Sound FFT Analysis', 'machine-sound-analysis', 'Enable spectrogram audio fault detection (Wave 3)', FALSE, 0),
  ('Repair Time Auction', 'repair-time-auction', 'Enable technician bidding auction mode (Wave 3)', FALSE, 0)
ON CONFLICT (feature_slug) DO NOTHING;
