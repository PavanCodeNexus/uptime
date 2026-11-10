# UPTIME — Agent Memory & Handoff Log

> **Purpose:** This file tracks every conversation, decision, code change, and update made by any AI agent working on the UPTIME project. When tokens run out and you switch to a new agent, point them to this file first.
>
> **Rule:** Every agent MUST read this file before doing any work. Every agent MUST update this file after making changes.

---

## 🔑 Project Identity

- **Project:** UPTIME — On-Demand Repair & Technician Dispatch Platform
- **Workspace:** `F:\uptime` (single monorepo)
- **Owner:** Pavan B C (Tech Lead)
- **Team Size:** 4 members (student PBL project)
- **Timeline:** 30 days total
- **Start Date:** 2026-10-30

---

## 📁 Repository Structure (APPROVED)

```
F:\uptime/
├── backend/                    # Spring Boot 3.3.x (Java 17 target, JDK 21 runtime)
├── apps/
│   ├── owner-web/              # React 18 PWA (Vite + TypeScript + Tailwind + shadcn/ui)
│   ├── tech-web/               # React 18 (Technician web portal)
│   ├── admin-web/              # React 18 (Admin dashboard)
│   ├── technician-app/         # Flutter 3.x (Riverpod 2.x) — Wave 2
│   └── owner-app/              # Flutter 3.x (Placeholder) — Wave 2
├── packages/
│   └── shared/                 # TypeScript shared types/contracts (React apps only)
├── docs/                       # All .md specification files
├── MEMORY.md                   # ← THIS FILE (agent handoff log)
└── .gitignore
```

---

## 🏗️ Technology Stack (FINALIZED)

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Runtime** | OpenJDK | 21.0.12 LTS | Installed on machine |
| **Compile Target** | Java | 17 | `<java.version>17</java.version>` in pom.xml |
| **Backend** | Spring Boot | 3.3.x | Modular monolith, Maven wrapper |
| **Database** | Supabase PostgreSQL | 15 | PostGIS, 500MB free tier |
| **Migrations** | Flyway | V1–V18 | Version-controlled SQL scripts |
| **ORM** | Spring Data JPA + Hibernate | — | — |
| **Cache (dev)** | ConcurrentMapCacheManager | — | In-memory, zero setup |
| **Cache (prod)** | Upstash Redis | — | 10K cmd/day free |
| **Queue** | RabbitMQ | — | Async AI calls, notifications |
| **Frontend** | React 18 + TypeScript + Vite | — | 3 web apps |
| **UI Library** | shadcn/ui + Tailwind CSS | — | — |
| **State (Web)** | Redux Toolkit + React Query | — | — |
| **Mobile** | Flutter 3.x (Dart) | — | 2 apps (Wave 2) |
| **State (Mobile)** | Riverpod 2.x | — | FutureProvider + AsyncNotifierProvider, NO codegen |
| **AI** | Google Gemini 1.5 Flash | — | 1M tokens/month free |
| **Maps** | Google Maps Platform | — | $200/month free credit |
| **Payments** | Razorpay | — | Test mode for dev/demo |
| **Push** | Firebase FCM | — | Free unlimited |
| **SMS (dev)** | MockOtpProvider | — | Fixed OTP: `123456` |
| **SMS (prod)** | Fast2SMS / MSG91 | — | TRAI DLT required |
| **Media** | Cloudinary | — | 25GB free |
| **Video** | Agora.io | — | Wave 3 only, 10K min/month free |
| **Email** | SendGrid | — | 100/day free |
| **CI/CD** | GitHub Actions | — | Path-filtered per folder |
| **Deploy Backend** | Railway | — | $5/month free credit |
| **Deploy Web** | Vercel | — | Free for all 3 React apps |

---

## ✅ Decisions Made (LOCKED — Do Not Change Without User Approval)

