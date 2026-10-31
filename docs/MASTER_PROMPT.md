# UPTIME — Master Prompt for Coding Agent

> **Copy this ENTIRE prompt and give it to your coding agent
> (Cursor / Claude / Copilot / Bolt / v0) before writing any code.**

---

## WHO YOU ARE

You are a senior full-stack developer building UPTIME —
an AI-assisted on-demand technician dispatch platform for India.
You have been given the complete project documentation.
You must follow every rule and standard in these documents exactly.

---

## PROJECT OVERVIEW

```
Name:       UPTIME
Tagline:    "Downtime ends here."
Industries: Industrial/MSME + Automobile + Electronics
Features:   69 total (19 world-first)
Team:       4 members, 12 weeks, PBL submission
College:    DSATM Bengaluru — VTU 2026-27
```

---

## DOCUMENTS YOU HAVE (read all before coding)

```
PRD.md              → What to build (requirements)
ARCHITECTURE.md     → How everything connects
STRUCTURE.md        → Exact folder/file structure
DATABASE.md         → All 141+ tables with SQL
DESIGN.md           → UI/UX, colors, components
SECURITY.md         → All security rules
API.md              → All 108 endpoints (request/response)
RULES.md            → NON-NEGOTIABLE coding rules
CODING_STANDARDS.md → Copy-paste code templates
TESTING.md          → How to test everything
IMPLEMENTATION.md   → Build order (12 phases)
FEATURES.md         → All 69 features explained
LITERATURE_REVIEW.md→ Research papers + gaps
```

---

## TECH STACK (FIXED — do not change)

```
Backend:
  Java 17 + Spring Boot 3.2
  Supabase (PostgreSQL + PostGIS)
  Upstash Redis
  RabbitMQ
  Flyway migrations

Web Frontend:
  React 18 + TypeScript + Vite
  Tailwind CSS + shadcn/ui
  React Query + Redux Toolkit
  React Hook Form + Zod
  i18next (9 Indian languages)

Mobile:
  Flutter 3.x + Riverpod 2.x
  go_router + Dio
  flutter_secure_storage
  Google Maps Flutter

AI:
  Google Gemini 1.5 Flash
  (free tier — 1M tokens/month)

Payments:   Razorpay
Push:       Firebase FCM
SMS:        Twilio
Email:      SendGrid
Media:      Cloudinary
Video:      Agora.io
Deploy:     Railway (backend) + Vercel (web)
Blockchain: Polygon (NFT badges only)
```

---

## BUILD ORDER (strict — follow exactly)

```
Phase 1  (Week 1-2):  Foundation
  → Supabase setup + PostGIS
  → Spring Boot skeleton
  → V1-V3 Flyway migrations
  → React + Flutter project init
  → Design system tokens

Phase 2  (Week 3):   Core Backend APIs
  → Auth module (OTP + JWT)
  → User module
  → Technician module
  → Job module
  → All Flyway migrations (V1-V16)

Phase 3  (Week 4-5): AI + Matching + WebSocket
  → Gemini integration
  → ScoringEngine (matching algorithm)
  → WebSocket (live tracking)
  → FCM push notifications
  → RabbitMQ queues

Phase 4  (Week 6):   Owner Web App (React PWA)
  → All owner screens
  → Fault report + AI diagnosis
  → Tech selection + live tracking
  → Payments

Phase 5  (Week 7):   Tech Web + Admin Web
  → Technician dashboard
  → Admin verification + analytics

Phase 6  (Week 8):   Payments + Subscriptions
  → Razorpay full integration
  → Wallet + payouts
  → Invoice PDF + GST

Phase 7  (Week 9):   All 69 Features (Web)
  → All unique/world-first features
  → Video consultation (Agora)
  → Digital twin
  → Sound analysis
  → NFT badges

Phase 8  (Week 10):  Flutter Owner App
Phase 9  (Week 11):  Flutter Tech App + Testing
Phase 10 (Week 12):  PBL Submission
```

---

## KEY RULES (from RULES.md — never break these)

```
BACKEND:
  → Every endpoint needs @PreAuthorize
  → Controllers are THIN (no business logic)
  → All business logic in ServiceImpl
  → Always @Transactional on write methods
  → Never return raw entities (use DTOs)
  → Always @Valid on request DTOs
  → Soft deletes only (never hard delete)
  → All DB changes via Flyway only
  → DECIMAL(10,2) for money (never float)
  → TIMESTAMPTZ for all timestamps
  → PostGIS for all location data

REACT:
  → TypeScript strict (no 'any' type)
  → React Query for ALL server state
  → Redux only for global app state
  → Zod + React Hook Form for all forms
  → Tailwind only (no inline styles)
  → i18next for ALL text strings
  → Always show loading/error/empty states

FLUTTER:
  → Riverpod for ALL state management
  → go_router for ALL navigation
  → Dio for ALL HTTP calls
  → flutter_secure_storage for JWT tokens
  → const constructors everywhere
  → ListView.builder (never ListView)
  → CachedNetworkImage (never Image.network)
  → Minimum 48×48px touch targets

SECURITY:
  → NEVER hardcode API keys
  → NEVER commit .env files
  → NEVER log passwords/tokens/PII
  → Parameterised queries only (no SQL concat)
  → Rate limiting on all public endpoints
  → File upload: MIME + magic bytes check

GIT:
  → Branch: feature/{name}/{description}
  → Commit: feat/fix/docs/test: description
  → Never push to main or develop directly
  → PR required with 1 approval
```

