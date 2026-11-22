// Auto-extracted native Figma Owner Web screens (44 screens: W01-W44, Figma Node 75:3).
// Scanned directly by Tailwind CSS so every utility class compiles natively into the Vite bundle.

export interface OwnerFigmaScreen {
  code: string;
  module: string;
  moduleLabel: string;
  component: string;
  title: string;
  route: string;
  appPath: string;
  desc: string;
  bullets: string[];
}

export const OWNER_MODULES = [
  { id: 'ALL', name: 'All 44 Screens', icon: 'fa-layer-group' },
  { id: 'M1', name: '1. Landing & Auth', icon: 'fa-door-open' },
  { id: 'M2', name: '2. Operations & SOS', icon: 'fa-gauge-high' },
  { id: 'M3', name: '3. Jobs & Evidence', icon: 'fa-clock-rotate-left' },
  { id: 'M4', name: '4. Asset Inventory', icon: 'fa-boxes-stacked' },
  { id: 'M5', name: '5. Digital Twin FFT', icon: 'fa-satellite-dish' },
  { id: 'M6', name: '6. Insurance & AMC', icon: 'fa-shield-halved' },
  { id: 'M7', name: '7. Marketplace & Pay', icon: 'fa-cart-shopping' },
  { id: 'M8', name: '8. Wiki & Settings', icon: 'fa-sliders' },
] as const;

