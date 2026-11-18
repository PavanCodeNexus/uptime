# UPTIME frontend: setup and running (Phases 0, 1 and 2)

Phase 0 gives you three web apps that start, look right, and prove they can talk to your backend.
They show one "Backend connection" screen each. The real screens start in Phase 1.

```
apps/owner-web    http://localhost:3000   owners report faults, track and pay
apps/tech-web     http://localhost:3001   technicians get verified and work jobs
apps/admin-web    http://localhost:3002   admins review technician documents
packages/shared                           code all three apps use (types, API client, formatters, design tokens)
```

The ports are fixed on purpose. Your backend only accepts browser calls from ports 3000, 3001, 3002 and 5173.

## One-time setup (Windows)

1. Install **Node.js LTS** (version 20 or newer) from https://nodejs.org. Check it worked:
   ```
   node -v
   npm -v
   ```
2. Unzip the Phase 0 files into `F:\uptime`, **merging** folders. Nothing in `backend\` is touched.
3. Open a terminal in `F:\uptime` (in VS Code: Terminal, New Terminal) and install everything:
   ```
   npm install
   ```
   This creates a `node_modules` folder and a `package-lock.json`. Commit the lock file; never commit `node_modules`.
4. Optional: the defaults already point at `http://localhost:8080`. Only if you need to change something, copy the example file in each app:
   ```
   copy apps\owner-web\.env.example apps\owner-web\.env.local
   ```

## Run it

Use one terminal per program.

| Terminal | Command | Then open |
|----------|---------|-----------|
| 1. Backend | `cd backend` then `.\mvnw.cmd spring-boot:run` | http://localhost:8080/swagger-ui.html |
| 2. Owner app | `npm run dev:owner` | http://localhost:3000 |
| 3. Technician app | `npm run dev:tech` | http://localhost:3001 |
| 4. Admin app | `npm run dev:admin` | http://localhost:3002 |

You only need the backend and one app to start. A green **Connected** badge means the app reached the backend.
The backend's dev database is in memory, so it starts empty and forgets everything when you stop it.

## Checks (run these from `F:\uptime`)

| Command | What it tells you |
|---------|-------------------|
| `npm run check:backend` | **Run this once with the backend running and paste the output to Claude.** It confirms three details that can only be seen by running the code. |
| `npm test` | 49 small tests of the shared code (formatting, error messages, token refresh, sign-in logic). |
| `npm run typecheck` | TypeScript checks all four packages for mistakes. |
| `npm run build` | Builds all three apps the way a deployment would. |

## If something goes wrong

| You see | Likely cause | Fix |
|---------|--------------|-----|
| Red "Not reachable" badge | Backend not running, wrong address, or wrong port | Start the backend. Check `VITE_API_BASE_URL`. Confirm the app is on port 3000, 3001 or 3002. |
| `Port 3000 is already in use` | Another program uses it (Vite is set to stop rather than pick another port) | Close that program, or the other copy of the app. |
| `npm install` fails with an engine or version message | Node is too old | Install the current LTS from nodejs.org. |
| Page has no styling | Tailwind did not start | Stop the app (Ctrl+C), run `npm install` again, then start it. |
| Anything else | | Copy the full red error text and paste it to Claude. |

## What is in the shared package

```
packages/shared/src
  types/        what a User, Job, Technician, Payment look like (from the Java classes)
  constants/    plain-language error messages, job status labels, industry and urgency lists
  lib/          http client (token, envelope, refresh), token storage, India-first formatters
  api/          one function per endpoint (just health so far; the rest arrive with each phase)
  design/       colors and fonts from docs/DESIGN.md as CSS variables and a Tailwind preset
  ui/           shared components (the Phase 0 status screen, theme switch)
```

## Phase 1: sign in (what to try)

| App | Open | Sign in with |
|-----|------|--------------|
| Owner | http://localhost:3000 | phone `9876543210`, code `123456`. A new number asks for your name, then lands on the welcome page. |
| Technician | http://localhost:3001 | same phone flow |
| Admin | http://localhost:3002 | email `admin@uptime.in`, password `UptimeAdmin@2026`, then code `123456` (or `654321`) |

These are the backend's dev-only defaults. Reload the page: owner and technician stay signed in, admin signs out when the tab closes.
`/status` in each app still shows the backend connection check.

## Note on `packages/shared`

A teammate added `src/types/AllTypes.ts`, `api.types.ts`, `constants/apiRoutes.ts` and `utils/formatters.ts`. They are untouched and sit
next to the web-app code. `src/index.ts` re-exports only the names that do not clash with the web-app types.

## Phase 2: owner reports a fault (what to try)

Sign in to the owner app (http://localhost:3000), then:

1. **Report a fault**: pick an industry, type the equipment and the problem (at least 10 letters), choose urgency, type your city (or press "Use my location").
2. Press **Get AI first look**. The dev backend returns a fixed sample, so you will see a "Sample data" badge.
3. Choose **Book a technician** or **Fix it with AI Copilot**, then press the main button. You land on the job page.
4. On the job page you see the progress line, details, cost estimate and your **arrival code** (saved on this device only).
   - Copilot jobs show step-by-step cards and a "Book a technician" button.
   - Technician jobs show how many verified technicians match. The list stays empty until a technician is verified (Phase 3).
5. **My jobs** lists everything you reported.

## Phase 3: technician sign-up and admin review (what to try)

You need the backend running, plus `npm run dev:tech` and `npm run dev:admin` in two more terminals.

1. Open http://localhost:3001. Sign in with a new phone number (OTP `123456`), choose a name. You land on Home.
2. Open **Verification**. You are level 0. Upload a document (pick "ITI / NCVT certificate"; a file is optional in dev). Note: for Aadhaar type only the last 4 digits.
3. Open **Profile and skills**. Save a short bio and add a skill (for example Automobile, "Engine diagnostics").
4. On Home press **Use my location** and allow the browser prompt, then **Go online**. A yellow note says you need level 2.
5. Open http://localhost:3002 and sign in: `admin@uptime.in`, `UptimeAdmin@2026`, code `123456`.
6. **Document review**: you see the document with "Technician #N". Press **Approve**.
7. **Set level**: type that number N, press Find, choose Level 2 and status verified, Save.
8. Back in the technician app, wait about 20 seconds or reload Verification. It now says level 2 and the yellow note on Home disappears.
9. Report a fault in the owner app (port 3000). On the job page the match panel should now count your technician.

Not in this phase: face check, trade skill test, references (Phase 6). The backend does not store uploaded files, so the admin cannot preview them yet.
