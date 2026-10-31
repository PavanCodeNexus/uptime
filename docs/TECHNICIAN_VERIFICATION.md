# UPTIME — Technician Verification Spec (KYC + Skill Proof)

> **Version:** 1.1 | **Date:** 2026-10-31
> **Replaces/extends:** CORE-10 (Technician Verification System) in FEATURES.md, Module 3 + Module 14 in PROJECT_UNDERSTANDING.md
> **Read with:** SECURITY.md (Sections 13, 14, 24), DATABASE.md (technicians, technician_documents), API.md (Technician + Admin modules)

---

## 1. Goal and Principles

```
Goal: only a real, adult, identity-checked person with PROVEN skill
      for a trade can receive jobs in that trade.

P1  Verify, don't hoard.  Check identity, keep the RESULT, not the raw Aadhaar.
P2  Evidence ladder.      Formal certificate > employer proof > practical test > ratings.
P3  Trade-level trust.    A technician is verified PER TRADE, not just "verified".
P4  Regulated trades need licences (boiler, HT electrical, crane, NDT ...).
P5  Inclusive.            Many skilled technicians have no certificate -> provisional route.
P6  Same pattern as OTP.  VerificationProvider strategy: MOCK (dev/demo) / REAL (prod).
P7  PBL-realistic.        Real Aadhaar API access needs onboarding we may not get in time.
                          The demo uses MOCK + manual admin review. Architecture stays real.
```

---

## 2. Verification Levels

| Level | Name | How to reach | Unlocks |
|-------|------|--------------|---------|
| **L0** | Registered | Phone OTP + basic profile | Nothing. Cannot see or accept jobs |
| **L1** | Identity verified | Aadhaar-based identity check + selfie face match + age >= 18 (+ admin approval if flagged) | Skill test, upload skill proof, add bank account |
| **L2** | Skill verified (per trade) | At least 1 accepted skill evidence for the trade + passed skill test | Receives jobs in that trade (non-regulated). Verified badge |
| **L2-P** | Provisional skill | No formal certificate: skill test >= 80% + practical video + 2 confirmed references | Same as L2 but: job value cap (default Rs 5,000), no regulated trades, auto-review after 10 jobs |
| **L3** | Licensed specialist | Valid licence for a regulated trade | Receives regulated jobs (boiler, HT electrical, crane, NDT, EV high-voltage, etc.) |

```
Rules:
- Level is stored on the technician; skill verification is stored PER TRADE tag.
- Matching uses BOTH: technician.verification_level and a verified skill for the job's trade tag.
- Expiry or revocation of a licence removes that trade from matching immediately.
- Payout needs a verified bank account (penny drop). Accepting jobs does not.
```

---

## 3. Documents That Prove "He Is a Technician"

### 3.1 Identity (required for L1)

| Document | Required? | How it is verified | What UPTIME stores |
|----------|-----------|--------------------|--------------------|
| **Aadhaar (offline / QR / partner API)** | Yes (or alternate ID below) | Section 4 | Result only: last 4 digits, name, year of birth, adult flag, method, provider reference, consent log |
| Alternate ID: Driving Licence / Voter ID / Passport | Only if technician refuses or cannot do Aadhaar | Admin manual review of image | Image (private, auto-deleted), masked number |
| **Selfie with liveness** | Yes | Face match against photo from ID (Section 5) | Selfie (private), match score, liveness result |
| **PAN** | Needed before first payout (TDS) | Format check + admin review (name match) | Encrypted PAN (AES-256-GCM), masked in UI |
| **Bank account** | Needed before payout | Penny-drop Rs 1 test (mock in demo) | Encrypted account number, IFSC, verified flag |
| Police verification certificate | Recommended; **mandatory for doorstep visits to homes** (electronics, appliance) | Admin review, check validity date | Certificate (private), issue date, expiry |

### 3.2 Skill proof (at least ONE per trade for L2)

