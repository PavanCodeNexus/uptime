# Going live (demo first, real later)

Plan: backend on Render (free, uses the existing Dockerfile), three web apps on Vercel (free).
Do these in order. Each app is a separate Vercel project from the SAME GitHub repo.

## Be honest about what "live" means today
The backend has development shortcuts: sign-in code is always 123456, the admin password is a known default,
and the arrival code 123456 works on every job. Its database in dev mode (H2) is in memory and empties every restart.
So this first launch is a **public demo**, not for real customers. Before real users, see "Real launch" at the end.

## 1. Backend on Render
1. render.com > New > Web Service > connect the GitHub repo.
2. Root directory: `backend`. Environment: Docker (it finds `backend/Dockerfile`). Free instance.
3. Environment variables:
   - `APP_ENV` = `dev`
   - `CORS_ALLOWED_ORIGINS` = the three Vercel addresses, comma separated, no spaces, no trailing slash
     (add them after step 2; example `https://uptime-owner.vercel.app,https://uptime-tech.vercel.app,https://uptime-admin.vercel.app`)
4. Deploy. Open `https://YOUR-BACKEND.onrender.com/actuator/health`. It should say UP.
   The free instance sleeps after idle time; the first request takes about a minute.

## 2. The three web apps on Vercel
For each of owner-web, tech-web, admin-web: Vercel > Add New Project > the same repo, then:
- Root Directory: `apps/owner-web` (or `apps/tech-web`, `apps/admin-web`). Framework: Vite.
  The `vercel.json` in each folder already sets the install and build commands.
- Environment variables:
  - `VITE_API_BASE_URL` = `https://YOUR-BACKEND.onrender.com`
  - `VITE_WS_URL` = `https://YOUR-BACKEND.onrender.com/ws`
  - `VITE_GOOGLE_MAPS_API_KEY` = leave empty for now
- Deploy. Copy each address, then go back to Render and set `CORS_ALLOWED_ORIGINS` (step 1.3). Redeploy the backend.

## 3. Check
Open the owner address, sign in with any phone and code 123456, report a fault. If you see "Cannot reach the server",
the most common cause is CORS_ALLOWED_ORIGINS missing that exact address, or the free backend still waking up.

## Real launch (later, needs backend work)
- `APP_ENV=prod`: PostgreSQL (Supabase), Redis (Upstash), RabbitMQ, JWT keys (see `backend/src/main/resources/application-prod.yml`).
- Remove the shortcuts: fixed OTP 123456, default admin login, arrival code 123456 on any job.
- Add role checks and an ownership check on `GET /jobs/{id}`; add file storage for KYC documents.
- Real Razorpay keys and the Razorpay checkout screen; a Google Maps key (`VITE_GOOGLE_MAPS_API_KEY`).