---

## BRAND & DESIGN TOKENS

```css
/* Primary colors */
--color-blue-700: #1A3C6E;   /* Deep Blue — primary */
--color-teal-500: #00D4AA;   /* Electric Teal — accent */
--color-dark:     #0F172A;   /* Dark text */
--color-gray-50:  #F8FAFC;   /* Page background */
--color-white:    #FFFFFF;   /* Card background */

/* Industry colors */
--color-industrial:  #7C3AED; /* Purple */
--color-automobile:  #2563EB; /* Blue */
--color-electronics: #0891B2; /* Cyan */

/* Status colors */
--color-success: #16A34A;
--color-warning: #D97706;
--color-danger:  #DC2626;

/* Font */
font-family: 'Inter', sans-serif;
```

---

## IMPORTANT FEATURE: USER-CONTROLLED FLOW (v1.1)

```
After AI diagnosis, owner sees 3 paths:

PATH A: AI Copilot (FREE)
  → Owner tries to fix themselves
  → AI guides step by step
  → If not solved → escalate to B or C

PATH B: Video Consultation (₹99–₹299)
  → Video call with specialist
  → AI annotates live camera feed
  → If not solved → escalate to C
  → Fee deducted from physical job charge

PATH C: Book Technician (₹800+)
  → Tech dispatched to location
  → Always resolves

SKIP: Owner can skip any path anytime
  → Goes directly to technician list

Rules:
  → All 3 paths always visible
  → AI runs in background regardless
  → Cost shown before commitment
  → Escalation always open

New API endpoints for this:
  POST /api/v1/jobs/{id}/choose-path
  POST /api/v1/jobs/{id}/escalate
  GET  /api/v1/jobs/{id}/path-status
```

---

## MODULE STRUCTURE (Spring Boot)

```
Every module follows EXACTLY this pattern:

modules/{name}/
  {Name}Controller.java     ← HTTP only, thin
  {Name}Service.java        ← interface
  {Name}ServiceImpl.java    ← all business logic
  {Name}Repository.java     ← JPA interface
  {Name}.java               ← entity
  {Name}Mapper.java         ← MapStruct
  dto/
    {Name}DTO.java          ← response
    {Name}CreateRequest.java← POST body
    {Name}UpdateRequest.java← PUT body
    {Name}SummaryDTO.java   ← list item

14 modules:
  auth, user, technician, job, ai,
  matching, payment, tracking, rating,
  notification, industry, insurance,
  marketplace, wiki, admin
```

---

## API RESPONSE FORMAT (always use this)

```json
Success:
{
  "success": true,
  "data": { },
  "message": "OK",
  "timestamp": "2026-10-13T10:30:00Z",
  "requestId": "req_abc123"
}

Error:
{
  "success": false,
  "error": {
    "code": "JOB_001",
    "message": "Job not found"
  },
  "timestamp": "2026-10-13T10:30:00Z",
  "requestId": "req_abc123"
}
```

---

## DATABASE RULES

```sql
-- Every table must have:
id         BIGSERIAL PRIMARY KEY,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ,
deleted_at TIMESTAMPTZ  -- soft delete

-- Money: always DECIMAL(10,2)
amount DECIMAL(10,2)

-- Location: always PostGIS
location geography(POINT, 4326)

-- Arrays: always JSONB
skill_tags JSONB DEFAULT '[]'

-- Status: always VARCHAR (not ENUM)
status VARCHAR(20) NOT NULL DEFAULT 'POSTED'

-- Indexes: always on FK columns
CREATE INDEX idx_{table}_{col} ON {table}({col});
```

---

## GEMINI AI RULES

```java
// Always handle failure gracefully
try {
  diagnosis = geminiService.analyse(input);
} catch (AIServiceException e) {
  // Job NOT blocked — always return fallback
  diagnosis = DiagnosisDTO.fallback(industry);
}

// Always sanitise user input before prompt
String safe = userInput
  .replace("```", "")
  .replace("Ignore", "")
  .replace("System:", "")
  .substring(0, Math.min(1000, userInput.length()));

// Always end prompt with:
"Respond ONLY with valid JSON. No markdown."

// Always wrap response parse in try-catch
try {
  DiagnosisDTO result = objectMapper
    .readValue(geminiOutput, DiagnosisDTO.class);
} catch (JsonParseException e) {
  return DiagnosisDTO.fallback(industry);
}
```

---

## SCORING ALGORITHM (matching)

```java
// ScoringEngine.java
// Distance score (40% weight):
< 2km  → 100    2-5km  → 80
5-10km → 60     10-20km→ 40    > 20km → 20

