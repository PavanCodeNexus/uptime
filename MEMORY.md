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
| **Migrations** | Flyway | V1–V17 | Version-controlled SQL scripts |
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
1. Created initial monorepo directory structure (ackend/, pps/owner-web/, pps/tech-web/, pps/admin-web/, pps/technician-app/, pps/owner-app/, packages/shared/, docs/) with .gitkeep placeholders.
2. Moved all 18 specification .md files into docs/, kept MEMORY.md at root, and added root README.md and monorepo .gitignore.
3. Initialized local Git repository, created main and develop branches, configured remote origin (https://github.com/PavanCodeNexus/uptime.git), committed all project documentation and initial structure, and pushed main and develop to GitHub.

---

## 🔲 What's Next (For the Next Agent)

1. **Create monorepo directory structure** at `F:\uptime/` as defined above
2. **Move all .md files** from root to `F:\uptime\docs/`
3. **Initialize Spring Boot backend** with Maven Wrapper (`mvnw`)
4. **Write all 17 Flyway migration scripts** (V1 through V17)
5. **Scaffold all 14 Spring Boot module packages** with Controller/Service/Repository/Entity/DTO/Mapper layers
6. **Implement Auth module first** (OTP strategy, JWT RS256, admin 2FA)
7. Then proceed through the backend modules in dependency order

---

## ⚠️ Known Risks & Gotchas

1. **Maven is NOT on system PATH** — must use Maven Wrapper (`./mvnw` or `mvnw.cmd`)
2. **Upstash Redis 10K/day limit** — use in-memory cache for dev/demo
3. **Twilio cannot send SMS to unverified Indian numbers** — use MockOtpProvider
4. **TRAI DLT registration takes weeks** — plan to demo with mock OTP
5. **Gemini Flash is not a DSP engine** — sound analysis should use spectrogram image, not raw FFT
6. **24h JWT expiry in SECURITY.md is too long** — consumer tokens use 24h (acceptable for mobile), admin tokens use 30min
7. **Feature count discrepancy** — docs say 69, actual enumerated features = 61
8. **Table count discrepancy** — docs say 141+, actual DDL = 130 tables
9. **STRUCTURE.md lists both pom.xml and build.gradle** — we use Maven ONLY

---

## 📊 Project Metrics Snapshot

- **Specification files:** 15 markdown files (~800 KB)
- **Database tables defined:** 130 (across 14 modules + additional)
- **API endpoints defined:** 108+ REST endpoints
- **Flyway migrations planned:** 17 scripts (V1–V17)
- **Features documented:** 61 (12 Core + 11 Industrial + 15 Auto + 15 Electronics + 7 Platform + 1 Virtual)
- **Backend modules:** 14
- **Client platforms:** 6 (3 React web + 2 Flutter mobile + 1 TS shared)
- **External service integrations:** 10 (Supabase, Redis, RabbitMQ, Gemini, Maps, Razorpay, FCM, Cloudinary, Agora, SendGrid)
- **Source code written so far:** 0 lines