| Evidence type | Examples | How to verify |
|---------------|----------|---------------|
| **ITI / NCVT certificate** | Fitter, Electrician, Welder, Machinist, Mechanic Motor Vehicle, Electronics Mechanic, RAC | Registration number (PRN) + certificate on Skill India Digital Hub / DigiLocker. Admin checks QR/number |
| **NSDC / Skill India / PMKVY / sector skill council certificate** | Electronics, automotive, capital-goods sector certificates | Certificate QR or DigiLocker |
| **OEM / manufacturer training** | Samsung, LG, Daikin, Bosch, Tata Motors, Bajaj, Honda, Siemens, ABB, Fanuc training certificates | Certificate number + issuer check; call issuer if doubtful |
| **Diploma / degree** | Diploma in Mechanical / Electrical / Electronics / Automobile, B.E./B.Tech | Certificate + marksheet; university/board check if doubtful |
| **Experience letter / relieving letter** | From factory, workshop, service centre (>= 2 years in trade) | Letter on letterhead + admin calls employer number. Counts as 1 reference |
| **Workshop / business proof** | Udyam registration, Shop & Establishment licence, GST certificate | Registration number check on the official portal |
| **Skill test (UPTIME)** | 15 MCQ (Gemini-generated per trade) + 1 practical video task | Auto-scored + admin watches video. See Section 7 |
| **References (2)** | Previous employer, customer, workshop owner | Admin phone call, outcome logged |

### 3.3 Regulated trades: licence required for L3

> Policy table is configurable (table `trade_license_requirements`). Team must confirm the exact
> applicable rules per state before production. Values below are the recommended defaults.

| Trade (skill tag) | Licence / certificate to require |
|-------------------|----------------------------------|
| boiler_repair, steam_system_repair | IBR boiler operator / attendant certificate |
| switchgear_repair, transformer_repair, industrial_electrical (HT work) | State electrical licensing board wireman / supervisor / HT competency licence |
| crane_hoist_repair, crane_electrical_repair | Crane operator licence / competency certificate |
| ndt_inspection, radiography_inspection | NDT certification (ASNT / ISO 9712 / SNT-TC-1A Level II); radiography also needs radiation-safety approval |
| welding for pressure parts (boiler / pipe) | IBR / welder qualification certificate |
| EV high-voltage work | EV high-voltage safety training certificate (OEM or recognised institute) |
| Refrigerant gas handling (AC / refrigeration) | RAC service-technician certification (ozone-cell / NSDC scheme) |
| CNG / LPG kit work | Authorised fitment centre proof |
| Roadside recovery / towing | Valid driving licence for the vehicle class |
| vibration_analysis | ISO 18436 category certificate |

### 3.4 Minimum bundle per industry

```
INDUSTRIAL   ID + selfie + (ITI trade cert OR diploma OR 2-yr experience letter) + skill test
             + licence if regulated trade
AUTOMOBILE   ID + selfie + (ITI Mechanic Motor Vehicle OR OEM training OR experience letter
             OR workshop proof) + skill test + driving licence for roadside/towing
             + EV safety cert for EV work
ELECTRONICS  ID + selfie + police verification (home visits) + (ITI Electronics/RAC OR NSDC OR
             OEM authorised-service training OR experience letter) + skill test
             + RAC refrigerant cert for gas work
NO CERTIFICATE (any industry)
             ID + selfie + skill test >= 80% + practical video + 2 confirmed references
             -> Provisional L2-P
```

---

## 4. Aadhaar Verification Design

### 4.1 What the rules mean for UPTIME (check before production)

```
- Aadhaar use must be voluntary and with explicit consent.
- After offline verification, entities should not keep the Aadhaar number.
  If a copy must be kept, the number must be redacted/masked and irretrievable.
- Offline e-KYC and Aadhaar-App based verification need UIDAI registration as an OVSE
  (Offline Verification Seeking Entity). Checking a physical/electronic copy or QR code
  does not need registration.
- A student team usually cannot register as an OVSE. Licensed KYC API partners can run the
  verification for you (paid).
- Not legal advice: read the UIDAI OVSE page and FAQs before going live.
```

### 4.2 Provider strategy (same idea as OtpService)

