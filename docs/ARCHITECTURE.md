# UPTIME — Complete System Architecture

> **Version:** 1.0  
> **Project:** AI-Assisted On-Demand Technician Dispatch Platform  
> **Institution:** DSATM Bengaluru — VTU  
> **Academic Year:** 2026–27  

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [High-Level System Diagram](#2-high-level-system-diagram)
3. [Client Layer — 6 Platforms](#3-client-layer--6-platforms)
4. [API Gateway Layer](#4-api-gateway-layer)
5. [Backend Service Layer](#5-backend-service-layer)
6. [Data Layer](#6-data-layer)
7. [AI Layer](#7-ai-layer)
8. [Real-Time Layer](#8-real-time-layer)
9. [Async Messaging Layer](#9-async-messaging-layer)
10. [External Services Layer](#10-external-services-layer)
11. [File & Media Layer](#11-file--media-layer)
12. [Notification Layer](#12-notification-layer)
13. [Payment Layer](#13-payment-layer)
14. [Video Call Layer](#14-video-call-layer)
15. [CDN & Edge Layer](#15-cdn--edge-layer)
16. [Security Architecture](#16-security-architecture)
17. [DevOps & CI/CD Architecture](#17-devops--cicd-architecture)
18. [Monitoring & Observability](#18-monitoring--observability)
19. [Core Job Flow — End to End](#19-core-job-flow--end-to-end)
20. [AI Diagnosis Flow](#20-ai-diagnosis-flow)
21. [Matching Algorithm Flow](#21-matching-algorithm-flow)
22. [Payment Flow](#22-payment-flow)
23. [Live Tracking Flow](#23-live-tracking-flow)
24. [Virtual Consultation Flow](#24-virtual-consultation-flow)
25. [Notification Flow](#25-notification-flow)
26. [Data Flow Diagrams](#26-data-flow-diagrams)
27. [Database Architecture](#27-database-architecture)
28. [Caching Architecture](#28-caching-architecture)
29. [Queue Architecture](#29-queue-architecture)
30. [Offline Architecture](#30-offline-architecture)
31. [Scalability Architecture](#31-scalability-architecture)
32. [Disaster Recovery Architecture](#32-disaster-recovery-architecture)
33. [Network Architecture](#33-network-architecture)
34. [Inter-Service Communication](#34-inter-service-communication)
35. [Error Handling Architecture](#35-error-handling-architecture)

---

## 1. Architecture Overview

UPTIME follows a **multi-tier client-server architecture** with a monolithic Spring Boot backend serving all six client platforms through a secured API Gateway. The architecture is designed for:

- **Simplicity** — single backend codebase, easier for 4-member student team
- **Cost efficiency** — ₹0/month on free tiers during PBL
- **Scalability** — can split into microservices post-PBL if needed
- **Reliability** — Redis caching, RabbitMQ async, Supabase managed DB

### Architecture Style

```
Style:        Modular Monolith (Spring Boot)
              → NOT microservices (too complex for PBL)
              → Modules inside single JAR, clear boundaries
              → Can extract to microservices after graduation

Communication:
  Sync:       REST over HTTPS (request-response)
  Async:      WebSocket (live tracking, real-time)
  Queue:      RabbitMQ (notifications, AI calls, emails)

Data stores:
  Primary:    Supabase PostgreSQL (all persistent data)
  Cache:      Upstash Redis (sessions, rate limiting, hot data)
  Files:      Cloudinary + Supabase Storage
  Local:      Hive (Flutter offline), localStorage (React PWA)
```

### Architecture Principles

```
1. Separation of Concerns
   → Each Spring Boot module handles one domain
   → React components are single-responsibility
   → Flutter features are isolated in separate folders

2. API First
   → All communication via REST APIs
   → Swagger documents every endpoint
   → Frontend and backend developed in parallel

3. Security by Default
   → Every endpoint requires authentication
   → RBAC on every method
   → No sensitive data in logs or URLs

4. Fail Gracefully
   → AI service unavailable → manual fault entry
   → Maps unavailable → text-based tracking
   → Payment failure → retry with clear message

5. Mobile First
   → Flutter apps designed for 2G/3G networks
   → All images compressed before upload
   → Offline mode for critical flows
```

---

## 2. High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                                     │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │  Owner Web   │  │  Owner App   │  │  Tech Web    │                      │
│  │  React PWA   │  │  Flutter     │  │  React       │                      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                      │
│         │                 │                 │                               │
│  ┌──────────────┐  ┌──────────────┐                                         │
│  │  Tech App    │  │  Admin Web   │                                         │
│  │  Flutter     │  │  React       │                                         │
│  └──────┬───────┘  └──────┬───────┘                                         │
└─────────┼─────────────────┼─────────────────────────────────────────────────┘
          │    HTTPS + WSS  │
          ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE EDGE                                     │
│              DDoS protection · CDN · SSL termination                        │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY                                        │
│        Rate Limiting · JWT Auth · CORS · Versioning · Logging               │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SPRING BOOT BACKEND (Modular Monolith)                   │
│                                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │   Auth   │ │   Job    │ │    AI    │ │ Matching │ │ Payment  │         │
│  │ Module   │ │ Module   │ │ Module   │ │ Module   │ │ Module   │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│                                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │Notif.    │ │Tracking  │ │Industry  │ │Insurance │ │Marketpl. │         │
│  │ Module   │ │ Module   │ │ Module   │ │ Module   │ │ Module   │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│                                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────────────────┐ │
│  │  Wiki    │ │  Admin   │ │DigTwin  │ │   7 Spring @Scheduled Jobs    │ │
│  │ Module   │ │ Module   │ │ Module  │ └───────────────────────────────┘ │
│  └──────────┘ └──────────┘ └─────────┘                                   │
└──────┬─────────────────────────┬──────────────────────┬────────────────────┘
       │                         │                      │
       ▼                         ▼                      ▼
┌──────────────┐   ┌─────────────────────┐   ┌─────────────────────────────┐
│   DATA LAYER │   │   MESSAGING LAYER   │   │     EXTERNAL SERVICES       │
│              │   │                     │   │                             │
│  Supabase    │   │  RabbitMQ           │   │  Gemini 1.5 Flash (AI)      │
│  PostgreSQL  │   │  (Async Queue)      │   │  Google Maps Platform       │
│  + PostGIS   │   │                     │   │  Razorpay (Payments)        │
│              │   │  Exchanges:         │   │  Firebase FCM (Push)        │
│  Upstash     │   │  → notifications    │   │  Twilio (OTP/SMS)           │
│  Redis       │   │  → ai_analysis      │   │  SendGrid (Email)           │
│  (Cache)     │   │  → emails           │   │  Cloudinary (Media)         │
│              │   │  → payouts          │   │  Agora.io (Video)           │
└──────────────┘   └─────────────────────┘   └─────────────────────────────┘
```

---

## 3. Client Layer — 6 Platforms

### 3.1 Owner Web App

```
Type:         React 18 PWA (Progressive Web App)
Repo:         uptime-owner-web
Deploy:       Vercel (auto-deploy on main push)
URL:          https://uptime.in

Stack:
  React 18 + TypeScript + Vite
  Tailwind CSS + shadcn/ui
  Redux Toolkit (global state)
  React Query / TanStack Query (server state)
  React Router v6 (routing)
  Axios (HTTP client)
  Socket.io-client (WebSocket)
  i18next (9 languages)
  @react-google-maps/api
  Recharts (analytics charts)
  Framer Motion (animations)
  React Hook Form + Zod (forms + validation)
  Lottie-react (animations)
  react-hot-toast (notifications)
  date-fns (date utils)

PWA features:
  Service Worker:   Cache-first for shell, network-first for API
  Manifest:         Installable on Android/iOS home screen
  Offline page:     Shown when network unavailable
  Background sync:  Queues failed requests until online
  Push API:         Web push notifications

Key state slices (Redux):
  authSlice:         user, token, role, industry
  jobSlice:          activeJob, jobHistory, currentStep
  notificationSlice: unread count, notification list
  industrySlice:     selected industry, assets
  uiSlice:           loading, modals, sidebar state

Build output:
  Main bundle:    < 200KB gzipped
  Per-page chunk: < 50KB
  Total:          < 1MB
  Lighthouse:     Performance > 90, PWA > 95
```

### 3.2 Owner Mobile App

```
Type:         Flutter 3.x (Android + iOS)
Repo:         uptime-owner-app
Package:      com.uptime.owner
Play Store:   UPTIME — Book Repairs
Deploy:       Manual APK for PBL demo
              GitHub Actions builds APK on tag

Stack:
  Flutter 3.x + Dart
  Riverpod 2.x (state management)
  go_router (navigation + deep links)
  Dio + pretty_dio_logger (HTTP)
  Hive + hive_flutter (offline storage)
  flutter_secure_storage (tokens)
  google_maps_flutter (maps)
  geolocator (GPS)
  camera + image_picker (media)
  speech_to_text (voice input, 9 languages)
  flutter_tts (text to speech)
  firebase_messaging (push notifications)
  flutter_local_notifications
  razorpay_flutter (payments)
  agora_rtc_engine (video calls)
  web_socket_channel (WebSocket)
  shimmer (loading skeletons)
  lottie (animations)
  flutter_animate (micro-animations)
  cached_network_image (image caching)
  fl_chart (earnings charts)
  permission_handler
  connectivity_plus (network detection)
  local_auth (biometric)

Build flavors:
  development → com.uptime.owner.dev
  staging     → com.uptime.owner.staging
  production  → com.uptime.owner

Minimum SDK: Android 21 (Android 5.0)
Target SDK:  Android 34
iOS min:     iOS 13
```

### 3.3 Technician Web App

```
Type:         React 18 SPA
Repo:         uptime-tech-web
Deploy:       Vercel
URL:          https://tech.uptime.in

Stack: Same as Owner Web + additions:
  TanStack Table v8 (job history tables)
  React Calendar (availability calendar)
  React Dropzone (document upload)
  Chart.js + react-chartjs-2 (earnings charts)

Primary users: Technicians at home/workshop
               (NOT the field app)
Key pages:    Dashboard, Earnings, Job History,
              Badges, Availability, Documents,
              Workshop, Analytics, Wiki
```

### 3.4 Technician Mobile App (CRITICAL FIELD APP)

```
Type:         Flutter 3.x — field-optimised
Repo:         uptime-technician-app
Package:      com.uptime.technician
Play Store:   UPTIME Tech
Deploy:       Manual APK for PBL demo

Additional packages vs owner app:
  flutter_foreground_task  → background GPS service
  flutter_background_geolocation → location tracking
  wakelock_plus            → keep screen on during job
  torch_light              → flashlight for inspection
  vibration                → haptic feedback on job request

Critical design decisions:
  → Larger touch targets (field gloves)
  → High contrast mode (outdoor sunlight)
  → Minimal taps to critical actions
  → Works on 2G network (compressed API)
  → Background location always-on during job
  → Cannot accidentally close during job

Android Foreground Service:
  → Runs as persistent notification
  → Title: "UPTIME — Job in Progress"
  → Prevents OS from killing GPS
  → Stops automatically on job completion
```

### 3.5 Admin Web App

```
Type:         React 18 SPA (internal tool)
Repo:         uptime-admin-web
Deploy:       Vercel (private, IP-restricted)
URL:          https://admin.uptime.in
Access:       Admin users only (2FA required)

Stack: Same as Owner Web + additions:
  TanStack Table v8 + column filters
  Chart.js heatmaps (epidemic monitor)
  React Leaflet (live jobs map overlay)
  Socket.io-client (live platform updates)

Security:
  → IP whitelist enforced at Cloudflare
  → 2FA required (Google Authenticator)
  → Session timeout 30 minutes
  → All actions logged to audit_logs
```

### 3.6 Spring Boot Backend

```
Type:         Modular Monolith (single deployable JAR)
Repo:         uptime-backend
Deploy:       Railway (Docker container)
URL:          https://api.uptime.in
Port:         8080

Java:         17 (LTS)
Spring Boot:  3.2.x
Build tool:   Maven
JVM options:  -Xms256m -Xmx512m (Railway free tier)

Internal modules:
  14 Spring @Service modules
  7  Spring @Scheduled jobs
  1  WebSocket server
  1  RabbitMQ consumer
  Flyway migrations (V1–V17)

Startup time: ~15–20 seconds cold start
Memory usage: ~256–400MB RAM
Railway free: 512MB RAM, shared CPU
```

---

## 4. API Gateway Layer

```
Implementation:   Spring Boot filters + interceptors
                  (No separate gateway service — too complex for PBL)
                  Cloudflare acts as edge gateway for external traffic

Components:

1. JwtAuthFilter (Spring Security filter chain)
   → Runs BEFORE every request
   → Extracts JWT from Authorization header
   → Validates signature against Supabase public key
   → Sets SecurityContext with user details
   → Rejects with 401 if invalid/expired

2. RateLimitFilter (custom filter)
   → Uses Upstash Redis token bucket
   → Per user: 100 requests/minute
   → Per IP: 200 requests/minute
   → OTP endpoints: 5 requests/10 minutes
   → Returns 429 Too Many Requests

3. CorsFilter (Spring CorsConfiguration)
   → Allowed origins: uptime.in, tech.uptime.in,
                       admin.uptime.in, localhost (dev)
   → Allowed methods: GET, POST, PUT, DELETE, PATCH
   → Allowed headers: Authorization, Content-Type
   → Credentials: allowed

4. RequestLoggingFilter
   → Logs method, path, status, response time
   → Writes to api_logs table (async via RabbitMQ)
   → Sanitises sensitive data before logging

5. ApiVersionInterceptor
   → Adds X-API-Version: 1 to all responses
   → Adds X-Request-ID: UUID for tracing
   → Adds rate limit headers

6. GlobalExceptionHandler (@ControllerAdvice)
   → Catches all exceptions
   → Returns standard error response format
   → Logs to error_logs table
   → Never exposes stack traces to clients

Request flow:
  Request
    → Cloudflare (SSL termination, DDoS)
    → JwtAuthFilter (auth check)
    → RateLimitFilter (rate check)
    → CorsFilter (CORS check)
    → RequestLoggingFilter (log)
    → ApiVersionInterceptor
    → Controller method (@PreAuthorize RBAC check)
    → Service layer
    → Repository (Supabase)
    → Response
    → GlobalExceptionHandler (if error)
```

---

## 5. Backend Service Layer

### 5.1 Module Architecture

```
Each module follows the same pattern:

Controller  → HTTP endpoints, request validation, response mapping
Service     → Business logic interface
ServiceImpl → Business logic implementation
Repository  → Spring Data JPA interface
Entity      → JPA entity mapping to DB table
DTO         → Data Transfer Objects (request/response)
Mapper      → Entity ↔ DTO conversion (MapStruct)

Example — Job module:
  JobController.java      @RestController @RequestMapping("/api/v1/jobs")
  JobService.java         interface
  JobServiceImpl.java     @Service implements JobService
  JobRepository.java      extends JpaRepository<Job, Long>
  Job.java                @Entity @Table(name="jobs")
  JobCreateRequest.java   request DTO
  JobDTO.java             response DTO
  JobMapper.java          @Mapper (MapStruct)
```

### 5.2 All 14 Modules

```
┌─────────────────────────────────────────────────────────────┐
│ Module          │ Endpoints        │ Key Responsibility      │
├─────────────────┼──────────────────┼─────────────────────────┤
│ auth            │ /auth/*          │ JWT, OTP, sessions      │
│ user            │ /users/*         │ Profile, addresses      │
│ technician      │ /technicians/*   │ Skills, verify, GPS     │
│ job             │ /jobs/*          │ Full job lifecycle      │
│ ai              │ /ai/*            │ All Gemini integrations │
│ matching        │ /matching/*      │ Scoring, dispatch       │
│ payment         │ /payments/*      │ Razorpay, wallet, GST   │
│ notification    │ /notifications/* │ FCM, SMS, email         │
│ tracking        │ /tracking/*      │ WebSocket, live GPS     │
│ industry        │ /industry/*      │ Machines, vehicles, devices│
│ insurance       │ /insurance/*     │ Policies, claims        │
│ marketplace     │ /marketplace/*   │ Parts, orders           │
│ wiki            │ /wiki/*          │ Articles, contributions │
│ admin           │ /admin/*         │ Platform management     │
└─────────────────┴──────────────────┴─────────────────────────┘
```

### 5.3 Cross-Cutting Concerns

```
Logging:
  → SLF4J + Logback
  → Log levels: INFO in prod, DEBUG in dev
  → Never log passwords, tokens, or PII
  → Request ID in every log line (MDC)

Transaction Management:
  → @Transactional on all service methods that write
  → Read-only transactions for queries (@Transactional(readOnly=true))
  → Rollback on RuntimeException

Validation:
  → Jakarta Bean Validation on all DTOs
  → @NotNull, @Size, @Pattern, @Email
  → Custom validators: @ValidPhone, @ValidCoordinates
  → Validation errors return 400 with field-level messages

Caching:
  → @Cacheable on frequently-read methods
  → @CacheEvict on write methods
  → Redis as cache store (Upstash)
  → TTLs defined per cache name

Async Processing:
  → @Async on notification sends
  → @Async on AI calls (non-critical path)
  → CompletableFuture for parallel operations
```

---

## 6. Data Layer

### 6.1 Supabase PostgreSQL

```
Provider:     Supabase (managed PostgreSQL 15)
Extension:    PostGIS (geospatial queries)
Free tier:    500MB database, 1GB storage
Pro tier:     8GB database, 100GB storage

Connection:
  URL:         jdbc:postgresql://db.xxx.supabase.co:5432/postgres
  Pool size:   10 connections (Railway free tier limit)
  Pool lib:    HikariCP (Spring Boot default)
  SSL:         required (Supabase enforces)

Schema management:
  Tool:        Flyway
  Location:    src/main/resources/db/migration/
  Naming:      V{version}__{description}.sql
  Migrations:
    V1__create_users_and_auth.sql
    V2__create_technicians.sql
    V3__create_jobs_and_workflow.sql
    V4__create_ai_and_diagnosis.sql
    V5__create_matching.sql
    V6__create_payments.sql
    V7__create_ratings.sql
    V8__create_industry_specific.sql
    V9__create_insurance.sql
    V10__create_marketplace.sql
    V11__create_notifications.sql
    V12__create_analytics_and_logs.sql
    V13__create_wiki.sql
    V14__create_admin.sql
    V15__add_indexes_and_spatial.sql
    V16__add_triggers_and_views.sql
    V17__seed_demo_data.sql

Tables:       141+
Columns:      1,700+
Indexes:      500+ (including GIST spatial indexes)

Key design patterns:
  → Soft deletes: deleted_at TIMESTAMPTZ (all user-facing tables)
  → Audit fields: created_at, updated_at on all tables
  → UUID vs BIGSERIAL: BIGSERIAL for IDs (simpler for JPA)
  → JSON columns: For flexible arrays (skill_tags, step_data)
  → Partitioning: live_location_tracking, api_logs (by month/year)
  → Triggers: Auto-update technician_statistics after job completion
  → Views: v_active_jobs, v_technician_dashboard, v_platform_summary
```

### 6.2 PostGIS Spatial Architecture

```
Why PostGIS:
  → Find technicians within 10km of a job site
  → Standard PostgreSQL cannot do this efficiently
  → PostGIS adds spatial data types and GiST indexes

Spatial columns:
  user_addresses.location          geography(POINT,4326)
  technician_locations.current     geography(POINT,4326)
  jobs.owner_location              geography(POINT,4326)
  vehicle_fuel_logs.location       geography(POINT,4326)
  insurance_claims.incident_location geography(POINT,4326)

GiST indexes on all spatial columns:
  CREATE INDEX idx_tech_loc ON technician_locations
  USING GIST(current_location);

Key spatial query (find nearby technicians):
  SELECT id, full_name,
    ST_Distance(current_location,
      ST_MakePoint(:lng,:lat)::geography) AS distance_m
  FROM technician_locations tl
  JOIN technicians t ON t.id = tl.technician_id
  WHERE t.is_available = TRUE
    AND ST_DWithin(current_location,
      ST_MakePoint(:lng,:lat)::geography, 10000)
  ORDER BY distance_m ASC;

Coordinate system:
  SRID 4326 = WGS84 (standard GPS coordinates)
  All coordinates stored as (longitude, latitude)
  ST_MakePoint(lng, lat) — note lng first!
```

### 6.3 Upstash Redis Cache

```
Provider:     Upstash (serverless Redis)
Free tier:    10,000 requests/day, 256MB
Connection:   RESP protocol over TLS

Use cases and TTLs:
┌────────────────────────────┬────────────┬──────────────────────────┐
│ Cache Key Pattern          │ TTL        │ What it stores           │
├────────────────────────────┼────────────┼──────────────────────────┤
│ user:{id}:profile          │ 15 minutes │ User profile DTO         │
│ tech:{id}:profile          │ 15 minutes │ Technician profile DTO   │
│ nearby_techs:{lat}:{lng}   │ 2 minutes  │ List of nearby techs     │
│ ai_diagnosis:{hash}        │ 10 minutes │ AI diagnosis result      │
│ subscription_plans         │ 1 hour     │ All plan tiers           │
│ wiki:{articleId}           │ 30 minutes │ Wiki article content     │
│ surge:{city}:{industry}    │ 5 minutes  │ Surge multiplier         │
│ otp:{phone}                │ 10 minutes │ OTP value (hashed)       │
│ login_attempts:{phone}     │ 30 minutes │ Failed attempt counter   │
│ session:{userId}           │ 24 hours   │ Active session data      │
│ rate_limit:{ip}:{endpoint} │ 1 minute   │ Request count            │
│ tech_online:{city}         │ 2 minutes  │ Online tech count        │
└────────────────────────────┴────────────┴──────────────────────────┘

Cache invalidation:
  → User profile updated → delete user:{id}:profile
  → Tech goes offline → delete nearby_techs:{lat}:{lng}
  → Job completed → delete all job-related keys
  → Subscription changed → delete subscription_plans

Spring Boot integration:
  @EnableCaching on UptimeApplication
  @Cacheable("nearby_techs") on findNearbyTechnicians()
  @CacheEvict("user:*") on updateUserProfile()
```

---

## 7. AI Layer

### 7.1 Gemini 1.5 Flash Integration

```
Provider:     Google AI Studio / Vertex AI
Model:        gemini-1.5-flash (free tier)
Free limit:   1,000,000 tokens/month, 15 req/min
API type:     REST (not SDK — more control)

HTTP call from Spring Boot:
  POST https://generativelanguage.googleapis.com
       /v1beta/models/gemini-1.5-flash:generateContent
  Headers: X-goog-api-key: {GEMINI_API_KEY}

Input types supported:
  → Text (fault description)
  → Image (machine/device photo) — base64 encoded
  → Audio (machine sound recording) — base64 encoded
  → Video (fault video) — base64 encoded
  → Inline data for files < 20MB
  → File URI for larger files via File API

All AI features:
┌──────────────────────────┬─────────────────────────────────────────┐
│ Feature                  │ What Gemini does                        │
├──────────────────────────┼─────────────────────────────────────────┤
│ Fault Triage             │ Analyses all inputs → fault category,   │
│                          │ urgency, cost estimate, skill tags       │
│ Sound Analysis           │ Analyses audio FFT patterns → fault type│
│ Image Analysis           │ Analyses machine/device photos → damage │
│ Repair Copilot           │ Step-by-step repair instructions        │
│ Negotiation Assistant    │ Suggests fair price range               │
│ Repair Prediction        │ Predicts failures from service history  │
│ Epidemic Detection       │ Classifies fault patterns across users  │
│ Silent Killer Detection  │ Analyses smart home data for hazards    │
│ Pre-Purchase Scan        │ Analyses vehicle inspection findings    │
│ Wiki Auto-Generation     │ Extracts repair knowledge from job data │
│ Video Consultation AI    │ Annotates live video frames             │
│ Universal Translation    │ Translates between 9 Indian languages   │
│ OCR Warranty Cards       │ Extracts warranty details from photos   │
│ End of Life Memory Reel  │ Generates asset lifecycle narrative     │
└──────────────────────────┴─────────────────────────────────────────┘
```

### 7.2 Prompt Architecture

```
Location: src/main/resources/prompts/

Files:
  fault_triage_v1.txt          → multi-modal fault analysis
  sound_analysis_v1.txt        → audio pattern fault detection
  image_analysis_v1.txt        → visual damage assessment
  copilot_step_v1.txt          → repair step guidance
  negotiation_v1.txt           → fair price calculation
  prediction_v1.txt            → failure prediction
  epidemic_v1.txt              → fault pattern classification
  silent_killer_v1.txt         → hazard detection
  pre_purchase_v1.txt          → vehicle inspection analysis
  wiki_extraction_v1.txt       → knowledge extraction
  translation_v1.txt           → multilingual translation
  ocr_warranty_v1.txt          → warranty card reading

Prompt versioning:
  → Prompts stored in ai_prompt_versions table
  → Version number increments on each change
  → Old versions retained for rollback
  → A/B testing via feature flags
  → Admin can edit prompts via Admin Web UI

Response parsing:
  → Gemini instructed to return JSON
  → Spring Boot parses JSON response
  → Validation layer checks required fields
  → Fallback values if parsing fails
  → Never expose raw Gemini response to clients
```

### 7.3 AI Error Handling

```
Gemini rate limit hit (429):
  → Retry after 4 seconds (exponential backoff)
  → Max 3 retries
  → If all fail → return DEGRADED diagnosis
  → Owner shown: "AI analysis temporarily slow,
                  manual entry available"

Gemini unavailable (503):
  → Log to error_logs with AI_ERROR type
  → Fall through to manual fault description
  → Job can proceed without AI diagnosis
  → Alert admin if failure rate > 5%

Invalid/unexpected response:
  → Validation checks all required fields
  → Missing fields → use default values
  → Log warning to Sentry
  → Never crash the job creation flow

Token limit exceeded:
  → Truncate input to 8,000 tokens
  → Prioritise: fault description > photos > audio
  → Log truncation to analytics
```

---

## 8. Real-Time Layer

### 8.1 WebSocket Architecture

```
Implementation:  Spring WebSocket + STOMP
Endpoint:        wss://api.uptime.in/ws
Library (web):   Socket.io-client (React)
Library (app):   web_socket_channel (Flutter)

STOMP topics:
  /topic/job/{jobId}/location
    → Technician GPS updates (every 5 seconds en route)
    → Payload: {lat, lng, speed, heading, eta_mins}
    → Subscribers: owner (tracks tech), admin (live map)

  /topic/job/{jobId}/status
    → Job status changes
    → Payload: {status, timestamp, message}
    → Subscribers: owner, technician

  /topic/auction/{jobId}
    → Auction updates (bonus changes, tech joining)
    → Payload: {current_bonus, techs_competing, time_left}
    → Subscribers: all nearby technicians

  /topic/admin/live
    → Platform-wide live updates for admin
    → Payload: {active_jobs, online_techs, alerts}
    → Subscribers: admin dashboard

  /user/queue/notifications
    → Personal notifications per user
    → Payload: {type, title, body, data}
    → Subscribers: individual users

Connection lifecycle:
  1. Client connects with JWT in STOMP CONNECT frame
  2. Server validates JWT
  3. Client subscribes to relevant topics
  4. Server sends updates when state changes
  5. Client disconnects on app background (saves battery)
  6. Reconnects automatically on app foreground

Fallback when WebSocket unavailable:
  → Polling every 30 seconds via REST API
  → /api/v1/jobs/{id}/status (simple GET)
  → Degrades gracefully, not crash
```

### 8.2 Live Location Tracking

```
Technician side (Flutter):
  Package: geolocator + flutter_foreground_task
  Frequency:
    En route:    every 5 seconds
    At site:     every 30 seconds
    Low battery: every 15 seconds
  Accuracy: Best (GPS, not network)
  Background: Android foreground service keeps GPS alive

Spring Boot side:
  Receives location from tech via WebSocket
  Stores to live_location_tracking table (partitioned)
  Calculates ETA using Google Maps Distance Matrix API
  Broadcasts updated location to owner via WebSocket
  Updates technician_locations table (current position)

Owner side (React/Flutter):
  Subscribes to /topic/job/{jobId}/location
  Updates Google Maps marker position smoothly
  Shows ETA countdown in UI
  Triggers "Almost there!" notification at 2 mins ETA

Location data lifecycle:
  → Stored during active job only
  → Deleted from live_location_tracking after 30 days
  → Last known location kept in technician_locations
```

---

## 9. Async Messaging Layer

### 9.1 RabbitMQ Architecture

```
Implementation:  RabbitMQ 3 (Docker local, Railway plugin prod)
Protocol:        AMQP 0-9-1
Management UI:   http://localhost:15672 (dev)
Spring library:  spring-boot-starter-amqp

Why RabbitMQ:
  → AI calls are slow (2–10 seconds)
     → Don't block HTTP response
  → Email/SMS sending can fail and retry
  → Notifications can be batched
  → Payout processing needs guaranteed delivery

Exchanges and Queues:
┌─────────────────────────────────────────────────────────────┐
│ Exchange              │ Type    │ Queues                    │
├───────────────────────┼─────────┼───────────────────────────┤
│ uptime.notifications  │ Direct  │ push.queue                │
│                       │         │ sms.queue                 │
│                       │         │ email.queue               │
│                       │         │ whatsapp.queue            │
├───────────────────────┼─────────┼───────────────────────────┤
│ uptime.ai             │ Direct  │ diagnosis.queue           │
│                       │         │ prediction.queue          │
│                       │         │ wiki.extraction.queue     │
├───────────────────────┼─────────┼───────────────────────────┤
│ uptime.payments       │ Direct  │ payout.queue              │
│                       │         │ invoice.queue             │
│                       │         │ receipt.queue             │
├───────────────────────┼─────────┼───────────────────────────┤
│ uptime.logs           │ Fanout  │ api.logs.queue            │
│                       │         │ audit.logs.queue          │
├───────────────────────┼─────────┼───────────────────────────┤
│ uptime.dlx            │ Direct  │ dead.letter.queue         │
│ (Dead Letter)         │         │ (failed messages stored)  │
└───────────────────────┴─────────┴───────────────────────────┘

Message flow example (push notification):
  1. JobService marks job accepted
  2. Publishes to uptime.notifications → push.queue
  3. FCMService consumer picks up message
  4. Calls Firebase FCM API
  5. If fails → message retried 3 times
  6. If all fail → moved to dead.letter.queue
  7. Admin alerted about DLQ buildup

Message durability:
  → All messages persistent (survive RabbitMQ restart)
  → Queues durable (survive restart)
  → Consumer ACK required (no silent failures)
```

---

## 10. External Services Layer

### 10.1 Google Maps Platform

```
APIs used:
  Maps JavaScript API  → Interactive maps (React)
  Maps Flutter SDK     → Maps in Flutter apps
  Directions API       → Route from tech to job site
  Distance Matrix API  → ETA calculation for matching
  Geocoding API        → Address ↔ coordinates conversion
  Places API           → Fuel station / workshop search
  Roads API            → Snap location to nearest road

Free credit: $200/month (resets monthly)
Estimated usage: ~₹800–1,500/month at moderate scale

Key integrations:
  Owner: Live tracking map (Uber-style moving marker)
  Tech:  Turn-by-turn navigation to job site
  Admin: Live heatmap of all active jobs
  Matching: Distance calculation between tech and job

Geocoding on signup:
  → User enters address as text
  → Geocoding API converts to lat/lng
  → Stored as POINT in Supabase
  → Reverse geocoded for display
```

### 10.2 Firebase FCM

```
Purpose:      Push notifications (Android + iOS + Web)
Free:         Unlimited push notifications
Package:      firebase-admin (Spring Boot)
              firebase_messaging (Flutter)
              @firebase/messaging (React PWA)

Notification types:
  DATA notifications (app handles display):
    → Job status updates (silent, update UI)
    → Location updates (silent, update map)

  NOTIFICATION notifications (OS displays):
    → New job request (tech sees with sound)
    → Payment received
    → Badge earned
    → Warranty expiry alerts

Device token management:
  → Token stored in user_devices table
  → Multiple tokens per user (phone + tablet + web)
  → Token refreshed automatically by Firebase SDK
  → Invalid tokens removed after 30 days

Topic subscriptions:
  → uptime_industrial_{city}  → industrial owners
  → uptime_auto_{city}        → auto owners
  → uptime_electronics_{city} → electronics owners
  → uptime_tech_{city}        → technicians in city
  → uptime_epidemic_{model}   → device model alerts
```

### 10.3 Twilio

```
Purpose:      OTP delivery, SMS alerts, WhatsApp
Trial credit: $15 (sufficient for PBL demo)
Cost:         ~₹0.40 per SMS in India

OTP flow:
  1. User enters phone number
  2. Spring Boot generates 6-digit OTP
  3. OTP stored in Redis with 10-min TTL
  4. Twilio sends SMS via REST API
  5. User enters OTP in app
  6. Spring Boot verifies against Redis
  7. JWT issued if correct
  8. Redis key deleted (single use)

WhatsApp (future):
  → Twilio WhatsApp Business API
  → Job status updates via WhatsApp
  → OTP via WhatsApp as fallback

SMS templates registered in India:
  (DLT registration required for bulk SMS)
  OTP: "Your UPTIME OTP is {otp}. Valid 10 mins."
  Job: "Technician {name} accepted your job. ETA: {eta}"
```

### 10.4 SendGrid

```
Purpose:      Transactional email
Free:         100 emails/day (forever)
Templates:    Dynamic templates in SendGrid dashboard

Emails sent:
  → OTP backup (if SMS fails)
  → Job confirmation (owner + tech)
  → Invoice + receipt
  → Payout confirmation (technician)
  → Warranty expiry warning
  → Subscription renewal
  → Welcome email on signup
  → Password reset (admin portal)
  → Dispute resolution outcome

Template variables:
  {{owner_name}}, {{tech_name}}, {{job_number}},
  {{amount}}, {{invoice_url}}, {{rating_url}}
```

### 10.5 Razorpay

```
Purpose:      Payment processing + technician payouts
Account type: Free (2% commission per transaction)
Test mode:    Available during PBL (no real money)

Payment flow:
  1. Owner initiates payment in app
  2. Spring Boot creates Razorpay Order via API
  3. Order ID returned to client
  4. Client opens Razorpay checkout (SDK)
  5. Owner pays (UPI/card/EMI/wallet)
  6. Razorpay sends webhook to Spring Boot
  7. Spring Boot verifies HMAC signature
  8. Marks transaction as SUCCESS
  9. Credits technician wallet (escrow hold released)

Payment methods:
  → UPI (PhonePe, Google Pay, Paytm)
  → Credit/Debit cards (Visa, Mastercard, Rupay)
  → Net banking (50+ banks)
  → EMI (6/9/12 months on cards)
  → UPTIME Wallet (pre-loaded balance)

Payout flow (daily at 11 AM):
  1. PayoutScheduler finds eligible wallet balances
  2. Jobs completed > 24 hours ago
  3. No active dispute on those jobs
  4. Razorpay Payout API called
  5. Money transferred to tech's bank account
  6. Payout record created, wallet debited

Razorpay dashboard:
  → All transactions visible
  → Refund management
  → Settlement reports
  → Tax (GST) reports
```

---

## 11. File & Media Layer

```
Two storage services used:

┌─────────────────┬────────────────────────────────────────────┐
│ Cloudinary      │ Used for:                                  │
│                 │ Job photos (before/after)                   │
│ Free: 25GB      │ Machine/vehicle/device images              │
│       25 credits│ Sound recordings (audio analysis)          │
│                 │ Job videos                                  │
│                 │ Virtual consultation recordings            │
│                 │ Wiki article images                        │
│                 │ User profile photos                        │
│                 │ Transformation (resize, compress, WebP)    │
├─────────────────┼────────────────────────────────────────────┤
│ Supabase        │ Used for:                                  │
│ Storage         │ Technician verification documents          │
│                 │ Warranty card scans                        │
│ Free: 1GB       │ Admin-only documents                       │
│                 │ Small files < 5MB                          │
└─────────────────┴────────────────────────────────────────────┘

Upload flow:
  1. Client compresses image (Flutter: flutter_image_compress)
  2. Client uploads to Spring Boot via multipart
  3. Spring Boot validates (MIME, size, magic bytes)
  4. Strips EXIF metadata (privacy)
  5. Uploads to Cloudinary via REST API
  6. Cloudinary returns CDN URL
  7. URL stored in DB
  8. CDN URL returned to client

Image transformations via Cloudinary URL:
  Thumbnail:   .../upload/w_200,h_200,c_fill/image.jpg
  Compressed:  .../upload/q_80,f_webp/image.jpg
  Full:        .../upload/image.jpg

Cloudinary folders:
  uptime/profiles/        → profile photos
  uptime/jobs/{jobId}/    → job media
  uptime/machines/        → machine photos
  uptime/vehicles/        → vehicle photos
  uptime/devices/         → device photos
  uptime/wiki/            → wiki images
  uptime/consultations/   → video call recordings
```

---

## 12. Notification Layer

```
Multi-channel notification system:

Channel priority:
  1. Push (FCM)      → instant, free, works offline
  2. WhatsApp        → high open rate, paid
  3. SMS (Twilio)    → reliable fallback
  4. Email (SendGrid)→ detailed content, receipts

Notification service architecture:
  NotificationController
    → receives notification requests from other modules
    → publishes to RabbitMQ (not synchronous!)
  
  RabbitMQ consumers:
    FCMConsumer      → reads push.queue
    SMSConsumer      → reads sms.queue
    EmailConsumer    → reads email.queue
  
  TemplateService:
    → Loads template from notification_templates table
    → Replaces {{variables}} with actual values
    → Handles multilingual templates (9 languages)
    → Uses owner's preferred_language setting

User preferences respected:
  → notification_preferences table per type per user
  → DND hours respected (no push during DND)
  → Channel preferences (some users prefer SMS)
  → Batch mode for non-urgent (send at 9 AM)

Analytics:
  → push_delivery_logs: tracks FCM delivery status
  → notification_analytics: daily open/click rates
  → Admin can see which notification types perform best
```

---

## 13. Payment Layer

```
Payment state machine:

  INITIATED
      ↓ (Razorpay order created)
  ORDER_CREATED
      ↓ (owner completes payment)
  PAYMENT_CAPTURED (webhook received)
      ↓ (24 hours, no dispute)
  IN_ESCROW
      ↓ (PayoutScheduler runs)
  PAYOUT_INITIATED
      ↓ (Razorpay transfers to bank)
  PAYOUT_COMPLETED

  If dispute raised:
  IN_ESCROW → DISPUTED
      ↓ (admin resolves)
  REFUNDED (owner) or RELEASED_TO_TECH

Commission structure:
  Gross amount:         ₹1,000
  Platform commission:  ₹100 (10%)
  GST on commission:    ₹18 (18% GST)
  Technician receives:  ₹882

GST calculation:
  Intra-state job (same state):
    CGST: 9% of commission
    SGST: 9% of commission
  Inter-state job:
    IGST: 18% of commission
  Stored in gst_records table

Wallet system:
  → Each technician has a wallet
  → Completed job earnings → wallet
  → Wallet → bank (via Razorpay payout)
  → Wallet → job payment (owner)
  → Minimum payout: ₹100
  → Maximum payout per day: ₹10,000 (KYC limit)

Invoice generation:
  → PDF generated using iText library
  → Contains job details, parts, labour, GST
  → SHA-256 hash embedded in invoice
  → Stored in Cloudinary
  → URL stored in invoices table
```

---

## 14. Video Call Layer

```
Primary:   Agora.io RTC SDK
Fallback:  WebRTC (peer-to-peer, no server needed)
Free:      10,000 minutes/month (Agora)

Agora architecture:
  1. Owner requests virtual consultation
  2. Spring Boot calls Agora Token API
  3. Agora generates channel token (30-min expiry)
  4. Token sent to both owner and tech
  5. Both join same Agora channel
  6. Video/audio flows via Agora media servers
  7. Spring Boot is NOT in the media path
     (only manages tokens and records metadata)

AI overlay during call:
  1. Client captures video frame every 5 seconds
  2. Frame sent to Spring Boot (small JPEG)
  3. Spring Boot sends to Gemini vision API
  4. Gemini returns fault annotations
  5. Annotations overlaid on client's video feed
  6. Owner sees AI markers on live feed

Flutter implementation:
  agora_rtc_engine package
  Camera preview widget + Agora view
  Custom annotation overlay (Canvas widget)
  Controls: mute, flip camera, annotate, end call

Recording:
  → Owner must consent before recording starts
  → Agora cloud recording to S3 (Agora managed)
  → URL stored in virtual_consultations table
  → Recording expires after 30 days
  → Can be reviewed in job history
```

---

## 15. CDN & Edge Layer

```
Provider:    Cloudflare (free tier)
What it does:
  → SSL/TLS termination (HTTPS everywhere)
  → DDoS protection (automatic, always-on)
  → Global CDN (static assets cached at edge)
  → Caching rules (static vs dynamic)
  → IP-based access rules (admin site restriction)
  → Bot protection
  → Analytics (request counts, bandwidth)

Cloudflare caching rules:
  Cache everything:
    *.js, *.css, *.jpg, *.png, *.webp, *.svg
    Cache-Control: max-age=31536000 (1 year)
    
  Never cache:
    /api/* (always fresh)
    /ws/*  (WebSocket, bypass CDN)
    /auth/* (security-sensitive)

DNS management:
  uptime.in         → Vercel (owner web)
  tech.uptime.in    → Vercel (tech web)
  admin.uptime.in   → Vercel (admin web, IP restricted)
  api.uptime.in     → Railway (backend)
  app.uptime.in     → Flutter deep link handler

IP restriction (admin):
  → Cloudflare WAF rule
  → Only specific IPs can access admin.uptime.in
  → All others get 403 Forbidden
```

---

## 16. Security Architecture

### 16.1 Authentication Flow

```
Owner/Technician login:
  1. User enters phone number
  2. POST /auth/send-otp
  3. Spring Boot generates 6-digit OTP
  4. OTP hashed + stored in Redis (10 min TTL)
  5. Twilio sends SMS
  6. User enters OTP
  7. POST /auth/verify-otp
  8. Spring Boot verifies hash
  9. Creates JWT (RS256, 24h expiry)
  10. Creates refresh token (30-day, stored in DB)
  11. Returns {accessToken, refreshToken, user}

JWT structure:
  Header: {alg: "RS256", typ: "JWT"}
  Payload: {
    sub: "user_id",
    role: "OWNER|TECHNICIAN|ADMIN",
    industry: "INDUSTRIAL|AUTOMOBILE|ELECTRONICS",
    iat: timestamp,
    exp: timestamp + 86400
  }
  Signature: RS256(header.payload, privateKey)

Token refresh:
  POST /auth/refresh-token
  Body: {refreshToken}
  → Validates refresh token in DB
  → Issues new access token
  → Rotates refresh token (old invalidated)

Admin login:
  1. Email + password (bcrypt 12 rounds)
  2. If valid → TOTP challenge (Google Auth)
  3. TOTP verified → JWT issued
  4. IP checked against whitelist
  5. Session logged in audit_logs
```

### 16.2 Authorisation (RBAC)

```
Roles:
  OWNER         → can manage own jobs, assets, payments
  TECHNICIAN    → can view/accept jobs, update location
  ADMIN         → platform management, verification
  SUPER_ADMIN   → full access including admin management

Spring Security annotations:
  @PreAuthorize("hasRole('OWNER')")          → owners only
  @PreAuthorize("hasRole('TECHNICIAN')")     → techs only
  @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
  @PreAuthorize("@jobSecurity.isOwner(#jobId, authentication)")

Custom security expressions:
  jobSecurity.isOwner()    → checks job belongs to requesting user
  jobSecurity.isTech()     → checks tech assigned to job
  jobSecurity.canAccess()  → combined check

Resource-level security:
  → Owner can only see their own jobs
  → Technician can only see jobs assigned to them
  → Cross-user data access returns 403 Forbidden
```

### 16.3 Security Layers Summary

```
Layer 1: Cloudflare
  → DDoS mitigation
  → SSL termination
  → Bot protection
  → IP whitelist for admin

Layer 2: API Gateway (Spring filters)
  → JWT validation
  → Rate limiting (Upstash Redis)
  → CORS enforcement
  → Request logging

Layer 3: Application (Spring Security)
  → RBAC (@PreAuthorize)
  → Input validation (Bean Validation)
  → SQL injection prevention (JPA only)
  → XSS prevention (input sanitisation)

Layer 4: Data (Supabase)
  → Row Level Security (Supabase RLS)
  → Encrypted at rest
  → TLS on all connections
  → Audit logging

Layer 5: Infrastructure
  → Environment variables (no hardcoded secrets)
  → GitHub Secrets for CI/CD
  → Docker secrets for containers
  → Regular dependency scanning (OWASP)
```

---

## 17. DevOps & CI/CD Architecture

### 17.1 GitHub Actions Pipelines

```
Pipeline per repository:

uptime-backend (.github/workflows/backend.yml):
  Trigger: push to any branch
  Jobs:
    test:
      - Checkout code
      - Set up JDK 17
      - Cache Maven dependencies
      - Run: mvn test
      - Upload test results
    build:
      - Run: mvn package -DskipTests
      - Build Docker image
      - Push to GitHub Container Registry
    deploy-staging:
      - Condition: branch = develop
      - Deploy to Railway staging
    deploy-prod:
      - Condition: branch = main
      - Requires manual approval
      - Deploy to Railway production

uptime-owner-web (.github/workflows/owner-web.yml):
  Trigger: push to any branch
  Jobs:
    lint-test:
      - npm ci
      - npm run lint (ESLint)
      - npm run type-check (TypeScript)
    build:
      - npm run build
      - Upload dist/ artifact
    deploy-staging:
      - Condition: branch = develop
      - vercel deploy --env staging
    deploy-prod:
      - Condition: branch = main
      - vercel deploy --prod

flutter-build (.github/workflows/flutter.yml):
  Trigger: push to main or develop
  Jobs:
    analyze:
      - flutter pub get
      - flutter analyze
      - flutter test
    build-apk:
      - flutter build apk --flavor production
      - Upload APK as artifact
      - (For PBL demo download)
```

### 17.2 Environments

```
┌─────────────────────────────────────────────────────────────┐
│ Environment │ Branch    │ Backend          │ Frontend        │
├─────────────┼───────────┼──────────────────┼─────────────────┤
│ Development │ feature/* │ localhost:8080   │ localhost:3000  │
│ Staging     │ develop   │ Railway staging  │ Vercel preview  │
│ Production  │ main      │ Railway prod     │ Vercel prod     │
└─────────────┴───────────┴──────────────────┴─────────────────┘

Feature flags control what's enabled per environment:
  → Gemini AI: ON in all environments
  → Real payments: OFF in dev/staging (test mode)
  → Email sending: OFF in dev (logged to console)
  → SMS sending: OFF in dev (logged to console)
```

---

## 18. Monitoring & Observability

```
Three-layer observability:

Layer 1: Error Tracking (Sentry)
  → All 6 platforms connected
  → Frontend: @sentry/react, @sentry/flutter
  → Backend: sentry-spring-boot-starter
  → Alerts on: new error type, spike > 10/min
  → Performance: p95 response time > 2 seconds
  → Release tracking per deployment

Layer 2: Uptime Monitoring (UptimeRobot)
  → Monitors /api/v1/health every 5 minutes
  → Email + SMS alert if down
  → Status page: status.uptime.in
  → 30-day SLA report

Layer 3: Application Metrics (Spring Boot Actuator)
  → /actuator/health     → DB, Redis, RabbitMQ health
  → /actuator/metrics    → JVM memory, HTTP requests
  → /actuator/info       → App version, build info
  → Protected by admin credentials
  → Cloudflare IP-restricted

Custom platform health (PlatformHealthScheduler):
  Every 10 minutes:
  → Active technician ratio (online/total)
  → Job success rate (completed/total today)
  → AI error rate (failed/total AI calls)
  → Average matching time
  → Payment failure rate
  → App crash rate (from Sentry)
  → Composite score 0–100
  → Stored in platform_health_scores
  → Alert admin if score < 70

Log aggregation:
  → Spring Boot: SLF4J → Logback → Railway log viewer
  → React: console.error → Sentry
  → Flutter: debugPrint → Sentry
  → Structured logs: JSON format with request ID
```

---

## 19. Core Job Flow — End to End

```
Step 1: Owner reports fault
━━━━━━━━━━━━━━━━━━━━━━━━━
  Client:  POST /api/v1/jobs (multipart form)
           Fields: industry, asset_id, description,
                   urgency, location (lat/lng)
           Files:  photos[], audio?, video?
  
  Backend: 1. Validate request (Bean Validation)
           2. Upload media to Cloudinary (async)
           3. Create job record in DB (status=POSTED)
           4. Publish AI analysis task to RabbitMQ
           5. Return job ID and status immediately

Step 2: AI fault triage
━━━━━━━━━━━━━━━━━━━━━━━
  RabbitMQ consumer picks up AI task:
  1. Load media URLs from Cloudinary
  2. Build Gemini prompt with media
  3. Call Gemini 1.5 Flash API
  4. Parse JSON response:
     {fault_category, urgency, cost_min, cost_max,
      skill_tags[], diagnosis_text, confidence}
  5. Update job with AI results (status=AI_ANALYZED)
  6. Store in ai_fault_diagnoses table
  7. Push update to owner via WebSocket

Step 3: Matching algorithm
━━━━━━━━━━━━━━━━━━━━━━━━━━
  MatchingService.findBestTechnicians():
  1. Query technician_locations within 20km
     (PostGIS ST_DWithin spatial query)
  2. Filter: is_available=TRUE, verified=APPROVED
             skills contain AI fault tags
             not fatigue_restricted
  3. For each candidate:
     distance_score = score_by_distance(km)
     skill_score = score_by_skill_match(tags)
     total = distance_score*0.4 + skill_score*0.6
  4. Apply modifiers:
     +10 if rating > 4.5
     +5  if jobs > 100
     +5  if avg_response_time < 2 min
     exclude if is_fatigue_restricted = TRUE (filtered in query)
  5. Sort by total_score DESC
  6. Store scores in matching_scores table
  7. Return top 10 to owner

Step 4: Owner selects technician
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Owner sees ranked list with:
    - Name, rating, distance, ETA, price range
    - Match score indicator
  Owner taps "Book Now" on preferred technician
  POST /api/v1/matching/{jobId}/select

Step 5: Technician notified
━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. FCM push sent to tech (DATA + NOTIFICATION)
  2. Deep link: app.uptime.in/request/{jobId}
  3. Tech Flutter app opens JobRequestScreen
  4. 60-second countdown timer starts
  5. Tech sees: fault, location, distance, amount
  6. Tech taps ACCEPT

Step 6: Live tracking
━━━━━━━━━━━━━━━━━━━━
  1. Job status → EN_ROUTE
  2. Tech Flutter app starts foreground GPS service
  3. Location sent to WebSocket every 5 seconds
  4. Spring Boot: stores location, recalculates ETA
  5. Owner sees tech moving on Google Maps
  6. Owner gets "Tech is 2 mins away!" push at ETA=2

Step 7: Arrival verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Tech taps "I've Arrived"
  2. Spring Boot generates 6-digit OTP
  3. OTP sent to owner via SMS + push
  4. Tech enters OTP shown by owner
  5. Spring Boot verifies OTP AND GPS proximity
     (tech must be within 500m of job site)
  6. Job status → ARRIVED
  7. GPS foreground service slows to 30-sec updates

Step 8: Repair with AI Copilot
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Job status → IN_PROGRESS
  2. AI Copilot loads first step for fault category
  3. Tech follows steps on screen
  4. Each step: instruction + photo capture required
  5. Gemini verifies photo matches expected state
  6. Parts used logged with prices
  7. Before/after photos captured

Step 9: Job completion
━━━━━━━━━━━━━━━━━━━━━━
  1. Tech taps "Mark Complete"
  2. Owner confirms (or auto-confirms after 24h)
  3. Final cost recorded
  4. Invoice PDF generated (iText)
  5. SHA-256 hash computed on job record
  6. Job record locked (is_tamper_proof_locked=TRUE)
  7. Digital twin updated with repair
  8. Certificate PDF stored in Cloudinary

Step 10: Post-job
━━━━━━━━━━━━━━━━━
  1. Razorpay payment processed
  2. Tech wallet credited (escrow released)
  3. Both parties receive rating prompt (48h window)
  4. Trust scores recalculated
  5. AI extracts knowledge → wiki article created
  6. Repair prediction model updated
  7. Carbon credits issued (repair vs replace)
  8. Job stats: avg job time, parts cost, industry
```

---

## 20. AI Diagnosis Flow

```
Input collection:
  → Text description (all languages via Gemini)
  → Voice recording (speech_to_text → text)
  → Photos (up to 10 images)
  → Video (up to 2 minutes)
  → Machine sound (audio recording)
  → IoT data (smart home JSON, if available)

Gemini API call structure:
{
  "contents": [{
    "parts": [
      {"text": "System prompt from fault_triage_v1.txt"},
      {"text": "User description: {description}"},
      {"text": "Industry: {industry}, Asset: {asset_type}"},
      {"inline_data": {"mime_type": "image/jpeg",
                       "data": "{base64_photo}"}},
      {"inline_data": {"mime_type": "audio/mp3",
                       "data": "{base64_audio}"}}
    ]
  }],
  "generationConfig": {
    "responseMimeType": "application/json",
    "temperature": 0.1
  }
}

Expected JSON response:
{
  "fault_category": "MOTOR_BEARING_FAILURE",
  "urgency": "HIGH",
  "confidence": 0.87,
  "estimated_cost_min": 800,
  "estimated_cost_max": 1500,
  "estimated_time_hours": 2,
  "skill_tags": ["motor_repair", "bearing_replacement"],
  "required_tools": ["bearing_puller", "multimeter"],
  "diagnosis_text": "...",
  "safety_warnings": ["disconnect_power_first"],
  "diy_possible": false,
  "diy_instructions": null
}

Fallback if AI fails:
  → Show manual category selector
  → Owner selects from dropdown
  → Matching still works (with lower accuracy)
  → Job creation not blocked
```

---

## 21. Matching Algorithm Flow

```
Input:
  job.owner_location  (POINT)
  job.ai_fault_category (string)
  job.skill_tags (array)
  job.urgency (enum)
  job.industry (enum)

Step 1: Spatial filter
  SELECT * FROM technicians t
  JOIN technician_locations tl ON t.id = tl.technician_id
  JOIN technician_skills ts ON t.id = ts.technician_id
  WHERE
    t.is_available = TRUE
    AND t.verification_status = 'APPROVED'
    AND t.is_fatigue_restricted = FALSE
    AND t.industry_type IN (job.industry, 'ALL')
    AND ST_DWithin(tl.current_location,
                   job.owner_location, 20000)  -- 20km

Step 2: Score calculation (Java ScoringEngine)
  For each candidate tech:

  distance_km = ST_Distance(tech_loc, job_loc) / 1000
  distance_score:
    < 2km  → 100
    2-5km  → 80
    5-10km → 60
    10-20km→ 40
    > 20km → 20

  skill_match = intersect(tech.skills, job.skill_tags).size
  skill_score:
    all tags match → 100
    >50% match     → 70
    >25% match     → 40
    any match      → 20
    no match       → 0 (excluded)

  base_score = distance_score * 0.40 +
               skill_score * 0.60

  modifiers:
    if tech.rating_avg > 4.5: +10
    if tech.rating_avg > 4.0: +5
    if tech.total_jobs > 100: +5
    if tech.avg_response_time < 120s: +5
    if surge_active: no modifier (all techs needed)

  final_score = min(100, base_score + modifiers)

Step 3: Store and return
  INSERT INTO matching_scores
    (job_id, technician_id, total_score,
     distance_score, skill_score, distance_km,
     eta_mins, rank_position)
  
  Return top 10 by final_score DESC

Step 4: Notify technicians
  → FCM push to top 10 techs simultaneously
  → 60-second acceptance window each
  → If top tech declines → next tech notified
  → If no acceptance in 30 min → owner notified
  → Auction auto-starts for CRITICAL urgency
```

---

## 22. Payment Flow

```
Initiation:
  Owner: POST /api/v1/payments/initiate
    body: {jobId, amount, method}
  
  Spring Boot:
    1. Calculate final amount
       (labour + parts + tax - wallet balance)
    2. Create Razorpay Order:
       POST https://api.razorpay.com/v1/orders
       body: {amount_paise, currency, receipt}
    3. Return order_id to client

Client payment:
  Flutter: razorpay_flutter.openCheckout({
    key: RAZORPAY_KEY,
    amount: amount_paise,
    order_id: order_id,
    name: "UPTIME",
    description: job_number,
    prefill: {contact: phone, email: email}
  })

Webhook confirmation:
  POST /api/v1/payments/webhook/razorpay
  Header: X-Razorpay-Signature
  
  Spring Boot:
    1. Verify HMAC-SHA256 signature
    2. Parse event type
    3. payment.captured:
       → Mark transaction SUCCESS
       → Credit tech wallet (escrow hold)
       → Send receipt email + push
    4. payment.failed:
       → Mark FAILED
       → Notify owner to retry
       → Job NOT cancelled (can retry)

Payout (daily 11 AM scheduler):
  SELECT wallet_transactions
  WHERE type = 'CREDIT'
    AND job.completed_at < NOW() - INTERVAL '24 hours'
    AND NOT EXISTS (dispute for this job)
    AND payout_status = 'PENDING'
  
  For each eligible:
    POST https://api.razorpay.com/v1/payouts
    body: {account_number, amount, purpose, fund_account_id}
    Update payout record
    Debit tech wallet
    Send payout confirmation push
```

---

## 23. Live Tracking Flow

```
Producer (Technician Flutter App):
  geolocator.getPositionStream(
    locationSettings: LocationSettings(
      accuracy: LocationAccuracy.best,
      distanceFilter: 10  // update every 10 meters
    )
  ).listen((position) {
    webSocketChannel.sink.add(jsonEncode({
      'type': 'LOCATION_UPDATE',
      'jobId': activeJobId,
      'lat': position.latitude,
      'lng': position.longitude,
      'speed': position.speed,
      'heading': position.heading,
      'battery': batteryLevel,
      'timestamp': DateTime.now().toIso8601String()
    }));
  });

Consumer (Spring Boot WebSocket Handler):
  @MessageMapping("/tracking/update")
  public void handleLocationUpdate(LocationUpdate update) {
    // 1. Validate tech is assigned to this job
    // 2. Store to live_location_tracking
    // 3. Update technician_locations (current position)
    // 4. Calculate ETA via Google Maps Distance Matrix
    // 5. Broadcast to job topic
    messagingTemplate.convertAndSend(
      "/topic/job/" + update.getJobId() + "/location",
      new LocationBroadcast(update, etaMinutes)
    );
  }

Consumer (Owner React/Flutter):
  stompClient.subscribe(
    `/topic/job/${jobId}/location`,
    (message) => {
      const {lat, lng, eta_mins} = JSON.parse(message.body);
      // Update marker position on Google Maps
      markerRef.current.setPosition({lat, lng});
      // Update ETA display
      setEta(eta_mins);
    }
  );

ETA calculation:
  Google Maps Distance Matrix API:
    origins: tech_current_lat_lng
    destinations: job_owner_lat_lng
    mode: driving
    departure_time: now
  Returns: duration_in_traffic (real-time traffic)
  
  Caching: ETA cached 1 minute (avoid API quota)
  Fallback: haversine formula if Maps unavailable
```

---

## 24. Virtual Consultation Flow

```
Step 1: Owner books consultation
  POST /api/v1/consultations
  body: {jobId, tier, industry}
  
  Spring Boot:
    1. Find available remote-certified tech
    2. Create virtual_consultations record
    3. Generate Agora channel name (UUID)
    4. Generate Agora token for owner (expiry 30 min)
    5. Notify tech via push
    6. Return {consultationId, agoraChannel, token}

Step 2: Both join video call
  Owner Flutter:
    AgoraRtcEngine.joinChannel(token, channel)
  
  Tech Flutter:
    AgoraRtcEngine.joinChannel(token, channel)

Step 3: AI annotation (every 5 seconds)
  Owner Flutter:
    → Capture current camera frame as JPEG
    → POST /api/v1/consultations/{id}/analyze-frame
    → Frame sent to backend
  
  Spring Boot:
    → Forward frame to Gemini vision
    → Prompt: "Analyse this repair image and return
               fault indicators as bounding boxes
               with descriptions"
    → Return {annotations: [{x, y, w, h, label}]}
  
  Owner Flutter:
    → Draw annotation rectangles on Canvas overlay
    → Owner sees "⚠️ Condenser dirty" etc.

Step 4: Outcome
  Tech decides: fixable_remotely = true/false
  
  If TRUE:
    → Guide owner through fix live
    → Mark consultation COMPLETED_REMOTELY
    → Charge ₹99/199/299
  
  If FALSE:
    → Book physical job automatically
    → Consultation fee deducted from job charge
    → Same tech pre-assigned to physical visit

Step 5: Recording (if consented)
  → Agora Cloud Recording API
  → Stored in Cloudinary
  → URL added to virtual_consultations record
  → Available in owner's job history
```

---

## 25. Notification Flow

```
Trigger → RabbitMQ → Consumer → Channel → User

Example: "Technician Accepted Job"

1. JobService.acceptJob() completes
2. Publishes to uptime.notifications exchange:
   {
     recipientId: ownerId,
     recipientType: "OWNER",
     type: "JOB_ACCEPTED",
     jobId: 12345,
     variables: {
       techName: "Raju Kumar",
       eta: "15 minutes"
     }
   }

3. NotificationConsumer receives message:
   a. Load user's preferred language from DB
   b. Load template: JOB_ACCEPTED_{LANG} from DB
   c. Replace {{techName}}, {{eta}} variables
   d. Check user's notification_preferences
   e. Check DND hours

4. Channel routing (based on preferences):
   PUSH → FCMService.send():
     → Get FCM tokens from user_devices
     → POST to Firebase FCM API
     → Log to push_delivery_logs
   
   SMS → SMSService.send():
     → POST to Twilio REST API
     → Log delivery status
   
   EMAIL → EmailService.send():
     → POST to SendGrid API with template
     → Track open/click via SendGrid webhooks

5. Save to notifications table:
   → Persisted even if push fails
   → Owner sees in notification bell
   → Mark read when opened

6. Update notification_analytics:
   → Increment sent_count
   → Track delivery rates per type
```

---

## 26. Data Flow Diagrams

### 26.1 Owner Creates Job

```
[Owner App] 
    │ POST /api/v1/jobs + media files
    ▼
[Spring Boot — JobController]
    │ validates request
    ▼
[Cloudinary] ◄── media upload (async)
    │ returns CDN URLs
    ▼
[Spring Boot — JobService]
    │ creates job record
    ▼
[Supabase PostgreSQL]
    │ job saved (status=POSTED)
    ▼
[RabbitMQ — ai.diagnosis.queue]
    │ AI task queued
    ▼
[Spring Boot — GeminiService]
    │ calls Gemini API
    ▼
[Google Gemini 1.5 Flash]
    │ returns diagnosis JSON
    ▼
[Supabase] ← stores ai_fault_diagnoses
    │
    ▼
[WebSocket → Owner App]
    "AI diagnosis ready"
    │
    ▼
[Owner App shows result]
```

### 26.2 Technician Matches and Accepts

```
[MatchingService]
    │ PostGIS query: find techs within 20km
    ▼
[Supabase — technician_locations]
    │ returns candidates with distances
    ▼
[ScoringEngine]
    │ calculates scores per candidate
    ▼
[Supabase — matching_scores]
    │ stores scores, ranks
    ▼
[Owner App] ← receives ranked list
    │ owner selects technician
    ▼
[Spring Boot — DispatchService]
    │ sends notification to selected tech
    ▼
[RabbitMQ — push.queue]
    │
    ▼
[Firebase FCM]
    │ push to tech device
    ▼
[Technician App]
    │ JobRequestScreen with 60s timer
    │ tech taps ACCEPT
    ▼
[Spring Boot — JobService]
    │ updates job status → EN_ROUTE
    │ updates matching_scores response → ACCEPTED
    │ starts WebSocket tracking session
    ▼
[Owner App + Admin Map]
    "Technician on the way!"
```

---

## 27. Database Architecture

### 27.1 Schema Organisation

```
14 modules, each owns its tables:

auth_module:
  users, user_sessions, user_devices,
  otp_verifications, refresh_tokens,
  user_addresses, user_preferences, referrals

technician_module:
  technicians, technician_skills,
  technician_documents, technician_verification,
  technician_locations, technician_availability,
  technician_service_areas, technician_statistics,
  technician_badges, technician_bank_accounts

job_module:
  jobs, job_media, job_status_history,
  job_checklist, job_checklist_items,
  job_parts_used, job_timeline,
  job_cancellations, job_disputes,
  job_auction, job_auction_bids,
  job_otp_verifications

...and so on for all 14 modules
```

### 27.2 Critical Relationships

```
users (1) ─────────── (M) jobs [owner]
technicians (1) ────── (M) jobs [assigned tech]
jobs (1) ──────────── (1) ai_fault_diagnoses
jobs (1) ──────────── (M) job_media
jobs (1) ──────────── (1) matching_requests
matching_requests (1)─ (M) matching_scores
jobs (1) ──────────── (1) transactions
jobs (1) ──────────── (1) job_ratings
users (1) ─────────── (M) machines/vehicles/devices
machines (1) ─────── (1) digital_twins
vehicles (1) ─────── (1) digital_twins
devices (1) ──────── (1) digital_twins
```

### 27.3 Partitioned Tables

```
live_location_tracking:
  PARTITION BY RANGE (EXTRACT(MONTH FROM recorded_at))
  → 12 partitions (one per month)
  → Old months archived/dropped after 30 days

api_logs:
  PARTITION BY RANGE (EXTRACT(YEAR FROM created_at))
  → Annual partitions
  → Kept 2 years, then archived

iot_sensor_readings:
  PARTITION BY RANGE (EXTRACT(MONTH FROM recorded_at))
  → Monthly partitions
  → Kept 6 months

user_activity_logs:
  PARTITION BY RANGE (EXTRACT(YEAR FROM created_at))
  → Annual partitions
```

### 27.4 Database Triggers

```sql
-- Trigger 1: Auto-update technician stats after job complete
CREATE OR REPLACE FUNCTION update_tech_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE technician_statistics
  SET
    total_jobs = total_jobs + 1,
    total_earnings = total_earnings + NEW.final_cost * 0.9,
    last_job_at = NEW.completed_at
  WHERE technician_id = NEW.technician_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_job_complete
  AFTER UPDATE ON jobs
  FOR EACH ROW
  WHEN (NEW.status = 'COMPLETED' AND OLD.status != 'COMPLETED')
  EXECUTE FUNCTION update_tech_stats();

-- Trigger 2: Auto-update rating average
CREATE OR REPLACE FUNCTION update_rating_avg()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE technicians
  SET rating_avg = (
    SELECT AVG(technician_rating)
    FROM job_ratings
    WHERE technician_id = NEW.technician_id
      AND technician_rating IS NOT NULL
  )
  WHERE id = NEW.technician_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_rating_insert
  AFTER INSERT ON job_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_rating_avg();

-- Trigger 3: Immutable audit logs
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_immutable
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION prevent_audit_modification();
```

### 27.5 Database Views

```sql
-- View 1: Active jobs with all details
CREATE VIEW v_active_jobs AS
SELECT
  j.id, j.job_number, j.status, j.industry,
  j.owner_location, j.created_at,
  u.full_name AS owner_name,
  t.full_name AS tech_name,
  tl.current_location AS tech_location,
  ms.total_score AS match_score,
  ms.eta_mins
FROM jobs j
JOIN users u ON j.owner_id = u.id
LEFT JOIN technicians t ON j.technician_id = t.id
LEFT JOIN technician_locations tl ON t.id = tl.technician_id
LEFT JOIN matching_scores ms ON j.id = ms.job_id
  AND ms.technician_id = j.technician_id
WHERE j.status NOT IN ('COMPLETED','CANCELLED')
  AND j.deleted_at IS NULL;

-- View 2: Technician dashboard summary
CREATE VIEW v_technician_dashboard AS
SELECT
  t.id, t.full_name, t.rating_avg,
  ts.total_jobs, ts.total_earnings,
  ts.jobs_this_month, ts.earnings_this_month,
  COUNT(DISTINCT tb.id) AS badges_earned,
  t.wallet_balance
FROM technicians t
JOIN technician_statistics ts ON t.id = ts.technician_id
LEFT JOIN technician_badges tb ON t.id = tb.technician_id
WHERE t.deleted_at IS NULL
GROUP BY t.id, t.full_name, t.rating_avg,
  ts.total_jobs, ts.total_earnings,
  ts.jobs_this_month, ts.earnings_this_month,
  t.wallet_balance;

-- View 3: Platform summary (admin dashboard)
CREATE VIEW v_platform_summary AS
SELECT
  COUNT(*) FILTER (WHERE status NOT IN ('COMPLETED','CANCELLED'))
    AS active_jobs,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours')
    AS jobs_today,
  (SELECT COUNT(*) FROM technicians WHERE is_available = TRUE)
    AS online_techs,
  (SELECT COUNT(*) FROM technicians WHERE verification_status = 'PENDING')
    AS pending_verifications,
  (SELECT COUNT(*) FROM job_disputes WHERE status = 'OPEN')
    AS open_disputes
FROM jobs
WHERE deleted_at IS NULL;
```

---

## 28. Caching Architecture

```
Cache-aside pattern (Spring Boot reads cache first):

Read flow:
  1. Check Redis (cache hit → return immediately)
  2. Cache miss → query Supabase
  3. Store result in Redis with TTL
  4. Return result

Write flow:
  1. Write to Supabase (source of truth)
  2. Invalidate related cache keys
  3. Next read will repopulate cache

Spring Boot annotations:
  @Cacheable("user_profile") → cache on first read
  @CachePut("user_profile")  → update cache on write
  @CacheEvict("user_profile")→ delete cache on delete

Cache key design:
  user:{userId}:profile         → single user profile
  nearby_techs:{lat4}:{lng4}    → rounded to 4 decimal places
                                   (groups nearby locations)
  ai_diag:{inputHash}           → hash of all AI inputs
                                   (same input = same diagnosis)
  wiki:{slug}                   → wiki article by URL slug
  surge:{city}:{industry}       → surge pricing per city/industry

Cache warming:
  → On app startup, pre-warm subscription_plans
  → On tech coming online, pre-warm their profile
  → On job matching, pre-warm nearby tech profiles
```

---

## 29. Queue Architecture

```
Message format (all queues):
{
  "messageId": "uuid",
  "timestamp": "ISO8601",
  "type": "PUSH_NOTIFICATION | SMS | EMAIL | AI_TASK",
  "priority": "HIGH | NORMAL | LOW",
  "payload": { ... type-specific data ... },
  "retryCount": 0,
  "maxRetries": 3
}

Retry logic:
  Attempt 1: immediately
  Attempt 2: after 5 seconds
  Attempt 3: after 30 seconds
  All fail → dead.letter.queue
  Admin alerted about DLQ messages

Dead Letter Queue handling:
  Admin sees DLQ count in admin dashboard
  Can manually replay messages
  Can dismiss after investigation
  Auto-alerts if DLQ > 100 messages

Queue priority:
  HIGH:   OTP SMS (must deliver fast)
          Job acceptance notification
          SOS emergency notifications
  
  NORMAL: Job status updates
          Payment confirmations
          Badge earned

  LOW:    Prediction notifications
          Weekly reports
          Marketing emails

Message deduplication:
  → messageId is UUID v4
  → Consumers check if messageId processed
  → Processed IDs stored in Redis 1 hour
  → Prevents duplicate processing on retry
```

---

## 30. Offline Architecture

### 30.1 Owner Flutter App

```
Hive boxes (local storage):
  userBox:       User profile + preferences
  jobsBox:       Last 20 job records
  assetsBox:     Machines, vehicles, devices list
  draftBox:      Unsent fault reports

Offline capabilities:
  ✅ View dashboard (cached data)
  ✅ View job history (cached)
  ✅ Draft fault report (saved to draftBox)
  ✅ View asset details (cached)
  ✅ View technician profile (cached)
  ❌ Book new job (requires network)
  ❌ Real-time tracking (requires network)
  ❌ Payment (requires network)

Offline indicator:
  ConnectivityPlus monitors network
  Shows orange banner: "You're offline"
  Hides actions requiring network

Sync on reconnect:
  SyncService:
    1. Upload drafted fault reports
    2. Refresh job statuses
    3. Pull new notifications
    4. Update asset data
```

### 30.2 Technician Flutter App (CRITICAL)

```
Hive boxes:
  authBox:       JWT + refresh token
  activeJobBox:  Current job full data
  checklistBox:  Completed checklist steps
  partsBox:      Logged parts (pending upload)
  photosBox:     Captured photos (pending upload)

Offline capabilities during active job:
  ✅ Complete checklist steps
  ✅ Log parts used
  ✅ Capture before/after photos
  ✅ Read AI copilot steps (cached at job start)
  ✅ GPS still works (foreground service)
  ❌ WebSocket location sharing (queued)
  ❌ OTP verification (requires network)

Photo handling offline:
  → Photos saved to device storage
  → Path stored in Hive
  → Upload queue created
  → On reconnect: batch upload to Cloudinary
  → Job cannot be completed until all photos synced

GPS offline:
  → Foreground service continues GPS
  → Locations stored locally in queue
  → Batch-sent to WebSocket on reconnect
  → Owner sees "Location temporarily unavailable"
```

---

## 31. Scalability Architecture

```
Current: Monolith on Railway free tier
  → Handles: ~100 concurrent users
  → DB: 500MB Supabase free
  → Good for: PBL demo, early launch

Growth path (post-PBL):

Phase 1 (0-1000 users): Same architecture
  → Upgrade to Railway $5/month
  → Upgrade to Supabase Pro $25/month
  → Add Cloudflare caching rules
  → Cost: ~₹5,000/month

Phase 2 (1000-10000 users):
  → Railway Pro (more CPU/RAM)
  → Database connection pooling (PgBouncer)
  → Add Redis cluster (multi-node)
  → Separate AI service (prevent blocking)
  → Cost: ~₹15,000/month

Phase 3 (10000+ users, post-graduation):
  → Extract AI module to separate service
  → Extract matching to separate service
  → Kubernetes for container orchestration
  → Multiple Railway regions
  → Supabase Enterprise
  → Cost: ~₹50,000+/month
  → Revenue at this scale: ₹5,00,000+/month

Horizontal scalability considerations (built-in):
  → No in-memory session state (all in Redis)
  → Stateless Spring Boot (any instance handles any request)
  → WebSocket sticky sessions (same instance per connection)
  → DB connection pool shared via PgBouncer (future)
```

---

## 32. Disaster Recovery Architecture

```
Backup strategy:
  Supabase daily backups: 7 days retention (free)
  Supabase Pro:           30 days + PITR (point-in-time)
  Manual dumps:           Weekly to Cloudinary (critical tables)
  
  Critical tables backed up weekly:
    jobs, transactions, invoices, audit_logs

RTO (Recovery Time Objective): < 2 hours
RPO (Recovery Point Objective): < 24 hours

Recovery procedure:
  1. Create new Supabase project
  2. Restore from latest backup:
     supabase db restore --backup-id {id}
  3. Update Railway env: SUPABASE_URL=new_url
  4. Restart Spring Boot (Railway deploy)
  5. Verify with health check
  6. Run smoke tests (Postman collection)
  7. Monitor Sentry for errors

Failure scenarios and responses:
┌─────────────────────────┬──────────────────────────────────────┐
│ Failure                 │ Response                             │
├─────────────────────────┼──────────────────────────────────────┤
│ Supabase down           │ Retry 3x, then 503 with message      │
│ Redis down              │ Disable caching, DB queries direct   │
│ RabbitMQ down           │ Synchronous fallback for critical ops│
│ Gemini API down         │ Manual fault entry, degraded mode    │
│ Google Maps down        │ Haversine distance, text tracking    │
│ Razorpay down           │ Queue payment, retry when restored   │
│ FCM down                │ SMS fallback via Twilio              │
│ Cloudinary down         │ Local storage, upload retry queue    │
│ Railway restart         │ Auto-restart, 15s downtime max       │
└─────────────────────────┴──────────────────────────────────────┘
```

---

## 33. Network Architecture

```
Request journey (production):

[User Device]
    │ HTTPS request
    ▼
[Cloudflare DNS]
    │ Resolves api.uptime.in
    ▼
[Cloudflare Edge (nearest PoP)]
    │ DDoS check
    │ Bot check
    │ SSL termination (TLS 1.3)
    │ Cache check (static assets)
    │ If dynamic: forward to origin
    ▼
[Railway Load Balancer]
    │ Routes to Spring Boot container
    ▼
[Spring Boot Container]
    │ Filter chain (auth, rate limit, CORS)
    │ Controller → Service → Repository
    ▼
[Supabase PostgreSQL]
    │ Response
    ▼
[Spring Boot → Railway → Cloudflare → User]

Network security:
  → All traffic HTTPS (enforced by Cloudflare)
  → HSTS header (browser enforces HTTPS)
  → TLS 1.3 only (older versions disabled)
  → Certificate auto-renewed (Cloudflare)

Ports:
  8080 → Spring Boot (internal, not exposed directly)
  5432 → Supabase PostgreSQL (internal, Supabase manages)
  6379 → Upstash Redis (TLS, not raw port)
  5672 → RabbitMQ AMQP (internal Docker network)
  443  → HTTPS (Cloudflare/Vercel/Railway)
```

---

## 34. Inter-Service Communication

```
Within Spring Boot modules:
  → Direct Java method calls (same JVM)
  → @Autowired dependencies
  → No HTTP between internal modules
  → Shared Supabase database

Between Spring Boot and external services:
  
  Gemini API:
    Protocol: REST over HTTPS
    Library:  RestTemplate / WebClient (Spring)
    Timeout:  30 seconds
    Retry:    3 times with backoff
  
  Google Maps:
    Protocol: REST over HTTPS
    Library:  OkHttp (lightweight)
    Timeout:  5 seconds
    Cache:    ETA results 1 minute in Redis
  
  Razorpay:
    Protocol: REST over HTTPS
    Library:  Razorpay Java SDK
    Webhook:  Inbound HTTPS POST
    Security: HMAC-SHA256 signature verification
  
  Firebase FCM:
    Protocol: REST over HTTPS
    Library:  firebase-admin Java SDK
    Async:    Sent via RabbitMQ (non-blocking)
  
  Twilio:
    Protocol: REST over HTTPS
    Library:  twilio-java SDK
    Async:    Sent via RabbitMQ (non-blocking)
  
  SendGrid:
    Protocol: REST over HTTPS
    Library:  sendgrid-java SDK
    Async:    Sent via RabbitMQ (non-blocking)
  
  Cloudinary:
    Protocol: REST over HTTPS (upload)
    Library:  cloudinary-java SDK
    Async:    Upload happens in @Async thread

Client to Backend:
  REST:      React/Flutter → Spring Boot (HTTPS)
  WebSocket: React/Flutter → Spring Boot (WSS)
  Auth:      Supabase Auth → Spring Boot (JWT verification)
```

---

## 35. Error Handling Architecture

```
Error handling at each layer:

Layer 1: Network errors (Flutter/React)
  Flutter:
    try {
      response = await dio.post('/jobs', data: data);
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout)
        → show "No internet" banner
      if (e.response?.statusCode == 401)
        → refresh JWT, retry once
      if (e.response?.statusCode == 429)
        → show "Too many requests, wait 1 minute"
      if (e.response?.statusCode == 503)
        → show "Service temporarily unavailable"
    }
  
  React:
    React Query handles retries automatically:
    queryClient config:
      retry: 2 (retry failed requests twice)
      retryDelay: attemptIndex => min(1000 * 2^attemptIndex, 10000)
    
    Error boundary:
      <ErrorBoundary fallback={<ErrorPage/>}>
        catches all unhandled React errors

Layer 2: API Gateway errors (Spring Boot filters)
  → 401 Unauthorized (invalid/expired JWT)
  → 403 Forbidden (wrong role)
  → 429 Too Many Requests (rate limit)
  → 400 Bad Request (validation failure)
  All return standard error format:
  {
    "success": false,
    "error": {
      "code": "AUTH_005",
      "message": "Token expired",
      "details": null
    }
  }

Layer 3: Business logic errors (Spring Services)
  Custom exceptions:
    ResourceNotFoundException  → 404
    BusinessRuleException      → 422 Unprocessable
    PaymentException           → 402 Payment Required
    AIServiceException         → 503 (degraded mode)
  
  GlobalExceptionHandler catches all:
  @ExceptionHandler(Exception.class)
    → Logs to error_logs (async via RabbitMQ)
    → Returns standard error response
    → Never exposes stack traces
    → Alerts Sentry for unexpected exceptions

Layer 4: Database errors
  → Connection pool exhaustion → 503 + alert
  → Constraint violation → 409 Conflict
  → Deadlock → retry 3 times, then 500
  → Flyway migration failure → app won't start, alert

Layer 5: External service errors
  Gemini fails → degraded AI mode (manual entry)
  Maps fails   → haversine fallback
  Razorpay fails → queue for retry
  FCM fails    → SMS fallback via Twilio
  Twilio fails → email fallback via SendGrid
  All logged to error_logs with severity level
```

---

## Appendix — Architecture Decision Records (ADRs)

### ADR-001: Monolith vs Microservices

```
Decision: Modular Monolith
Reason:   4-member student team, 3-month timeline
          Microservices add: API gateway, service discovery,
          distributed tracing, network latency, operational complexity
          All unnecessary overhead for PBL
Outcome:  Single JAR, clear module boundaries,
          extractable to microservices post-graduation
```

### ADR-002: Supabase vs MySQL

```
Decision: Supabase (PostgreSQL)
Reason:   MySQL on Railway needs separate setup
          Supabase includes: Auth + Storage + PostGIS + Dashboard
          Free tier better: 500MB vs 100MB Railway
          Web dashboard accessible to all 4 team members
          PostGIS required for spatial matching queries
Outcome:  ₹0 cost, faster development, better features
```

### ADR-003: Flutter vs React Native

```
Decision: Flutter
Reason:   Better performance (compiled, not interpreted)
          Better iOS support
          Riverpod > Redux Native (simpler)
          Dart is cleaner for team learning
          Better Google Maps, Agora, Razorpay SDKs
          VTU curriculum starting to include Flutter
Outcome:  Two separate Flutter apps (owner + tech)
```

### ADR-004: Gemini vs GPT-4

```
Decision: Google Gemini 1.5 Flash
Reason:   GPT-4: $5 per 1M tokens
          Gemini Flash: FREE 1M tokens/month
          Gemini supports audio + video natively
          (GPT-4 vision only, no audio/video)
          Required for sound analysis feature
Outcome:  All AI features at ₹0/month during PBL
```

### ADR-005: RabbitMQ vs Kafka

```
Decision: RabbitMQ
Reason:   Kafka requires: ZooKeeper, 3+ brokers, complex setup
          For our scale (< 1000 messages/day in PBL):
          RabbitMQ is simpler, well-documented, free
          Spring AMQP is easier than Spring Kafka
          Docker image small (< 200MB)
Outcome:  Simple async messaging, sufficient for scale
```

---

*UPTIME System Architecture — v1.0*  
*"Downtime ends here."*  
*DSATM Bengaluru — VTU — 2026-27*
