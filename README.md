# UPTIME — On-Demand Repair & Technician Dispatch Platform

> **"Downtime ends here."**

UPTIME is a full-lifecycle, on-demand emergency repair, preventive maintenance, and technician dispatch ecosystem across three verticals:
- **Industrial Equipment & MSMEs** (CNCs, compressors, boilers, hydraulics, PLC systems)
- **Automobiles** (Commercial trucks, tractors, passenger vehicles, 2-wheelers, EVs)
- **Electronics & Commercial Appliances** (HVAC, refrigeration, PCB repair, smart appliances)

---

## Monorepo Structure

```text
uptime/
├── backend/                    # Spring Boot 3.3.x (Java 17 target, Maven Wrapper)
├── apps/
│   ├── owner-web/              # React 18 PWA (Vite + TypeScript + Tailwind + shadcn/ui)
│   ├── tech-web/               # React 18 (Technician & Workshop web portal)
│   ├── admin-web/              # React 18 (Admin dashboard & KYC review)
│   ├── technician-app/         # Flutter 3.x (Riverpod 2.x field app — Wave 2)
│   └── owner-app/              # Flutter 3.x (Owner mobile app — Wave 2)
├── packages/
│   └── shared/                 # Shared TypeScript types & contracts (React apps)
├── docs/                       # Complete project specifications & architecture docs
├── MEMORY.md                   # Agent memory & handoff log
└── .gitignore
```

---

## Documentation Index (`/docs`)

- [Product Requirements Document (`PRD.md`)](docs/PRD.md)
- [Project Understanding & Blueprint (`PROJECT_UNDERSTANDING.md`)](docs/PROJECT_UNDERSTANDING.md)
- [System Architecture (`ARCHITECTURE.md`)](docs/ARCHITECTURE.md)
- [Database Schema & Migrations V1–V18 (`DATABASE.md`)](docs/DATABASE.md)
- [REST & WebSocket API Reference (`API.md`)](docs/API.md)
- [Technician Verification & KYC Spec (`TECHNICIAN_VERIFICATION.md`)](docs/TECHNICIAN_VERIFICATION.md)
- [Complete Feature Catalog (`FEATURES.md`)](docs/FEATURES.md)
- [Security & DPDP Act Compliance (`SECURITY.md`)](docs/SECURITY.md)
- [UI/UX Design System (`DESIGN.md`)](docs/DESIGN.md)
- [Coding Standards (`CODING_STANDARDS.md`)](docs/CODING_STANDARDS.md)
- [Rules & Constraints (`RULES.md`)](docs/RULES.md)
- [Testing Strategy (`TESTING.md`)](docs/TESTING.md)
- [Implementation Roadmap (`IMPLEMENTATION.md`)](docs/IMPLEMENTATION.md)
- [Project Structure (`STRUCTURE.md`)](docs/STRUCTURE.md)
- [Agent Handoff Log (`MEMORY.md`)](MEMORY.md)

---

## Git Workflow

- `main` — Production-ready branch
- `develop` — Integration branch for feature PRs
- Feature branches: `feature/<module>-<short-description>` → PR into `develop`
