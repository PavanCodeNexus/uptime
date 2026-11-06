# UPTIME Technician Mobile App (Flutter 3.x + Riverpod 2.x)

> **"Downtime ends here."**

## Architecture & Key Flows
- **State Management:** Riverpod 2.x (`Provider`, `FutureProvider.autoDispose`, `AsyncNotifierProvider.autoDispose` — no codegen / no `build_runner`)
- **7-Step KYC & Skill Verification Wizard (CORE-10 / `TECHNICIAN_VERIFICATION.md`):**
  - **L0 → L1 Identity:** DPDP Act 2023 consent, DigiLocker Aadhaar (strictly blocks full 12-digit Aadhaar numbers; stores only last-4 digits), PAN match, Selfie Liveness (`98.4%`), and UPI Penny-Drop (`₹1`).
  - **L1 → L2 / L2-P Skill Proof:**
    - **Track A (`CERTIFIED`):** ITI / Diploma / OEM certificate + Regulated Trade Statutory License (`HV_ELECTRICIAN`, `BOILER_OPERATOR`, `COMMERCIAL_HVAC_GAS`).
    - **Track B (`EXPERIENCED_USTAD`):** 15-question Trade + Safety MCQ (`>= 70%` total & `2/2` mandatory safety questions) + 60–90s Practical Video Proof + Workshop Reference OTP → grants **Provisional `L2-P`** (capped at jobs `<= ₹3,000`, non-emergency, graduates to full `L2` after 5 jobs with rating `>= 4.2`).
- **Fatigue Rule Enforcement (`CORE-03` / `RULES.md` SB-00):**
  - Technicians with `isFatigueRestricted == true` are strictly excluded from matching queries (`AND is_fatigue_restricted = FALSE`) and see a mandatory rest-period countdown banner on their dashboard.
- **Field Execution:**
  - 60-second Incoming Job Request & Emergency Auction, 500m GPS Geofence + 6-digit Arrival OTP (`123456`), Field AI Copilot, Parts Logger, SHA-256 Tamper-Proof Job Completion, and NFT Skill Badges ⭐.