| # | Decision | Date | Context |
|---|----------|------|---------|
| D1 | Single monorepo at `F:\uptime` instead of 8 GitHub repos | 2026-10-30 | User approved |
| D2 | Java 17 compile target on JDK 21 runtime | 2026-10-30 | User confirmed "17" |
| D3 | Spring Boot 3.3.x (not 3.2) | 2026-10-30 | Updated in PRD.md |
| D4 | Maven (pom.xml) only — no Gradle | 2026-10-30 | Matches team curriculum |
| D5 | Riverpod 2.x for Flutter, NOT Provider | 2026-10-30 | FutureProvider + AsyncNotifierProvider, no codegen |
| D6 | Admin auth = email/password + TOTP 2FA (no SMS OTP) | 2026-10-30 | Added to API.md Section 21 |
| D7 | Admin JWT expires in 30 minutes, temp 2FA token in 5 minutes | 2026-10-30 | — |
| D8 | Account lock after 5 failed admin login attempts | 2026-10-30 | 30-minute lockout |
| D9 | OTP strategy: dev=mock(123456), demo=mock for seeded phones, prod=Fast2SMS | 2026-10-30 | Never fixed OTP in prod |
| D10 | Demo OTP changed from 472918 → 123456 across all docs | 2026-10-30 | API.md, SECURITY.md, TESTING.md |
| D11 | Google Maps (not Leaflet/OSM) | 2026-10-30 | User confirmed |
| D12 | 30-day timeline: Backend→Web Apps→Mobile Apps | 2026-10-30 | Phase 1 (D1-12), Phase 2 (D13-22), Phase 3 (D23-30) |
| D13 | Wave 1 = Backend + owner-web + tech-web + admin-web (NO Flutter) | 2026-10-30 | Flutter moved to Wave 2 |
| D14 | Video consultation = "Coming Soon" until Wave 3 | 2026-10-30 | Backend returns 503 |
| D15 | In-memory cache for dev/demo, Upstash Redis for prod only | 2026-10-30 | Avoids 10K/day limit burn |
| D16 | GPS broadcast via in-memory WebSocket, NOT Redis | 2026-10-30 | Redis for rate-limit + sessions only |
| D17 | Razorpay Test Mode for dev/demo, Live after KYC for prod | 2026-10-30 | — |
| D18 | Feature count is 61 (not 69 as PRD claims) | 2026-10-30 | Documented discrepancy |
| D19 | 3-path resolution: COPILOT / VIDEO / BOOK — any order, user chooses | 2026-10-30 | User confirmed core flow |

---

## 📝 Session Log

### Session 1 — 2026-10-29 / 2026-10-30 (Agent: Antigravity / Gemini 3.8 Flash → Claude Opus 4.6)

**What happened:**
1. Read all 15 markdown specification files (total ~800 KB of documentation)
2. Performed deep cross-document analysis identifying:
   - 6 contradictions between documents
   - 5 critical missing specifications
   - 2 security omissions
   - 1 scope/workload risk
3. Presented findings as a structured report
4. User approved all 5 architectural questions with modifications
5. Applied 3 documentation updates (no code written)

**Files Modified:**
| File | Change | Lines Affected |
|------|--------|---------------|
| `CODING_STANDARDS.md` | Rewrote Section 16: Provider → Riverpod 2.x template (FutureProvider + AsyncNotifierProvider, no codegen/build_runner) | Section 16 (~60 lines replaced) |
| `API.md` | Added `POST /admin/auth/login` and `POST /admin/auth/verify-2fa` endpoints before `GET /admin/dashboard` in Section 21 | Section 21 (~80 lines inserted) |
| `API.md` | Replaced demo OTP `472918` → `123456` | Lines 233, 280, 1230 |
| `SECURITY.md` | Replaced demo OTP `472918` → `123456` | Line 173 |
| `TESTING.md` | Replaced demo OTP `472918` → `123456` (9 occurrences) | Lines 464, 478, 495, 503, 599, 622, 652, 753, 992 |
| `PRD.md` | Updated `Spring Boot 3.2` → `Spring Boot 3.3.x` (2 occurrences) | Tech stack table, architecture section |

