# Supabase Setup (backend database)

The backend `demo` profile talks to Supabase Postgres and runs Flyway migrations V1-V18 on startup
(PostGIS, pgcrypto, all tables, seed data). Nothing else (Redis/RabbitMQ) is needed.

## 1. Create the project
1. https://supabase.com/dashboard -> **New project** (name `uptime`, region closest to you, e.g. Mumbai `ap-south-1`).
2. Set a **database password** and save it. Wait ~2 min for provisioning.
3. Do **not** enable PostGIS manually; migration V1 does `CREATE EXTENSION IF NOT EXISTS postgis`.

## 2. Get the connection details
Dashboard -> **Connect** -> **Session pooler** (use this, not "Direct": the direct host is IPv6-only and often fails on home networks).
You need: the **region host** (`aws-0-<region>.pooler.supabase.com`), the **project ref**, and your **DB password**.

## 3. Fill `backend/.env` (gitignored)
```
DB_URL=jdbc:postgresql://aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require
DB_USERNAME=postgres.<project-ref>
DB_PASSWORD=<your password>
```
Keep `APP_ENV=demo`. Never commit `.env` or paste the password in chat/GitHub.

## 4. Run
```
cd F:\uptime\backend
.\run-with-env.ps1
```
Success = log shows `Successfully applied 18 migrations` and `Started UptimeApplication`.
Check: http://localhost:8080/swagger-ui.html and Supabase -> Table Editor.

## Later (not needed now)
Gemini, Razorpay, Maps, Cloudinary, SMS keys -> add to the same `.env`.
Supabase "anon/service_role" keys are **not** required: the Spring backend connects straight to Postgres and issues its own JWTs.
