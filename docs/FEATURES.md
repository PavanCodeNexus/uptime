# UPTIME — Complete Features Documentation

> **Version:** 1.0  
> **Project:** UPTIME — AI-Assisted On-Demand Technician Dispatch Platform  
> **Total Features:** 69  
> **World-First Features:** 19  
> **Industries:** Industrial/MSME · Automobile · Electronics & Appliances  
> **Institution:** DSATM Bengaluru — VTU — 2026-27  

---

## Table of Contents

1. [Feature Overview](#1-feature-overview)
2. [Core Features — All Industries](#2-core-features--all-industries)
3. [Industrial & MSME Features](#3-industrial--msme-features)
4. [Automobile Features](#4-automobile-features)
5. [Electronics & Appliances Features](#5-electronics--appliances-features)
6. [Platform-Wide Features](#6-platform-wide-features)
7. [Virtual Repair Consultation](#7-virtual-repair-consultation)
8. [Feature Implementation Index](#8-feature-implementation-index)

---

## 1. Feature Overview

```
Total breakdown:
┌─────────────────────────────────────────────────────┐
│ Category              │ Count │ World-First          │
├───────────────────────┼───────┼──────────────────────┤
│ Industrial Core       │  12   │ 0                    │
│ Industrial Unique     │  11   │ 11                   │
│ Automobile Core       │  12   │ 0                    │
│ Automobile Unique     │   3   │ 3                    │
│ Electronics Core      │  10   │ 0                    │
│ Electronics Unique    │   5   │ 5                    │
│ Platform-Wide         │   7   │ 0                    │
│ Virtual Consultation  │   1   │ 1 (cross-industry)   │
├───────────────────────┼───────┼──────────────────────┤
│ TOTAL                 │  61*  │ 20                   │
└─────────────────────────────────────────────────────┘
* Core features shared across industries counted once
```

---

## 2. Core Features — All Industries

These 12 features exist in ALL 3 industries.
They share the same backend. UI adapts per industry.

---

### CORE-01: Multi-Input Fault Reporting

**What it is:**
Owner reports a fault using any combination of text,
voice, photos, videos, and sound recording.

**Why it matters:**
Factory workers may not be able to type clearly.
Voice input in regional languages removes barriers.
Photos give technicians visual context before arriving.

**How it works:**
```
Owner opens app → Report Fault
  ↓
Selects asset (machine / vehicle / device)
  ↓
Describes fault via ANY of:
  → Text typing (with spell check)
  → Voice input (Web Speech API / speech_to_text)
    Supported: EN, HI, KN, TA, TE, ML, MR, GU, BN
  → Photos (up to 10, compressed before upload)
  → Video (up to 2 minutes)
  → Sound recording (for machine noise analysis)
  ↓
Sets urgency: LOW / MEDIUM / HIGH / CRITICAL
  ↓
Submits → media uploaded to Cloudinary
         job record created in DB
         AI analysis triggered (async)
```

**Backend implementation:**
```java
// JobController.java
@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@PreAuthorize("hasRole('OWNER')")
public ResponseEntity<?> createJob(
    @Valid @ModelAttribute JobCreateRequest req,
    @RequestPart(required=false) List<MultipartFile> photos,
    @RequestPart(required=false) MultipartFile video,
    @RequestPart(required=false) MultipartFile audio,
    @CurrentUser Long ownerId) {

  // 1. Validate files (MIME + magic bytes + size)
  // 2. Upload to Cloudinary async
  // 3. Create job record
  // 4. Publish AI analysis to RabbitMQ
  // 5. Return job ID immediately (don't wait for AI)
}
```

**Frontend implementation:**
```tsx
// FaultReportForm.tsx
// Key components:
// → VoiceInputButton (Web Speech API)
// → MediaUploadGrid (drag+drop or tap to upload)
// → SoundRecorder (MediaRecorder API)
// → UrgencySelector (3 colored options)
```

**DB tables:** `jobs`, `job_media`

---

### CORE-02: AI Fault Triage

**What it is:**
Google Gemini 1.5 Flash analyses ALL inputs
(text + photos + audio + video) and returns:
fault category, urgency level, cost estimate,
required skills, safety warnings, diagnosis text.

**Why it matters:**
Without AI: wrong technician sent → 30% of jobs.
With AI: right specialist matched every time.
Saves owner time, saves technician wasted trips.

**How it works:**
```
All media uploaded to Cloudinary
  ↓
RabbitMQ consumer picks up AI task
  ↓
GeminiService builds prompt:
  System: fault_triage_v1.txt
  User:   description + media URLs + industry + asset type
  ↓
Gemini API called (gemini-1.5-flash)
  → Input: text + images + audio (multi-modal)
  → Temperature: 0.1 (deterministic)
  → Response: JSON only
  ↓
Response parsed into DiagnosisDTO:
  {
    faultCategory:     "Motor Bearing Failure"
    urgency:           "HIGH"
    confidence:        0.87
    estimatedCostMin:  800.00
    estimatedCostMax:  1500.00
    skillTags:         ["motor_repair","bearing_replacement"]
    requiredTools:     ["bearing_puller","multimeter"]
    diagnosisText:     "Based on sound recording..."
    safetyWarnings:    ["disconnect_power_first"]
    diyPossible:       false
  }
  ↓
Stored in ai_fault_diagnoses table
Job updated with ai_fault_category + skill_tags
Owner notified via WebSocket + push
```

**Fallback if Gemini fails:**
```java
try {
  diagnosis = geminiService.analyse(input);
} catch (AIServiceException e) {
  // Job NOT blocked — owner enters manually
  diagnosis = DiagnosisDTO.fallback(industry);
  diagnosis.setFallback(true);
}
// Job creation always succeeds
```

**DB tables:** `ai_fault_diagnoses`, `ai_prompt_versions`

---

### CORE-03: Smart Technician Matching

**What it is:**
Algorithm ranks all nearby technicians by a
composite score (40% distance + 60% skill match)
with bonus modifiers for rating, experience, response time.

**Why it matters:**
Simple "nearest available" misses skill fit.
A great motor specialist 5km away beats a
general mechanic 0.5km away for motor repair.

**How it works:**
```
Matching triggered after AI diagnosis
  ↓
PostGIS spatial query:
  → Find all technicians within 20km
  → Filter: verified + available + not fatigue-restricted
  → Must have at least 1 matching skill tag
  ↓
ScoringEngine calculates score for each:

  distance_score:
    < 2km  → 100    2-5km  → 80
    5-10km → 60     10-20km → 40    > 20km → 20

  skill_score:
    All tags match   → 100   >50% match → 70
    >25% match       → 40    Any match  → 20
    No match         → 0 (excluded)

  base_score = distance_score × 0.40 +
               skill_score × 0.60

  modifiers:
    rating > 4.5  → +10    jobs > 100 → +5
    rating > 4.0  → +5     resp < 2min → +5
    (Note: Technicians with is_fatigue_restricted = TRUE are strictly
     filtered out of the matching query (AND is_fatigue_restricted = FALSE)
     and NEVER reach the scoring function)

  final = min(100, max(0, base + modifiers))
  ↓
Top 10 returned sorted by score DESC
Stored in matching_scores table
Owner sees ranked list with ETA + cost estimate
```

**DB tables:** `matching_requests`, `matching_scores`

---

### CORE-04: Live GPS Tracking

**What it is:**
After technician accepts job, owner sees tech's
exact location on Google Maps updating in real-time,
with ETA countdown showing minutes to arrival.

**Why it matters:**
"Where is my technician?" is the #1 owner complaint
in all repair platforms. Real-time tracking = trust.

**How it works:**
```
Tech accepts job → foreground GPS service starts
  ↓
Flutter (tech app):
  geolocator stream → every 5 seconds
  → sends via WebSocket to Spring Boot:
    {jobId, lat, lng, speed, heading, battery}
  ↓
Spring Boot WebSocketHandler:
  → stores to live_location_tracking (partitioned)
  → updates technician_locations (current position)
  → calls Google Maps Distance Matrix API → ETA
  → broadcasts to owner via STOMP topic:
    /topic/job/{jobId}/location
    {lat, lng, etaMins, distanceKm}
  ↓
Owner React/Flutter:
  → subscribed to STOMP topic
  → Google Maps marker moves smoothly
  → ETA display updates
  → "2 minutes away!" alert at ETA = 2
```

**Battery optimisation:**
```
EN_ROUTE:     update every 5 seconds
AT_SITE:      update every 30 seconds
LOW_BATTERY:  update every 15 seconds (< 20%)
```

**DB tables:** `live_location_tracking` (partitioned),
`technician_locations`

---

### CORE-05: OTP + GPS Arrival Verification

**What it is:**
When technician arrives, two independent checks confirm:
1. OTP: owner shows 6-digit code → tech enters it
2. GPS: tech's location must be within 500m of job site

**Why it matters:**
Without this: tech marks "arrived" from home.
Fraudulent arrivals are prevented with two layers.
Both must pass — either alone is insufficient.

**How it works:**
```
Tech taps "I've Arrived" in Flutter app
  ↓
Spring Boot generates 6-digit OTP:
  SecureRandom.nextInt(900000) + 100000
  → Hashed + stored in Redis (10 min TTL)
  → Sent to owner via SMS + push notification
  ↓
Owner sees OTP on screen (large digits)
Owner shows it to technician face-to-face
  ↓
Tech enters OTP in app
  ↓
Spring Boot verifies:
  Check 1: BCrypt.verify(enteredOTP, storedHash)
  Check 2: ST_DWithin(techLocation, jobLocation, 500)
             (PostGIS: must be within 500 meters)
  ↓
  BOTH must pass → job status = ARRIVED
  Either fails   → error returned, job NOT updated
```

**Security measures:**
```
→ OTP deleted from Redis after single use
→ Max 3 entry attempts (then new OTP needed)
→ GPS cannot be faked easily (device location)
→ Face-to-face OTP exchange prevents remote fraud
→ All verifications logged in job_otp_verifications
```

**DB tables:** `job_otp_verifications`

---

### CORE-06: AI Repair Checklist (Copilot)

**What it is:**
During repair, AI guides technician step-by-step
with instructions, tool requirements, safety warnings,
and photo capture at each step to verify completion.

**Why it matters:**
Junior technicians miss steps. Senior techs get lazy.
AI guide ensures consistent, complete repairs every time.
Photos create audit trail for disputes.

**How it works:**
```
Job status changes to IN_PROGRESS
  ↓
AI Copilot session created for job
Gemini generates step plan for fault category:
  → Uses copilot_step_v1.txt prompt
  → Input: fault_category + asset_type + industry
  → Output: ordered list of repair steps
  ↓
Tech sees Step 1 on screen:
  Title: "Isolate power supply"
  Instruction: "Turn off main breaker..."
  Safety: "Use LOTO procedure"
  Tool: "Lockout kit"
  Expected: "LED indicators all off"
  Photo required: YES
  ↓
Tech taps camera → takes photo → submits
  ↓
Gemini vision verifies photo matches expected state:
  → If verified: advance to Step 2
  → If not: show warning + allow override
  ↓
Repeat for all steps
  ↓
All steps complete → job can be marked complete
```

**Backend:**
```java
// RepairCopilotService.java
public CopilotStepDTO getNextStep(Long jobId) {
  AICopilotSession session = sessionRepo.findByJobId(jobId);
  int nextStep = session.getCurrentStep() + 1;
  // Generate step from Gemini if not cached
  // Or return pre-generated steps
  return steps.get(nextStep - 1);
}
```

**DB tables:** `ai_copilot_sessions`, `ai_copilot_steps`

---

### CORE-07: Two-Way Rating System

**What it is:**
After job completion, BOTH owner rates technician AND
technician rates owner. Ratings are BLIND — neither
sees the other's rating until both have submitted.

**Why it matters:**
One-sided rating is unfair. Techs also deal with
difficult owners (late payment, unreasonable demands).
Blind rating prevents retaliation/bias.

**How it works:**
```
Job marked COMPLETED
  ↓
Both parties get push notification:
  "Rate your experience — expires in 48 hours"
  ↓
Owner rates: 1-5 stars + categories:
  Punctuality, Quality, Behaviour, Cleanliness
  Optional text review
  ↓
Tech rates: 1-5 stars + categories:
  Cooperation, Payment, Safety, Clarity
  ↓
BLIND: Both ratings hidden until BOTH submitted
  (prevents retaliation)
  ↓
After both submit (or 48h timer expires):
  Ratings published
  Trust scores recalculated:
    Weighted rolling average of last 50 ratings
  Technician rating_avg updated (DB trigger)
```

**DB tables:** `job_ratings`, `rating_categories`,
`technician_trust_scores`, `owner_trust_scores`

---

### CORE-08: Service History Dashboard

**What it is:**
Complete permanent record of all repairs for each
asset — timeline, costs, parts replaced, technicians,
health score trends, downtime hours, total spent.

**Why it matters:**
Factory owners cannot remember what was repaired 2 years ago.
Digital history = better maintenance planning,
warranty tracking, insurance claims, resale value.

**How it works:**
```
Every completed job automatically updates:
  → machine_service_history (or vehicle/device)
  → digital_twins.total_repairs + total_cost
  → digital_twins.health_score (recalculated)
  ↓
Owner sees on asset detail page:
  → Timeline view (newest first)
  → Each entry: date, fault, tech, cost, parts
  → Health score chart over time
  → Total downtime hours
  → Total spent on repairs
  → Average repair interval
  → Next service prediction
```

**DB tables:** `machine_service_history`,
`vehicle_service_history`, `device_service_history`

---

### CORE-09: AI Cost Estimator

**What it is:**
Before booking, owner sees a transparent cost range
(min to max) based on fault category, industry,
city, and historical job data.

**Why it matters:**
"Bill shock" is the #1 cause of disputes.
Transparent estimate builds trust before booking.

**How it works:**
```
Part of AI Fault Triage response:
  estimatedCostMin: 800.00
  estimatedCostMax: 1500.00
  ↓
Gemini calculates from:
  → Fault category + severity
  → Average historical costs for same fault
  → City (tier-1 vs tier-2 pricing)
  → Parts typically needed
  → Average labour time
  ↓
Shown on UI as range: "₹800 – ₹1,500"
Owner can see breakdown: labour + parts estimate
  ↓
Final invoice must be within reason of estimate
If tech charges > 20% above estimate → flagged for review
```

---

### CORE-10: Technician Verification System (KYC + Skill Proof)

> **Specification Reference:** See [TECHNICIAN_VERIFICATION.md](file:///F:/uptime/TECHNICIAN_VERIFICATION.md) for full design contract, identity provider strategy, Aadhaar vault rules, matching gates, and admin SLA.

**What it is:**
Multi-tier verification system ensuring every technician on UPTIME has verified identity (L1), verified trade skills or provisional field assessment (L2 / L2-P), and mandatory state licences for regulated trades (L3).

**Verification Levels & Gating:**
- **Level 0 (Registered):** Phone OTP verified. Cannot view or receive any customer jobs.
- **Level 1 (Identity Verified):** Aadhaar QR/Offline e-KYC/DigiLocker + 3D liveness selfie + age (18+) + duplicate check. Cannot accept solo jobs.
- **Level 2 (Skill Verified):** At least one trade verified via ITI/diploma, manufacturer certification, apprenticeship, workshop endorsement, or UPTIME skill test. Eligible for standard jobs in that trade.
- **Level 2-P (Provisional):** Informal technicians with 3+ years experience, 2 trade references, and UPTIME skill test pass. Gated to jobs <= ₹3,000, max 2 active jobs/day, mandatory first-3-job photo audit. Disqualified from regulated trades.
- **Level 3 (Licenced / Master):** Statutory licence verified (Wireman Licence, Boiler Attendant, EV High-Voltage, HVAC F-Gas). Required for dangerous/regulated industrial jobs.

**Matching & Dispatch Enforcement:**
- Level 0 and Level 1 technicians are completely excluded from matching queries.
- Skills matched per-trade: A technician verified for Automobile cannot receive Industrial Electrical jobs.
- Expired licences or overdue re-verification automatically moves status to SUSPENDED.

**DB tables:** 	echnicians, 	echnician_documents, 	echnician_identity_verifications, 	echnician_trade_verifications, 	echnician_skill_test_attempts, 	echnician_references, 	echnician_kyc_audit_log (Flyway V18).

---

### CORE-11: Admin Analytics Dashboard

**What it is:**
Real-time command center for platform team showing:
live job map, active technicians, revenue, disputes,
epidemic alerts, platform health score.

**How it works:**
```
Admin web app connects to:
  → REST API for historical data
  → WebSocket for live updates (/topic/admin/live)
  ↓
PlatformHealthScheduler runs every 10 minutes:
  Calculates composite health score (0-100):
  → Active tech ratio × weight
  → Job success rate × weight
  → AI accuracy × weight
  → Dispute rate × weight
  → Payment success × weight
  → App crash rate × weight
  ↓
Admin dashboard shows:
  → Live jobs map (Google Maps + pins)
  → Online technicians count
  → Jobs today, revenue today
  → Pending verifications (action required)
  → Open disputes (action required)
  → Epidemic alerts (if active)
  → Health score gauge
```

**DB tables:** `platform_analytics`, `platform_health_scores`

---

### CORE-12: Repair Time Auction

**What it is:**
For CRITICAL urgency jobs, all nearby technicians
are notified simultaneously. A bonus amount starts
at ₹0 and increments every 2 minutes until someone
accepts. First tech to accept wins the job + bonus.

**Why it matters:**
Emergency response time reduced from 30+ minutes
to under 10 minutes. Gamification drives speed.

**How it works:**
```
Job urgency = CRITICAL OR no acceptance in 5 mins
  ↓
AuctionService starts:
  base_amount: job estimated cost
  current_bonus: 0
  increment: ₹50 every 2 minutes
  max_bonus: ₹500
  ↓
FCM sends to top 12 nearby techs:
  "🏁 AUCTION JOB — ₹1,000 + ₹0 bonus
   First to accept wins!"
  ↓
All techs see AuctionScreen:
  Live bonus counter: ₹0 → ₹50 → ₹100 → ...
  "4 techs competing"
  Countdown timer
  [ACCEPT NOW →] button
  ↓
First tech to tap ACCEPT:
  → Wins job + current bonus
  → Other techs notified "Job taken"
  ↓
AuctionBonusHistory logged for analytics
```

**DB tables:** `job_auction`, `job_auction_bids`,
`auction_bonus_history`

---

## 3. Industrial & MSME Features

### 11 Unique / World-First Features

---

### IND-U01: AI Repair Copilot ⭐ WORLD FIRST

**What it is:**
AI acts as a live repair guide on the technician's
screen during repair — like GPS navigation but for
fixing machines. Step-by-step, photo-verified,
with safety warnings.

**What makes it world-first:**
No platform in India or globally provides AI-guided
repair assistance during an active field job with
photo verification at each step.

**Full implementation:**
```
Covered in CORE-06 above.
Additional industrial-specific steps:
→ Machine lockout/tagout procedure (LOTO)
→ Electrical isolation verification
→ Pressure release verification
→ Calibration steps post-repair
→ Test run procedure with observation checklist
```

**Backend files:**
```
modules/ai/RepairCopilotService.java
modules/ai/AICopilotSession.java (entity)
modules/ai/AICopilotStep.java (entity)
modules/ai/AIController.java
  GET  /ai/copilot/{jobId}
  POST /ai/copilot/{jobId}/next
```

---

### IND-U02: Machine Sound Analysis ⭐ WORLD FIRST

**What it is:**
Owner records machine operating sound (10-60 seconds).
AI analyses the audio waveform using FFT (Fast Fourier
Transform) pattern recognition to identify fault type
without any physical inspection.

**What makes it world-first:**
Using AI audio analysis for machine fault detection
in an on-demand repair dispatch platform.
Industrial IoT companies charge lakhs for hardware
that does similar analysis.

**How it works:**
```
Owner taps mic icon on fault report screen
  ↓
Records machine sound (10–60 seconds)
Audio file: MP3/WAV, max 20MB
  ↓
Uploaded to Cloudinary
  ↓
POST /ai/sound-analysis with audio URL
  ↓
GeminiService sends audio to Gemini:
  Prompt: sound_analysis_v1.txt
  "Analyse this industrial machine audio.
   Identify fault patterns from sound characteristics.
   Common faults: bearing failure (grinding at 2400Hz),
   belt slip (squealing), motor imbalance (vibration),
   gear wear (clicking pattern)..."
  ↓
Gemini returns:
  faultType:          "Bearing Failure"
  severity:           "HIGH"
  confidence:         0.82
  frequencyAnomaly:   "Grinding at 2400-2800 Hz"
  description:        "FFT analysis shows characteristic..."
  recommendedAction:  "Immediate bearing replacement"
  ↓
Shown in AI diagnosis alongside text analysis
Added to skill_tags for matching
```

**Frontend:**
```tsx
// SoundRecorder.tsx
// Uses: MediaRecorder API (web)
//       record package (Flutter)
// Shows: waveform visualisation (Canvas)
// Sends: POST /ai/sound-analysis
```

**DB tables:** `ai_sound_analyses`

---

### IND-U03: Digital Twin (No IoT Required) ⭐ WORLD FIRST

**What it is:**
AI creates a virtual copy (digital twin) of each machine
that tracks health score, component states, repair
history, and predicts future failures — WITHOUT any
expensive IoT hardware sensors.

**What makes it world-first:**
Digital twins traditionally require expensive IoT
sensor hardware (₹50,000+). UPTIME creates them
purely from repair data and AI analysis.

**How it works:**
```
Machine added to UPTIME
  ↓
digital_twins record created:
  health_score: 100 (starts perfect)
  components: [motor, bearings, belts, gear, pump...]
  ↓
Every completed repair job:
  → DB trigger: update digital_twin
    total_repairs + 1
    total_repair_cost += job.final_cost
    health_score recalculated
  ↓
RepairPredictionScheduler (2 AM daily):
  → For each machine with ≥ 3 repairs:
  → Sends history to Gemini:
    "Analyse this machine's repair history.
     Based on frequency and type of repairs,
     predict next likely failure and date."
  → Gemini returns predictions array
  → Stored in repair_predictions table
  ↓
Owner sees on Digital Twin page:
  → Health gauge (0-100%) with colour zones
  → Component health grid (each part separately)
  → Prediction timeline (future failure dates)
  → "Preventive maintenance saved you ₹12,400"
  → Cost comparison: reactive vs preventive
```

**DB tables:** `digital_twins`, `digital_twin_components`,
`repair_predictions`

---

### IND-U04: AI Negotiation Assistant ⭐ WORLD FIRST

**What it is:**
Before payment, if owner thinks tech's quoted price
is too high, AI acts as independent price referee.
Shows market rates, flags overcharging, guides
fair counter-offers for both parties.

**What makes it world-first:**
No repair platform has AI-mediated price negotiation.

**How it works:**
```
Tech submits final cost quote
Owner disputes the price
  ↓
POST /ai/negotiate
Input:
  fault_category, industry, city
  tech_asked_price, owner_offered_price
  parts_required, historical_job_data
  ↓
Gemini analyses:
  → Average cost for this fault in this city
  → Typical parts cost
  → Typical labour hours
  → Market comparison
  ↓
Returns:
  minFairPrice: 900.00
  maxFairPrice: 1400.00
  verdict: "TECH_SLIGHTLY_HIGH" or "FAIR" or
           "OWNER_TOO_LOW" or "OVERPRICED"
  breakdown: {labour: 600, parts: 450, market: 1050}
  recommendation: "Suggest ₹1,100 as fair middle ground"
  ↓
Both parties see AI verdict on screen
Platform enforces: final price must be in fair range
  (or both must agree to override)
```

**DB tables:** `job_negotiations`

---

### IND-U05: Repair Pattern Prediction ⭐ WORLD FIRST

**What it is:**
AI analyses completed jobs PLATFORM-WIDE to detect
patterns in machine failures across all users.
Predicts breakdowns 2-4 weeks before they happen,
warns owners to schedule preventive maintenance.

**What makes it world-first:**
Using crowd-sourced repair data for predictive
maintenance without any hardware sensors.

**How it works:**
```
RepairPredictionScheduler runs at 2 AM daily
  ↓
For each active digital twin:
  Fetch: all historical jobs for this asset
  Fetch: similar faults on same machine type (platform-wide)
  ↓
POST to Gemini with prediction prompt:
  "Machine: CNC Lathe, Brand: DMG Mori
   Repair history: [last 12 repairs with dates, faults, costs]
   Platform data: [average repair intervals for CNC Lathes]
   Predict: next 3 likely faults with probability + dates"
  ↓
Gemini returns predictions:
  [{
    predictedFault: "Spindle Bearing Wear"
    probability:    0.76
    predictedDate:  "2026-11-28"
    estimatedCost:  4500.00
    recommendation: "Schedule bearing inspection in 2 weeks"
  }]
  ↓
Stored in repair_predictions
  ↓
Push notification to owner:
  "⚠ Your CNC Lathe may need spindle inspection
   in 18 days. Schedule now to avoid ₹12,000
   emergency repair cost."
  ↓
Owner clicks → pre-scheduled job created
```

**DB tables:** `repair_predictions`

---

### IND-U06: Tamper-Proof Job Records ⭐ WORLD FIRST

**What it is:**
Every completed job record is cryptographically
locked using SHA-256 hashing. Any modification to
the record (cost, description, technician) would
change the hash — making tampering detectable.
Records are legally admissible as court evidence.

**What makes it world-first:**
No Indian repair platform provides legally
admissible, tamper-proof service records.

**How it works:**
```
Job marked COMPLETED
  ↓
TamperProofService.lockJob(job):
  1. Build canonical string from all job fields:
     id|jobNumber|ownerId|techId|fault|cost|completedAt
  2. SHA-256 hash:
     hash = SHA256(canonical_string)
  3. Store: job.hash_value = hash
  4. Lock: job.is_tamper_proof_locked = TRUE
  5. Also hash the invoice PDF
  ↓
Certificate PDF generated:
  → Contains job hash embedded
  → "This record is cryptographically verified"
  → Download + share
  ↓
Verification (anytime):
  GET /jobs/{id}/verify
  → Recomputes hash from current DB values
  → Compares with stored hash
  → MATCH: "Record verified ✓"
  → MISMATCH: "⚠ Record may have been tampered"
```

**Stored in:**
```
jobs.hash_value              (VARCHAR 64)
jobs.is_tamper_proof_locked  (BOOLEAN)
invoices.hash_value          (VARCHAR 64)
tamper_proof_verifications   (audit table)
```

---

### IND-U07: OTP + GPS Dual Verification ⭐ WORLD FIRST

Already explained in CORE-05.
Additional industrial context:

```
Factory-specific additions:
→ Guard at factory gate gets SMS OTP
  (owner configures: "notify security")
→ Tech must enter factory premises GPS zone
  (factory address is geo-fenced)
→ For large factories: multiple arrival zones
  (Main gate, Shop Floor A, Bay 3)
→ Photo of gate check-in optional (security)
```

---

### IND-U08: Micro-Insurance Per Job ⭐ WORLD FIRST

**What it is:**
Every job automatically generates a micro-insurance
policy that covers repair failure, tech-caused damage,
and parts failure — at ₹0 additional cost (covered
by platform commission on premium jobs).

**What makes it world-first:**
First platform in India to offer per-job insurance
for MSME equipment repair.

**How it works:**
```
Job created with HIGH or CRITICAL urgency
  ↓
MicroInsuranceService.createForJob(job):
  Tier based on job value:
    < ₹500:  BASIC   (covers failed repair ₹500)
    ₹500-2k: STANDARD (covers damage ₹5,000)
    > ₹2k:   PREMIUM (covers parts failure ₹10,000)
  ↓
job_micro_insurance record created:
  coverageAmount: 5000.00
  coverageDays:   30
  expiresAt:      now + 30 days
  ↓
After job completion:
  → Policy certificate in job details
  → "This repair is insured for 30 days"
  → If repair fails within 30 days:
    → FREE redo by same tech
    → Or insurance payout from platform
```

**DB tables:** `job_micro_insurance`

---

### IND-U09: Skill NFT Badges ⭐ WORLD FIRST

**What it is:**
Technicians earn blockchain-verified skill badges on
Polygon network. Unlike paper certificates, NFT badges
are portable, permanent, unforgeable, and visible to
all future employers and customers.

**What makes it world-first:**
First use of blockchain skill credentials in the
Indian repair/maintenance industry.

**How it works:**
```
Tech completes milestone:
  → 50 jobs completed in motor_repair
  → 100 jobs completed
  → 5-star rating 20 times in a row
  → etc.
  ↓
BadgeService.checkAndAward(techId):
  → Checks all badge criteria
  → Creates technician_badges record
  → Shows badge in app immediately
  ↓
NftService.mintBadge(badge):
  → Calls Polygon blockchain via Alchemy API
  → Mints ERC-721 NFT to tech's wallet
  → Stores: token_id, transaction_hash
  ↓
Tech shares badge:
  → Shows on profile with blockchain link
  → "Verify on Polygon" → opensea.io link
  → QR code for scanning
  → Can put on resume/LinkedIn
```

**DB tables:** `technician_badges`, `nft_transactions`

---

### IND-U10: Crowd-Sourced Repair Wiki ⭐ WORLD FIRST

**What it is:**
Every completed job automatically contributes to
a world-first repair knowledge base. AI extracts
the fault, fix steps, parts used, and tools needed
and adds it to the wiki. Grows smarter with every repair.

**What makes it world-first:**
No existing repair encyclopedia is built from
real-world, verified repair job data.

**How it works:**
```
Job marked COMPLETED
  ↓
WikiExtractionService (async via RabbitMQ):
  → Sends job data to Gemini:
    "Extract repair knowledge from this job:
     Fault: motor bearing failure
     Fix: [8 copilot steps]
     Parts: motor capacitor 220uF
     Tech notes: grinding noise at startup..."
  → Gemini returns structured wiki article
  ↓
WikiService.createOrUpdate(article):
  → Check if similar article exists (same fault + model)
  → If exists: add new method variant
  → If new: create new article
  → Mark as unverified initially
  ↓
Admin reviews in wiki moderation queue
  → Approve → published
  → Edit → refine + publish
  ↓
Wiki grows with every repair:
  "How to replace CNC motor bearings"
  "Samsung Galaxy S23 screen replacement"
  "Carrier AC gas refilling procedure"
  India-specific notes added automatically:
    monsoon season tips, power fluctuation notes
```

**DB tables:** `wiki_articles`, `wiki_versions`,
`wiki_contributions`

---

### IND-U11: Virtual Repair Consultation

Covered in detail in Section 7 (cross-industry feature).

---

## 4. Automobile Features

### 12 Core Features

---

### AUTO-C01: Roadside SOS Emergency

**What it is:**
Single red button on the home screen triggers
immediate emergency job posting. All nearby
mechanics notified simultaneously. Auction starts.

**How it works:**
```
Driver taps RED SOS button
  ↓
Confirmation dialog: "Post emergency job?"
  (prevents accidental taps)
  ↓
Confirmed → POST /jobs with:
  urgency: CRITICAL
  jobType: EMERGENCY
  location: current GPS
  industry: AUTOMOBILE
  faultDescription: "Emergency roadside breakdown"
  ↓
Auction starts immediately (no wait for AI):
  → 12 nearest mechanics notified at once
  → Bonus starts at ₹0 → increments ₹100 every 3 mins
  → First to accept wins
  ↓
Driver sees: live map with all accepting mechanics
              winner shown when accepted
              ETA countdown starts
```

---

### AUTO-C02: AI Dashboard Warning Reader

**What it is:**
Driver photographs the dashboard warning light.
AI identifies the light and explains:
what it means, severity, is it safe to drive,
what action to take.

**How it works:**
```
Owner taps "Read Warning Light"
  ↓
Opens camera → photos dashboard light
  ↓
POST /ai/analyse-image with:
  purpose: "DASHBOARD_WARNING"
  vehicleType, brand, model, year
  ↓
Gemini vision identifies:
  → Engine warning (🔴 Stop immediately)
  → Oil pressure (🔴 Stop now, serious damage risk)
  → Battery (🟡 Drive to service, OK for now)
  → Tyre pressure (🟡 Check tyres, OK to drive)
  → Service due (🟢 Schedule service soon)
  ↓
Returns:
  warningType:     "OIL_PRESSURE"
  severity:        "CRITICAL"
  isSafeToaDrive:  false
  explanation:     "Your oil pressure is dangerously low.
                    Stop engine immediately..."
  immediateAction: "Pull over safely, turn off engine"
  nextStep:        "Call for recovery vehicle"
  ↓
CTA shown: [Book Emergency Recovery] [Call AA]
```

---

### AUTO-C03: Smart Workshop Booking

**What it is:**
Book time slots at verified workshops. See real-time
availability, track vehicle status while at workshop,
get WhatsApp updates on progress.

**How it works:**
```
Owner selects "Book Workshop Service"
  ↓
Shows workshops within 20km:
  → Rated, verified, speciality shown
  → Real-time available slots (calendar)
  ↓
Owner books slot:
  → Date + time + service type
  → Vehicle details auto-filled
  ↓
Workshop gets notified (tech web + SMS)
  ↓
On service day:
  → Owner drops vehicle
  → Workshop tech updates status:
    "Vehicle received" → "Diagnosis" →
    "Repair in progress" → "Ready for pickup"
  → Owner gets WhatsApp message at each step
  ↓
Pickup: OTP verification (same as field jobs)
```

---

### AUTO-C04: Vehicle Digital Twin

Same as IND-U03 but for vehicles.

```
Extra vehicle-specific components tracked:
  Engine, Transmission, Brakes, Tyres,
  Battery, AC, Electrical, Body & Paint,
  Fuel System, Suspension

Extra predictions:
  → Tyre rotation due (based on km)
  → Oil change due (based on km + time)
  → Brake pad wear (based on driving pattern)
  → Insurance renewal (based on expiry date)
  → PUC renewal (based on expiry date)
```

---

### AUTO-C05: Mechanic Race (Auction)

Same as CORE-12 but automobile-specific UI.

```
Automobile-specific auction features:
  → Shows mechanic's vehicle type speciality
    (4-wheeler, 2-wheeler, heavy vehicle)
  → Shows towing capability (if breakdown)
  → Shows EV certification (if EV)
  → Distance shown in real-time (updates live)
```

---

### AUTO-C06: EV Specific Support

**What it is:**
Dedicated features for Electric Vehicle owners:
EV-certified mechanics only, battery health analysis,
charging station finder, mobile charging van dispatch.

**How it works:**
```
Vehicle type = ELECTRIC
  ↓
Matching filters:
  → Only EV-certified technicians shown
  → Badge: "EV Certified" on tech profile
  ↓
EV-specific features:
  Battery health display:
    → Current capacity vs original
    → Range estimate
    → Degradation rate
    → Replacement prediction
  ↓
  Charging finder:
    → Google Maps overlay showing:
      Tata Power, BPCL, Charge Zone stations
      Real-time availability (if API available)
      Compatible connector types
  ↓
  Mobile charging van (future):
    → Emergency charging dispatch
    → Like fuel delivery but for EVs
```

---

### AUTO-C07: Insurance Claim Assistant

**What it is:**
AI guides driver through accident/damage insurance
claim process: evidence collection, form filling,
document checklist, claim tracking.

**How it works:**
```
Owner taps "File Insurance Claim"
  ↓
AI claims wizard:
  Step 1: Incident details
    → Date, time, location
    → Type: accident, theft, flood, fire
  Step 2: Evidence collection
    → Photo checklist: damage photos, FIR, spot photos
    → AI checks: "Need clearer damage photo of front-left"
  Step 3: Form filling
    → AI auto-fills claim form from photos + inputs
    → Owner reviews + signs digitally
  Step 4: Submit
    → Submitted to insurer via UPTIME
    → Claim number generated
  Step 5: Track
    → Status updates: Filed → Under Review →
                       Approved → Settlement
    → WhatsApp notifications at each step
```

---

### AUTO-C08: Tyre & Fuel Service

**What it is:**
Mobile tyre repair van dispatch + emergency fuel
delivery to exact GPS location. For roadside emergencies.

**How it works:**
```
Tyre service:
  Owner taps "Flat Tyre"
  → Nearest mobile tyre van dispatched
  → Tech has portable compressor + spare tyres
  → Same tracking/OTP as regular job

Fuel delivery:
  Owner taps "Need Fuel"
  → Select fuel type (petrol/diesel/CNG/EV)
  → Nearest fuel delivery bike dispatched
  → Standard quantities: 2L / 5L / 10L
  → Price: market rate + ₹50 delivery
  → Same tracking as regular job
```

---

### AUTO-C09: Driver Safety Score

**What it is:**
Phone sensors (accelerometer + gyroscope) analyse
driving behaviour: hard braking, sharp corners,
phone usage, speeding. Score affects insurance discount.

**How it works:**
```
Driver enables "Safety Monitoring" in app
  ↓
During drive:
  Flutter uses: sensors_plus package
  Analyses every 100ms:
    → Acceleration > 0.3g = harsh acceleration
    → Deceleration > 0.4g = hard braking
    → Lateral > 0.3g = sharp corner
    → Phone motion while moving = phone usage
    → GPS speed > limit = speeding
  ↓
After trip:
  Score calculated (0-100):
    Speed:        × 25%
    Braking:      × 25%
    Acceleration: × 20%
    Cornering:    × 15%
    Phone usage:  × 15%
  ↓
Stored in driver_safety_scores
Monthly average displayed
Insurance discount: score > 85 → 5% discount
```

---

### AUTO-C10: Fleet Management

**What it is:**
Corporate fleet operators manage multiple vehicles
centrally: maintenance scheduling, cost tracking,
driver assignment, compliance (insurance, PUC).

**How it works:**
```
Business account created (is_fleet = true)
  ↓
Fleet dashboard:
  → All vehicles listed with health scores
  → Upcoming services across all vehicles
  → Cost summary: this month vs last month
  → Document expiry calendar (all vehicles)
  → Driver assignments (who drives what)
  ↓
Bulk operations:
  → Schedule all vehicles for annual service
  → Export cost report (CSV/PDF)
  → Renewal reminders for all vehicles
  → PUC camp booking (mobile camp comes to you)
```

---

### AUTO-C11: Traffic Fine Manager

**What it is:**
View, pay, and contest traffic challans. Get
reminders before license/RC/insurance expiry.

**How it works:**
```
Owner adds vehicle registration
  ↓
UPTIME checks Vahan + Parivahan APIs:
  → Pending challans amount
  → Challan types (speed, signal, parking)
  ↓
Reminder system:
  30/7/1 days before:
    Insurance expiry → "Renew before 15th Oct"
    PUC expiry       → "PUC expired! Book now"
    RC renewal       → "Renewal due Oct 2026"
    Fitness cert     → (for commercial vehicles)
  ↓
Contest challan:
  → Upload evidence photos
  → AI drafts contest letter
  → Submit online via UPTIME
```

---

### AUTO-C12: Fuel Station Locator

**What it is:**
Real-time map showing fuel stations filtered by
vehicle's fuel type (petrol/diesel/CNG/EV charging).

**How it works:**
```
Taps "Find Fuel Station"
  → Gets current GPS location
  → Google Maps Places API query:
    type: gas_station + vehicle fuel type
  → Shows pins on map with:
    Name, distance, open/closed status
    For EV: connector type, available slots
  → Navigate button → opens Google Maps
```

---

### 3 Unique Automobile Features

---

### AUTO-U01: Engine Sound Fingerprint ⭐ WORLD FIRST

**What it is:**
AI learns YOUR specific engine's unique sound
baseline when healthy. Every subsequent recording
is compared against YOUR baseline — detecting
0.1% deviation weeks before any visible symptom.

**What makes it world-first:**
Personalized acoustic baseline per individual vehicle —
no other consumer app does this.

**How it works:**
```
Owner records engine cold start (first time):
  → 30-second recording in quiet environment
  → Uploaded to Cloudinary
  → Gemini analyses: creates frequency baseline
  → Stored in engine_fingerprints table:
    {baseline_url, frequency_data, harmonics, cylinders}
  ↓
Every subsequent recording compared to baseline:
  POST /ai/sound-analysis with:
    type: ENGINE_FINGERPRINT
    vehicleId: 123
    audioUrl: new_recording
  ↓
  Gemini compares against stored baseline:
  → health_match_percentage: 94.5%
  → deviation_detected: "Slight roughness at idle"
  → severity: "LOW — monitor weekly"
  ↓
  If deviation > 5%: push alert
    "⚠ Your Honda City engine sounds different
     from baseline. Get checked soon."
  If deviation > 15%: urgent alert
    "🔴 Significant engine sound change detected"
```

**DB tables:** `engine_fingerprints`

---

### AUTO-U02: Vehicle Mood Score ⭐ WORLD FIRST

**What it is:**
Daily AI analysis of 50+ vehicle parameters gives
a "mood" score: EXCELLENT/HAPPY/NEUTRAL/UNHAPPY/STRESSED/CRITICAL.
Answers: "Is my vehicle safe to drive today?"

**What makes it world-first:**
No app gives a daily holistic vehicle health
assessment without OBD hardware.

**How it works:**
```
VehicleMoodScheduler runs daily at 6 AM:
  Collects data sources:
    → Last service date + mileage since service
    → Insurance/PUC expiry status
    → Recent fault reports
    → Fuel consumption trend (from fuel logs)
    → Driver safety score trend
    → Weather forecast (monsoon = extra check)
    → Recent warning lights recorded
    → Engine fingerprint deviation (if recorded)
  ↓
Gemini calculates mood:
  Scores each system:
    engine, tyres, battery, brakes, fuel,
    suspension, electrical, body
  Weights + combines
  Returns mood_score (0-100) + status
  ↓
Owner opens app → sees:
  🟢 HAPPY (score: 88)
  "Your car is in great shape today!"
  → Safe for highway trip
  
  🟡 NEUTRAL (score: 62)
  "Minor attention needed"
  → Check tyre pressure before long drive
  
  🔴 STRESSED (score: 38)
  "Get service soon"
  → [Book Service Now →]
```

**DB tables:** `vehicle_mood_scores`

---

### AUTO-U03: Pre-Purchase Vehicle Scanner ⭐ WORLD FIRST

**What it is:**
200-checkpoint AI-assisted vehicle inspection for
used car buyers. Detects odometer fraud, flood damage,
accident history, pending bank loans, stolen status.
Saves buyers from fraud.

**What makes it world-first:**
End-to-end AI-assisted pre-purchase inspection
with verified technician + document analysis.

**How it works:**
```
Owner requests pre-purchase scan:
  → Vehicle registration number
  → Asking price
  → Location + preferred time
  ↓
UPTIME assigns inspection technician:
  → Must have pre_purchase_scan certification
  → Arrives with inspection checklist app
  ↓
Technician runs 200-point inspection:
  BODY & PAINT (40 checks):
    → Panel gaps, paint match, dent detection
    → Rust spots under body
    → Overspray on rubber seals (accident indicator)
  ENGINE (50 checks):
    → Oil condition, leaks, belt condition
    → Cold start sound analysis
    → Engine number matches RC book
  ELECTRICAL (30 checks):
    → All lights, AC, windows, locks
    → OBD scan for fault codes
  CHASSIS (20 checks):
    → Underbody rust, frame damage
  DOCUMENTS (20 checks):
    → RC book authenticity
    → Insurance validity
    → PUC validity
    → Loan NOC check (RTO API)
    → Stolen vehicle check (VAHAN API)
  ODOMETER (10 checks):
    → Dashboard vs service records
    → AI comparison: "Tyre wear suggests 85,000km
                      not displayed 65,000km"
  ↓
All findings sent to Gemini:
  → Overall score (0-100)
  → Red flags highlighted
  → Fair price estimate
  → AI recommendation: BUY / NEGOTIATE / AVOID
  ↓
Detailed report PDF generated:
  → SHA-256 hash locked
  → Owner can verify authenticity
  → Shareable with seller for negotiation
```

**DB tables:** `pre_purchase_scans`, `vehicle_scan_details`

---

## 5. Electronics & Appliances Features

### 10 Core Features

---

### ELEC-C01: Smart Fault Reporting

```
Electronics-specific fault entry:
  → Error code lookup: type "E3" → AI explains meaning
  → Brand + model auto-suggest common faults
  → DIY suggestions shown first:
    "Try restarting the device"
    "Check if power cable is damaged"
    "Clean the filter"
  → If DIY doesn't help → book technician
  → Self-diagnosis saves 30% of service calls
```

---

### ELEC-C02: Repair vs Replace Advisor

**What it is:**
AI compares repair cost vs device age vs replacement
cost vs new technology. Gives unbiased financial
recommendation: repair, replace now, or wait.

**How it works:**
```
After AI diagnosis (cost estimate known):
  AI collects:
    → Repair cost estimate (from diagnosis)
    → Device age (from purchase_date)
    → Original price (from device record)
    → Current market price (web search / DB)
    → New model benefits (e.g., better efficiency)
    → Remaining warranty / AMC coverage
  ↓
Decision matrix:
  repair_cost < 30% of replacement → REPAIR ✅
  device age < 3 years            → REPAIR ✅
  device age > 7 years + costly   → REPLACE ❌
  repair_cost > 50% of replacement → REPLACE ❌
  in warranty                      → WARRANTY CLAIM
  ↓
Shows clear recommendation:
  "💡 Repair is recommended"
  Repair: ₹800  vs  New AC: ₹38,000
  Device is 2 years old — repair makes sense
  
  OR:
  
  "🔄 Consider replacement"
  Repair: ₹6,500  vs  New Phone: ₹12,000
  Device is 6 years old — technology has improved
```

---

### ELEC-C03: Doorstep Repair Service

Same as CORE-01 to CORE-08 but with extra:

```
Electronics-specific:
  → Owner MUST be present (data privacy)
  → Repair done in owner's presence
  → Screen time: owner watches tech work
  → No parts taken off-premises without OTP
  → Data protection protocol triggered
    (see ELEC-C05)
```

---

### ELEC-C04: Device Health Monitor

```
Automated health checks:
  Smart devices (Google Home, Alexa):
    → Connected via smart_home_connections
    → IoT data: temperature, power consumption
    → Anomaly detection every 15 minutes
    → Alert if: unusual power draw, overheating,
                offline unexpectedly

  Non-smart devices (manual):
    → Owner inputs observations monthly:
      "AC takes longer to cool"
      "Fridge making noise"
    → AI updates health score
    → Trend shows deterioration over time
```

---

### ELEC-C05: Data Protection Protocol

**What it is:**
Before any device repair, AI guides owner through
data backup. During repair, AI monitors session.
After repair, data integrity certificate issued.

**How it works:**
```
Job accepted → Data Protection Protocol starts:

Pre-repair:
  → Backup guide for device type:
    Phone: "Backup to Google Drive — here's how"
    Laptop: "Enable OneDrive backup — step by step"
    CCTV: "Export recordings to USB"
  → Owner confirms backup done (checkbox)
  → Backup timestamp recorded
  ↓
During repair:
  → Tech cannot access personal photos/data
  → Factory reset not allowed without owner
  → Tech signs data protection agreement
  → Checklist: what work was done + what not accessed
  ↓
Post-repair:
  → Data integrity check:
    "No apps uninstalled, no files deleted"
  → Certificate generated:
    "This device repair was performed under
     UPTIME Data Protection Protocol"
  → SHA-256 locked
  → Owner can verify certificate authenticity
```

---

### ELEC-C06: Spare Parts Marketplace

```
When tech needs parts during job:
  → Tech logs: "Need Samsung S23 screen, OEM"
  → Marketplace shows available suppliers nearby
  → Same-day delivery (2-4 hours in metro cities)
  → Part delivered to job site
  → Quality guaranteed: OEM / Compatible badge
  → Warranty on part: 6-12 months
  → Parts cost added to invoice automatically
```

---

### ELEC-C07: Warranty & AMC Manager

```
Warranty tracking:
  → Add warranty card by:
    Taking photo → AI OCR extracts all details
    Manual entry
  → Expiry alerts: 90/30/7/1 days before
  → Guided claim process when needed
  ↓
AMC management:
  → Track annual maintenance contracts
  → How many visits used vs total allowed
  → When AMC expires → suggest renewal
  → UPTIME AMC purchase (our platform's AMC)
  ↓
Extended warranty:
  → Buy extended warranty via UPTIME
  → Partners: Bajaj Allianz, SquareTrade
  → Coverage: accidental damage, theft, breakdown
```

---

### ELEC-C08: Smart Home Integration

```
Supported platforms:
  Google Home, Amazon Alexa,
  Samsung SmartThings, Apple HomeKit

Connection:
  → OAuth 2.0 authorization flow
  → Access token encrypted (AES-256) in DB
  → Syncs device status every 15 minutes
  ↓
Auto-repair triggers:
  AC offline for 2 hours → alert owner
  Refrigerator temperature rising → alert
  Smart plug power draw anomaly → alert
  ↓
Alert → owner can immediately:
  [Diagnose with AI] or [Book Repair]
```

---

### ELEC-C09: Electronics Insurance

```
One-tap insurance purchase:
  Device Shield: ₹299/year
    → Accidental damage (drops, spills)
    → Breakdown after warranty expires
  
  Comprehensive: ₹599/year
    → Above + theft
    → Liquid damage
    → Screen crack
  ↓
Instant claim:
  → AI-guided evidence collection
  → Fraud score calculated (AI detects staged claims)
  → Fast track: simple claims settled in 24h
  → Physical inspection: complex claims 3-5 days
```

---

### ELEC-C10: Certified Refurbished Market

```
47-checkpoint inspection before listing:
  → Grade A+: Like new, all functions work
  → Grade A:  Minor cosmetic issues, all functions
  → Grade B:  Visible wear, all functions
  → Grade C:  Heavy wear, minor issues

Each refurbished device:
  → IMEI verified clean (not stolen)
  → Data wiped certificate
  → 6-month warranty from UPTIME
  → Detailed condition report
  → CO2 savings displayed (vs buying new)
  ↓
Listed in marketplace at 30-70% discount
```

---

### 5 Unique Electronics Features

---

### ELEC-U01: Fault Epidemic Detection ⭐ WORLD FIRST

**What it is:**
When 50+ users report the SAME fault on the SAME
device model within 24 hours, UPTIME detects it as
an "epidemic" — alerts all owners of that model,
notifies the manufacturer, and organises
collective support (class-action guidance).

**What makes it world-first:**
No platform detects and responds to product defect
epidemics in real-time.

**How it works:**
```
EpidemicDetectionScheduler runs every 5 minutes:
  ↓
  SELECT device_brand, device_model,
         fault_category, COUNT(*) as reports
  FROM ai_fault_diagnoses afd
  JOIN jobs j ON j.id = afd.job_id
  JOIN devices d ON d.id = j.asset_id
  WHERE j.created_at > NOW() - INTERVAL '24 hours'
    AND j.industry = 'ELECTRONICS'
  GROUP BY device_brand, device_model, fault_category
  HAVING COUNT(*) >= 50
  ↓
If threshold crossed:
  1. Create epidemic_detections record
  2. Find all users with same device model
  3. Push notification to all:
     "⚠ 52 users reported heating issue on
      Samsung Galaxy S23. Your device may be affected."
  4. Show collective action options:
     → Group repair discount (bulk booking)
     → Manufacturer complaint template
     → Consumer court guidance
  5. Notify admin for escalation
  6. Try to notify manufacturer via public contact
```

**DB tables:** `epidemic_detections`,
`epidemic_affected_users`

---

### ELEC-U02: Silent Killer Detection ⭐ WORLD FIRST

**What it is:**
AI continuously monitors smart home devices for
hidden hazards that can harm residents without
obvious warning: refrigerant leaks, electrical
leakage, microwave radiation, CO buildup, fire risk.

**What makes it world-first:**
Proactive safety hazard detection through a
consumer app — no dedicated hardware required.

**How it works:**
```
Smart home devices connected (Google Home/Alexa)
IoT sensor readings synced every 15 minutes
  ↓
SilentKillerService analyses data:
  ↓
REFRIGERANT LEAK detection:
  → AC power consumption higher than usual
  → AC running longer but not cooling
  → AI pattern: "Compressor working harder"
  → Alert: "Possible refrigerant leak — 
             open windows, call technician"

ELECTRICAL LEAKAGE:
  → Smart plug: unusual current draw
  → Spike pattern differs from normal operation
  → Alert: "Possible electrical fault —
             unplug immediately"

CO BUILDUP (if CO sensor connected):
  → Rising CO ppm trend
  → Alert: "🚨 CO levels rising — evacuate now"

FIRE RISK:
  → Appliance overheating (unusual temp sensor)
  → Alert: "Washing machine overheating —
             turn off circuit breaker immediately"
  ↓
All alerts stored in silent_killer_alerts
Admin alerted for high-severity cases
```

**DB tables:** `silent_killer_alerts`

---

### ELEC-U03: Crowd-Sourced Repair Wiki

Same as IND-U10 but for electronics:

```
Electronics-specific wiki content:
  → Error code database (what E3 means on Whirlpool)
  → "Should I repair or replace?" guides
  → DIY vs professional guides
  → Monsoon season maintenance tips for AC
  → Power fluctuation protection guide
  → Data backup before repair guides
  → Model-specific known issues (epidemic data)
```

---

### ELEC-U04: Universal Repair Language ⭐ WORLD FIRST

**What it is:**
Every part of UPTIME works in 22 official Indian
languages, 1,600+ dialects, voice-only mode,
WhatsApp/SMS access, and Indian Sign Language —
making repair services accessible to ALL Indians
regardless of literacy, language, or disability.

**What makes it world-first:**
No Indian app supports ISL + voice-only + SMS +
all 22 official languages simultaneously.

**How it works:**
```
Language support:
  React: i18next with 9 language JSON files
  Flutter: flutter_localizations + ARB files
  Gemini: multilingual natively (all 22+ languages)

Voice-only mode:
  → Every input has mic button
  → Web Speech API (React) / speech_to_text (Flutter)
  → Entire flow completable without typing
  → Supports regional scripts (not just transliteration)

WhatsApp fallback:
  → All fault reports via WhatsApp chatbot
  → "Hi" → menu options
  → Tech notified via WhatsApp
  → OTP via WhatsApp message
  → Works on basic Android + 2G

SMS fallback:
  → No smartphone needed
  → USSD menu planned (future)
  → SMS-based job status updates

Indian Sign Language (ISL):
  → Settings → Accessibility → ISL Mode
  → Key flows have ISL video guides:
    "How to report a fault"
    "How to verify technician arrival"
    "How to rate your experience"
  → Videos stored in Cloudinary
  → Plays alongside text content
```

---

### ELEC-U05: Device End of Life Ritual ⭐ WORLD FIRST

**What it is:**
When a device is beyond repair or owner wants to
dispose it, UPTIME creates a personalised "farewell":
AI-generated memory reel of the device's history,
data migration guide, eco-friendly disposal with
CO2 savings certificate, carbon credits earned.

**What makes it world-first:**
No platform creates an emotional, data-safe,
eco-conscious end-of-life experience for devices.

**How it works:**
```
Owner taps "Retire this Device"
  ↓
Step 1: Memory Reel (AI-generated)
  Gemini creates narrative:
  "Your Samsung Galaxy S7 served you for 7 years.
   It survived 3 screen repairs, 2 battery replacements,
   and travelled with you to 5 cities. You spent ₹8,400
   keeping it alive — saving ₹45,000 in new phone costs."
  → Shown as animated story card
  → Shareable on social media
  ↓
Step 2: Data Migration Guide
  → Backup all photos to Google Drive
  → Export contacts to VCF
  → Transfer WhatsApp history to new phone
  → Factory reset walkthrough (step by step)
  ↓
Step 3: Eco Disposal
  → Find nearest e-waste recycling centre (map)
  → UPTIME-partnered collection pickup available
  → CO2 saved certificate:
    "Recycling your phone saves 150g of CO2"
  → Carbon credits earned: credited to account
  ↓
Step 4: Device Life Certificate
  → PDF with device history
  → Total repairs, total cost, total time
  → SHA-256 locked (immutable record)
  → QR code (scan to verify)
  ↓
Step 5: Replacement Recommendation
  → Based on usage patterns:
    "You mainly used camera + WhatsApp.
     Best replacement: Poco X6 (₹18,000)"
  → Affiliate link (revenue for UPTIME)
```

**DB tables:** `end_of_life_records`

---

## 6. Platform-Wide Features

These 7 features work across all 3 industries.

---

### PLT-01: In-App Payment Gateway

```
Payment methods:
  UPI: PhonePe, Google Pay, Paytm, BHIM
  Cards: Visa, Mastercard, Rupay, Amex
  EMI: 6/9/12 months (on cards > ₹3,000)
  Net banking: 50+ banks
  Wallet: UPTIME wallet (pre-loaded balance)

Commission: 10% of job value
GST: CGST+SGST (intra-state) or IGST (inter-state)
Invoice: auto-generated PDF with GST breakdown

Payout to technician:
  → Escrowed during job
  → Released 24h after completion (no dispute)
  → Daily batch payout at 11 AM
  → UPI / NEFT / IMPS to bank account
  → TDS deducted (1% above ₹30,000/year)
```

---

### PLT-02: Subscription Plans

```
FREE:
  2 jobs/month, 3 assets, 10 AI calls/month
  No priority matching, 0 video consults
  Price: ₹0

BASIC (₹299/month):
  5 jobs, 10 assets, 50 AI calls
  No priority, 1 video consult
  Marketplace 5% discount

STANDARD (₹799/month):
  15 jobs, 25 assets, 150 AI calls
  Priority matching, 3 video consults
  Marketplace 10% discount

PREMIUM (₹1,499/month):
  Unlimited jobs + assets + AI calls
  Priority matching, 10 video consults
  Marketplace 15% discount
  Dedicated account manager

Plan enforcement:
  → Job limit checked before each job creation
  → Soft limit: show upgrade prompt
  → Hard limit: block after 3 over-limit attempts
  → Grace period: 7 days if payment fails
```

---

### PLT-03: Technician Earnings Dashboard

```
For technicians:
  → Today's earnings (live updating)
  → This week vs last week chart
  → Monthly breakdown by job type
  → GST summary (downloadable for filing)
  → TDS certificate (annual)
  → Wallet balance
  → Payout history
  → [Withdraw to Bank] button (min ₹100)
  → Performance rank vs platform average
```

---

### PLT-04: AI Chatbot Support 24/7

```
Powered by Gemini 1.5 Flash
Available in all 9 languages
  ↓
Can handle:
  → "Where is my technician?" → live status
  → "How do I cancel my job?" → guided cancel
  → "I want a refund" → raises dispute
  → "How to add a machine?" → step-by-step
  → "My app is crashing" → troubleshoot guide
  ↓
Escalation to human:
  If chatbot cannot resolve in 3 turns →
  Creates support ticket
  Admin assigned within 2 hours (business hours)
  ↓
WhatsApp: same bot on WhatsApp Business API
```

---

### PLT-05: Business / Enterprise Accounts

```
For companies with multiple locations:
  → Centralised billing (one invoice for all)
  → Multiple plant/branch managers
  → Approval workflow (manager approves > ₹5,000 jobs)
  → Monthly cost center reports (by location/department)
  → Preferred technician list (always book same tech)
  → SLA agreements (guaranteed response time)
  → Dedicated UPTIME account manager
  → Annual contract with volume discount
```

---

### PLT-06: Repair Carbon Credits

```
Every repair = CO2 saved vs buying new:
  Phone repair: saves 70kg CO2
  AC repair:    saves 150kg CO2
  Car service:  saves 200kg CO2
  Machine repair: saves 500kg CO2
  ↓
Carbon credits earned per job:
  = CO2_saved_kg × 0.01 credits
  ↓
Displayed in dashboard:
  "You've saved 2.5 tonnes of CO2 this year"
  "Equivalent to planting 125 trees"
  ↓
Future (Phase 2):
  → Trade credits on ACX/Verra exchange
  → Real monetary value
  → Corporate buyers of credits
```

---

### PLT-07: Multilingual Platform

Covered in ELEC-U04 above.
Available on all 6 platforms.
9 languages in Phase 1 (PBL).
22 languages planned for production.

---

## 7. Virtual Repair Consultation

### VIRT-01: Virtual Repair Consultation ⭐ WORLD FIRST

**What it is:**
Owner video-calls a specialist technician BEFORE
booking a physical visit. AI overlays fault
annotations on the live camera feed. If fixable
remotely — done live. If not — visit booked with
consultation fee deducted.

**What makes it world-first:**
AI-annotated live video diagnosis for repair
consultation — no existing platform in any industry.

**Available in:** ALL 3 industries

**Pricing tiers:**
```
Quick Check (15 min):   ₹99
  → Basic diagnosis: physical visit needed?

Full Diagnosis (30 min): ₹199
  → Full remote diagnosis + fix attempt

Extended (45 min):       ₹299
  → Full diagnosis + priority physical dispatch
  → Same technician for physical visit
```

**What can be fixed remotely:**
```
Industrial:
  ✅ PLC error codes and resets
  ✅ Firmware updates (remote login guidance)
  ✅ Sensor calibration guidance
  ✅ Parameter settings (CNC, PLC)
  ❌ Physical part replacement
  ❌ Welding, machining, mechanical

Automobile:
  ✅ ECU software updates (guidance)
  ✅ Infotainment system issues
  ✅ Battery settings (EV guidance)
  ✅ Dashboard warning explanation
  ❌ Engine, brake, body repair
  ❌ Any physical part replacement

Electronics:
  ✅ Software/OS issues
  ✅ App crashes, settings problems
  ✅ WiFi/Bluetooth connectivity
  ✅ AC settings, timer programming
  ✅ Virus/malware removal (guided)
  ❌ Physical screen, battery, hardware
  ❌ Gas refilling (AC/refrigerator)
```

**Full implementation:**
```
Step 1: Owner books consultation
  POST /consultations
  → UPTIME finds available remote-certified tech
  → Agora channel created + tokens generated
  → Both parties notified

Step 2: Video call via Agora.io
  Owner Flutter:
    agora_rtc_engine.joinChannel(token, channel)
    → Shows own camera feed to tech
    → Sees tech's face
  Tech Flutter:
    → Sees owner's camera feed
    → Can request camera rotation, zoom

Step 3: AI annotation (every 5 seconds)
  Owner app captures frame (JPEG, 1MB max)
  POST /consultations/{id}/frame-analysis
    ↓
  Gemini vision analyses frame:
    Returns: [{x, y, w, h, label, severity}]
    e.g.: "Condenser coil — dust buildup" at [120,85,200,150]
    ↓
  Canvas widget overlays annotations on camera feed:
    Yellow rectangle around problem area
    Label text below rectangle
    Severity indicator (LOW/MEDIUM/HIGH)

Step 4: Outcome recorded
  PUT /consultations/{id}/outcome
  outcome: FIXED_REMOTELY or VISIT_NEEDED

  If VISIT_NEEDED:
    → Physical job auto-created
    → Same tech pre-assigned
    → ₹199 deducted from physical job charge

Step 5: Recording (with consent)
  Agora Cloud Recording API
  → Stored in Cloudinary
  → Owner can review later
  → Available in job history
```

**DB tables:** `virtual_consultations`

---

## 8. Feature Implementation Index

Quick reference: which files to create/modify for each feature.

```
FEATURE              BACKEND FILES                    FRONTEND FILES
─────────────────────────────────────────────────────────────────────
CORE-01 Fault Report JobController,JobService         FaultReportForm.tsx
                     JobRepository,Job.java            VoiceInputButton.tsx
                     CloudinaryService                 MediaUploadGrid.tsx

CORE-02 AI Triage    GeminiService,FaultTriageService AIDiagnosisCard.tsx
                     AIController,DiagnosisDTO         ai_diagnosis_screen.dart

CORE-03 Matching     ScoringEngine,MatchingService    TechnicianList.tsx
                     MatchingController                technician_list_screen.dart

CORE-04 Tracking     WebSocketHandler,ETAService      LiveTrackingMap.tsx
                     LocationBroadcastService          live_tracking_screen.dart

CORE-05 OTP+GPS      OTPVerificationService           OTPShareCard.tsx
                     JobOTPVerification.java           otp_share_screen.dart
                                                       otp_entry_screen.dart

CORE-06 Copilot      RepairCopilotService             AICopilotScreen.tsx
                     AICopilotSession.java             ai_copilot_screen.dart

CORE-07 Rating       RatingService,JobRating.java     RateJobPage.tsx
                     TrustScoreService                 rate_job_screen.dart

CORE-08 History      ServiceHistoryService            JobHistoryPage.tsx
                     MachineServiceHistory.java        job_history_screen.dart

CORE-09 Cost Est     GeminiService (part of triage)  CostEstimateCard.tsx

CORE-10 Verification VerificationService              VerificationQueuePage.tsx
                     TechnicianVerification.java       document_upload_screen.dart

CORE-11 Admin Dash   PlatformAnalyticsService         AdminDashboardPage.tsx
                     PlatformHealthScheduler          Live websocket dashboard

CORE-12 Auction      AuctionService,JobAuction.java  AuctionScreen.tsx
                     AuctionTimerService              auction_screen.dart

IND-U01 Copilot      (see CORE-06)                   AICopilotScreen
IND-U02 Sound        SoundAnalysisService             SoundRecorder.tsx
                     AISoundAnalysis.java             sound_recorder_widget.dart

IND-U03 DigitalTwin  DigitalTwinService               DigitalTwinPage.tsx
                     RepairPredictionScheduler        digital_twin_screen.dart

IND-U04 Negotiate    NegotiationService               NegotiationPanel.tsx
                     JobNegotiation.java

IND-U05 Prediction   RepairPredictionScheduler        PredictionTimeline.tsx
                     RepairPrediction.java

IND-U06 TamperProof  TamperProofService,HashUtils     TamperProofBadge.tsx
                     CertificateService

IND-U07 OTP+GPS      (see CORE-05 + extra config)

IND-U08 MicroInsur   MicroInsuranceService            InsurancePage.tsx
                     JobMicroInsurance.java

IND-U09 NFT Badge    BadgeService,NftService          BadgesPage.tsx
                     NftTransaction.java              badges_screen.dart

IND-U10 Wiki         WikiService,WikiArticle.java     WikiPage.tsx
                     WikiExtractionService            wiki_screen.dart

AUTO-C01 SOS         JobService (CRITICAL urgency)    SOSButton.tsx (red FAB)
AUTO-C02 Warning     ImageAnalysisService             WarningReaderPage.tsx
AUTO-C03 Workshop    WorkshopService                  WorkshopBookingPage.tsx
AUTO-C04 VehicleTwin (see IND-U03)
AUTO-C05 Auction     (see CORE-12)
AUTO-C06 EV          VehicleService (EV filters)      EVSupportPage.tsx
AUTO-C07 Insurance   InsuranceClaimService            ClaimWizardPage.tsx
AUTO-C08 Tyre/Fuel   JobService (special types)       TyreFuelPage.tsx
AUTO-C09 SafeScore   DriverSafetyService              SafetyScorePage.tsx
AUTO-C10 Fleet       FleetService,FleetController     FleetDashboardPage.tsx
AUTO-C11 Challan     ChallanService                   ChallanPage.tsx
AUTO-C12 FuelFinder  GoogleMapsService                FuelFinderPage.tsx

AUTO-U01 EngineSound EngineFingerprintService         EngineFingerprintCard.tsx
                     EngineFingerprint.java

AUTO-U02 MoodScore   VehicleMoodScheduler             MoodScoreCard.tsx
                     VehicleMoodScore.java

AUTO-U03 PrePurchase PrePurchaseScanService           PrePurchaseScanPage.tsx
                     PrePurchaseScan.java             pre_purchase_scan_screen.dart

ELEC-C01 FaultReport (see CORE-01 + error code lookup)
ELEC-C02 RepairRepl  RepairReplaceService             RepairReplaceAdvisor.tsx
ELEC-C03 Doorstep    (see CORE-01 to CORE-08)
ELEC-C04 DeviceHealth DeviceHealthService             DeviceHealthPage.tsx
                     DeviceHealthLog.java
ELEC-C05 DataProt    DataProtectionService            DataProtectionPage.tsx
ELEC-C06 SpareParts  MarketplaceService               MarketplacePage.tsx
ELEC-C07 Warranty    WarrantyService,OCRService       WarrantyPage.tsx
                     Warranty.java
ELEC-C08 SmartHome   SmartHomeService                 SmartHomePage.tsx
                     SmartHomeConnection.java
ELEC-C09 Insurance   InsuranceService                 InsurancePage.tsx
ELEC-C10 Refurbished MarketplaceRefurbishedService    RefurbishedPage.tsx

ELEC-U01 Epidemic    EpidemicDetectionScheduler       EpidemicAlert.tsx
                     EpidemicDetection.java

ELEC-U02 SilentKill  SilentKillerService              SilentKillerAlert.tsx
                     SilentKillerAlert.java

ELEC-U03 Wiki        (see IND-U10)

ELEC-U04 UnivLang    TranslationService               LanguageSelector.tsx
                     (i18next + Gemini)               app_localizations.dart

ELEC-U05 EndOfLife   EndOfLifeService                 EndOfLifePage.tsx
                     EndOfLifeRecord.java             end_of_life_screen.dart

PLT-01 Payment       RazorpayService,PaymentService   PaymentPage.tsx
                     WebhookHandler                   payment_screen.dart

PLT-02 Subscription  SubscriptionService              SubscriptionPage.tsx
                     SubscriptionPlan.java

PLT-03 Earnings      EarningsService                  EarningsPage.tsx
                     WalletService                    earnings_screen.dart

PLT-04 Chatbot       ChatbotService (Gemini)          ChatbotWidget.tsx

PLT-05 Business      BusinessAccountService           FleetDashboardPage.tsx

PLT-06 Carbon        CarbonCreditService              CarbonCreditCard.tsx
                     CarbonCredit.java

PLT-07 Multilingual  TranslationService               LanguageSelector.tsx
                     (built into all modules)         app_localizations.dart

VIRT-01 VideoConsult AgoraService,VideoService        VideoCallScreen.tsx
                     FrameAnalysisService             video_call_screen.dart
                     VirtualConsultation.java
```

---

*UPTIME Features Documentation — v1.0*  
*"Downtime ends here."*  
*DSATM Bengaluru — VTU — 2026-27*

---

## ADDENDUM — User-Controlled Flow (v1.1)

> **Innovation by:** Pavan B C | **Impact:** Changes core UX of ALL 3 industries

### NEW FEATURE: Owner-Controlled Resolution Path

**What it is:**
After AI analyses the fault, the owner is presented with
THREE paths simultaneously. They choose based on their
budget, urgency, technical comfort, and time availability.
No path is forced. Any path can be skipped at any time.

**Why this is better than the old flow:**
```
Old:  Report → AI → Match → Book (linear, no choice)
New:  Report → AI → CHOOSE (flexible, owner controls)

Benefits:
  → Experienced owners: skip straight to booking
  → Tech-savvy owners: try AI copilot (save money)
  → Busy owners: video call (30 mins, no visit)
  → Rural/low-literacy: book tech directly
  → Cost-conscious: try free copilot first
```

**The 3-Path Screen (shown after AI diagnosis):**
```
┌────────────────────────────────────────────────┐
│  AI Result: Motor Bearing Failure    87%        │
│  Urgency: HIGH | Est: ₹800–₹1,500             │
├────────────────────────────────────────────────┤
│  What would you like to do?                    │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │ 🤖 Try AI Copilot                 FREE  │  │
│  │    "Let AI guide me to fix it myself"  │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │ 📹 Video Consultation             ₹199  │  │
│  │    "Talk to a specialist right now"    │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │ 🔧 Book Technician               ₹800+  │  │
│  │    "Send someone to my location"       │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  [Skip — I already know what I need →]        │
└────────────────────────────────────────────────┘
```

**Escalation Rules:**
```
AI Copilot not working?
  → "Need more help?" banner appears
  → [Try Video Consult] or [Book Technician]

Video Consult not enough?
  → Tech clicks "Visit needed"
  → Physical job auto-created
  → ₹199 consult fee deducted from job charge

Any path → can escalate to Book Technician
  → Owner never stuck without resolution
```

**Backend Implementation:**
```java
// New endpoint: POST /api/v1/jobs/{id}/choose-path
// Body: { path: "COPILOT" | "VIDEO" | "BOOK" | "SKIP" }
// This records owner's choice and routes to correct flow
// path_choice stored in jobs.resolution_path column

// New column in jobs table:
// resolution_path VARCHAR(20)
//   → 'COPILOT_FIRST'
//   → 'VIDEO_FIRST'
//   → 'BOOK_DIRECT'
//   → 'ESCALATED_FROM_COPILOT'
//   → 'ESCALATED_FROM_VIDEO'
```

**Analytics value:**
```
Admin can see:
  → What % of owners try copilot first?
  → What % of copilot sessions escalate?
  → What % of video consults escalate?
  → Which fault types are most DIY-solvable?
  → Cost saved by owners via copilot (vs booking)
```

**This is a world-first feature because:**
```
No existing Indian or global repair platform
gives owners a 3-path choice AFTER AI diagnosis.
All existing platforms force one linear flow.
UPTIME is the first to put the owner in control.
```