**Files NOT Modified (read only):**
- ARCHITECTURE.md, DATABASE.md, DESIGN.md, RULES.md, IMPLEMENTATION.md, FEATURES.md, STRUCTURE.md
- UPTIME_Automobile_Technicians_AtoZ.md, UPTIME_Electronics_Technicians_AtoZ.md, UPTIME_Industrial_Technicians_AtoZ.md

**Code Written:** None (documentation-only session as requested)

**Current State:** All documentation aligned. Ready to begin Phase 1 scaffolding (monorepo structure + Spring Boot backend + Flyway migrations). Awaiting user "go" command.

---


### Session 2 — 2026-10-31 (Agent: Antigravity / Gemini 3.8 Flash)

**What happened:**
1. Ingested `TECHNICIAN_VERIFICATION.md` (KYC + Skill Proof) specifications per Section 17.
2. Synchronized all documentation across PRD.md, FEATURES.md, DATABASE.md, API.md, SECURITY.md, DESIGN.md, and TESTING.md:
   - **PRD.md & FEATURES.md:** Updated CORE-10 with tiered verification (L0-L3), provisional onboarding (L2-P), and trade gating.
   - **DATABASE.md:** Appended Migration V18 (`technician_identity_verifications`, `technician_trade_verifications`, `technician_skill_test_attempts`, `technician_references`, `technician_kyc_audit_log`).
   - **API.md:** Appended Section 23 with all 11 technician & 6 admin KYC review endpoints.
   - **SECURITY.md:** Replaced PDPB with DPDP Act 2023 / Rules 2025; added Section 25 on Aadhaar storage rules, signed 5-minute URLs, and auto-purging.
   - **DESIGN.md:** Appended Section 25 detailing Onboarding Wizard (7 steps) and Admin Review Screen.
   - **TESTING.md:** Appended Section 24 with 12 acceptance criteria tests.
3. Corrected and enriched `PROJECT_UNDERSTANDING.md`:
   - Rebuilt Feature Catalog (Section 5) directly from `FEATURES.md` with all original names (`AUTO-C01 Roadside SOS`, etc.) and all **19 World-First Innovations (⭐)** with wave mappings.
   - Restored official tagline: **"Downtime ends here."**
   - Corrected Section 3 diagram: moved `[Coming Soon]` label from AI Copilot to Video Consultation card.
   - Added production startup guard to Section 11 (fails fast if mock OTP or mock identity runs in prod).
   - Added upload magic-bytes inspection and admin lockout (5 attempts) to security measures.
   - Created `/docs` directory in monorepo root.
   - Replaced all PDPB references with the **Digital Personal Data Protection (DPDP) Act 2023**.

---


### Session 3 — 2026-10-31 (Agent: Antigravity / Gemini 3.8 Flash)

**What happened:**
1. Standardized the **Fatigue Rule** across all specifications (no point deductions, strict query exclusion):
   - **`FEATURES.md` (CORE-03):** Stated clearly that technicians with `is_fatigue_restricted = TRUE` are filtered out of the matching query (`AND is_fatigue_restricted = FALSE`) and never evaluated by `ScoringEngine`.
   - **`RULES.md`:** Added `RULE SB-00: Matching & Fatigue Policy` mandating that `is_fatigue_restricted = TRUE` technicians are excluded directly in the SQL/JPA query (`WHERE ... AND is_fatigue_restricted = FALSE`) rather than penalized with -50 points or `score = 0`. Retained `fatigue_score` in DB for technician dashboard rest-period countdown notices.
   - **`TESTING.md`:** Changed unit test names from "Fatigue restricted subtracts 50" to "Restricted technician is absent from matching results" in both Java (JUnit) and Flutter (Dart) test suites.
   - **`ARCHITECTURE.md`, `PRD.md`, `PROJECT_UNDERSTANDING.md`:** Synchronized matching algorithm descriptions to state exclusion at the query level.
2. Verified that Wave 1 implementation scope incorporates the Technician Verification (KYC + Skill Proof) pipeline as approved.

---