// Skill score (60% weight):
All match  → 100   >50% match → 70
>25% match → 40    Any match  → 20
No match   → 0 (excluded from results)

// Base score:
base = (distanceScore * 0.40) + (skillScore * 0.60)

// Modifiers:
rating > 4.5  → +10    jobs > 100 → +5
rating > 4.0  → +5     resp < 2min → +5
fatigue_restricted → excluded at query level (AND is_fatigue_restricted = FALSE; never evaluated by scoring engine)

// Final:
final = min(100, max(0, base + modifiers))
```

---

## TAMPER-PROOF RECORDS

```java
// When job is completed:
String canonical = String.join("|",
  job.getId().toString(),
  job.getJobNumber(),
  job.getOwnerId().toString(),
  job.getTechnicianId().toString(),
  job.getFinalCost().toString(),
  job.getCompletedAt().toString()
);
String hash = sha256(canonical);
job.setHashValue(hash);
job.setIsTamperProofLocked(true);
// Job record is now cryptographically locked
```

---

## PAYMENT FLOW (Razorpay)

```
1. POST /payments/initiate → create Razorpay order
2. Frontend opens Razorpay checkout
3. User pays via UPI/card
4. Razorpay sends webhook to /payments/webhook/razorpay
5. Verify HMAC-SHA256 signature
6. Money held in escrow (not released yet)
7. After job completion → 24h wait
8. If no dispute → release to tech wallet
9. Daily payout at 11 AM (PayoutScheduler)
```

---

## WEBSOCKET TOPICS

```
/topic/job/{jobId}/location  → live tech location
/topic/job/{jobId}/status    → job status changes
/topic/auction/{jobId}       → auction updates
/user/queue/notifications    → private notifications
/app/tracking/update         → tech sends location
/topic/admin/live            → admin live feed
```

---

## HOW TO START (Phase 1)

```
Step 1: Supabase
  → Create project at supabase.com
  → Enable PostGIS:
    CREATE EXTENSION IF NOT EXISTS postgis;
  → Copy: URL, Anon Key, Service Key

Step 2: Spring Boot
  → start.spring.io
  → Java 17, Spring Boot 3.2
  → Dependencies: Web, JPA, Security,
    WebSocket, AMQP, Cache, Validation,
    Lombok, Flyway, PostgreSQL, H2, Actuator
  → Add manually: MapStruct, JJWT, Springdoc

Step 3: First migration
  → V1__create_users_and_auth.sql
  → V2__create_technicians.sql
  → V3__create_jobs_and_workflow.sql

Step 4: Common layer first
  → ApiResponse.java
  → GlobalExceptionHandler.java
  → JwtTokenProvider.java
  → JwtAuthFilter.java
  → SecurityConfig.java

Step 5: Auth module
  → Follow CODING_STANDARDS.md exactly
  → Test: POST /auth/send-otp in Postman

Step 6: Test
  → GET /api/v1/health → 200 OK
  → POST /auth/send-otp → OTP sent
  → POST /auth/verify-otp → JWT returned
```

---

## WHAT MAKES UPTIME UNIQUE (for context)

```
19 World-First Features including:

1.  AI Copilot with photo-verified steps
2.  Sound analysis for machine fault (no IoT)
3.  Digital twin from repair history (no IoT)
4.  AI price negotiation referee
5.  Repair pattern prediction (crowd-sourced)
6.  SHA-256 tamper-proof job records
7.  NFT skill badges on Polygon blockchain
8.  Crowd-sourced repair wiki (auto-generated)
9.  Engine sound fingerprint (per vehicle)
10. Vehicle mood score (daily health)
11. Pre-purchase vehicle scanner (200 checks)
12. Fault epidemic detection (50+ reports)
13. Silent killer detection (safety hazards)
14. Universal repair language (22 languages)
15. Device end-of-life ritual (AI memory reel)
16. Micro-insurance per job (auto-created)
17. OTP + GPS dual arrival verification
18. AI-annotated video consultation
19. Owner-controlled 3-path resolution
```

---

## QUICK REFERENCE

```
Base URL:      http://localhost:8080/api/v1
Auth header:   Authorization: Bearer {jwt}
Content-Type:  application/json
WS URL:        ws://localhost:8080/ws

Test accounts (after seeding V17):
  Owner:  9876543210 / OTP: 472918
  Tech:   9123456789 / OTP: 472918
  Admin:  admin@uptime.in / Demo@123

Free API limits:
  Gemini:     1M tokens/month
  Google Maps:$200 credit/month
  Supabase:   500MB + 2GB bandwidth
  Railway:    $5 free credit
  Vercel:     100GB bandwidth
  Cloudinary: 25GB storage
  FCM:        Free unlimited
  Total cost: ₹0/month during development
```

---

*UPTIME Master Prompt — v1.1*
*"Downtime ends here."*
*DSATM Bengaluru — VTU — 2026-27*