```java
public interface IdentityVerificationProvider {
  VerificationSession start(Long technicianId, ConsentRecord consent);
  IdentityResult      confirm(Long technicianId, VerificationPayload payload);
}

@Profile({"dev","demo"})     MockIdentityProvider        // PBL: returns VERIFIED with fixture data
@Profile({"demo","prod"})    AadhaarQrProvider           // Wave 2: verify UIDAI-signed Secure QR
@Profile("prod")             PartnerKycProvider          // Wave 3: licensed KYC API / DigiLocker
```

```
Startup guard: if profile = prod and MockIdentityProvider bean is active -> FAIL STARTUP.
(Same guard for MockOtpProvider. A mock in prod means anyone can become "verified".)
```

### 4.3 Flow (what the technician sees)

```
1. Consent screen (versioned text): "UPTIME will verify your identity using Aadhaar. We will not
   store your Aadhaar number. We keep only the last 4 digits and the verification result."
   -> consent saved (text version, timestamp, IP) BEFORE anything else.
2. Choose method:
   a) Scan Aadhaar Secure QR (from card / PVC / e-Aadhaar / Aadhaar App)   [Wave 2 real, Wave 1 mock]
   b) Upload ID image for manual admin review (alternate ID allowed)       [Wave 1]
3. Server (QR path): verify UIDAI signature -> extract name, year of birth, gender, last 4 digits
   -> compute name_match_score vs profile name -> age >= 18 check -> save RESULT only.
   Raw QR payload is discarded after parsing.
4. Selfie + liveness -> face match vs photo from ID (Section 5).
5. Result: VERIFIED -> L1.  Any flag -> UNDER_REVIEW (admin).  FAILED -> reason + retry.
```

### 4.4 Storage rules (hard)

```
NEVER store:  full Aadhaar number, Aadhaar XML, QR payload, biometric data.
NEVER log:    any 12-digit number (add a log filter that masks \b\d{12}\b).
STORE:        aadhaar_last4, name_on_id, year_of_birth, is_adult, method, provider_reference,
              name_match_score, consent text version + timestamp, verified_at.
IF an ID image is uploaded: mask the first 8 digits BEFORE storing, store privately, and
              auto-delete 30 days after the decision. Keep only the decision + metadata.
```

---

## 5. Face Match and Liveness

```
Liveness: random challenge (blink / turn head left / smile). PBL: simple client-side check +
          admin glance. Production: dedicated liveness provider.
Match:    compare selfie with the photo on the ID.
          Do NOT use Gemini for face matching (not a reliable biometric tool).
          Use a face-comparison service (e.g. AWS Rekognition CompareFaces) or MockFaceEngine in demo.
Thresholds (configurable):  >= 90 PASS | 70-89 REVIEW (admin) | < 70 FAIL
Duplicate check: compare the new face against existing technicians; a high match to a different
          technician id -> flag DUPLICATE_IDENTITY for admin.
```

---

## 6. Skill Verification Flow

```
For each trade the technician selects (UPTIME skill tags):
  1. Upload >= 1 evidence (Section 3.2) OR choose the no-certificate route.
  2. Take the skill test for that trade (Section 7).
  3. Admin reviews evidence + test + (if provisional) reference results.
  4. Admin approves per trade -> technician_skill_verifications.status = VERIFIED
  5. If the trade is regulated -> licence upload + admin approval -> L3 for that trade.
  6. Licence / certificate with an expiry date is tracked; scheduler warns at 30/7/1 days.
  7. Expired -> status EXPIRED -> trade removed from matching until renewed.
```

---

## 7. Skill Test

```
Format:    15 multiple-choice questions generated by Gemini per trade tag + difficulty mix
           (5 easy, 6 medium, 4 hard) + 1 practical task video (30-60 s), e.g.
           "Show how you check bearing play on this motor" / "Show how you test a capacitor".
Scoring:   MCQ auto-scored. Pass = 70% (provisional route needs 80%). Video reviewed by admin.
Limits:    max 3 attempts per trade, 7-day cool-down after a failed attempt.
Integrity: questions + answers stored (JSONB); randomised order; time limit 20 min.
Safety:    if Gemini fails -> use a fixed fallback question bank per trade (seed 10 per major trade).
Cache:     generated test stored per attempt so a refresh does not regenerate it.
```

---

## 8. Database Migration (V18)

