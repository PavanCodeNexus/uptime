-- V19: AdminUser entity stores the role slug directly in admin_users.role
-- (V14 only has role_id). Add it, backfilled from admin_roles, so Hibernate and Flyway agree.
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role VARCHAR(30) NOT NULL DEFAULT 'SUPER_ADMIN';

UPDATE admin_users u
SET role = r.role_slug
FROM admin_roles r
WHERE u.role_id = r.id;
