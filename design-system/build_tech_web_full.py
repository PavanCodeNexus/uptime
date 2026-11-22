# -*- coding: utf-8 -*-
r"""
Metadata definitions for UPTIME Technician Web (apps/tech-web)
All 28 screens: TW01 - TW28
"""

screens_data = [
    {
        "code": "TW01", "module": "M1", "moduleLabel": "Auth & Onboarding", "component": "LoginPage.tsx",
        "title": "Technician Sign In & Specialist Lockup", "route": "/tech/login",
        "desc": "Official engineering portal authentication featuring the pitch-black UPTIME brand lockup, mobile/email login, and quick-demo level switcher.",
        "bullets": ["Pitch-black official UPTIME specialist emblem", "Corporate mobile & email authentication with rate limiting", "Demo specialist role switcher (L0 Novice to L3 Master)"]
    },
    {
        "code": "TW02", "module": "M1", "moduleLabel": "Auth & Onboarding", "component": "SignupPage.tsx",
        "title": "Specialist Registration & Trade KYC", "route": "/tech/signup",
        "desc": "Onboarding registration for certified technicians with trade selection, experience validation, and Aadhaar/PAN verification.",
        "bullets": ["Trade category selector (CNC, Fleets, Power Electronics)", "Years of experience & industrial plant cluster picker", "Aadhaar / PAN KYC document upload"]
    },
    {
        "code": "TW03", "module": "M1", "moduleLabel": "Auth & Onboarding", "component": "OTPPage.tsx",
        "title": "6-Digit Security OTP Verification", "route": "/tech/otp",
        "desc": "Multi-channel two-factor authentication with 60-second synchronized timer and instant SMS / WhatsApp resend.",
        "bullets": ["6-digit auto-advancing OTP input cells", "60-second security countdown timer", "Multi-channel WhatsApp & SMS fallback"]
    },
    {
        "code": "TW04", "module": "M1", "moduleLabel": "Auth & Onboarding", "component": "OnboardingPage.tsx",
        "title": "Trade Specialization & Sector Setup", "route": "/tech/onboarding",
        "desc": "Initial setup wizard configuring the technician's primary engineering trade, tool calibration certificates, and availability status.",
        "bullets": ["3 Core trade pathways: Industrial CNC, Commercial Fleets, Power Electronics", "Toolbox inspection & calibrated multimeter verification", "Immediate online dispatch eligibility grant"]
    },
    {
        "code": "TW05", "module": "M2", "moduleLabel": "Operations & Dispatch", "component": "DashboardPage.tsx",
        "title": "Field Specialist Command Cockpit", "route": "/tech/dashboard",
        "desc": "Central command cockpit with daily earnings ticker (₹1,850), 4 jobs completed, active job banner, and instant dispatch toggle.",
        "bullets": ["Live operational status toggle (Online / Offline / Busy)", "Active job banner (Job #UPT-2026-00891 with 1-click execution)", "Performance snapshot (96% Acceptance, 92% On-time, 4.9⭐ Rating)"]
    },
    {
        "code": "TW06", "module": "M2", "moduleLabel": "Operations & Dispatch", "component": "ActiveJobPage.tsx",
        "title": "Live Job Execution & LOTO Safety Console", "route": "/tech/jobs/active",
        "desc": "On-site execution workflow with 415V LOTO lockout safety checklist, AI multimodal photo capture, parts logger, and arrival OTP.",
        "bullets": ["Mandatory 415V Lockout-Tagout (LOTO) safety protocol sign-off", "Before & after photographic proof capture with timestamping", "Customer arrival OTP verification (8841) and digital handover signature"]
    },
    {
        "code": "TW07", "module": "M2", "moduleLabel": "Operations & Dispatch", "component": "DispatchOfferModal.tsx",
        "title": "60-Second Flash Emergency Dispatch Request", "route": "/tech/jobs/request",
        "desc": "High-priority full-screen dispatch notification with 60-second circular countdown ring, distance ETA, estimated fee, and 1-click accept.",
        "bullets": ["60-second synchronized countdown timer with audible alert", "Job breakdown: CNC Spindle Bearing Fault • 2.8 km away • ₹1,400 payout", "Prominent 80% width 1-click Accept button & decline reason selector"]
    },
    {
        "code": "TW08", "module": "M2", "moduleLabel": "Operations & Dispatch", "component": "JobHistoryPage.tsx",
        "title": "Completed Jobs Ledger & Invoices", "route": "/tech/jobs/history",
        "desc": "Searchable TanStack Table of past maintenance jobs with date, asset type, factory client, earnings, rating, and GST invoice download.",
        "bullets": ["Filterable data table with search, sector tags, and date range", "Direct link to job forensic dossier and customer ratings", "1-Click PDF tax invoice & payment receipt download"]
    },
    {
        "code": "TW09", "module": "M2", "moduleLabel": "Operations & Dispatch", "component": "JobDetailsPage.tsx",
        "title": "Job Forensic Dossier & Handover Certificate", "route": "/tech/jobs/detail",
        "desc": "Complete forensic documentation for completed jobs, including before/after photos, replaced parts serials, and tamper-proof SHA-256 certificate.",
        "bullets": ["Side-by-side photographic inspection proof", "Logged replacement parts with OEM serial numbers and 18% GST", "Tamper-proof SHA-256 verification seal and customer digital signature"]
    },
    {
        "code": "TW10", "module": "M3", "moduleLabel": "Earnings & Wallet", "component": "EarningsPage.tsx",
        "title": "Financial Command Center & Recharts Analytics", "route": "/tech/earnings",
        "desc": "Comprehensive earnings dashboard with gross earnings (₹38,450), 10% platform fee, 1% TDS, weekly Recharts bar/line chart, and ledger.",
        "bullets": ["Earnings breakdown: Gross (₹38,450), Platform Fee (₹3,845), TDS (₹384), Net (₹34,221)", "Weekly & monthly earnings trend chart (Recharts visualization)", "Direct link to instant bank withdrawal modal"]
    },
    {
        "code": "TW11", "module": "M3", "moduleLabel": "Earnings & Wallet", "component": "WithdrawModal.tsx",
        "title": "Instant Bank & UPI Withdrawal Portal", "route": "/tech/earnings/withdraw",
        "desc": "Immediate wallet payout gateway with verified bank account details (HDFC Bank), UPI ID, and instant IMPS settlement.",
        "bullets": ["Available wallet balance display (₹12,450) with ₹100 min withdrawal", "Verified bank account selection with IFSC and UPI handle", "Instant IMPS settlement confirmation with zero transfer fees"]
    },
    {
        "code": "TW12", "module": "M4", "moduleLabel": "Credentials & Badges", "component": "BadgesPage.tsx",
        "title": "Skill Badges & Polygon Blockchain NFTs", "route": "/tech/badges",
        "desc": "Gamified engineering progression vault featuring L0–L3 certification badges, progress bars, and verifiable Polygon NFT credentials.",
        "bullets": ["Tiered certification badges: L0 Novice to L3 Master Specialist", "Progress meters to next tier (e.g. 47 of 50 CNC jobs completed)", "Polygon blockchain NFT credentials with direct block explorer links"]
    },
    {
        "code": "TW13", "module": "M4", "moduleLabel": "Credentials & Badges", "component": "ProfilePage.tsx",
        "title": "Specialist Master Profile & Reputation", "route": "/tech/profile",
        "desc": "Public and verified profile displaying specialist tier, 4.9⭐ rating from 142 reviews, verified plant badges, and emergency response record.",
        "bullets": ["Master profile with verified photo, Level L2 Senior Specialist badge, and contact details", "Comprehensive rating breakdown (Punctuality 4.9⭐, Quality 5.0⭐, Safety 4.8⭐)", "Client testimonial carousel from Bangalore industrial corridors"]
    },
    {
        "code": "TW14", "module": "M4", "moduleLabel": "Credentials & Badges", "component": "SkillsPage.tsx",
        "title": "Trade Skills & Competency Matrix", "route": "/tech/skills",
        "desc": "Technical skills configuration matrix covering Siemens Sinumerik, Fanuc CNC, Bosch OBD-II, 415V LOTO safety, and tool calibrations.",
        "bullets": ["Interactive trade skill toggles with proficiency ratings (Novice to Master)", "OEM-certified machinery tags (Siemens, Fanuc, Haas, ABB)", "Specialized tool inventory verification (Thermal camera, calibrated Fluke multimeter)"]
    },
    {
        "code": "TW15", "module": "M4", "moduleLabel": "Credentials & Badges", "component": "DocumentsPage.tsx",
        "title": "KYC Document Vault & Compliance", "route": "/tech/documents",
        "desc": "Secure compliance locker for Aadhaar, PAN card, ITI/Diploma engineering degree, bank passbook, and police clearance certificate.",
        "bullets": ["Status badges for each document (Verified 🟢, In Review 🟡, Expiring Soon 🔴)", "High-res PDF and image preview modal with document details", "1-Click re-upload and government verification status checker"]
    },
    {
        "code": "TW16", "module": "M5", "moduleLabel": "Schedule & Service Area", "component": "AvailabilityPage.tsx",
        "title": "Availability Calendar & Working Hours", "route": "/tech/availability",
        "desc": "Interactive monthly calendar and weekly timetable allowing technicians to schedule shifts, mark off-days, and set emergency availability.",
        "bullets": ["Interactive monthly calendar with color-coded status (Available, Busy, Off)", "Weekly recurring working hours scheduler (Monday to Sunday, 08:00 to 20:00)", "Emergency 24/7 on-call availability toggle for bonus payouts"]
    },
    {
        "code": "TW17", "module": "M5", "moduleLabel": "Schedule & Service Area", "component": "ServiceAreaMap.tsx",
        "title": "Service Area Geofence & Radar", "route": "/tech/service-area",
        "desc": "Interactive radar map with a draggable 1–25 km service radius slider centered around the technician's home base or workshop depot.",
        "bullets": ["Google Maps style radar canvas with adjustable 1–25 km service radius slider", "Target industrial corridor selection (Peenya, Whitefield, E-City, Bommasandra)", "Live density overlay showing active breakdown hotspots and surge pricing"]
    },
    {
        "code": "TW18", "module": "M6", "moduleLabel": "Analytics & Performance", "component": "AnalyticsPage.tsx",
        "title": "Deep Performance Analytics & KPI Dashboard", "route": "/tech/analytics",
        "desc": "Comprehensive performance analytics tracking acceptance rate, on-time arrival, first-time fix rate, and peer comparison benchmarks.",
        "bullets": ["Key operational KPIs: Acceptance Rate (96%), On-time (92%), First-Time Fix (94%)", "Rating trend timeline over 12 months with customer sentiment analysis", "Peer benchmark comparison against top 5% of Bangalore industrial specialists"]
    },
    {
        "code": "TW19", "module": "M7", "moduleLabel": "Knowledge & Academy", "component": "LearningCenterPage.tsx",
        "title": "Specialist Academy & Training Courses", "route": "/tech/learning",
        "desc": "Continuing education portal featuring video training modules, 415V high-voltage safety courses, and certification upgrade exams.",
        "bullets": ["Interactive video courses with progress tracking and knowledge quizzes", "High-Voltage 415V Safety & Arc Flash certification course", "Automated badge issuance upon course completion"]
    },
    {
        "code": "TW20", "module": "M7", "moduleLabel": "Knowledge & Academy", "component": "WikiPage.tsx",
        "title": "Industrial Engineering Wiki & Schematics", "route": "/tech/wiki",
        "desc": "Searchable offline-ready technical knowledge base containing verified wiring schematics, error code lookups, and troubleshooting flowcharts.",
        "bullets": ["Searchable directory of 2,400+ verified machinery schematics", "Fast error code lookup for Siemens, Fanuc, Mitsubishi, and Delta controllers", "Bookmarkable offline reference cards for field repair"]
    },
    {
        "code": "TW21", "module": "M7", "moduleLabel": "Knowledge & Academy", "component": "WikiArticlePage.tsx",
        "title": "Siemens 828D Spindle Drive Schematic", "route": "/tech/wiki/article",
        "desc": "Detailed technical schematic for Siemens Sinumerik 828D 415V Spindle Drive with terminal pinouts, LOTO steps, and community upvotes.",
        "bullets": ["High-resolution interactive wiring schematic with terminal pinouts", "Step-by-step LOTO safety procedure and diagnostic flowchart", "Community peer verification badge (+64 verified senior engineers)"]
    },
    {
        "code": "TW22", "module": "M8", "moduleLabel": "Workshop & Inventory", "component": "WorkshopPage.tsx",
        "title": "Enterprise Workshop & Team Roster", "route": "/tech/workshop",
        "desc": "Multi-technician workshop management portal for team leads, tracking apprentice technicians, job allocation, and workshop capacity.",
        "bullets": ["Team roster with 6 active technicians and apprentice allocations", "Live workshop capacity gauge (78% utilized) and active jobs board", "1-Click job reassignment and team performance leaderboard"]
    },
    {
        "code": "TW23", "module": "M8", "moduleLabel": "Workshop & Inventory", "component": "InventoryPage.tsx",
        "title": "Van Toolkit & Spare Parts Stock Ledger", "route": "/tech/inventory",
        "desc": "Real-time inventory manager for van stock, calibrated multimeters, bearings, contactors, and automatic reorder alerts.",
        "bullets": ["Toolkit inventory table with calibration expiry dates (Fluke 87V, Megger)", "Critical spare parts stock (SKF bearings, Siemens 3RT contactors, Bussmann fuses)", "Automatic low-stock threshold alert and 1-click reorder via UPTIME Marketplace"]
    },
    {
        "code": "TW24", "module": "M9", "moduleLabel": "Settings & System", "component": "SettingsPage.tsx",
        "title": "Preferences, 9 Languages & Payout Config", "route": "/tech/settings",
        "desc": "Customizable settings console with 9 Indian languages switcher, high-volume sound alerts, security keys, and bank account settings.",
        "bullets": ["9 Indian language selector (English, Hindi, Kannada, Tamil, Telugu, Marathi, Bengali, Gujarati, Malayalam)", "Emergency notification ringtone & vibration intensity configurator", "Biometric authentication & withdrawal PIN security settings"]
    },
    {
        "code": "TW25", "module": "M9", "moduleLabel": "Settings & System", "component": "TermsPage.tsx",
        "title": "Technician Service Charter & Escrow Terms", "route": "/tech/terms",
        "desc": "Official platform agreement outlining T+1 escrow payout guarantees, safety non-negotiables, and insurance coverage terms.",
        "bullets": ["100% Escrow payout guarantee charter with T+1 bank settlement terms", "415V LOTO electrical safety compliance guidelines", "Platform code of conduct and customer property protection policy"]
    },
    {
        "code": "TW26", "module": "M9", "moduleLabel": "Settings & System", "component": "PrivacyPage.tsx",
        "title": "Privacy Policy & DPDP Act Compliance", "route": "/tech/privacy",
        "desc": "Technician privacy statement detailing DPDP Act 2023 compliance, GPS background location policies, and biometric data protection.",
        "bullets": ["DPDP Act 2023 compliance charter for engineering personnel", "Transparent GPS tracking policy (active only during accepted jobs)", "Encrypted Aadhaar and biometric storage with zero third-party disclosure"]
    },
    {
        "code": "TW27", "module": "M9", "moduleLabel": "Settings & System", "component": "NotFoundPage.tsx",
        "title": "404 Error Screen & Quick Recovery", "route": "/tech/404",
        "desc": "Branded error recovery screen with one-click return to the Technician Dashboard or active job console.",
        "bullets": ["Clean branded 404 illustration with high-contrast recovery CTA", "Quick links to Dashboard, Active Jobs, and Earnings", "Direct link to platform technical support"]
    },
    {
        "code": "TW28", "module": "M9", "moduleLabel": "Settings & System", "component": "OfflinePage.tsx",
        "title": "Offline Field Mode & Telemetry Sync", "route": "/tech/offline",
        "desc": "Resilient offline interface allowing technicians to log repairs and photo evidence offline, syncing automatically upon reconnection.",
        "bullets": ["Offline indicator with cached job instructions and local schematics", "Local storage queue for job completion photos and customer signature", "Automatic background sync upon cellular or Wi-Fi reconnection"]
    }
]