> V2 is already planned. Do NOT edit V2 if it has been applied; add this new migration.

```sql
-- V18__technician_kyc_and_skill_verification.sql

ALTER TABLE technicians
  ADD COLUMN IF NOT EXISTS verification_level  SMALLINT    NOT NULL DEFAULT 0,   -- 0..3
  ADD COLUMN IF NOT EXISTS is_provisional      BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS identity_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS kyc_status          VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED';
  -- kyc_status: NOT_STARTED | IN_PROGRESS | UNDER_REVIEW | VERIFIED | REJECTED | SUSPENDED

ALTER TABLE technician_documents
  ADD COLUMN IF NOT EXISTS doc_category          VARCHAR(20),   -- IDENTITY | SKILL | LICENCE | BUSINESS | BACKGROUND | BANK
  ADD COLUMN IF NOT EXISTS status                VARCHAR(20) NOT NULL DEFAULT 'UPLOADED',
                                                               -- UPLOADED | UNDER_REVIEW | APPROVED | REJECTED | EXPIRED | DELETED
  ADD COLUMN IF NOT EXISTS issuer                VARCHAR(200),
  ADD COLUMN IF NOT EXISTS document_number_masked VARCHAR(40),
  ADD COLUMN IF NOT EXISTS expires_at            DATE,
  ADD COLUMN IF NOT EXISTS reviewed_by           BIGINT,
  ADD COLUMN IF NOT EXISTS reviewed_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason_code VARCHAR(30),
  ADD COLUMN IF NOT EXISTS storage_ref           VARCHAR(300),  -- private storage key, NOT a public URL
  ADD COLUMN IF NOT EXISTS delete_after          TIMESTAMPTZ;   -- auto-purge date for raw ID images

CREATE TABLE technician_identity_verifications (
  id                   BIGSERIAL PRIMARY KEY,
  technician_id        BIGINT       NOT NULL REFERENCES technicians(id),
  method               VARCHAR(30)  NOT NULL,   -- AADHAAR_QR | AADHAAR_OFFLINE_EKYC | DIGILOCKER | PARTNER_API | MOCK | MANUAL_ADMIN
  provider             VARCHAR(40),
  provider_reference   VARCHAR(100),
  aadhaar_last4        CHAR(4),
  name_on_id           VARCHAR(200),
  name_match_score     DECIMAL(5,2),
  year_of_birth        SMALLINT,
  is_adult             BOOLEAN,
  status               VARCHAR(20)  NOT NULL DEFAULT 'PENDING',  -- PENDING | VERIFIED | UNDER_REVIEW | FAILED
  failure_reason       VARCHAR(200),
  consent_text_version VARCHAR(20)  NOT NULL,
  consent_at           TIMESTAMPTZ  NOT NULL,
  consent_ip           VARCHAR(45),
  verified_at          TIMESTAMPTZ,
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ
);
CREATE INDEX idx_tiv_technician ON technician_identity_verifications(technician_id);

CREATE TABLE technician_face_checks (
  id                       BIGSERIAL PRIMARY KEY,
  technician_id            BIGINT      NOT NULL REFERENCES technicians(id),
  identity_verification_id BIGINT      REFERENCES technician_identity_verifications(id),
  engine                   VARCHAR(30) NOT NULL,         -- MOCK | REKOGNITION | MANUAL
  face_match_score         DECIMAL(5,2),
  liveness_passed          BOOLEAN,
  result                   VARCHAR(10) NOT NULL,         -- PASS | REVIEW | FAIL
  duplicate_of_technician  BIGINT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_tfc_technician ON technician_face_checks(technician_id);

CREATE TABLE technician_skill_verifications (
  id            BIGSERIAL PRIMARY KEY,
  technician_id BIGINT      NOT NULL REFERENCES technicians(id),
  trade_code    VARCHAR(60) NOT NULL,                    -- UPTIME skill tag, e.g. cnc_machine_repair
  evidence_type VARCHAR(30) NOT NULL,                    -- ITI_NCVT | NSDC | OEM_TRAINING | DIPLOMA_DEGREE | EXPERIENCE_LETTER | BUSINESS_PROOF | LICENCE | SKILL_TEST | REFERENCE
  document_id   BIGINT      REFERENCES technician_documents(id),
  status        VARCHAR(20) NOT NULL DEFAULT 'PENDING',  -- PENDING | VERIFIED | REJECTED | EXPIRED | REVOKED
  level_granted SMALLINT,                                -- 2 or 3
  verified_by   BIGINT,
  verified_at   TIMESTAMPTZ,
  expires_at    DATE,
  notes         VARCHAR(500),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ
);
CREATE INDEX idx_tsv_technician_trade ON technician_skill_verifications(technician_id, trade_code);
CREATE INDEX idx_tsv_expiry ON technician_skill_verifications(expires_at) WHERE status = 'VERIFIED';

CREATE TABLE technician_skill_tests (
  id            BIGSERIAL PRIMARY KEY,
  technician_id BIGINT      NOT NULL REFERENCES technicians(id),
  trade_code    VARCHAR(60) NOT NULL,
  attempt_no    SMALLINT    NOT NULL,
  questions     JSONB       NOT NULL,
  answers       JSONB,
  score         DECIMAL(5,2),
  passed        BOOLEAN,
  practical_video_ref VARCHAR(300),
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at  TIMESTAMPTZ,
  cooldown_until TIMESTAMPTZ
);
CREATE INDEX idx_tst_technician_trade ON technician_skill_tests(technician_id, trade_code);

CREATE TABLE technician_references (
  id            BIGSERIAL PRIMARY KEY,
  technician_id BIGINT       NOT NULL REFERENCES technicians(id),
  ref_name      VARCHAR(150) NOT NULL,
  ref_phone     VARCHAR(15)  NOT NULL,
  relationship  VARCHAR(20)  NOT NULL,                   -- EMPLOYER | CUSTOMER | WORKSHOP_OWNER | COLLEAGUE
  organisation  VARCHAR(200),
  status        VARCHAR(20)  NOT NULL DEFAULT 'PENDING', -- PENDING | CONFIRMED | UNREACHABLE | NEGATIVE
  checked_by    BIGINT,
  checked_at    TIMESTAMPTZ,
  notes         VARCHAR(500),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_tref_technician ON technician_references(technician_id);

CREATE TABLE trade_license_requirements (
  id            BIGSERIAL PRIMARY KEY,
  trade_code    VARCHAR(60)  NOT NULL,
  license_type  VARCHAR(60)  NOT NULL,
  is_mandatory  BOOLEAN      NOT NULL DEFAULT TRUE,
  notes         VARCHAR(300),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX uq_tlr_trade_license ON trade_license_requirements(trade_code, license_type);
-- Seed from Section 3.3 in V17 (or V18b).
```

