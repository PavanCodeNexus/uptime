-- 20261111000001_uptime_supabase_postgis_rls.sql
-- Supabase PostgreSQL 15 + PostGIS Extension, RLS Policies & Security Invoker Views
-- Follows Supabase Security Checklist:
--   - Uses `TO authenticated` (never deprecated `auth.role()`)
--   - Combines `TO authenticated` with ownership predicates in `USING` and `WITH CHECK`
--   - Uses `security_invoker = true` on all views

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Ownership-scoped RLS Policies for Exposed Public Tables
-- Note: Spring Boot backend connects via service_role / postgres pooler, while direct
-- Supabase Data API / Realtime subscriptions are protected by these RLS policies.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_addresses') THEN
    ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "user_addresses_select_own" ON public.user_addresses;
    CREATE POLICY "user_addresses_select_own"
      ON public.user_addresses
      FOR SELECT
      TO authenticated
      USING (user_id::text = (SELECT auth.jwt() ->> 'sub'));

    DROP POLICY IF EXISTS "user_addresses_insert_own" ON public.user_addresses;
    CREATE POLICY "user_addresses_insert_own"
      ON public.user_addresses
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id::text = (SELECT auth.jwt() ->> 'sub'));

    DROP POLICY IF EXISTS "user_addresses_update_own" ON public.user_addresses;
    CREATE POLICY "user_addresses_update_own"
      ON public.user_addresses
      FOR UPDATE
      TO authenticated
      USING (user_id::text = (SELECT auth.jwt() ->> 'sub'))
      WITH CHECK (user_id::text = (SELECT auth.jwt() ->> 'sub'));
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jobs') THEN
    ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "jobs_select_participant" ON public.jobs;
    CREATE POLICY "jobs_select_participant"
      ON public.jobs
      FOR SELECT
      TO authenticated
      USING (
        owner_id::text = (SELECT auth.jwt() ->> 'sub')
        OR technician_id IN (
          SELECT id FROM public.technicians WHERE user_id::text = (SELECT auth.jwt() ->> 'sub')
        )
      );

    DROP POLICY IF EXISTS "jobs_update_participant" ON public.jobs;
    CREATE POLICY "jobs_update_participant"
      ON public.jobs
      FOR UPDATE
      TO authenticated
      USING (
        owner_id::text = (SELECT auth.jwt() ->> 'sub')
        OR technician_id IN (
          SELECT id FROM public.technicians WHERE user_id::text = (SELECT auth.jwt() ->> 'sub')
        )
      )
      WITH CHECK (
        owner_id::text = (SELECT auth.jwt() ->> 'sub')
        OR technician_id IN (
          SELECT id FROM public.technicians WHERE user_id::text = (SELECT auth.jwt() ->> 'sub')
        )
      );
  END IF;
END $$;