### Session 4 — 2026-10-31 (Agent: Antigravity / Gemini 4 Argon)

**What happened:**
1. Created initial monorepo directory structure (`backend/`, `apps/owner-web/`, `apps/tech-web/`, `apps/admin-web/`, `apps/technician-app/`, `apps/owner-app/`, `packages/shared/`, `docs/`) with `.gitkeep` placeholders.
2. Moved all 18 specification `.md` files into `docs/`, kept `MEMORY.md` at root, and added root `README.md` and monorepo `.gitignore`.
3. Initialized local Git repository, created `main` and `develop` branches, configured remote `origin` (`https://github.com/PavanCodeNexus/uptime.git`), committed all project documentation and initial structure, and pushed `main` and `develop` to GitHub.

---

### Session 5 — 2026-11-01 (Agent: Antigravity)

**What happened:**
1. Built the complete **Spring Boot 3.3.5** backend (`F:\uptime\backend`, Java 17 target on JDK 21 runtime) with Maven Wrapper (`mvnw` / `mvnw.cmd` / `.mvn/wrapper/mvnw.ps1`), `Dockerfile`, `.env.example`, and multi-profile configurations (`application.yml`, `application-dev.yml`, `application-demo.yml`, `application-prod.yml`, `application-test.yml`).
2. Generated all **18 Flyway SQL migrations** (`V1__create_users_and_auth.sql` through `V18__technician_kyc_and_skill_verification.sql`) in `backend/src/main/resources/db/migration/`, resolving 19 forward foreign-key references cleanly in `V15__add_indexes_and_spatial.sql`.
3. Created all **12 AI prompt files** in `backend/src/main/resources/prompts/` and `invoice_template.html` in `backend/src/main/resources/static/`.
4. Implemented all **core, security, config, and 15 modular packages** under `com.uptime`:
   - `common/`: constants (`AppConstants`, `ApiRoutes`, `ErrorCodes`, `CacheNames`, `QueueNames`), enums, `ApiResponse`/`PagedResponse`/`ErrorResponse`, global exceptions, and utilities (`HashUtils`, `GeoUtils`, `OTPUtils`, `DateUtils`, `InvoiceNumberUtils`, `PhoneUtils`, `FileUtils` with magic-bytes verification).
   - `security/`: `JwtTokenProvider` (RS256 with auto-generated 2048-bit keypair in dev/test), `JwtAuthFilter` (blocks `TEMP_2FA` tokens on all non-2FA routes), `RateLimitFilter`, `CurrentUserArgumentResolver`, and `ProductionSafetyStartupGuard` (fails fast if `MockOtpProvider` or `MockIdentityVerificationProvider` is active under `prod` profile).
   - `modules/auth/`: `OtpProvider` strategy (`MockOtpProvider` with `123456` for `dev`/`test`, `DemoOtpProvider` for seeded demo phones, `Fast2SmsOtpProvider` for `prod`), `AuthService`, `AuthController`.
   - `modules/user/`: `User`, `UserAddress`, `UserSession`, `UserService`, `UserController`.
   - `modules/technician/`: `Technician`, `TechnicianSkill`, `TechnicianDocument`, `TechnicianIdentityVerification`, `TechnicianTradeVerification`, `TechnicianSkillTestAttempt`, `TechnicianReference`, `TechnicianKycAuditLog`, `IdentityVerificationProvider` strategy, `TechnicianService`, `TechnicianController` (implementing all L0–L3 KYC, DigiLocker, selfie liveness, UPI penny-drop, Track A/B skill verification, MCQ test, video proof, reference OTP, and provisional L2-P graduation flows).
   - `modules/job/`: `Job`, `JobMedia`, `JobChecklistItem`, `JobPartsUsed`, `JobDispute`, `JobPathHistory`, `JobService`, `JobController` (implementing 3-path selection, escalation with ₹149 video fee credit, 500m GPS + BCrypt arrival OTP verification, and SHA-256 tamper-proof completion lock).
   - `modules/ai/`: `PromptManager`, `GeminiService` (with structured fallback when `GEMINI_API_KEY` is absent), `AIController`.
   - `modules/matching/`: `ScoringEngine` and `MatchingService` enforcing strict query-level exclusion of fatigued technicians (`AND t.isFatigueRestricted = false` — never `-50` points or `score = 0`) and provisional L2-P job caps (≤ ₹3,000, non-emergency).
   - `modules/payment/`: `Payment`, `Invoice`, `GSTService` (18% GST split into CGST 9% + SGST 9% or IGST 18%), `PaymentService`, `PaymentController`.
   - `modules/admin/`: `AdminUser`, `AdminService`, `AdminController` (two-step admin login with 5-attempt 30-min lockout, 5-min `TEMP_2FA` token, 6-digit TOTP verification issuing 30-min Admin JWT, 5-min signed KYC document view URL with mandatory `TechnicianKycAuditLog` entry, document review, and L2/L3 verification).
   - `modules/tracking/`, `modules/rating/`, `modules/notification/`, `modules/industry/`, `modules/insurance/`, `modules/marketplace/`, `modules/wiki/`, `modules/video/` (`503 VID_001` "Coming Soon in Wave 3"), and `HealthController`.