---

## 9. API (add to API.md)

### Technician side (role TECHNICIAN)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/technicians/me/verification` | Level, per-trade status, pending items, next step |
| POST | `/api/v1/technicians/me/kyc/consent` | Save consent (text version) before identity check |
| POST | `/api/v1/technicians/me/kyc/identity/start` | Start identity check (method: AADHAAR_QR / MANUAL_ID) |
| POST | `/api/v1/technicians/me/kyc/identity/confirm` | Submit QR payload or ID image; returns result only |
| POST | `/api/v1/technicians/me/kyc/selfie` | Selfie + liveness proof; returns PASS / REVIEW / FAIL |
| POST | `/api/v1/technicians/me/documents` | **Extend existing**: `docCategory`, `documentType`, `issuer`, `expiresAt`, file |
| DELETE | `/api/v1/technicians/me/documents/{id}` | Withdraw an unapproved document |
| POST | `/api/v1/technicians/me/skills/{tradeCode}/test/start` | Start skill test (returns questions) |
| POST | `/api/v1/technicians/me/skills/{tradeCode}/test/submit` | Submit answers (+ practical video ref) |
| POST | `/api/v1/technicians/me/references` | Add a reference (name, phone, relationship) |
| POST | `/api/v1/technicians/me/bank-account/verify` | Penny-drop verification (mock in demo) |

