# UPTIME Owner Mobile App (Flutter 3.x + Riverpod 2.x)

> **"Downtime ends here."**

## Architecture
- **State Management:** Riverpod 2.x (`Provider`, `FutureProvider.autoDispose`, `AsyncNotifierProvider.autoDispose` — no codegen / no `build_runner`)
- **HTTP Client:** Dio with JWT `AuthInterceptor` and automatic local demo fallback when offline
- **Core Flows:**
  1. Phone OTP Authentication (`123456` in dev/demo) & Industry Selection (`INDUSTRIAL`, `AUTOMOBILE`, `ELECTRONICS`)
  2. Fault Reporting (Voice/Text + Engine/Machine Sound Fingerprint ⭐) & Gemini AI Triage
  3. **3-Path Resolution Selection:**
     - **Path A:** Free Step-by-Step AI Copilot (with Escalation Banner after Step 3)
     - **Path B:** Video Consultation (`[Coming Soon]` in Wave 3, ₹149 fee credit preview)
     - **Path C:** Direct Technician Dispatch (`40% Skill + 60% Proximity` ranking, fatigued technicians strictly excluded)
  4. Live GPS Tracking, 500m Geofence Arrival OTP (`123456`), Digital Twin & Vehicle Mood Score ⭐, 18% GST Invoice, SHA-256 Tamper-Proof Certificate, and Escrow Checkout.

## Run Commands
```bash
flutter pub get
flutter test
flutter run
```
