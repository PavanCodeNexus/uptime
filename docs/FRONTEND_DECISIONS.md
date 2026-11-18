# Frontend decisions (approved 2026-11-14)

Handoff notes for the web frontends. Read this before changing frontend structure. Details of the plan
(pages, routes, roadmap) were delivered as an interactive page and are summarised here.

## Approved choices

| # | Decision | Choice |
|---|----------|--------|
| 1 | App structure | Three apps (`owner-web`, `tech-web`, `admin-web`) plus `packages/shared`, wired with npm workspaces |
| 2 | App state | Zustand (not Redux Toolkit). Server data uses TanStack Query |
| 3 | Backend changes | Frontend only. Backend gaps are listed below and fixed only if the owner approves each one |
| 4 | Google Maps | No key yet. Build with a fallback location card; wire the real map when a key exists |
| 5 | First milestone | Full job loop (report, match, accept, work, pay) with minimal technician and admin screens |

## Build order

Phase 0 setup (done), 1 sign-in (done), 2 owner reports a fault, 3 technician KYC + admin review, 4 job loop with live map,
5 payment and history, 6 remaining screens, 7 polish and deploy. Stop after each phase for approval.

## Deviations from earlier docs (and why)

- **HTTP client uses the browser's `fetch`, not Axios.** The design is the same (token, envelope, refresh once),
  with one fewer dependency, and it could be tested without installing packages. Easy to swap later because every
  screen goes through `packages/shared/src/api/*`.
- **Shared tests use Node's built-in test runner (via `tsx`), not Vitest.** Same reason. Vitest can be added in
  Phase 1 if component tests are wanted.
- **Tailwind 3.4, not 4**, because `docs/DESIGN.md` section 24 is written for Tailwind 3.

## Conventions

- Ports: owner 3000, technician 3001, admin 3002 (backend `CorsConfig` allows 3000, 3001, 3002, 5173).
- Tokens: owner and technician keep the access token in memory and the refresh token in `localStorage`.
  Admin keeps its token in `sessionStorage` only and has no refresh (the backend has no admin refresh endpoint).
- Never read, show or log the `arrivalOtp` field on a Job (it is a hash). The plain arrival code comes back only
  once, in the create-job reply, so the owner app must save it on the device.
- Industry value we send is `AUTOMOTIVE` (technician skills and job defaults use it); `AUTOMOBILE` is also accepted
  when reading. Status, urgency and industry go through `packages/shared/src/constants/job.ts`.
- Screens never show raw error codes. Use `ApiError.message` or `errorMessage(e)`.
- Money is formatted with `formatINR`, dates with `formatDate` (DD/MM/YYYY, India time), phones as 10 digits.
- Any screen backed by a stub endpoint shows a "Sample data" badge.

## Backend gaps (not fixed; frontend works around them)

1. No endpoint lists open jobs for technicians. Phase 4 uses a labelled demo shortcut (enter a job number).
2. No role checks on any endpoint. Frontend guards are cosmetic.
3. Hard-coded dev shortcuts: arrival code `123456` accepted on every job; admin 2FA accepts fixed codes; default admin
   account is created at startup. Remove or gate before any real launch.
4. `GET /jobs/{id}` has no ownership check and the job JSON includes the arrival-code hash.
5. No job photo or sound upload; KYC documents travel as base64; admin document link is a placeholder; video proof ignored.
6. Payments: invoice amounts are placeholders; create-order trusts the client amount; Razorpay key is not sent to the client.
7. Stub modules: AI, ratings, wiki, insurance, marketplace, notifications, assets, twins, tracking default point.
8. Mixed spellings: status CREATED/POSTED, urgency NORMAL vs LOW..CRITICAL, industry AUTOMOTIVE/AUTOMOBILE.
9. Admin cannot list all technicians or disputes. List endpoints have no paging.
10. OTPs and refresh tokens live in server memory; the dev database resets on restart.

## Contract details (confirmed on 2026-11-15 with `npm run check:backend`, all passed)

1. New-user flag in the login reply is `newUser`.
2. A bad, missing or expired token gets an empty HTTP 403 (not 401). The http client refreshes on an empty 403, so this is handled.
3. A refresh token works once; the second use gets 401.
4. Job and AI field names match `packages/shared/src/types/models.ts`. A new job starts as `CREATED`. The create-job reply has `job` and `arrivalOtpPlaintextForOwner`.
5. CORS allows ports 3000, 3001 and 3002.