### Admin side (role ADMIN with KYC_REVIEWER permission)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/admin/technicians/pending` | **Extend existing**: filter by kycStatus, trade, flag |
| GET | `/api/v1/admin/technicians/{id}/kyc` | Full KYC case: identity result, face check, documents, tests, references |
| GET | `/api/v1/admin/technicians/{id}/documents/{docId}/view` | Short-lived signed URL (5 min). Every call is audited |
| PUT | `/api/v1/admin/technicians/{id}/documents/{docId}/review` | APPROVE / REJECT with `reasonCode` |
| PUT | `/api/v1/admin/technicians/{id}/skills/{tradeCode}/verify` | Grant L2 / L2-P / L3 for a trade (or reject) |
| PUT | `/api/v1/admin/technicians/{id}/references/{refId}` | Record reference call outcome |
| PUT | `/api/v1/admin/technicians/{id}/verify` | **Extend existing**: final decision + level; sends SMS/push |
| PUT | `/api/v1/admin/technicians/{id}/suspend` | Suspend / revoke (reason required) |
| GET | `/api/v1/admin/trade-licenses` / `PUT .../{id}` | Manage licence requirement table |

```
Rejection reason codes: BLURRY, WRONG_DOCUMENT, NAME_MISMATCH, EXPIRED, FACE_MISMATCH,
                        UNDERAGE, DUPLICATE_IDENTITY, FORGERY_SUSPECTED, INCOMPLETE, OTHER
Error codes: KYC_001 consent missing | KYC_002 identity failed | KYC_003 underage |
             KYC_004 face mismatch | KYC_005 test cool-down | KYC_006 max attempts |
             KYC_007 document expired | KYC_008 level too low for this trade
```

---

## 10. Matching and Job Gating (change to MatchingService)

```
A technician is a candidate for a job ONLY IF:
  technician.kyc_status = 'VERIFIED' AND technician.is_available = TRUE
  AND EXISTS technician_skill_verifications
        (technician_id = t.id AND trade_code IN job.skill_tags
         AND status = 'VERIFIED' AND (expires_at IS NULL OR expires_at >= CURRENT_DATE))
  AND (trade is regulated  ->  level_granted = 3 and a VERIFIED LICENCE row for that trade)
  AND (technician.is_provisional = FALSE OR job.estimated_cost_max <= provisional_cap)
  AND NOT fatigue_restricted

Skill score uses ONLY verified trade tags (declared-but-unverified tags score 0).
Show on cards: "Verified" badge, "Licensed" badge for L3, verified trade list.
Doorstep home jobs (electronics/appliance): police verification must be APPROVED.
```

Decision needed (docs currently disagree): a fatigue-restricted technician should be **excluded** from matching (safety), not just scored -50. Pick one and make FEATURES.md, TESTING.md and the code agree.

---

## 11. Admin Review Screen (admin-web)

```
Left: case summary (name, phone, trades, level, flags: DUPLICATE_IDENTITY / NAME_MISMATCH / LOW_FACE_SCORE)
Center: document viewer (signed URL, watermark "UPTIME KYC - reviewer id"), zoom, rotate
Right: extracted data vs profile data (name, YOB, last4) with match score + checklist:
  [ ] Name matches   [ ] Photo matches selfie   [ ] Document not expired
  [ ] Issuer genuine (opened SIDH / DigiLocker / phone call)   [ ] Trade matches evidence
Actions: Approve / Reject (reason code required) / Request resubmission / Escalate
SLA: 48 hours; show "waiting since" timer; oldest first.
Every view and decision -> audit_trail (actor, action, technician, doc, timestamp).
```

## 12. Technician Onboarding Wizard (tech-web + Flutter later)

```
Step 1  Phone OTP (done)         Step 5  Licence upload (only if trade is regulated)
Step 2  Profile + choose trades  Step 6  Bank account + penny drop
Step 3  Identity (consent -> Aadhaar QR / ID upload -> selfie)
Step 4  Skill proof + skill test per trade   Step 7  Status screen ("Under review", ETA, what is missing)
Each step saves progress. Show a progress bar and the current level (L0 -> L3).
Rejected items show the reason in plain language + [Resubmit].
```

---

## 13. Security and Privacy for KYC Data

