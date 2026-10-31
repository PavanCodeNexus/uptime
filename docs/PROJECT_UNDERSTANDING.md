# UPTIME — Complete Project Understanding & Implementation Blueprint

> **Document Version:** 1.0  
> **Last Updated:** 2026-10-30  
> **Author:** AI Architecture Team (Antigravity)  
> **Status:** APPROVED — Ready for Implementation

---

## Table of Contents

1. [What is UPTIME](#1-what-is-uptime)
2. [The Core Problem](#2-the-core-problem)
3. [How UPTIME Works — The User Journey](#3-how-uptime-works--the-user-journey)
4. [The 3-Path Resolution System](#4-the-3-path-resolution-system)
5. [Complete Feature Catalog (61 Features)](#5-complete-feature-catalog-61-features)
6. [System Architecture](#6-system-architecture)
7. [Technology Stack (Finalized)](#7-technology-stack-finalized)
8. [Database Architecture (130 Tables, 14 Modules)](#8-database-architecture-130-tables-14-modules)
9. [API Architecture (108+ Endpoints)](#9-api-architecture-108-endpoints)
10. [Backend Module Breakdown (14 Modules)](#10-backend-module-breakdown-14-modules)
11. [Security Architecture](#11-security-architecture)
12. [External Service Integration Strategy](#12-external-service-integration-strategy)
13. [6 Client Platforms](#13-6-client-platforms)
14. [30-Day Implementation Schedule](#14-30-day-implementation-schedule)
15. [Contradictions Found & Resolved](#15-contradictions-found--resolved)
16. [All Decisions Locked](#16-all-decisions-locked)
17. [Risks & Mitigations](#17-risks--mitigations)

---

## 1. What is UPTIME

UPTIME is a full-lifecycle, on-demand emergency repair and technician dispatch ecosystem for the Indian market. It connects **Asset Owners** (factories, vehicle owners, appliance users) with **Verified Technicians** through AI-powered fault diagnosis, smart matching, live GPS tracking, and transparent pricing.

**Three Industries Served:**
- 🏭 **Industrial Equipment & MSMEs** — CNC machines, compressors, boilers, hydraulic presses, packaging units, PLC systems
- 🚗 **Automobiles** — Trucks, tractors, cars, 2-wheelers, EVs, commercial fleets
- 🔌 **Electronics & Commercial Appliances** — HVAC, commercial refrigeration, PCB repair, smart appliances, UPS/inverters

**Tagline:** *"Downtime ends here."*

**Market Opportunity:** ₹45,000 Cr+ annual Indian industrial downtime cost. Current MTTR (Mean Time To Repair) is 48 hours. UPTIME targets under 2 hours.

---

## 2. The Core Problem

| Problem | Current State | UPTIME Solution |
|---------|--------------|-----------------|
| Finding a technician | Word of mouth, hours of calling | AI matches best technician in 60 seconds |
| Unknown pricing | Opaque quotes, billing fraud | AI cost estimation before booking, transparent breakdown |
| Unverified skills | No way to check credentials | Document verification + skill testing + trust scores |
| Long wait times | 24-48 hour MTTR | Live tracking, 2-hour target response |
| No accountability | Technician marks "done" from home | OTP + GPS dual arrival verification |
| No repair guidance | Technician works from memory | AI Copilot with step-by-step checklists |
| No remote diagnosis | Must wait for physical visit | Video consultation with live AI annotations |

---

## 3. How UPTIME Works — The User Journey

This is the core flow that drives the entire system. **The user is always in control — they choose their path, in any order.**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        OWNER HAS A PROBLEM                             │
│         (Machine broke down / Vehicle won't start / AC not cooling)    │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 1: MULTI-INPUT FAULT REPORT                                      │
│                                                                         │
│  Owner submits fault data through ANY combination of:                   │
│    📷 Photos (up to 10)  — capture visible damage                      │
│    🎥 Video (1 clip)     — show the problem in action                  │
│    🎤 Audio (10-60 sec)  — record abnormal machine sounds              │
│    📝 Text description   — describe what happened                      │
│    📍 Location           — auto-detected GPS coordinates               │
│                                                                         │
│  POST /api/v1/jobs (multipart/form-data)                               │
│  → Media uploaded to Cloudinary (async)                                 │
│  → Job created with status = POSTED                                    │
│  → AI analysis task queued to RabbitMQ                                 │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 2: AI FAULT TRIAGE (Gemini 1.5 Flash)                           │
│                                                                         │
│  RabbitMQ consumer processes the AI task:                               │
│    1. Load uploaded media URLs                                          │
│    2. Build multimodal prompt (text + images + audio)                   │
│    3. Send to Gemini 1.5 Flash API                                     │
│    4. Parse structured JSON response:                                   │
│       • fault_category: "Bearing Failure"                              │
│       • urgency: "HIGH"                                                │
│       • cost_min: ₹2,500 / cost_max: ₹4,500                          │
│       • skill_tags: ["mechanical", "bearings", "motor"]                │
│       • diagnosis_text: "Grinding noise at 2400Hz indicates..."        │
│       • confidence: 0.82                                               │
│    5. Update job → status = AI_ANALYZED                                │
│    6. Store in ai_fault_diagnoses table                                │
│    7. Push WebSocket update to owner                                   │
│                                                                         │
│  FALLBACK: If Gemini is unavailable:                                   │
│    → Owner manually selects fault category from dropdown               │
│    → System proceeds with manual triage                                │
│    → AI enrichment happens asynchronously when service recovers        │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 3: OWNER CHOOSES RESOLUTION PATH                                 │
│                                                                         │
│  POST /api/v1/jobs/{id}/choose-path                                    │
│  Owner sees 3 cards on screen — picks ANY one (not locked to order):   │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│  │ 🤖 AI COPILOT│  │ 📹 VIDEO     │  │ 🔧 BOOK      │                 │
│  │              │  │ CONSULT      │  │ TECHNICIAN   │                 │
│  │ Try self-fix │  │ Remote diag  │  │ Physical     │                 │
│  │ with AI guide│  │ with expert  │  │ visit        │                 │
│  │              │  │              │  │              │                 │
│  │ ₹0 extra     │  │ ₹99–₹299    │  │ Quoted price │                 │
│  │              │  │              │  │              │                 │
│  │ Wave 1: LIVE │  │ [Coming Soon]│  │ Wave 1: LIVE │                 │
│  │              │  │ Wave 3       │  │              │                 │
│  └──────────────┘  └──────────────┘  └──────────────┘                 │
│                                                                         │
│  Also available: [SKIP] → Goes directly to technician list             │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
            ┌─────────────────────┼─────────────────────┐
            ▼                     ▼                     ▼
     PATH 1: COPILOT       PATH 2: VIDEO         PATH 3: BOOK
     (see §4 below)        (see §4 below)        (see §4 below)
```

---

## 4. The 3-Path Resolution System

### PATH 1: AI Copilot (Self-Repair with AI Guidance)

```
Owner chooses COPILOT
        │
        ▼
GET /api/v1/ai/copilot/{jobId}
→ Gemini generates step-by-step repair checklist
→ Each step has: instruction, safety warnings, expected visual outcome
        │
        ▼
┌─────────────────────────────────────────────┐
│  STEP 1: "Disconnect power supply"          │
│  ⚠️ Safety: Ensure lockout/tagout           │
│  📸 Take photo to verify                    │
│  [✅ Done] [❌ Can't Do] [⬆️ Escalate]      │
├─────────────────────────────────────────────┤
│  STEP 2: "Remove access panel (4 screws)"   │
│  📸 Take photo to verify                    │
│  [✅ Done] [❌ Can't Do] [⬆️ Escalate]      │
├─────────────────────────────────────────────┤
│  STEP 3: "Inspect bearing assembly"          │
│  Look for: scoring, discoloration, play      │
│  📸 Take photo → Gemini verifies match       │
│  [✅ Done] [❌ Can't Do] [⬆️ Escalate]      │
└─────────────────────────────────────────────┘
        │
   ┌────┴────┐
   ▼         ▼
FIXED!    STUCK → Escalate to VIDEO or BOOK
   │         │
   ▼         ▼
Job done   POST /api/v1/jobs/{id}/escalate
           { fromPath: "COPILOT", toPath: "VIDEO" or "BOOK" }
```

### PATH 2: Video Consultation (Remote Expert Diagnosis)

```
Owner chooses VIDEO (or escalates from COPILOT)
        │
        ▼
POST /api/v1/consultations
→ AI matches available remote-certified technician
→ Spring Boot generates Agora channel token (30-min expiry)
→ Both parties join Agora video channel
        │
        ▼
┌─────────────────────────────────────────────┐
│  LIVE VIDEO CALL                            │
│                                              │
│  Owner points phone camera at machine        │
│  ↓                                           │
│  Every 5 seconds:                            │
│    Client captures video frame (JPEG)        │
│    POST /consultations/{id}/frame-analysis   │
│    Gemini Vision returns fault annotations    │
│    Annotations overlaid on live feed          │
│                                              │
│  Technician guides owner in real-time        │
│  Pricing tiers:                              │
│    Quick Check (15 min) → ₹99               │
│    Full Diagnosis (30 min) → ₹199           │
│    Extended (45 min) → ₹299                 │
└─────────────────────────────────────────────┘
        │
   ┌────┴────┐
   ▼         ▼
FIXED       NOT FIXABLE REMOTELY
REMOTELY    → Escalate to BOOK
   │         → Consultation fee deducted from physical visit
   ▼
Job done
(charge: ₹99–₹299)
```

**Wave 1 Status:** Video card shows **"Coming Soon"**. Backend returns `503` with message. Full Agora integration in Wave 3.

### PATH 3: Book Technician (Physical Visit)

```
Owner chooses BOOK (or escalates from COPILOT/VIDEO)
        │
        ▼
POST /api/v1/matching/request
→ MatchingService.findBestTechnicians():
  1. PostGIS spatial query: technicians within 20km
     ST_DWithin(tech_location, job_location, 20000)
  2. Filter: is_available=TRUE, verified=APPROVED, skills match AI tags
  3. Composite scoring (for each candidate):
     ┌────────────────────────────────────────────┐
     │  distance_score  = f(km)     × 0.40 (40%) │
     │  skill_score     = f(tags)   × 0.60 (60%) │
     │  BONUS: +10 if rating > 4.5               │
     │  BONUS: +5 if jobs > 100                  │
     │  BONUS: +5 if avg_response < 2 min        │
     │  EXCLUDE: is_fatigue_restricted = TRUE     │
     └────────────────────────────────────────────┘
  4. Sort by total_score DESC → return top 10
        │
        ▼
GET /api/v1/matching/{jobId}/results
→ Owner sees ranked technician list with:
  Name, photo, rating, distance, ETA, price range, match %
        │
        ▼
POST /api/v1/matching/{jobId}/select  (Owner taps "Book Now")
→ FCM push sent to technician
→ 60-second countdown for tech to accept
        │
        ▼
POST /api/v1/matching/{jobId}/respond  (Tech taps ACCEPT)
→ Job status = ACCEPTED
        │
        ▼
PUT /api/v1/jobs/{id}/status  { status: "EN_ROUTE" }
→ Tech taps "Navigate"
→ GPS foreground service starts (location every 5 seconds)
→ Owner sees live map with tech movement + ETA
        │
        ▼
POST /api/v1/jobs/{id}/otp-verify  (ARRIVAL VERIFICATION)
→ Spring Boot generates 6-digit OTP → sends to owner via SMS + push
→ Owner shows OTP to tech face-to-face
→ Tech enters OTP in app
→ Server verifies BOTH:
  ✓ BCrypt.verify(enteredOTP, storedHash)
  ✓ PostGIS ST_DWithin(techLocation, jobLocation, 500m)
→ BOTH must pass → status = ARRIVED
        │
        ▼
PUT /api/v1/jobs/{id}/status  { status: "IN_PROGRESS" }
→ AI Copilot loads repair checklist
→ Tech follows steps, captures before/after photos
→ Parts used are logged with prices
        │
        ▼
POST /api/v1/jobs/{id}/complete
→ Owner confirms (or auto-confirms after 24h)
→ Final cost calculated (labour + parts + platform commission + GST)
→ Invoice PDF generated (SHA-256 tamper-proof hash)
→ Job record locked (is_tamper_proof_locked = TRUE)
        │
        ▼
POST-JOB:
  → Razorpay payment processed (escrow released to tech)
  → Both parties get rating prompt (48-hour window)
  → Trust scores recalculated
  → Service history updated
  → Digital twin updated (if applicable)
```

### Escalation Between Paths

The user can escalate at any point. All context carries forward:

```
COPILOT ──escalate──► VIDEO ──escalate──► BOOK
   │                    │                   │
   └────escalate────────┼───────────────────┘
                        │
                        └────escalate───────► BOOK

POST /api/v1/jobs/{id}/escalate
{
  "fromPath": "COPILOT",
  "toPath": "VIDEO",          // or "BOOK"
  "escalationReason": "Could not complete step 4"
}

GET /api/v1/jobs/{id}/path-status
→ Returns full path history with timestamps, outcomes, steps completed
```

---

## 5. Complete Feature Catalog (Source of Truth: FEATURES.md)

UPTIME features are categorized across 6 domains. Every feature aligns with its exact designation in [FEATURES.md](file:///F:/uptime/FEATURES.md), including all **19 World-First Innovations (⭐)** and their corresponding delivery waves.

---

### 5.1 Core Features — All Industries (12 Features)

| ID | Feature Name | Description & Innovation | Path | Wave |
|---|---|---|---|---|
| **CORE-01** | Multi-Input Fault Reporting | Photos (up to 10), video, voice/audio notes, description, auto GPS | All | Wave 1 |
| **CORE-02** | AI Fault Triage | Multimodal Gemini Flash diagnosis with urgency and confidence scoring | All | Wave 1 |
| **CORE-03** | Smart Technician Matching | PostGIS spatial radius (20km) + 40% distance + 60% skill match score | BOOK | Wave 1 |
| **CORE-04** | Live GPS Tracking | Real-time WebSocket location updates on Google Maps with live ETA | BOOK | Wave 1 |
| **CORE-05** | OTP + GPS Arrival Verification | Dual-factor anti-fraud: 6-digit OTP + PostGIS 500m proximity check | BOOK | Wave 1 |
| **CORE-06** | AI Repair Checklist (Copilot) | Step-by-step guided repair instructions with photo verification | COPILOT | Wave 1 |
| **CORE-07** | Two-Way Rating System | Reciprocal rating (1-5 stars) + category tags + trust score weighting | BOOK | Wave 1 |
| **CORE-08** | Service History Dashboard | Chronological asset repair book, parts replaced, total cost tracker | All | Wave 1 |
| **CORE-09** | AI Cost Estimator | Pre-booking price prediction (parts + labour range) preventing fraud | All | Wave 1 |
| **CORE-10** | Technician Verification (KYC + Skill) | Tiered L0-L3 verification, Aadhaar QR, selfie liveness, trade tests, provisional route per [TECHNICIAN_VERIFICATION.md](file:///F:/uptime/TECHNICIAN_VERIFICATION.md) | Admin | Wave 1 |
| **CORE-11** | Admin Analytics Dashboard | Platform metrics, revenue, active jobs, disputes, SLA monitoring | Admin | Wave 1 |
| **CORE-12** | Repair Time Auction | Technicians bid on emergency jobs with arrival time and quotes | BOOK | Wave 3 |

---

### 5.2 Industrial & MSME Features (12 Features — 10 World-First ⭐)

| ID | Feature Name | Description & Innovation | Wave |
|---|---|---|---|
| **IND-U01** | AI Repair Copilot ⭐ | **WORLD FIRST:** Guided industrial machine repair with PDF manual lookup and safety protocols | Wave 1 |
| **IND-U02** | Machine Sound Analysis ⭐ | **WORLD FIRST:** Audio spectrogram visual FFT pattern recognition for bearing/motor fault diagnosis | Wave 3 |
| **IND-U03** | Digital Twin (No IoT Required) ⭐ | **WORLD FIRST:** Software-only machine degradation and health tracking from manual service logs | Wave 2 |
| **IND-U04** | AI Negotiation Assistant ⭐ | **WORLD FIRST:** Real-time counter-offer suggestions based on historical pricing benchmarks | Wave 3 |
| **IND-U05** | Repair Pattern Prediction ⭐ | **WORLD FIRST:** Identifies component failure cycles across machine batches and brands | Wave 3 |
| **IND-U06** | Tamper-Proof Job Records ⭐ | **WORLD FIRST:** SHA-256 cryptographic hash chain verifying completion, parts, and invoices | Wave 1 |
| **IND-U07** | OTP + GPS Dual Verification ⭐ | **WORLD FIRST:** Independent physical and digital arrival verification for industrial job sites | Wave 1 |
| **IND-U08** | Micro-Insurance Per Job ⭐ | **WORLD FIRST:** Single-click transit and repair damage protection for high-value equipment | Wave 3 |
| **IND-U09** | Skill NFT Badges ⭐ | **WORLD FIRST:** Verifiable, tamper-proof on-chain skill and certification credentials | Wave 3 |
| **IND-U10** | Crowd-Sourced Repair Wiki ⭐ | **WORLD FIRST:** Indian factory machine troubleshooting guide curated from completed repairs | Wave 2 |
| **IND-U11** | Virtual Repair Consultation | Remote video diagnostic session with certified industrial specialist | Wave 3 |

---

### 5.3 Automobile Features (15 Features — 3 World-First ⭐)

| ID | Feature Name | Description & Innovation | Wave |
|---|---|---|---|
| **AUTO-C01** | Roadside SOS Emergency | One-tap emergency dispatch for punctures, fuel, battery jumpstart | Wave 1 |
| **AUTO-C02** | AI Dashboard Warning Reader | Photo-to-diagnosis: decodes instrument cluster warning lights with action guide | Wave 1 |
| **AUTO-C03** | Smart Workshop Booking | Discovery and slot booking for verified garages by brand and specialty | Wave 1 |
| **AUTO-C04** | Vehicle Digital Twin | Digital maintenance history, service schedules, and odometer tracking | Wave 2 |
| **AUTO-C05** | Mechanic Race (Auction) | Emergency breakdown auction where nearest mechanics bid with ETA | Wave 3 |
| **AUTO-C06** | EV Specific Support | Dedicated battery health, BMS errors, motor controller, and charger diagnostics | Wave 3 |
| **AUTO-C07** | Insurance Claim Assistant | AI damage assessment report generation for insurance filing | Wave 3 |
| **AUTO-C08** | Tyre & Fuel Service | Mobile tyre repair, puncture fix, and emergency roadside fuel delivery | Wave 1 |
| **AUTO-C09** | Driver Safety Score | Speed and driving pattern analysis linked to preventive maintenance | Wave 3 |
| **AUTO-C10** | Fleet Management | Multi-vehicle maintenance dashboard for commercial fleets | Wave 2 |
| **AUTO-C11** | Traffic Fine Manager | Pending e-challan checker with direct payment links | Wave 3 |
| **AUTO-C12** | Fuel Station Locator | Nearby fuel/EV stations with current fuel prices and amenities | Wave 3 |
| **AUTO-U01** | Engine Sound Fingerprint ⭐ | **WORLD FIRST:** Audio acoustic baseline comparison to detect knocking, misfires, valve wear | Wave 3 |
| **AUTO-U02** | Vehicle Mood Score ⭐ | **WORLD FIRST:** Composite health score (0-100) summarizing overall vehicle condition | Wave 3 |
| **AUTO-U03** | Pre-Purchase Vehicle Scanner ⭐ | **WORLD FIRST:** Multi-point AI inspection checklist detecting accident damage, flood, repainting | Wave 3 |

---

### 5.4 Electronics & Commercial Appliances (15 Features — 4 World-First ⭐)

| ID | Feature Name | Description & Innovation | Wave |
|---|---|---|---|
| **ELEC-C01** | Smart Fault Reporting | Appliance error code scanner from LED/LCD panel photos with manual lookup | Wave 1 |
| **ELEC-C02** | Repair vs Replace Advisor | AI financial calculation comparing repair cost vs depreciation & replacement | Wave 1 |
| **ELEC-C03** | Doorstep Repair Service | Standard home/office appliance repair booking with fixed callout fees | Wave 1 |
| **ELEC-C04** | Device Health Monitor | Lifecycle tracking for major appliances (compressor, motor, condenser) | Wave 2 |
| **ELEC-C05** | Data Protection Protocol | Pre-repair data backup and factory-reset guide for smart devices | Wave 2 |
| **ELEC-C06** | Spare Parts Marketplace | Direct purchasing of genuine OEM appliance parts with compatibility check | Wave 2 |
| **ELEC-C07** | Warranty & AMC Manager | Digital bill/warranty storage with expiry alerts and annual contract renewals | Wave 1 |
| **ELEC-C08** | Smart Home Integration | Diagnostic support for IoT connected appliances, hubs, and zigbee units | Wave 3 |
| **ELEC-C09** | Electronics Insurance | Accidental screen damage and liquid spill micro-insurance policies | Wave 3 |
| **ELEC-C10** | Certified Refurbished Market | Platform to buy and sell verified, technician-tested refurbished equipment | Wave 3 |
| **ELEC-U01** | Fault Epidemic Detection ⭐ | **WORLD FIRST:** Early warning system clustering identical failures to flag manufacturing defects | Wave 2 |
| **ELEC-U02** | Silent Killer Detection ⭐ | **WORLD FIRST:** Predicts catastrophic appliance failure from minor symptoms (hum, vibration) | Wave 3 |
| **ELEC-U03** | Crowd-Sourced Repair Wiki | Appliance repair guides curated by technicians across India | Wave 2 |
| **ELEC-U04** | Universal Repair Language ⭐ | **WORLD FIRST:** Icon and visual-based repair steps crossing Indian language barriers | Wave 2 |
| **ELEC-U05** | Device End of Life Ritual ⭐ | **WORLD FIRST:** Responsible e-waste recycling with carbon credit certificate generation | Wave 3 |

---

### 5.5 Platform-Wide Features (7 Features)

| ID | Feature Name | Description & Innovation | Wave |
|---|---|---|---|
| **PLT-01** | In-App Payment Gateway | Razorpay UPI, cards, netbanking, wallet with escrow release on completion | Wave 1 |
| **PLT-02** | Subscription Plans | Monthly/annual priority maintenance tiers for businesses and heavy users | Wave 2 |
| **PLT-03** | Technician Earnings Dashboard | Detailed daily/weekly payouts, completed jobs breakdown, and tips tracker | Wave 1 |
| **PLT-04** | AI Chatbot Support 24/7 | Gemini-powered conversational customer assistance and ticket routing | Wave 2 |
| **PLT-05** | Business / Enterprise Accounts | Multi-user roles, corporate billing, GST invoices, and centralized invoicing | Wave 2 |
| **PLT-06** | Repair Carbon Credits | CO₂ savings calculated for repair-vs-replace with redeemable green points | Wave 3 |
| **PLT-07** | Multilingual Platform | 6 Indian languages (Hindi, Kannada, Tamil, Telugu, Marathi, English) | Wave 2 |

---

### 5.6 Virtual Repair Consultation (1 Feature — 1 World-First ⭐)

| ID | Feature Name | Description & Innovation | Wave |
|---|---|---|---|
| **VIRT-01** | Virtual Repair Consultation ⭐ | **WORLD FIRST:** 1:1 live video call with certified technician; Gemini Vision overlays live fault annotations on camera feed | Wave 3 |

---

### Summary of Innovation Portfolio
- **Total Features:** 62 fully specified features
- **Total World-First Innovations (⭐):** 19 groundbreaking features (10 Industrial, 3 Auto, 5 Electronics/Wiki, 1 Virtual Consultation)
- **Wave 1 Scope:** 27 Core Web features (Backend + 3 Web Apps)
- **Wave 2 Scope:** 17 Mobile & Advanced features (2 Flutter Apps + Offline + Wiki + Digital Twins)
- **Wave 3 Scope:** 18 Differentiating & World-First AI features (Agora video, Sound FFT, Auctions, NFTs, EOL rituals)

---

## 6. System Architecture

```
                              ┌──────────────────────────────────────────┐
                              │           6 CLIENT PLATFORMS              │
                              │                                          │
                              │  Owner Web (React 18 PWA)     ── Wave 1  │
                              │  Tech Web (React 18)          ── Wave 1  │
                              │  Admin Web (React 18)         ── Wave 1  │
                              │  Technician App (Flutter 3.x) ── Wave 2  │
                              │  Owner App (Flutter 3.x)      ── Wave 2  │
                              │  Shared Lib (TypeScript)      ── Wave 1  │
                              └──────────────────┬───────────────────────┘
                                                 │
                          HTTPS (REST) ──────────┤──────── WSS (STOMP/SockJS)
                                                 │
                              ┌──────────────────▼───────────────────────┐
                              │     SPRING BOOT 3.3.x MODULAR MONOLITH  │
                              │         (Java 17 target, JDK 21)         │
                              │                                          │
                              │  ┌────────┐ ┌──────┐ ┌──────────────┐   │
                              │  │  Auth  │ │ User │ │  Technician  │   │
                              │  └────────┘ └──────┘ └──────────────┘   │
                              │  ┌────────┐ ┌──────┐ ┌──────────────┐   │
                              │  │  Job   │ │  AI  │ │   Matching   │   │
                              │  └────────┘ └──────┘ └──────────────┘   │
                              │  ┌────────┐ ┌──────┐ ┌──────────────┐   │
                              │  │Payment │ │Notif │ │   Tracking   │   │
                              │  └────────┘ └──────┘ └──────────────┘   │
                              │  ┌────────┐ ┌──────┐ ┌──────────────┐   │
                              │  │Industry│ │Insur │ │  Marketplace │   │
                              │  └────────┘ └──────┘ └──────────────┘   │
                              │  ┌────────┐ ┌──────┐                    │
                              │  │  Wiki  │ │Admin │                    │
                              │  └────────┘ └──────┘                    │
                              └───┬──────────┬──────────┬───────────────┘
                                  │          │          │
                    ┌─────────────▼──┐  ┌────▼────┐  ┌──▼──────────┐
                    │  PostgreSQL    │  │ Cache   │  │  RabbitMQ   │
                    │  (Supabase)    │  │ In-Mem  │  │  (Async)    │
                    │  130 tables    │  │ or Redis│  │  AI, Email, │
                    │  PostGIS       │  │         │  │  Notif      │
                    └────────────────┘  └─────────┘  └─────────────┘
                                  │
                    ┌─────────────▼──────────────────────────────────┐
                    │              EXTERNAL SERVICES                  │
                    │  Gemini Flash │ Google Maps │ Razorpay         │
                    │  FCM          │ Cloudinary  │ SendGrid         │
                    │  Twilio/Mock  │ Agora (W3)  │ Sentry           │
                    └────────────────────────────────────────────────┘
```

### Architecture Style: Modular Monolith

- **Single Spring Boot JAR** containing 14 internal module packages
- **NOT microservices** — too complex for a 4-member student team
- Each module has clear boundaries: its own Controller → Service → Repository → Entity → DTO → Mapper
- Can extract to microservices post-graduation if needed

### Communication Patterns

| Pattern | Technology | Used For |
|---------|-----------|----------|
| **Sync** | REST over HTTPS | All API calls (request-response) |
| **Real-time** | WebSocket (STOMP over SockJS) | Live GPS tracking, job status updates, auction bids |
| **Async** | RabbitMQ (AMQP) | AI analysis, email sending, push notifications, media processing |

### Each Module Follows This Pattern

```
com.uptime.module_name/
├── controller/       @RestController — HTTP endpoints, validation, response mapping
├── service/          Interface — business logic contract
├── service/impl/     @Service — business logic implementation
├── repository/       JpaRepository — data access
├── entity/           @Entity — JPA mapping to DB table
├── dto/              Request DTOs, Response DTOs, Summary DTOs
├── mapper/           @Mapper (MapStruct) — Entity ↔ DTO conversion
├── config/           Module-specific configuration beans
└── exception/        Module-specific exceptions
```

---

## 7. Technology Stack (Finalized)

| Category | Technology | Version | Profile Strategy |
|----------|-----------|---------|-----------------|
| **Language** | Java | 17 (target) | Compiled on JDK 21 |
| **Framework** | Spring Boot | 3.3.x | — |
| **Build** | Maven + Maven Wrapper | — | `mvnw.cmd` (no global install) |
| **Database** | PostgreSQL | 15 | Supabase managed |
| **Spatial** | PostGIS | — | ST_DWithin for distance queries |
| **Migrations** | Flyway | — | V1–V17 SQL scripts |
| **ORM** | Hibernate + Spring Data JPA | — | — |
| **Cache** | ConcurrentMapCache / Upstash Redis | — | dev=in-memory, prod=Redis |
| **Queue** | RabbitMQ | — | Async processing |
| **Security** | Spring Security + JWT RS256 | — | Access + Refresh tokens |
| **Mapping** | MapStruct | — | Entity ↔ DTO auto-mapping |
| **Validation** | Jakarta Bean Validation | — | @NotNull, @Size, @Pattern on DTOs |
| **API Docs** | Springdoc OpenAPI (Swagger) | — | Auto-generated from annotations |
| **Logging** | SLF4J + Logback | — | MDC request IDs |
| **Frontend** | React 18 + TypeScript + Vite | — | 3 web applications |
| **UI** | shadcn/ui + Tailwind CSS | — | — |
| **Web State** | Redux Toolkit + TanStack React Query | — | Global + server state |
| **HTTP (Web)** | Axios | — | Configured instance with interceptors |
| **Mobile** | Flutter 3.x + Dart | — | 2 mobile applications |
| **Mobile State** | Riverpod 2.x | — | FutureProvider + AsyncNotifierProvider |
| **Mobile HTTP** | Dio | — | Interceptors, multipart upload |
| **Offline** | Hive (Flutter) / localStorage (PWA) | — | — |
| **AI** | Google Gemini 1.5 Flash | — | 15 RPM, 1M tokens/month free |
| **Maps** | Google Maps Platform | — | $200/month free credit |
| **Payments** | Razorpay | — | dev/demo=test, prod=live |
| **Push** | Firebase FCM | — | Free unlimited |
| **SMS** | Mock / Fast2SMS / Twilio | — | dev=mock, prod=DLT gateway |
| **Email** | SendGrid | — | 100/day free |
| **Media** | Cloudinary | — | 25 GB free |
| **Video** | Agora.io | — | Wave 3 only, 10K min/month |
| **Monitoring** | Sentry | — | 5K errors/month free |

---

## 8. Database Architecture (130 Tables, 14 Modules)

### Summary

```
Provider:     Supabase (managed PostgreSQL 15)
Extensions:   PostGIS (geospatial), pgcrypto (hashing)
Free tier:    500 MB DB, 1 GB file storage
Connection:   JDBC over SSL (HikariCP, 10 connections max)
Migrations:   Flyway V1–V17
Encoding:     UTF-8 (supports all Indian languages)
```

### Table Distribution by Module

| Module | Tables | Key Tables |
|--------|--------|------------|
| **1. Users & Auth** | 8 | users, user_addresses, user_sessions, otp_verifications, refresh_tokens, user_devices, user_preferences, referrals |
| **2. Technicians** | 10 | technicians, technician_skills, technician_documents, technician_verification, technician_locations, technician_availability, technician_service_areas, technician_statistics, technician_badges, technician_bank_accounts |
| **3. Jobs & Workflow** | 14 | jobs, job_media, job_status_logs, job_parts_used, job_checklists, job_checklist_items, job_invoices, job_cancellations, job_disputes, job_negotiations, job_live_streams, job_path_selections, job_escalations, job_micro_insurance |
| **4. AI & Diagnosis** | 5 | ai_fault_diagnoses, ai_copilot_sessions, ai_copilot_steps, ai_cost_estimates, ai_prompts |
| **5. Matching & Dispatch** | 4 | matching_requests, matching_scores, matching_responses, surge_pricing |
| **6. Payments & Finance** | 8 | payments, payment_splits, technician_wallets, wallet_transactions, payout_requests, platform_earnings, gst_records, subscription_plans |
| **7. Ratings & Trust** | 5 | ratings, trust_scores, badges, technician_badges, rating_responses |
| **8. Industry Specific** | 12 | machines, machine_components, vehicles, vehicle_service_books, devices, device_warranty, digital_twins, twin_repair_history, predictive_alerts, obd_data, fleet_vehicles, fleet_contracts |
| **9. Insurance & Warranty** | 5 | insurance_policies, insurance_claims, warranty_records, warranty_claims, amc_contracts |
| **10. Marketplace** | 6 | parts_catalog, parts_listings, parts_orders, parts_order_items, workshop_profiles, workshop_inventory |
| **11. Notifications** | 4 | notifications, notification_templates, mass_notifications, notification_preferences |
| **12. Analytics & Logs** | 8 | api_request_logs, error_logs, audit_trail, platform_metrics, job_analytics, revenue_analytics, technician_analytics, user_analytics |
| **13. Wiki & Knowledge** | 5 | wiki_articles, wiki_contributions, wiki_categories, wiki_votes, wiki_bookmarks |
| **14. Admin & Platform** | 6 | admin_users, admin_roles, admin_permissions, feature_flags, platform_settings, epidemic_alerts |
| **Additional** | ~30 | virtual_consultations, consultation_recordings, carbon_credits, green_actions, nps_responses, etc. |
| **Total** | **~130** | |

### Flyway Migration Order

```
V1__create_users_and_auth.sql        → users, addresses, sessions, OTP, tokens, devices, prefs, referrals
V2__create_technicians.sql           → technicians, skills, docs, verification, locations, availability, stats, badges, banks
V3__create_jobs_and_workflow.sql     → jobs, media, status_logs, parts, checklists, invoices, disputes, negotiations
V4__create_ai_and_diagnosis.sql      → diagnoses, copilot sessions/steps, cost estimates, prompts
V5__create_matching.sql              → requests, scores, responses, surge pricing
V6__create_payments.sql              → payments, splits, wallets, payouts, earnings, GST, subscriptions
V7__create_ratings.sql               → ratings, trust scores, badges
V8__create_industry_specific.sql     → machines, vehicles, devices, digital twins, predictive alerts
V9__create_insurance.sql             → policies, claims, warranty, AMC
V10__create_marketplace.sql          → parts catalog, listings, orders, workshops
V11__create_notifications.sql        → notifications, templates, mass notif, preferences
V12__create_analytics_and_logs.sql   → request logs, error logs, audit trail, metrics
V13__create_wiki.sql                 → articles, contributions, categories, votes
V14__create_admin.sql                → admin users, roles, permissions, feature flags, settings, epidemics
V15__add_indexes_and_spatial.sql     → PostGIS indexes, composite indexes, GIN indexes on JSONB
V16__add_triggers_and_views.sql      → 4 triggers, 3 views, 2 stored procedures
V17__seed_demo_data.sql              → Demo admin (with TOTP secret), demo owner, demo technician, sample jobs
```

---

## 9. API Architecture (108+ Endpoints)

### Endpoint Distribution

| Module | Endpoints | Base Path |
|--------|-----------|-----------|
| Auth | 6 | `/api/v1/auth/*` |
| User | 5 | `/api/v1/users/*` |
| Technician | 10 | `/api/v1/technicians/*` |
| Job | 12 | `/api/v1/jobs/*` |
| AI | 6 | `/api/v1/ai/*` |
| Matching | 5 | `/api/v1/matching/*` |
| Payment | 6 | `/api/v1/payments/*` |
| Tracking | 2 | `/api/v1/tracking/*` |
| Rating | 3 | `/api/v1/ratings/*` |
| Notification | 3 | `/api/v1/notifications/*` |
| Industry (Machines) | 6 | `/api/v1/machines/*` |
| Industry (Vehicles) | 5 | `/api/v1/vehicles/*` |
| Industry (Devices) | 5 | `/api/v1/devices/*` |
| Digital Twin | 4 | `/api/v1/twins/*` |
| Insurance | 4 | `/api/v1/insurance/*` |
| Marketplace | 6 | `/api/v1/marketplace/*` |
| Wiki | 5 | `/api/v1/wiki/*` |
| Consultation | 3 | `/api/v1/consultations/*` |
| Admin (incl. 2FA auth) | 12 | `/api/v1/admin/*` |
| WebSocket | 5 topics | `/ws` (SockJS) |
| **Total** | **~113** | |

### Job Status State Machine

```
POSTED → AI_ANALYZED → MATCHING → ACCEPTED → EN_ROUTE → ARRIVED → IN_PROGRESS → COMPLETED
                                                                                      │
Any status ──────────────────────────────────────────────────────────► CANCELLED       │
                                                                                      │
IN_PROGRESS ──────────────────────────────────────────────────────────► DISPUTED ──────┘
```

Valid transitions (enforced by backend):
```
ACCEPTED    → EN_ROUTE      (tech taps Navigate)
EN_ROUTE    → ARRIVED       (after OTP + GPS verification)
ARRIVED     → IN_PROGRESS   (tech starts work)
IN_PROGRESS → COMPLETED     (tech completes + owner confirms or auto-confirm 24h)
Any         → CANCELLED     (with cancellation reason)
```

### Standard Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Human-readable message",
  "timestamp": "2026-10-13T10:30:00Z"
}
```

```json
{
  "success": false,
  "error": {
    "code": "JOB_004",
    "message": "Invalid job status transition",
    "details": { "current": "POSTED", "requested": "COMPLETED" }
  },
  "timestamp": "2026-10-13T10:30:00Z"
}
```

---

## 10. Backend Module Breakdown (14 Modules)

### Module 1: Auth
- OTP-based phone authentication (send OTP → verify → JWT issuance)
- RS256 JWT: access token (24h for consumers) + refresh token (30 days, UUID)
- Admin 2-step: email/password → temp 2FA token (5 min) → TOTP verify → admin JWT (30 min)
- Session management in cache (dev=in-memory, prod=Redis)
- Rate limiting: 5 OTPs per phone per hour, 3 verification attempts, account lock 30 min
- OTP strategy: dev=MockOtpProvider(123456), demo=mock for seeded phones, prod=Fast2SMS

### Module 2: User
- Profile CRUD (name, email, phone, photo, DOB, gender)
- Multiple addresses with geolocation
- Industry preference (INDUSTRIAL/AUTOMOBILE/ELECTRONICS)
- Referral code generation and tracking
- Green points and carbon credits balance

### Module 3: Technician
- Full profile with skills, certifications, service areas
- Document upload for verification (Aadhaar, PAN, certificates)
- Admin verification workflow (PENDING → APPROVED / REJECTED / RESUBMIT)
- Real-time location updates (PostGIS geography POINT)
- Availability scheduling and fatigue monitoring
- Bank account management for payouts
- Statistics dashboard (jobs completed, avg rating, earnings)

### Module 4: Job
- Complete lifecycle management (POSTED through COMPLETED)
- Multi-input fault report creation (multipart/form-data)
- 3-path resolution (choose-path, escalate, path-status endpoints)
- OTP + GPS arrival verification
- Parts used logging with prices
- AI copilot checklist integration
- Invoice generation with SHA-256 tamper-proof hash
- Dispute and cancellation handling

### Module 5: AI
- Gemini 1.5 Flash integration for multimodal fault triage
- Sound analysis (spectrogram → Gemini Vision) — Wave 3
- AI Copilot step-by-step repair checklist generation
- Cost estimation based on fault category + location + market rates
- AI negotiation assistance
- Multilingual translation

### Module 6: Matching
- PostGIS spatial queries (ST_DWithin for radius search)
- Composite scoring engine (40% distance + 60% skill match + bonuses)
- Auction mode (technicians bid with time + price) — Wave 3
- Auto-timeout after 60 seconds for unresponsive technicians

### Module 7: Payment
- Razorpay integration (test mode for dev/demo)
- Escrow: payment held until job confirmed
- Platform commission calculation (configurable %)
- GST 18% computation and recording
- Technician wallet management
- Payout processing to bank accounts
- Invoice PDF generation

### Module 8: Notification
- Firebase FCM push notifications (data + notification messages)
- SMS via OTP provider
- Email via SendGrid
- In-app notification center with read/unread state
- Mass notification for admins

### Module 9: Tracking
- WebSocket STOMP endpoints for real-time GPS
- `/topic/job/{jobId}/location` — tech location broadcasts
- `/topic/job/{jobId}/status` — job status changes
- `/queue/notifications` — user-specific notifications
- ETA calculation via Google Maps Distance Matrix API

### Module 10: Industry
- Machine registry (industrial equipment profiles)
- Vehicle registry (make, model, year, VIN, service books)
- Device registry (appliances, warranty tracking)
- Digital twin management (software-only asset history)

### Module 11: Insurance
- Micro-insurance policies per job
- Insurance claim filing and tracking
- Warranty record management
- AMC (Annual Maintenance Contract) scheduling

### Module 12: Marketplace
- Spare parts catalog with search
- Parts listings by workshop partners
- Order management (cart → order → delivery)
- Workshop profile and inventory management

### Module 13: Wiki
- Crowdsourced repair knowledge articles
- AI-curated content from completed jobs
- Category hierarchy and search
- Community voting and bookmarks

### Module 14: Admin
- 2FA authentication (email/password + TOTP)
- Platform dashboard (live stats, health score)
- Technician verification queue
- Dispute resolution panel
- Epidemic fault detection and alerts
- Feature flag management
- Mass notification sender
- Analytics and reporting

---

## 11. Security Architecture

### Authentication Layers

| User Type | Method | Token Expiry | Details |
|-----------|--------|-------------|---------|
| Owner | Phone OTP → JWT | 24h access, 30d refresh | BCrypt-hashed OTP, 10-min TTL |
| Technician | Phone OTP → JWT | 24h access, 30d refresh | Same as owner |
| Admin | Email/Password + TOTP → JWT | 30min access, 7d refresh | 5-min temp 2FA token |

### Security Measures

- **JWT:** RS256 asymmetric signing (private key signs, public key verifies)
- **OTP:** BCrypt hashed before storage, single-use, 10-minute TTL
- **Production Startup Guard (Critical):** Spring Boot fail-fast ApplicationListener throws IllegalStateException on application startup if @Profile("prod") detects MockOtpProvider, MockIdentityVerificationProvider, or any fixed OTP/identity provider beans active in production context.
- **Admin Brute-Force Lockout:** Account locks automatically for 30 minutes after 5 consecutive failed login attempts; temporary 2FA token strictly expires in 5 minutes.
- **Upload File Magic-Bytes Inspection:** Apache Tika / header magic-bytes check on every upload stream (verifies real JPEG FF D8 FF, PNG 89 50 4E 47, MP4 ftyp, etc.) to prevent spoofed MIME-types or embedded executable payloads.
- **Passwords (admin):** BCrypt with cost factor 12
- **Rate Limiting:** 5 OTPs/hour/phone, 3 verify attempts, 100 API calls/min/IP
- **RBAC:** 4 roles (OWNER, TECHNICIAN, ADMIN, SUPER_ADMIN) enforced via `@PreAuthorize`
- **Tamper Protection:** SHA-256 hash on completed job records + invoice data
- **Input Validation:** Jakarta Bean Validation on all DTOs
- **SQL Injection:** Prevented by JPA parameterized queries
- **XSS:** Content-Security-Policy headers, React auto-escapes
- **CORS:** Whitelist frontend origins only
- **File Upload:** Magic-bytes & type validation (JPEG/PNG/MP4/MP3/WAV), size limits (20MB photo, 100MB video)
- **KYC Data Privacy & DPDP Act 2023:** Aadhaar images never exposed publicly; signed 5-minute temporary URLs; auto-purge job deletes raw ID images after 30 days.
- **Audit:** All admin actions logged in audit_trail table

---

## 12. External Service Integration Strategy

| Service | dev Profile | demo Profile | prod Profile |
|---------|------------|-------------|-------------|
| **OTP/SMS** | MockOtpProvider (123456) | Mock for seeded phones | Fast2SMS/MSG91 DLT |
| **Cache** | ConcurrentMapCache | ConcurrentMapCache | Upstash Redis |
| **Maps** | Google Maps ($200 credit) | Google Maps | Google Maps |
| **Payments** | Razorpay Test Keys | Razorpay Test Keys | Razorpay Live (KYC) |
| **Push** | Console log | Firebase FCM | Firebase FCM |
| **Media** | Local /uploads folder | Cloudinary (25GB free) | Cloudinary |
| **Video** | Disabled (Coming Soon) | Agora (10K min/month) | Agora |
| **Email** | Console log | SendGrid (100/day) | SendGrid |
| **AI** | Gemini + response cache | Gemini (1M tokens/month) | Gemini |
| **Database** | Supabase (500MB free) | Supabase | Supabase Pro |

---

## 13. 6 Client Platforms

| Platform | Tech | Purpose | Wave |
|----------|------|---------|------|
| **Owner Web** | React 18 PWA + Vite + TS + Tailwind + shadcn/ui + Redux Toolkit + React Query | Fault reporting, AI triage, tracking, payments | 1 |
| **Tech Web** | React 18 + same stack | Job acceptance, status updates, earnings dashboard | 1 |
| **Admin Web** | React 18 + same stack | 2FA login, verification queue, analytics, disputes | 1 |
| **Technician App** | Flutter 3.x + Riverpod 2.x + Dio + Hive + Google Maps + FCM | Field app: GPS tracking, offline mode, camera capture | 2 |
| **Owner App** | Flutter 3.x + Riverpod 2.x | Mobile experience mirroring Owner Web | 2 |
| **Shared Package** | TypeScript | Shared types, API contracts, utility functions (React apps only) | 1 |

---

## 14. 30-Day Implementation Schedule

### Phase 1: Full Backend & Database (Days 1–12)

| Day | Tasks |
|-----|-------|
| **1** | Monorepo scaffold, Spring Boot init with Maven Wrapper, `application.yml` profiles, `SecurityConfig.java`, CORS config |
| **2** | Flyway V1–V3: Users/Auth tables, Technicians tables, Jobs tables. Entity classes for all three. |
| **3** | Flyway V4–V7: AI, Matching, Payments, Ratings tables. Entity classes. |
| **4** | Flyway V8–V14: Industry, Insurance, Marketplace, Notifications, Analytics, Wiki, Admin tables. Entity + DTOs. |
| **5** | Flyway V15–V17: Indexes, triggers, views, seed data. Auth module complete (OTP, JWT, admin 2FA). |
| **6** | User module + Technician module (CRUD, verification workflow, document upload). |
| **7** | Job module (full lifecycle, status state machine, choose-path, escalate, OTP verify). |
| **8** | AI module (Gemini integration, fault triage, copilot, cost estimation with fallback). |
| **9** | Matching module (PostGIS spatial, scoring engine, auction placeholder). |
| **10** | Payment module (Razorpay test mode, escrow, wallet, invoice PDF). Tracking module (WebSocket STOMP, live GPS). |
| **11** | Notification module (FCM, email), Rating module, Industry module (machines, vehicles, devices). |
| **12** | Admin module, Wiki module, Insurance, Marketplace. Full Postman test suite. Swagger verification. |

### Phase 2: All 3 Web Applications (Days 13–22)

| Day | Tasks |
|-----|-------|
| **13** | React project scaffolding (Vite + TS + Tailwind + shadcn/ui) for all 3 apps. Shared package with types and Axios client. |
| **14** | Owner Web: Auth screens (OTP login/signup), layout shell, routing, Redux store. |
| **15** | Owner Web: Fault report form (multi-input: photos, video, audio, text), address selection. |
| **16** | Owner Web: AI triage results screen, 3-path selection screen (Copilot / Video "Coming Soon" / Book). |
| **17** | Owner Web: AI Copilot step-by-step screen, technician list with map, booking flow. |
| **18** | Owner Web: Live tracking (Google Maps), OTP verification, job completion, payment (Razorpay), rating. |
| **19** | Tech Web: Auth, dashboard, job acceptance, status updates, earnings, profile management. |
| **20** | Admin Web: 2FA login, dashboard, technician verification, disputes, analytics charts. |
| **21** | Cross-app integration testing, error handling, loading states, empty states, responsive design. |
| **22** | Dark mode, notification center, service history, polish, bug fixes. |

### Phase 3: Mobile Apps & Final Polish (Days 23–30)

| Day | Tasks |
|-----|-------|
| **23** | Flutter project scaffolding (Riverpod 2.x, Dio, Hive, GoRouter). Shared theme + design tokens. |
| **24-25** | Technician App: Auth, job acceptance, navigation, GPS foreground service. |
| **26-27** | Technician App: OTP verification, copilot checklist, camera capture, job completion, offline sync. |
| **28** | Owner App: Auth, fault report, tracking, payment (mirror of web). |
| **29** | End-to-end integration test across all platforms. Bug fixes. |
| **30** | Demo data preparation, PBL presentation rehearsal, final deployment check. |

---

## 15. Contradictions Found & Resolved

| # | Contradiction | Resolution |
|---|--------------|-----------|
| 1 | Flutter state: PRD says Riverpod, CODING_STANDARDS Section 16 had Provider + `@riverpod` codegen | **Resolved:** Rewrote Section 16 with Riverpod 2.x (FutureProvider + AsyncNotifierProvider, no codegen) |
| 2 | Spring Boot version: PRD says 3.2, ARCHITECTURE says 3.3.x | **Resolved:** Standardized on 3.3.x, updated PRD.md |
| 3 | Build tool: PRD/IMPLEMENTATION say Maven, STRUCTURE.md lists both pom.xml and build.gradle | **Resolved:** Maven only (pom.xml). Ignore build.gradle references in STRUCTURE.md |
| 4 | Repository: STRUCTURE.md says 8 GitHub repos, workspace is single folder | **Resolved:** Single monorepo at F:\uptime |
| 5 | Feature count: PRD claims 69 features, FEATURES.md enumerates 61 | **Resolved:** Actual count is 61. PRD figure is aspirational/rounded |
| 6 | Table count: DATABASE.md overview says 141+, actual DDL has 130 | **Resolved:** 130 tables with explicit DDL. Some referenced in text lack CREATE TABLE |
| 7 | Admin auth: DATABASE.md has admin_users with password_hash, API.md had no admin login endpoints | **Resolved:** Added POST /admin/auth/login and POST /admin/auth/verify-2fa |
| 8 | Demo OTP: Various docs used 472918 | **Resolved:** Changed all to 123456 across API.md, SECURITY.md, TESTING.md |

---

## 16. All Decisions Locked

See [MEMORY.md](file:///F:/uptime/MEMORY.md) Section "Decisions Made" for the complete list of 19 locked decisions (D1–D19).

---

## 17. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **30-day timeline for 61 features** | HIGH | Strict wave prioritization. Wave 1 core features only. Wave 2/3 features can be stubbed. |
| **Upstash Redis 10K/day limit** | MEDIUM | In-memory cache for dev/demo. GPS via WebSocket not Redis. |
| **TRAI DLT blocks Twilio SMS** | HIGH | MockOtpProvider for dev/demo. Plan demo with fixed OTP. |
| **Gemini rate limits (15 RPM)** | MEDIUM | Response caching in dev. Graceful fallback to manual triage. |
| **Supabase 500MB free tier** | LOW | 130 tables with minimal test data fits easily. Monitor during Wave 2. |
| **Google Maps billing card** | MEDIUM | $200/month free credit covers demo needs. Alternative: Leaflet/OSM. |
| **1 intermediate developer building 4 frontend apps** | HIGH | Wave 1 uses web only. Flutter deferred to Wave 2. Technician uses mobile browser in Wave 1. |
| **Maven not on system PATH** | LOW | Maven Wrapper (mvnw.cmd) embedded in project. Self-contained. |
| **Gemini cannot do real FFT on raw audio** | MEDIUM | Sound analysis (Wave 3): preprocess audio to spectrogram image → feed to Gemini Vision. |
| **24-hour JWT is long for mobile theft** | LOW | Acceptable for consumer apps (auto-refresh). Admin JWT = 30 min. Add Redis blacklist for force-logout. |
