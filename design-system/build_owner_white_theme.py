# -*- coding: utf-8 -*-
import os

html_code = r"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UPTIME — Owner App (Modern Light Theme)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --font-display: 'Plus Jakarta Sans', -apple-system, sans-serif;
      --font-body: 'Plus Jakarta Sans', -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }
    body {
      font-family: var(--font-body);
      background: #F1F5F9;
      color: #0F172A;
      margin: 0;
    }
    .font-display { font-family: var(--font-display); }
    .font-mono { font-family: var(--font-mono); }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* Crisp Modern Card Elevation */
    .app-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
      border-radius: 18px;
    }
    .app-card-elevated {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
      border-radius: 20px;
    }

    @keyframes pulse-gentle {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.08); opacity: 0.85; }
    }
    .pulse-dot { animation: pulse-gentle 2s infinite ease-in-out; }

    @keyframes eq-bounce {
      0%, 100% { height: 8px; }
      50% { height: 36px; }
    }
    .eq-bar { animation: eq-bounce 0.8s ease-in-out infinite alternate; }
  </style>
</head>
<body class="min-h-screen bg-[#F1F5F9] text-slate-900 select-none">

  <!-- ===================================================================== -->
  <!-- TOP STUDIO CONTROL HEADER (LIGHT THEME STUDIO BAR)                    -->
  <!-- ===================================================================== -->
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 shadow-sm">
    <div class="max-w-[1600px] mx-auto space-y-2">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <!-- Brand Identity -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md">
            <!-- Inline SVG UPTIME Logo -->
            <svg class="w-6 h-6" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" rx="20" fill="white" />
              <path d="M24 26 C24 26, 24 58, 50 68 C76 58, 76 26, 76 26" stroke="#0284C7" stroke-width="12" stroke-linecap="round" fill="none"/>
              <path d="M50 32 L50 56 M44 38 L56 38" stroke="#0F172A" stroke-width="7" stroke-linecap="round"/>
              <circle cx="72" cy="30" r="14" stroke="#16A34A" stroke-width="7" fill="none" stroke-dasharray="8 6"/>
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-sm sm:text-base font-display font-extrabold tracking-tight text-slate-900">UPTIME</h1>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">MODERN LIGHT THEME • ALL 38 SCREENS</span>
            </div>
            <p class="text-[11px] text-slate-500 font-medium">Urban Company / Zomato / BigBasket Clean White Style • Guest Browse → Service Auth</p>
          </div>
        </div>

        <!-- View Mode Switcher + Auth Simulator -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Interactive vs All-38 Artboard Grid Switch -->
          <div class="p-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1 text-xs font-semibold">
            <button id="modePhoneBtn" onclick="setDisplayMode('phone')" class="px-3 py-1.5 rounded-lg bg-white text-slate-900 font-bold shadow-sm flex items-center gap-1.5 transition-all">
              <i class="fa-solid fa-mobile-screen-button text-blue-600"></i>
              <span>Interactive Phone</span>
            </button>
            <button id="modeGridBtn" onclick="setDisplayMode('grid')" class="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-all">
              <i class="fa-solid fa-grip text-slate-500"></i>
              <span>All 38 Screens Artboard Grid</span>
            </button>
          </div>

          <!-- Live Guest / Logged-In Indicator -->
          <div id="guestBadge" class="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-medium flex items-center gap-2">
            <span id="guestDot" class="w-2 h-2 rounded-full bg-amber-500 pulse-dot"></span>
            <span id="guestLabel" class="text-amber-800 font-semibold">Guest Mode (Free Browse)</span>
            <button onclick="toggleAuthState()" id="guestToggleBtn" class="ml-1 px-2.5 py-0.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-[10px] font-bold shadow-xs">Login</button>
          </div>
        </div>
      </div>

      <!-- Module Group Filter Bar -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-medium pb-0.5" id="moduleFilterBar"></div>

      <!-- Horizontal 38-Screen Quick Jump Bar -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px] font-mono pt-0.5" id="screenJumpBar"></div>
    </div>
  </header>

  <!-- ===================================================================== -->
  <!-- MODE 1: INTERACTIVE PHONE SIMULATOR + LIVE WORKFLOW SIDEBAR           -->
  <!-- ===================================================================== -->
  <main id="phoneModeContainer" class="max-w-6xl mx-auto px-3 py-6 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">

    <!-- MOBILE DEVICE CHASSIS (CLEAN PREMIUM WHITE/SLATE DEVICE FRAME) -->
    <div id="phoneChassis" class="w-full max-w-[412px] h-[872px] bg-white rounded-[48px] border-[10px] border-slate-900 shadow-[0_25px_70px_rgba(15,23,42,0.18),0_0_0_1px_rgba(0,0,0,0.06)] relative overflow-hidden flex flex-col shrink-0">

      <!-- Phone Status Bar -->
      <div id="phoneStatusBar" class="h-11 px-7 flex items-center justify-between text-[11px] text-slate-800 font-bold z-30 shrink-0 bg-white">
        <span>09:41</span>
        <!-- Dynamic Island / Speaker Notch -->
        <div class="w-28 h-5 bg-slate-950 rounded-full flex items-center justify-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span class="text-[8px] text-slate-300 font-mono tracking-widest">UPTIME</span>
        </div>
        <div class="flex items-center gap-1.5 text-[10px] text-slate-700">
          <i class="fa-solid fa-signal"></i>
          <i class="fa-solid fa-wifi"></i>
          <span class="text-emerald-600 font-bold">100%</span>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- ZOMATO / BIGBASKET STYLE TOP LOCATION HEADER                      -->
      <!-- (Replaces Logo at top! Shows Home Location with Dropdown Selector) -->
      <!-- ================================================================= -->
      <div id="appTopHeader" class="px-4 pt-1 pb-2.5 bg-white border-b border-slate-100 z-20 shrink-0">
        <div class="flex items-center justify-between gap-2">
          <!-- Zomato / BigBasket Location Picker Trigger -->
          <div onclick="goScreen(2)" class="flex items-center gap-2 cursor-pointer flex-1 min-w-0 group">
            <div class="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0 group-hover:scale-105 transition-transform">
              <i class="fa-solid fa-location-dot text-sm"></i>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1 leading-tight">
                <span id="activeLocationLabel" class="text-xs font-bold text-slate-900 truncate">Home</span>
                <i class="fa-solid fa-chevron-down text-[9px] text-slate-600"></i>
              </div>
              <p id="activeLocationAddress" class="text-[10px] text-slate-500 truncate max-w-[210px]">Plot 42, 4th Phase, Peenya Industrial Area, Bengaluru</p>
            </div>
          </div>

          <!-- Header Right Utilities (Language, Notifications, Profile Avatar) -->
          <div class="flex items-center gap-1.5 shrink-0">
            <!-- 9-Language Pill -->
            <button onclick="cycleLanguage()" id="langBtn" class="px-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 flex items-center gap-1 transition-colors" title="Switch Language">
              <i class="fa-solid fa-language text-blue-600"></i>
              <span id="langCode">EN</span>
            </button>
            <!-- Notifications Bell -->
            <button onclick="goScreen(38)" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center justify-center relative transition-colors" title="Notifications">
              <i class="fa-solid fa-bell"></i>
              <span class="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
            </button>
            <!-- User Profile Avatar -->
            <button onclick="goScreen(38)" class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-xs" title="User Profile">
              <span id="headerAvatarText">P</span>
            </button>
          </div>
        </div>
      </div>

      <!-- DYNAMIC SCREEN VIEWPORT (WHITE BACKGROUND APPS) -->
      <div id="phoneViewport" class="flex-1 overflow-y-auto no-scrollbar z-10 relative bg-white"></div>

      <!-- Automobile Floating Red SOS 60s Button -->
      <button id="autoSosFab" onclick="requireServiceAuth(14, 'Launch 60s Roadside Emergency SOS')" class="hidden absolute bottom-20 right-4 z-30 px-4 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 items-center gap-2 transition-all">
        <i class="fa-solid fa-truck-medical animate-bounce"></i>
        <span>SOS 60s</span>
      </button>

      <!-- Persistent 5-Tab Bottom Navigation (Urban Company / Zomato Clean Style) -->
      <nav id="appBottomNav" class="h-16 px-2 bg-white border-t border-slate-200/90 grid grid-cols-5 items-center z-20 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <button onclick="goScreen(4)" id="bnav-home" class="flex flex-col items-center gap-1 text-blue-600 transition-colors">
          <i class="fa-solid fa-house text-base"></i>
          <span class="text-[10px] font-bold">Home</span>
        </button>
        <button onclick="goScreen(18)" id="bnav-jobs" class="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-700 relative transition-colors">
          <span class="w-2 h-2 rounded-full bg-blue-600 absolute top-0.5 right-5 ring-2 ring-white"></span>
          <i class="fa-solid fa-clipboard-list text-base"></i>
          <span class="text-[10px] font-semibold">Jobs</span>
        </button>
        <button onclick="goScreen(21)" id="bnav-assets" class="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors">
          <i class="fa-solid fa-boxes-stacked text-base"></i>
          <span class="text-[10px] font-semibold">Assets</span>
        </button>
        <button onclick="goScreen(31)" id="bnav-market" class="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors">
          <i class="fa-solid fa-bag-shopping text-base"></i>
          <span class="text-[10px] font-semibold">Spares</span>
        </button>
        <button onclick="goScreen(38)" id="bnav-profile" class="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors">
          <i class="fa-solid fa-circle-user text-base"></i>
          <span class="text-[10px] font-semibold">Account</span>
        </button>
      </nav>

      <!-- SEAMLESS SERVICE-TRIGGERED LOGIN OVERLAY MODAL -->
      <div id="serviceAuthOverlay" class="hidden absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end">
        <div class="bg-white rounded-t-[32px] p-6 shadow-2xl border-t border-slate-200 space-y-4">
          <div class="w-10 h-1 bg-slate-300 rounded-full mx-auto"></div>
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Service Authentication</span>
              <h3 class="text-base font-extrabold text-slate-900 mt-1.5">Sign In to Take Service</h3>
              <p id="pendingActionLabel" class="text-xs text-slate-500 mt-0.5">Booking context will be preserved</p>
            </div>
            <button onclick="closeAuthOverlay()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="text-[11px] font-bold text-slate-700 block mb-1">10-Digit Mobile Number (India)</label>
              <div class="flex gap-2">
                <span class="px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-700">+91</span>
                <input id="modalPhone" type="tel" value="98450 67890" class="flex-1 px-3 py-2.5 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
              </div>
            </div>
            <div>
              <label class="text-[11px] font-bold text-slate-700 block mb-1">6-Digit SMS OTP (Auto-Filled)</label>
              <div class="grid grid-cols-6 gap-2 text-center font-bold text-base">
                <input value="4" maxlength="1" class="py-2 rounded-xl bg-slate-50 border border-blue-500 text-blue-700 text-center font-extrabold" />
                <input value="8" maxlength="1" class="py-2 rounded-xl bg-slate-50 border border-blue-500 text-blue-700 text-center font-extrabold" />
                <input value="2" maxlength="1" class="py-2 rounded-xl bg-slate-50 border border-blue-500 text-blue-700 text-center font-extrabold" />
                <input value="9" maxlength="1" class="py-2 rounded-xl bg-slate-50 border border-blue-500 text-blue-700 text-center font-extrabold" />
                <input value="1" maxlength="1" class="py-2 rounded-xl bg-slate-50 border border-blue-500 text-blue-700 text-center font-extrabold" />
                <input value="6" maxlength="1" class="py-2 rounded-xl bg-slate-50 border border-blue-500 text-blue-700 text-center font-extrabold" />
              </div>
            </div>
            <div>
              <label class="text-[11px] font-bold text-slate-700 block mb-1">Owner / Plant Name</label>
              <input id="modalOwnerName" type="text" value="Pavan Sharma • Peenya Unit #4" class="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:border-blue-600" />
            </div>
          </div>

          <button onclick="confirmServiceLogin()" class="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all">
            <i class="fa-solid fa-shield-check text-emerald-400"></i>
            <span>Verify OTP & Continue to Service →</span>
          </button>
          <p class="text-[11px] text-center text-slate-500">Browsing is always free • Login only triggers on bookings</p>
        </div>
      </div>
    </div>

    <!-- RIGHT INSPECTOR PANEL: SCREEN SPEC + WORKFLOW GUIDE -->
    <aside class="w-full max-w-md space-y-4">
      <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <span id="inspectorBadge" class="text-[11px] font-mono px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">SCREEN 01 / 38</span>
          <span id="inspectorModule" class="text-xs font-bold text-slate-500">Entry & Auth</span>
        </div>
        <h2 id="inspectorTitle" class="text-lg font-display font-extrabold text-slate-900 leading-snug">01. Splash Screen (First Tap)</h2>
        <p id="inspectorDesc" class="text-xs text-slate-600 leading-relaxed">
          Matches uploaded brand image with centered UPTIME icon and "Downtime ends here." Tap anywhere or press Explore to launch directly into Home without introductory tour screens.
        </p>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button onclick="prevScreen()" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors">
            <i class="fa-solid fa-arrow-left"></i> Prev
          </button>
          <button onclick="nextScreen()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-colors">
            Next Screen <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Quick Jump Navigator -->
      <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">Owner App Workflow Stages</h3>
          <span class="text-[10px] font-mono text-slate-500">38 Total Screens</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <button onclick="goScreen(1)" class="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 text-left font-semibold text-slate-800 transition-all">
            <div class="text-[10px] text-slate-500">S01</div>
            <div>Brand Splash</div>
          </button>
          <button onclick="goScreen(2)" class="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 text-left font-semibold text-slate-800 transition-all">
            <div class="text-[10px] text-slate-500">S02</div>
            <div>Location & Address</div>
          </button>
          <button onclick="goScreen(4)" class="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 text-left font-semibold text-slate-800 transition-all">
            <div class="text-[10px] text-slate-500">S04</div>
            <div>3-Portal Home</div>
          </button>
          <button onclick="goScreen(6)" class="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 text-left font-semibold text-slate-800 transition-all">
            <div class="text-[10px] text-slate-500">S06</div>
            <div>Fault Report Studio</div>
          </button>
          <button onclick="goScreen(7)" class="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 text-left font-semibold text-slate-800 transition-all">
            <div class="text-[10px] text-slate-500">S07</div>
            <div>Gemini AI + 3-Path</div>
          </button>
          <button onclick="goScreen(10)" class="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 text-left font-semibold text-slate-800 transition-all">
            <div class="text-[10px] text-slate-500">S10</div>
            <div>Agora HD Video Call</div>
          </button>
          <button onclick="goScreen(11)" class="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 text-left font-semibold text-slate-800 transition-all">
            <div class="text-[10px] text-slate-500">S11</div>
            <div>Smart Tech Match</div>
          </button>
          <button onclick="goScreen(15)" class="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 text-left font-semibold text-slate-800 transition-all">
            <div class="text-[10px] text-slate-500">S15</div>
            <div>Live GPS Radar Map</div>
          </button>
          <button onclick="goScreen(16)" class="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 text-left font-semibold text-slate-800 transition-all">
            <div class="text-[10px] text-slate-500">S16</div>
            <div>Arrival OTP + 500m Lock</div>
          </button>
          <button onclick="goScreen(24)" class="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 text-left font-semibold text-slate-800 transition-all">
            <div class="text-[10px] text-slate-500">S24</div>
            <div>IoT Digital Twin</div>
          </button>
        </div>
      </div>
    </aside>
  </main>

  <!-- ===================================================================== -->
  <!-- MODE 2: ALL 38 SCREENS FIGMA ARTBOARD GRID (PANORAMIC LIGHT THEME)   -->
  <!-- ===================================================================== -->
  <section id="gridModeContainer" class="hidden max-w-[1700px] mx-auto px-4 py-8">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-display font-extrabold text-slate-900">All 38 Dedicated Owner App Screens (Light Theme)</h2>
        <p class="text-xs text-slate-500">Urban Company / Zomato / BigBasket Clean White Style • Click any screen to interact</p>
      </div>
      <button onclick="setDisplayMode('phone')" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-2">
        <i class="fa-solid fa-mobile-screen-button"></i>
        <span>Switch to Interactive Phone</span>
      </button>
    </div>
    <div id="allScreensGridMount" class="space-y-10"></div>
  </section>

  <script>
    // =========================================================================
    // GLOBAL STATE & DATA
    // =========================================================================
    let currentScreen = 1; // Starts on S01: Exact uploaded Splash screen
    let displayMode = 'phone';
    let isAuthenticated = false;
    let ownerName = 'Guest Explorer';
    let pendingScreenAfterAuth = null;
    let currentPortal = 'industrial';
    const languages = ['EN', 'HI • हिं', 'KN • ಕ', 'TA • த', 'TE • తె', 'ML • മ', 'MR • म', 'GU • ગુ', 'BN • বাং'];
    let langIdx = 0;

    let selectedLocation = {
      tag: 'Home',
      title: 'Peenya Industrial Area',
      address: 'Plot 42, 4th Phase, Peenya Industrial Area, Bengaluru, 560058'
    };

    const portalThemes = {
      industrial: {
        name: 'Industrial Machinery',
        shortName: 'Industries',
        badge: '1,151+ Heavy Machines',
        accentColor: 'text-purple-600',
        activePill: 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold',
        inactivePill: 'text-slate-600 hover:text-slate-900',
        heroTitle: 'Factory Breakdown? Spindle or Boiler Down?',
        heroSub: 'Certified Fanuc, Siemens, IBR Boiler & PLC specialists at your plant in <18 mins.',
        searchPlaceholder: "Search 'CNC Spindle', 'IBR Boiler', 'Hydraulic Press', 'ABB VFD'...",
        chips: ['⚙️ CNC Spindle', '🔥 IBR Boiler', '💧 Hydraulic Press', '🔌 PLC / VFD', '❄️ Industrial Chiller'],
        bannerTitle: 'Zero-Downtime Guarantee',
        bannerSub: 'Level-3 Master Plant Engineers available on-site with 30-Day Escrow Warranty.',
        cats: [
          { title: 'CNC & VMC Machines', sub: 'Fanuc • Siemens • Haas', icon: 'fa-gears', bg: 'bg-purple-50', color: 'text-purple-600', count: '342 Techs' },
          { title: 'IBR Boilers & Burners', sub: 'Thermax • Steam • Valves', icon: 'fa-fire-flame-curved', bg: 'bg-amber-50', color: 'text-amber-600', count: '189 Techs' },
          { title: 'Hydraulic & Pneumatics', sub: 'Rexroth • Cylinders • Seals', icon: 'fa-compress', bg: 'bg-blue-50', color: 'text-blue-600', count: '276 Techs' },
          { title: '3-Phase Motors & VFDs', sub: 'ABB • Rewinding • Bearings', icon: 'fa-bolt', bg: 'bg-emerald-50', color: 'text-emerald-600', count: '412 Techs' }
        ]
      },
      automobile: {
        name: 'Automobile & Fleet',
        shortName: 'Automobile',
        badge: '24/7 Roadside & EV SOS',
        accentColor: 'text-rose-600',
        activePill: 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold',
        inactivePill: 'text-slate-600 hover:text-slate-900',
        heroTitle: 'Stranded on Highway or Vehicle Breakdown?',
        heroSub: '60-Second SOS Live Auction, OBD-II Scanner, EV High-Voltage Rescue, Flat Tyre.',
        searchPlaceholder: "Search 'Battery Jumpstart', 'EV Charging', 'Flat Tyre', 'Clutch Repair'...",
        chips: ['🆘 60s Highway SOS', '🔋 EV High-Voltage', '🛞 Flat Tyre / Fuel', '🚨 Warning Light AI'],
        bannerTitle: '60-Second Highway SOS',
        bannerSub: 'Live GPS broadcast to all nearby mechanics. Average arrival in 14 minutes.',
        cats: [
          { title: 'Roadside Battery Jump', sub: '15-min SOS • Exide / Amaron', icon: 'fa-car-battery', bg: 'bg-rose-50', color: 'text-rose-600', count: '520 Techs' },
          { title: 'EV Battery & Motor BMS', sub: 'Tata • Ola • Ather • MG', icon: 'fa-charging-station', bg: 'bg-emerald-50', color: 'text-emerald-600', count: '164 Techs' },
          { title: 'Engine & Transmission', sub: 'OBD-II • Diesel & Petrol', icon: 'fa-car-side', bg: 'bg-blue-50', color: 'text-blue-600', count: '390 Techs' },
          { title: 'Heavy Trucks & Fleet', sub: 'BS6 • Air Brakes • Injectors', icon: 'fa-truck-moving', bg: 'bg-amber-50', color: 'text-amber-600', count: '215 Techs' }
        ]
      },
      electronics: {
        name: 'Electronics & HVAC',
        shortName: 'Electronics',
        badge: 'Home & Office Appliances',
        accentColor: 'text-cyan-600',
        activePill: 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold',
        inactivePill: 'text-slate-600 hover:text-slate-900',
        heroTitle: 'Inverter AC Not Cooling or Board Fault?',
        heroSub: 'Doorstep chip-level repair with Privacy Data Lock & Repair-vs-Replace AI.',
        searchPlaceholder: "Search 'Inverter AC Gas Leak', 'Fridge Compressor', 'Laptop PCB'...",
        chips: ['❄️ Inverter Split AC', '🧊 Refrigerator PCB', '💻 Chip-Level Laptop', '🔋 Solar / UPS'],
        bannerTitle: 'Urban Company-Grade Repair',
        bannerSub: 'Fixed transparent pricing, 90-day spare warranty, no hidden inspection fees.',
        cats: [
          { title: 'Inverter AC & HVAC', sub: 'Daikin • LG • R32 Gas Refill', icon: 'fa-snowflake', bg: 'bg-cyan-50', color: 'text-cyan-600', count: '610 Techs' },
          { title: 'Commercial Refrigeration', sub: 'Deep Freezers • Compressors', icon: 'fa-temperature-low', bg: 'bg-blue-50', color: 'text-blue-600', count: '298 Techs' },
          { title: 'Laptops, Servers & UPS', sub: 'Motherboard • Data Lock', icon: 'fa-laptop-code', bg: 'bg-indigo-50', color: 'text-indigo-600', count: '430 Techs' },
          { title: 'Solar Inverters & RO', sub: 'Hybrid Inverters • Membranes', icon: 'fa-solar-panel', bg: 'bg-amber-50', color: 'text-amber-600', count: '185 Techs' }
        ]
      }
    };

    // =========================================================================
    // MASTER REGISTRY OF ALL 38 SCREENS (LIGHT THEME)
    // =========================================================================
    const SCREENS = [
      { id: 1, group: 'Entry & Auth', short: 'Splash', title: '01. Brand Splash Screen (Uploaded Image Match)', desc: 'Exact match to uploaded screenshot: sleek centered UPTIME icon + "Downtime ends here." on black background, tapping transitions directly into Home.' },
      { id: 2, group: 'Entry & Auth', short: 'Location Picker', title: '02. Zomato / BigBasket Location Selector', desc: 'Replaces old onboarding tour: Full interactive location screen with GPS auto-detect, search bar, saved addresses (Home, Plant, Office) and map pin.' },
      { id: 3, group: 'Entry & Auth', short: 'OTP Login Gate', title: '03. Service-Triggered Phone + 6-Digit OTP Gate', desc: 'Crisp white card modal: Appears ONLY when guest books or takes service — keeps exact booking context intact.' },

      { id: 4, group: 'Home & Catalog', short: '3-Portal Home', title: '04. 3-Portal Home Command Hub (Zomato / UC Style)', desc: 'Location header with dropdown, search bar with mic, Ajio-style 3-Portal Switcher [Industries | Automobile | Electronics], category grids & nearby techs.' },
      { id: 5, group: 'Home & Catalog', short: 'A-Z Catalogue', title: '05. A-to-Z Equipment & Specialist Explorer', desc: 'Alphabetical directory across 1,151+ machines, vehicles & appliances with live technician availability count.' },

      { id: 6, group: 'Fault & AI Triage', short: 'Report Fault', title: '06. Multi-Input Fault Report Studio (CORE-01)', desc: 'Voice input in 9 Indian languages, photo/video evidence capture, 48kHz audio sound recorder & 4 urgency tiers.' },
      { id: 7, group: 'Fault & AI Triage', short: 'AI + 3-Path Choice', title: '07. Gemini AI Diagnosis & 3-Path Choice (v1.1)', desc: 'Diagnostic report with root cause + cost estimate (₹800–₹1,500) + Pavan’s 3-Path Choice: Free AI Copilot | ₹199 Video | ₹800+ On-Site Tech.' },
      { id: 8, group: 'Fault & AI Triage', short: 'DIY AI Copilot', title: '08. Owner Free AI DIY Copilot (Step-by-Step)', desc: 'Interactive step-by-step self-repair instructions with safety checklist, tool list & 1-tap escalation to video or technician.' },

      { id: 9, group: 'Video Consult', short: 'Consult Tiers', title: '09. Virtual Consult Tier & Specialist Picker', desc: 'Urban Company style tiers: Quick Check (₹99), Full Diagnosis (₹199 - Recommended), Extended (₹299) with live available engineers.' },
      { id: 10, group: 'Video Consult', short: 'Agora Live Call', title: '10. Agora HD Video Call + AI AR Overlay', desc: 'Live WebRTC video room with real-time AR laser pointer annotations and automatic ₹199 deduction if physical visit is needed.' },

      { id: 11, group: 'Match & Book', short: 'Tech List/Map', title: '11. Smart Technician Matching (60% Skill + 40% Dist)', desc: 'Zomato-style card listing of top-rated technicians with skill match %, distance, verified badges, transparent rates & Google Map toggle.' },
      { id: 12, group: 'Match & Book', short: 'Tech Profile', title: '12. Technician Full Profile & Polygon NFT Badges', desc: 'Inspect government KYC, NCVT certification, Polygon blockchain skill badges, tools carried & verified owner reviews.' },
      { id: 13, group: 'Match & Book', short: 'Negotiate & Book', title: '13. AI Price Negotiation & Booking Confirmation', desc: 'Transparent counter-offer slider within AI fair-price band, site address confirmation & ₹49 per-job micro-insurance shield.' },
      { id: 14, group: 'Match & Book', short: '60s SOS Auction', title: '14. 60-Second Emergency SOS Live Auction', desc: 'Emergency highway/factory breakdown broadcast with pulsing 60s countdown and live competing technician ETA bids.' },

      { id: 15, group: 'Track & Verify', short: 'Live GPS Map', title: '15. Uber-Style Live GPS Tracking & In-App Chat', desc: 'Live map tracking with moving technician marker, estimated arrival countdown, 5-stage job stepper & translated chat.' },
      { id: 16, group: 'Track & Verify', short: '6-Digit OTP+GPS', title: '16. Dual-Factor 6-Digit OTP + 500m PostGIS Lock', desc: 'Fraud-proof arrival screen showing bold 6-digit OTP paired with PostGIS <500m geofence verification before job start.' },
      { id: 17, group: 'Track & Verify', short: 'Live Repair Steps', title: '17. Live In-Progress Repair & Parts Approval', desc: 'Track live progress of technician checklist with photos and approve extra spare part quotes directly from phone.' },

      { id: 18, group: 'Jobs & History', short: 'Job History', title: '18. Job History & Filter Ledger', desc: 'Filter jobs by Active, Completed, or Warranty Covered with itemized bills and 1-tap certificate download.' },
      { id: 19, group: 'Jobs & History', short: 'SHA-256 Cert', title: '19. Job Details & SHA-256 Tamper-Proof Certificate', desc: 'Complete repair timeline, before/after photo slider, itemized GST bill & cryptographic SHA-256 warranty certificate.' },
      { id: 20, group: 'Jobs & History', short: 'Rate & Tip', title: '20. Rate & Review Technician Screen', desc: 'Star rating, skill compliments (Punctual, Master Fixer, Clean Work), optional appreciation tip & warranty activation.' },

      { id: 21, group: 'Assets & Twin', short: 'My Assets Hub', title: '21. My Assets Hub (Machines | Vehicles | Devices)', desc: 'Central inventory of factory machines, fleet vehicles & appliances with live health scores and AMC countdowns.' },
      { id: 22, group: 'Assets & Twin', short: 'Add Asset OCR', title: '22. Quick Add Asset & Nameplate OCR Scanner', desc: 'Register a machine, car RC, or appliance in 10 seconds using AI camera scan of the serial nameplate or QR code.' },
      { id: 23, group: 'Assets & Twin', short: 'Asset Details', title: '23. Asset Details, Uptime % & Service Ledger', desc: 'Lifetime repair history, MTBF uptime percentage, linked warranty status & total maintenance spend analysis.' },
      { id: 24, group: 'Assets & Twin', short: 'Digital Twin', title: '24. IoT Digital Twin & Failure Prediction Timeline', desc: 'Circular health meter (94%), vibration/heat component sub-gauges, AI wear prediction dates & preventive savings meter.' },

      { id: 25, group: 'Industry Labs', short: 'Industrial Lab', title: '25. Industrial Lab: Epidemic & Silent Killer Radar', desc: 'Batch model defect alerts (ELEC-U01), power/vibration Silent Killer warnings (ELEC-U02) & multi-plant MSME dashboard.' },
      { id: 26, group: 'Industry Labs', short: 'Automobile Lab', title: '26. Automobile Lab: Warning AI, Mood & Pre-Purchase', desc: 'Dashboard Warning Light camera scanner, Vehicle Mood Score, 50-point Used-Car Pre-Purchase Scan & Challan tools.' },
      { id: 27, group: 'Industry Labs', short: 'Electronics Lab', title: '27. Electronics Lab: Repair-vs-Replace & Data Lock', desc: 'AI Repair-vs-Buy-New calculator, Technician Data-Privacy Lock, Smart Home diagnostics & E-Waste recycling value.' },

      { id: 28, group: 'Shield & Market', short: 'Insurance & AMC', title: '28. Uptime Shield: Micro-Insurance & AMC Plans', desc: 'Manage Equipment/Device Shield policies, per-job protection & scheduled Annual Maintenance Contracts.' },
      { id: 29, group: 'Shield & Market', short: 'Warranty Vault', title: '29. OCR Warranty Vault & Expiry Alerts', desc: 'Scan paper GST bills via OCR to auto-track manufacturer & per-job repair warranties before they expire.' },
      { id: 30, group: 'Shield & Market', short: 'Claim Tracker', title: '30. File Insurance Claim & 5-Stage AI Claim Tracker', desc: 'Upload incident photos & track claim live: Filed → Review → AI Assessed → Approved → Instant Settlement.' },
      { id: 31, group: 'Shield & Market', short: 'Spare Parts', title: '31. OEM Spare Parts & Rare Part Request Market', desc: 'Buy verified bearings, contactors, EV filters & AC PCBs with compatibility check + custom part request form.' },
      { id: 32, group: 'Shield & Market', short: 'Refurbished', title: '32. Certified Refurbished Store (Grade A+)', desc: 'Technician-inspected refurbished motors, oscilloscopes & appliances with 6-month Uptime Guarantee.' },
      { id: 33, group: 'Shield & Market', short: 'Cart & Checkout', title: '33. Spare Parts Cart & Express Site Delivery', desc: 'Manage cart quantities, apply MSME GST input credit & schedule express delivery straight to job site.' },

      { id: 34, group: 'Pay & Profile', short: 'Razorpay Escrow', title: '34. Razorpay Payment & Escrow Checkout', desc: 'Pay via UPI (PhonePe/GPay), Cards, NetBanking or Wallet — held safely in escrow until job completion.' },
      { id: 35, group: 'Pay & Profile', short: 'Wallet & Carbon', title: '35. Wallet, Pro Subscriptions & CO₂ Carbon Credits', desc: 'Uptime Wallet ledger, MSME Zero-Fee Pro plan & verified kg CO₂ saved by repairing instead of discarding.' },
      { id: 36, group: 'Pay & Profile', short: 'Repair Wiki', title: '36. Crowdsourced Repair Wiki & Error Codes', desc: 'Searchable library of Fanuc alarms, OBD-II fault codes & AC error codes extracted from verified repairs.' },
      { id: 37, group: 'Pay & Profile', short: 'Gemini AI Bot', title: '37. 24/7 Gemini Multilingual Repair Chatbot', desc: 'Ask anything by voice or text in 9 Indian languages — instant troubleshooting, cost checks & booking help.' },
      { id: 38, group: 'Pay & Profile', short: 'Alerts & Profile', title: '38. Smart Notifications, Saved Sites & Settings', desc: 'Real-time alerts, saved Factory/Home GPS addresses, language & theme settings, offline cache sync.' }
    ];

    const GROUPS = ['All 38', 'Entry & Auth', 'Home & Catalog', 'Fault & AI Triage', 'Video Consult', 'Match & Book', 'Track & Verify', 'Jobs & History', 'Assets & Twin', 'Industry Labs', 'Shield & Market', 'Pay & Profile'];
    let selectedGroup = 'All 38';

    // =========================================================================
    // RENDER INDIVIDUAL SCREEN HTML (1..38) - CRISP MODERN LIGHT THEME
    // =========================================================================
    function renderScreenHTML(id) {
      const p = portalThemes[currentPortal];

      switch (id) {
        // SCREEN 01: SPLASH SCREEN (EXACT MATCH TO USER'S UPLOADED SCREENSHOT)
        case 1:
          return `
            <div onclick="goScreen(4)" class="h-full bg-black flex flex-col justify-between items-center text-center p-6 cursor-pointer relative select-none">
              <!-- Top spacing to balance center -->
              <div class="h-8"></div>

              <!-- EXACT CENTER LOGO LOCKUP MATCHING USER UPLOADED SCREENSHOT -->
              <div class="flex items-center justify-center gap-4">
                <!-- White rounded square icon with blue U + wrench + green gear + swoosh -->
                <div class="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-[20px] sm:rounded-[24px] flex items-center justify-center p-2.5 shadow-2xl shrink-0">
                  <svg class="w-full h-full" viewBox="0 0 100 100" fill="none">
                    <!-- Blue 'U' Body -->
                    <path d="M22 22 V 54 C 22 72, 78 72, 78 54 V 22" stroke="#0284C7" stroke-width="13" stroke-linecap="round" fill="none" />
                    <!-- Centered Mechanic Wrench -->
                    <path d="M50 32 L50 56 M44 38 L56 38" stroke="#0F172A" stroke-width="8" stroke-linecap="round" />
                    <!-- Green Industrial Gear Accent -->
                    <circle cx="72" cy="28" r="13" stroke="#16A34A" stroke-width="7" fill="none" stroke-dasharray="9 7" />
                    <!-- Dynamic Swoosh -->
                    <path d="M16 66 C 30 84, 70 82, 84 50" stroke="#38BDF8" stroke-width="5" stroke-linecap="round" fill="none" />
                  </svg>
                </div>

                <!-- Thin Vertical White Divider -->
                <div class="w-[1.5px] h-12 bg-white/40"></div>

                <!-- Text Lockup: UPTIME / DOWNTIME ENDS HERE. -->
                <div class="text-left">
                  <h1 class="text-2xl sm:text-3xl font-extrabold tracking-[0.14em] text-white leading-none font-display">UPTIME</h1>
                  <p class="text-[9px] sm:text-[10px] font-bold text-white/90 tracking-[0.22em] mt-1.5 uppercase font-mono">Downtime ends here.</p>
                </div>
              </div>

              <!-- Bottom Hint -->
              <div class="pb-6">
                <span class="text-[10px] font-mono text-white/40 tracking-wider">TAP ANYWHERE TO ENTER</span>
              </div>
            </div>
          `;

        // SCREEN 02: ZOMATO / BIGBASKET STYLE LOCATION & ADDRESS SELECTOR
        case 2:
          return `
            <div class="p-4 space-y-4">
              <!-- Location Screen Header -->
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <div class="flex items-center gap-2">
                  <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
                    <i class="fa-solid fa-arrow-left"></i>
                  </button>
                  <h2 class="text-base font-extrabold text-slate-900">Select Location</h2>
                </div>
                <span class="text-[10px] font-mono text-slate-400">Bangalore</span>
              </div>

              <!-- Search Location Input (Zomato / BigBasket style) -->
              <div class="relative">
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-400 text-xs"></i>
                <input type="text" placeholder="Search area, street name, pincode..." class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium" />
              </div>

              <!-- GPS Auto-Detect Button -->
              <button onclick="setLocation('GPS Location', 'Peenya 4th Phase, Bangalore', 'Peenya Industrial Area, Bengaluru, Karnataka 560058'); goScreen(4);" class="w-full p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center justify-between text-left transition-all">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center text-sm shadow-xs">
                    <i class="fa-solid fa-crosshairs animate-spin-slow"></i>
                  </div>
                  <div>
                    <div class="text-xs font-bold text-rose-700">Use Current GPS Location</div>
                    <div class="text-[11px] text-rose-600/80">Peenya 4th Phase, Bengaluru (Accurate to 8m)</div>
                  </div>
                </div>
                <i class="fa-solid fa-chevron-right text-xs text-rose-400"></i>
              </button>

              <!-- Saved Addresses List (BigBasket style) -->
              <div class="space-y-2.5 pt-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">Saved Addresses</span>
                  <button class="text-xs font-bold text-blue-600 hover:text-blue-700">+ Add New</button>
                </div>

                <!-- Address 1: Home -->
                <div onclick="setLocation('Home', 'Peenya 4th Phase', 'Plot 42, 4th Phase, Peenya Industrial Area, Bengaluru, 560058'); goScreen(4);" class="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-600 hover:shadow-sm cursor-pointer space-y-1.5 transition-all">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px]">🏠 HOME</span>
                      <span class="text-xs font-bold text-slate-900">Peenya Residence</span>
                    </div>
                    <span class="text-[11px] font-bold text-emerald-600">Active</span>
                  </div>
                  <p class="text-[11px] text-slate-600">Plot 42, 4th Phase, Near TVS Cross, Peenya, Bengaluru 560058</p>
                </div>

                <!-- Address 2: Factory / Plant -->
                <div onclick="setLocation('Factory', 'KIADB Industrial Area', 'Unit 12, Precision Engineering Yard, KIADB Peenya, Bengaluru'); goScreen(4);" class="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-600 hover:shadow-sm cursor-pointer space-y-1.5 transition-all">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px]">🏭 FACTORY</span>
                      <span class="text-xs font-bold text-slate-900">MSME Unit #4</span>
                    </div>
                  </div>
                  <p class="text-[11px] text-slate-600">Unit 12, Precision Engineering Yard, KIADB Industrial Area, Bengaluru</p>
                </div>

                <!-- Address 3: Central Office -->
                <div onclick="setLocation('Office', 'Indiranagar 100ft Rd', 'Level 3, Tech Park Towers, 100ft Road, Indiranagar, Bengaluru'); goScreen(4);" class="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-600 hover:shadow-sm cursor-pointer space-y-1.5 transition-all">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">🏢 OFFICE</span>
                      <span class="text-xs font-bold text-slate-900">Headquarters</span>
                    </div>
                  </div>
                  <p class="text-[11px] text-slate-600">Level 3, Tech Park Towers, 100ft Road, Indiranagar, Bengaluru 560038</p>
                </div>
              </div>

              <!-- Map Preview Pin Card -->
              <div class="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative h-32 flex items-center justify-center">
                <div class="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:12px_12px]"></div>
                <div class="relative z-10 flex flex-col items-center gap-1">
                  <div class="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <span class="text-[10px] font-bold text-slate-800 bg-white/90 px-2.5 py-0.5 rounded-full shadow-xs">Peenya Industrial Area</span>
                </div>
              </div>
            </div>
          `;

        // SCREEN 03: SERVICE-TRIGGERED PHONE + OTP AUTH SCREEN
        case 3:
          return `
            <div class="p-5 space-y-4">
              <div class="text-center space-y-1 pt-2">
                <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mx-auto mb-2 border border-blue-100">
                  <i class="fa-solid fa-lock"></i>
                </div>
                <h2 class="text-lg font-extrabold text-slate-900">Owner Verification</h2>
                <p class="text-xs text-slate-500">Sign in to confirm service bookings & escrow protection</p>
              </div>

              <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div>
                  <label class="text-[11px] font-bold text-slate-700 block mb-1">Mobile Number</label>
                  <div class="flex gap-2">
                    <span class="px-3 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs text-slate-700">+91</span>
                    <input type="tel" value="98450 67890" class="flex-1 px-3 py-2.5 rounded-xl bg-white border border-slate-200 font-semibold text-xs text-slate-900" />
                  </div>
                </div>

                <div>
                  <div class="flex justify-between items-center mb-1">
                    <label class="text-[11px] font-bold text-slate-700">Enter 6-Digit OTP</label>
                    <span class="text-[10px] text-blue-600 font-bold">Resend in 24s</span>
                  </div>
                  <div class="grid grid-cols-6 gap-1.5 text-center font-bold text-sm">
                    <input value="4" class="py-2 rounded-xl bg-white border border-blue-500 text-blue-600 text-center font-extrabold" />
                    <input value="8" class="py-2 rounded-xl bg-white border border-blue-500 text-blue-600 text-center font-extrabold" />
                    <input value="2" class="py-2 rounded-xl bg-white border border-blue-500 text-blue-600 text-center font-extrabold" />
                    <input value="9" class="py-2 rounded-xl bg-white border border-blue-500 text-blue-600 text-center font-extrabold" />
                    <input value="1" class="py-2 rounded-xl bg-white border border-blue-500 text-blue-600 text-center font-extrabold" />
                    <input value="6" class="py-2 rounded-xl bg-white border border-blue-500 text-blue-600 text-center font-extrabold" />
                  </div>
                </div>

                <div>
                  <label class="text-[11px] font-bold text-slate-700 block mb-1">Registered Owner / Plant Name</label>
                  <input type="text" value="Pavan Sharma (MSME Unit #4)" class="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900" />
                </div>
              </div>

              <button onclick="confirmServiceLogin()" class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2">
                <i class="fa-solid fa-check"></i>
                <span>Verify OTP & Unlock Full Services</span>
              </button>

              <div class="text-center pt-2">
                <button onclick="goScreen(4)" class="text-xs font-semibold text-slate-500 hover:text-slate-800">
                  ← Continue browsing as Guest
                </button>
              </div>
            </div>
          `;

        // SCREEN 04: 3-PORTAL HOME COMMAND HUB (URBAN COMPANY / AJIO / ZOMATO MODERN STYLE)
        case 4:
          return `
            <div class="p-4 space-y-4">
              <!-- ZOMATO / URBAN COMPANY STYLE INTERACTIVE SEARCH BAR -->
              <div onclick="goScreen(5)" class="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200/80 cursor-pointer flex items-center justify-between border border-slate-200/80 transition-all shadow-xs">
                <div class="flex items-center gap-2.5 flex-1 min-w-0">
                  <i class="fa-solid fa-magnifying-glass text-slate-400 text-xs"></i>
                  <span class="text-xs text-slate-500 truncate font-medium">${p.searchPlaceholder}</span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button onclick="event.stopPropagation(); goScreen(6);" class="w-7 h-7 rounded-full bg-white text-rose-600 flex items-center justify-center text-xs shadow-xs" title="Voice Search">
                    <i class="fa-solid fa-microphone"></i>
                  </button>
                </div>
              </div>

              <!-- AJIO-STYLE 3-PORTAL SEGMENTED SWITCHER -->
              <div class="p-1 rounded-2xl bg-slate-100 border border-slate-200/80 grid grid-cols-3 gap-1 text-[11px] font-bold">
                <button onclick="setPortal('industrial')" class="py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${currentPortal==='industrial' ? p.activePill : p.inactivePill}">
                  <span>🏭</span>
                  <span>Industries</span>
                </button>
                <button onclick="setPortal('automobile')" class="py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${currentPortal==='automobile' ? p.activePill : p.inactivePill}">
                  <span>🚗</span>
                  <span>Automobile</span>
                </button>
                <button onclick="setPortal('electronics')" class="py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${currentPortal==='electronics' ? p.activePill : p.inactivePill}">
                  <span>⚡</span>
                  <span>Electronics</span>
                </button>
              </div>

              <!-- URBAN COMPANY STYLE HERO PROMOTIONAL BANNER CAROUSEL -->
              <div class="rounded-2xl p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md relative overflow-hidden">
                <div class="relative z-10 space-y-2 max-w-[280px]">
                  <span class="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[9px] font-bold uppercase tracking-wider">
                    ${p.badge}
                  </span>
                  <h3 class="text-sm font-extrabold leading-tight text-white">${p.heroTitle}</h3>
                  <p class="text-[11px] text-slate-300 leading-normal">${p.heroSub}</p>
                  <div class="pt-1 flex items-center gap-2">
                    <button onclick="requireServiceAuth(11, 'Book Emergency Technician')" class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5">
                      <span>Book Tech</span>
                      <i class="fa-solid fa-arrow-right text-[10px]"></i>
                    </button>
                    <button onclick="goScreen(7)" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs">
                      Free AI Triage
                    </button>
                  </div>
                </div>
                <!-- Decorative Graphic Element -->
                <div class="absolute -right-4 -bottom-6 w-32 h-32 rounded-full bg-blue-600/20 blur-xl pointer-events-none"></div>
              </div>

              <!-- QUICK RESOLUTION ACTIONS (3-PATH SHORTCUTS) -->
              <div class="grid grid-cols-3 gap-2">
                <!-- Action 1: AI Sound Doctor -->
                <div onclick="goScreen(6)" class="p-3 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-sm cursor-pointer space-y-1.5 transition-all text-center">
                  <div class="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-base mx-auto">
                    <i class="fa-solid fa-microphone-lines"></i>
                  </div>
                  <div class="text-[11px] font-extrabold text-slate-900">AI Sound Triage</div>
                  <div class="text-[9px] text-slate-500">Record noise</div>
                </div>

                <!-- Action 2: Video Consult -->
                <div onclick="requireServiceAuth(9, 'Start Video Consultation')" class="p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm cursor-pointer space-y-1.5 transition-all text-center">
                  <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-base mx-auto">
                    <i class="fa-solid fa-video"></i>
                  </div>
                  <div class="text-[11px] font-extrabold text-slate-900">Video Call</div>
                  <div class="text-[9px] text-blue-600 font-bold">₹199 Consult</div>
                </div>

                <!-- Action 3: Emergency Dispatch -->
                <div onclick="requireServiceAuth(11, 'Book Emergency Technician')" class="p-3 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 hover:shadow-sm cursor-pointer space-y-1.5 transition-all text-center">
                  <div class="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-base mx-auto">
                    <i class="fa-solid fa-truck-fast"></i>
                  </div>
                  <div class="text-[11px] font-extrabold text-slate-900">On-Site Tech</div>
                  <div class="text-[9px] text-slate-500">18-min dispatch</div>
                </div>
              </div>

              <!-- SERVICE CATEGORIES MATRIX (URBAN COMPANY STYLE) -->
              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Top Service Categories</h3>
                  <button onclick="goScreen(5)" class="text-xs font-bold text-blue-600 hover:text-blue-700">See All 1,151+ →</button>
                </div>

                <div class="grid grid-cols-2 gap-2.5">
                  ${p.cats.map(c => `
                    <div onclick="goScreen(5)" class="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-sm cursor-pointer flex items-center gap-3 transition-all">
                      <div class="w-11 h-11 rounded-2xl ${c.bg} ${c.color} flex items-center justify-center text-lg shrink-0">
                        <i class="fa-solid ${c.icon}"></i>
                      </div>
                      <div class="min-w-0">
                        <div class="text-xs font-bold text-slate-900 truncate leading-snug">${c.title}</div>
                        <div class="text-[10px] text-slate-500 truncate">${c.sub}</div>
                        <div class="text-[9px] font-bold text-emerald-600 mt-0.5">${c.count}</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- TOP NEARBY CERTIFIED SPECIALISTS (ZOMATO STYLE RESTAURANT/SPECIALIST CARDS) -->
              <div class="space-y-2.5 pt-1">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Verified Master Engineers Nearby</h3>
                    <p class="text-[10px] text-slate-500">Peenya & West Bangalore Cluster</p>
                  </div>
                  <span class="text-[10px] font-mono text-emerald-600 font-bold">● 24 Online</span>
                </div>

                <!-- Specialist Card 1 -->
                <div onclick="requireServiceAuth(12, 'View Tech Profile & Book')" class="p-3.5 rounded-2xl bg-white border border-slate-200 hover:shadow-sm cursor-pointer space-y-2.5 transition-all">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                        RK
                      </div>
                      <div>
                        <div class="flex items-center gap-1.5">
                          <h4 class="text-xs font-extrabold text-slate-900">Rajesh Kumar</h4>
                          <span class="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">Level 3 Master</span>
                        </div>
                        <p class="text-[11px] text-slate-500">Fanuc CNC Spindle & Siemens S7 PLC Specialist</p>
                        <div class="flex items-center gap-2 text-[10px] text-slate-600 font-medium mt-0.5">
                          <span class="text-amber-600 font-bold">★ 4.9 (428 jobs)</span>
                          <span>•</span>
                          <span>1.8 km away</span>
                          <span>•</span>
                          <span class="text-emerald-600 font-bold">14 min ETA</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-right shrink-0">
                      <div class="text-xs font-extrabold text-slate-900">₹850</div>
                      <div class="text-[9px] text-slate-400">base charge</div>
                    </div>
                  </div>

                  <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span class="text-[10px] font-medium text-slate-500">Govt NCVT Verified • Polygon NFT Badge #482</span>
                    <button class="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px]">Book Now</button>
                  </div>
                </div>
              </div>

              <!-- URBAN COMPANY TRUST & SAFETY NUDGES -->
              <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-600">
                <div>
                  <i class="fa-solid fa-shield-halved text-blue-600 text-sm mb-1 block"></i>
                  <span class="font-bold text-slate-800">Escrow Protected</span>
                  <div class="text-[9px] text-slate-500">Pay after repair proof</div>
                </div>
                <div>
                  <i class="fa-solid fa-certificate text-emerald-600 text-sm mb-1 block"></i>
                  <span class="font-bold text-slate-800">30-Day Guarantee</span>
                  <div class="text-[9px] text-slate-500">Zero-downtime warranty</div>
                </div>
                <div>
                  <i class="fa-solid fa-id-card-clip text-purple-600 text-sm mb-1 block"></i>
                  <span class="font-bold text-slate-800">Govt Aadhaar KYC</span>
                  <div class="text-[9px] text-slate-500">100% verified engineers</div>
                </div>
              </div>
            </div>
          `;

        // SCREEN 05: A-TO-Z EQUIPMENT & SPECIALIST EXPLORER
        case 5:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <div class="flex items-center gap-2">
                  <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
                    <i class="fa-solid fa-arrow-left"></i>
                  </button>
                  <h2 class="text-base font-extrabold text-slate-900">A-to-Z Machine Catalog</h2>
                </div>
                <span class="text-[10px] font-mono text-blue-600 font-bold">1,151+ Models</span>
              </div>

              <div class="relative">
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-400 text-xs"></i>
                <input type="text" placeholder="Filter equipment model or brand..." class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
              </div>

              <!-- Alphabetical Scroll Bar -->
              <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold text-slate-600 py-1">
                <span class="px-2.5 py-1 rounded-lg bg-blue-600 text-white">ALL</span>
                <span class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200">A</span>
                <span class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200">B</span>
                <span class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200">C</span>
                <span class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200">D</span>
                <span class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200">E</span>
                <span class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200">F</span>
                <span class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200">G</span>
                <span class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200">H</span>
                <span class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200">M</span>
                <span class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200">S</span>
              </div>

              <!-- Equipment Items List -->
              <div class="space-y-2.5">
                <!-- Machine Item 1 -->
                <div onclick="goScreen(6)" class="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-600 hover:shadow-sm cursor-pointer flex items-center justify-between transition-all">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                      <i class="fa-solid fa-gears"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-slate-900">CNC Vertical Machining Center (VMC)</div>
                      <div class="text-[10px] text-slate-500">Fanuc 0i-MF • Haas VF-2 • Mazak VCN</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] font-bold text-emerald-600 block">38 Techs</span>
                    <span class="text-[9px] text-slate-400">14 min ETA</span>
                  </div>
                </div>

                <!-- Machine Item 2 -->
                <div onclick="goScreen(6)" class="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-600 hover:shadow-sm cursor-pointer flex items-center justify-between transition-all">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                      <i class="fa-solid fa-fire"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-slate-900">IBR Steam Boilers & Thermic Heaters</div>
                      <div class="text-[10px] text-slate-500">Thermax Combloc • Forbes Marshall</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] font-bold text-emerald-600 block">19 Techs</span>
                    <span class="text-[9px] text-slate-400">22 min ETA</span>
                  </div>
                </div>

                <!-- Machine Item 3 -->
                <div onclick="goScreen(6)" class="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-600 hover:shadow-sm cursor-pointer flex items-center justify-between transition-all">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                      <i class="fa-solid fa-car-battery"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-slate-900">EV High Voltage Battery & BMS Rescue</div>
                      <div class="text-[10px] text-slate-500">Tata Nexon EV • Ather 450X • MG ZS</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] font-bold text-emerald-600 block">42 Techs</span>
                    <span class="text-[9px] text-slate-400">10 min ETA</span>
                  </div>
                </div>

                <!-- Machine Item 4 -->
                <div onclick="goScreen(6)" class="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-600 hover:shadow-sm cursor-pointer flex items-center justify-between transition-all">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-sm">
                      <i class="fa-solid fa-snowflake"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-slate-900">Commercial Inverter AC & VRV / VRF</div>
                      <div class="text-[10px] text-slate-500">Daikin • Blue Star • Voltas Inverter</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] font-bold text-emerald-600 block">64 Techs</span>
                    <span class="text-[9px] text-slate-400">12 min ETA</span>
                  </div>
                </div>
              </div>
            </div>
          `;

        // SCREEN 06: MULTI-INPUT FAULT REPORT STUDIO (CORE-01)
        case 6:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <div class="flex items-center gap-2">
                  <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
                    <i class="fa-solid fa-arrow-left"></i>
                  </button>
                  <h2 class="text-base font-extrabold text-slate-900">Fault Report Studio</h2>
                </div>
                <span class="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">AI Triage</span>
              </div>

              <!-- Voice Input Tile in 9 Languages -->
              <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <i class="fa-solid fa-microphone text-purple-600"></i> Speak in Your Language
                  </span>
                  <span class="text-[10px] font-mono text-purple-700">9 Languages</span>
                </div>
                <div class="p-3 bg-white rounded-xl border border-purple-100 flex items-center gap-3">
                  <button class="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm shadow-xs animate-pulse">
                    <i class="fa-solid fa-microphone"></i>
                  </button>
                  <div class="text-[11px] text-slate-600 italic">"Spindle 4000 RPM ke baad tezi se vibrate aur overheat ho rahi hai..."</div>
                </div>
              </div>

              <!-- Media Attachment Tiles -->
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-800">Attach Damage Proof</label>
                <div class="grid grid-cols-3 gap-2 text-center text-xs">
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 cursor-pointer space-y-1">
                    <i class="fa-solid fa-camera text-blue-600 text-lg"></i>
                    <div class="text-[10px] font-bold text-slate-700">Photo (3/5)</div>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 cursor-pointer space-y-1">
                    <i class="fa-solid fa-video text-rose-600 text-lg"></i>
                    <div class="text-[10px] font-bold text-slate-700">Video (15s)</div>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 cursor-pointer space-y-1">
                    <i class="fa-solid fa-waveform-lines text-emerald-600 text-lg"></i>
                    <div class="text-[10px] font-bold text-slate-700">48kHz Audio</div>
                  </div>
                </div>
              </div>

              <!-- Urgency Level Selection -->
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-800">Breakdown Urgency</label>
                <div class="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                  <div class="p-2 rounded-xl bg-slate-100 text-slate-600 border border-slate-200">Scheduled</div>
                  <div class="p-2 rounded-xl bg-slate-100 text-slate-600 border border-slate-200">Normal</div>
                  <div class="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-300">High</div>
                  <div class="p-2 rounded-xl bg-rose-600 text-white shadow-xs">Critical SOS</div>
                </div>
              </div>

              <button onclick="goScreen(7)" class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2">
                <span>Run Gemini 3.8 AI Diagnostic</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          `;

        // SCREEN 07: GEMINI AI DIAGNOSIS + 3-PATH OWNER CHOICE (PAVAN'S V1.1)
        case 7:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <div class="flex items-center gap-2">
                  <button onclick="goScreen(6)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
                    <i class="fa-solid fa-arrow-left"></i>
                  </button>
                  <h2 class="text-base font-extrabold text-slate-900">AI Diagnostic Report</h2>
                </div>
                <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">97.8% Confidence</span>
              </div>

              <!-- Diagnosis Summary Card -->
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div class="flex items-start justify-between">
                  <div>
                    <span class="text-[10px] font-bold uppercase text-purple-700">Root Cause Identified</span>
                    <h3 class="text-sm font-extrabold text-slate-900 mt-0.5">Spindle Bearing Race Degradation</h3>
                    <p class="text-[11px] text-slate-600">Harmonic peak at 4,210 Hz indicates inner race spalling. Machine should be decoupled before thermal seizure.</p>
                  </div>
                </div>
                <div class="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                  <span class="text-slate-500">Estimated Cost:</span>
                  <span class="font-extrabold text-slate-900">₹800 – ₹1,450 (Labor)</span>
                </div>
              </div>

              <!-- PAVAN'S 3-PATH RESOLUTION CHOICE -->
              <div class="space-y-2.5">
                <div class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Choose Resolution Path</div>

                <!-- Path 1: Free DIY AI Copilot -->
                <div onclick="goScreen(8)" class="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-sm cursor-pointer space-y-1 transition-all">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <i class="fa-solid fa-robot"></i> Option 1: DIY AI Copilot
                    </span>
                    <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">100% FREE</span>
                  </div>
                  <p class="text-[11px] text-slate-500">Self-inspection steps with interactive safety checklist & tool requirements.</p>
                </div>

                <!-- Path 2: Video Consult -->
                <div onclick="requireServiceAuth(9, 'Start Video Consultation')" class="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-sm cursor-pointer space-y-1 transition-all">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                      <i class="fa-solid fa-video"></i> Option 2: Live Video Consult
                    </span>
                    <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">₹199</span>
                  </div>
                  <p class="text-[11px] text-slate-500">Talk to Level-3 Master Engineer via Agora HD. ₹199 auto-deducted if visit required.</p>
                </div>

                <!-- Path 3: Dispatch Certified Technician -->
                <div onclick="requireServiceAuth(11, 'Book Emergency Technician')" class="p-3.5 rounded-2xl bg-blue-50/60 border-2 border-blue-600 hover:shadow-md cursor-pointer space-y-1 transition-all">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <i class="fa-solid fa-truck-fast text-blue-600"></i> Option 3: Book Certified Technician
                    </span>
                    <span class="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">RECOMMENDED</span>
                  </div>
                  <p class="text-[11px] text-slate-700">Top-rated specialist dispatched to your plant in 14 minutes with Escrow Warranty.</p>
                </div>
              </div>
            </div>
          `;

        // SCREEN 08: OWNER FREE DIY AI COPILOT
        case 8:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <div class="flex items-center gap-2">
                  <button onclick="goScreen(7)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
                    <i class="fa-solid fa-arrow-left"></i>
                  </button>
                  <h2 class="text-base font-extrabold text-slate-900">DIY AI Copilot</h2>
                </div>
                <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Step-by-Step</span>
              </div>

              <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-800">
                <i class="fa-solid fa-triangle-exclamation text-amber-600 text-sm"></i>
                <span class="font-medium">Lock Out / Tag Out (LOTO): Switch off main isolator before inspecting spindle.</span>
              </div>

              <!-- Steps List -->
              <div class="space-y-2.5">
                <div class="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-900">Step 1: Check Spindle Belt Tension</span>
                    <i class="fa-regular fa-circle-check text-emerald-600 text-sm"></i>
                  </div>
                  <p class="text-[11px] text-slate-500">Deflection should not exceed 8mm under 5kg thumb pressure.</p>
                </div>

                <div class="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-900">Step 2: Inspect Lubrication Oil Level</span>
                    <span class="text-[10px] text-amber-600 font-bold">Action Needed</span>
                  </div>
                  <p class="text-[11px] text-slate-500">Oil level sight glass at rear manifold is below 20% mark. Refill VG 32 spindle oil.</p>
                </div>
              </div>

              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div class="text-xs font-bold text-slate-800">Need Expert Intervention?</div>
                <button onclick="requireServiceAuth(11, 'Book Certified Technician')" class="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
                  Escalate to On-Site Technician (₹850)
                </button>
              </div>
            </div>
          `;

        // SCREEN 09: VIRTUAL CONSULT TIER & SPECIALIST PICKER
        case 9:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <div class="flex items-center gap-2">
                  <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
                    <i class="fa-solid fa-arrow-left"></i>
                  </button>
                  <h2 class="text-base font-extrabold text-slate-900">Virtual Video Consult</h2>
                </div>
                <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Level 3 Master</span>
              </div>

              <div class="space-y-2.5">
                <!-- Tier 1 -->
                <div onclick="requireServiceAuth(10, 'Connect Quick Call (₹99)')" class="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-600 cursor-pointer space-y-1 transition-all">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-900">Quick Check (10 Mins)</span>
                    <span class="text-xs font-extrabold text-blue-600">₹99</span>
                  </div>
                  <p class="text-[11px] text-slate-500">Triage fault code, safety check, and determine if physical parts are required.</p>
                </div>

                <!-- Tier 2 -->
                <div onclick="requireServiceAuth(10, 'Connect Full Diagnosis (₹199)')" class="p-3.5 rounded-2xl bg-blue-50/60 border-2 border-blue-600 cursor-pointer space-y-1 transition-all">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-blue-900">Full Diagnosis (20 Mins)</span>
                    <div class="flex items-center gap-1.5">
                      <span class="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold">POPULAR</span>
                      <span class="text-xs font-extrabold text-blue-700">₹199</span>
                    </div>
                  </div>
                  <p class="text-[11px] text-slate-600">Live AR guidance, multitester probing instructions & 100% fee credit on visit.</p>
                </div>
              </div>

              <button onclick="requireServiceAuth(10, 'Connect Video Consultation')" class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md">
                Connect with Master Engineer Now
              </button>
            </div>
          `;

        // SCREEN 10: AGORA LIVE HD VIDEO CALL + AI AR OVERLAY
        case 10:
          return `
            <div class="h-full bg-slate-900 text-white flex flex-col justify-between p-4 relative">
              <div class="flex items-center justify-between z-10">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <span class="text-xs font-bold">HD Call • 04:12</span>
                </div>
                <div class="px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-mono">₹199 Escrow Credit</div>
              </div>

              <!-- Main AR Video Feed Mockup -->
              <div class="my-auto text-center space-y-3 relative">
                <div class="w-48 h-48 rounded-full border-2 border-dashed border-emerald-400 mx-auto flex items-center justify-center relative">
                  <i class="fa-solid fa-arrows-to-dot text-emerald-400 text-3xl animate-ping"></i>
                  <span class="absolute bottom-2 bg-emerald-500/90 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-full">Probe Terminal #3</span>
                </div>
                <div class="bg-black/60 backdrop-blur-md rounded-2xl p-3 max-w-[280px] mx-auto text-left text-xs space-y-1">
                  <div class="text-[10px] text-emerald-400 font-bold uppercase">Engineer Suggestion</div>
                  <div>"Turn selector switch to 400V AC and check continuity between L1 and Ground."</div>
                </div>
              </div>

              <!-- Call Controls -->
              <div class="flex items-center justify-center gap-4 z-10 pb-4">
                <button class="w-11 h-11 rounded-full bg-white/20 text-white flex items-center justify-center text-sm"><i class="fa-solid fa-microphone"></i></button>
                <button class="w-11 h-11 rounded-full bg-white/20 text-white flex items-center justify-center text-sm"><i class="fa-solid fa-camera-rotate"></i></button>
                <button class="w-11 h-11 rounded-full bg-white/20 text-white flex items-center justify-center text-sm"><i class="fa-solid fa-wand-magic-sparkles text-emerald-400"></i></button>
                <button onclick="goScreen(4)" class="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center text-base"><i class="fa-solid fa-phone-slash"></i></button>
              </div>
            </div>
          `;

        // SCREEN 11: SMART TECHNICIAN MATCH LIST & MAP (60% SKILL + 40% DIST)
        case 11:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <div class="flex items-center gap-2">
                  <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
                    <i class="fa-solid fa-arrow-left"></i>
                  </button>
                  <h2 class="text-base font-extrabold text-slate-900">Matching Specialists</h2>
                </div>
                <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">60% Skill • 40% Dist</span>
              </div>

              <!-- Technician Card 1 -->
              <div onclick="requireServiceAuth(12, 'View Profile & Hire')" class="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-600 hover:shadow-sm cursor-pointer space-y-3 transition-all">
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-base flex items-center justify-center shrink-0">
                      RK
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="text-xs font-extrabold text-slate-900">Rajesh Kumar</span>
                        <i class="fa-solid fa-circle-check text-blue-600 text-xs"></i>
                      </div>
                      <div class="text-[10px] text-slate-500">12 yrs exp • Fanuc & Siemens VMC</div>
                      <div class="flex items-center gap-2 text-[10px] mt-0.5">
                        <span class="font-bold text-amber-600">★ 4.9 (428)</span>
                        <span>•</span>
                        <span class="text-slate-600">1.8 km</span>
                        <span>•</span>
                        <span class="font-bold text-emerald-600">14 min ETA</span>
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs font-extrabold text-slate-900">₹850</div>
                    <div class="text-[9px] text-slate-400">Fixed Visit</div>
                  </div>
                </div>

                <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-blue-600 h-full w-[96%] rounded-full"></div>
                </div>
                <div class="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                  <span>96% AI Skill Match</span>
                  <button class="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold">Select</button>
                </div>
              </div>

              <!-- Technician Card 2 -->
              <div onclick="requireServiceAuth(12, 'View Profile & Hire')" class="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-600 hover:shadow-sm cursor-pointer space-y-3 transition-all">
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-purple-600 text-white font-bold text-base flex items-center justify-center shrink-0">
                      AM
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="text-xs font-extrabold text-slate-900">Anil Murthy</span>
                        <i class="fa-solid fa-circle-check text-purple-600 text-xs"></i>
                      </div>
                      <div class="text-[10px] text-slate-500">9 yrs exp • Spindle & Hydraulics</div>
                      <div class="flex items-center gap-2 text-[10px] mt-0.5">
                        <span class="font-bold text-amber-600">★ 4.8 (310)</span>
                        <span>•</span>
                        <span class="text-slate-600">2.4 km</span>
                        <span>•</span>
                        <span class="font-bold text-emerald-600">19 min ETA</span>
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs font-extrabold text-slate-900">₹800</div>
                    <div class="text-[9px] text-slate-400">Fixed Visit</div>
                  </div>
                </div>

                <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-purple-600 h-full w-[89%] rounded-full"></div>
                </div>
                <div class="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                  <span>89% AI Skill Match</span>
                  <button class="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold">Select</button>
                </div>
              </div>
            </div>
          `;

        // SCREEN 12: TECHNICIAN FULL PROFILE & POLYGON NFT BADGES
        case 12:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(11)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-arrow-left"></i>
                </button>
                <span class="text-xs font-bold text-slate-900">Technician Profile</span>
                <span class="text-xs text-blue-600 font-bold">Share</span>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
                <div class="w-16 h-16 rounded-2xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-sm">
                  RK
                </div>
                <h3 class="text-base font-extrabold text-slate-900">Rajesh Kumar</h3>
                <p class="text-xs text-slate-500">Master Plant & Heavy Machinery Technician</p>
                <div class="flex items-center justify-center gap-3 text-xs pt-1">
                  <span class="font-bold text-amber-600">★ 4.9 (428 reviews)</span>
                  <span>•</span>
                  <span class="text-emerald-600 font-bold">Govt Aadhaar KYC</span>
                </div>
              </div>

              <!-- Blockchain Skill NFT Badges -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-800">Polygon Blockchain Badges</span>
                  <span class="text-[10px] font-mono text-purple-600 font-bold">Polygon POS</span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div class="p-2.5 rounded-xl bg-purple-50 border border-purple-200 flex items-center gap-2">
                    <i class="fa-solid fa-certificate text-purple-600"></i>
                    <div>
                      <div class="font-bold text-purple-900 text-[11px]">Fanuc CNC Master</div>
                      <div class="text-[9px] text-purple-700 font-mono">NFT #4821</div>
                    </div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2">
                    <i class="fa-solid fa-bolt text-blue-600"></i>
                    <div>
                      <div class="font-bold text-blue-900 text-[11px]">Siemens S7 PLC</div>
                      <div class="text-[9px] text-blue-700 font-mono">NFT #1094</div>
                    </div>
                  </div>
                </div>
              </div>

              <button onclick="requireServiceAuth(13, 'Proceed to Book Rajesh Kumar')" class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md">
                Confirm & Book Specialist (₹850)
              </button>
            </div>
          `;

        // SCREEN 13: AI PRICE NEGOTIATION & BOOKING CONFIRMATION
        case 13:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(12)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h2 class="text-base font-extrabold text-slate-900">Booking Summary</h2>
                <span class="text-[10px] font-mono text-emerald-600 font-bold">AI Fair-Price</span>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-600">Initial Inspection & Diagnosis</span>
                  <span class="font-extrabold text-slate-900">₹850</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-600">Per-Job Micro-Insurance Shield (₹10k)</span>
                  <span class="font-extrabold text-blue-600">+ ₹49</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-600">Escrow Hold Fee</span>
                  <span class="font-extrabold text-emerald-600">FREE</span>
                </div>
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-900">Total Payable in Escrow</span>
                  <span class="text-base font-extrabold text-slate-900">₹899</span>
                </div>
              </div>

              <div class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
                <i class="fa-solid fa-shield-halved text-emerald-600 text-base"></i>
                <span>Your funds are locked in Razorpay Escrow and released only after you verify repair completion.</span>
              </div>

              <button onclick="goScreen(15)" class="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md">
                Lock Escrow & Dispatch Technician →
              </button>
            </div>
          `;

        // SCREEN 14: 60-SECOND EMERGENCY SOS LIVE AUCTION
        case 14:
          return `
            <div class="p-4 space-y-4 text-center">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h2 class="text-base font-extrabold text-rose-600">Emergency SOS Auction</h2>
                <span class="text-[10px] font-mono text-slate-400">Broadcasting</span>
              </div>

              <!-- 60s Countdown Circular Mockup -->
              <div class="py-2">
                <div class="w-32 h-32 rounded-full border-4 border-rose-600 flex flex-col items-center justify-center mx-auto shadow-lg relative">
                  <span class="text-3xl font-extrabold text-rose-600 font-mono">42s</span>
                  <span class="text-[9px] font-bold text-slate-500 uppercase">Remaining</span>
                </div>
              </div>

              <div class="text-xs font-bold text-slate-800">Broadcasting to 18 Nearby Specialists...</div>

              <!-- Live Bids Stream -->
              <div class="space-y-2 text-left">
                <div class="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span class="text-xs font-bold text-slate-900">Tech #1 (Peenya Gate)</span>
                  </div>
                  <div class="text-right">
                    <span class="text-xs font-extrabold text-emerald-600">8 Mins ETA</span>
                    <span class="text-[9px] text-slate-400 block">₹950</span>
                  </div>
                </div>
                <div class="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span class="text-xs font-bold text-slate-900">Tech #2 (Jalahalli Cross)</span>
                  </div>
                  <div class="text-right">
                    <span class="text-xs font-extrabold text-blue-600">12 Mins ETA</span>
                    <span class="text-[9px] text-slate-400 block">₹850</span>
                  </div>
                </div>
              </div>

              <button onclick="goScreen(15)" class="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md">
                Accept Fastest Bid (8 Mins) →
              </button>
            </div>
          `;

        // SCREEN 15: UBER-STYLE LIVE GPS TRACKING & CHAT
        case 15:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h2 class="text-base font-extrabold text-slate-900">Technician On The Way</h2>
                <span class="text-[10px] font-mono text-emerald-600 font-bold">Live GPS</span>
              </div>

              <!-- Map Simulation -->
              <div class="rounded-2xl bg-slate-100 border border-slate-200 h-44 relative overflow-hidden flex items-center justify-center">
                <div class="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:12px_12px]"></div>
                <!-- Route Polyline -->
                <svg class="absolute inset-0 w-full h-full" viewBox="0 0 300 150">
                  <path d="M 50 120 Q 150 40 250 80" stroke="#2563EB" stroke-width="4" fill="none" stroke-dasharray="6 4" />
                </svg>
                <!-- Technician Marker -->
                <div class="absolute left-32 top-12 flex flex-col items-center">
                  <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-md animate-bounce">
                    <i class="fa-solid fa-motorcycle"></i>
                  </div>
                  <span class="text-[9px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded-full shadow-xs mt-1">11 Mins</span>
                </div>
              </div>

              <!-- ETA & Contact Card -->
              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-extrabold text-slate-900">Rajesh Kumar</span>
                    <p class="text-[10px] text-slate-500">Hero Splendor • KA-02-EE-4821</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button class="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs"><i class="fa-solid fa-phone"></i></button>
                    <button class="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs"><i class="fa-solid fa-message"></i></button>
                  </div>
                </div>
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span class="text-slate-500">Estimated Arrival:</span>
                  <span class="font-extrabold text-blue-600">10:04 AM (11 Mins)</span>
                </div>
              </div>

              <button onclick="goScreen(16)" class="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md">
                View Arrival OTP Screen →
              </button>
            </div>
          `;

        // SCREEN 16: DUAL-FACTOR 6-DIGIT OTP + 500M POSTGIS LOCK
        case 16:
          return `
            <div class="p-4 space-y-4 text-center">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(15)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h2 class="text-base font-extrabold text-slate-900">Arrival Verification</h2>
                <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Secure Gate</span>
              </div>

              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span class="text-xs text-slate-500 font-medium">Share this OTP with technician upon arrival</span>
                <div class="text-3xl font-extrabold tracking-widest text-blue-600 font-mono py-2 bg-white rounded-xl border border-blue-200">
                  482196
                </div>
                <p class="text-[10px] text-slate-400">Valid for 15 minutes • Prevents unauthorized job initiation</p>
              </div>

              <div class="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-left text-xs text-blue-900 flex items-start gap-2.5">
                <i class="fa-solid fa-location-crosshairs text-blue-600 text-base mt-0.5"></i>
                <div>
                  <div class="font-bold">PostGIS Proximity Lock Active</div>
                  <div class="text-[11px] text-blue-800">Technician must be physically within 500m of your plant for OTP acceptance.</div>
                </div>
              </div>

              <button onclick="goScreen(17)" class="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md">
                Simulate OTP Verified → Go to Job Progress
              </button>
            </div>
          `;

        // SCREEN 17: LIVE IN-PROGRESS REPAIR & PARTS APPROVAL
        case 17:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h2 class="text-base font-extrabold text-slate-900">Repair In Progress</h2>
                <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Stage 3 of 4</span>
              </div>

              <!-- Checklist Progress -->
              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div class="flex items-center gap-2 text-xs text-emerald-600 font-bold">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>LOTO Electrical Isolation Completed</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-emerald-600 font-bold">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Spindle Disassembly & Runout Measured</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-blue-600 font-bold">
                  <i class="fa-solid fa-spinner animate-spin"></i>
                  <span>Installing New Angular Contact Bearing</span>
                </div>
              </div>

              <!-- Spare Part Approval Alert Box -->
              <div class="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-amber-900">Replacement Part Required</span>
                  <span class="text-xs font-extrabold text-amber-900">₹640</span>
                </div>
                <p class="text-[11px] text-amber-800">SKF 7010 Angular Contact Bearing race cracked. Technician requests approval to replace.</p>
                <div class="flex gap-2 pt-1">
                  <button class="flex-1 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs">Approve & Add to Bill</button>
                  <button class="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold">Decline</button>
                </div>
              </div>

              <button onclick="goScreen(19)" class="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md">
                View Completed Job & Certificate →
              </button>
            </div>
          `;

        // SCREEN 18: OWNER JOB HISTORY LEDGER
        case 18:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <h2 class="text-base font-extrabold text-slate-900">Job History</h2>
                <span class="text-xs font-bold text-blue-600">3 Total</span>
              </div>

              <div class="flex gap-1.5 text-xs font-bold">
                <button class="px-3 py-1.5 rounded-xl bg-blue-600 text-white">All Jobs</button>
                <button class="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600">Active</button>
                <button class="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600">Completed</button>
              </div>

              <div class="space-y-2.5">
                <div onclick="goScreen(19)" class="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 cursor-pointer space-y-2 transition-all">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-mono text-slate-500">UPT-2026-0941</span>
                    <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">COMPLETED</span>
                  </div>
                  <h4 class="text-xs font-extrabold text-slate-900">Mazak VMC Spindle Bearing Replacement</h4>
                  <p class="text-[11px] text-slate-500">Tech: Rajesh Kumar • Peenya Unit #4</p>
                  <div class="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span class="font-extrabold text-slate-900">₹1,490</span>
                    <span class="text-blue-600 font-bold">View Certificate →</span>
                  </div>
                </div>
              </div>
            </div>
          `;

        // SCREEN 19: JOB DETAILS & SHA-256 TAMPER-PROOF CERTIFICATE
        case 19:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(18)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h2 class="text-base font-extrabold text-slate-900">Repair Certificate</h2>
                <span class="text-xs text-blue-600 font-bold"><i class="fa-solid fa-download"></i> PDF</span>
              </div>

              <!-- Tamper Proof Certificate Card -->
              <div class="p-5 rounded-3xl bg-slate-900 text-white space-y-3 relative overflow-hidden shadow-lg">
                <div class="flex items-center justify-between">
                  <span class="text-[9px] font-mono tracking-widest text-emerald-400 font-bold uppercase">Cryptographic Repair Proof</span>
                  <span class="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-mono">SHA-256</span>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-white">Zero-Downtime Warranty</h3>
                  <p class="text-xs text-slate-300">Valid until Dec 10, 2026 (30 Days Active)</p>
                </div>
                <div class="p-2.5 rounded-xl bg-black/50 border border-white/10 font-mono text-[9px] text-slate-400 break-all">
                  SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </div>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                <div class="flex justify-between text-slate-600"><span>Technician</span><span class="font-bold text-slate-900">Rajesh Kumar (Govt NCVT)</span></div>
                <div class="flex justify-between text-slate-600"><span>Replaced Part</span><span class="font-bold text-slate-900">SKF 7010 CD/P4A</span></div>
                <div class="flex justify-between text-slate-600"><span>Escrow Release</span><span class="font-bold text-emerald-600">Settled to Tech</span></div>
              </div>

              <button onclick="goScreen(20)" class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md">
                Rate & Review Specialist →
              </button>
            </div>
          `;

        // SCREEN 20: RATE & REVIEW SPECIALIST
        case 20:
          return `
            <div class="p-4 space-y-4 text-center">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(19)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h2 class="text-base font-extrabold text-slate-900">Rate Specialist</h2>
                <span class="text-xs text-slate-400">Skip</span>
              </div>

              <div class="w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-sm">
                RK
              </div>
              <h3 class="text-sm font-extrabold text-slate-900">How was Rajesh Kumar's service?</h3>
              <p class="text-xs text-slate-500">Your feedback helps maintain verified engineer standards</p>

              <!-- Star Rating -->
              <div class="flex justify-center gap-2 text-2xl text-amber-400 py-1">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>

              <!-- Compliment Tags -->
              <div class="flex flex-wrap justify-center gap-1.5 pt-2">
                <span class="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">⚡ Punctual (14 mins)</span>
                <span class="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">🛠️ Genuine OEM Parts</span>
                <span class="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">🧼 Clean Workspace</span>
              </div>

              <button onclick="goScreen(4)" class="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md mt-4">
                Submit Review & Return to Home
              </button>
            </div>
          `;

        // SCREEN 21: MY ASSETS HUB (MACHINES | VEHICLES | DEVICES)
        case 21:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <h2 class="text-base font-extrabold text-slate-900">My Assets Vault</h2>
                <button onclick="requireServiceAuth(22, 'Add New Asset')" class="text-xs font-bold text-blue-600">+ Add Asset</button>
              </div>

              <div class="space-y-3">
                <!-- Asset 1 -->
                <div onclick="goScreen(24)" class="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 cursor-pointer space-y-2 transition-all">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-extrabold text-slate-900">Mazak VCN-530C (VMC)</span>
                    <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">96% HEALTH</span>
                  </div>
                  <p class="text-[11px] text-slate-500">Location: Peenya Unit #4 • Spindle Hours: 4,120h</p>
                  <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span class="text-slate-500">Next AMC: Jan 15, 2027</span>
                    <span class="text-blue-600 font-bold">Open Digital Twin →</span>
                  </div>
                </div>

                <!-- Asset 2 -->
                <div onclick="goScreen(24)" class="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 cursor-pointer space-y-2 transition-all">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-extrabold text-slate-900">Tata Ace EV Commercial Fleet</span>
                    <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">91% HEALTH</span>
                  </div>
                  <p class="text-[11px] text-slate-500">Reg: KA-04-MK-9021 • Battery Pack: 21.3 kWh</p>
                  <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span class="text-slate-500">Next Tyre Rotation: 2,400 km</span>
                    <span class="text-blue-600 font-bold">Open Digital Twin →</span>
                  </div>
                </div>
              </div>
            </div>
          `;

        // SCREEN 22: QUICK ADD ASSET & NAMEPLATE OCR SCANNER
        case 22:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(21)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-base font-extrabold text-slate-900">Add Asset via OCR</h2>
                <span class="text-xs font-bold text-blue-600">Help</span>
              </div>

              <!-- Camera Viewport Mockup -->
              <div class="rounded-2xl bg-slate-900 text-white h-48 flex flex-col items-center justify-center relative p-4 text-center">
                <div class="w-40 h-28 border-2 border-dashed border-emerald-400 rounded-xl flex items-center justify-center">
                  <span class="text-[10px] text-emerald-400 font-bold">Align Nameplate Here</span>
                </div>
                <span class="text-[10px] text-slate-400 mt-2">Auto-reads Model No, Serial No & Power Rating</span>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-800">Or Enter Details Manually</label>
                <input type="text" placeholder="Machine / Vehicle Name" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs" />
                <input type="text" placeholder="Serial No / VIN" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs" />
              </div>

              <button onclick="goScreen(21)" class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md">
                Save Asset to Vault
              </button>
            </div>
          `;

        // SCREEN 23: ASSET DETAILS & SERVICE LEDGER
        case 23:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(21)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-base font-extrabold text-slate-900">Asset Service Ledger</h2>
                <span class="text-xs font-bold text-emerald-600">99.2% Uptime</span>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div class="text-xs font-bold text-slate-900">Mazak VCN-530C Service Timeline</div>
                <div class="text-[11px] text-slate-500">Total Services: 6 • Lifetime Spend: ₹12,800</div>
              </div>

              <div class="space-y-2">
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div class="font-bold text-slate-900">Spindle Bearing Replacement</div>
                    <div class="text-[10px] text-slate-500">Nov 10, 2026 • Tech: Rajesh Kumar</div>
                  </div>
                  <span class="font-extrabold text-slate-900">₹1,490</span>
                </div>
              </div>
            </div>
          `;

        // SCREEN 24: IOT DIGITAL TWIN & FAILURE PREDICTION TIMELINE
        case 24:
          return `
            <div class="p-4 space-y-4 text-center">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(21)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-base font-extrabold text-slate-900">IoT Digital Twin</h2>
                <span class="text-[10px] font-mono text-emerald-600 font-bold">Live Sensor Telemetry</span>
              </div>

              <!-- Circular Health Meter -->
              <div class="w-32 h-32 rounded-full border-8 border-emerald-500 border-t-slate-200 flex flex-col items-center justify-center mx-auto shadow-sm">
                <span class="text-3xl font-extrabold text-slate-900">94%</span>
                <span class="text-[10px] font-bold text-emerald-600 uppercase">Health Score</span>
              </div>

              <!-- Component Telemetry Sub-Gauges -->
              <div class="grid grid-cols-3 gap-2 text-center text-xs pt-2">
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div class="font-bold text-slate-900">1.2 mm/s</div>
                  <div class="text-[10px] text-slate-500">Vibration</div>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div class="font-bold text-slate-900">48.2 °C</div>
                  <div class="text-[10px] text-slate-500">Spindle Temp</div>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div class="font-bold text-emerald-600">142 Days</div>
                  <div class="text-[10px] text-slate-500">Next Failure AI</div>
                </div>
              </div>

              <button onclick="goScreen(6)" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md">
                Schedule Preventive Inspection
              </button>
            </div>
          `;

        // SCREEN 25: INDUSTRIAL WORLD-FIRST LAB
        case 25:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-base font-extrabold text-slate-900">Industrial Lab</h2>
                <span class="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">World-First</span>
              </div>

              <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1.5">
                <div class="flex items-center gap-2 text-xs font-bold text-purple-900">
                  <i class="fa-solid fa-triangle-exclamation text-purple-600"></i>
                  <span>Epidemic Batch Recall Radar</span>
                </div>
                <p class="text-[11px] text-purple-800">4 other plants in Peenya reported drive failure on Siemens Sinamics S120 (Batch 2024-Q2). Proactive firmware patch recommended.</p>
              </div>

              <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                <div class="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <i class="fa-solid fa-wave-square text-amber-600"></i>
                  <span>Silent Killer Vibration Alert</span>
                </div>
                <p class="text-[11px] text-amber-800">High-frequency harmonic resonance detected at 4,120 Hz. Potential spindle seizure within 48 machine hours.</p>
              </div>
            </div>
          `;

        // SCREEN 26: AUTOMOBILE WORLD-FIRST LAB
        case 26:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-base font-extrabold text-slate-900">Automobile Lab</h2>
                <span class="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">AI Diagnostics</span>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold text-slate-900">Dashboard Warning Light AI</span>
                  <i class="fa-solid fa-camera text-rose-600 text-sm"></i>
                </div>
                <p class="text-[11px] text-slate-500">Scan any instrument cluster light with your camera for instant diagnostic meaning & safe driving distance.</p>
                <button class="w-full py-2 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs">Scan Cluster Warning</button>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold text-slate-900">Used-Car Pre-Purchase Scan</span>
                  <span class="text-xs font-bold text-blue-600">50-Pt Check</span>
                </div>
                <p class="text-[11px] text-slate-500">Send Level-3 mobile engineer before buying second-hand vehicle. Spot flood damage & odometer tampering.</p>
              </div>
            </div>
          `;

        // SCREEN 27: ELECTRONICS WORLD-FIRST LAB
        case 27:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-base font-extrabold text-slate-900">Electronics Lab</h2>
                <span class="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">Smart AI</span>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold text-slate-900">Repair-vs-Replace Calculator</span>
                  <span class="text-xs font-bold text-emerald-600">Saves ₹14,000</span>
                </div>
                <p class="text-[11px] text-slate-500">AI compares repair cost vs buying new with energy efficiency payback analysis.</p>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold text-slate-900">Technician Data Privacy Lock</span>
                  <i class="fa-solid fa-user-shield text-indigo-600 text-sm"></i>
                </div>
                <p class="text-[11px] text-slate-500">Locks photos, browsing history & personal files before handing laptop/device for hardware repair.</p>
              </div>
            </div>
          `;

        // SCREEN 28: INSURANCE & AMC PROTECTION HUB
        case 28:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-base font-extrabold text-slate-900">Uptime Shield & AMC</h2>
                <span class="text-xs text-blue-600 font-bold">Protection</span>
              </div>

              <div class="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold text-blue-900">Annual Maintenance Contract (AMC)</span>
                  <span class="text-xs font-bold text-blue-700">₹4,999/yr</span>
                </div>
                <p class="text-[11px] text-blue-800">Quarterly preventive checkups, 24/7 priority emergency dispatch & zero inspection fees.</p>
              </div>
            </div>
          `;

        // SCREEN 29: OCR WARRANTY VAULT & EXPIRY ALERTS
        case 29:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-base font-extrabold text-slate-900">Warranty Vault</h2>
                <button class="text-xs font-bold text-blue-600">+ Scan Bill</button>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-900">Daikin 1.5 Ton Split AC</span>
                  <span class="text-[10px] font-bold text-emerald-600">Active</span>
                </div>
                <p class="text-[11px] text-slate-500">Compressor warranty expires in 184 days</p>
              </div>
            </div>
          `;

        // SCREEN 30: 5-STAGE AI CLAIM TRACKER
        case 30:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-base font-extrabold text-slate-900">AI Insurance Claim</h2>
                <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Instant Payout</span>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div class="text-xs font-bold text-slate-900">Claim #CLM-8921: Spindle Motor Surge</div>
                <div class="space-y-2 text-xs">
                  <div class="flex items-center gap-2 text-emerald-600 font-bold"><i class="fa-solid fa-check"></i> 1. Photos Submitted</div>
                  <div class="flex items-center gap-2 text-emerald-600 font-bold"><i class="fa-solid fa-check"></i> 2. AI Evidence Verified</div>
                  <div class="flex items-center gap-2 text-blue-600 font-bold"><i class="fa-solid fa-spinner animate-spin"></i> 3. Insurer Approval (92%)</div>
                </div>
              </div>
            </div>
          `;

        // SCREEN 31: OEM SPARE PARTS & RARE PART REQUEST MARKET
        case 31:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <h2 class="text-base font-extrabold text-slate-900">OEM Spare Parts</h2>
                <button onclick="goScreen(33)" class="text-xs font-bold text-blue-600">Cart (2)</button>
              </div>

              <div class="relative">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs"></i>
                <input type="text" placeholder="Search genuine part number, brand..." class="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs" />
              </div>

              <div class="space-y-2.5">
                <div class="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <div class="text-xs font-bold text-slate-900">SKF 7010 CD/P4A Angular Bearing</div>
                    <div class="text-[10px] text-slate-500">OEM Genuine • 100% Fit Guarantee</div>
                    <div class="text-xs font-extrabold text-slate-900 mt-1">₹640</div>
                  </div>
                  <button onclick="requireServiceAuth(33, 'Add to Cart & Checkout')" class="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs">+ Add</button>
                </div>
              </div>
            </div>
          `;

        // SCREEN 32: CERTIFIED REFURBISHED STORE (GRADE A+)
        case 32:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-base font-extrabold text-slate-900">Certified Refurbished</h2>
                <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Grade A+ (6 Mo Warranty)</span>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div class="text-xs font-extrabold text-slate-900">Siemens 3-Phase Induction Motor 7.5kW</div>
                <div class="text-[11px] text-slate-500">Rewound, new SKF bearings, 40-point tested</div>
                <div class="flex items-center justify-between pt-1">
                  <span class="text-sm font-extrabold text-slate-900">₹8,400 <span class="text-xs text-slate-400 line-through">₹18,000</span></span>
                  <button onclick="requireServiceAuth(33, 'Buy Refurbished Motor')" class="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs">Buy Now</button>
                </div>
              </div>
            </div>
          `;

        // SCREEN 33: SPARE PARTS CART & EXPRESS SITE DELIVERY
        case 33:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(31)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-base font-extrabold text-slate-900">Cart & Delivery</h2>
                <span class="text-xs font-bold text-blue-600">2 Items</span>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                <div class="flex justify-between"><span>SKF 7010 Bearing x 1</span><span class="font-bold">₹640</span></div>
                <div class="flex justify-between"><span>VG 32 Spindle Oil (5L) x 1</span><span class="font-bold">₹850</span></div>
                <div class="flex justify-between text-emerald-600"><span>Express Dispatch</span><span class="font-bold">FREE</span></div>
                <div class="pt-2 border-t border-slate-100 flex justify-between font-extrabold text-sm">
                  <span>Total</span><span>₹1,490</span>
                </div>
              </div>

              <button onclick="requireServiceAuth(34, 'Checkout Cart')" class="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md">
                Proceed to Escrow Payment →
              </button>
            </div>
          `;

        // SCREEN 34: RAZORPAY PAYMENT & ESCROW CHECKOUT
        case 34:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-base font-extrabold text-slate-900">Payment & Escrow</h2>
                <span class="text-[10px] font-bold text-blue-600">Razorpay</span>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                <div class="text-xs font-bold text-slate-800">Select Payment Method</div>
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-bold cursor-pointer">
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-mobile-screen text-blue-600"></i>
                    <span>UPI (Google Pay, PhonePe, Paytm)</span>
                  </div>
                  <i class="fa-solid fa-chevron-right text-slate-400"></i>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-bold cursor-pointer">
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-credit-card text-purple-600"></i>
                    <span>Credit / Debit Card / NetBanking</span>
                  </div>
                  <i class="fa-solid fa-chevron-right text-slate-400"></i>
                </div>
              </div>

              <button onclick="goScreen(19)" class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md">
                Pay ₹899 via UPI
              </button>
            </div>
          `;

        // SCREEN 35: WALLET, PRO PLANS & CARBON CREDITS
        case 35:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-base font-extrabold text-slate-900">Wallet & Carbon</h2>
                <span class="text-xs font-bold text-emerald-600">Pro</span>
              </div>

              <div class="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white space-y-2">
                <span class="text-[10px] font-mono tracking-widest text-blue-200 uppercase">Available Balance</span>
                <div class="text-2xl font-extrabold">₹4,250.00</div>
                <button class="px-3 py-1 rounded-lg bg-white text-blue-700 text-xs font-bold">+ Add Money</button>
              </div>

              <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span class="text-xs font-bold text-emerald-900">🌱 340 kg CO₂ Saved</span>
                <p class="text-[11px] text-emerald-800">You prevented 340 kg of industrial e-waste by choosing repair over disposal.</p>
              </div>
            </div>
          `;

        // SCREEN 36: CROWDSOURCED REPAIR WIKI & ERROR CODES
        case 36:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-base font-extrabold text-slate-900">Repair Wiki & Alarms</h2>
                <span class="text-xs text-blue-600 font-bold">Free Knowledge</span>
              </div>

              <div class="relative">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs"></i>
                <input type="text" placeholder="Search alarm code (e.g., Fanuc 401, Daikin E4)..." class="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs" />
              </div>

              <div class="space-y-2">
                <div class="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-900">Fanuc 401: V-Ready Off</span>
                    <span class="text-[10px] font-bold text-blue-600">42 Solutions</span>
                  </div>
                  <p class="text-[11px] text-slate-500">Check MCC contactor coil voltage and optical fiber connection from CNC to servo amplifier.</p>
                </div>
              </div>
            </div>
          `;

        // SCREEN 37: 24/7 GEMINI 9-LANGUAGE AI CHATBOT
        case 37:
          return `
            <div class="h-full flex flex-col justify-between p-4 space-y-3">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
                <div class="flex items-center gap-2">
                  <button onclick="goScreen(4)" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-left"></i></button>
                  <div>
                    <h2 class="text-xs font-extrabold text-slate-900">Gemini 3.8 AI Assistant</h2>
                    <span class="text-[9px] text-emerald-600 font-bold">● Online • 9 Languages</span>
                  </div>
                </div>
                <button onclick="cycleLanguage()" class="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-700">EN</button>
              </div>

              <!-- Chat Bubbles -->
              <div class="flex-1 overflow-y-auto space-y-3 text-xs">
                <div class="p-3 rounded-2xl bg-slate-100 text-slate-800 max-w-[80%] rounded-tl-none">
                  Hello Pavan! I can help you diagnose industrial machines, automobile faults, or home appliances. What problem are you facing today?
                </div>
                <div class="p-3 rounded-2xl bg-blue-600 text-white max-w-[80%] ml-auto rounded-tr-none">
                  My CNC lathe has a spindle vibration at high RPM. How much will it cost to inspect?
                </div>
                <div class="p-3 rounded-2xl bg-slate-100 text-slate-800 max-w-[80%] rounded-tl-none">
                  Inspection is fixed at ₹850 in Peenya Industrial Area. 3 certified Fanuc engineers are within 2 km. Would you like to book one now?
                </div>
              </div>

              <!-- Input Bar -->
              <div class="flex gap-2 pt-2 border-t border-slate-100 shrink-0">
                <input type="text" placeholder="Type your issue or speak..." class="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none" />
                <button class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs"><i class="fa-solid fa-paper-plane"></i></button>
              </div>
            </div>
          `;

        // SCREEN 38: OWNER PROFILE, SITES, ALERTS & OFFLINE SYNC
        case 38:
          return `
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <h2 class="text-base font-extrabold text-slate-900">Owner Account</h2>
                <button onclick="toggleAuthState()" class="text-xs font-bold text-rose-600">Sign Out</button>
              </div>

              <!-- Profile Card -->
              <div class="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                  P
                </div>
                <div>
                  <h3 class="text-sm font-extrabold text-slate-900">Pavan Sharma</h3>
                  <p class="text-xs text-slate-500">+91 98450 67890 • MSME Unit #4</p>
                  <span class="text-[10px] font-bold text-emerald-600">✓ Verified Plant Owner</span>
                </div>
              </div>

              <!-- Account Options -->
              <div class="p-2 rounded-2xl bg-white border border-slate-200 space-y-1 text-xs font-semibold">
                <div onclick="goScreen(2)" class="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer">
                  <span class="flex items-center gap-2.5"><i class="fa-solid fa-location-dot text-rose-500"></i> Manage Saved Addresses</span>
                  <i class="fa-solid fa-chevron-right text-slate-400 text-[10px]"></i>
                </div>
                <div onclick="goScreen(35)" class="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer">
                  <span class="flex items-center gap-2.5"><i class="fa-solid fa-wallet text-blue-600"></i> Uptime Wallet & Billing</span>
                  <i class="fa-solid fa-chevron-right text-slate-400 text-[10px]"></i>
                </div>
                <div onclick="goScreen(21)" class="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer">
                  <span class="flex items-center gap-2.5"><i class="fa-solid fa-server text-purple-600"></i> Registered Machines Vault</span>
                  <i class="fa-solid fa-chevron-right text-slate-400 text-[10px]"></i>
                </div>
                <div onclick="cycleLanguage()" class="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer">
                  <span class="flex items-center gap-2.5"><i class="fa-solid fa-language text-emerald-600"></i> Language Preferences (9)</span>
                  <span class="font-mono text-slate-500 text-[10px]" id="profileLangText">EN</span>
                </div>
              </div>
            </div>
          `;

        default:
          return `<div class="p-6 text-center text-slate-500">Screen S${String(id).padStart(2,'0')}</div>`;
      }
    }

    // =========================================================================
    // UI NAVIGATION & INTERACTION LOGIC
    // =========================================================================
    function goScreen(id) {
      currentScreen = id;
      updateUI();
    }

    function prevScreen() {
      if (currentScreen > 1) {
        currentScreen--;
        updateUI();
      }
    }

    function nextScreen() {
      if (currentScreen < SCREENS.length) {
        currentScreen++;
        updateUI();
      }
    }

    function setPortal(portalKey) {
      currentPortal = portalKey;
      updateUI();
    }

    function setLocation(tag, title, address) {
      selectedLocation = { tag, title, address };
      document.getElementById('activeLocationLabel').textContent = tag;
      document.getElementById('activeLocationAddress').textContent = address;
    }

    function cycleLanguage() {
      langIdx = (langIdx + 1) % languages.length;
      const l = languages[langIdx];
      const code = l.split(' ')[0];
      document.getElementById('langCode').textContent = code;
      const profL = document.getElementById('profileLangText');
      if (profL) profL.textContent = code;
    }

    function setDisplayMode(mode) {
      displayMode = mode;
      const pContainer = document.getElementById('phoneModeContainer');
      const gContainer = document.getElementById('gridModeContainer');
      const pBtn = document.getElementById('modePhoneBtn');
      const gBtn = document.getElementById('modeGridBtn');

      if (mode === 'phone') {
        pContainer.classList.remove('hidden');
        gContainer.classList.add('hidden');
        pBtn.className = 'px-3 py-1.5 rounded-lg bg-white text-slate-900 font-bold shadow-sm flex items-center gap-1.5';
        gBtn.className = 'px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
      } else {
        pContainer.classList.add('hidden');
        gContainer.classList.remove('hidden');
        gBtn.className = 'px-3 py-1.5 rounded-lg bg-white text-slate-900 font-bold shadow-sm flex items-center gap-1.5';
        pBtn.className = 'px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
        renderGridMode();
      }
    }

    function requireServiceAuth(targetScreenId, actionLabel) {
      if (isAuthenticated) {
        goScreen(targetScreenId);
      } else {
        pendingScreenAfterAuth = targetScreenId;
        document.getElementById('pendingActionLabel').textContent = `Action: ${actionLabel}`;
        document.getElementById('serviceAuthOverlay').classList.remove('hidden');
      }
    }

    function closeAuthOverlay() {
      document.getElementById('serviceAuthOverlay').classList.add('hidden');
      pendingScreenAfterAuth = null;
    }

    function confirmServiceLogin() {
      isAuthenticated = true;
      ownerName = document.getElementById('modalOwnerName').value || 'Pavan Sharma';
      syncAuthUI();
      closeAuthOverlay();
      if (pendingScreenAfterAuth) {
        goScreen(pendingScreenAfterAuth);
      } else {
        goScreen(4);
      }
    }

    function toggleAuthState() {
      isAuthenticated = !isAuthenticated;
      if (!isAuthenticated) {
        ownerName = 'Guest Explorer';
      } else {
        ownerName = 'Pavan Sharma';
      }
      syncAuthUI();
      updateUI();
    }

    function syncAuthUI() {
      const badge = document.getElementById('guestBadge');
      const label = document.getElementById('guestLabel');
      const dot = document.getElementById('guestDot');
      const btn = document.getElementById('guestToggleBtn');
      const avatar = document.getElementById('headerAvatarText');

      if (isAuthenticated) {
        badge.className = 'px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-medium flex items-center gap-2';
        label.className = 'text-emerald-800 font-bold';
        label.textContent = `Logged In: ${ownerName}`;
        dot.className = 'w-2 h-2 rounded-full bg-emerald-500';
        btn.textContent = 'Logout';
        avatar.textContent = ownerName.charAt(0).toUpperCase();
      } else {
        badge.className = 'px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-medium flex items-center gap-2';
        label.className = 'text-amber-800 font-semibold';
        label.textContent = 'Guest Mode (Free Browse)';
        dot.className = 'w-2 h-2 rounded-full bg-amber-500 pulse-dot';
        btn.textContent = 'Login';
        avatar.textContent = 'G';
      }
    }

    function buildTopBars() {
      // Group Filter Bar
      const mBar = document.getElementById('moduleFilterBar');
      mBar.innerHTML = GROUPS.map(g => `
        <button onclick="setFilterGroup('${g}')" class="px-3 py-1 rounded-full whitespace-nowrap transition-all ${selectedGroup===g ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
          ${g}
        </button>
      `).join('');

      // Screen Jump Bar
      const sBar = document.getElementById('screenJumpBar');
      const filtered = selectedGroup === 'All 38' ? SCREENS : SCREENS.filter(s => s.group === selectedGroup);
      sBar.innerHTML = filtered.map(s => `
        <button onclick="goScreen(${s.id})" class="px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${currentScreen===s.id ? 'bg-blue-600 text-white font-bold' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}">
          S${String(s.id).padStart(2,'0')} • ${s.short}
        </button>
      `).join('');
    }

    function setFilterGroup(grp) {
      selectedGroup = grp;
      buildTopBars();
      if (displayMode === 'grid') renderGridMode();
    }

    function renderGridMode() {
      const mount = document.getElementById('allScreensGridMount');
      const filtered = selectedGroup === 'All 38' ? SCREENS : SCREENS.filter(s => s.group === selectedGroup);
      const groupsPresent = Array.from(new Set(filtered.map(s => s.group)));

      mount.innerHTML = groupsPresent.map(grp => {
        const items = filtered.filter(s => s.group === grp);
        return `
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wider">${grp} (${items.length} Screens)</h3>
              <span class="text-xs font-mono text-slate-500">Click any card to open in phone mode</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              ${items.map(s => `
                <div onclick="goScreen(${s.id}); setDisplayMode('phone');" class="rounded-[28px] bg-white border-2 ${currentScreen===s.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-400'} overflow-hidden flex flex-col cursor-pointer transition-all shadow-sm hover:shadow-md">
                  <div class="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span class="text-xs font-mono font-extrabold text-blue-600">S${String(s.id).padStart(2,'0')}</span>
                    <span class="text-xs font-bold text-slate-900 truncate max-w-[180px]">${s.short}</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400"></i>
                  </div>
                  <div class="flex-1 max-h-[440px] overflow-y-auto no-scrollbar pointer-events-none bg-white">
                    ${renderScreenHTML(s.id)}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('');
    }

    function updateUI() {
      buildTopBars();
      const meta = SCREENS.find(s => s.id === currentScreen) || SCREENS[0];
      document.getElementById('phoneViewport').innerHTML = renderScreenHTML(currentScreen);

      // On pure Splash Screen S01, hide app top header & bottom nav; show on all other screens!
      const topBar = document.getElementById('appTopHeader');
      const botNav = document.getElementById('appBottomNav');
      const phoneStatus = document.getElementById('phoneStatusBar');

      if (currentScreen === 1) {
        topBar.classList.add('hidden');
        botNav.classList.add('hidden');
        phoneStatus.className = 'h-11 px-7 flex items-center justify-between text-[11px] text-white font-bold z-30 shrink-0 bg-black';
      } else {
        topBar.classList.remove('hidden');
        botNav.classList.remove('hidden');
        phoneStatus.className = 'h-11 px-7 flex items-center justify-between text-[11px] text-slate-800 font-bold z-30 shrink-0 bg-white';
      }

      // Automobile SOS FAB visibility
      const sosFab = document.getElementById('autoSosFab');
      if (currentPortal === 'automobile' && currentScreen === 4) {
        sosFab.classList.remove('hidden');
        sosFab.classList.add('flex');
      } else {
        sosFab.classList.add('hidden');
        sosFab.classList.remove('flex');
      }

      // Highlight active bottom nav item
      const navMap = { home: [2,4,5,6,7,8,9,10,11,12,13,14,25,26,27], jobs: [15,16,17,18,19,20], assets: [21,22,23,24], market: [28,29,30,31,32,33], profile: [3,34,35,36,37,38] };
      Object.keys(navMap).forEach(k => {
        const el = document.getElementById('bnav-' + k);
        if (el) {
          el.className = navMap[k].includes(currentScreen)
            ? 'flex flex-col items-center gap-1 text-blue-600 transition-colors'
            : 'flex flex-col items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors';
        }
      });

      // Inspector panel updates
      document.getElementById('inspectorBadge').textContent = `SCREEN ${String(meta.id).padStart(2,'0')} / 38`;
      document.getElementById('inspectorModule').textContent = meta.group;
      document.getElementById('inspectorTitle').textContent = meta.title;
      document.getElementById('inspectorDesc').textContent = meta.desc;
    }

    // Initialize UI on S01 Splash screen
    syncAuthUI();
    updateUI();
  </script>
</body>
</html>
"""

# Write to both target paths
with open("F:/uptime/design-system/index.html", "w", encoding="utf-8") as f:
    f.write(html_code)

with open("F:/uptime/design-system/dist/index.html", "w", encoding="utf-8") as f:
    f.write(html_code)

print(f"SUCCESS: Generated Modern Light Theme UPTIME Owner App with exact uploaded Splash + Zomato/BigBasket Location Header ({len(html_code)} bytes)")