```
- Documents stored PRIVATE (Cloudinary "authenticated"/private delivery or private bucket).
  Never put a KYC file behind a public URL. Admin views use signed URLs that expire in 5 minutes.
- PAN and bank account number encrypted at rest (AES-256-GCM). UI shows masked values.
- Only ADMIN with KYC_REVIEWER permission may open documents. Everyone else gets 403.
- Purge job (daily): delete raw ID images/selfies past delete_after (default 30 days after decision).
  Keep decision + metadata + audit log.
- Consent is stored and versioned. Technician can withdraw consent -> account moves to SUSPENDED
  until they re-verify; raw data deleted on request (except what law requires).
- Logging: mask 12-digit numbers, PAN pattern, bank account numbers.
- Law reference in SECURITY.md Section 24 is outdated: replace "PDPB 2023 (Bill)" with the
  Digital Personal Data Protection (DPDP) Act, 2023 and the DPDP Rules, 2025; confirm the current
  phase-in dates before launch.
- Rate limits: 3 identity attempts/day, 3 skill-test attempts/trade, 5 document uploads/hour.
```

## 14. Schedulers

```
KycDocumentExpiryScheduler (daily 03:00): notify at 30/7/1 days before expiry; mark EXPIRED;
                                          remove the trade from matching.
KycPurgeScheduler (daily 03:30):          delete raw ID images/selfies past delete_after.
KycSlaScheduler (hourly):                 alert admins about cases waiting > 36 hours.
ProvisionalReviewScheduler (daily):       provisional technicians with 10 completed jobs and rating >= 4.2
                                          -> queue for upgrade to L2.
```

## 15. Phasing (fits the Wave plan)

```
WAVE 1 (must for MVP)
  - Levels L0-L3 + gating in MatchingService
  - Consent + MockIdentityProvider + manual ID upload + selfie upload (admin compares by eye)
  - Private document storage + signed URLs + audit
  - Skill evidence upload + admin approve per trade
  - Admin review screen + tech onboarding wizard
  - Seed: 5 demo technicians at different levels (L0, L1, L2, L2-P, L3)
WAVE 2
  - Skill test (Gemini + fallback bank) + references + provisional route
  - Aadhaar Secure QR signature verification (AadhaarQrProvider)
  - Expiry / purge / SLA schedulers, bank penny-drop (mock), police verification flow
WAVE 3 / PRODUCTION
  - Licensed KYC API partner or own OVSE registration, DigiLocker pull, real face engine + liveness
```

## 16. Acceptance Tests

```
[ ] L0/L1 technician never appears in matching results
[ ] Technician with VERIFIED trade A is not matched for trade B
[ ] Expired licence removes the regulated trade from matching the same day
[ ] Provisional technician is excluded from jobs above the cap and from regulated trades
[ ] No table, log line or API response contains a 12-digit Aadhaar number (automated check)
[ ] KYC file URL cannot be opened without a valid signed URL; signed URL expires after 5 min
[ ] Non-KYC_REVIEWER admin gets 403 on document endpoints; every view creates an audit row
[ ] Underage (YOB) result -> KYC_003, cannot reach L1
[ ] Face score 75 -> REVIEW; 95 -> PASS; 50 -> FAIL; duplicate face -> flagged
[ ] Mock identity provider bean present with profile=prod -> app refuses to start
[ ] Skill test: 4th attempt blocked; cool-down enforced; Gemini failure falls back to question bank
[ ] Purge job removes raw ID images after delete_after, keeps decision rows
```

## 17. Files the Agent Must Update

```
PRD.md / FEATURES.md   CORE-10 -> reference this spec; add levels + provisional route
DATABASE.md            add V18 (Section 8); keep V2 untouched
API.md                 add Section 9 endpoints; extend /technicians/me/documents and admin verify
SECURITY.md            add Section 13; fix DPDP naming; Aadhaar storage rules (Section 4.4)
DESIGN.md              onboarding wizard (Section 12) + admin review screen (Section 11)
TESTING.md             add Section 16 cases
IMPLEMENTATION / PROJECT_UNDERSTANDING.md   place work in Waves per Section 15
```

---

*UPTIME Technician Verification Spec — v1.1 | DSATM Bengaluru — VTU 2026-27*
