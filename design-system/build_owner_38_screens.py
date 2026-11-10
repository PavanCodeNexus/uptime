import os

html_code = r"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UPTIME — Complete Dedicated Owner App (All 38 Screens)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet" />
  <style>
    :root {
      --font-display: 'Space Grotesk', -apple-system, sans-serif;
      --font-body: 'Plus Jakarta Sans', -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }
    body {
      font-family: var(--font-body);
      background: #020617;
      color: #f8fafc;
      margin: 0;
    }
    .font-display { font-family: var(--font-display); }
    .font-mono { font-family: var(--font-mono); }

    .glass {
      background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.015) 100%);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(255,255,255,0.09);
      box-shadow: 0 16px 36px -12px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.12);
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes pulse-ring {
      0% { transform: scale(0.85); opacity: 0.85; }
      70% { transform: scale(1.45); opacity: 0.1; }
      100% { transform: scale(1.65); opacity: 0; }
    }
    .radar-ring { animation: pulse-ring 2s infinite ease-out; }

    @keyframes eq-bounce {
      0%, 100% { height: 10px; }
      35% { height: 42px; }
      65% { height: 20px; }
      85% { height: 52px; }
    }
    .eq-bar { animation: eq-bounce 1s ease-in-out infinite alternate; }
  </style>