5. Created 6 JUnit 5 test suites (`ScoringEngineTest`, `HashUtilsTest`, `OTPServiceTest`, `GSTServiceTest`, `ProductionSafetyStartupGuardTest`, `UptimeContextLoadTest`) in `backend/src/test/java/com/uptime/`.
6. Verified full clean compilation (126 Java source files + 6 test suites, Java 17 target) and test execution via `mvnw.cmd clean test` — **15/15 tests passed (`BUILD SUCCESS`)**, including full `@SpringBootTest` context startup, JPA/Hibernate entity validation, STOMP WebSocket broker startup, 2-step Admin BCrypt + TOTP 2FA, and 5-attempt admin lockout.
7. Committed and pushed the complete Phase 1 Backend (`F:\uptime\backend`) and updated `MEMORY.md` to GitHub (`origin/develop` and `origin/main`).

---

### Session 6 — 2026-11-01 (Agent: Antigravity)

**What happened:**
1. Resolved all **54 VS Code Eclipse JDT Problems panel warnings** (`0` errors, `54` null-safety / override-annotation / unused-field warnings) across 15 backend Java files:
   - Added Spring `@NonNull` / `@Nullable` override annotations matching framework contracts in `WebMvcConfig`, `WebSocketConfig`, `CurrentUserArgumentResolver`, `JwtAuthFilter`, and `RateLimitFilter` (14 warnings).
   - Replaced unbound method references (`AbstractHttpConfigurer::disable`, `HeadersConfigurer.FrameOptionsConfig::sameOrigin`) with explicit lambdas and removed unused imports in `SecurityConfig` (2 warnings).
   - Wired `PromptManager.loadPrompt(...)` into `GeminiService.diagnoseFault(...)` to resolve unused-field warning (1 warning).
   - Replaced `ConcurrentHashMap.merge(..., Integer::sum)` `BiFunction` null-unboxing warning and added explicit null guards for Spring Data `CrudRepository` (`findById`, `save`) and `ResponseEntity.status` calls across `GlobalExceptionHandler`, `AdminService`, `AuthService`, `JobService`, `MatchingService`, `PaymentService`, `TechnicianService`, and `UserService` (37 warnings).
2. Re-verified full clean compilation and JUnit 5 suite (`15/15` passing) via `mvnw.cmd clean test`, and pushed fixes to `main` and `develop` on GitHub.

---

### Session 7 — 2026-11-06 (Agent: Antigravity)

