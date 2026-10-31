# UPTIME — Complete Implementation Guide

> **Version:** 1.0  
> **Project:** UPTIME — AI-Assisted On-Demand Technician Dispatch Platform  
> **Timeline:** 12 Weeks  
> **Team:** 4 Members  
> **Build Order:** Backend → Owner Web → Tech Web → Admin Web → Flutter Owner → Flutter Tech → Testing → PBL  
> **Institution:** DSATM Bengaluru — VTU — 2026-27  

---

## Table of Contents

1. [Build Order Overview](#1-build-order-overview)
2. [Phase 1 — Foundation (Week 1-2)](#2-phase-1--foundation-week-1-2)
3. [Phase 2 — Core Backend APIs (Week 3)](#3-phase-2--core-backend-apis-week-3)
4. [Phase 3 — AI + Matching + WebSocket (Week 4-5)](#4-phase-3--ai--matching--websocket-week-4-5)
5. [Phase 4 — Owner Web App (Week 6)](#5-phase-4--owner-web-app-week-6)
6. [Phase 5 — Tech Web + Admin Web (Week 7)](#6-phase-5--tech-web--admin-web-week-7)
7. [Phase 6 — Payments + Subscriptions (Week 8)](#7-phase-6--payments--subscriptions-week-8)
8. [Phase 7 — All 69 Features Web (Week 9)](#8-phase-7--all-69-features-web-week-9)
9. [Phase 8 — Flutter Owner App (Week 10)](#9-phase-8--flutter-owner-app-week-10)
10. [Phase 9 — Flutter Tech App + Testing (Week 11)](#10-phase-9--flutter-tech-app--testing-week-11)
11. [Phase 10 — PBL Submission (Week 12)](#11-phase-10--pbl-submission-week-12)
12. [Daily Workflow](#12-daily-workflow)
13. [Definition of Done](#13-definition-of-done)
14. [Dependency Map](#14-dependency-map)
15. [Risk & Mitigation](#15-risk--mitigation)

---

## 1. Build Order Overview

```
WHY this order:

Backend first:
  → All 4 members need APIs working
  → Cannot build any UI without APIs
  → Catch DB design issues early

Web before Mobile:
  → Web is faster to build + debug
  → Same API tested thoroughly before Flutter
  → Browser DevTools > Flutter debugger
  → PWA works on mobile browser anyway

Owner Web before Tech Web:
  → Owner flow is more complex (fault → AI → match)
  → Testing owner flow validates most APIs
  → Tech web is simpler (dashboard + earnings)

Both Flutter apps:
  → Owner app: booking, tracking, assets
  → Tech app: field-optimised, background GPS
  → Both needed for complete PBL demo

Testing last (but tests written throughout):
  → Unit tests written WITH the code
  → Integration tests in Week 11
  → Load + security tests in Week 11

RULE: Never start next phase until
      current phase passes manual testing.
```

---

## 2. Phase 1 — Foundation (Week 1-2)

**Goal:** Everything runs locally. Zero features, but full skeleton.

---

### Member 2 — Backend Foundation

#### Step 1: Supabase Setup
```
1. Go to supabase.com → New Project
   Name: uptime-platform
   Region: South Asia (Mumbai)
   Password: save securely

2. Enable PostGIS:
   In Supabase SQL Editor:
   CREATE EXTENSION IF NOT EXISTS postgis;
   CREATE EXTENSION IF NOT EXISTS pg_crypto;

3. Copy credentials:
   Project URL: https://xxxxx.supabase.co
   Anon Key:    eyJhbGci...
   Service Key: eyJhbGci...
   DB URL:      postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres

4. Add to .env file (never commit!)
```

#### Step 2: Spring Boot Project Init
```
1. Go to start.spring.io
   Group:    com.uptime
   Artifact: uptime-backend
   Java:     17
   Spring Boot: 3.2.x

   Dependencies:
   ✅ Spring Web
   ✅ Spring Data JPA
   ✅ Spring Security
   ✅ Spring WebSocket
   ✅ Spring AMQP (RabbitMQ)
   ✅ Spring Cache (Redis)
   ✅ Validation
   ✅ Lombok
   ✅ Flyway Migration
   ✅ PostgreSQL Driver
   ✅ H2 Database (test)
   ✅ Spring Boot Actuator

2. Add to pom.xml manually:
   <!-- MapStruct -->
   <dependency>
     <groupId>org.mapstruct</groupId>
     <artifactId>mapstruct</artifactId>
     <version>1.5.5.Final</version>
   </dependency>

   <!-- JWT -->
   <dependency>
     <groupId>io.jsonwebtoken</groupId>
     <artifactId>jjwt-api</artifactId>
     <version>0.12.3</version>
   </dependency>

   <!-- Springdoc OpenAPI (Swagger) -->
   <dependency>
     <groupId>org.springdoc</groupId>
     <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
     <version>2.3.0</version>
   </dependency>

   <!-- Upstash Redis -->
   <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-data-redis</artifactId>
   </dependency>

3. Create application.yml (see RULES.md)
4. Create application-test.yml (H2 config)
```

#### Step 3: Run First Migrations
```
Create these files in order:
src/main/resources/db/migration/

V1__create_users_and_auth.sql     ← users, addresses, sessions
V2__create_technicians.sql        ← technicians, skills, docs
V3__create_jobs_and_workflow.sql  ← jobs, checklist, parts

Run: mvn flyway:migrate
Verify: Tables appear in Supabase dashboard

✅ Done when: Spring Boot starts with no errors
              /actuator/health returns UP
```

#### Step 4: Common Layer
```
Create in order:

1. common/response/ApiResponse.java
2. common/response/PagedResponse.java
3. common/exceptions/ResourceNotFoundException.java
4. common/exceptions/BusinessRuleException.java
5. common/exceptions/GlobalExceptionHandler.java
6. common/constants/ErrorCodes.java
7. common/constants/AppConstants.java
8. common/utils/HashUtils.java
9. common/utils/OTPUtils.java
10. security/JwtTokenProvider.java
11. security/JwtAuthFilter.java
12. security/RateLimitFilter.java
13. config/SecurityConfig.java
14. config/SwaggerConfig.java
15. config/RedisConfig.java
16. config/RabbitMQConfig.java
17. config/CorsConfig.java

Test: GET /api/v1/health → 200 OK ✅
Test: GET /api/v1/jobs (no token) → 401 ✅
```

---

### Member 1 — GitHub + React Setup

#### Step 1: GitHub Organisation
```
1. github.com → Your profile → Organizations → New
   Name: uptime-platform
   Plan: Free

2. Create 8 repositories:
   uptime-backend
   uptime-owner-web
   uptime-owner-app
   uptime-tech-web
   uptime-technician-app
   uptime-admin-web
   uptime-shared
   uptime-docs

   Settings for each:
   → Private
   → Add README
   → Add .gitignore (Java / Node / Dart)

3. Invite team members:
   Settings → Members → Invite
   Add Member 2, 3, 4

4. Add GitHub Secrets:
   Each repo → Settings → Secrets → Actions
   Add all keys from SECURITY.md Section 21

5. Set branch protection:
   main + develop branches
   Exact settings from RULES.md GIT-03
```

#### Step 2: React Projects Init
```
# Create all 3 React apps
npm create vite@latest uptime-owner-web -- --template react-ts
npm create vite@latest uptime-tech-web  -- --template react-ts
npm create vite@latest uptime-admin-web -- --template react-ts

# For each app, install dependencies:
cd uptime-owner-web
npm install \
  @tanstack/react-query \
  @reduxjs/toolkit react-redux \
  react-router-dom \
  axios \
  react-hook-form zod @hookform/resolvers \
  react-i18next i18next \
  react-hot-toast \
  lucide-react \
  framer-motion \
  date-fns \
  @stomp/stompjs \
  @react-google-maps/api

# Tailwind + shadcn
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn-ui@latest init

# Copy tailwind.config.ts from DESIGN.md Section 24
# Copy CSS tokens from DESIGN.md Section 3
# Create src/lib/axios.ts (configured instance)
# Create src/store/index.ts (Redux store)

✅ Done when: npm run dev works on localhost:3000
```

#### Step 3: Design System Setup
```
For each React app, create:

src/styles/
  globals.css     ← Tailwind directives
  tokens.css      ← All CSS custom properties

src/components/ui/
  button.tsx      ← from CODING_STANDARDS.md
  card.tsx
  badge.tsx
  input.tsx
  skeleton.tsx

src/components/common/
  LoadingSkeleton.tsx
  EmptyState.tsx
  ErrorState.tsx
  OfflineBanner.tsx

src/components/layout/
  Navbar.tsx
  Sidebar.tsx
  BottomNav.tsx

✅ Done when: Design system renders correctly
              All color tokens working
              Dark mode toggle works
```

---

### Member 3 — Flutter Setup

#### Step 1: Flutter Projects Init
```
# Create both Flutter apps
flutter create --org com.uptime uptime_owner_app
flutter create --org com.uptime uptime_technician_app

# For each app, update pubspec.yaml
# (Full list in STRUCTURE.md Section 5)
# Key packages:
  flutter_riverpod: ^2.4.0
  go_router: ^13.0.0
  dio: ^5.4.0
  hive_flutter: ^1.1.0
  flutter_secure_storage: ^9.0.0
  google_maps_flutter: ^2.5.0
  geolocator: ^10.1.0
  cached_network_image: ^3.3.0
  firebase_messaging: ^14.7.0
  speech_to_text: ^6.6.0

flutter pub get

# Setup Firebase
# Add google-services.json (Android)
# Add GoogleService-Info.plist (iOS)

✅ Done when: flutter run works on emulator
              No dependency conflicts
```

#### Step 2: Flutter Core Setup
```
Create in order:

lib/core/config/
  app_config.dart     ← flavor-based URLs
  theme.dart          ← full ThemeData from DESIGN.md
  router.dart         ← go_router all routes

lib/core/network/
  dio_client.dart     ← configured Dio instance
  auth_interceptor.dart

lib/core/storage/
  hive_service.dart
  secure_storage.dart

lib/shared/widgets/
  uptime_button.dart
  loading_shimmer.dart
  empty_state_widget.dart
  offline_banner.dart
  cached_image.dart

✅ Done when: App runs with correct theme
              Navigation between screens works
              Dio client connects to backend
```

---

### Member 4 — Documentation Setup

```
In uptime-docs repo, create folders:
  api/           ← API test results
  database/      ← Schema notes
  testing/       ← Test results
  reports/       ← Weekly status

Create Postman workspace:
  Workspace: UPTIME Development
  Collections: Auth, Jobs, AI, Payments
  Environment: UPTIME Local
    base_url: http://localhost:8080/api/v1

✅ Done when: Postman connected to backend health endpoint
              README files written for all repos
```

---

### Phase 1 Completion Checklist

```
□ Supabase project running + PostGIS enabled
□ V1-V3 migrations completed (tables visible)
□ Spring Boot starts: /actuator/health = UP
□ /api/v1/health returns 200
□ Unauthenticated request returns 401
□ All React apps run on localhost
□ Design tokens working (correct colors)
□ Both Flutter apps run on emulator
□ Docker Compose starts all services
□ GitHub repos created + secrets added
□ All 4 members can clone + run locally
□ Postman connected to health endpoint
```

---

## 3. Phase 2 — Core Backend APIs (Week 3)

**Goal:** All core APIs working. Postman collection passes.

---

### Member 2 — Auth + User + Technician APIs

#### Build Order (strict — each depends on previous)

```
Day 1: Auth Module
  1. modules/auth/AuthController.java
  2. modules/auth/AuthService.java (interface)
  3. modules/auth/AuthServiceImpl.java
  4. modules/auth/OTPService.java
  5. modules/auth/dto/ (all request + response DTOs)

  Test in Postman:
  ✅ POST /auth/send-otp
  ✅ POST /auth/verify-otp → get JWT
  ✅ POST /auth/signup
  ✅ POST /auth/refresh-token
  ✅ POST /auth/logout
  ✅ GET  /auth/me

Day 2: User Module
  1. modules/user/User.java (entity)
  2. modules/user/UserRepository.java
  3. modules/user/UserService.java
  4. modules/user/UserServiceImpl.java
  5. modules/user/UserController.java
  6. modules/user/UserMapper.java
  7. modules/user/dto/

  Test in Postman:
  ✅ GET  /users/me
  ✅ PUT  /users/me
  ✅ POST /users/me/addresses
  ✅ PUT  /users/me/preferences

Day 3-4: Technician Module
  1. Technician.java + all related entities
  2. TechnicianRepository.java
  3. TechnicianService + Impl
  4. TechnicianController.java
  5. SkillService.java
  6. VerificationService.java

  Test in Postman:
  ✅ GET  /technicians/me
  ✅ PUT  /technicians/me
  ✅ PUT  /technicians/me/availability
  ✅ POST /technicians/me/skills
  ✅ POST /technicians/me/documents
  ✅ POST /technicians/me/bank-account

Day 5: Remaining migrations
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
```

### Member 1 — Job Module + PostGIS

```
Day 1-2: Job Module
  1. Job.java (entity — 35 columns, see DATABASE.md)
  2. JobRepository.java (spatial queries)
  3. JobService.java + JobServiceImpl.java
  4. JobController.java
  5. All job DTOs

  Test in Postman:
  ✅ POST /jobs (create)
  ✅ GET  /jobs (list)
  ✅ GET  /jobs/{id}
  ✅ PUT  /jobs/{id}/status
  ✅ POST /jobs/{id}/cancel

Day 3: PostGIS Spatial Queries
  1. Write spatial query in JobRepository
  2. Test: find techs within 10km
  3. Test: calculate distance between points
  4. Verify GIST indexes working

Day 4-5: Write all unit tests
  ScoringEngineTest.java    ← critical
  HashUtilsTest.java        ← critical
  OTPServiceTest.java       ← critical
  GSTServiceTest.java

  Run: mvn test
  Target: all tests pass ✅
```

### Phase 2 Completion Checklist

```
□ POST /auth/send-otp → OTP sent via Twilio
□ POST /auth/verify-otp → JWT returned
□ JWT works on protected endpoints
□ GET /users/me → returns user data
□ POST /technicians/me/availability → toggles online
□ POST /jobs → creates job
□ GET /jobs/{id} → returns full job
□ All V1-V16 migrations complete
□ PostGIS spatial query returns nearby techs
□ All unit tests passing (mvn test)
□ Swagger UI shows all endpoints
□ Postman collection: Auth + Users + Jobs pass
```

---

## 4. Phase 3 — AI + Matching + WebSocket (Week 4-5)

**Goal:** AI diagnoses faults. Tech gets notified. Owner tracks tech live.

---

### Member 1 — AI + WebSocket (Days 1-5)

```
Day 1: Gemini Integration
  1. config/GeminiConfig.java
  2. modules/ai/GeminiService.java
  3. modules/ai/GeminiServiceImpl.java
     → buildPrompt() method
     → callGeminiAPI() method
     → parseResponse() method
     → handleFailure() → fallback

  Load prompts from:
  src/main/resources/prompts/fault_triage_v1.txt
  (content from SECURITY.md AI rules)

  Test: POST /ai/diagnose with text input
  ✅ Returns diagnosis JSON
  ✅ Returns fallback if Gemini fails

Day 2: Full AI Module
  1. FaultTriageService.java
  2. SoundAnalysisService.java
  3. ImageAnalysisService.java
  4. RepairCopilotService.java
  5. NegotiationService.java
  6. AIController.java
  7. All AI DTOs

  Test in Postman:
  ✅ POST /ai/diagnose (text + photo)
  ✅ POST /ai/sound-analysis (audio file)
  ✅ GET  /ai/copilot/{jobId}
  ✅ POST /ai/copilot/{jobId}/next
  ✅ POST /ai/negotiate

Day 3: Matching Algorithm
  1. ScoringEngine.java
     → calculateDistanceScore()
     → calculateSkillScore()
     → calculateTotalScore()
     → applyModifiers()
  2. MatchingService.java + Impl
  3. DispatchService.java
  4. SurgePricingService.java
  5. MatchingController.java

  Test:
  ✅ POST /matching/request → ranked list
  ✅ GET  /matching/{jobId}/results
  ✅ POST /matching/{jobId}/select
  ✅ POST /matching/{jobId}/respond (ACCEPT)

Day 4: WebSocket Server
  1. config/WebSocketConfig.java (STOMP)
  2. modules/tracking/WebSocketHandler.java
  3. modules/tracking/LocationBroadcastService.java
  4. modules/tracking/ETAService.java
     → Google Maps Distance Matrix API
  5. modules/tracking/TrackingController.java

  Test:
  ✅ WebSocket connects with JWT
  ✅ Location update broadcasts to subscriber
  ✅ ETA calculated correctly

Day 5: RabbitMQ + Push Notifications
  1. RabbitMQ consumers:
     FCMConsumer.java
     SMSConsumer.java
     EmailConsumer.java
  2. modules/notification/FCMService.java
  3. modules/notification/SMSService.java (Twilio)
  4. modules/notification/EmailService.java (SendGrid)
  5. modules/notification/NotificationController.java

  Test:
  ✅ Push notification received on test device
  ✅ SMS OTP received on phone
  ✅ Email sent via SendGrid
```

### Member 2 — Async + Background Jobs (Days 1-5)

```
Day 1-2: RabbitMQ Setup
  1. All exchanges + queues in RabbitMQConfig.java
  2. Message publishers in all services
  3. Dead letter queue handling

Day 3-4: 7 Schedulers
  scheduler/RepairPredictionScheduler.java
  scheduler/EpidemicDetectionScheduler.java
  scheduler/ReminderScheduler.java
  scheduler/PayoutScheduler.java
  scheduler/RatingRecalculationScheduler.java
  scheduler/WarrantyExpiryScheduler.java
  scheduler/PlatformHealthScheduler.java

  Each scheduler:
  @Scheduled(cron = "...")
  @Transactional
  public void run() { ... }

Day 5: Industry Modules (basic CRUD)
  modules/industry/industrial/MachineService.java
  modules/industry/automobile/VehicleService.java
  modules/industry/electronics/DeviceService.java
  All controllers + DTOs

  Test in Postman:
  ✅ POST /industry/machines
  ✅ GET  /industry/vehicles
  ✅ POST /industry/devices
```

### Phase 3 Completion Checklist

```
□ POST /ai/diagnose → AI diagnosis in < 5 seconds
□ AI failure → fallback returned (not crash)
□ POST /matching/request → ranked tech list
□ Score calculation matches expected values
□ POST /matching/{id}/respond ACCEPT → tech assigned
□ WebSocket connects + location broadcasts
□ ETA calculation working (Google Maps)
□ FCM push notification received on device
□ Twilio OTP SMS received on phone
□ All 7 schedulers registered (check startup logs)
□ CRUD for machines + vehicles + devices
□ RabbitMQ queues visible in management UI
```

---

## 5. Phase 4 — Owner Web App (Week 6)

**Goal:** Owner can report fault → get AI → book tech → track → pay (on web browser).

---

### Member 1 — Owner Web (All Screens)

#### Build Order

```
Day 1: Auth Screens + Layout
  pages/LandingPage.tsx       ← marketing + CTA
  pages/LoginPage.tsx         ← phone input
  pages/OTPPage.tsx           ← 6-digit entry
  pages/SignupPage.tsx        ← name + industry
  pages/OnboardingPage.tsx    ← first asset setup
  components/layout/Navbar.tsx
  components/layout/Sidebar.tsx
  components/layout/BottomNav.tsx
  lib/axios.ts                ← JWT interceptor
  store/authSlice.ts
  hooks/useAuth.ts

  Test manually:
  ✅ Login with phone → OTP → dashboard

Day 2: Dashboard + Assets
  pages/DashboardPage.tsx
  components/dashboard/QuickActionsGrid.tsx
  components/dashboard/ActiveJobBanner.tsx
  components/dashboard/AssetHealthRow.tsx
  components/dashboard/PredictionAlertCard.tsx
  pages/AssetsPage.tsx
  pages/AddAssetPage.tsx (machine/vehicle/device)
  pages/AssetDetailsPage.tsx

  Test manually:
  ✅ Dashboard loads after login
  ✅ Add machine → appears in asset list

Day 3: Fault Report + AI Diagnosis
  pages/ReportFaultPage.tsx
  components/fault/FaultReportForm.tsx
  components/fault/VoiceInputButton.tsx  ← Web Speech API
  components/fault/MediaUploadGrid.tsx
  components/fault/SoundRecorder.tsx
  pages/AIDiagnosisPage.tsx
  components/fault/AIDiagnosisCard.tsx
  components/fault/AIChatBot.tsx
  components/fault/CostEstimateCard.tsx

  Test manually:
  ✅ Voice input works in browser
  ✅ Upload photos (up to 10)
  ✅ Record sound → upload
  ✅ AI diagnosis appears < 5 seconds

Day 4: Technician Selection + Booking
  pages/SelectTechnicianPage.tsx
  components/technician/TechnicianCard.tsx
  components/technician/TechnicianList.tsx
  components/technician/TechnicianProfile.tsx
  components/technician/MatchScoreBadge.tsx
  pages/BookingConfirmPage.tsx

  Test manually:
  ✅ Ranked list loads after fault analysis
  ✅ Profile modal opens on tech card
  ✅ Book Now → technician notified

Day 5: Live Tracking + Job History
  pages/JobTrackingPage.tsx
  components/tracking/LiveTrackingMap.tsx   ← Google Maps
  components/tracking/JobStatusStepper.tsx
  components/tracking/ETADisplay.tsx
  components/tracking/OTPShareCard.tsx
  pages/JobHistoryPage.tsx
  components/jobs/JobHistoryCard.tsx
  pages/JobDetailsPage.tsx
  pages/RateJobPage.tsx

  Test manually:
  ✅ Map shows tech moving in real-time
  ✅ OTP share card appears on tech arrival
  ✅ Job history list loads
  ✅ Rating screen submits correctly
```

### Member 3 — Supporting Components

```
Day 1-2: All shared components
  components/common/LoadingSkeleton.tsx
  components/common/EmptyState.tsx
  components/common/ErrorBoundary.tsx
  components/common/ConfirmDialog.tsx
  components/common/SuccessAnimation.tsx  ← Lottie
  components/common/OfflineBanner.tsx
  components/common/IndustrySelector.tsx
  components/common/LanguageSelector.tsx
  components/common/NotificationBell.tsx

Day 3-5: i18n + PWA
  Add all locales:
    src/locales/en.json
    src/locales/hi.json
    src/locales/kn.json
    (+ 6 more languages)
  Setup i18next
  Configure service worker (sw.js)
  Configure manifest.json
  Test: App installable on Android Chrome ✅
```

### Phase 4 Completion Checklist

```
□ Login → OTP → Dashboard works end-to-end
□ Add machine/vehicle/device works
□ Report fault with photo + voice
□ AI diagnosis returns result
□ Technician list shows ranked by score
□ Book technician → push received on tech phone
□ Live map shows tech moving
□ OTP share card shows on tech arrival
□ Job history loads and filters work
□ Rating submission works (both parties)
□ Invoice PDF downloadable
□ App installs on Android Chrome (PWA)
□ Hindi language switch works
□ Offline banner shows when no internet
□ All Lottie animations play correctly
```

---

## 6. Phase 5 — Tech Web + Admin Web (Week 7)

**Goal:** Tech dashboard complete. Admin can verify techs and see live jobs.

---

### Member 3 — Technician Web App

```
Day 1: Dashboard + Layout
  components/layout/TechSidebar.tsx
  components/layout/TechTopBar.tsx
  pages/TechDashboardPage.tsx
  components/tech/StatCard.tsx
  components/tech/ActiveJobBanner.tsx
  components/tech/UpcomingJobsList.tsx

Day 2: Earnings
  pages/EarningsPage.tsx
  components/earnings/EarningsChart.tsx   ← Recharts
  components/earnings/TransactionList.tsx ← TanStack Table
  components/earnings/WithdrawModal.tsx

Day 3: Badges + Profile
  pages/BadgesPage.tsx
  components/badges/BadgeCard.tsx
  components/badges/BadgeProgress.tsx
  pages/TechProfilePage.tsx
  pages/SkillsPage.tsx
  pages/DocumentsPage.tsx

Day 4: Availability + Service Area
  pages/AvailabilityPage.tsx
  components/availability/WeeklySchedule.tsx
  components/availability/ServiceAreaMap.tsx ← Google Maps

Day 5: Analytics + Wiki
  pages/TechAnalyticsPage.tsx
  components/analytics/PerformanceChart.tsx
  pages/WikiPage.tsx
  pages/WikiArticlePage.tsx

Test manually:
  ✅ Login as technician → dashboard loads
  ✅ Earnings chart shows data
  ✅ Badge collection displays
  ✅ Availability calendar works
  ✅ Wiki search returns results
```

### Member 1 — Admin Web App

```
Day 1: Dashboard + Auth
  pages/admin/AdminLoginPage.tsx  ← 2FA flow
  pages/admin/AdminDashboardPage.tsx
  components/admin/KPICards.tsx
  components/admin/PlatformHealthGauge.tsx
  components/admin/LiveJobsMap.tsx        ← React Leaflet
  components/admin/RecentAlertsFeed.tsx

Day 2: Verification Queue
  pages/admin/VerificationQueuePage.tsx
  components/admin/VerificationQueue.tsx  ← TanStack Table
  components/admin/DocumentViewer.tsx
  components/admin/VerificationActions.tsx

Day 3: Disputes + Epidemic
  pages/admin/DisputesPage.tsx
  components/admin/DisputeCard.tsx
  components/admin/ResolutionPanel.tsx
  pages/admin/EpidemicMonitorPage.tsx
  components/admin/EpidemicHeatmap.tsx   ← Chart.js

Day 4: Finance + Notifications
  pages/admin/FinancePage.tsx
  components/admin/RevenueChart.tsx
  pages/admin/NotificationsPage.tsx
  components/admin/MassNotificationComposer.tsx

Day 5: Settings
  pages/admin/AISettingsPage.tsx
  components/admin/AIPromptEditor.tsx
  components/admin/MatchingWeightsSlider.tsx
  components/admin/FeatureToggles.tsx

Test manually:
  ✅ Admin login with 2FA works
  ✅ Dashboard shows live stats
  ✅ Tech verification approve/reject works
  ✅ Mass notification sent
  ✅ Feature flag toggle works
```

### Phase 5 Completion Checklist

```
□ Tech web login → dashboard with earnings
□ Earnings chart shows monthly data
□ Badge progress bars correct
□ Admin login with 2FA
□ Verification queue shows pending techs
□ Approve technician → tech receives SMS
□ Live jobs map shows active jobs
□ Dispute resolution panel works
□ Mass notification sends to all owners
□ AI prompt editor saves new prompt version
□ Feature flag toggle works in real-time
```

---

## 7. Phase 6 — Payments + Subscriptions (Week 8)

**Goal:** Real payments (test mode). Invoice generated. Payouts processed.

---

### Member 2 — Complete Payment Module

```
Day 1-2: Razorpay Integration
  1. RazorpayService.java
     → createOrder()
     → verifyPayment()
     → initiateRefund()
     → initiatePayout()
  2. WebhookHandler.java
     → verifyHMACSignature()
     → handlePaymentCaptured()
     → handlePaymentFailed()
     → handleRefundProcessed()
     → idempotency check (Redis)

  Test:
  ✅ POST /payments/initiate → Razorpay order created
  ✅ Webhook received + verified
  ✅ Payment captured → wallet credited

Day 3: Invoice + GST
  1. InvoiceService.java
     → generatePDF() using iText
     → uploadToCloudinary()
     → storeHashValue()
  2. GSTService.java
     → calculate() intra/inter state
  3. TDSService.java

  Test:
  ✅ Invoice PDF generated with correct GST
  ✅ SHA-256 hash in invoice
  ✅ PDF downloadable

Day 4: Wallet + Payout
  1. WalletService.java
     → credit() after job complete
     → debit() on withdrawal
  2. PayoutScheduler (already created)
     → runs 11 AM daily
     → finds eligible balances
     → Razorpay payout API

  Test:
  ✅ Wallet balance updates after job
  ✅ Withdrawal processed correctly

Day 5: Subscription Plans
  1. SubscriptionService.java
  2. Plan limits enforced in JobService
  3. Grace period logic

  Test:
  ✅ GET /payments/subscriptions → 4 plans
  ✅ Free tier: 3rd job blocked after 2
  ✅ Upgrade plan → limit increases
```

### Member 3 — Payment UI

```
Day 1-2: Payment Screens (React)
  pages/PaymentPage.tsx        ← Razorpay checkout
  pages/WalletPage.tsx         ← balance + history
  pages/SubscriptionPage.tsx   ← plan selection
  components/payment/PaymentSummary.tsx
  components/payment/WalletCard.tsx
  components/payment/SubscriptionCard.tsx

Day 3-5: Insurance + Marketplace UI
  pages/InsurancePage.tsx
  pages/ClaimPage.tsx
  pages/WarrantyPage.tsx
  pages/MarketplacePage.tsx
  pages/ProductDetailsPage.tsx
  pages/CartPage.tsx
  components/insurance/PolicyCard.tsx
  components/insurance/ClaimForm.tsx
  components/marketplace/ProductCard.tsx
  components/marketplace/CartDrawer.tsx
```

### Phase 6 Completion Checklist

```
□ Payment initiate → Razorpay opens
□ UPI test payment completes (Razorpay test mode)
□ Webhook received + verified
□ Invoice PDF generated with correct amounts
□ CGST + SGST calculated correctly (intra-state)
□ Tech wallet credited after job complete
□ Withdrawal initiated → payout record created
□ Subscription plans displayed
□ Free tier: blocks job after limit
□ Insurance claim form submits
□ Marketplace product search works
□ Add to cart + checkout flow
```

---

## 8. Phase 7 — All 69 Features Web (Week 9)

**Goal:** Every single feature working on web platforms.

---

### Member 1 — Industrial Unique Features

```
Day 1: Sound Analysis UI
  components/fault/SoundRecorder.tsx
    → record audio in browser
    → visualise waveform (Canvas API)
    → upload + trigger analysis
    → show FFT results visually

Day 2: Digital Twin
  pages/DigitalTwinPage.tsx
  components/digital_twin/HealthGauge.tsx  ← SVG gauge
  components/digital_twin/ComponentGrid.tsx
  components/digital_twin/PredictionTimeline.tsx
  components/digital_twin/SavingsCalculator.tsx

Day 3: AI Negotiation + Auction
  components/jobs/NegotiationPanel.tsx
    → shows AI price suggestion
    → owner counter-offer input
    → AI fairness verdict display
  components/jobs/AuctionScreen.tsx
    → live bonus counter
    → competing techs count
    → countdown timer

Day 4-5: Tamper-proof + Wiki + Carbon Credits
  components/jobs/TamperProofBadge.tsx
  components/jobs/CertificateDownload.tsx
  pages/WikiPage.tsx (full implementation)
  components/wiki/WikiArticle.tsx
  components/wiki/WikiVoteButtons.tsx
  components/dashboard/CarbonCreditCard.tsx
```

### Member 3 — Automobile + Electronics Unique Features

```
Day 1: Vehicle Features
  pages/VehiclesPage.tsx (full implementation)
  components/vehicles/MoodScoreCard.tsx
  components/vehicles/FuelLogList.tsx
  components/vehicles/DocumentExpiry.tsx
  pages/PrePurchaseScanPage.tsx
  components/vehicles/ScanReport.tsx

Day 2: Engine Fingerprint + SOS
  components/vehicles/EngineFingerprintCard.tsx
  components/dashboard/SOSButton.tsx  ← red emergency FAB

Day 3: Electronics Features
  components/devices/SilentKillerAlert.tsx  ← prominent red alert
  components/devices/EpidemicAlert.tsx
  pages/EndOfLifePage.tsx
  components/devices/MemoryReel.tsx  ← AI-generated summary

Day 4-5: Virtual Consultation
  pages/VideoConsultPage.tsx
  components/video/VideoCallScreen.tsx  ← Agora SDK
  components/video/AIAnnotationOverlay.tsx  ← Canvas overlay
  components/video/VideoControls.tsx
  components/video/ConsultOutcomeCard.tsx
```

### Phase 7 Completion Checklist

```
Industrial features:
□ Sound recording + FFT analysis display
□ Digital twin health gauge animated
□ Component health grid clickable
□ Prediction timeline shows future dates
□ Negotiation panel with AI verdict
□ Auction countdown timer live
□ Tamper-proof badge on completed jobs
□ Wiki article search + vote

Automobile features:
□ Vehicle mood score with breakdown
□ Fuel log entry + mileage calculation
□ Document expiry alerts (insurance, PUC)
□ Pre-purchase scan report displays
□ SOS button visible on automobile dashboard
□ Engine fingerprint baseline recording

Electronics features:
□ Silent killer alert banner shows
□ Epidemic alert for affected device models
□ End of life flow completes
□ Memory reel generated by AI

Video consultation:
□ Tier selection (₹99/199/299)
□ Agora video call connects
□ AI annotation overlay on camera feed
□ Outcome recorded (fixed/visit needed)
□ Fee deducted from job charge

All industries:
□ NFT badge display with blockchain link
□ Carbon credits counter visible
□ 9 language switch works on all pages
□ Offline mode shows cached data
□ Dark mode works on all screens
```

---

## 9. Phase 8 — Flutter Owner App (Week 10)

**Goal:** Complete owner experience on Android. All web features replicated.

---

### Member 3 — Flutter Owner App (Lead)

```
Day 1: Auth + Onboarding
  features/auth/screens/
    splash_screen.dart       ← logo + auth check
    onboarding_screen.dart   ← 3-slide intro
    login_screen.dart        ← phone input
    otp_screen.dart          ← 6-pin entry (Pinput)
    signup_screen.dart
    industry_setup_screen.dart

  Test on Android emulator:
  ✅ Login with OTP works on device
  ✅ JWT stored in flutter_secure_storage
  ✅ Deep link: app.uptime.in/login opens app

Day 2: Home + Assets
  features/home/screens/home_screen.dart
  features/home/widgets/
    industry_selector_widget.dart
    quick_action_grid.dart
    active_job_card.dart
    prediction_alert_card.dart
    asset_health_row.dart

  features/assets/screens/
    assets_screen.dart    ← tabs: machines/vehicles/devices
    add_asset_screen.dart
    asset_details_screen.dart

  Test:
  ✅ Home screen loads with correct industry tabs
  ✅ Add machine from Flutter app

Day 3: Fault Report + AI
  features/fault_report/screens/
    fault_report_screen.dart
    ai_diagnosis_screen.dart
    cost_estimate_screen.dart
  features/fault_report/widgets/
    voice_input_widget.dart    ← speech_to_text (Hindi!)
    media_upload_widget.dart
    sound_recorder_widget.dart
    ai_diagnosis_card.dart
    urgency_selector.dart

  Test:
  ✅ Voice input in Hindi on device
  ✅ Photo upload works
  ✅ AI diagnosis card displays

Day 4: Booking + Live Tracking
  features/booking/screens/
    technician_list_screen.dart
    technician_profile_screen.dart
    booking_confirm_screen.dart

  features/tracking/screens/
    live_tracking_screen.dart   ← Google Maps full-screen
    otp_share_screen.dart

  features/tracking/widgets/
    tracking_map_widget.dart    ← moving marker
    job_status_stepper.dart
    eta_display.dart
    technician_info_bottom_sheet.dart

  Test:
  ✅ Ranked tech list from API
  ✅ Map shows tech moving
  ✅ OTP share screen displays
  ✅ WebSocket updates map in real-time

Day 5: Job History + Payments + Polish
  features/job_history/screens/
    job_history_screen.dart
    job_details_screen.dart
    rate_job_screen.dart        ← star rating

  features/payments/screens/
    payment_screen.dart         ← razorpay_flutter
    wallet_screen.dart
    subscription_screen.dart

  Polish:
  → All Lottie animations play
  → Pull-to-refresh on all lists
  → Offline banner on no network
  → All 9 ARB translation files
  → Haptic feedback on critical actions

  Test:
  ✅ Full job flow works on Android
  ✅ Razorpay test payment completes
  ✅ Rating submitted
  ✅ Hindi language works
```

### Member 1 — Flutter Owner App Support

```
Day 1-5: Remaining Flutter screens
  features/insurance/    ← all insurance screens
  features/marketplace/  ← product browse + cart
  features/video_consult/← Agora video call
  features/digital_twin/ ← health gauge + components
  features/wiki/         ← search + article view
  features/profile/      ← edit profile + settings

  Offline sync:
  offline/hive_boxes.dart
  offline/offline_sync.dart
  → Drafts saved when offline
  → Auto-sync on reconnect
```

### Phase 8 Completion Checklist

```
□ Login with OTP on real Android device
□ Home screen with industry tabs
□ Voice input in Hindi works
□ Photo + audio upload from phone
□ AI diagnosis displays correctly
□ Book technician from Flutter app
□ Live tracking map updates in real-time
□ OTP entry screen works
□ Razorpay payment on mobile (test mode)
□ Job history with swipe actions
□ Star rating submission
□ All Lottie animations play
□ Offline banner shows + cached data visible
□ Hindi language fully working
□ Push notification opens correct screen (deep link)
□ Digital twin displays on mobile
□ Agora video call connects
□ App size < 50MB release APK
```

---

## 10. Phase 9 — Flutter Tech App + Testing (Week 11)

**Goal:** Technician field app complete. All tests passing.

---

### Member 3 — Flutter Tech App

```
Day 1: Auth + Home
  features/auth/           ← same as owner app
  features/onboarding/
    skill_setup_screen.dart
    document_upload_screen.dart
  features/home/screens/tech_home_screen.dart
  features/home/widgets/
    availability_toggle.dart  ← BIG toggle
    today_stats_row.dart
    earnings_preview_card.dart

Day 2: Job Request + Auction
  features/job_requests/screens/
    job_request_screen.dart   ← FULL SCREEN, loud notification
    auction_screen.dart       ← live bonus counter
  features/job_requests/widgets/
    accept_decline_buttons.dart  ← large buttons
    auction_timer_widget.dart
    competing_techs_count.dart

  CRITICAL: Test on real device!
  ✅ Push notification arrives
  ✅ Full-screen job request opens
  ✅ 60-second countdown visible
  ✅ Accept button works

Day 3: Navigation + OTP
  features/navigation/screens/
    navigation_screen.dart    ← Google Maps turn-by-turn
    arrival_screen.dart
  features/otp_verify/screens/
    otp_entry_screen.dart     ← Pinput 6-digit

  Android foreground service:
  android/.../LocationForegroundService.kt
  → GPS runs when app backgrounded
  → Persistent notification shown

  Test:
  ✅ Navigation opens Google Maps route
  ✅ GPS works with screen off (foreground service)
  ✅ OTP entry + verification works

Day 4: AI Copilot + Job Execution
  features/job_execution/screens/
    checklist_screen.dart
    ai_copilot_screen.dart
    parts_logging_screen.dart
    job_complete_screen.dart
  features/job_execution/widgets/
    copilot_step_card.dart
    copilot_photo_capture.dart
    part_add_widget.dart
    signature_pad.dart        ← signature package

  Test:
  ✅ All 8 copilot steps advance
  ✅ Photo capture per step works
  ✅ Parts logged with prices
  ✅ Digital signature captured
  ✅ Job complete + locked

Day 5: Earnings + Badges
  features/earnings/
  features/badges/
  features/job_history/
  features/video_consult/screens/video_answer_screen.dart
```

### Member 4 — All Testing (Days 1-5)

```
Day 1: Unit Tests (Spring Boot)
  Run all existing unit tests: mvn test
  Write missing tests:
  → ScoringEngineTest      (all edge cases)
  → HashUtilsTest          (tamper detection)
  → OTPServiceTest         (lockout logic)
  → GSTServiceTest         (both tax types)
  → GeminiServiceTest      (fallback handling)
  → JobServiceTest         (lifecycle rules)

  Target: mvn test → all pass ✅
  Coverage: jacoco:report → check ≥ 70%

Day 2: Integration Tests
  → AuthFlowIntegrationTest
  → JobLifecycleIntegrationTest
  → PaymentFlowIntegrationTest
  → SecurityTest (RBAC checks)

  Run: mvn verify ✅

Day 3: Postman Collections
  Complete collection for all modules:
  → Auth, Users, Technicians, Jobs
  → AI, Matching, Payments, Tracking
  → Ratings, Notifications, Industry
  → Insurance, Marketplace, Wiki, Admin

  Run full collection against staging:
  All requests pass ✅

Day 4: JMeter Load Test
  Test Plan 1: 100 users, 10 minutes
  Success: p95 < 500ms, error < 1%

  Test Plan 2: AI endpoints, 50 users
  Success: p95 < 10s, no timeouts

  Fix any performance issues found

Day 5: Security + Accessibility
  OWASP ZAP scan on staging
  Fix any HIGH/CRITICAL findings

  Lighthouse on owner web:
  Performance > 80
  PWA > 95
  Accessibility > 90

  Manual security tests from TESTING.md
```

### Phase 9 Completion Checklist

```
Flutter Tech App:
□ Push notification → full-screen job request
□ 60-second countdown works
□ Accept/decline → correct flow
□ GPS foreground service persists on lock screen
□ OTP entry + GPS verification
□ All 8 AI copilot steps work
□ Photo capture per step
□ Parts logging
□ Digital signature
□ Job complete + locked
□ Earnings chart displays
□ Badge collection shows

Testing:
□ mvn test → all unit tests pass
□ mvn verify → all integration tests pass
□ Coverage ≥ 70% (check Jacoco report)
□ Postman: all collections pass on staging
□ JMeter: p95 < 500ms at 100 users
□ OWASP ZAP: no HIGH/CRITICAL findings
□ Lighthouse: Performance > 80, PWA > 95
□ Accessibility: score > 90
```

---

## 11. Phase 10 — PBL Submission (Week 12)

**Goal:** Demo-ready. Submitted. Impressed evaluators.

---

### Member 4 — Project Report + Presentation

```
Day 1-2: Project Report (PDF)
  Using report template from uptime-docs:
  → Cover page with all 4 names + USNs
  → Abstract (1 page)
  → Introduction (2 pages)
  → Problem Statement (1 page)
  → Objectives (1 page)
  → Existing System (2 pages)
  → Proposed System (3 pages)
  → System Design (DB diagram, architecture)
  → Implementation (screenshots)
  → Testing (test results tables)
  → Results (screenshots of working app)
  → Conclusion (1 page)
  → References
  → Appendix (code snippets)

Day 3: Update Presentation
  UPTIME_PBL_Final.pptx
  → Update with actual screenshots
  → Add demo flow slide
  → Add results/metrics slide
  → Rehearse timing (10 minutes)

Day 4: Dress Rehearsal
  All 4 members present:
  → Pavan: architecture + AI demo
  → Member 2: database + payment demo
  → Member 3: mobile app demo
  → Member 4: testing results
  Time: 10 min presentation + 5 min Q&A

Day 5: Final Submission
  □ Code committed + tagged v1.0.0
  □ All repos on GitHub
  □ README files updated
  □ Project report PDF submitted
  □ Presentation deck submitted
  □ Demo video (optional but impressive)
```

### Member 1 — Production Deployment

```
Day 1: Deploy Backend to Railway
  1. Connect Railway to uptime-backend repo
  2. Set all environment variables
  3. Deploy + verify /api/v1/health = UP
  4. Run Flyway migrations on production
  5. Seed V17 demo data

Day 2: Deploy Web Apps to Vercel
  1. Connect Vercel to uptime-owner-web
  2. Set VITE_API_URL = Railway URL
  3. Deploy → test at https://uptime.in
  4. Repeat for tech-web + admin-web

Day 3: Final Demo Setup
  Create demo accounts (from V17 seed):
  Owner:  9876543210 / demo-otp
  Tech:   9123456789 / demo-otp
  Admin:  admin@uptime.in / Demo@123

  Prepare demo script:
  → Show fault report with AI
  → Show tech getting notified
  → Show live tracking
  → Show job completion + invoice
  → Show admin dashboard
  → Show digital twin
  → Show video consultation

Day 4-5: Buffer + Final Checks
  □ Demo flow rehearsed 3 times
  □ Backup APKs ready on USB drive
  □ Screenshots taken for report
  □ All links working
  □ Offline demo possible (if no internet)
```

### Phase 10 Completion Checklist

```
□ Backend deployed to Railway — health UP
□ Owner web at uptime.in — all features work
□ Tech web at tech.uptime.in — all features work
□ Admin web at admin.uptime.in — all features work
□ APK installed on demo phone (owner + tech)
□ Demo accounts working (OTP bypass for demo)
□ All seed data loaded
□ Project report PDF complete + printed
□ Presentation deck final version
□ GitHub repos clean + tagged v1.0.0
□ README on every repo updated
□ Demo script rehearsed by all 4 members
□ Q&A prep: 10 likely questions + answers
□ Backup plan if internet fails
```

---

## 12. Daily Workflow

```
Every day for all team members:

Morning (10 AM — 30 min standup):
  Each member answers:
  1. What did I complete yesterday?
  2. What will I do today?
  3. Any blockers?

During work:
  → Work on your feature branch only
  → Commit every 1-2 hours
     git commit -m "feat: description"
  → Push at end of day
     git push origin feature/your-name/task

End of day:
  → Create PR if feature complete
  → Assign Pavan as reviewer
  → Update GitHub project board
     (move card from In Progress to In Review)

Weekly (Friday):
  → Pavan reviews + merges all PRs to develop
  → Test develop branch together
  → Merge develop → main (after testing)
  → Tag release if milestone complete
  → Plan next week's tasks
```

---

## 13. Definition of Done

```
A feature is DONE only when ALL of these are true:

Code:
  □ Feature works as described in PRD.md
  □ Follows CODING_STANDARDS.md patterns
  □ Follows RULES.md (no violations)
  □ No console errors or warnings
  □ Error states handled gracefully

Testing:
  □ Works manually end-to-end
  □ At least 1 unit/widget test written
  □ No regressions in existing tests
  □ Tested in Postman (if backend feature)

Code Quality:
  □ Code reviewed by Pavan (PR approved)
  □ No TODO comments left
  □ No hardcoded values
  □ No .env secrets committed

UI (if applicable):
  □ Matches DESIGN.md specifications
  □ Works on mobile screen (360px)
  □ Works in dark mode
  □ Works with Hindi language
  □ Loading + error + empty states shown
  □ Lottie animation plays if applicable

Documentation:
  □ API documented in Swagger
  □ Complex logic has comments
  □ README updated if new setup required
```

---

## 14. Dependency Map

```
Cannot build X until Y is done:

Y (must exist first)     → X (can then be built)
────────────────────────────────────────────────
Supabase + migrations    → Spring Boot entities
Spring Boot entities     → Repositories + Services
Auth module              → ALL other modules
                           (everything needs JWT)
Job module               → Matching module
                           (need job to match)
Matching module          → WebSocket tracking
                           (need job accepted first)
AI module                → Copilot in Flutter tech app
Payment module           → Wallet + payout scheduler
FCM setup                → Any push notifications
Google Maps API key      → Any map components
Agora App ID             → Video consultation
Backend AI endpoint      → Owner web AI diagnosis page
Backend matching API     → Owner web tech list
Backend tracking WS      → Owner web live map
Owner web complete       → Flutter owner app
                           (same flows, reuses same APIs)
Backend all APIs done    → Flutter tech app
                           (all API calls need to exist)
All features complete    → Testing phase
                           (nothing to test otherwise)
```

---

## 15. Risk & Mitigation

```
Risk 1: Gemini API rate limit hit
  Probability: MEDIUM
  Impact: AI features stop working
  Mitigation:
  → Always implement fallback (see RULES.md AI-01)
  → Cache AI responses in Redis (10 min)
  → Monitor token usage weekly
  → If limit hit: use multiple API keys

Risk 2: Google Maps credit exhausted
  Probability: LOW ($200 free/month)
  Impact: Maps + tracking stop working
  Mitigation:
  → Monitor usage in Google Console weekly
  → Haversine fallback already coded
  → Text-based ETA as last resort

Risk 3: Team member falls behind
  Probability: MEDIUM
  Impact: Feature not ready on time
  Mitigation:
  → Weekly check on GitHub commit frequency
  → Pavan reassigns tasks if member stuck
  → Core features prioritised over unique features
  → Minimum viable: backend + owner web + tech web

Risk 4: Supabase free tier storage full
  Probability: LOW (500MB for demo data)
  Impact: Database writes fail
  Mitigation:
  → Monitor weekly in Supabase dashboard
  → Delete test data before demo
  → Use Cloudinary for media (not Supabase storage)

Risk 5: Flutter app crashes on demo device
  Probability: MEDIUM
  Impact: Mobile demo fails
  Mitigation:
  → Test on actual demo device 1 week early
  → Keep backup APK on USB drive
  → PWA as backup for owner (runs on browser)
  → Tech web as backup for technician

Risk 6: Payment webhook fails in demo
  Probability: LOW
  Impact: Payment demo fails
  Mitigation:
  → Use Razorpay test mode (no real money)
  → Pre-load wallet balance in seed data
  → Show payment history even if live demo fails

Risk 7: Internet unavailable during PBL demo
  Probability: LOW but HIGH impact
  Mitigation:
  → Local Docker setup as complete backup
  → Pre-recorded video of all flows
  → Screenshots in presentation as last resort
  → Practice offline demo script
```

---

*UPTIME Implementation Guide — v1.0*  
*"Downtime ends here."*  
*DSATM Bengaluru — VTU — 2026-27*