</head>
<body class="min-h-screen bg-[#020617] text-slate-100 select-none">

  <!-- ===================================================================== -->
  <!-- TOP STUDIO CONTROL HEADER (MODE SWITCHER + GUEST/AUTH STATUS + FILTERS) -->
  <!-- ===================================================================== -->
  <header class="sticky top-0 z-50 bg-[#04091A]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3">
    <div class="max-w-[1600px] mx-auto space-y-2.5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <!-- Brand Identity -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00D4AA] to-[#2563EB] flex items-center justify-center text-slate-950 font-display font-black text-base shadow-[0_0_24px_rgba(0,212,170,0.45)]">
            U↑
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-sm sm:text-base font-display font-bold tracking-wider text-white">UPTIME — OWNER APP</h1>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/30 font-bold">ALL 38 SCREENS • USER APP ONLY</span>
            </div>
            <p class="text-[11px] text-slate-400 font-mono">Downtime ends here. • Guest-First Browse → Login ONLY When Taking Service</p>
          </div>
        </div>

        <!-- View Mode Switcher + Auth Simulator -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Interactive vs All-38 Artboard Grid Switch -->
          <div class="p-1 rounded-xl bg-slate-950 border border-white/10 flex items-center gap-1 text-xs font-semibold">
            <button id="modePhoneBtn" onclick="setDisplayMode('phone')" class="px-3 py-1.5 rounded-lg bg-[#00D4AA] text-slate-950 font-bold flex items-center gap-1.5 transition-all">
              <i class="fa-solid fa-mobile-screen-button"></i>
              <span>Interactive Phone</span>
            </button>
            <button id="modeGridBtn" onclick="setDisplayMode('grid')" class="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white flex items-center gap-1.5 transition-all">
              <i class="fa-solid fa-grip"></i>
              <span>All 38 Screens Artboard Grid</span>
            </button>
          </div>

          <!-- Live Guest / Logged-In Indicator -->
          <div id="guestBadge" class="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono flex items-center gap-2">
            <span id="guestDot" class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span id="guestLabel" class="text-amber-300 font-bold">Guest Mode (Free Browse)</span>
            <button onclick="toggleAuthState()" id="guestToggleBtn" class="ml-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px]">Login</button>
          </div>
        </div>
      </div>

      <!-- Module Group Filter Bar -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-semibold pb-0.5" id="moduleFilterBar"></div>

      <!-- Horizontal 38-Screen Quick Jump Bar -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px] font-mono pt-0.5" id="screenJumpBar"></div>
    </div>
  </header>

  <!-- ===================================================================== -->
  <!-- MODE 1: INTERACTIVE PHONE SIMULATOR + LIVE WORKFLOW SIDEBAR           -->
  <!-- ===================================================================== -->
  <main id="phoneModeContainer" class="max-w-6xl mx-auto px-3 py-6 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">

    <!-- MOBILE DEVICE CHASSIS -->
    <div id="phoneChassis" class="w-full max-w-[412px] h-[868px] bg-[#070C18] rounded-[48px] border-[10px] border-[#162033] shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1)] relative overflow-hidden flex flex-col shrink-0">
      <!-- Dynamic Industry Ambient Glow -->
      <div id="ambientTop" class="absolute -top-24 -left-20 w-72 h-72 rounded-full blur-[95px] opacity-30 bg-purple-600 pointer-events-none transition-all duration-500"></div>
      <div id="ambientBottom" class="absolute bottom-16 -right-24 w-72 h-72 rounded-full blur-[95px] opacity-25 bg-teal-500 pointer-events-none transition-all duration-500"></div>

      <!-- Phone Status Bar -->
      <div class="h-11 px-7 flex items-center justify-between text-[11px] text-slate-300 font-mono z-30 shrink-0">
        <span class="font-bold">09:41</span>
        <div class="w-24 h-4 bg-black/80 rounded-full border border-white/10 flex items-center justify-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-[#00D4AA]"></span>
          <span class="text-[8px] text-slate-400">UPTIME</span>
        </div>
        <div class="flex items-center gap-1.5 text-[10px]">
          <i class="fa-solid fa-signal"></i>
          <i class="fa-solid fa-wifi"></i>
          <span class="text-[#00D4AA] font-bold">100%</span>
        </div>
      </div>

      <!-- Persistent App Top Bar (Hidden only on Splash S01) -->
      <div id="appTopHeader" class="px-4 py-2 border-b border-white/[0.07] bg-slate-950/60 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
        <div class="flex items-center gap-2 cursor-pointer" onclick="goScreen(4)">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#00D4AA] to-[#2563EB] text-slate-950 font-display font-black text-xs flex items-center justify-center">U↑</div>
          <div>
            <div class="text-[11px] font-display font-bold tracking-wider text-white leading-none">UPTIME</div>
            <div class="text-[8px] text-[#00D4AA] font-medium">Downtime ends here.</div>
          </div>
        </div>
        <div class="flex items-center gap-1.5">
          <!-- 9-Language Pill -->
          <button onclick="cycleLanguage()" id="langBtn" class="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-slate-200 hover:border-[#00D4AA]/50 flex items-center gap-1" title="9 Indian Languages">
            <i class="fa-solid fa-language text-[#00D4AA]"></i>
            <span id="langCode">EN</span>
          </button>
          <!-- AI Bot -->
          <button onclick="goScreen(37)" class="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-[#00D4AA] text-xs flex items-center justify-center hover:bg-white/10" title="Gemini AI Assistant">
            <i class="fa-solid fa-robot"></i>
          </button>
          <!-- Cart -->
          <button onclick="goScreen(33)" class="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-slate-200 text-xs flex items-center justify-center relative hover:bg-white/10" title="Spare Parts Cart">
            <i class="fa-solid fa-bag-shopping"></i>
            <span id="cartCountBadge" class="w-3.5 h-3.5 rounded-full bg-[#00D4AA] text-slate-950 text-[8px] font-black flex items-center justify-center absolute -top-1 -right-1">2</span>
          </button>
          <!-- Notifications -->
          <button onclick="goScreen(38)" class="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-slate-200 text-xs flex items-center justify-center relative hover:bg-white/10" title="Notifications & Profile">
            <i class="fa-solid fa-bell"></i>
            <span class="w-2 h-2 rounded-full bg-rose-500 absolute top-0.5 right-0.5"></span>
          </button>
        </div>
      </div>

      <!-- DYNAMIC SCREEN VIEWPORT -->
      <div id="phoneViewport" class="flex-1 overflow-y-auto no-scrollbar z-10 relative"></div>

      <!-- Automobile Floating Red SOS 60s Button -->
      <button id="autoSosFab" onclick="requireServiceAuth(14, 'Launch 60s Roadside Emergency SOS')" class="hidden absolute bottom-20 right-4 z-30 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-display font-bold text-[11px] shadow-[0_8px_24px_rgba(220,38,38,0.65)] items-center gap-1.5 border border-red-400/40">
        <i class="fa-solid fa-truck-medical animate-bounce"></i>
        <span>SOS 60s</span>
      </button>

      <!-- Persistent 5-Tab Bottom Navigation (DESIGN.md §13: Home | Jobs | Assets | Market | Profile) -->
      <nav id="appBottomNav" class="h-16 px-4 bg-[#050914]/95 backdrop-blur-xl border-t border-white/10 grid grid-cols-5 items-center z-20 shrink-0">
        <button onclick="goScreen(4)" id="bnav-home" class="flex flex-col items-center gap-0.5 text-[#00D4AA]">
          <i class="fa-solid fa-house text-sm"></i>
          <span class="text-[9px] font-semibold">Home</span>
        </button>
        <button onclick="goScreen(18)" id="bnav-jobs" class="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white relative">
          <span class="w-2 h-2 rounded-full bg-amber-400 absolute top-0 right-5"></span>
          <i class="fa-solid fa-briefcase text-sm"></i>
          <span class="text-[9px] font-semibold">Jobs</span>
        </button>
        <button onclick="goScreen(21)" id="bnav-assets" class="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white">
          <i class="fa-solid fa-server text-sm"></i>
          <span class="text-[9px] font-semibold">Assets</span>
        </button>
        <button onclick="goScreen(31)" id="bnav-market" class="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white">
          <i class="fa-solid fa-store text-sm"></i>
          <span class="text-[9px] font-semibold">Market</span>
        </button>
        <button onclick="goScreen(38)" id="bnav-profile" class="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white">
          <i class="fa-solid fa-user-shield text-sm"></i>
          <span class="text-[9px] font-semibold">Profile</span>
        </button>
      </nav>

      <!-- SEAMLESS SERVICE-TRIGGERED LOGIN OVERLAY MODAL -->
      <div id="serviceAuthOverlay" class="hidden absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col justify-end">
        <div class="glass rounded-t-[34px] p-5 border-t border-[#00D4AA]/40 space-y-3.5">
          <div class="w-10 h-1 bg-white/20 rounded-full mx-auto"></div>
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#00D4AA]/15 text-[#00D4AA] font-bold">Service Auth Gate</span>
              <h3 class="text-base font-display font-bold text-white mt-1">Sign in to Take Service</h3>
              <p id="pendingActionLabel" class="text-[11px] text-slate-300">Action: Book On-Site Technician</p>
            </div>
            <button onclick="closeAuthOverlay()" class="w-7 h-7 rounded-full bg-white/10 text-slate-300 flex items-center justify-center"><i class="fa-solid fa-xmark text-xs"></i></button>
          </div>

          <div class="space-y-2.5 text-xs">
            <div>
              <label class="text-[10px] font-mono text-slate-400 block mb-1">10-Digit Mobile Number (India)</label>
              <div class="flex gap-2">
                <span class="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 font-mono text-slate-300">+91</span>
                <input id="modalPhone" type="tel" value="98450 67890" class="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/15 font-mono text-white focus:outline-none focus:border-[#00D4AA]" />
              </div>
            </div>
            <div>
              <label class="text-[10px] font-mono text-slate-400 block mb-1">6-Digit SMS OTP (Auto-Read)</label>
              <div class="grid grid-cols-6 gap-1.5 font-mono text-center font-bold text-sm">
                <input value="4" maxlength="1" class="py-2 rounded-xl bg-slate-900 border border-[#00D4AA]/50 text-[#00D4AA] text-center" />
                <input value="8" maxlength="1" class="py-2 rounded-xl bg-slate-900 border border-[#00D4AA]/50 text-[#00D4AA] text-center" />
                <input value="2" maxlength="1" class="py-2 rounded-xl bg-slate-900 border border-[#00D4AA]/50 text-[#00D4AA] text-center" />
                <input value="9" maxlength="1" class="py-2 rounded-xl bg-slate-900 border border-[#00D4AA]/50 text-[#00D4AA] text-center" />
                <input value="1" maxlength="1" class="py-2 rounded-xl bg-slate-900 border border-[#00D4AA]/50 text-[#00D4AA] text-center" />
                <input value="6" maxlength="1" class="py-2 rounded-xl bg-slate-900 border border-[#00D4AA]/50 text-[#00D4AA] text-center" />
              </div>
            </div>
            <div>
              <label class="text-[10px] font-mono text-slate-400 block mb-1">Owner / Company Name</label>
              <input id="modalOwnerName" type="text" value="Pavan Sharma • Peenya MSME Unit #4" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none" />
            </div>
          </div>

          <button onclick="confirmServiceLogin()" class="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#10B981] text-slate-950 font-display font-bold text-xs shadow-lg flex items-center justify-center gap-2">
            <i class="fa-solid fa-shield-check"></i>
            <span>Verify OTP & Continue to Service →</span>
          </button>
          <p class="text-[10px] text-center text-slate-400 font-mono">Browsing is always free • Login only required for bookings & transactions</p>
        </div>
      </div>
    </div>

    <!-- RIGHT INSPECTOR PANEL: CURRENT SCREEN SPEC + WORKFLOW GUIDE -->
    <aside class="w-full max-w-md space-y-4">
      <div class="glass rounded-3xl p-5 space-y-3 border border-white/10">
        <div class="flex items-center justify-between">
          <span id="inspectorBadge" class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/30 font-bold">SCREEN 01 / 38</span>
          <span id="inspectorModule" class="text-[10px] font-mono text-slate-400 uppercase">Entry & Auth</span>
        </div>
        <h2 id="inspectorTitle" class="text-lg font-display font-bold text-white">Splash Screen</h2>
        <p id="inspectorDesc" class="text-xs text-slate-300 leading-relaxed"></p>
        <div class="pt-2 flex items-center justify-between gap-2 border-t border-white/10">
          <button onclick="prevScreen()" class="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5">
            <i class="fa-solid fa-arrow-left"></i><span>Prev Screen</span>
          </button>
          <button onclick="setDisplayMode('grid')" class="px-3 py-2 rounded-xl bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/30 text-xs font-bold">
            View All 38 Grid
          </button>
          <button onclick="nextScreen()" class="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5">
            <span>Next Screen</span><i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Workflow Rules Checklist -->
      <div class="glass rounded-3xl p-5 space-y-2.5 border border-white/10 text-xs">
        <h3 class="font-display font-bold text-sm text-white flex items-center gap-2">
          <i class="fa-solid fa-route text-[#00D4AA]"></i>
          <span>Owner App Core Workflow</span>
        </h3>
        <div class="space-y-2 text-slate-300 text-[11px]">
          <div class="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <strong class="text-white">1. First Tap → Splash (`S01`):</strong> Shows <span class="text-[#00D4AA] font-mono">UPTIME — Downtime ends here.</span> and opens Home immediately.
          </div>
          <div class="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <strong class="text-white">2. Unrestricted Guest Browse (`S04–S08`, `S24–S32`, `S36`):</strong> Switch all 3 industries (<span class="text-purple-400">Industrial</span>, <span class="text-blue-400">Automobile</span>, <span class="text-cyan-400">Electronics</span>), search 1,151+ A-Z catalogues, test Gemini AI Sound Triage, browse Spare Parts & Wiki <em>without logging in</em>.
          </div>
          <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25">
            <strong class="text-amber-300">3. Login ONLY When Taking Service (`S03`):</strong> Tapping <em>Book Technician</em>, <em>Start Video Call</em>, <em>60s SOS</em>, or <em>Checkout</em> triggers the OTP sheet and resumes the exact action!
          </div>
        </div>
      </div>
    </aside>
  </main>

  <!-- ===================================================================== -->
  <!-- MODE 2: ALL-38-SCREENS PANORAMIC FIGMA ARTBOARD GRID                  -->
  <!-- ===================================================================== -->
  <section id="gridModeContainer" class="hidden max-w-[1600px] mx-auto px-4 py-6 space-y-8">
    <div class="glass rounded-3xl p-5 border border-[#00D4AA]/30 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-display font-bold text-white">Complete Owner App Storyboard — All 38 Production Screens</h2>
        <p class="text-xs text-slate-300">100% Dedicated Owner App (Zero Technician/Admin screens mixed in). Click any screen artboard below to launch it interactively.</p>
      </div>
      <button onclick="setDisplayMode('phone')" class="px-4 py-2 rounded-xl bg-[#00D4AA] text-slate-950 font-display font-bold text-xs">
        Return to Interactive Phone →
      </button>
    </div>
    <div id="allScreensGridMount" class="space-y-10"></div>
  </section>

  <script>
    // =========================================================================
    // GLOBAL STATE
    // =========================================================================
    let currentScreen = 1; // Starts on Screen 01: UPTIME Splash + Tagline!
    let displayMode = 'phone';
    let isAuthenticated = false;
    let ownerName = 'Guest Explorer';
    let pendingScreenAfterAuth = null;
    let currentPortal = 'industrial';
    const languages = ['EN', 'HI • हिं', 'KN • ಕ', 'TA • த', 'TE • తె', 'ML • മ', 'MR • म', 'GU • ગુ', 'BN • বাং'];
    let langIdx = 0;

    const portalThemes = {
      industrial: {
        name: 'Industries',
        badge: '1,151+ Heavy Machines',
        accentHex: '#A855F7',
        pillClass: 'from-purple-500 to-indigo-600 text-white shadow-[0_4px_16px_rgba(168,85,247,0.45)]',
        glow1: 'bg-purple-600',
        heroTitle: 'CNC, Boiler or Hydraulic Line Down?',
        heroSub: 'Certified Fanuc, Siemens, IBR Boiler & PLC specialists dispatched in <18 mins.',
        searchHint: 'Search CNC spindle, VFD drive, screw compressor, boiler...',
        chips: ['⚙️ CNC Spindle', '🔥 IBR Boiler', '💧 Hydraulic Press', '🔌 PLC / VFD', '❄️ Chiller'],
        cats: [
          { title: 'CNC & VMC Machines', sub: 'Fanuc • Siemens • Haas', icon: 'fa-gears', color: 'text-purple-400' },
          { title: 'IBR Boilers & Burners', sub: 'Thermax • Pressure Valves', icon: 'fa-fire-flame-curved', color: 'text-amber-400' },
          { title: 'Hydraulic & Pneumatic', sub: 'Rexroth • Cylinders • Seals', icon: 'fa-compress', color: 'text-teal-400' },
          { title: '3-Phase Motors & VFD', sub: 'ABB • Rewinding • Bearings', icon: 'fa-bolt', color: 'text-blue-400' }
        ]
      },
      automobile: {
        name: 'Automobile',
        badge: '24/7 Roadside & EV SOS',
        accentHex: '#3B82F6',
        pillClass: 'from-blue-500 to-cyan-500 text-slate-950 shadow-[0_4px_16px_rgba(59,130,246,0.45)]',
        glow1: 'bg-blue-600',
        heroTitle: 'Stranded on Highway or Fleet Breakdown?',
        heroSub: '60-second SOS live auction, OBD-II scan, EV BMS rescue, tyre & jumpstart.',
        searchHint: 'Search jumpstart, clutch, EV battery, OBD warning light...',
        chips: ['🆘 60s Highway SOS', '🔋 EV High-Voltage', '🛞 Flat Tyre / Fuel', '🚨 Warning Light AI'],
        cats: [
          { title: 'Roadside Battery & Jump', sub: '15-min SOS • Alternators', icon: 'fa-car-battery', color: 'text-blue-400' },
          { title: 'EV Battery & Motor BMS', sub: 'Tata • Ola • Ather • MG', icon: 'fa-charging-station', color: 'text-emerald-400' },
          { title: 'Engine, Clutch & Brakes', sub: 'OBD-II • Diesel & Petrol', icon: 'fa-car-side', color: 'text-rose-400' },
          { title: 'Commercial Truck Fleet', sub: 'BS6 • Air Brakes • Injectors', icon: 'fa-truck-moving', color: 'text-amber-400' }
        ]
      },
      electronics: {
        name: 'Electronics',
        badge: 'Home & Office Devices',
        accentHex: '#06B6D4',
        pillClass: 'from-cyan-400 to-teal-400 text-slate-950 shadow-[0_4px_16px_rgba(6,182,212,0.45)]',
        glow1: 'bg-cyan-500',
        heroTitle: 'AC Not Cooling or PCB Board Fault?',
        heroSub: 'Doorstep chip-level repair with Privacy Data Lock & Repair-vs-Replace AI.',
        searchHint: 'Search Inverter AC E4 error, fridge compressor, laptop PCB...',
        chips: ['❄️ Inverter Split AC', '🧊 Fridge Gas/PCB', '💻 Laptop Chip-Level', '🔋 Solar / UPS'],
        cats: [
          { title: 'Inverter AC & HVAC', sub: 'Daikin • LG • R32 Refill', icon: 'fa-snowflake', color: 'text-cyan-400' },
          { title: 'Refrigerator & Washer', sub: 'Compressor • Drum • Sensor', icon: 'fa-temperature-low', color: 'text-teal-400' },
          { title: 'Laptop, Server & UPS', sub: 'Motherboard • Data Lock', icon: 'fa-laptop-code', color: 'text-indigo-400' },
          { title: 'Smart Home & Solar', sub: 'IoT Sync • Hybrid Inverter', icon: 'fa-solar-panel', color: 'text-amber-400' }
        ]
      }
    };

    // =========================================================================
    // MASTER REGISTRY OF ALL 38 OWNER APP SCREENS
    // =========================================================================
    const SCREENS = [
      { id: 1, group: 'Entry & Auth', short: 'Splash', title: '01. Splash Screen (First Tap)', desc: 'First screen when Owner taps UPTIME: displays [U↑] logo + "Downtime ends here." and enters Home directly in Guest Mode without login walls.' },
      { id: 2, group: 'Entry & Auth', short: 'Onboarding', title: '02. 3-Industry Visual Intro', desc: 'Optional 3-slide swipe tour introducing Industrial, Automobile & Electronics capabilities with 1-tap Skip to Browse.' },
      { id: 3, group: 'Entry & Auth', short: 'OTP Login Gate', title: '03. Service-Triggered Phone + 6-Digit OTP Gate', desc: 'Appears ONLY when a Guest user takes a service (Book Tech, Video Call, SOS, Checkout) — preserves booking context seamlessly.' },

      { id: 4, group: 'Home & Catalog', short: '3-Portal Home', title: '04. 3-Portal Home Command Hub (Guest Open)', desc: 'Ajio-style [Industries | Automobile | Electronics] switcher, active job banner, quick actions, asset health row & AI prediction alert.' },
      { id: 5, group: 'Home & Catalog', short: 'A-Z Catalogue', title: '05. A-to-Z Equipment & Specialist Explorer', desc: 'Browse & search 1,151+ machines, vehicles & appliances alphabetically (A–Z) with live specialist availability.' },

      { id: 6, group: 'Fault & AI Triage', short: 'Report Fault', title: '06. Multi-Input Fault Report Studio (CORE-01)', desc: 'Report faults via 9-language Voice Input, Photos, 2-min Video, Live Sound Recording & 4 Urgency levels.' },
      { id: 7, group: 'Fault & AI Triage', short: 'AI + 3-Path Choice', title: '07. Gemini AI Diagnosis & 3-Path Choice (v1.1)', desc: '48kHz Audio FFT + ₹800–₹1,500 estimate + Pavan’s World-First 3-Path Owner Choice: Free AI Copilot | ₹199 Video | ₹800+ On-Site Tech.' },
      { id: 8, group: 'Fault & AI Triage', short: 'DIY AI Copilot', title: '08. Owner Free AI DIY Copilot (Step-by-Step)', desc: 'Guided self-fix instructions with safety lockout check, required tool list & 1-tap escalation to Video or Technician.' },

      { id: 9, group: 'Video Consult', short: 'Consult Tiers', title: '09. Virtual Consult Tier & Specialist Picker', desc: 'Choose Quick Check ₹99, Full Diagnosis ₹199 (Recommended), or Extended ₹299 with live available master engineers.' },
      { id: 10, group: 'Video Consult', short: 'Agora Live Call', title: '10. Agora HD Video Call + AI AR Overlay', desc: 'Live WebRTC video room with Gemini real-time camera annotation & automatic ₹199 fee deduction if physical visit is needed.' },

      { id: 11, group: 'Match & Book', short: 'Tech List/Map', title: '11. Smart Technician Matching (60% Skill + 40% Dist)', desc: 'Composite PostGIS + Skill Tag ranking list with match progress bars, ETA, cost estimate & Google Map pin toggle.' },
      { id: 12, group: 'Match & Book', short: 'Tech Profile', title: '12. Technician Full Profile & Polygon NFT Badges', desc: 'Inspect Aadhaar/NCVT verification, blockchain-minted NFT skill badges, tools carried & verified owner reviews.' },
      { id: 13, group: 'Match & Book', short: 'Negotiate & Book', title: '13. AI Price Negotiation & Booking Confirmation', desc: 'Transparent counter-offer slider within AI fair-price band, site address selector & ₹49 Per-Job Micro-Insurance add-on.' },
      { id: 14, group: 'Match & Book', short: '60s SOS Auction', title: '14. 60-Second Emergency SOS Live Auction', desc: 'Critical factory/highway breakdown broadcast with 60s countdown ring and live competing technician ETA bids.' },

      { id: 15, group: 'Track & Verify', short: 'Live GPS Map', title: '15. Uber-Style Live GPS Tracking & Chat', desc: '5-second WebSocket GPS marker, 5-stage job stepper, live ETA countdown & real-time 9-language translated chat.' },
      { id: 16, group: 'Track & Verify', short: '6-Digit OTP+GPS', title: '16. Dual-Factor 6-Digit OTP + 500m PostGIS Lock', desc: 'Fraud-proof arrival screen showing 6-digit OTP (valid 10m) paired with <500m GPS proximity verification.' },
      { id: 17, group: 'Track & Verify', short: 'Live Repair Steps', title: '17. Live In-Progress Repair & Parts Approval', desc: 'Track technician’s AI checklist progress with step photos and approve any additional spare part quotes from phone.' },

      { id: 18, group: 'Jobs & History', short: 'Job History', title: '18. Job History & Filter Ledger', desc: 'Searchable archive of Active, Completed & Cancelled jobs (UPT-2026-XXXXX) with 1-tap certificate download.' },
      { id: 19, group: 'Jobs & History', short: 'SHA-256 Cert', title: '19. Job Details & SHA-256 Tamper-Proof Certificate', desc: 'Complete timeline, Before/After photo slider, itemized GST bill & cryptographic SHA-256 repair certificate.' },
      { id: 20, group: 'Jobs & History', short: 'Rate & Tip', title: '20. Rate & Review Technician Screen', desc: '1–5 star rating, skill/punctuality compliments, optional appreciation tip & trust score update.' },

      { id: 21, group: 'Assets & Twin', short: 'My Assets Hub', title: '21. My Assets Hub (Machines | Vehicles | Devices)', desc: 'Central inventory of factory machines, fleet vehicles & home/office appliances with live health rings.' },
      { id: 22, group: 'Assets & Twin', short: 'Add Asset OCR', title: '22. Quick Add Asset & Nameplate OCR Scanner', desc: 'Register a machine, car RC or appliance in 10 seconds by scanning its serial plate or QR code.' },
      { id: 23, group: 'Assets & Twin', short: 'Asset Details', title: '23. Asset Details, Uptime % & Service Ledger', desc: 'Lifetime repair history, MTBF uptime percentage, linked warranty countdown & total maintenance spend.' },
      { id: 24, group: 'Assets & Twin', short: 'Digital Twin', title: '24. IoT Digital Twin & Failure Prediction Timeline', desc: '0–100% circular health gauge, 6 component sub-scores, AI wear prediction dates & ₹12,400 preventive savings meter.' },

      { id: 25, group: 'Industry Labs', short: 'Industrial Lab', title: '25. Industrial Lab: Epidemic & Silent Killer Radar', desc: 'Batch model defect alerts (ELEC-U01), power/vibration Silent Killer warnings (ELEC-U02) & multi-plant MSME dashboard.' },
      { id: 26, group: 'Industry Labs', short: 'Automobile Lab', title: '26. Automobile Lab: Warning AI, Mood & Pre-Purchase', desc: 'Dashboard Warning Light camera reader, Vehicle Mood Score, 50-point Used-Car Pre-Purchase Scan, EV & Challan tools.' },
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
    // RENDER INDIVIDUAL SCREEN HTML (1..38)
    // =========================================================================
    function renderScreenHTML(id) {
      const p = portalThemes[currentPortal];

      switch (id) {
        case 1:
          return `
            <div class="h-full flex flex-col justify-between items-center text-center p-6 pt-14">
              <div class="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Official Owner App</div>
              <div class="space-y-5">
                <div class="relative w-24 h-24 mx-auto">
                  <div class="w-24 h-24 rounded-[28px] bg-gradient-to-tr from-[#00D4AA] to-[#2563EB] flex items-center justify-center text-slate-950 font-display font-black text-4xl shadow-[0_0_55px_rgba(0,212,170,0.6)]">U↑</div>
                  <div class="absolute -inset-2 rounded-[32px] border border-[#00D4AA]/40 radar-ring"></div>
                </div>
                <div>
                  <h1 class="text-3xl font-display font-bold tracking-[0.18em] text-white">UPTIME</h1>
                  <p class="text-sm font-display font-bold text-[#00D4AA] mt-1">Downtime ends here.</p>
                  <p class="text-[11px] text-slate-400 mt-2.5 leading-relaxed max-w-[270px] mx-auto">
                    AI-powered repair & emergency technician dispatch across Industrial, Automobile & Electronics.
                  </p>
                </div>
                <div class="flex justify-center gap-2 text-[10px] font-mono text-slate-300">
                  <span class="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300">🏭 Industries</span>
                  <span class="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300">🚗 Auto</span>
                  <span class="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">⚡ Electronics</span>
                </div>
              </div>
              <div class="w-full space-y-2.5 pb-4">
                <button onclick="goScreen(4)" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00D4AA] to-[#10B981] text-slate-950 font-display font-bold text-xs shadow-lg flex items-center justify-center gap-2">
                  <span>Explore App Immediately (No Login)</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
                <button onclick="goScreen(2)" class="w-full py-2.5 rounded-xl bg-white/5 text-slate-300 text-[11px] font-semibold hover:bg-white/10">
                  30-Sec Intro Tour
                </button>
              </div>
            </div>`;

        case 2:
          return `
            <div class="p-5 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-mono text-[#00D4AA]">3-SLIDE INTRO • GUEST READY</span>
                <button onclick="goScreen(4)" class="text-xs font-bold text-slate-300 hover:text-white">Skip →</button>
              </div>
              <div class="space-y-2.5">
                <div class="glass rounded-2xl p-3.5 border-l-4 border-purple-500">
                  <div class="text-xs font-bold text-white">1. 🏭 Industrial & MSME Zero-Downtime</div>
                  <p class="text-[11px] text-slate-300 mt-1">48kHz Sound FFT triage, CNC/Boiler/PLC specialists & SHA-256 repair certificates.</p>
                </div>
                <div class="glass rounded-2xl p-3.5 border-l-4 border-blue-500">
                  <div class="text-xs font-bold text-white">2. 🚗 Automobile 60s Highway SOS</div>
                  <p class="text-[11px] text-slate-300 mt-1">Live 60s emergency technician auction, EV BMS support, Warning Light AI & Pre-Purchase scan.</p>
                </div>
                <div class="glass rounded-2xl p-3.5 border-l-4 border-cyan-400">
                  <div class="text-xs font-bold text-white">3. ⚡ Electronics & Smart Appliances</div>
                  <p class="text-[11px] text-slate-300 mt-1">Repair-vs-Replace AI calculator, Privacy Data Lock, OCR Warranty Vault & OEM parts.</p>
                </div>
              </div>
              <div class="p-3 rounded-2xl bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-[11px] text-slate-200">
                <strong class="text-[#00D4AA]">Owner-First Promise:</strong> Browse every catalogue, price & AI tool freely. Sign in only when you book!
              </div>
              <button onclick="goScreen(4)" class="w-full py-3 rounded-xl bg-[#00D4AA] text-slate-950 font-display font-bold text-xs">Start Exploring UPTIME →</button>
            </div>`;

        case 3:
          return `
            <div class="p-5 space-y-4">
              <div class="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 flex items-center gap-2">
                <i class="fa-solid fa-lock-open text-amber-400"></i>
                <span>Triggered <strong>only</strong> when taking a service or saving personal assets!</span>
              </div>
              <div class="glass rounded-3xl p-4 space-y-3 border border-[#00D4AA]/30">
                <h3 class="text-base font-display font-bold text-white">Sign in / Create Owner Account</h3>
                <p class="text-[11px] text-slate-400">10-digit Indian mobile number • Instant 6-digit OTP</p>
                <div class="flex gap-2">
                  <span class="px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs">+91</span>
                  <input value="98450 67890" class="flex-1 px-3 py-2.5 rounded-xl bg-slate-900 border border-white/15 font-mono text-xs text-white" />
                </div>
                <div class="grid grid-cols-6 gap-1.5 font-mono text-center font-bold">
                  <span class="py-2 rounded-xl bg-slate-900 border border-[#00D4AA] text-[#00D4AA]">4</span>
                  <span class="py-2 rounded-xl bg-slate-900 border border-[#00D4AA] text-[#00D4AA]">8</span>
                  <span class="py-2 rounded-xl bg-slate-900 border border-[#00D4AA] text-[#00D4AA]">2</span>
                  <span class="py-2 rounded-xl bg-slate-900 border border-[#00D4AA] text-[#00D4AA]">9</span>
                  <span class="py-2 rounded-xl bg-slate-900 border border-[#00D4AA] text-[#00D4AA]">1</span>
                  <span class="py-2 rounded-xl bg-slate-900 border border-[#00D4AA] text-[#00D4AA]">6</span>
                </div>
                <div class="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Auto-verified via SMS</span>
                  <span class="text-[#00D4AA]">Resend in 00:42</span>
                </div>
                <button onclick="isAuthenticated=true; ownerName='Pavan Sharma'; syncAuthUI(); goScreen(4);" class="w-full py-3 rounded-xl bg-[#00D4AA] text-slate-950 font-display font-bold text-xs">
                  Verify & Unlock Booking →
                </button>
              </div>
              <button onclick="goScreen(4)" class="w-full py-2 text-[11px] text-slate-400 hover:text-white">← Continue Browsing as Guest</button>
            </div>`;

        case 4:
          return `
            <div class="p-3.5 space-y-3.5 pb-6">
              <!-- Greeting & Location -->
              <div class="flex items-center justify-between text-xs px-1">
                <div>
                  <span class="text-[10px] text-slate-400 font-mono">${isAuthenticated ? 'Welcome back, ' + ownerName : 'Browsing freely as Guest 👋'}</span>
                  <div class="font-bold text-white flex items-center gap-1 text-xs">
                    <i class="fa-solid fa-location-dot text-[#00D4AA]"></i>
                    <span>Peenya Industrial Phase II, BLR</span>
                    <i class="fa-solid fa-chevron-down text-[9px] text-slate-400"></i>
                  </div>
                </div>
                <span class="px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 font-bold">⚡ 12m Avg ETA</span>
              </div>

              <!-- AJIO-STYLE 3-INDUSTRY SWITCHER -->
              <div class="p-1 rounded-2xl bg-slate-950 border border-white/10 grid grid-cols-3 gap-1">
                <button onclick="switchPortal('industrial')" class="py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center gap-0.5 transition-all ${currentPortal==='industrial' ? 'bg-gradient-to-r '+portalThemes.industrial.pillClass : 'text-slate-400 hover:text-white'}">
                  <span>🏭 Industries</span>
                  <span class="text-[8px] font-mono opacity-80">MSME/Plant</span>
                </button>
                <button onclick="switchPortal('automobile')" class="py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center gap-0.5 transition-all ${currentPortal==='automobile' ? 'bg-gradient-to-r '+portalThemes.automobile.pillClass : 'text-slate-400 hover:text-white'}">
                  <span>🚗 Automobile</span>
                  <span class="text-[8px] font-mono opacity-80">24/7 SOS</span>
                </button>
                <button onclick="switchPortal('electronics')" class="py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center gap-0.5 transition-all ${currentPortal==='electronics' ? 'bg-gradient-to-r '+portalThemes.electronics.pillClass : 'text-slate-400 hover:text-white'}">
                  <span>⚡ Electronics</span>
                  <span class="text-[8px] font-mono opacity-80">Appliances</span>
                </button>
              </div>

              <!-- Search Bar -->
              <div class="space-y-2">
                <div class="glass rounded-2xl p-1.5 flex items-center gap-2">
                  <i class="fa-solid fa-magnifying-glass text-xs text-slate-400 ml-2"></i>
                  <input onclick="goScreen(5)" readonly placeholder="${p.searchHint}" class="flex-1 bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none cursor-pointer" />
                  <button onclick="goScreen(6)" class="px-2.5 py-1.5 rounded-xl bg-[#00D4AA]/20 text-[#00D4AA] text-[10px] font-bold flex items-center gap-1">
                    <i class="fa-solid fa-microphone-lines"></i><span>AI</span>
                  </button>
                </div>
                <div class="flex gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
                  ${p.chips.map(c => `<button onclick="goScreen(5)" class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 whitespace-nowrap text-slate-200 hover:border-[#00D4AA]/50">${c}</button>`).join('')}
                </div>
              </div>

              <!-- Active Job Live Banner -->
              <div onclick="goScreen(15)" class="p-3 rounded-2xl bg-gradient-to-r from-blue-600/30 to-teal-500/20 border border-[#00D4AA]/40 flex items-center justify-between cursor-pointer">
                <div class="flex items-center gap-2.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#00D4AA] animate-ping"></span>
                  <div>
                    <div class="text-[11px] font-bold text-white">Active Demo: Rajesh M. en route · 8m</div>
                    <div class="text-[9px] font-mono text-slate-300">Tap to preview Uber-style GPS & 6-Digit OTP</div>
                  </div>
                </div>
                <i class="fa-solid fa-chevron-right text-xs text-[#00D4AA]"></i>
              </div>

              <!-- Hero Emergency Card -->
              <div class="glass rounded-3xl p-4 border border-white/15 space-y-2.5">
                <div class="flex items-center justify-between text-[9px] font-mono">
                  <span class="text-[#00D4AA] font-bold uppercase">${p.badge}</span>
                  <span class="text-slate-400">3-Tap Resolution</span>
                </div>
                <h2 class="text-base font-display font-bold text-white leading-snug">${p.heroTitle}</h2>
                <p class="text-[11px] text-slate-300 leading-relaxed">${p.heroSub}</p>
                <div class="grid grid-cols-2 gap-2 pt-1">
                  <button onclick="goScreen(6)" class="py-2.5 rounded-xl bg-[#00D4AA] text-slate-950 font-display font-bold text-xs flex items-center justify-center gap-1.5">
                    <i class="fa-solid fa-bolt"></i><span>Report Fault</span>
                  </button>
                  <button onclick="requireServiceAuth(9, 'Book Virtual Video Consultation')" class="py-2.5 rounded-xl bg-white/10 text-white border border-white/15 font-bold text-xs flex items-center justify-center gap-1.5">
                    <i class="fa-solid fa-video text-cyan-400"></i><span>Video ₹99+</span>
                  </button>
                </div>
              </div>

              <!-- 6 Quick Feature Launchers -->
              <div class="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div onclick="goScreen(24)" class="glass rounded-2xl p-2.5 cursor-pointer hover:border-[#00D4AA]/50">
                  <i class="fa-solid fa-gauge-high text-purple-400 text-sm mb-1 block"></i>
                  <span class="font-bold text-white block">Digital Twin</span>
                  <span class="text-[8px] text-slate-400">Health 94%</span>
                </div>
                <div onclick="goScreen(${currentPortal==='industrial'?25:(currentPortal==='automobile'?26:27)})" class="glass rounded-2xl p-2.5 cursor-pointer hover:border-[#00D4AA]/50">
                  <i class="fa-solid fa-flask text-amber-400 text-sm mb-1 block"></i>
                  <span class="font-bold text-white block">${p.name} Lab</span>
                  <span class="text-[8px] text-slate-400">World-First AI</span>
                </div>
                <div onclick="goScreen(28)" class="glass rounded-2xl p-2.5 cursor-pointer hover:border-[#00D4AA]/50">
                  <i class="fa-solid fa-shield-halved text-emerald-400 text-sm mb-1 block"></i>
                  <span class="font-bold text-white block">Shield & OCR</span>
                  <span class="text-[8px] text-slate-400">Warranty/AMC</span>
                </div>
              </div>

              <!-- Popular A-to-Z Categories -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-display font-bold text-white">${p.name} Specialists</span>
                  <button onclick="goScreen(5)" class="text-[10px] font-mono text-[#00D4AA]">View All A–Z →</button>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  ${p.cats.map(c => `
                    <div onclick="goScreen(5)" class="glass rounded-2xl p-2.5 flex items-center gap-2.5 cursor-pointer hover:border-white/25">
                      <div class="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center ${c.color}"><i class="fa-solid ${c.icon}"></i></div>
                      <div>
                        <div class="text-[11px] font-bold text-white leading-tight">${c.title}</div>
                        <div class="text-[9px] text-slate-400 font-mono">${c.sub}</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Predictive Alert Card -->
              <div onclick="goScreen(24)" class="glass rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between cursor-pointer">
                <div class="flex items-center gap-2.5">
                  <i class="fa-solid fa-triangle-exclamation text-amber-400"></i>
                  <div class="text-[10px]">
                    <div class="font-bold text-white">AI Prediction: Spindle Bearing Wear</div>
                    <div class="text-slate-400">Service in 18 days saves ~₹12,400 downtime</div>
                  </div>
                </div>
                <span class="text-[10px] font-mono text-amber-400 font-bold">Twin →</span>
              </div>
            </div>`;

        case 5:
          return `
            <div class="p-4 space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-display font-bold text-white">A–Z Specialist & Machine Catalogue</h3>
                <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-[#00D4AA]/15 text-[#00D4AA]">Guest Open</span>
              </div>
              <div class="flex gap-1 overflow-x-auto no-scrollbar text-[10px] font-mono">
                ${'ABCDEFGHIJKLM'.split('').map((l,i)=>`<span class="px-2 py-0.5 rounded ${i===2?'bg-[#00D4AA] text-slate-950 font-bold':'bg-white/5 text-slate-400'}">${l}</span>`).join('')}
              </div>
              <div class="space-y-2 text-xs">
                ${[
                  ['CNC 5-Axis Spindle & Servo Specialist', 'Fanuc • Siemens • 24 Verified Techs', '₹850+'],
                  ['Compressor (Rotary Screw & Reciprocating)', 'Atlas Copco • ELGi • 31 Verified Techs', '₹700+'],
                  ['Car EV High-Voltage BMS & Charger Tech', 'Tata • MG • Ola • 19 Verified Techs', '₹599+'],
                  ['Commercial Inverter AC PCB & Gas Specialist', 'Daikin • Mitsubishi • 42 Verified Techs', '₹399+']
                ].map(item => `
                  <div class="glass rounded-2xl p-3 space-y-2">
                    <div class="flex justify-between items-start">
                      <div>
                        <div class="font-bold text-white">${item[0]}</div>
                        <div class="text-[10px] text-slate-400 font-mono">${item[1]}</div>
                      </div>
                      <span class="text-[10px] font-mono text-[#00D4AA] font-bold">${item[2]}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <button onclick="goScreen(6)" class="py-1.5 rounded-lg bg-white/10 text-[10px] font-semibold">AI Diagnose Free</button>
                      <button onclick="requireServiceAuth(11, 'Book ' + '${item[0]}')" class="py-1.5 rounded-lg bg-[#00D4AA] text-slate-950 text-[10px] font-bold">Select Tech →</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>`;

        case 6:
          return `
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-display font-bold text-white">Multi-Input Fault Report (CORE-01)</h3>
              <div class="glass rounded-2xl p-3 space-y-2">
                <label class="text-[10px] font-mono text-slate-400">1. Select or Type Equipment / Vehicle / Device</label>
                <div class="p-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-white flex justify-between">
                  <span>Mazak CNC Lathe #1 (or Custom Asset)</span><i class="fa-solid fa-chevron-down text-slate-400"></i>
                </div>
              </div>
              <div class="glass rounded-2xl p-3 space-y-2">
                <div class="flex justify-between items-center">
                  <label class="text-[10px] font-mono text-slate-400">2. Voice or Text (9 Indian Languages)</label>
                  <span class="text-[9px] font-mono text-[#00D4AA]">🎙️ Tap Mic to Speak</span>
                </div>
                <textarea rows="2" class="w-full bg-slate-900 border border-white/10 rounded-xl p-2 text-xs text-white">High-pitched grinding noise above 3,000 RPM with spindle heat alarm AL-24.</textarea>
              </div>
              <div class="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                <div class="glass rounded-xl p-2 border border-[#00D4AA]/40 text-[#00D4AA]"><i class="fa-solid fa-microphone block mb-1"></i>Voice</div>
                <div class="glass rounded-xl p-2"><i class="fa-solid fa-camera block mb-1 text-blue-400"></i>Photos (2)</div>
                <div class="glass rounded-xl p-2"><i class="fa-solid fa-video block mb-1 text-purple-400"></i>Video</div>
                <div class="glass rounded-xl p-2 border border-amber-400/40 text-amber-300"><i class="fa-solid fa-wave-square block mb-1"></i>Sound FFT</div>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-mono text-slate-400">3. Urgency Level</label>
                <div class="grid grid-cols-4 gap-1.5 text-[10px] font-bold text-center">
                  <span class="py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300">🟢 Low</span>
                  <span class="py-1.5 rounded-lg bg-amber-500/15 text-amber-300">🟡 Today</span>
                  <span class="py-1.5 rounded-lg bg-rose-500/30 border border-rose-400 text-white">🔴 High</span>
                  <span onclick="requireServiceAuth(14,'60s Emergency Auction')" class="py-1.5 rounded-lg bg-red-600/25 text-red-300 cursor-pointer">⚡ SOS</span>
                </div>
              </div>
              <button onclick="goScreen(7)" class="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#2563EB] text-slate-950 font-display font-bold text-xs">
                Analyse Fault with Gemini AI →
              </button>
            </div>`;

        case 7:
          return `
            <div class="p-4 space-y-3">
              <div class="glass rounded-2xl p-3 border border-amber-500/40 space-y-2">
                <div class="flex justify-between items-center text-[10px] font-mono">
                  <span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">⚡ HIGH URGENCY</span>
                  <span class="text-[#00D4AA] font-bold">94% AI Confidence</span>
                </div>
                <div class="flex items-center justify-center gap-1 h-10">
                  ${[1,2,3,4,5,6,7,8,9].map(n=>`<div class="w-1.5 bg-amber-400 rounded-full eq-bar" style="animation-delay:${n*0.09}s"></div>`).join('')}
                </div>
                <h4 class="text-xs font-display font-bold text-white">Motor / Spindle Angular Bearing Failure</h4>
                <div class="flex justify-between text-[11px] font-mono bg-slate-900/90 p-2 rounded-xl">
                  <span class="text-slate-300">Est. Cost: <strong class="text-white">₹800 – ₹1,500</strong></span>
                  <span class="text-amber-300">⚠ Cut Mains Power</span>
                </div>
              </div>

              <!-- PAVAN'S WORLD-FIRST 3-PATH CHOICE (FEATURES.md v1.1) -->
              <div class="space-y-2">
                <div class="text-[10px] font-mono uppercase tracking-wider text-[#00D4AA] font-bold">Owner-Controlled 3-Path Resolution:</div>

                <div onclick="goScreen(8)" class="glass rounded-2xl p-3 border border-emerald-500/40 flex items-center justify-between cursor-pointer hover:bg-white/5">
                  <div>
                    <div class="text-xs font-bold text-white">🤖 1. Try AI DIY Copilot</div>
                    <div class="text-[10px] text-slate-300">"Guide me step-by-step to fix it myself"</div>
                  </div>
                  <span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">FREE</span>
                </div>

                <div onclick="requireServiceAuth(9, 'Book ₹199 Video Consultation')" class="glass rounded-2xl p-3 border border-cyan-500/40 flex items-center justify-between cursor-pointer hover:bg-white/5">
                  <div>
                    <div class="text-xs font-bold text-white">📹 2. Video Consultation</div>
                    <div class="text-[10px] text-slate-300">"Talk to a live L3 specialist right now"</div>
                  </div>
                  <span class="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">₹199</span>
                </div>

                <div onclick="requireServiceAuth(11, 'Match & Book On-Site Technician')" class="glass rounded-2xl p-3 border border-[#00D4AA] bg-[#00D4AA]/10 flex items-center justify-between cursor-pointer">
                  <div>
                    <div class="text-xs font-bold text-white">🔧 3. Book On-Site Technician</div>
                    <div class="text-[10px] text-slate-200">"Dispatch ranked specialist to my location"</div>
                  </div>
                  <span class="px-2.5 py-1 rounded-lg bg-[#00D4AA] text-slate-950 font-mono text-[10px] font-bold">₹800+</span>
                </div>

                <button onclick="requireServiceAuth(11, 'Direct Technician Booking')" class="w-full text-center text-[10px] font-mono text-slate-400 hover:text-white pt-1">
                  [Skip AI — I already know what I need →]
                </button>
              </div>
            </div>`;

        case 8:
          return `
            <div class="p-4 space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-[10px] font-mono text-emerald-400 font-bold">FREE OWNER DIY COPILOT • STEP 2 OF 5</span>
                <span class="text-[10px] font-mono text-amber-300">⚠ LOTO Safety</span>
              </div>
              <div class="glass rounded-2xl p-4 space-y-2.5 border border-emerald-500/30">
                <h4 class="text-sm font-display font-bold text-white">Check Spindle Drive Relay & Lubrication Line</h4>
                <p class="text-xs text-slate-300 leading-relaxed">1. Isolate 415V breaker.<br/>2. Inspect sight-glass oil flow mist.<br/>3. Clear clogged nozzle filter mesh & reset AL-24.</p>
                <div class="p-2 rounded-xl bg-slate-900 text-[10px] font-mono text-slate-300">Tools needed: 10mm Spanner, Multimeter</div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <button onclick="goScreen(4)" class="py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs">✓ Fixed! Saved ₹1,100</button>
                <button onclick="requireServiceAuth(11, 'Escalate from Copilot to Technician')" class="py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs">Still Stuck → Book Tech</button>
              </div>
            </div>`;

        case 9:
          return `
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-display font-bold text-white">Virtual Repair Consultation (VIRT-01)</h3>
              <div class="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div class="glass rounded-xl p-2.5"><div class="font-bold text-white">Quick</div><div class="text-sm font-mono text-[#00D4AA] font-bold">₹99</div><div class="text-slate-400">10 mins</div></div>
                <div class="glass rounded-xl p-2.5 border-2 border-[#00D4AA] bg-[#00D4AA]/10"><div class="font-bold text-white">Full ★</div><div class="text-sm font-mono text-[#00D4AA] font-bold">₹199</div><div class="text-slate-200">30 mins</div></div>
                <div class="glass rounded-xl p-2.5"><div class="font-bold text-white">Extended</div><div class="text-sm font-mono text-[#00D4AA] font-bold">₹299</div><div class="text-slate-400">60 mins</div></div>
              </div>
              <div class="glass rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <div class="text-xs font-bold text-white">Suresh K. • ⭐ 4.92 (L3 Master)</div>
                  <div class="text-[10px] text-emerald-400 font-mono">● Available Now • Speaks EN, KN, HI</div>
                </div>
                <button onclick="requireServiceAuth(10, 'Start Agora HD Video Call')" class="px-3 py-2 rounded-xl bg-[#00D4AA] text-slate-950 font-bold text-xs">Call Now →</button>
              </div>
              <p class="text-[10px] text-slate-400 font-mono text-center">If physical visit is needed, ₹199 is 100% deducted from visit bill!</p>
            </div>`;

        case 10:
          return `
            <div class="p-4 space-y-3">
              <div class="h-72 rounded-3xl bg-slate-900 border border-cyan-500/40 relative p-3 flex flex-col justify-between overflow-hidden">
                <div class="flex justify-between items-center z-10">
                  <span class="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono font-bold">● LIVE AGORA HD • 14:22</span>
                  <span class="text-[10px] font-mono text-cyan-300">60fps WebRTC</span>
                </div>
                <div class="mx-auto my-auto text-center">
                  <div class="w-16 h-16 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center mx-auto animate-pulse">
                    <i class="fa-solid fa-crosshairs text-amber-400"></i>
                  </div>
                  <span class="mt-2 inline-block px-2.5 py-1 rounded-lg bg-amber-500/90 text-slate-950 text-[10px] font-bold">AI Frame Alert: Bearing Housing Overheat (78°C)</span>
                </div>
                <div class="flex justify-around bg-slate-950/85 p-2 rounded-2xl border border-white/10">
                  <button class="w-9 h-9 rounded-full bg-white/10 text-xs"><i class="fa-solid fa-microphone"></i></button>
                  <button class="w-9 h-9 rounded-full bg-white/10 text-xs"><i class="fa-solid fa-pen"></i></button>
                  <button onclick="goScreen(11)" class="px-3 py-1.5 rounded-xl bg-[#00D4AA] text-slate-950 font-bold text-[10px]">Escalate Visit (-₹199)</button>
                  <button onclick="goScreen(4)" class="w-9 h-9 rounded-full bg-red-600 text-xs"><i class="fa-solid fa-phone-slash"></i></button>
                </div>
              </div>
            </div>`;

        case 11:
          return `
            <div class="p-4 space-y-3">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-sm font-display font-bold text-white">8 Verified Technicians Nearby</h3>
                  <span class="text-[9px] font-mono text-[#00D4AA]">Score = 60% Skill Match + 40% Distance</span>
                </div>
                <span class="px-2 py-1 rounded-lg bg-white/10 text-[10px] font-mono">🗺️ Map Toggle</span>
              </div>
              ${[
                ['Rajesh Murthy', '96%', '1.8 km · 8 mins', '4.9 ★ (142)', '₹950', true],
                ['karthik Gowda', '89%', '3.4 km · 14 mins', '4.8 ★ (98)', '₹850', false]
              ].map((t,idx)=>`
                <div class="glass rounded-2xl p-3.5 border ${t[5]?'border-[#00D4AA]':'border-white/10'} space-y-2">
                  <div class="flex justify-between items-center">
                    <div class="font-bold text-xs text-white flex items-center gap-1.5">${t[0]} <i class="fa-solid fa-circle-check text-[#00D4AA] text-[10px]"></i></div>
                    <span class="px-2 py-0.5 rounded-full bg-[#00D4AA]/20 text-[#00D4AA] font-mono text-[10px] font-bold">${t[1]} Match</span>
                  </div>
                  <div class="text-[10px] font-mono text-slate-300 flex justify-between">
                    <span>📍 ${t[2]}</span><span>${t[3]}</span><span class="text-white font-bold">${t[4]}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-2 pt-1">
                    <button onclick="goScreen(12)" class="py-1.5 rounded-xl bg-white/10 text-[10px] font-semibold">View Profile & NFT</button>
                    <button onclick="requireServiceAuth(13, 'Book ' + '${t[0]}')" class="py-1.5 rounded-xl bg-[#00D4AA] text-slate-950 text-[10px] font-bold">Book Now →</button>
                  </div>
                </div>
              `).join('')}
            </div>`;

        case 12:
          return `
            <div class="p-4 space-y-3">
              <div class="glass rounded-3xl p-4 text-center space-y-2">
                <div class="w-14 h-14 rounded-2xl bg-[#00D4AA]/20 text-[#00D4AA] font-display font-bold text-xl flex items-center justify-center mx-auto border border-[#00D4AA]/40">RM</div>
                <h3 class="text-sm font-display font-bold text-white">Rajesh Murthy • ⭐ 4.92</h3>
                <p class="text-[10px] font-mono text-emerald-400">✓ Aadhaar KYC · ✓ NCVT Diploma · ✓ Zero Fatigue</p>
              </div>
              <div class="glass rounded-2xl p-3 space-y-2">
                <div class="text-[10px] font-mono text-amber-300 font-bold">🏆 Polygon Blockchain NFT Badges (IND-U09)</div>
                <div class="grid grid-cols-2 gap-2 text-[10px]">
                  <div class="p-2 rounded-xl bg-amber-500/10 border border-amber-400/30"><strong>100+ Spindle Masters</strong><div class="text-[8px] font-mono text-slate-400">On-Chain Verified</div></div>
                  <div class="p-2 rounded-xl bg-purple-500/10 border border-purple-400/30"><strong>Zero-Rework Gold</strong><div class="text-[8px] font-mono text-slate-400">99.4% First-Fix</div></div>
                </div>
              </div>
              <button onclick="requireServiceAuth(13, 'Confirm Rajesh Murthy')" class="w-full py-3 rounded-xl bg-[#00D4AA] text-slate-950 font-display font-bold text-xs">Proceed to Price & Booking →</button>
            </div>`;

        case 13:
          return `
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-display font-bold text-white">Price Negotiation & Confirm (IND-U04)</h3>
              <div class="glass rounded-2xl p-3 space-y-2">
                <div class="flex justify-between text-xs"><span>AI Fair Band:</span><strong class="font-mono text-[#00D4AA]">₹850 – ₹1,150</strong></div>
                <div class="flex justify-between text-xs"><span>Your Offer:</span><strong class="font-mono text-white">₹950 (Accepted ✓)</strong></div>
              </div>
              <label class="glass rounded-2xl p-3 flex items-center justify-between cursor-pointer border border-emerald-500/30">
                <div class="text-xs">
                  <div class="font-bold text-white">🛡️ Per-Job Micro-Insurance (IND-U08)</div>
                  <div class="text-[10px] text-slate-400">Covers up to ₹25,000 accidental part damage</div>
                </div>
                <span class="font-mono text-xs text-[#00D4AA] font-bold">+₹49</span>
              </label>
              <button onclick="requireServiceAuth(15, 'Confirm Dispatch & Track Live')" class="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#10B981] text-slate-950 font-display font-bold text-xs">
                Confirm Booking & Start Live Radar →
              </button>
            </div>`;

        case 14:
          return `
            <div class="p-4 space-y-3 text-center">
              <div class="w-20 h-20 rounded-full border-4 border-red-500 flex flex-col items-center justify-center mx-auto animate-pulse">
                <span class="text-lg font-mono font-black text-red-400">00:44</span>
                <span class="text-[8px] font-mono text-slate-400">SOS LIVE</span>
              </div>
              <h3 class="text-sm font-display font-bold text-white">60s Emergency SOS Live Auction (CORE-12)</h3>
              <p class="text-[10px] text-slate-300">Broadcasted to 14 nearby specialists — fastest verified responder wins!</p>
              <div class="space-y-2 text-left">
                <div class="glass rounded-2xl p-3 border border-emerald-400 flex justify-between items-center">
                  <div><div class="text-xs font-bold text-white">Rajesh M. (⭐4.9)</div><div class="text-[10px] font-mono text-emerald-400">ETA 7 mins · ₹950</div></div>
                  <button onclick="goScreen(15)" class="px-3 py-1.5 rounded-xl bg-emerald-400 text-slate-950 font-bold text-[10px]">Accept Bid</button>
                </div>
              </div>
            </div>`;

        case 15:
          return `
            <div class="p-4 space-y-3">
              <div class="h-44 rounded-3xl bg-slate-900 border border-[#00D4AA]/40 relative flex items-center justify-center overflow-hidden">
                <div class="text-center">
                  <div class="text-xs font-mono text-[#00D4AA] font-bold">🛰️ LIVE GOOGLE MAPS + STOMP WEBSOCKET</div>
                  <div class="text-2xl font-display font-bold text-white mt-1">8 mins away (1.4 km)</div>
                  <div class="text-[10px] text-slate-400 font-mono">Updates every 5s • Speed 34 km/h</div>
                </div>
              </div>
              <div class="flex justify-between text-[9px] font-mono text-slate-400 px-1">
                <span class="text-[#00D4AA]">● Posted</span><span class="text-[#00D4AA]">● Matched</span><span class="text-amber-400 font-bold">● En Route</span><span>○ Arrived</span><span>○ Repair</span>
              </div>
              <div class="glass rounded-2xl p-3 flex items-center justify-between">
                <div><div class="text-xs font-bold text-white">Rajesh Murthy</div><div class="text-[10px] text-slate-400">Auto-translated Chat (EN ↔ KN)</div></div>
                <div class="flex gap-2">
                  <button onclick="goScreen(16)" class="px-3 py-2 rounded-xl bg-[#00D4AA] text-slate-950 font-bold text-[10px]">Show Arrival OTP →</button>
                </div>
              </div>
            </div>`;

        case 16:
          return `
            <div class="p-5 space-y-4 text-center">
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-mono font-bold">✓ PostGIS Check: Tech within 85m (&lt;500m)</span>
              <h3 class="text-base font-display font-bold text-white">Share 6-Digit Arrival OTP (CORE-05)</h3>
              <p class="text-[11px] text-slate-300">Show this face-to-face to Rajesh Murthy to unlock repair start:</p>
              <div class="grid grid-cols-6 gap-1.5 font-mono text-xl font-black text-[#00D4AA]">
                ${'482916'.split('').map(d=>`<div class="py-3 rounded-2xl bg-slate-900 border border-[#00D4AA]/50">${d}</div>`).join('')}
              </div>
              <p class="text-[10px] font-mono text-slate-400">Redis BCrypt Hashed • Single-Use • Expires in 09:18</p>
              <button onclick="goScreen(17)" class="w-full py-3 rounded-xl bg-[#00D4AA] text-slate-950 font-display font-bold text-xs">Simulate OTP Verified → In-Progress</button>
            </div>`;

        case 17:
          return `
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-display font-bold text-white">Live Repair Progress & Part Approval</h3>
              <div class="glass rounded-2xl p-3 space-y-2 text-xs">
                <div class="text-emerald-400">✓ Step 1: LOTO Power Isolation (Photo Verified)</div>
                <div class="text-emerald-400">✓ Step 2: Old SKF 7014C Bearing Extracted</div>
                <div class="text-amber-300 font-bold">● Step 3: Spindle Runout Calibration (&lt;0.003mm)</div>
              </div>
              <div class="glass rounded-2xl p-3 border border-amber-400/40 space-y-2">
                <div class="text-xs font-bold text-white">Approve Spare Part Addition?</div>
                <div class="text-[11px] text-slate-300">SKF High-Speed Angular Bearing • ₹350 (OEM)</div>
                <button onclick="goScreen(34)" class="w-full py-2 rounded-xl bg-[#00D4AA] text-slate-950 font-bold text-xs">Approve & Proceed to Escrow Pay →</button>
              </div>
            </div>`;

        case 18:
          return `
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-display font-bold text-white">Job History Ledger (CORE-08)</h3>
              <div class="flex gap-1.5 text-[10px] font-bold">
                <span class="px-2.5 py-1 rounded-lg bg-[#00D4AA] text-slate-950">All (14)</span>
                <span class="px-2.5 py-1 rounded-lg bg-white/5">Active (1)</span>
                <span class="px-2.5 py-1 rounded-lg bg-white/5">Completed (13)</span>
              </div>
              <div onclick="goScreen(19)" class="glass rounded-2xl p-3.5 space-y-1.5 cursor-pointer hover:border-[#00D4AA]/50">
                <div class="flex justify-between text-[10px] font-mono">
                  <span class="text-[#00D4AA]">UPT-2026-00234</span>
                  <span class="text-emerald-400 font-bold">✓ COMPLETED</span>
                </div>
                <div class="text-xs font-bold text-white">Spindle Bearing Repair — CNC Lathe #1</div>
                <div class="text-[10px] text-slate-400">Rajesh Murthy · ₹1,145 · ⭐ 5.0 · 🔒 SHA-256 Cert</div>
              </div>
            </div>`;

        case 19:
          return `
            <div class="p-4 space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-xs font-mono font-bold text-white">UPT-2026-00234</span>
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono">🔒 SHA-256 Tamper-Proof</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-center text-[10px]">
                <div class="glass rounded-xl p-3"><i class="fa-solid fa-image text-rose-400 mb-1 block"></i>Before Photo</div>
                <div class="glass rounded-xl p-3"><i class="fa-solid fa-circle-check text-emerald-400 mb-1 block"></i>After Proof</div>
              </div>
              <div class="glass rounded-2xl p-3 text-[11px] font-mono space-y-1">
                <div class="flex justify-between"><span>Labour:</span><span>₹700</span></div>
                <div class="flex justify-between"><span>SKF Bearing:</span><span>₹350</span></div>
                <div class="flex justify-between"><span>GST (18%):</span><span>₹95</span></div>
                <div class="flex justify-between font-bold text-[#00D4AA] pt-1 border-t border-white/10"><span>Total Paid:</span><span>₹1,145</span></div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <button class="py-2 rounded-xl bg-white/10 text-[10px] font-bold">📄 Download PDF Cert</button>
                <button onclick="goScreen(20)" class="py-2 rounded-xl bg-[#00D4AA] text-slate-950 text-[10px] font-bold">Rate Technician →</button>
              </div>
            </div>`;

        case 20:
          return `
            <div class="p-5 space-y-4 text-center">
              <h3 class="text-base font-display font-bold text-white">Rate Your Repair (CORE-07)</h3>
              <p class="text-xs text-slate-300">How was Rajesh Murthy’s service on CNC Lathe #1?</p>
              <div class="flex justify-center gap-2 text-2xl text-amber-400">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
              </div>
              <div class="flex flex-wrap justify-center gap-1.5 text-[10px]">
                <span class="px-2.5 py-1 rounded-full bg-[#00D4AA]/20 text-[#00D4AA]">Fast 8m Arrival</span>
                <span class="px-2.5 py-1 rounded-full bg-[#00D4AA]/20 text-[#00D4AA]">Expert Diagnosis</span>
                <span class="px-2.5 py-1 rounded-full bg-white/10">Clean Workspace</span>
              </div>
              <button onclick="goScreen(4)" class="w-full py-3 rounded-xl bg-[#00D4AA] text-slate-950 font-display font-bold text-xs">Submit Review →</button>
            </div>`;

        case 21:
          return `
            <div class="p-4 space-y-3">
              <div class="flex justify-between items-center">
                <h3 class="text-sm font-display font-bold text-white">My Assets Hub</h3>
                <button onclick="requireServiceAuth(22, 'Add New Asset')" class="px-2.5 py-1 rounded-lg bg-[#00D4AA] text-slate-950 text-[10px] font-bold">+ Add Asset</button>
              </div>
              <div class="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl text-[10px] font-bold text-center">
                <span class="py-1.5 rounded-lg bg-white/10 text-white">🏭 Machines (3)</span>
                <span class="py-1.5 text-slate-400">🚗 Vehicles (2)</span>
                <span class="py-1.5 text-slate-400">⚡ Devices (4)</span>
              </div>
              <div onclick="goScreen(23)" class="glass rounded-2xl p-3 flex justify-between items-center cursor-pointer">
                <div><div class="text-xs font-bold text-white">Mazak VMC-850 CNC</div><div class="text-[10px] text-slate-400 font-mono">SN: MZK-8821 · Next PM: 18d</div></div>
                <span class="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">94%</span>
              </div>
              <div onclick="goScreen(24)" class="glass rounded-2xl p-3 flex justify-between items-center cursor-pointer">
                <div><div class="text-xs font-bold text-white">Tata Nexon EV Max</div><div class="text-[10px] text-slate-400 font-mono">KA-02-MN-4821 · SOH 97%</div></div>
                <span class="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-mono text-xs font-bold">Twin →</span>
              </div>
            </div>`;

        case 22:
          return `
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-display font-bold text-white">Quick Add Asset (OCR / QR Scan)</h3>
              <div class="h-32 rounded-2xl border-2 border-dashed border-[#00D4AA]/50 bg-[#00D4AA]/5 flex flex-col items-center justify-center text-center p-3">
                <i class="fa-solid fa-qrcode text-2xl text-[#00D4AA] mb-1"></i>
                <span class="text-xs font-bold text-white">Scan Machine Nameplate / Vehicle RC / Serial Barcode</span>
                <span class="text-[9px] text-slate-400">Gemini Vision auto-fills Make, Model & Specs</span>
              </div>
              <input value="Thermax 2-Ton Steam Boiler" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white" />
              <button onclick="goScreen(21)" class="w-full py-3 rounded-xl bg-[#00D4AA] text-slate-950 font-display font-bold text-xs">Save Asset to Digital Twin →</button>
            </div>`;

        case 23:
          return `
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-display font-bold text-white">Mazak VMC-850 — Asset Ledger</h3>
              <div class="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div class="glass rounded-xl p-2"><div class="text-slate-400">Uptime</div><div class="text-sm text-emerald-400 font-bold">99.2%</div></div>
                <div class="glass rounded-xl p-2"><div class="text-slate-400">Jobs</div><div class="text-sm text-white font-bold">4</div></div>
                <div class="glass rounded-xl p-2"><div class="text-slate-400">Warranty</div><div class="text-sm text-cyan-400 font-bold">Active</div></div>
              </div>
              <button onclick="goScreen(24)" class="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs">Open Interactive Digital Twin →</button>
            </div>`;

        case 24:
          return `
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-display font-bold text-white">IoT Digital Twin & Prediction (IND-U03)</h3>
              <div class="glass rounded-3xl p-4 flex items-center justify-between border border-[#00D4AA]/30">
                <div>
                  <span class="text-[10px] font-mono text-slate-400">COMPOSITE HEALTH</span>
                  <div class="text-3xl font-display font-black text-[#00D4AA]">91%</div>
                  <span class="text-[10px] text-emerald-300">Preventive Saved: ₹12,400</span>
                </div>
                <div class="grid grid-cols-2 gap-1.5 text-[9px] font-mono">
                  <span class="px-2 py-1 rounded bg-emerald-500/15 text-emerald-300">Spindle 94%</span>
                  <span class="px-2 py-1 rounded bg-amber-500/20 text-amber-300">Bearing 72%</span>
                  <span class="px-2 py-1 rounded bg-emerald-500/15 text-emerald-300">Coolant 98%</span>
                  <span class="px-2 py-1 rounded bg-emerald-500/15 text-emerald-300">Servo 96%</span>
                </div>
              </div>
              <div class="glass rounded-2xl p-3 space-y-1.5">
                <div class="text-[10px] font-mono text-amber-300 font-bold">🔮 Upcoming Failure Prediction (IND-U05)</div>
                <div class="text-xs text-white">Spindle Bearing Wear · 78% prob in 18 days</div>
                <button onclick="requireServiceAuth(11, 'Schedule Preventive Bearing Service')" class="w-full mt-1 py-2 rounded-xl bg-[#00D4AA] text-slate-950 font-bold text-[11px]">Schedule Preventive Service →</button>
              </div>
            </div>`;

        case 25:
          return `
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-display font-bold text-white">🏭 Industrial Lab (World-First AI)</h3>
              <div class="glass rounded-2xl p-3 border-l-4 border-rose-500 space-y-1">
                <div class="text-xs font-bold text-white">🚨 Epidemic Batch Defect Alert (ELEC-U01)</div>
                <p class="text-[10px] text-slate-300">38 units of Contactor Batch #LC1D-26 reported coil burnout in Bengaluru this week. Free preventive swap advised.</p>
              </div>
              <div class="glass rounded-2xl p-3 border-l-4 border-amber-400 space-y-1">
                <div class="text-xs font-bold text-white">⚡ Silent Killer Monitor (ELEC-U02)</div>
                <p class="text-[10px] text-slate-300">Harmonic voltage drift (3.8%) detected on Compressor #2 — costing ₹1,900/mo extra power.</p>
              </div>
            </div>`;

        case 26:
          return `
            <div class="p-4 space-y-2.5">
              <h3 class="text-sm font-display font-bold text-white">🚗 Automobile Lab (World-First AI)</h3>
              <div class="glass rounded-2xl p-3 space-y-1">
                <div class="text-xs font-bold text-blue-300">📷 Dashboard Warning Light AI Reader (AUTO-C02)</div>
                <p class="text-[10px] text-slate-300">Snap dashboard cluster → instant plain-language severity & cost.</p>
              </div>
              <div class="glass rounded-2xl p-3 space-y-1">
                <div class="text-xs font-bold text-emerald-300">😊 Vehicle Mood Score: 92/100 Happy (AUTO-U02)</div>
                <p class="text-[10px] text-slate-300">Smooth braking, optimal battery SOH & timely oil service.</p>
              </div>
              <div class="glass rounded-2xl p-3 space-y-1">
                <div class="text-xs font-bold text-amber-300">🔍 Used-Car Pre-Purchase Scan (AUTO-U03)</div>
                <p class="text-[10px] text-slate-300">Book certified mechanic + AI engine sound fingerprint before buying.</p>
              </div>
            </div>`;

        case 27:
          return `
            <div class="p-4 space-y-2.5">
              <h3 class="text-sm font-display font-bold text-white">⚡ Electronics Lab (World-First AI)</h3>
              <div class="glass rounded-2xl p-3 border border-cyan-500/40 space-y-1">
                <div class="text-xs font-bold text-cyan-300">⚖️ Repair-vs-Replace AI Advisor (ELEC-C02)</div>
                <p class="text-[10px] text-slate-300">6-yr Split AC Compressor: Repair ₹4,200 vs New 5-Star ROI in 14 months → Verdict: <strong>Repair Recommended</strong>.</p>
              </div>
              <div class="glass rounded-2xl p-3 space-y-1">
                <div class="text-xs font-bold text-emerald-300">🔐 Privacy Data-Protection Mode (ELEC-C05)</div>
                <p class="text-[10px] text-slate-300">Cryptographic guest lock + technician NDA audit before laptop/phone repair.</p>
              </div>
              <div class="glass rounded-2xl p-3 space-y-1">
                <div class="text-xs font-bold text-amber-300">♻️ End-of-Life E-Waste Payout (ELEC-U05)</div>
                <p class="text-[10px] text-slate-300">Certified CPCB green pickup + ₹1,800 instant scrap value + Carbon Credit.</p>
              </div>
            </div>`;

        case 28:
          return `
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-display font-bold text-white">Uptime Shield: Insurance & AMC</h3>
              <div class="glass rounded-2xl p-3.5 border border-[#00D4AA]/40 space-y-2">
                <div class="flex justify-between text-xs font-bold"><span>MSME Plant & Device Shield Plus</span><span class="text-emerald-400">ACTIVE</span></div>
                <div class="text-[10px] font-mono text-slate-300">Coverage: ₹2,50,000 · Valid till 31/12/2026</div>
                <div class="grid grid-cols-2 gap-2">
                  <button onclick="requireServiceAuth(30, 'File Insurance Claim')" class="py-1.5 rounded-lg bg-[#00D4AA] text-slate-950 font-bold text-[10px]">File Claim →</button>
                  <button onclick="goScreen(29)" class="py-1.5 rounded-lg bg-white/10 text-[10px] font-bold">Warranty OCR Vault</button>
                </div>
              </div>
            </div>`;

        case 29:
          return `
            <div class="p-4 space-y-3">
              <div class="flex justify-between items-center">
                <h3 class="text-sm font-display font-bold text-white">OCR Warranty Vault (ELEC-C07)</h3>
                <button class="px-2.5 py-1 rounded-lg bg-[#00D4AA] text-slate-950 text-[10px] font-bold">📷 Scan Bill</button>
              </div>
              <div class="glass rounded-2xl p-3 space-y-1 border-l-4 border-amber-400">
                <div class="text-xs font-bold text-white">Daikin 1.5T Inverter AC Compressor</div>
                <div class="text-[10px] font-mono text-amber-300">⚠ Expires in 19 days — Claim free service now!</div>
              </div>
              <div class="glass rounded-2xl p-3 space-y-1 border-l-4 border-emerald-400">
                <div class="text-xs font-bold text-white">UPT-2026-00234 Per-Job Repair Warranty</div>
                <div class="text-[10px] font-mono text-emerald-300">✓ 28 days remaining (Free re-dispatch)</div>
              </div>
            </div>`;

        case 30:
          return `
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-display font-bold text-white">AI Insurance Claim Tracker</h3>
              <div class="glass rounded-2xl p-3.5 space-y-2 text-xs">
                <div class="text-emerald-400">✓ 1. Incident & FIR/Photos Uploaded</div>
                <div class="text-emerald-400">✓ 2. Tamper-Proof Repair Hash Linked</div>
                <div class="text-[#00D4AA] font-bold">● 3. Gemini Damage Assessment Approved (₹14,200)</div>
                <div class="text-slate-400">○ 4. Instant RazorpayX Payout to Bank</div>
              </div>
            </div>`;

        case 31:
          return `
            <div class="p-4 space-y-3">
              <div class="flex justify-between items-center">
                <h3 class="text-sm font-display font-bold text-white">Spare Parts & Tools Marketplace</h3>
                <button onclick="goScreen(32)" class="text-[10px] font-mono text-[#00D4AA]">Refurbished →</button>
              </div>
              ${[
                ['SKF 7014C High-Speed Spindle Bearing', 'OEM Certified · Fits Mazak/Haas', '₹1,450'],
                ['Schneider LC1D25 3-Pole Contactor', 'OEM · 24-hr Express Delivery', '₹890']
              ].map(p=>`
                <div class="glass rounded-2xl p-3 flex justify-between items-center">
                  <div><div class="text-xs font-bold text-white">${p[0]}</div><div class="text-[10px] text-slate-400 font-mono">${p[1]}</div></div>
                  <button onclick="goScreen(33)" class="px-2.5 py-1.5 rounded-xl bg-[#00D4AA] text-slate-950 font-bold text-[10px]">${p[2]} +</button>
                </div>
              `).join('')}
              <div class="glass rounded-2xl p-3 text-center text-[11px] text-slate-300">
                Can't find a rare part? <span class="text-[#00D4AA] font-bold underline cursor-pointer">Broadcast Custom Part Request</span>
              </div>
            </div>`;

        case 32:
          return `
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-display font-bold text-white">Certified Refurbished Store (ELEC-C10)</h3>
              <div class="glass rounded-2xl p-3.5 space-y-1.5">
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">GRADE A+ · 32-POINT TECH VERIFIED</span>
                <div class="text-xs font-bold text-white">ABB 5HP 3-Phase Induction Motor (Rewound & Tested)</div>
                <div class="flex justify-between items-center pt-1">
                  <span class="font-mono text-xs text-[#00D4AA] font-bold">₹6,400 <s class="text-slate-500 text-[10px]">₹13,500</s></span>
                  <button onclick="goScreen(33)" class="px-3 py-1.5 rounded-xl bg-[#00D4AA] text-slate-950 font-bold text-[10px]">Add to Cart</button>
                </div>
              </div>
            </div>`;

        case 33:
          return `
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-display font-bold text-white">Spare Parts Cart (2 Items)</h3>
              <div class="glass rounded-2xl p-3 space-y-2 text-xs font-mono">
                <div class="flex justify-between"><span>1x SKF 7014C Bearing</span><span>₹1,450</span></div>
                <div class="flex justify-between"><span>1x Schneider LC1D25</span><span>₹890</span></div>
                <div class="flex justify-between text-emerald-400 border-t border-white/10 pt-1"><span>Total (incl. GST Input):</span><strong>₹2,340</strong></div>
              </div>
              <button onclick="requireServiceAuth(34, 'Checkout Spare Parts Order')" class="w-full py-3 rounded-xl bg-[#00D4AA] text-slate-950 font-display font-bold text-xs">Proceed to Razorpay Checkout →</button>
            </div>`;

        case 34:
          return `
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-display font-bold text-white">Razorpay Escrow Checkout (PLT-01)</h3>
              <div class="glass rounded-2xl p-3 space-y-1.5 text-xs">
                <div class="p-2 rounded-xl bg-[#00D4AA]/15 border border-[#00D4AA] flex justify-between"><span>⚡ UPI (PhonePe / GPay / BHIM)</span><span class="font-mono text-[#00D4AA]">Instant</span></div>
                <div class="p-2 rounded-xl bg-white/5 flex justify-between"><span>💳 Corporate Card / NetBanking</span><span>GST Invoice</span></div>
                <div class="p-2 rounded-xl bg-white/5 flex justify-between"><span>👛 Uptime Wallet Balance</span><span>₹4,250</span></div>
              </div>
              <button onclick="goScreen(19)" class="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#10B981] text-slate-950 font-display font-bold text-xs">Pay Securely into Escrow →</button>
            </div>`;

        case 35:
          return `
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-display font-bold text-white">Wallet, Pro Plans & CO₂ Credits</h3>
              <div class="grid grid-cols-2 gap-2">
                <div class="glass rounded-2xl p-3"><div class="text-[10px] text-slate-400">Wallet Balance</div><div class="text-lg font-mono font-bold text-white">₹4,250</div></div>
                <div class="glass rounded-2xl p-3 border border-emerald-500/30"><div class="text-[10px] text-emerald-300">🌱 CO₂ Saved (PLT-06)</div><div class="text-lg font-mono font-bold text-emerald-400">142 kg</div></div>
              </div>
              <div class="glass rounded-2xl p-3 border border-purple-500/40 space-y-1">
                <div class="text-xs font-bold text-white">👑 UPTIME MSME Pro Shield — ₹999/mo</div>
                <p class="text-[10px] text-slate-300">0% platform fee, 15-min priority SOS & unlimited ₹199 Video Consults.</p>
              </div>
            </div>`;

        case 36:
          return `
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-display font-bold text-white">Crowdsourced Repair Wiki (IND-U10)</h3>
              <input placeholder="Search Fanuc AL-24, Daikin E4, OBD P0300..." class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white" />
              <div class="glass rounded-2xl p-3 space-y-1">
                <div class="text-xs font-bold text-[#00D4AA]">Fanuc Spindle Alarm AL-24 — Root Causes</div>
                <p class="text-[10px] text-slate-300">Verified by 48 Master Technicians · Avg repair cost ₹900–₹1,400.</p>
              </div>
              <div class="glass rounded-2xl p-3 space-y-1">
                <div class="text-xs font-bold text-cyan-300">Inverter AC Error Code U0 / E4 Refrigerant Check</div>
                <p class="text-[10px] text-slate-300">3-minute DIY filter & outdoor coil check before booking.</p>
              </div>
            </div>`;

        case 37:
          return `
            <div class="p-4 space-y-3 flex flex-col h-full justify-between">
              <div class="space-y-2.5">
                <h3 class="text-sm font-display font-bold text-white">🤖 Gemini 9-Language Assistant (PLT-04)</h3>
                <div class="p-3 rounded-2xl bg-white/5 text-xs text-slate-200">Namaskara! Speak or type in Kannada, Hindi, Tamil, Telugu or English. Describe any machine, car or appliance issue!</div>
                <div class="p-3 rounded-2xl bg-[#00D4AA]/20 text-xs text-white ml-8">"ನನ್ನ CNC ಲೇಥ್ ಮೋಟಾರ್ ಬಿಸಿಯಾಗುತ್ತಿದೆ" (My CNC lathe motor is overheating)</div>
                <div class="p-3 rounded-2xl bg-white/5 text-xs text-slate-200">I detected a spindle cooling/bearing issue. Est. ₹850–₹1,200. Would you like Free DIY steps or an 8-min Peenya specialist?</div>
              </div>
              <div class="flex gap-2 pb-2">
                <input placeholder="Ask Gemini Repair Bot..." class="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white" />
                <button class="px-3 py-2 rounded-xl bg-[#00D4AA] text-slate-950 font-bold text-xs"><i class="fa-solid fa-paper-plane"></i></button>
              </div>
            </div>`;

        case 38:
          return `
            <div class="p-4 space-y-3">
              <div class="glass rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <div class="text-xs font-bold text-white">${isAuthenticated ? ownerName : 'Guest User (Not Signed In)'}</div>
                  <div class="text-[10px] font-mono text-slate-400">${isAuthenticated ? '+91 98450 67890 • GST Verified' : 'Tap Login to sync jobs & warranties'}</div>
                </div>
                <button onclick="toggleAuthState()" class="px-3 py-1.5 rounded-xl bg-[#00D4AA] text-slate-950 font-bold text-[10px]">${isAuthenticated ? 'Sign Out' : 'Login'}</button>
              </div>
              <div class="glass rounded-2xl p-3 space-y-2 text-xs">
                <div class="font-bold text-white">🔔 Recent Smart Notifications</div>
                <div class="text-[10px] text-slate-300">• Rajesh M. is 8 mins away for CNC Lathe #1</div>
                <div class="text-[10px] text-amber-300">• Daikin AC Warranty expires in 19 days</div>
              </div>
              <div class="glass rounded-2xl p-3 space-y-2 text-xs">
                <div class="flex justify-between"><span>📍 Saved Sites</span><span class="text-[#00D4AA] font-mono">Peenya Plant · Home</span></div>
                <div class="flex justify-between"><span>🌐 Language (9 Supported)</span><span class="font-mono">${languages[langIdx]}</span></div>
                <div class="flex justify-between"><span>📶 Offline Hive Sync</span><span class="text-emerald-400 font-mono">Ready</span></div>
              </div>
            </div>`;
      }
      return '';
    }

    // =========================================================================
    // NAVIGATION, WORKFLOW AUTH GATE & GRID RENDERING
    // =========================================================================
    function buildTopBars() {
      const modBar = document.getElementById('moduleFilterBar');
      modBar.innerHTML = GROUPS.map(g => `
        <button onclick="selectGroup('${g}')" class="px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${selectedGroup===g ? 'bg-[#00D4AA] text-slate-950 font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'}">${g}</button>
      `).join('');

      const jumpBar = document.getElementById('screenJumpBar');
      const list = selectedGroup === 'All 38' ? SCREENS : SCREENS.filter(s => s.group === selectedGroup);
      jumpBar.innerHTML = list.map(s => `
        <button onclick="goScreen(${s.id})" class="px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${currentScreen===s.id ? 'bg-blue-600 text-white font-bold border border-[#00D4AA]' : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'}">
          S${String(s.id).padStart(2,'0')} · ${s.short}
        </button>
      `).join('');
    }

    function selectGroup(g) {
      selectedGroup = g;
      const list = g === 'All 38' ? SCREENS : SCREENS.filter(s => s.group === g);
      if (list.length && displayMode === 'phone') {
        currentScreen = list[0].id;
      }
      updateUI();
      if (displayMode === 'grid') renderAllScreensGrid();
    }

    function goScreen(id) {
      currentScreen = id;
      if (displayMode === 'grid') setDisplayMode('phone');
      updateUI();
    }

    function prevScreen() {
      currentScreen = currentScreen > 1 ? currentScreen - 1 : 38;
      updateUI();
    }

    function nextScreen() {
      currentScreen = currentScreen < 38 ? currentScreen + 1 : 1;
      updateUI();
    }

    function switchPortal(portalKey) {
      currentPortal = portalKey;
      const p = portalThemes[portalKey];
      document.getElementById('ambientTop').className = `absolute -top-24 -left-20 w-72 h-72 rounded-full blur-[95px] opacity-30 ${p.glow1} pointer-events-none transition-all duration-500`;
      const sosFab = document.getElementById('autoSosFab');
      if (portalKey === 'automobile' && currentScreen === 4) {
        sosFab.classList.remove('hidden');
        sosFab.classList.add('flex');
      } else {
        sosFab.classList.add('hidden');
        sosFab.classList.remove('flex');
      }
      updateUI();
    }

    function cycleLanguage() {
      langIdx = (langIdx + 1) % languages.length;
      document.getElementById('langCode').textContent = languages[langIdx];
      updateUI();
    }

    // CORE WORKFLOW GATE: Guest can browse everything; Login ONLY when taking a service!
    function requireServiceAuth(targetScreenId, actionDescription) {
      if (isAuthenticated) {
        goScreen(targetScreenId);
      } else {
        pendingScreenAfterAuth = targetScreenId;
        document.getElementById('pendingActionLabel').textContent = 'Action: ' + actionDescription;
        document.getElementById('serviceAuthOverlay').classList.remove('hidden');
      }
    }

    function closeAuthOverlay() {
      document.getElementById('serviceAuthOverlay').classList.add('hidden');
      pendingScreenAfterAuth = null;
    }

    function confirmServiceLogin() {
      isAuthenticated = true;
      const val = document.getElementById('modalOwnerName').value.trim();
      if (val) ownerName = val.split('•')[0].trim();
      document.getElementById('serviceAuthOverlay').classList.add('hidden');
      syncAuthUI();
      if (pendingScreenAfterAuth) {
        const dest = pendingScreenAfterAuth;
        pendingScreenAfterAuth = null;
        goScreen(dest);
      } else {
        updateUI();
      }
    }

    function toggleAuthState() {
      if (isAuthenticated) {
        isAuthenticated = false;
        ownerName = 'Guest Explorer';
        syncAuthUI();
        updateUI();
      } else {
        requireServiceAuth(currentScreen, 'Sign In to Owner Account');
      }
    }

    function syncAuthUI() {
      const dot = document.getElementById('guestDot');
      const lbl = document.getElementById('guestLabel');
      const btn = document.getElementById('guestToggleBtn');
      const badge = document.getElementById('guestBadge');
      if (isAuthenticated) {
        dot.className = 'w-2 h-2 rounded-full bg-emerald-400';
        lbl.textContent = 'Logged In: ' + ownerName;
        lbl.className = 'text-emerald-300 font-bold';
        badge.className = 'px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono flex items-center gap-2';
        btn.textContent = 'Logout';
      } else {
        dot.className = 'w-2 h-2 rounded-full bg-amber-400 animate-pulse';
        lbl.textContent = 'Guest Mode (Free Browse)';
        lbl.className = 'text-amber-300 font-bold';
        badge.className = 'px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono flex items-center gap-2';
        btn.textContent = 'Login';
      }
    }

    function setDisplayMode(mode) {
      displayMode = mode;
      const phoneBox = document.getElementById('phoneModeContainer');
      const gridBox = document.getElementById('gridModeContainer');
      const bPhone = document.getElementById('modePhoneBtn');
      const bGrid = document.getElementById('modeGridBtn');
      if (mode === 'grid') {
        phoneBox.classList.add('hidden');
        gridBox.classList.remove('hidden');
        bGrid.className = 'px-3 py-1.5 rounded-lg bg-[#00D4AA] text-slate-950 font-bold flex items-center gap-1.5 transition-all';
        bPhone.className = 'px-3 py-1.5 rounded-lg text-slate-300 hover:text-white flex items-center gap-1.5 transition-all';
        renderAllScreensGrid();
      } else {
        gridBox.classList.add('hidden');
        phoneBox.classList.remove('hidden');
        bPhone.className = 'px-3 py-1.5 rounded-lg bg-[#00D4AA] text-slate-950 font-bold flex items-center gap-1.5 transition-all';
        bGrid.className = 'px-3 py-1.5 rounded-lg text-slate-300 hover:text-white flex items-center gap-1.5 transition-all';
        updateUI();
      }
    }

    function renderAllScreensGrid() {
      const mount = document.getElementById('allScreensGridMount');
      const activeGroups = selectedGroup === 'All 38' ? GROUPS.slice(1) : [selectedGroup];
      mount.innerHTML = activeGroups.map(grp => {
        const items = SCREENS.filter(s => s.group === grp);
        return `
          <div class="space-y-3">
            <div class="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 class="text-sm font-display font-bold text-[#00D4AA] uppercase tracking-wider">${grp} (${items.length} Screens)</h3>
              <span class="text-[10px] font-mono text-slate-400">Click any artboard to open interactively</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              ${items.map(s => `
                <div onclick="goScreen(${s.id})" class="rounded-[28px] bg-[#070C18] border-2 ${currentScreen===s.id?'border-[#00D4AA]':'border-white/10 hover:border-[#00D4AA]/60'} overflow-hidden flex flex-col cursor-pointer transition-all shadow-xl">
                  <div class="px-3.5 py-2 bg-slate-950 border-b border-white/10 flex items-center justify-between">
                    <span class="text-[10px] font-mono font-bold text-[#00D4AA]">S${String(s.id).padStart(2,'0')}</span>
                    <span class="text-[11px] font-bold text-white truncate max-w-[180px]">${s.short}</span>
                    <i class="fa-solid fa-up-right-from-square text-[10px] text-slate-400"></i>
                  </div>
                  <div class="flex-1 max-h-[420px] overflow-y-auto no-scrollbar pointer-events-none">
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

      // Hide top/bottom bars on pure Splash Screen (S01)
      const topBar = document.getElementById('appTopHeader');
      const botNav = document.getElementById('appBottomNav');
      if (currentScreen === 1) {
        topBar.classList.add('hidden');
        botNav.classList.add('hidden');
      } else {
        topBar.classList.remove('hidden');
        botNav.classList.remove('hidden');
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

      // Highlight active bottom nav
      const navMap = { home: [4,5,6,7,8,9,10,11,12,13,14,25,26,27], jobs: [15,16,17,18,19,20], assets: [21,22,23,24], market: [28,29,30,31,32,33], profile: [2,3,34,35,36,37,38] };
      Object.keys(navMap).forEach(k => {
        const el = document.getElementById('bnav-' + k);
        if (el) {
          el.className = navMap[k].includes(currentScreen)
            ? 'flex flex-col items-center gap-0.5 text-[#00D4AA]'
            : 'flex flex-col items-center gap-0.5 text-slate-400 hover:text-white relative';
        }
      });

      // Inspector details
      document.getElementById('inspectorBadge').textContent = `SCREEN ${String(meta.id).padStart(2,'0')} / 38`;
      document.getElementById('inspectorModule').textContent = meta.group;
      document.getElementById('inspectorTitle').textContent = meta.title;
      document.getElementById('inspectorDesc').textContent = meta.desc;
    }

    // Boot on Screen 01 (Splash Screen -> Guest Home!)
    syncAuthUI();
    updateUI();
  </script>
</body>
</html>
"""

with open("F:/uptime/design-system/index.html", "w", encoding="utf-8") as f:
    f.write(html_code)

with open("F:/uptime/design-system/dist/index.html", "w", encoding="utf-8") as f:
    f.write(html_code)

print(f"Successfully generated ALL 38 Dedicated Owner App Screens ({len(html_code)} bytes)")