export const OWNER_SCREENS: OwnerFigmaScreen[] = [
  {
    "code": "W01",
    "module": "M1",
    "moduleLabel": "Landing & Auth",
    "component": "LandingPage.tsx",
    "title": "Public Enterprise Landing & Hero Portal",
    "route": "/owner/landing",
    "desc": "High-converting B2B industrial & fleet emergency portal with 3-sector selector, live 15-minute SLA stats, and 1-click breakdown reporting.",
    "bullets": [
      "Hero with live dispatch metrics (98.4% SLA, 15m arrival)",
      "3-Sector showcase: Industrial, Auto Fleets, Electronics",
      "Instant emergency fault booking CTA & client logos"
    ],
    "appPath": "/"
  },
  {
    "code": "W02",
    "module": "M1",
    "moduleLabel": "Landing & Auth",
    "component": "LoginPage.tsx",
    "title": "Owner Sign In & Master Brand Lockup",
    "route": "/owner/login",
    "desc": "Official enterprise portal authentication featuring the pitch-black UPTIME master emblem and SMS/Email verification.",
    "bullets": [
      "Pitch-black official UPTIME brand lockup",
      "Corporate mobile & email input with rate limiting",
      "Enterprise Single Sign-On (Google / Azure AD)"
    ],
    "appPath": "/login"
  },
  {
    "code": "W03",
    "module": "M1",
    "moduleLabel": "Landing & Auth",
    "component": "SignupPage.tsx",
    "title": "Enterprise Factory & Fleet Registration",
    "route": "/owner/signup",
    "desc": "B2B registration flow capturing plant credentials, 18% GSTIN for Input Tax Credit, and cluster location.",
    "bullets": [
      "Factory / fleet company profile with GSTIN validation",
      "Industrial cluster picker (Peenya, Whitefield, Bommasandra)",
      "Automated UPTIME Pro Pass trial entitlement"
    ],
    "appPath": "/signup"
  },
  {
    "code": "W04",
    "module": "M1",
    "moduleLabel": "Landing & Auth",
    "component": "OTPPage.tsx",
    "title": "6-Digit Secure OTP Verification",
    "route": "/owner/otp-verify",
    "desc": "Fast two-factor phone verification with 60-second resend countdown and WhatsApp fallback.",
    "bullets": [
      "6 individual numeric code boxes with auto-focus",
      "Live 60-second countdown for SMS / WhatsApp resend",
      "Instant JWT session minting on validation"
    ],
    "appPath": "/otp-verify"
  },
  {
    "code": "W05",
    "module": "M1",
    "moduleLabel": "Landing & Auth",
    "component": "OnboardingPage.tsx",
    "title": "Industry & Plant Specialization Setup",
    "route": "/owner/onboarding",
    "desc": "Personalized setup wizard configuring primary industrial machinery, fleet vehicles, or cleanroom electronics.",
    "bullets": [
      "Interactive sector picker with icon badges",
      "Initial asset count and emergency contact config",
      "Unlocks ₹2,000 first-repair escrow credit"
    ],
    "appPath": "/onboarding"
  },
  {
    "code": "W06",
    "module": "M2",
    "moduleLabel": "Dashboard & Booking",
    "component": "DashboardPage.tsx",
    "title": "Owner Web Workstation Dashboard",
    "route": "/owner/dashboard",
    "desc": "Single-pane-of-glass operations cockpit showing ongoing dispatches, plant asset health, AI alerts, and spend analytics.",
    "bullets": [
      "Real-time active job progress tracker",
      "Plant asset health summary (Machines, Vehicles, Devices)",
      "AI Predictive maintenance alert & quick SOS actions"
    ],
    "appPath": "/dashboard"
  },
  {
    "code": "W07",
    "module": "M2",
    "moduleLabel": "Dashboard & Booking",
    "component": "ReportFaultPage.tsx",
    "title": "Report Breakdown & Multimodal Input",
    "route": "/owner/report-fault",
    "desc": "Multimodal fault reporting studio supporting voice dictation, acoustic sound recording, and high-res media upload.",
    "bullets": [
      "Web Speech API voice note transcription",
      "Drag-and-drop audio recording for acoustic analysis",
      "Urgency level selector: Normal (2h) vs SOS (15m)"
    ],
    "appPath": "/report"
  },
  {
    "code": "W08",
    "module": "M2",
    "moduleLabel": "Dashboard & Booking",
    "component": "AIDiagnosisPage.tsx",
    "title": "Gemini AI Multimodal Triage Results",
    "route": "/owner/ai-diagnosis",
    "desc": "Real-time diagnostic report generated by Gemini 2.5 multimodal AI with root cause probability and 415V safety warning.",
    "bullets": [
      "Root cause probability score (94.2% confidence)",
      "Mandatory 415V Lockout-Tagout (LOTO) safety notice",
      "Estimated repair cost range (₹8,000–₹12,000) & AI chat"
    ],
    "appPath": "/ai-diagnosis"
  },
  {
    "code": "W09",
    "module": "M2",
    "moduleLabel": "Dashboard & Booking",
    "component": "SelectTechnicianPage.tsx",
    "title": "Ranked Technician Dispatch Selection",
    "route": "/owner/select-technician",
    "desc": "40% Distance + 60% Skill ranked specialist directory displaying live arrival ETA, verification tier, and rating.",
    "bullets": [
      "40/60 match score badge on every technician",
      "L0–L3 tier badges + Polygon soulbound NFT proof",
      "1-click instant booking with escrow hold"
    ],
    "appPath": "/select-technician"
  },
  {
    "code": "W10",
    "module": "M2",
    "moduleLabel": "Dashboard & Booking",
    "component": "JobTrackingPage.tsx",
    "title": "Live PostGIS GPS Tracking & Telemetry",
    "route": "/owner/job-tracking",
    "desc": "High-precision Google Maps tracking console with moving technician pin, 500m geofence status, and 4-digit arrival OTP.",
    "bullets": [
      "Live moving GPS marker with real-time ETA countdown",
      "4-digit arrival verification OTP card",
      "Direct technician call & encrypted chat drawer"
    ],
    "appPath": "/tracking"
  },
  {
    "code": "W11",
    "module": "M3",
    "moduleLabel": "Job History",
    "component": "JobHistoryPage.tsx",
    "title": "Job History & Past Orders Ledger",
    "route": "/owner/job-history",
    "desc": "Filterable enterprise audit log of all completed, in-progress, and warranty-active repair jobs across plants.",
    "bullets": [
      "Multi-column searchable table with status badges",
      "Filter by sector: Industrial, Fleet, Electronics",
      "Instant tax invoice & service report download"
    ],
    "appPath": "/jobs"
  },
  {
    "code": "W12",
    "module": "M3",
    "moduleLabel": "Job History",
    "component": "JobDetailsPage.tsx",
    "title": "Forensic Job Handover & Cryptographic Certificate",
    "route": "/owner/job-details/JOB-9821",
    "desc": "Detailed post-repair audit dossier featuring before/after media, replaced OEM serials, and SHA-256 tamper-proof certificate.",
    "bullets": [
      "Side-by-side Before/After acoustic & visual evidence",
      "Replaced parts serial numbers & warranty barcodes",
      "Cryptographic SHA-256 tamper-proof certificate"
    ],
    "appPath": "/job-details"
  },
  {
    "code": "W13",
    "module": "M3",
    "moduleLabel": "Job History",
    "component": "RateJobPage.tsx",
    "title": "Double-Blind Mutual Rating (CORE-07)",
    "route": "/owner/rate-job",
    "desc": "Confidential 48-hour double-blind rating interface preventing retaliation, plus safety hazard reporting.",
    "bullets": [
      "Double-blind 1–5 star rating sealed for 48 hours",
      "Technician skill, punctuality, and safety scoring",
      "Confidential factory hazard tag (415V LOTO switch)"
    ],
    "appPath": "/rate-job"
  },
  {
    "code": "W14",
    "module": "M4",
    "moduleLabel": "Asset Management",
    "component": "MachinesPage.tsx",
    "title": "Industrial CNC & Machinery Directory",
    "route": "/owner/assets/machines",
    "desc": "Master inventory of factory machines with real-time health gauges, operating hours, and active breakdown alerts.",
    "bullets": [
      "Circular health score gauges (0–100%)",
      "Filter by machine type: CNC, Lathe, Press, Boiler",
      "1-click breakdown reporting from machine card"
    ],
    "appPath": "/machines"
  },
  {
    "code": "W15",
    "module": "M4",
    "moduleLabel": "Asset Management",
    "component": "MachineDetailsPage.tsx",
    "title": "Machine Technical Dossier & Digital Twin",
    "route": "/owner/assets/machines/M-101",
    "desc": "Comprehensive machine profile with electrical specifications, historical repairs, and direct Digital Twin link.",
    "bullets": [
      "Motor voltage, spindle RPM, and controller specs",
      "Complete chronological service history logs",
      "Linked Digital Twin telemetry & AMC status"
    ],
    "appPath": "/machines/M-101"
  },
  {
    "code": "W16",
    "module": "M4",
    "moduleLabel": "Asset Management",
    "component": "AddMachinePage.tsx",
    "title": "Add Industrial Machine (QR / Serial)",
    "route": "/owner/assets/machines/new",
    "desc": "Asset registration wizard supporting QR code scanning, OEM database lookup, and plant floor tagging.",
    "bullets": [
      "OEM catalog auto-complete (Siemens, Fanuc, Haas)",
      "QR code / barcode scanner integration",
      "Upload machine nameplate photo for OCR extraction"
    ],
    "appPath": "/machines/new"
  },
  {
    "code": "W17",
    "module": "M4",
    "moduleLabel": "Asset Management",
    "component": "VehiclesPage.tsx",
    "title": "Commercial Fleet & EV Directory",
    "route": "/owner/assets/vehicles",
    "desc": "Fleet management overview for commercial logistics trucks, delivery vans, and industrial electric forklifts.",
    "bullets": [
      "Fleet health cards with battery SoC / DEF level",
      "Filter by vehicle type: Diesel Heavy, Light Commercial, EV",
      "Active maintenance alerts & driver safety score"
    ],
    "appPath": "/vehicles"
  },
  {
    "code": "W18",
    "module": "M4",
    "moduleLabel": "Asset Management",
    "component": "VehicleDetailsPage.tsx",
    "title": "Fleet Vehicle Telemetry & OBD-II Logs",
    "route": "/owner/assets/vehicles/V-304",
    "desc": "Deep vehicle telemetry console with OBD-II fault codes, fuel economy, and acoustic engine fingerprint.",
    "bullets": [
      "Real-time OBD-II DTC fault code analyzer",
      "Fuel consumption & battery thermal cycle logs",
      "Engine acoustic sound signature comparison"
    ],
    "appPath": "/vehicles/V-304"
  },
  {
    "code": "W19",
    "module": "M4",
    "moduleLabel": "Asset Management",
    "component": "AddVehiclePage.tsx",
    "title": "Add Fleet Vehicle (VIN / RC Lookup)",
    "route": "/owner/assets/vehicles/new",
    "desc": "Fast fleet vehicle onboarding with automated Vahan database VIN lookup and RC document upload.",
    "bullets": [
      "Automated VIN / chassis number decoder",
      "Upload RC document for auto-field extraction",
      "Fleet operational zone assignment"
    ],
    "appPath": "/vehicles/new"
  },
  {
    "code": "W20",
    "module": "M4",
    "moduleLabel": "Asset Management",
    "component": "DevicesPage.tsx",
    "title": "Commercial Electronics & Power Systems",
    "route": "/owner/assets/devices",
    "desc": "Cleanroom electronics, server room UPS, 3-phase transformers, and SMT line equipment monitor.",
    "bullets": [
      "Server UPS & transformer load capacity indicators",
      "Capacitor ripple & thermal degradation monitors",
      "Smart IoT sensor connection status"
    ],
    "appPath": "/devices"
  },
  {
    "code": "W21",
    "module": "M4",
    "moduleLabel": "Asset Management",
    "component": "DeviceDetailsPage.tsx",
    "title": "Device Telemetry & IoT Sensor Grid",
    "route": "/owner/assets/devices/D-502",
    "desc": "Detailed sensor readings, power factor analysis, harmonic distortion, and firmware version management.",
    "bullets": [
      "Real-time voltage, current, and THD harmonic graphs",
      "Capacitor bank health & operating temperature",
      "Firmware OTA update status"
    ],
    "appPath": "/devices/D-502"
  },
  {
    "code": "W22",
    "module": "M4",
    "moduleLabel": "Asset Management",
    "component": "AddDevicePage.tsx",
    "title": "Add Commercial Power Device",
    "route": "/owner/assets/devices/new",
    "desc": "Device registration portal with IP/MAC address binding, power rating input, and warranty setup.",
    "bullets": [
      "Network device discovery & IP binding",
      "Power rating & battery backup configuration",
      "Upload installation warranty certificate"
    ],
    "appPath": "/devices/new"
  },
  {
    "code": "W23",
    "module": "M5",
    "moduleLabel": "Digital Twin",
    "component": "DigitalTwinPage.tsx",
    "title": "Digital Twin Command & Acoustic FFT",
    "route": "/owner/digital-twin",
    "desc": "Real-time physics-informed digital twin visualizing live vibration FFT spectrograms and predicting component failure.",
    "bullets": [
      "Live vibration FFT spectrum (84.2 dB anomaly detection)",
      "Component health grid (Spindle, Bearing, Motor, Drive)",
      "Countdown to predicted failure & 1-click preventive booking"
    ],
    "appPath": "/digital-twin"
  },
  {
    "code": "W24",
    "module": "M6",
    "moduleLabel": "Insurance & AMC",
    "component": "InsurancePage.tsx",
    "title": "Micro-Insurance & Warranty Hub",
    "route": "/owner/insurance",
    "desc": "Single dashboard managing per-job ₹15 micro-insurance policies, 30-day repair warranties, and AMC agreements.",
    "bullets": [
      "Active coverage status across all factory assets",
      "30-Day repair warranty countdown badges",
      "Annual Maintenance Contract (AMC) SLA tiers"
    ],
    "appPath": "/insurance"
  },
  {
    "code": "W25",
    "module": "M6",
    "moduleLabel": "Insurance & AMC",
    "component": "ClaimPage.tsx",
    "title": "File Warranty Revisit / Insurance Claim",
    "route": "/owner/insurance/claims/new",
    "desc": "Zero-friction claim filing flow for repeat breakdowns within 30 days or accidental damage during repair.",
    "bullets": [
      "Select covered job with active 30-day warranty",
      "Upload photo/video proof of recurring symptom",
      "Zero-dispatch-fee revisit booking guarantee"
    ],
    "appPath": "/insurance/claims/new"
  },
  {
    "code": "W26",
    "module": "M6",
    "moduleLabel": "Insurance & AMC",
    "component": "WarrantyPage.tsx",
    "title": "30-Day Repair Warranty Tracker",
    "route": "/owner/insurance/warranty",
    "desc": "Dedicated warranty management table tracking remaining days, terms of coverage, and instant claim triggers.",
    "bullets": [
      "Days-remaining progress bars on recent repairs",
      "Full coverage terms & exclusions checklist",
      "1-click request warranty re-visit"
    ],
    "appPath": "/insurance/warranty"
  },
  {
    "code": "W27",
    "module": "M6",
    "moduleLabel": "Insurance & AMC",
    "component": "AMCPage.tsx",
    "title": "Annual Maintenance Contracts (AMC) Desk",
    "route": "/owner/insurance/amc",
    "desc": "Enterprise multi-plant AMC contract tier manager with quarterly inspection schedules and dedicated engineer SLAs.",
    "bullets": [
      "Tier comparison: Basic, Pro, Enterprise 24/7",
      "Quarterly preventive maintenance calendar",
      "Dedicated cluster lead engineer assignment"
    ],
    "appPath": "/insurance/amc"
  },
  {
    "code": "W28",
    "module": "M7",
    "moduleLabel": "Marketplace & Spares",
    "component": "MarketplacePage.tsx",
    "title": "OEM Spare Parts Marketplace",
    "route": "/owner/marketplace",
    "desc": "Authorized parts procurement store with OEM/Refurbished inventory, 18% GST ITC invoices, and 60-min delivery.",
    "bullets": [
      "Categorized catalog: Bearings, Drives, Relays, Motors",
      "OEM Genuine vs Refurbished Grade A+/A chips",
      "Nearby cluster warehouse express courier ETA"
    ],
    "appPath": "/marketplace"
  },
  {
    "code": "W29",
    "module": "M7",
    "moduleLabel": "Marketplace & Spares",
    "component": "ProductDetailsPage.tsx",
    "title": "Part Details & Machine Fitment Check",
    "route": "/owner/marketplace/parts/SKF-7210",
    "desc": "Technical datasheet with OEM QR authenticity certificate and 1-click machine compatibility check.",
    "bullets": [
      "1-Click machine fitment check against plant inventory",
      "OEM manufacturer hologram / QR serial verification",
      "Stock availability across Peenya & Whitefield depots"
    ],
    "appPath": "/marketplace/parts/SKF-7210"
  },
  {
    "code": "W30",
    "module": "M7",
    "moduleLabel": "Marketplace & Spares",
    "component": "CartPage.tsx",
    "title": "Procurement Cart & Delivery Scheduling",
    "route": "/owner/cart",
    "desc": "Procurement cart with quantity adjustments, GST tax breakdown, and express cluster delivery options.",
    "bullets": [
      "Itemized spares with GSTIN tax input",
      "Delivery speed: 60-min SOS runner vs Scheduled",
      "Subtotal with transparent 18% GST breakdown"
    ],
    "appPath": "/cart"
  },
  {
    "code": "W31",
    "module": "M7",
    "moduleLabel": "Marketplace & Spares",
    "component": "CheckoutPage.tsx",
    "title": "Enterprise Multi-Plant Checkout",
    "route": "/owner/checkout",
    "desc": "Plant address selection, gate pass instructions, purchase order (PO) number binding, and delivery time slots.",
    "bullets": [
      "Plant delivery gate & security contact instructions",
      "Purchase Order (PO) & cost-center billing code",
      "Delivery slot selection with live driver dispatch"
    ],
    "appPath": "/checkout"
  },
  {
    "code": "W32",
    "module": "M7",
    "moduleLabel": "Marketplace & Spares",
    "component": "PaymentPage.tsx",
    "title": "Escrow Payment & Razorpay Gateway",
    "route": "/owner/payment",
    "desc": "100% Escrow protected checkout holding funds securely until digital handover and owner OTP release.",
    "bullets": [
      "100% Escrow hold guarantee until successful repair",
      "Payment options: UPI, Corporate NetBanking, Credit Line",
      "Instant GST tax invoice generation"
    ],
    "appPath": "/payment"
  },
  {
    "code": "W33",
    "module": "M7",
    "moduleLabel": "Marketplace & Spares",
    "component": "WalletPage.tsx",
    "title": "Uptime Pre-Funded Corporate Wallet",
    "route": "/owner/wallet",
    "desc": "Pre-funded wallet for automated one-click breakdown approvals, auto-recharge rules, and cashback ledger.",
    "bullets": [
      "Live balance with auto-refill threshold settings",
      "1-Click instant dispatch authorization without OTP",
      "Download monthly financial transaction statements"
    ],
    "appPath": "/wallet"
  },
  {
    "code": "W34",
    "module": "M7",
    "moduleLabel": "Marketplace & Spares",
    "component": "SubscriptionPage.tsx",
    "title": "Uptime Pro Pass (₹999/mo) Subscription",
    "route": "/owner/subscription",
    "desc": "Membership console unlocking zero-fee dispatches, guaranteed 15-minute emergency SLAs, and 5 free Digital Twins.",
    "bullets": [
      "Zero platform booking fee on all breakdown calls",
      "Priority emergency dispatch with 15-min SLA",
      "Includes 5 free Digital Twin telemetry slots"
    ],
    "appPath": "/subscription"
  },
  {
    "code": "W35",
    "module": "M8",
    "moduleLabel": "Wiki, Video & System",
    "component": "VideoConsultPage.tsx",
    "title": "Remote Specialist Video Tele-Consult",
    "route": "/owner/video-consult",
    "desc": "Remote audio/video consult workstation with real-time AR annotation tools for fast expert troubleshooting.",
    "bullets": [
      "Agora-powered HD video call with field specialist",
      "Interactive AR canvas annotations over live feed",
      "Wave 3 Coming Soon fallback badge per D14"
    ],
    "appPath": "/video-consult"
  },
  {
    "code": "W36",
    "module": "M8",
    "moduleLabel": "Wiki, Video & System",
    "component": "WikiPage.tsx",
    "title": "Field Repair Wiki & 415V Schematics",
    "route": "/owner/wiki",
    "desc": "Knowledge base of community-verified equipment manuals, 3-phase wiring schematics, and error code solvers.",
    "bullets": [
      "Search by OEM, controller model, or error code",
      "415V 3-phase wiring diagrams & LOTO procedures",
      "Community verified solutions with reputation scores"
    ],
    "appPath": "/wiki"
  },
  {
    "code": "W37",
    "module": "M8",
    "moduleLabel": "Wiki, Video & System",
    "component": "WikiArticlePage.tsx",
    "title": "Schematic Article & Pinout Diagram",
    "route": "/owner/wiki/articles/W-904",
    "desc": "Detailed technical article with high-res wiring diagram, pinout specs, required tools, and peer reviews.",
    "bullets": [
      "Full-width schematic viewer with zoom & pan",
      "LOTO safety checklist & recommended spare parts",
      "Step-by-step diagnostic test procedures"
    ],
    "appPath": "/wiki/W-904"
  },
  {
    "code": "W38",
    "module": "M8",
    "moduleLabel": "Wiki, Video & System",
    "component": "NotificationsPage.tsx",
    "title": "Plant Notifications & Alert Center",
    "route": "/owner/notifications",
    "desc": "Centralized feed for technician arrival alerts, predictive maintenance alarms, warranty notices, and billing receipts.",
    "bullets": [
      "Real-time push, SMS, and WhatsApp alerts log",
      "Filter by urgency: Critical SOS, Warning, Info",
      "1-Click action triggers from notification cards"
    ],
    "appPath": "/notifications"
  },
  {
    "code": "W39",
    "module": "M8",
    "moduleLabel": "Wiki, Video & System",
    "component": "ProfilePage.tsx",
    "title": "Enterprise Factory Owner Profile",
    "route": "/owner/profile",
    "desc": "Corporate identity settings, verified GSTIN certificate, plant manager contacts, and linked facility locations.",
    "bullets": [
      "Verified business profile & MSME registration",
      "Multi-plant facility addresses and floor managers",
      "Emergency security contact credentials"
    ],
    "appPath": "/profile"
  },
  {
    "code": "W40",
    "module": "M8",
    "moduleLabel": "Wiki, Video & System",
    "component": "SettingsPage.tsx",
    "title": "Workstation Settings & 9 Languages",
    "route": "/owner/settings",
    "desc": "Preferences console with 9 Indian languages switcher (EN, HI, KN, TA, TE, etc.), alert channels, and security keys.",
    "bullets": [
      "9-Language selection powered by Bhashini AI",
      "Multi-channel alert routing (SMS, WhatsApp, Email)",
      "Change master password & manage session tokens"
    ],
    "appPath": "/settings"
  },
  {
    "code": "W41",
    "module": "M8",
    "moduleLabel": "Wiki, Video & System",
    "component": "TermsPage.tsx",
    "title": "Terms of Service & Escrow Charter",
    "route": "/owner/terms",
    "desc": "Platform service level agreement, 10% commission policy, warranty coverage definitions, and escrow arbitration.",
    "bullets": [
      "15-Minute emergency response SLA charter",
      "Escrow protection & dispute arbitration rules",
      "Technician safety & 415V LOTO compliance terms"
    ],
    "appPath": "/terms"
  },
  {
    "code": "W42",
    "module": "M8",
    "moduleLabel": "Wiki, Video & System",
    "component": "PrivacyPage.tsx",
    "title": "Privacy Policy & DPDP Act 2023",
    "route": "/owner/privacy",
    "desc": "Transparent data protection policy complying with Digital Personal Data Protection Act 2023.",
    "bullets": [
      "DPDP Act 2023 compliance & data masking rules",
      "Telemetry data retention & encryption standards",
      "Data principal rights & 1-click data deletion request"
    ],
    "appPath": "/privacy"
  },
  {
    "code": "W43",
    "module": "M8",
    "moduleLabel": "Wiki, Video & System",
    "component": "NotFoundPage.tsx",
    "title": "404 Page Not Found",
    "route": "/owner/404",
    "desc": "Branded error screen guiding the user back to the active plant dashboard, asset directory, or breakdown SOS desk.",
    "bullets": [
      "Branded UPTIME diagnostic error graphic",
      "Quick links to Dashboard, Assets, and SOS Desk",
      "Contact 24/7 NOC helpline button"
    ],
    "appPath": "/404"
  },
  {
    "code": "W44",
    "module": "M8",
    "moduleLabel": "Wiki, Video & System",
    "component": "OfflinePage.tsx",
    "title": "Offline Mode & Local Queue Sync",
    "route": "/owner/offline",
    "desc": "Network disconnection screen providing cached asset specs, emergency phone hotline, and queued sync.",
    "bullets": [
      "Visual offline alert with network reconnection detector",
      "Access cached emergency plant phone numbers",
      "Local queue syncs automatically upon reconnect"
    ],
    "appPath": "/offline"
  }
];