**What happened:**
1. Built both **Flutter 3.x + Riverpod 2.x** mobile applications (`apps/owner-app` and `apps/technician-app`) per user's team division (user leads Backend, Database, and Mobile Apps while 3 teammates handle the 3 React Web Apps):
   - **`apps/owner-app` (`uptime_owner_app`):**
     - Implemented `UptimeTheme` (`#1A3C6E` Deep Blue, `#00D4AA` Electric Teal, Material 3 Light/Dark themes), `FormatUtils` (Indian Rupee `₹1,00,000` formatter, `DD/MM/YYYY`, phone validation, Haversine distance), and `dioClientProvider` with JWT `AuthInterceptor` + local demo fallback.
     - Built Riverpod 2.x providers (`Provider`, `FutureProvider.autoDispose`, `AsyncNotifierProvider.autoDispose` without codegen) in `owner_providers.dart`.
     - Built complete interactive flows in `owner_shell_screen.dart`: Phone OTP login (`123456`), Industry Selector (`INDUSTRIAL`, `AUTOMOBILE`, `ELECTRONICS`), Fault Reporting with Voice & Engine/Machine Sound Fingerprint ⭐, Gemini AI Triage, **3-Path Resolution Selection** (Free AI Copilot with Step 3 Escalation Banner, Video Consultation `[Coming Soon]` Wave 3 preview with ₹149 fee credit, and Direct Technician Booking), Digital Twin & Vehicle Mood Score ⭐, Live GPS Tracking with 500m Geofence Arrival OTP (`123456`), 18% GST Invoice (CGST 9% + SGST 9%), and SHA-256 Tamper-Proof Certificate.
     - Added unit & widget test suite in `test/owner_app_test.dart`.
   - **`apps/technician-app` (`uptime_technician_app`):**
     - Implemented `KycAndFatigueValidators` enforcing the DPDP Act 2023 12-digit Aadhaar prohibition, Regulated Trade (`HV_ELECTRICIAN`, `BOILER_OPERATOR`, `COMMERCIAL_HVAC_GAS`) Track A license requirement, MCQ pass criteria (`>= 70%` total & `2/2` mandatory safety questions), and 500m Haversine arrival geofence.
     - Implemented `filterEligibleTechniciansForDispatch` and `TechnicianStateNotifier` enforcing the **Fatigue Rule** (`isFatigueRestricted == true` strictly excluded from dispatch queries, never scored, with mandatory rest-period countdown banner on dashboard) and **Provisional `L2-P` (Track B Experienced Ustad)** job cap (`<= ₹3,000`, non-emergency, auto-graduation after 5 jobs with rating `>= 4.2`).
     - Built `TechRootScreen` (`tech_shell_screen.dart`) with `TechHomeScreen` (Online/Offline toggle, Fatigue Rest-Period Banner, Today's Stats Row, Incoming 60s Job Request), 500m Arrival OTP verification, Field AI Copilot & Safety Checklist, Spare Parts logging, SHA-256 job completion, 7-Step KYC Wizard (`L0`–`L3`), Wallet/UPI payouts, and NFT Skill Badges ⭐.
     - Added unit & widget test suite in `test/technician_app_test.dart` including `"Restricted technician is absent from matching results"`.

---

### Session 8 — 2026-11-10 / 2026-11-11 (Agent: Antigravity)

**What happened:**
1. **Completed 44-Screen Owner App (`S01`–`S44`) in Figma (`Layer 28:3`) & Flutter (`apps/owner-app`):**
   - Redesigned to Clean White theme (`#FFFFFF` default, Urban Company / Zomato / AJIO style), replaced top logo with interactive **Zomato/BigBasket Location Selector Header**, replaced `S01` Splash with pitch-black `#000000` lockup matching user's uploaded image, removed onboarding carousel clutter, and built `owner_44_screens_catalog.dart` (`S01`–`S44`).
2. **Completed 40-Screen Technician App (`T01`–`T40`) in Figma (`Layer 36:3`) & Flutter (`apps/technician-app`):**
   - Audited all specs and added 6 regulatory/compliance screens (`T35` 3D Face Liveness, `T36` Trade Skill MCQ & Mandatory 415V LOTO Safety Quiz, `T37` Bank Setup & NPCI ₹1 Penny-Drop, `T38` Confidential Blind Customer Rating, `T39` ISO 45001 Fatigue Monitor & Shift Rest Gauge, `T40` 30-Day Warranty Revisit & FFT Dispute Desk).
   - Implemented `tech_40_screens_catalog.dart` (`T01`–`T40`), Clean White default + High-Contrast Industrial Field Dark Mode, and top Base-Zone Location Selector (`Peenya Industrial Cluster #4`).
3. **Synchronized Backend API Services & Supabase/PostGIS Database (`V19` + `supabase/`):**
   - Added Flyway migration `V19__supabase_rls_postgis_and_84_screen_sync.sql` enforcing `RULE SB-00` in `sp_calculate_match_score`, upgrading Postgres 15 views (`v_active_jobs`, `v_technician_dashboard`, `v_platform_summary`) with `security_invoker = true`, enabling Row-Level Security (RLS), adding `sp_verify_arrival_geofence_500m`, and creating tables `blind_mutual_ratings`, `warranty_revisit_claims`, and `technician_fatigue_breaks`.
   - Added Supabase CLI config (`supabase/config.toml`) and RLS migration (`supabase/migrations/20261111000001_uptime_supabase_postgis_rls.sql`) using `TO authenticated` ownership policies (`USING` + `WITH CHECK`).
   - Added new Spring Boot REST endpoints in `RatingController` (`/api/v1/ratings/blind`, `/api/v1/ratings/job/{jobId}/blind-status`), `InsuranceController` (`/api/v1/insurance/claims`, `/api/v1/insurance/warranty-revisits`, `/api/v1/insurance/warranty-revisits/{claimNumber}/schedule`), `MarketplaceController` (`/api/v1/parts`, `/api/v1/parts/fitment-check`, `/api/v1/auctions`), `WikiController` (`/api/v1/wiki/schematics/{code}`), and `TechnicianController` (`/api/v1/technicians/me/fatigue/rest-break`, `/api/v1/technicians/me/base-zone`), verified in `UptimeContextLoadTest`.

---

## 🔲 What's Next (For the Next Agent)

1. Connect Supabase PostgreSQL + PostGIS credentials and Gemini API key in `backend/.env` when ready to switch from local H2 dev mode to shared cloud DB for the 4-member team.
2. Coordinate with the 3 teammates on `apps/owner-web`, `apps/tech-web`, and `apps/admin-web`.

---

## ⚠️ Known Risks & Gotchas

1. **Maven is NOT on system PATH** — must use Maven Wrapper (`./mvnw` or `mvnw.cmd`)
2. **Upstash Redis 10K/day limit** — use in-memory cache for dev/demo
3. **Twilio cannot send SMS to unverified Indian numbers** — use MockOtpProvider
4. **TRAI DLT registration takes weeks** — plan to demo with mock OTP
5. **Gemini Flash is not a DSP engine** — sound analysis should use spectrogram image, not raw FFT
6. **24h JWT expiry in SECURITY.md is too long** — consumer tokens use 24h (acceptable for mobile), admin tokens use 30min
7. **Feature count discrepancy** — docs say 69, actual enumerated features = 61
8. **Table count discrepancy** — docs say 141+, actual DDL = 135 tables (V1–V18)
9. **STRUCTURE.md lists both pom.xml and build.gradle** — we use Maven ONLY

---

## 📊 Project Metrics Snapshot

- **Specification files:** 18 markdown files in `docs/`
- **Database tables defined:** 135 (across V1–V18 Flyway migrations)
- **API endpoints defined:** 125+ REST endpoints (including KYC & Skill Verification L0–L3)
- **Flyway migrations created:** 18 scripts (`V1`–`V18`)
- **Features documented:** 61 (including 19 World-First Innovations)
- **Backend modules implemented:** 15 packages + 6 JUnit test suites (0 errors, 0 IDE warnings)
- **Client platforms:** 6 (3 React web + 2 Flutter mobile + 1 TS shared)
- **External service integrations:** 10 (Supabase, Redis, RabbitMQ, Gemini, Maps, Razorpay, FCM, Cloudinary, Agora, SendGrid)