export const OWNER_SCREEN_BY_CODE: Record<string, OwnerFigmaScreen> = Object.fromEntries(
  OWNER_SCREENS.map((s) => [s.code, s]),
);

export const OWNER_SCREEN_HTML: Record<string, string> = {
  "W01": "\n            <div class=\"space-y-6\">\n              <!-- Hero Banner -->\n              <div class=\"rounded-3xl bg-slate-900 text-white p-8 border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[360px]\">\n                <div class=\"flex items-center justify-between z-10\">\n                  <span class=\"px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[11px] font-bold\">15-MINUTE EMERGENCY SLA GUARANTEED</span>\n                  <span class=\"text-xs font-mono text-slate-400\">ISO 9001:2015 CERTIFIED DISPATCH</span>\n                </div>\n                <div class=\"my-auto py-6 max-w-2xl space-y-3 z-10\">\n                  <div class=\"text-3xl sm:text-4xl font-display font-black tracking-tight text-white leading-tight\">\n                    Downtime Ends Here. <span class=\"text-[#00D4AA]\">Predict. Repair. Perform.</span>\n                  </div>\n                  <p class=\"text-sm text-slate-300 leading-relaxed\">\n                    India's first specialized on-demand engineering network for Industrial CNC Machinery, Commercial Fleets, and Power Electronics. 2,840 certified specialists available 24/7 with 100% escrow protection.\n                  </p>\n                  <div class=\"flex flex-wrap items-center gap-3 pt-2\">\n                    <button data-nav-screen=\"W07\" class=\"px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg flex items-center gap-2\">\n                      <i class=\"fa-solid fa-triangle-exclamation\"></i>\n                      <span>Report Machine Breakdown (SOS)</span>\n                    </button>\n                    <button data-nav-screen=\"W06\" class=\"px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20\">\n                      <span>Open Factory Dashboard</span>\n                    </button>\n                  </div>\n                </div>\n                <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 z-10 font-mono text-xs\">\n                  <div><div class=\"text-xl font-black text-emerald-400\">11.4 Mins</div><div class=\"text-[10px] text-slate-400\">Median Arrival Time</div></div>\n                  <div><div class=\"text-xl font-black text-indigo-400\">98.4%</div><div class=\"text-[10px] text-slate-400\">On-Time SLA Rate</div></div>\n                  <div><div class=\"text-xl font-black text-sky-400\">2,840</div><div class=\"text-[10px] text-slate-400\">Certified L0–L3 Techs</div></div>\n                  <div><div class=\"text-xl font-black text-purple-400\">42.8 Tons</div><div class=\"text-[10px] text-slate-400\">CO2 Saved (ESG)</div></div>\n                </div>\n              </div>\n\n              <!-- 3 Sector Cards -->\n              <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n                <div class=\"p-5 rounded-2xl bg-white border border-slate-200 space-y-2 hover:border-purple-500 transition-all\">\n                  <div class=\"w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg\"><i class=\"fa-solid fa-industry\"></i></div>\n                  <h3 class=\"text-sm font-bold text-slate-900\">Industrial Machinery & CNC</h3>\n                  <p class=\"text-xs text-slate-500\">Siemens, Fanuc, Haas, Mazak 415V CNCs, Hydraulic presses, Boilers, and Spindles.</p>\n                </div>\n                <div class=\"p-5 rounded-2xl bg-white border border-slate-200 space-y-2 hover:border-blue-500 transition-all\">\n                  <div class=\"w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg\"><i class=\"fa-solid fa-truck-moving\"></i></div>\n                  <h3 class=\"text-sm font-bold text-slate-900\">Commercial Auto & EV Fleets</h3>\n                  <p class=\"text-xs text-slate-500\">Tata, Ashok Leyland, BharatBenz BS-VI diesel & EV delivery fleets with roadside SOS.</p>\n                </div>\n                <div class=\"p-5 rounded-2xl bg-white border border-slate-200 space-y-2 hover:border-cyan-500 transition-all\">\n                  <div class=\"w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-lg\"><i class=\"fa-solid fa-microchip\"></i></div>\n                  <h3 class=\"text-sm font-bold text-slate-900\">Cleanroom & Power Electronics</h3>\n                  <p class=\"text-xs text-slate-500\">Server room UPS, 3-Phase transformers, SMT placement lines, and capacitor banks.</p>\n                </div>\n              </div>\n            </div>",
  "W02": "\n            <div class=\"grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[520px]\">\n              <div class=\"lg:col-span-6 rounded-3xl bg-black text-white p-8 flex flex-col justify-between border border-slate-800\">\n                <div class=\"flex items-center justify-between\">\n                  <span class=\"px-2.5 py-1 rounded-full bg-white/10 text-emerald-400 font-mono text-[10px] uppercase font-bold\">OWNER WORKSTATION</span>\n                  <span class=\"text-xs text-slate-400 font-mono\">SECURE HTTPS</span>\n                </div>\n                <div class=\"my-auto py-6 text-center space-y-3\">\n                  <div class=\"w-24 h-24 mx-auto rounded-3xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-xl\">\n                    <svg class=\"w-16 h-16\" viewBox=\"0 0 100 100\" fill=\"none\">\n                      <path d=\"M22 22 V 56 C 22 76, 78 76, 78 56 V 22\" stroke=\"#FFFFFF\" stroke-width=\"13\" stroke-linecap=\"round\" />\n                      <path d=\"M62 38 L78 18 L92 38\" stroke=\"#00D4AA\" stroke-width=\"9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />\n                      <circle cx=\"50\" cy=\"48\" r=\"12\" stroke=\"#38BDF8\" stroke-width=\"6\" stroke-dasharray=\"7 5\" />\n                    </svg>\n                  </div>\n                  <div class=\"text-3xl font-display font-black text-white\">UPTIME</div>\n                  <div class=\"text-[11px] font-mono tracking-[0.25em] text-[#00D4AA] font-bold\">PREDICT. REPAIR. PERFORM.</div>\n                  <p class=\"text-xs text-slate-400 max-w-xs mx-auto\">Access real-time plant diagnostics, 15m technician dispatch, and escrow ledger.</p>\n                </div>\n                <div class=\"pt-3 border-t border-zinc-800 text-[11px] font-mono text-slate-500 flex justify-between\">\n                  <span>100% ESCROW PROTECTED</span>\n                  <span>DPDP ACT 2023</span>\n                </div>\n              </div>\n\n              <div class=\"lg:col-span-6 p-7 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs\">\n                <div class=\"space-y-4\">\n                  <div>\n                    <h3 class=\"text-xl font-display font-extrabold text-slate-900\">Sign In to Owner Portal</h3>\n                    <p class=\"text-xs text-slate-500 mt-1\">Enter your registered business phone or email to receive a login OTP.</p>\n                  </div>\n\n                  <div class=\"space-y-3 pt-2\">\n                    <div>\n                      <label class=\"block text-[11px] font-mono font-bold uppercase text-slate-500 mb-1\">Mobile Number / Official Email</label>\n                      <div class=\"flex rounded-xl bg-slate-50 border border-slate-200 overflow-hidden text-xs\">\n                        <span class=\"px-3 py-2.5 bg-slate-100 text-slate-600 font-bold border-r border-slate-200\">+91</span>\n                        <input type=\"text\" value=\"98450 88210\" class=\"flex-1 px-3 py-2.5 bg-transparent font-semibold outline-none\" />\n                      </div>\n                    </div>\n                    <div>\n                      <label class=\"block text-[11px] font-mono font-bold uppercase text-slate-500 mb-1\">Password</label>\n                      <input type=\"password\" value=\"••••••••••••\" class=\"w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono outline-none\" />\n                    </div>\n                  </div>\n                </div>\n\n                <div class=\"space-y-2.5 pt-4\">\n                  <button data-nav-screen=\"W04\" class=\"w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2\">\n                    <span>Send Secure 6-Digit OTP</span>\n                    <i class=\"fa-solid fa-arrow-right\"></i>\n                  </button>\n                  <div class=\"text-center text-xs text-slate-500\">\n                    New plant or fleet? <button data-nav-screen=\"W03\" class=\"text-blue-600 font-bold hover:underline\">Register your company</button>\n                  </div>\n                </div>\n              </div>\n            </div>",
  "W03": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-5\">\n              <div class=\"flex items-center justify-between border-b border-slate-100 pb-3\">\n                <div>\n                  <h3 class=\"text-lg font-display font-black text-slate-900\">Enterprise Factory & Fleet Registration</h3>\n                  <p class=\"text-xs text-slate-500\">Register your company for 18% GST Input Tax Credit (ITC) and guaranteed 15m SLAs.</p>\n                </div>\n                <span class=\"px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-bold\">STEP 1 OF 2</span>\n              </div>\n\n              <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\">\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Company / Plant Name</label>\n                  <input type=\"text\" value=\"Apex Precision Tools Pvt Ltd\" class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold outline-none\" />\n                </div>\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">GSTIN Number (for 18% ITC Invoice)</label>\n                  <input type=\"text\" value=\"29AAACA1234A1Z5\" class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-indigo-700 outline-none\" />\n                </div>\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Industrial Cluster / Location</label>\n                  <select class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold outline-none\">\n                    <option>Peenya Industrial Cluster #4, Bengaluru</option>\n                    <option>Whitefield Auto & Logistics Corridor</option>\n                    <option>Bommasandra Heavy CNC Zone</option>\n                  </select>\n                </div>\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Plant Emergency Phone</label>\n                  <input type=\"text\" value=\"+91 98450 88210\" class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono outline-none\" />\n                </div>\n              </div>\n\n              <div class=\"p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between\">\n                <span><i class=\"fa-solid fa-gift mr-2\"></i>Includes 30-Day Free UPTIME Pro Pass Trial (₹999 Value • Zero Dispatch Fees)</span>\n                <span class=\"font-bold\">FREE TRIAL</span>\n              </div>\n\n              <div class=\"flex justify-end gap-2 pt-2\">\n                <button data-nav-screen=\"W02\" class=\"px-4 py-2 rounded-xl bg-slate-100 font-bold text-xs text-slate-700\">Back to Login</button>\n                <button data-nav-screen=\"W04\" class=\"px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm\">Proceed to Verify Phone</button>\n              </div>\n            </div>",
  "W04": "\n            <div class=\"max-w-md mx-auto p-7 rounded-3xl bg-white border border-slate-200 space-y-5 text-center shadow-sm\">\n              <div class=\"w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl\">\n                <i class=\"fa-solid fa-shield-halved\"></i>\n              </div>\n              <div>\n                <h3 class=\"text-xl font-display font-black text-slate-900\">Verify Your Phone</h3>\n                <p class=\"text-xs text-slate-500 mt-1\">We sent a 6-digit code to <span class=\"font-mono font-bold text-slate-800\">+91 98450 88210</span></p>\n              </div>\n\n              <div class=\"grid grid-cols-6 gap-2 py-2\">\n                <div class=\"h-12 rounded-xl bg-slate-50 border-2 border-blue-600 flex items-center justify-center font-mono text-lg font-black text-slate-900\">4</div><div class=\"h-12 rounded-xl bg-slate-50 border-2 border-blue-600 flex items-center justify-center font-mono text-lg font-black text-slate-900\">7</div><div class=\"h-12 rounded-xl bg-slate-50 border-2 border-blue-600 flex items-center justify-center font-mono text-lg font-black text-slate-900\">2</div><div class=\"h-12 rounded-xl bg-slate-50 border-2 border-blue-600 flex items-center justify-center font-mono text-lg font-black text-slate-900\">9</div><div class=\"h-12 rounded-xl bg-slate-50 border-2 border-blue-600 flex items-center justify-center font-mono text-lg font-black text-slate-900\">1</div><div class=\"h-12 rounded-xl bg-slate-50 border-2 border-blue-600 flex items-center justify-center font-mono text-lg font-black text-slate-900\">8</div>\n              </div>\n\n              <div class=\"text-xs text-slate-500\">\n                Resend code via WhatsApp in <span class=\"font-mono font-bold text-blue-600\">00:48</span>\n              </div>\n\n              <button data-nav-screen=\"W06\" class=\"w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md\">\n                Verify & Enter Dashboard\n              </button>\n            </div>",
  "W05": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-5\">\n              <div class=\"text-center max-w-md mx-auto space-y-1\">\n                <h3 class=\"text-xl font-display font-black text-slate-900\">Configure Your Primary Sector</h3>\n                <p class=\"text-xs text-slate-500\">Tailors your diagnostic AI, spare parts catalog, and certified engineer dispatch.</p>\n              </div>\n\n              <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n                <div data-nav-screen=\"W06\" class=\"p-5 rounded-2xl border-2 border-purple-600 bg-purple-50/50 cursor-pointer space-y-3\">\n                  <div class=\"w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center text-lg\"><i class=\"fa-solid fa-industry\"></i></div>\n                  <h4 class=\"font-bold text-sm text-slate-900\">Industrial Machinery</h4>\n                  <p class=\"text-xs text-slate-600\">CNC Machines, Lathes, Hydraulic Presses, Boilers, and 415V Inverters.</p>\n                  <span class=\"inline-block px-2.5 py-0.5 rounded bg-purple-200 text-purple-800 text-[10px] font-mono font-bold\">RECOMMENDED</span>\n                </div>\n                <div data-nav-screen=\"W06\" class=\"p-5 rounded-2xl border border-slate-200 hover:border-blue-600 bg-white cursor-pointer space-y-3\">\n                  <div class=\"w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg\"><i class=\"fa-solid fa-truck-moving\"></i></div>\n                  <h4 class=\"font-bold text-sm text-slate-900\">Commercial Fleets</h4>\n                  <p class=\"text-xs text-slate-600\">Heavy Diesel Trucks, Delivery Vans, Electric Forklifts, Roadside SOS.</p>\n                  <span class=\"inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono\">BS-VI & EV</span>\n                </div>\n                <div data-nav-screen=\"W06\" class=\"p-5 rounded-2xl border border-slate-200 hover:border-cyan-600 bg-white cursor-pointer space-y-3\">\n                  <div class=\"w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center text-lg\"><i class=\"fa-solid fa-microchip\"></i></div>\n                  <h4 class=\"font-bold text-sm text-slate-900\">Cleanroom & Power</h4>\n                  <p class=\"text-xs text-slate-600\">Server Room UPS, 3-Phase Transformers, SMT Lines, and Medical Chillers.</p>\n                  <span class=\"inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono\">HIGH PRECISION</span>\n                </div>\n              </div>\n            </div>",
  "W06": "\n            <div class=\"space-y-5\">\n              <!-- Quick Actions Strip -->\n              <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-3\">\n                <button data-nav-screen=\"W07\" class=\"p-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-left space-y-1 shadow-md\">\n                  <div class=\"text-xs font-mono uppercase text-rose-200 font-bold\"><i class=\"fa-solid fa-bolt mr-1\"></i>EMERGENCY SOS</div>\n                  <div class=\"text-sm font-bold\">Report Breakdown</div>\n                  <div class=\"text-[10px] text-rose-100\">15m Arrival SLA</div>\n                </button>\n                <button data-nav-screen=\"W23\" class=\"p-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-left space-y-1 shadow-md\">\n                  <div class=\"text-xs font-mono uppercase text-purple-200 font-bold\"><i class=\"fa-solid fa-brain mr-1\"></i>AI DIAGNOSTICS</div>\n                  <div class=\"text-sm font-bold\">Digital Twin Console</div>\n                  <div class=\"text-[10px] text-purple-100\">Acoustic Vibration FFT</div>\n                </button>\n                <button data-nav-screen=\"W28\" class=\"p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 text-left space-y-1\">\n                  <div class=\"text-xs font-mono uppercase text-slate-400 font-bold\"><i class=\"fa-solid fa-boxes-stacked mr-1\"></i>SPARE PARTS</div>\n                  <div class=\"text-sm font-bold text-slate-900\">Procure OEM Spares</div>\n                  <div class=\"text-[10px] text-slate-500\">60m Depot Delivery</div>\n                </button>\n                <button data-nav-screen=\"W27\" class=\"p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 text-left space-y-1\">\n                  <div class=\"text-xs font-mono uppercase text-slate-400 font-bold\"><i class=\"fa-solid fa-calendar-check mr-1\"></i>MAINTENANCE</div>\n                  <div class=\"text-sm font-bold text-slate-900\">Annual AMC Desk</div>\n                  <div class=\"text-[10px] text-emerald-600 font-bold\">Quarterly Audit Active</div>\n                </button>\n              </div>\n\n              <!-- Active Job Card -->\n              <div class=\"p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4\">\n                <div class=\"flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3\">\n                  <div class=\"flex items-center gap-3\">\n                    <span class=\"w-3 h-3 rounded-full bg-emerald-400 pulse-live\"></span>\n                    <div>\n                      <div class=\"text-xs font-mono text-emerald-400 font-bold\">ACTIVE BREAKDOWN JOB #JOB-9821</div>\n                      <div class=\"text-base font-bold text-white\">Siemens Sinumerik 828D — Spindle Vibration & 415V Warning</div>\n                    </div>\n                  </div>\n                  <div class=\"px-3 py-1.5 rounded-xl bg-black/60 border border-slate-700 font-mono text-xs flex items-center gap-2\">\n                    <span class=\"text-slate-400\">ARRIVAL OTP:</span>\n                    <span class=\"text-lg font-black text-amber-400 tracking-wider\">8841</span>\n                  </div>\n                </div>\n\n                <!-- Stepper -->\n                <div class=\"grid grid-cols-5 gap-2 text-center text-[11px] font-mono\">\n                  <div class=\"p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30\">✓ Triage Done</div>\n                  <div class=\"p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30\">✓ Dispatched</div>\n                  <div class=\"p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold\">● En-Route (8m)</div>\n                  <div class=\"p-2 rounded-xl bg-slate-800 text-slate-500\">4. In-Repair</div>\n                  <div class=\"p-2 rounded-xl bg-slate-800 text-slate-500\">5. Handover</div>\n                </div>\n\n                <div class=\"flex flex-wrap items-center justify-between gap-2 text-xs pt-1\">\n                  <div class=\"text-slate-300\">\n                    Assigned Specialist: <span class=\"font-bold text-white\">Ramesh K. (L2-P Ustad • 4.84★)</span> • 1.1 km away\n                  </div>\n                  <button data-nav-screen=\"W10\" class=\"px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2\">\n                    <i class=\"fa-solid fa-map-location-dot\"></i>\n                    <span>Track Live GPS Radar</span>\n                  </button>\n                </div>\n              </div>\n\n              <!-- Plant Health Row -->\n              <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n                <div class=\"p-4 rounded-2xl bg-white border border-slate-200 space-y-1\">\n                  <div class=\"flex justify-between text-xs text-slate-500 font-mono\"><span>MACHINERY HEALTH</span><span class=\"text-purple-600 font-bold\">28 ASSETS</span></div>\n                  <div class=\"text-2xl font-black text-slate-900\">94.2%</div>\n                  <div class=\"text-[11px] text-emerald-600 font-semibold\">27 Nominal • 1 In-Repair</div>\n                </div>\n                <div class=\"p-4 rounded-2xl bg-white border border-slate-200 space-y-1\">\n                  <div class=\"flex justify-between text-xs text-slate-500 font-mono\"><span>FLEET LOGISTICS</span><span class=\"text-blue-600 font-bold\">54 TRUCKS</span></div>\n                  <div class=\"text-2xl font-black text-slate-900\">96.8%</div>\n                  <div class=\"text-[11px] text-emerald-600 font-semibold\">53 Nominal • 1 Scheduled PM</div>\n                </div>\n                <div class=\"p-4 rounded-2xl bg-white border border-slate-200 space-y-1\">\n                  <div class=\"flex justify-between text-xs text-slate-500 font-mono\"><span>CLEANROOM UPS</span><span class=\"text-cyan-600 font-bold\">14 UNITS</span></div>\n                  <div class=\"text-2xl font-black text-slate-900\">99.1%</div>\n                  <div class=\"text-[11px] text-emerald-600 font-semibold\">All 14 Units Synchronized</div>\n                </div>\n              </div>\n            </div>",
  "W07": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-5\">\n              <div class=\"flex items-center justify-between border-b border-slate-100 pb-3\">\n                <div>\n                  <h3 class=\"text-lg font-display font-black text-slate-900\">Report Equipment Breakdown (Multimodal AI Studio)</h3>\n                  <p class=\"text-xs text-slate-500\">Voice memo, acoustic noise recording, and photo analysis powered by Gemini 2.5.</p>\n                </div>\n                <span class=\"px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-mono text-xs font-bold\">EMERGENCY SOS MODE</span>\n              </div>\n\n              <div class=\"space-y-4 text-xs\">\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Select Affected Machine / Vehicle</label>\n                  <select class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 outline-none\">\n                    <option>Siemens Sinumerik 828D CNC Milling (M-101 • Bay 2)</option>\n                    <option>Haas VF-2 Vertical Machining Center (M-104)</option>\n                    <option>Tata Prima 4028.S Logistics Truck (V-304)</option>\n                  </select>\n                </div>\n\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Describe Symptoms (Voice or Text)</label>\n                  <div class=\"relative\">\n                    <textarea rows=\"3\" class=\"w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none font-medium\" placeholder=\"Describe the sound, error code, or smoke...\"></textarea>\n                    <button class=\"absolute right-3 bottom-3 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-[11px] flex items-center gap-1.5\">\n                      <i class=\"fa-solid fa-microphone\"></i>\n                      <span>Voice Record</span>\n                    </button>\n                  </div>\n                </div>\n\n                <!-- Acoustic Sound Recording Box -->\n                <div class=\"p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-wrap items-center justify-between gap-3\">\n                  <div class=\"flex items-center gap-3\">\n                    <div class=\"w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center text-lg\"><i class=\"fa-solid fa-file-audio\"></i></div>\n                    <div>\n                      <div class=\"font-bold text-purple-900\">Acoustic Sound Recorded: spindle_bearing_knock.wav (6.2s)</div>\n                      <div class=\"text-[11px] text-purple-700 font-mono\">Gemini FFT Waveform Ready: 84.2 dB Spike at 2.4 kHz</div>\n                    </div>\n                  </div>\n                  <span class=\"px-2.5 py-1 rounded-lg bg-purple-200 text-purple-900 font-mono text-[10px] font-bold\">READY FOR TRIAGE</span>\n                </div>\n\n                <!-- Urgency Selector -->\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Urgency SLA Commitment</label>\n                  <div class=\"grid grid-cols-2 gap-3\">\n                    <div class=\"p-3 rounded-xl border-2 border-rose-600 bg-rose-50/50 cursor-pointer space-y-1\">\n                      <div class=\"font-bold text-rose-900 flex items-center justify-between\">\n                        <span>Emergency Breakdown (SOS)</span>\n                        <i class=\"fa-solid fa-circle-check text-rose-600\"></i>\n                      </div>\n                      <div class=\"text-[11px] text-rose-700\">15-Minute Guaranteed Arrival SLA • Line Stoppage Priority</div>\n                    </div>\n                    <div class=\"p-3 rounded-xl border border-slate-200 bg-white cursor-pointer space-y-1\">\n                      <div class=\"font-bold text-slate-900\">Scheduled Diagnostic</div>\n                      <div class=\"text-[11px] text-slate-500\">2-Hour Arrival Window • Preventive check</div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <div class=\"flex justify-end gap-2 pt-2 border-t border-slate-100\">\n                <button data-nav-screen=\"W06\" class=\"px-4 py-2.5 rounded-xl bg-slate-100 font-bold text-xs text-slate-700\">Cancel</button>\n                <button data-nav-screen=\"W08\" class=\"px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-2\">\n                  <i class=\"fa-solid fa-brain\"></i>\n                  <span>Submit to Gemini AI Triage</span>\n                </button>\n              </div>\n            </div>",
  "W08": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-5\">\n              <div class=\"flex items-center justify-between border-b border-slate-100 pb-3\">\n                <div>\n                  <h3 class=\"text-lg font-display font-black text-slate-900\">Gemini AI Diagnostic Report</h3>\n                  <p class=\"text-xs text-slate-500\">Multimodal acoustic FFT + error code analysis • Completed in 1.4 seconds</p>\n                </div>\n                <span class=\"px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs font-bold\">94.2% CONFIDENCE</span>\n              </div>\n\n              <!-- LOTO Safety Warning -->\n              <div class=\"p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex items-center gap-3\">\n                <div class=\"w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg\"><i class=\"fa-solid fa-triangle-exclamation\"></i></div>\n                <div>\n                  <div class=\"text-xs font-bold text-amber-900\">MANDATORY 415V LOCKOUT-TAGOUT (LOTO) REQUIRED</div>\n                  <div class=\"text-[11px] text-amber-800\">Isolate incoming 3-phase circuit breaker #CB-4 before opening the spindle enclosure!</div>\n                </div>\n              </div>\n\n              <!-- Diagnosis Summary -->\n              <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n                <div class=\"p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1\">\n                  <div class=\"text-[10px] font-mono text-slate-400\">IDENTIFIED ROOT CAUSE</div>\n                  <div class=\"font-bold text-sm text-slate-900\">Spindle Bearing Race Degradation</div>\n                  <div class=\"text-[11px] text-slate-500\">High-frequency acoustic resonance at 2.4 kHz indicates roller fatigue.</div>\n                </div>\n                <div class=\"p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1\">\n                  <div class=\"text-[10px] font-mono text-slate-400\">RECOMMENDED SPARE PART</div>\n                  <div class=\"font-bold text-sm text-indigo-700\">SKF 7210 Angular Contact Bearing</div>\n                  <div class=\"text-[11px] text-slate-500\">In stock at Peenya Depot (60m courier)</div>\n                </div>\n                <div class=\"p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1\">\n                  <div class=\"text-[10px] font-mono text-slate-400\">ESTIMATED REPAIR COST</div>\n                  <div class=\"font-black text-lg text-emerald-600 font-mono\">₹11,000 <span class=\"text-xs text-slate-400 font-normal\">(± ₹1,500)</span></div>\n                  <div class=\"text-[11px] text-slate-500\">Includes labor, OEM part & 30-day warranty</div>\n                </div>\n              </div>\n\n              <div class=\"flex justify-end gap-2 pt-2 border-t border-slate-100\">\n                <button data-nav-screen=\"W07\" class=\"px-4 py-2.5 rounded-xl bg-slate-100 font-bold text-xs text-slate-700\">Re-Record Audio</button>\n                <button data-nav-screen=\"W09\" class=\"px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-2\">\n                  <span>Proceed to Select Ranked Specialist</span>\n                  <i class=\"fa-solid fa-arrow-right\"></i>\n                </button>\n              </div>\n            </div>",
  "W09": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-5\">\n              <div class=\"flex items-center justify-between border-b border-slate-100 pb-3\">\n                <div>\n                  <h3 class=\"text-lg font-display font-black text-slate-900\">Available Certified Specialists (40% Distance / 60% Skill Scored)</h3>\n                  <p class=\"text-xs text-slate-500\">Ranked by sp_calculate_match_score • All exclude RULE SB-00 fatigued technicians</p>\n                </div>\n                <span class=\"text-xs font-mono text-emerald-600 font-bold\"><i class=\"fa-solid fa-circle-check mr-1\"></i>3 Specialists Ready</span>\n              </div>\n\n              <!-- Tech List -->\n              <div class=\"space-y-3\">\n                <div class=\"p-4 rounded-2xl bg-indigo-50/40 border-2 border-indigo-500 flex flex-wrap items-center justify-between gap-4\">\n                  <div class=\"flex items-center gap-3.5\">\n                    <div class=\"w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center font-display text-base\">RK</div>\n                    <div>\n                      <div class=\"flex items-center gap-2\">\n                        <span class=\"font-bold text-sm text-slate-900\">Ramesh K. Vishwakarma</span>\n                        <span class=\"px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold\">L2-P USTAD</span>\n                        <span class=\"px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold\">98% MATCH</span>\n                      </div>\n                      <div class=\"text-xs text-slate-600 mt-0.5\">\n                        Siemens & SKF Certified • 4.84 ★ (412 jobs) • <span class=\"font-bold text-emerald-700\">1.1 km away (ETA 11 mins)</span>\n                      </div>\n                    </div>\n                  </div>\n                  <div class=\"flex items-center gap-3\">\n                    <div class=\"text-right font-mono\">\n                      <div class=\"text-base font-black text-slate-900\">₹11,000</div>\n                      <div class=\"text-[10px] text-slate-400\">100% Escrow Hold</div>\n                    </div>\n                    <button data-nav-screen=\"W10\" class=\"px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md\">\n                      Book & Dispatch (15m SLA)\n                    </button>\n                  </div>\n                </div>\n\n                <div class=\"p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4\">\n                  <div class=\"flex items-center gap-3.5\">\n                    <div class=\"w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center font-display text-base\">SM</div>\n                    <div>\n                      <div class=\"flex items-center gap-2\">\n                        <span class=\"font-bold text-sm text-slate-900\">Syed Mustafa</span>\n                        <span class=\"px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold\">L3 MASTER</span>\n                        <span class=\"px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold\">94% MATCH</span>\n                      </div>\n                      <div class=\"text-xs text-slate-600 mt-0.5\">\n                        High-Voltage 415V Specialist • 4.92 ★ (610 jobs) • <span class=\"text-slate-600\">2.4 km away (ETA 18 mins)</span>\n                      </div>\n                    </div>\n                  </div>\n                  <div class=\"flex items-center gap-3\">\n                    <div class=\"text-right font-mono\">\n                      <div class=\"text-base font-black text-slate-900\">₹12,500</div>\n                      <div class=\"text-[10px] text-slate-400\">100% Escrow Hold</div>\n                    </div>\n                    <button data-nav-screen=\"W10\" class=\"px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs\">\n                      Book Specialist\n                    </button>\n                  </div>\n                </div>\n              </div>\n            </div>",
  "W10": "\n            <div class=\"space-y-4\">\n              <!-- Live Tracking Top Bar -->\n              <div class=\"p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3\">\n                <div class=\"flex items-center gap-3\">\n                  <span class=\"w-3 h-3 rounded-full bg-emerald-500 pulse-live\"></span>\n                  <div>\n                    <h3 class=\"text-sm font-bold text-slate-900\">Technician En-Route — 8 Mins to Arrival</h3>\n                    <p class=\"text-[11px] text-slate-500\">Ramesh K. (T-9841 • Blue Hero Splendor KA-04-EK-9912)</p>\n                  </div>\n                </div>\n                <div class=\"flex items-center gap-3\">\n                  <div class=\"px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-center font-mono\">\n                    <div class=\"text-[9px] text-amber-800 font-bold uppercase\">Gate OTP</div>\n                    <div class=\"text-base font-black text-amber-900\">8841</div>\n                  </div>\n                  <button class=\"px-3 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs\"><i class=\"fa-solid fa-phone mr-1.5\"></i>Call Tech</button>\n                </div>\n              </div>\n\n              <!-- Simulated PostGIS Vector Map Viewport -->\n              <div class=\"rounded-3xl bg-slate-950 text-white border border-slate-800 p-6 min-h-[400px] flex flex-col justify-between relative overflow-hidden\">\n                <div class=\"flex justify-between items-center z-10 font-mono text-xs\">\n                  <span class=\"px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold\">GPS TELEMETRY ACTIVE (38ms)</span>\n                  <span class=\"text-slate-400\">Destination: Apex Tools Bay #2</span>\n                </div>\n\n                <div class=\"my-auto py-8 text-center space-y-2 z-10\">\n                  <div class=\"w-16 h-16 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl shadow-2xl pulse-live\">\n                    <i class=\"fa-solid fa-motorcycle\"></i>\n                  </div>\n                  <div class=\"text-lg font-bold\">Ramesh K. is on Peenya 1st Cross Road</div>\n                  <div class=\"text-xs text-slate-400 font-mono\">500m Arrival Geofence Status: Approaching Outer Ring (420m away)</div>\n                </div>\n\n                <div class=\"flex justify-between items-center z-10 border-t border-slate-800 pt-3 text-xs text-slate-400 font-mono\">\n                  <span>PostGIS: ST_DistanceSphere() = 420.4m</span>\n                  <span class=\"text-emerald-400\">100% Escrow Held: ₹11,000</span>\n                </div>\n              </div>\n            </div>",
  "W11": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <div class=\"flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3\">\n                <div>\n                  <h3 class=\"text-base font-display font-black text-slate-900\">Job History & Past Orders Ledger</h3>\n                  <p class=\"text-xs text-slate-500\">Complete audit log of all repairs, warranty revisited claims, and tax invoices.</p>\n                </div>\n                <div class=\"flex items-center gap-2\">\n                  <button class=\"px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs\">All Jobs (42)</button>\n                  <button class=\"px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs\">Warranty Active (3)</button>\n                  <button class=\"px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs\">Export CSV</button>\n                </div>\n              </div>\n\n              <div class=\"overflow-x-auto rounded-2xl border border-slate-200\">\n                <table class=\"w-full text-left text-xs\">\n                  <thead class=\"bg-slate-900 text-slate-200 font-mono text-[10px] uppercase\">\n                    <tr>\n                      <th class=\"p-3\">Job ID & Date</th>\n                      <th class=\"p-3\">Asset Repaired</th>\n                      <th class=\"p-3\">Specialist</th>\n                      <th class=\"p-3\">Amount & GST</th>\n                      <th class=\"p-3\">Warranty Status</th>\n                      <th class=\"p-3 text-right\">Actions</th>\n                    </tr>\n                  </thead>\n                  <tbody class=\"divide-y divide-slate-100\">\n                    <tr class=\"hover:bg-slate-50\">\n                      <td class=\"p-3 font-mono font-bold text-blue-600\">JOB-9821<div class=\"text-[10px] text-slate-400 font-normal\">14 Nov 2026, 10:14</div></td>\n                      <td class=\"p-3 font-bold text-slate-900\">Siemens Sinumerik 828D<div class=\"text-[10px] text-slate-400\">Spindle Bearing 7210</div></td>\n                      <td class=\"p-3\">Ramesh K. (L2-P)</td>\n                      <td class=\"p-3 font-mono\">₹11,000<div class=\"text-[10px] text-emerald-600\">18% GST (₹1,980 ITC)</div></td>\n                      <td class=\"p-3\"><span class=\"px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold\">28 DAYS LEFT</span></td>\n                      <td class=\"p-3 text-right\"><button data-nav-screen=\"W12\" class=\"px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-[10px]\">Details</button></td>\n                    </tr>\n                    <tr class=\"hover:bg-slate-50\">\n                      <td class=\"p-3 font-mono font-bold text-blue-600\">JOB-9740<div class=\"text-[10px] text-slate-400 font-normal\">02 Nov 2026, 14:30</div></td>\n                      <td class=\"p-3 font-bold text-slate-900\">Tata Prima 4028.S (V-304)<div class=\"text-[10px] text-slate-400\">DEF Doser Ultrasonic Clean</div></td>\n                      <td class=\"p-3\">Syed M. (L3)</td>\n                      <td class=\"p-3 font-mono\">₹8,400</td>\n                      <td class=\"p-3\"><span class=\"px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold\">16 DAYS LEFT</span></td>\n                      <td class=\"p-3 text-right\"><button data-nav-screen=\"W12\" class=\"px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-[10px]\">Details</button></td>\n                    </tr>\n                  </tbody>\n                </table>\n              </div>\n            </div>",
  "W12": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-5\">\n              <div class=\"flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3\">\n                <div>\n                  <span class=\"px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold\">JOB COMPLETED • CERTIFIED HANDOVER</span>\n                  <h3 class=\"text-base font-display font-black text-slate-900 mt-1\">Job Details & Cryptographic Service Dossier #JOB-9821</h3>\n                </div>\n                <button class=\"px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs\"><i class=\"fa-solid fa-file-pdf mr-1.5\"></i>Download GST Tax Invoice</button>\n              </div>\n\n              <!-- Side-by-side Evidence -->\n              <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n                <div class=\"p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2\">\n                  <div class=\"flex justify-between items-center text-xs font-bold text-rose-900\">\n                    <span>1. BEFORE REPAIR EVIDENCE</span>\n                    <span class=\"font-mono text-[10px]\">10:14 IST</span>\n                  </div>\n                  <div class=\"p-3 rounded-xl bg-black text-rose-300 font-mono text-xs space-y-1\">\n                    <div>Acoustic Spike: 84.2 dB at 2.4 kHz</div>\n                    <div>Photo: Roller pit marks verified on inner race</div>\n                  </div>\n                </div>\n\n                <div class=\"p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2\">\n                  <div class=\"flex justify-between items-center text-xs font-bold text-emerald-900\">\n                    <span>2. AFTER REPAIR HANDOVER</span>\n                    <span class=\"font-mono text-[10px]\">11:22 IST</span>\n                  </div>\n                  <div class=\"p-3 rounded-xl bg-black text-emerald-300 font-mono text-xs space-y-1\">\n                    <div>Nominal Vibration: 61.0 dB (ISO 10816 Pass)</div>\n                    <div>OEM Part: SKF 7210 Bearing (QR: SKF-8812)</div>\n                  </div>\n                </div>\n              </div>\n\n              <div class=\"p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono flex flex-wrap items-center justify-between gap-2\">\n                <div>SHA-256 Hash: <span class=\"text-indigo-600 font-bold\">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span></div>\n                <span class=\"text-emerald-600 font-bold\">TAMPER-PROOF VERIFIED</span>\n              </div>\n            </div>",
  "W13": "\n            <div class=\"max-w-xl mx-auto p-7 rounded-3xl bg-white border border-slate-200 space-y-5\">\n              <div class=\"text-center space-y-1\">\n                <span class=\"px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold uppercase\">DOUBLE-BLIND REVIEW (CORE-07)</span>\n                <h3 class=\"text-xl font-display font-black text-slate-900\">Rate Specialist Ramesh K.</h3>\n                <p class=\"text-xs text-slate-500\">Your review is encrypted in the vault and revealed only after both parties submit or 48 hours pass.</p>\n              </div>\n\n              <!-- Star Rating -->\n              <div class=\"text-center space-y-2 py-2\">\n                <div class=\"flex justify-center gap-2 text-2xl text-amber-400\">\n                  <i class=\"fa-solid fa-star cursor-pointer\"></i>\n                  <i class=\"fa-solid fa-star cursor-pointer\"></i>\n                  <i class=\"fa-solid fa-star cursor-pointer\"></i>\n                  <i class=\"fa-solid fa-star cursor-pointer\"></i>\n                  <i class=\"fa-solid fa-star cursor-pointer\"></i>\n                </div>\n                <div class=\"text-xs font-bold text-slate-700\">5.0 — Outstanding Technical Skill & Punctuality</div>\n              </div>\n\n              <div class=\"space-y-3 text-xs\">\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Feedback for Specialist</label>\n                  <textarea rows=\"3\" class=\"w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none\" placeholder=\"Explain what went well...\"></textarea>\n                </div>\n\n                <div class=\"p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1\">\n                  <div class=\"font-bold text-slate-800\">Factory Floor Safety Tag</div>\n                  <label class=\"flex items-center gap-2 text-slate-600 cursor-pointer pt-1\">\n                    <input type=\"checkbox\" checked class=\"accent-indigo-600\" />\n                    <span>Technician followed mandatory 415V LOTO PPE protocols</span>\n                  </label>\n                </div>\n              </div>\n\n              <button data-nav-screen=\"W06\" class=\"w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md\">\n                Submit Sealed Blind Review (CORE-07)\n              </button>\n            </div>",
  "W14": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-5\">\n              <div class=\"flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3\">\n                <div>\n                  <h3 class=\"text-base font-display font-black text-slate-900\">Industrial CNC & Factory Machinery Inventory (28 Assets)</h3>\n                  <p class=\"text-xs text-slate-500\">Real-time health telemetry gauges and direct Digital Twin integrations.</p>\n                </div>\n                <div class=\"flex items-center gap-2\">\n                  <input type=\"text\" placeholder=\"Search machines...\" class=\"px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none\" />\n                  <button data-nav-screen=\"W16\" class=\"px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5\">\n                    <i class=\"fa-solid fa-plus\"></i><span>Add Machine</span>\n                  </button>\n                </div>\n              </div>\n\n              <!-- Machines Grid -->\n              <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n                <div data-nav-screen=\"W15\" class=\"p-4 rounded-2xl border border-slate-200 hover:border-purple-500 bg-white cursor-pointer space-y-3 transition-all\">\n                  <div class=\"flex justify-between items-start\">\n                    <div>\n                      <div class=\"text-sm font-bold text-slate-900\">Siemens Sinumerik 828D</div>\n                      <div class=\"text-[11px] text-slate-400 font-mono\">ID: M-101 • Bay 2</div>\n                    </div>\n                    <span class=\"px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold\">98% HEALTH</span>\n                  </div>\n                  <div class=\"w-full h-1.5 rounded-full bg-slate-100 overflow-hidden\"><div class=\"h-full bg-emerald-500\" style=\"width: 98%\"></div></div>\n                  <div class=\"text-[11px] text-slate-500 flex justify-between\">\n                    <span>Operating Hours: 3,420h</span>\n                    <span class=\"text-purple-600 font-bold\">Digital Twin →</span>\n                  </div>\n                </div>\n\n                <div data-nav-screen=\"W15\" class=\"p-4 rounded-2xl border border-amber-300 bg-amber-50/20 cursor-pointer space-y-3 transition-all\">\n                  <div class=\"flex justify-between items-start\">\n                    <div>\n                      <div class=\"text-sm font-bold text-slate-900\">Haas VF-2 Machining Center</div>\n                      <div class=\"text-[11px] text-slate-400 font-mono\">ID: M-104 • Bay 1</div>\n                    </div>\n                    <span class=\"px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold\">74% WARNING</span>\n                  </div>\n                  <div class=\"w-full h-1.5 rounded-full bg-slate-100 overflow-hidden\"><div class=\"h-full bg-amber-500\" style=\"width: 74%\"></div></div>\n                  <div class=\"text-[11px] text-amber-700 flex justify-between font-semibold\">\n                    <span>Spindle Vibration Alert (80 dB)</span>\n                    <span class=\"text-rose-600 font-bold\">Book PM →</span>\n                  </div>\n                </div>\n\n                <div data-nav-screen=\"W15\" class=\"p-4 rounded-2xl border border-slate-200 hover:border-purple-500 bg-white cursor-pointer space-y-3 transition-all\">\n                  <div class=\"flex justify-between items-start\">\n                    <div>\n                      <div class=\"text-sm font-bold text-slate-900\">LMW Smarturn CNC Lathe</div>\n                      <div class=\"text-[11px] text-slate-400 font-mono\">ID: M-108 • Bay 3</div>\n                    </div>\n                    <span class=\"px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold\">92% HEALTH</span>\n                  </div>\n                  <div class=\"w-full h-1.5 rounded-full bg-slate-100 overflow-hidden\"><div class=\"h-full bg-emerald-500\" style=\"width: 92%\"></div></div>\n                  <div class=\"text-[11px] text-slate-500 flex justify-between\">\n                    <span>Operating Hours: 1,840h</span>\n                    <span class=\"text-purple-600 font-bold\">Digital Twin →</span>\n                  </div>\n                </div>\n              </div>\n            </div>",
  "W15": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-5\">\n              <div class=\"flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3\">\n                <div>\n                  <span class=\"text-[10px] font-mono text-purple-600 font-bold\">ASSET DOSSIER • PEENYA BAY #2</span>\n                  <h3 class=\"text-base font-display font-black text-slate-900 mt-0.5\">Siemens Sinumerik 828D CNC Milling Machine (M-101)</h3>\n                </div>\n                <div class=\"flex gap-2\">\n                  <button data-nav-screen=\"W23\" class=\"px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs\"><i class=\"fa-solid fa-brain mr-1.5\"></i>Open Digital Twin</button>\n                  <button data-nav-screen=\"W07\" class=\"px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs\"><i class=\"fa-solid fa-bolt mr-1.5\"></i>Report Breakdown</button>\n                </div>\n              </div>\n\n              <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono\">\n                <div class=\"p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1\">\n                  <div class=\"text-[10px] text-slate-400\">ELECTRICAL SPECIFICATION</div>\n                  <div class=\"font-bold text-slate-900\">415V AC • 3-Phase • 15 kW Motor</div>\n                  <div class=\"text-slate-500\">Max Spindle: 12,000 RPM</div>\n                </div>\n                <div class=\"p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1\">\n                  <div class=\"text-[10px] text-slate-400\">MAINTENANCE & WARRANTY</div>\n                  <div class=\"font-bold text-emerald-600\">30-Day Warranty Active (28 Days)</div>\n                  <div class=\"text-slate-500\">AMC Tier: Pro Enterprise 24/7</div>\n                </div>\n                <div class=\"p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1\">\n                  <div class=\"text-[10px] text-slate-400\">LAST REPAIR HANDOVER</div>\n                  <div class=\"font-bold text-slate-900\">14 Nov 2026 (Job #JOB-9821)</div>\n                  <div class=\"text-slate-500\">Replaced SKF 7210 Bearing</div>\n                </div>\n              </div>\n            </div>",
  "W16": "\n            <div class=\"max-w-2xl mx-auto p-6 rounded-3xl bg-white border border-slate-200 space-y-5\">\n              <div>\n                <h3 class=\"text-lg font-display font-black text-slate-900\">Add New Industrial Machine</h3>\n                <p class=\"text-xs text-slate-500\">Scan QR code, enter OEM serial number, or upload machine nameplate photo.</p>\n              </div>\n\n              <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\">\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">OEM Manufacturer</label>\n                  <select class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold outline-none\">\n                    <option>Siemens AG</option>\n                    <option>Fanuc Robotics</option>\n                    <option>Haas Automation</option>\n                    <option>Mazak Corporation</option>\n                  </select>\n                </div>\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Serial / Asset Number</label>\n                  <input type=\"text\" placeholder=\"e.g. SN-882104-BLR\" class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono outline-none\" />\n                </div>\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Plant Location / Bay</label>\n                  <input type=\"text\" value=\"Peenya Plant #1 • Bay 3\" class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none\" />\n                </div>\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Voltage Rating</label>\n                  <select class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none\">\n                    <option>415V 3-Phase AC (Standard)</option>\n                    <option>230V Single-Phase AC</option>\n                    <option>440V Heavy Duty Industrial</option>\n                  </select>\n                </div>\n              </div>\n\n              <div class=\"flex justify-end gap-2 pt-2\">\n                <button data-nav-screen=\"W14\" class=\"px-4 py-2 rounded-xl bg-slate-100 font-bold text-xs text-slate-700\">Cancel</button>\n                <button data-nav-screen=\"W14\" class=\"px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-sm\">Save & Register Asset</button>\n              </div>\n            </div>",
  "W17": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <div class=\"flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3\">\n                <div>\n                  <h3 class=\"text-base font-display font-black text-slate-900\">Commercial Fleet & EV Logistics Directory (54 Fleets)</h3>\n                  <p class=\"text-xs text-slate-500\">Heavy commercial trucks, electric delivery vans, and industrial forklifts.</p>\n                </div>\n                <button data-nav-screen=\"W19\" class=\"px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs\"><i class=\"fa-solid fa-plus mr-1\"></i>Add Vehicle</button>\n              </div>\n\n              <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n                <div data-nav-screen=\"W18\" class=\"p-4 rounded-2xl border border-slate-200 hover:border-blue-500 bg-white cursor-pointer space-y-2\">\n                  <div class=\"flex justify-between items-start\">\n                    <span class=\"font-bold text-sm text-slate-900\">Tata Prima 4028.S (Heavy Diesel)</span>\n                    <span class=\"px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold\">96% HEALTH</span>\n                  </div>\n                  <div class=\"text-xs text-slate-500\">Reg: KA-01-AF-2041 • DEF Tank: 82%</div>\n                  <div class=\"text-[11px] text-blue-600 font-bold\">OBD-II Telemetry Clean →</div>\n                </div>\n                <div data-nav-screen=\"W18\" class=\"p-4 rounded-2xl border border-slate-200 hover:border-blue-500 bg-white cursor-pointer space-y-2\">\n                  <div class=\"flex justify-between items-start\">\n                    <span class=\"font-bold text-sm text-slate-900\">Mahindra Treo Zor EV (Forklift)</span>\n                    <span class=\"px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold\">99% HEALTH</span>\n                  </div>\n                  <div class=\"text-xs text-slate-500\">Reg: KA-04-EV-9012 • Battery SoC: 88%</div>\n                  <div class=\"text-[11px] text-blue-600 font-bold\">Thermal Cycles Nominal →</div>\n                </div>\n              </div>\n            </div>",
  "W18": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <div class=\"flex justify-between items-center border-b border-slate-100 pb-3\">\n                <div>\n                  <span class=\"text-[10px] font-mono text-blue-600 font-bold\">VEHICLE TELEMETRY • WHITEFIELD DEPOT</span>\n                  <h3 class=\"text-base font-display font-black text-slate-900\">Tata Prima 4028.S (KA-01-AF-2041)</h3>\n                </div>\n                <button data-nav-screen=\"W07\" class=\"px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs\">Roadside SOS</button>\n              </div>\n\n              <div class=\"grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono\">\n                <div class=\"p-3 rounded-xl bg-slate-50 border border-slate-200\">\n                  <div class=\"text-slate-400 text-[10px]\">OBD-II DTC FAULT CODES</div>\n                  <div class=\"text-base font-black text-emerald-600\">0 ACTIVE CODES</div>\n                </div>\n                <div class=\"p-3 rounded-xl bg-slate-50 border border-slate-200\">\n                  <div class=\"text-slate-400 text-[10px]\">DEF AD-BLUE LEVEL</div>\n                  <div class=\"text-base font-black text-blue-600\">82% NOMINAL</div>\n                </div>\n                <div class=\"p-3 rounded-xl bg-slate-50 border border-slate-200\">\n                  <div class=\"text-slate-400 text-[10px]\">DRIVER SAFETY SCORE</div>\n                  <div class=\"text-base font-black text-indigo-600\">94 / 100</div>\n                </div>\n                <div class=\"p-3 rounded-xl bg-slate-50 border border-slate-200\">\n                  <div class=\"text-slate-400 text-[10px]\">LAST REPAIR WARRANTY</div>\n                  <div class=\"text-base font-black text-purple-600\">16 DAYS LEFT</div>\n                </div>\n              </div>\n            </div>",
  "W19": "\n            <div class=\"max-w-2xl mx-auto p-6 rounded-3xl bg-white border border-slate-200 space-y-5\">\n              <div>\n                <h3 class=\"text-lg font-display font-black text-slate-900\">Add Fleet Vehicle (Vahan Lookup)</h3>\n                <p class=\"text-xs text-slate-500\">Auto-decode vehicle chassis and registration documents.</p>\n              </div>\n              <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\">\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Registration Number</label>\n                  <input type=\"text\" placeholder=\"e.g. KA-01-AF-2041\" class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold outline-none\" />\n                </div>\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Vehicle Category</label>\n                  <select class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none\">\n                    <option>Heavy Goods Commercial Vehicle (HGV)</option>\n                    <option>Electric Commercial Forklift</option>\n                    <option>Light Commercial Vehicle (LCV)</option>\n                  </select>\n                </div>\n              </div>\n              <div class=\"flex justify-end gap-2 pt-2\">\n                <button data-nav-screen=\"W17\" class=\"px-4 py-2 rounded-xl bg-slate-100 font-bold text-xs text-slate-700\">Cancel</button>\n                <button data-nav-screen=\"W17\" class=\"px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs\">Save Vehicle</button>\n              </div>\n            </div>",
  "W20": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <div class=\"flex justify-between items-center border-b border-slate-100 pb-3\">\n                <div>\n                  <h3 class=\"text-base font-display font-black text-slate-900\">Commercial Electronics & Cleanroom Power (14 Units)</h3>\n                  <p class=\"text-xs text-slate-500\">Server room UPS, 3-Phase transformers, and SMT PCB production lines.</p>\n                </div>\n                <button data-nav-screen=\"W22\" class=\"px-3.5 py-1.5 rounded-xl bg-cyan-600 text-white font-bold text-xs\"><i class=\"fa-solid fa-plus mr-1\"></i>Add Device</button>\n              </div>\n              <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n                <div data-nav-screen=\"W21\" class=\"p-4 rounded-2xl border border-slate-200 hover:border-cyan-500 bg-white cursor-pointer space-y-2\">\n                  <div class=\"flex justify-between items-start\">\n                    <span class=\"font-bold text-sm text-slate-900\">Emerson Liebert 80 kVA UPS</span>\n                    <span class=\"px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold\">97% HEALTH</span>\n                  </div>\n                  <div class=\"text-xs text-slate-500\">E-City Server Farm #1 • Battery Bank: 100%</div>\n                  <div class=\"text-[11px] text-cyan-600 font-bold\">Capacitor Ripple Nominal →</div>\n                </div>\n              </div>\n            </div>",
  "W21": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <div class=\"flex justify-between items-center border-b border-slate-100 pb-3\">\n                <div>\n                  <span class=\"text-[10px] font-mono text-cyan-600 font-bold\">POWER TELEMETRY • E-CITY</span>\n                  <h3 class=\"text-base font-display font-black text-slate-900\">Emerson Liebert 80 kVA Online UPS (D-502)</h3>\n                </div>\n                <button data-nav-screen=\"W07\" class=\"px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs\">Report Fault</button>\n              </div>\n              <div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono\">\n                <div class=\"p-3.5 rounded-xl bg-slate-50 border border-slate-200\">\n                  <div class=\"text-slate-400 text-[10px]\">CAPACITOR RIPPLE VOLTAGE</div>\n                  <div class=\"text-base font-black text-emerald-600\">0.8V (THRESHOLD 2.5V)</div>\n                </div>\n                <div class=\"p-3.5 rounded-xl bg-slate-50 border border-slate-200\">\n                  <div class=\"text-slate-400 text-[10px]\">BATTERY BACKUP RUNTIME</div>\n                  <div class=\"text-base font-black text-indigo-600\">42 MINS @ 65% LOAD</div>\n                </div>\n                <div class=\"p-3.5 rounded-xl bg-slate-50 border border-slate-200\">\n                  <div class=\"text-slate-400 text-[10px]\">TOTAL HARMONIC DISTORTION</div>\n                  <div class=\"text-base font-black text-purple-600\">THD: 2.1% (PASS)</div>\n                </div>\n              </div>\n            </div>",
  "W22": "\n            <div class=\"max-w-2xl mx-auto p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <h3 class=\"text-lg font-display font-black text-slate-900\">Add Commercial Power Device</h3>\n              <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\">\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Device Model / Brand</label>\n                  <input type=\"text\" placeholder=\"e.g. Emerson Liebert 80 kVA\" class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold outline-none\" />\n                </div>\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Power Rating (kVA / kW)</label>\n                  <input type=\"text\" value=\"80 kVA\" class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono outline-none\" />\n                </div>\n              </div>\n              <div class=\"flex justify-end gap-2 pt-2\">\n                <button data-nav-screen=\"W20\" class=\"px-4 py-2 rounded-xl bg-slate-100 font-bold text-xs text-slate-700\">Cancel</button>\n                <button data-nav-screen=\"W20\" class=\"px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs\">Save Device</button>\n              </div>\n            </div>",
  "W23": "\n            <div class=\"p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 space-y-5\">\n              <div class=\"flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3\">\n                <div class=\"flex items-center gap-3\">\n                  <span class=\"w-3 h-3 rounded-full bg-emerald-400 pulse-live\"></span>\n                  <div>\n                    <span class=\"text-xs font-mono text-purple-400 font-bold\">DIGITAL TWIN TELEMETRY ACTIVE (60 FPS)</span>\n                    <h3 class=\"text-base font-display font-black text-white\">Siemens Sinumerik 828D Spindle & Axis Model</h3>\n                  </div>\n                </div>\n                <button data-nav-screen=\"W07\" class=\"px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs\">Emergency SOS</button>\n              </div>\n\n              <!-- Component Health Grid -->\n              <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono\">\n                <div class=\"p-3.5 rounded-2xl bg-slate-900 border border-purple-500/40 space-y-1\">\n                  <div class=\"text-[10px] text-slate-400\">MAIN SPINDLE</div>\n                  <div class=\"text-lg font-black text-emerald-400\">98% NOMINAL</div>\n                  <div class=\"text-[10px] text-slate-500\">61.0 dB Vibration</div>\n                </div>\n                <div class=\"p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1\">\n                  <div class=\"text-[10px] text-slate-400\">X/Y/Z SERVO DRIVE</div>\n                  <div class=\"text-lg font-black text-emerald-400\">96% NOMINAL</div>\n                  <div class=\"text-[10px] text-slate-500\">Positioning Error: 2µm</div>\n                </div>\n                <div class=\"p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1\">\n                  <div class=\"text-[10px] text-slate-400\">HYDRAULIC CHUCK</div>\n                  <div class=\"text-lg font-black text-emerald-400\">94% NOMINAL</div>\n                  <div class=\"text-[10px] text-slate-500\">Pressure: 32 Bar</div>\n                </div>\n                <div class=\"p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1\">\n                  <div class=\"text-[10px] text-slate-400\">415V INVERTER</div>\n                  <div class=\"text-lg font-black text-emerald-400\">99% NOMINAL</div>\n                  <div class=\"text-[10px] text-slate-500\">Bus Voltage: 560V DC</div>\n                </div>\n              </div>\n\n              <div class=\"p-4 rounded-2xl bg-black/80 border border-slate-800 text-xs font-mono flex justify-between\">\n                <span>AI Prediction: Next estimated maintenance window in 480 operating hours.</span>\n                <span class=\"text-emerald-400\">Physics Loss = 0.0014 (Optimal)</span>\n              </div>\n            </div>",
  "W24": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-5\">\n              <div class=\"flex justify-between items-center border-b border-slate-100 pb-3\">\n                <div>\n                  <h3 class=\"text-base font-display font-black text-slate-900\">Micro-Insurance, 30-Day Warranty & AMC Hub</h3>\n                  <p class=\"text-xs text-slate-500\">Coverage safeguards across all registered plant assets.</p>\n                </div>\n                <button data-nav-screen=\"W25\" class=\"px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs\">File Revisit Claim</button>\n              </div>\n              <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n                <div class=\"p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2\">\n                  <div class=\"text-xs font-mono font-bold text-emerald-600\">30-DAY REPAIR WARRANTIES</div>\n                  <div class=\"text-2xl font-black text-slate-900\">3 ACTIVE</div>\n                  <div class=\"text-xs text-slate-500\">Zero-cost warranty revisit if same fault recurs.</div>\n                  <button data-nav-screen=\"W26\" class=\"w-full py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800\">Track Days Left</button>\n                </div>\n                <div class=\"p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2\">\n                  <div class=\"text-xs font-mono font-bold text-blue-600\">₹15 MICRO-INSURANCE POOL</div>\n                  <div class=\"text-2xl font-black text-slate-900\">₹1,00,000</div>\n                  <div class=\"text-xs text-slate-500\">Coverage against collateral accidental breakdown.</div>\n                  <button data-nav-screen=\"W25\" class=\"w-full py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800\">View Policy</button>\n                </div>\n                <div class=\"p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2\">\n                  <div class=\"text-xs font-mono font-bold text-purple-600\">COMPREHENSIVE AMC</div>\n                  <div class=\"text-2xl font-black text-slate-900\">PRO TIER</div>\n                  <div class=\"text-xs text-slate-500\">Guaranteed 15m response + quarterly audits.</div>\n                  <button data-nav-screen=\"W27\" class=\"w-full py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800\">Manage AMC</button>\n                </div>\n              </div>\n            </div>",
  "W25": "\n            <div class=\"max-w-2xl mx-auto p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <h3 class=\"text-lg font-display font-black text-slate-900\">File Zero-Cost Warranty Revisit Claim</h3>\n              <p class=\"text-xs text-slate-500\">If your repaired equipment experiences recurring fault within 30 days, we dispatch a senior specialist at ₹0 fee.</p>\n              <div class=\"space-y-3 text-xs\">\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Select Covered Past Job</label>\n                  <select class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold outline-none\">\n                    <option>Job #JOB-9821: Siemens Sinumerik 828D Spindle (28 Days Left)</option>\n                    <option>Job #JOB-9740: Tata Prima DEF Injector (16 Days Left)</option>\n                  </select>\n                </div>\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Describe Recurrence</label>\n                  <textarea rows=\"3\" class=\"w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none\" placeholder=\"Explain the recurring noise or vibration...\"></textarea>\n                </div>\n              </div>\n              <div class=\"flex justify-end gap-2 pt-2\">\n                <button data-nav-screen=\"W24\" class=\"px-4 py-2 rounded-xl bg-slate-100 font-bold text-xs text-slate-700\">Cancel</button>\n                <button data-nav-screen=\"W26\" class=\"px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs\">Submit Revisit Claim (₹0 Fee)</button>\n              </div>\n            </div>",
  "W26": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <h3 class=\"text-base font-display font-black text-slate-900\">30-Day Repair Warranty Tracker</h3>\n              <div class=\"overflow-x-auto rounded-2xl border border-slate-200\">\n                <table class=\"w-full text-left text-xs\">\n                  <thead class=\"bg-slate-900 text-slate-200 font-mono text-[10px] uppercase\">\n                    <tr>\n                      <th class=\"p-3\">Job ID</th>\n                      <th class=\"p-3\">Machine & Part</th>\n                      <th class=\"p-3\">Warranty Expiry</th>\n                      <th class=\"p-3\">Remaining Time</th>\n                      <th class=\"p-3 text-right\">Action</th>\n                    </tr>\n                  </thead>\n                  <tbody class=\"divide-y divide-slate-100\">\n                    <tr class=\"hover:bg-slate-50\">\n                      <td class=\"p-3 font-mono font-bold text-blue-600\">JOB-9821</td>\n                      <td class=\"p-3 font-bold\">Siemens Sinumerik 828D (SKF 7210 Bearing)</td>\n                      <td class=\"p-3 font-mono\">12 Dec 2026</td>\n                      <td class=\"p-3 font-mono text-emerald-600 font-bold\">28 Days Left</td>\n                      <td class=\"p-3 text-right\"><button data-nav-screen=\"W25\" class=\"px-2.5 py-1 rounded bg-slate-900 text-white font-mono text-[10px]\">Claim Revisit</button></td>\n                    </tr>\n                  </tbody>\n                </table>\n              </div>\n            </div>",
  "W27": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <h3 class=\"text-base font-display font-black text-slate-900\">Annual Maintenance Contracts (AMC) Desk</h3>\n              <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n                <div class=\"p-4 rounded-2xl border-2 border-purple-600 bg-purple-50/40 space-y-2\">\n                  <span class=\"px-2 py-0.5 rounded bg-purple-200 text-purple-800 font-mono text-[10px] font-bold\">ACTIVE PLAN</span>\n                  <div class=\"text-lg font-bold text-slate-900\">Enterprise 24/7 SLA</div>\n                  <div class=\"text-2xl font-black text-purple-700 font-mono\">₹65,000<span class=\"text-xs font-normal text-slate-500\">/year</span></div>\n                  <ul class=\"text-xs text-slate-600 space-y-1 pt-1\">\n                    <li>✓ 15-Minute Emergency Response</li>\n                    <li>✓ Dedicated Cluster Lead Engineer</li>\n                    <li>✓ Quarterly Ultrasonic & Thermography</li>\n                  </ul>\n                </div>\n              </div>\n            </div>",
  "W28": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <div class=\"flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3\">\n                <div>\n                  <h3 class=\"text-base font-display font-black text-slate-900\">OEM Spare Parts Marketplace (18% GST ITC Reconciled)</h3>\n                  <p class=\"text-xs text-slate-500\">Genuine bearings, contactors, belts & drives with 60m delivery from Peenya/Whitefield hubs.</p>\n                </div>\n                <div class=\"flex gap-2\">\n                  <button data-nav-screen=\"W30\" class=\"px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs\"><i class=\"fa-solid fa-cart-shopping mr-1.5\"></i>Cart (2 items)</button>\n                </div>\n              </div>\n\n              <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n                <div data-nav-screen=\"W29\" class=\"p-4 rounded-2xl border border-slate-200 hover:border-blue-500 bg-white cursor-pointer space-y-2\">\n                  <span class=\"px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold\">OEM GENUINE</span>\n                  <div class=\"text-sm font-bold text-slate-900\">SKF 7210 Angular Contact Spindle Bearing</div>\n                  <div class=\"text-base font-black text-slate-900 font-mono\">₹3,850</div>\n                  <div class=\"text-[11px] text-slate-500\">Peenya Depot • 60m Courier ETA</div>\n                  <button class=\"w-full py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs\">Inspect & Check Fitment</button>\n                </div>\n\n                <div data-nav-screen=\"W29\" class=\"p-4 rounded-2xl border border-slate-200 hover:border-blue-500 bg-white cursor-pointer space-y-2\">\n                  <span class=\"px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold\">REFURBISHED GRADE A+</span>\n                  <div class=\"text-sm font-bold text-slate-900\">Danfoss VLT 15 kW Frequency Inverter</div>\n                  <div class=\"text-base font-black text-slate-900 font-mono\">₹18,500 <span class=\"text-xs line-through text-slate-400\">₹32,000</span></div>\n                  <div class=\"text-[11px] text-slate-500\">Whitefield Hub • Tested with 6m warranty</div>\n                  <button class=\"w-full py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs\">Inspect & Check Fitment</button>\n                </div>\n              </div>\n            </div>",
  "W29": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-5\">\n              <div class=\"grid grid-cols-1 md:grid-cols-12 gap-5\">\n                <div class=\"md:col-span-4 rounded-2xl bg-slate-50 border border-slate-200 p-6 flex flex-col justify-center items-center text-center\">\n                  <i class=\"fa-solid fa-gear text-6xl text-slate-400 mb-3\"></i>\n                  <div class=\"font-bold text-sm text-slate-900\">SKF 7210 Angular Contact</div>\n                  <div class=\"text-xs font-mono text-emerald-600 font-bold mt-1\">OEM QR SEAL VERIFIED</div>\n                </div>\n\n                <div class=\"md:col-span-8 space-y-3\">\n                  <div class=\"flex justify-between items-start\">\n                    <div>\n                      <h3 class=\"text-lg font-bold text-slate-900\">SKF 7210 B-2RS Angular Contact Spindle Bearing (50x90x20mm)</h3>\n                      <div class=\"text-xs text-slate-500 font-mono\">Part Number: 7210-B-2RS-TVP-P4A</div>\n                    </div>\n                    <div class=\"text-xl font-black font-mono text-slate-900\">₹3,850</div>\n                  </div>\n\n                  <div class=\"p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium\">\n                    <i class=\"fa-solid fa-circle-check mr-1.5\"></i>Machine Fitment Confirmed: 100% compatible with your Siemens Sinumerik 828D (M-101)\n                  </div>\n\n                  <div class=\"flex gap-2 pt-2\">\n                    <button data-nav-screen=\"W30\" class=\"px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md\">Add to Cart</button>\n                    <button data-nav-screen=\"W31\" class=\"px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs\">Buy Now (Express SOS Runner)</button>\n                  </div>\n                </div>\n              </div>\n            </div>",
  "W30": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <div class=\"flex justify-between items-center border-b border-slate-100 pb-3\">\n                <h3 class=\"text-base font-display font-black text-slate-900\">Procurement Cart (1 Item)</h3>\n                <span class=\"text-xs font-mono text-slate-500\">Plant: Peenya Plant #1</span>\n              </div>\n              <div class=\"p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center\">\n                <div>\n                  <div class=\"font-bold text-sm text-slate-900\">SKF 7210 Angular Contact Bearing</div>\n                  <div class=\"text-xs text-slate-500\">Qty: 1 • OEM Genuine</div>\n                </div>\n                <div class=\"text-right font-mono font-bold text-slate-900\">₹3,850</div>\n              </div>\n              <div class=\"flex justify-between items-center text-xs font-mono pt-2\">\n                <span>18% GST Input Tax Credit: ₹693.00</span>\n                <span class=\"text-base font-black text-slate-900\">Total: ₹4,543.00</span>\n              </div>\n              <button data-nav-screen=\"W31\" class=\"w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md\">Proceed to Checkout</button>\n            </div>",
  "W31": "\n            <div class=\"max-w-2xl mx-auto p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <h3 class=\"text-lg font-display font-black text-slate-900\">Enterprise Multi-Plant Checkout</h3>\n              <div class=\"space-y-3 text-xs\">\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Delivery Destination</label>\n                  <select class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold outline-none\">\n                    <option>Apex Precision Tools — Peenya Plant #1 Gate 2 (Bay 2)</option>\n                    <option>Whitefield Depot Receiving Bay</option>\n                  </select>\n                </div>\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Purchase Order (PO) Number</label>\n                  <input type=\"text\" value=\"PO-2026-8812\" class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono outline-none\" />\n                </div>\n              </div>\n              <button data-nav-screen=\"W32\" class=\"w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md\">Proceed to Escrow Payment</button>\n            </div>",
  "W32": "\n            <div class=\"max-w-md mx-auto p-6 rounded-3xl bg-white border border-slate-200 space-y-4 text-center\">\n              <div class=\"w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl\">\n                <i class=\"fa-solid fa-lock\"></i>\n              </div>\n              <div>\n                <h3 class=\"text-lg font-display font-black text-slate-900\">100% Escrow Protection</h3>\n                <p class=\"text-xs text-slate-500 mt-0.5\">Funds are held in secure escrow until you inspect the repaired machine and provide the completion OTP.</p>\n              </div>\n              <div class=\"p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left font-mono text-xs space-y-1\">\n                <div class=\"flex justify-between\"><span>Base Amount:</span><span>₹11,000.00</span></div>\n                <div class=\"flex justify-between\"><span>18% GST:</span><span>₹1,980.00</span></div>\n                <div class=\"flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1\"><span>Total Escrow Deposit:</span><span>₹12,980.00</span></div>\n              </div>\n              <button data-nav-screen=\"W06\" class=\"w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md\">\n                Authorize Escrow Deposit (Razorpay)\n              </button>\n            </div>",
  "W33": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <h3 class=\"text-base font-display font-black text-slate-900\">Uptime Pre-Funded Corporate Wallet</h3>\n              <div class=\"p-5 rounded-2xl bg-slate-900 text-white space-y-2\">\n                <div class=\"text-xs font-mono text-slate-400\">AVAILABLE CORPORATE BALANCE</div>\n                <div class=\"text-3xl font-black font-mono text-emerald-400\">₹48,500.00</div>\n                <div class=\"text-[11px] text-slate-400\">Auto-Refill Threshold: ₹15,000</div>\n              </div>\n            </div>",
  "W34": "\n            <div class=\"max-w-md mx-auto p-6 rounded-3xl bg-white border border-slate-200 space-y-4 text-center\">\n              <span class=\"px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold uppercase\">ACTIVE SUBSCRIPTION</span>\n              <h3 class=\"text-xl font-display font-black text-slate-900\">Uptime Pro Pass (₹999/mo)</h3>\n              <p class=\"text-xs text-slate-500\">Active until 31 Dec 2026 • Renews automatically</p>\n              <div class=\"p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2\">\n                <div class=\"flex items-center gap-2\"><i class=\"fa-solid fa-circle-check text-emerald-500\"></i><span>₹0 Platform Booking Fees on all jobs (Saved ₹14,200)</span></div>\n                <div class=\"flex items-center gap-2\"><i class=\"fa-solid fa-circle-check text-emerald-500\"></i><span>Guaranteed 15-Minute Emergency Dispatch SLA</span></div>\n                <div class=\"flex items-center gap-2\"><i class=\"fa-solid fa-circle-check text-emerald-500\"></i><span>Includes 5 Free Digital Twin Telemetry Slots</span></div>\n              </div>\n            </div>",
  "W35": "\n            <div class=\"p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 space-y-4\">\n              <div class=\"flex justify-between items-center border-b border-slate-800 pb-3\">\n                <div class=\"flex items-center gap-2.5\">\n                  <span class=\"w-3 h-3 rounded-full bg-emerald-400 pulse-live\"></span>\n                  <h3 class=\"text-base font-display font-black text-white\">Remote Video Consultation Studio (Agora AR)</h3>\n                </div>\n                <span class=\"px-2.5 py-0.5 rounded bg-slate-800 font-mono text-[10px]\">WAVE 3 TELE-REPAIR</span>\n              </div>\n              <div class=\"rounded-2xl bg-black border border-slate-800 p-8 min-h-[320px] flex flex-col justify-between items-center text-center\">\n                <div class=\"w-16 h-16 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-2xl\"><i class=\"fa-solid fa-video\"></i></div>\n                <div>\n                  <div class=\"text-base font-bold text-white\">Expert Consultation Chamber</div>\n                  <div class=\"text-xs text-slate-400 max-w-sm mt-1\">Live camera stream with bidirectional AR annotation overlays. Senior engineers guide your plant technicians in real time.</div>\n                </div>\n                <div class=\"text-xs font-mono text-emerald-400\">Ready to initiate session (₹999/30 mins)</div>\n              </div>\n            </div>",
  "W36": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <div class=\"flex justify-between items-center border-b border-slate-100 pb-3\">\n                <h3 class=\"text-base font-display font-black text-slate-900\">Field Repair Wiki & 415V Schematics Directory</h3>\n                <input type=\"text\" placeholder=\"Search schematics or error codes...\" class=\"px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none\" />\n              </div>\n              <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n                <div data-nav-screen=\"W37\" class=\"p-4 rounded-2xl border border-slate-200 hover:border-blue-500 cursor-pointer space-y-2\">\n                  <span class=\"px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[10px] font-bold\">415V SCHEMATIC</span>\n                  <div class=\"text-sm font-bold text-slate-900\">Siemens Sinumerik 828D Spindle Encoder Pinout & LOTO</div>\n                  <div class=\"text-xs text-slate-500\">Verified by L3 Master Gurudas M. • +50 Upvotes</div>\n                </div>\n              </div>\n            </div>",
  "W37": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <div class=\"border-b border-slate-100 pb-3\">\n                <span class=\"text-xs font-mono text-purple-600 font-bold\">WIKI ARTICLE #W-904</span>\n                <h3 class=\"text-base font-display font-black text-slate-900\">Siemens Sinumerik 828D Spindle Drive 415V Wiring Schematic</h3>\n              </div>\n              <div class=\"p-4 rounded-2xl bg-slate-950 text-sky-300 font-mono text-xs space-y-1\">\n                <div>[SCHEMATIC PINOUT DIAGRAM]</div>\n                <div>Pin 1: +5V DC | Pin 2: Ground | Pin 3: A+ Channel | Pin 4: B+ Channel</div>\n                <div class=\"text-amber-400 font-bold\">[MANDATORY LOTO]: Isolate 415V 3-phase incoming breaker before probing encoder pins!</div>\n              </div>\n            </div>",
  "W38": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <h3 class=\"text-base font-display font-black text-slate-900\">Plant Notifications & Alerts</h3>\n              <div class=\"space-y-2 text-xs\">\n                <div class=\"p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between\">\n                  <span>Technician Ramesh K. has arrived at Gate 2 (Provide OTP 8841)</span>\n                  <span class=\"font-mono text-slate-400\">10m ago</span>\n                </div>\n                <div class=\"p-3 rounded-xl bg-amber-50 border border-amber-200 flex justify-between\">\n                  <span>AI Warning: Spindle vibration on Haas VF-2 crossed 80 dB threshold</span>\n                  <span class=\"font-mono text-slate-400\">1h ago</span>\n                </div>\n              </div>\n            </div>",
  "W39": "\n            <div class=\"max-w-2xl mx-auto p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <h3 class=\"text-lg font-display font-black text-slate-900\">Enterprise Factory Owner Profile</h3>\n              <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium\">\n                <div><span class=\"text-slate-400 block font-mono\">COMPANY:</span>Apex Precision Tools Pvt Ltd</div>\n                <div><span class=\"text-slate-400 block font-mono\">GSTIN:</span>29AAACA1234A1Z5 (18% ITC)</div>\n                <div><span class=\"text-slate-400 block font-mono\">FACILITY:</span>Peenya Industrial Cluster #4</div>\n                <div><span class=\"text-slate-400 block font-mono\">MSME REG:</span>UDYAM-KR-03-0019281</div>\n              </div>\n            </div>",
  "W40": "\n            <div class=\"max-w-2xl mx-auto p-6 rounded-3xl bg-white border border-slate-200 space-y-4\">\n              <h3 class=\"text-lg font-display font-black text-slate-900\">Settings & Regional Language</h3>\n              <div class=\"space-y-3 text-xs\">\n                <div>\n                  <label class=\"block font-mono font-bold uppercase text-slate-500 mb-1\">Select Interface Language (Bhashini AI)</label>\n                  <select class=\"w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold outline-none\">\n                    <option>English (Default)</option>\n                    <option>Kannada (ಕನ್ನಡ)</option>\n                    <option>Hindi (हिंदी)</option>\n                    <option>Tamil (தமிழ்)</option>\n                    <option>Telugu (తెలుగు)</option>\n                  </select>\n                </div>\n              </div>\n            </div>",
  "W41": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-3 text-xs text-slate-600 leading-relaxed\">\n              <h3 class=\"text-base font-display font-black text-slate-900\">Terms of Service & Escrow Charter</h3>\n              <p>1. 15-Minute Emergency Response SLA guarantee applies to industrial zones within 15 km of certified cluster depots.</p>\n              <p>2. 100% Escrow Protection: Client funds are held securely until digital signature and OTP verification by the factory owner.</p>\n              <p>3. 30-Day Warranty: Any recurrence of the same diagnosed failure is resolved at ₹0 technician fee.</p>\n            </div>",
  "W42": "\n            <div class=\"p-6 rounded-3xl bg-white border border-slate-200 space-y-3 text-xs text-slate-600 leading-relaxed\">\n              <h3 class=\"text-base font-display font-black text-slate-900\">Privacy Policy & DPDP Act 2023 Compliance</h3>\n              <p>UPTIME complies with the Digital Personal Data Protection Act 2023. All machine telemetry is encrypted in transit and at rest.</p>\n              <p>Raw acoustic sound clips and diagnostic photos are purged 30 days after job completion.</p>\n            </div>",
  "W43": "\n            <div class=\"max-w-md mx-auto p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4\">\n              <div class=\"text-5xl font-black font-display text-blue-600\">404</div>\n              <h3 class=\"text-lg font-display font-black text-slate-900\">Page Not Found</h3>\n              <p class=\"text-xs text-slate-500\">The requested factory workstation page does not exist or has moved.</p>\n              <button data-nav-screen=\"W06\" class=\"px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs\">Return to Dashboard</button>\n            </div>",
  "W44": "\n            <div class=\"max-w-md mx-auto p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4\">\n              <div class=\"w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl\">\n                <i class=\"fa-solid fa-wifi\"></i>\n              </div>\n              <h3 class=\"text-lg font-display font-black text-slate-900\">You are Offline</h3>\n              <p class=\"text-xs text-slate-500\">Plant telemetry is being cached locally. Queued actions will sync automatically once internet reconnects.</p>\n              <div class=\"p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700\">\n                Emergency 24/7 Telephone Hotline: 1800-415-UPTIME\n              </div>\n            </div>"
};
