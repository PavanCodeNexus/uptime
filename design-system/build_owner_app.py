import os

owner_app_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UPTIME — Owner App (User Experience & Workflow)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --font-display: 'Cabinet Grotesk', -apple-system, sans-serif;
      --font-body: 'Plus Jakarta Sans', -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --font-tech: 'Space Grotesk', sans-serif;
    }
    body {
      font-family: var(--font-body);
      background: #030712;
      color: #f8fafc;
    }
    .font-display { font-family: var(--font-display); }
    .font-mono { font-family: var(--font-mono); }
    .font-tech { font-family: var(--font-tech); }

    .glass-panel {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.12);
    }

    .ambient-glow {
      position: absolute;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      filter: blur(110px);
      opacity: 0.28;
      pointer-events: none;
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes radar-pulse {
      0% { transform: scale(0.85); opacity: 0.8; }
      50% { transform: scale(1.35); opacity: 0.2; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    .radar-ring {
      animation: radar-pulse 2.2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    }

    @keyframes eq-scale {
      0%, 100% { height: 8px; }
      25% { height: 42px; }
      50% { height: 20px; }
      75% { height: 50px; }
    }
    .eq-bar {
      animation: eq-scale 1.1s ease-in-out infinite alternate;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
    .shimmer-effect::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
      animation: shimmer 3s infinite;
    }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-start p-2 sm:p-5 select-none bg-[#020617]">

  <!-- TOP WORKFLOW BAR & SCREEN JUMP BAR -->
  <header class="w-full max-w-5xl mb-4 p-3 glass-panel rounded-2xl border border-white/10 z-40 space-y-2.5">
    <div class="flex flex-col md:flex-row items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-display font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.5)]">
          U
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-sm font-display font-black tracking-tight text-white">UPTIME: OWNER APP</h1>
            <span class="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">Dedicated User App Flow</span>
          </div>
          <p class="text-[11px] text-slate-400 font-mono">Downtime ends here • Browse Freely $\rightarrow$ Login When Booking Services</p>
        </div>
      </div>

      <!-- User Auth State Badge -->
      <div class="flex items-center gap-2">
        <div id="authStatusPill" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
          <span class="w-2 h-2 rounded-full bg-slate-500" id="authDot"></span>
          <span id="authStatusText">Guest Mode (Browse)</span>
        </div>
        <button onclick="toggleGuestLogin()" id="authActionBtn" class="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
          Login / Signup
        </button>
      </div>
    </div>

    <!-- OWNER JOURNEY SCREEN SELECTOR TABS -->
    <div class="flex items-center gap-1 overflow-x-auto no-scrollbar text-[10px] font-mono">
      <button onclick="showScreen('splash')" id="tab-splash" class="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">1. Splash</button>
      <button onclick="showScreen('home')" id="tab-home" class="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold whitespace-nowrap">2. 3-Portal Home</button>
      <button onclick="showScreen('catalog')" id="tab-catalog" class="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">3. A-Z Catalogue</button>
      <button onclick="showScreen('triage')" id="tab-triage" class="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">4. Gemini Sound AI</button>
      <button onclick="showScreen('video')" id="tab-video" class="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">5. Agora Video</button>
      <button onclick="showScreen('dispatch')" id="tab-dispatch" class="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">6. Smart Dispatch</button>
      <button onclick="showScreen('radar')" id="tab-radar" class="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">7. Live Radar & OTP</button>
      <button onclick="showScreen('payment')" id="tab-payment" class="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">8. Razorpay Escrow</button>
      <button onclick="showScreen('warranty')" id="tab-warranty" class="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">9. 30-Day Warranty</button>
    </div>
  </header>

  <!-- SCREEN VIEWPORT CHASSIS (CYBER-INDUSTRIAL PHONE) -->
  <main class="w-full max-w-[420px] h-[890px] bg-[#070B12] rounded-[48px] border-[10px] border-[#161F2E] shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] relative overflow-hidden flex flex-col transition-colors duration-500">
    
    <!-- Ambient Dynamic Glow Spotlights -->
    <div id="glowPrimary" class="ambient-glow -top-20 -left-20 bg-amber-500"></div>
    <div id="glowSecondary" class="ambient-glow top-1/2 -right-24 bg-orange-600"></div>

    <!-- Top Hardware Status Bar -->
    <div class="h-12 px-7 flex items-center justify-between text-xs text-slate-400 font-medium z-30 shrink-0">
      <span class="font-mono text-[11px] font-bold text-slate-300">09:41</span>
      <div class="w-24 h-4 bg-slate-950/80 rounded-full border border-white/5 flex items-center justify-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        <span class="text-[9px] font-mono text-slate-400">UPTIME OS</span>
      </div>
      <div class="flex items-center gap-2 text-slate-400">
        <i class="fa-solid fa-wifi text-[10px]"></i>
        <i class="fa-solid fa-bolt text-[10px] text-amber-400"></i>
        <span class="font-mono text-[10px] text-emerald-400">100%</span>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 1. SPLASH SCREEN (FIRST SCREEN) -->
    <!-- ======================================================== -->
    <div id="view-splash" class="hidden flex-1 flex flex-col p-6 z-20 justify-between items-center text-center">
      <div class="my-auto space-y-4">
        <!-- Glowing Logo Monogram -->
        <div class="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div class="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-display font-black text-5xl shadow-[0_0_50px_rgba(245,158,11,0.6)]">
            U
          </div>
          <span class="absolute -inset-2 rounded-3xl border border-amber-400/30 radar-ring pointer-events-none"></span>
        </div>

        <div>
          <h1 class="text-3xl font-display font-black tracking-tight text-white">UPTIME</h1>
          <p class="text-xs font-mono font-black text-amber-400 uppercase tracking-widest mt-1">Downtime Ends Here</p>
          <p class="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
            Zero-downtime emergency triage & certified master technician network for industrial machines, vehicles & appliances.
          </p>
        </div>
      </div>

      <!-- Tap to Enter the App -->
      <div class="w-full space-y-3 pb-6">
        <button onclick="showScreen('home')" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-display font-black text-xs shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all">
          <span>Explore Uptime Catalogues</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
        <span class="text-[9px] font-mono text-slate-500 block">No login required to browse machines & services</span>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 2. OWNER HOME & 3-PORTAL COMMAND CENTER (BROWSE MODE) -->
    <!-- ======================================================== -->
    <div id="view-home" class="flex-1 flex flex-col overflow-hidden z-20">
      <!-- Location Telemetry Bar -->
      <div class="px-5 py-1.5 flex items-center justify-between text-xs border-b border-white/[0.06] bg-slate-950/40 backdrop-blur-md z-20 shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="relative flex items-center justify-center">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span class="absolute w-5 h-5 rounded-full bg-amber-400/30 radar-ring"></span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-mono text-[9px] uppercase tracking-wider text-slate-400">Coverage</span>
              <span class="text-[8px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">Active</span>
            </div>
            <div class="font-semibold text-slate-200 text-[11px] flex items-center gap-1">
              <span>Peenya Industrial Area, Phase II</span>
              <i class="fa-solid fa-chevron-down text-[8px] text-slate-500"></i>
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-mono text-[11px] font-bold text-amber-400">14 min</div>
          <div class="text-[9px] text-slate-400">Fastest Dispatch</div>
        </div>
      </div>

      <!-- AJIO-STYLE 3-PORTAL SEGMENT SWITCHER -->
      <div class="p-3 z-20 shrink-0">
        <div class="relative p-1 bg-slate-950/90 rounded-2xl border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] grid grid-cols-3 gap-1">
          <!-- Industries -->
          <button onclick="setPortal('industries')" id="tabBtn-industries"
                  class="relative py-2.5 px-1 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1 bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.4)]">
            <div class="flex items-center gap-1.5">
              <i class="fa-solid fa-industry text-xs"></i>
              <span class="font-display tracking-tight text-[11px]">Industries</span>
            </div>
            <span class="text-[8px] font-mono uppercase tracking-widest font-black opacity-80">1,151 Techs</span>
          </button>

          <!-- Automobile -->
          <button onclick="setPortal('automobile')" id="tabBtn-automobile"
                  class="relative py-2.5 px-1 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200">
            <div class="flex items-center gap-1.5">
              <i class="fa-solid fa-car-rear text-xs"></i>
              <span class="font-display tracking-tight text-[11px]">Automobile</span>
            </div>
            <span class="text-[8px] font-mono uppercase tracking-widest opacity-60">24/7 SOS</span>
          </button>

          <!-- Electronics -->
          <button onclick="setPortal('electronics')" id="tabBtn-electronics"
                  class="relative py-2.5 px-1 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200">
            <div class="flex items-center gap-1.5">
              <i class="fa-solid fa-bolt-lightning text-xs"></i>
              <span class="font-display tracking-tight text-[11px]">Electronics</span>
            </div>
            <span class="text-[8px] font-mono uppercase tracking-widest opacity-60">Appliances</span>
          </button>
        </div>
      </div>

      <!-- MAIN SCROLLABLE DASHBOARD -->
      <div class="flex-1 overflow-y-auto px-4 pb-20 space-y-4 z-10 no-scrollbar">
        <!-- SEARCH BAR -->
        <div class="space-y-2">
          <div class="relative glass-panel rounded-2xl p-1 flex items-center border border-white/10 shadow-lg">
            <div class="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 ml-1">
              <i class="fa-solid fa-magnifying-glass text-xs" id="searchIcon"></i>
            </div>
            <input type="text" id="masterSearch" placeholder="Search CNC lathe, boiler, hydraulic press..." oninput="handleSearch(this.value)"
                   class="w-full bg-transparent px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-medium">
            <button onclick="showScreen('triage')" class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mr-1 hover:bg-amber-500/30">
              <i class="fa-solid fa-waveform-lines text-xs"></i>
            </button>
          </div>
          <div id="searchResults" class="hidden glass-panel rounded-2xl p-2 space-y-1 text-xs border border-amber-500/30 shadow-2xl"></div>

          <!-- Quick Filter Chips -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10px]" id="filterChips">
            <span onclick="filterMachine('CNC')" class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 whitespace-nowrap cursor-pointer hover:border-amber-400/50">⚡ CNC Spindles</span>
            <span onclick="filterMachine('Boiler')" class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 whitespace-nowrap cursor-pointer hover:border-amber-400/50">🔥 IBR Steam Boilers</span>
            <span onclick="filterMachine('Hydraulic')" class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 whitespace-nowrap cursor-pointer hover:border-amber-400/50">💧 Hydraulic Valves</span>
            <span onclick="filterMachine('Chiller')" class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 whitespace-nowrap cursor-pointer hover:border-amber-400/50">❄️ Chillers</span>
          </div>
        </div>

        <!-- BREAKDOWN COMMAND CENTER (TACTILE HUD) -->
        <div class="glass-panel rounded-3xl p-4 relative overflow-hidden shimmer-effect border border-amber-500/30" id="heroCard">
          <div class="absolute -right-6 -bottom-6 opacity-10 text-amber-400 text-9xl pointer-events-none">
            <i class="fa-solid fa-triangle-exclamation" id="heroBgIcon"></i>
          </div>

          <div class="relative z-10 space-y-2.5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span class="text-[9px] font-mono font-black uppercase tracking-widest text-amber-400" id="heroBadge">Emergency Breakdown Center</span>
              </div>
              <span class="text-[9px] font-mono text-slate-400">Guaranteed Response &lt; 30m</span>
            </div>

            <div>
              <h2 class="text-base font-display font-black text-white leading-tight" id="heroTitle">Machine Stalled on Assembly Line?</h2>
              <p class="text-[11px] text-slate-300 mt-0.5 leading-snug" id="heroSubtitle">Zero-downtime emergency response. Certified Level-3 master technicians nearby.</p>
            </div>

            <!-- DUAL PRIMARY ACTION BUTTONS -->
            <div class="pt-1.5 grid grid-cols-2 gap-2">
              <button onclick="requestService('triage')"
                      class="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-display font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_6px_20px_rgba(245,158,11,0.35)] transition-all">
                <i class="fa-solid fa-bolt text-xs"></i>
                <span>Report Breakdown</span>
              </button>
              <button onclick="requestService('radar')"
                      class="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/10 font-tech font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
                <i class="fa-solid fa-radar text-amber-400 text-xs"></i>
                <span>Radar Track</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 4 ACTION SATELLITES -->
        <div class="grid grid-cols-4 gap-2">
          <div onclick="showScreen('triage')" class="glass-panel rounded-2xl p-2.5 text-center cursor-pointer hover:border-amber-400/50 transition-all">
            <div class="w-9 h-9 mx-auto rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm mb-1 border border-amber-500/20">
              <i class="fa-solid fa-microphone-lines"></i>
            </div>
            <span class="text-[10px] font-semibold text-slate-200 block leading-tight">Sound AI</span>
            <span class="text-[8px] font-mono text-slate-500">FFT Wave</span>
          </div>

          <div onclick="requestService('video')" class="glass-panel rounded-2xl p-2.5 text-center cursor-pointer hover:border-blue-400/50 transition-all">
            <div class="w-9 h-9 mx-auto rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm mb-1 border border-blue-500/20">
              <i class="fa-solid fa-video"></i>
            </div>
            <span class="text-[10px] font-semibold text-slate-200 block leading-tight">Video Call</span>
            <span class="text-[8px] font-mono text-slate-500">Remote L3</span>
          </div>

          <div onclick="showScreen('catalog')" class="glass-panel rounded-2xl p-2.5 text-center cursor-pointer hover:border-purple-400/50 transition-all">
            <div class="w-9 h-9 mx-auto rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-sm mb-1 border border-purple-500/20">
              <i class="fa-solid fa-book-open"></i>
            </div>
            <span class="text-[10px] font-semibold text-slate-200 block leading-tight">A-Z Machines</span>
            <span class="text-[8px] font-mono text-slate-500">1,151 Techs</span>
          </div>

          <div onclick="showScreen('warranty')" class="glass-panel rounded-2xl p-2.5 text-center cursor-pointer hover:border-emerald-400/50 transition-all">
            <div class="w-9 h-9 mx-auto rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm mb-1 border border-emerald-500/20">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <span class="text-[10px] font-semibold text-slate-200 block leading-tight">Warranty</span>
            <span class="text-[8px] font-mono text-slate-500">30-Day Free</span>
          </div>
        </div>

        <!-- DYNAMIC CATALOGUE LIST -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-3 bg-amber-400 rounded-full" id="sectionPill"></span>
              <h3 class="text-xs font-display font-extrabold uppercase tracking-wider text-slate-300" id="catTitle">Heavy Industrial Machinery</h3>
            </div>
            <span onclick="showScreen('catalog')" class="text-[10px] font-tech text-amber-400 font-bold hover:underline cursor-pointer">Explore All 1,151 →</span>
          </div>

          <div class="grid grid-cols-2 gap-2" id="categoriesContainer">
            <div onclick="showMachineDetail('CNC Lathe & Mill')" class="glass-panel rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-amber-400/40 transition-all">
              <div class="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-amber-400 text-base">
                <i class="fa-solid fa-gear"></i>
              </div>
              <div>
                <h4 class="text-xs font-bold text-white">CNC Lathe & Mill</h4>
                <p class="text-[9px] text-slate-400 font-mono">Fanuc • Siemens • Haas</p>
              </div>
            </div>

            <div onclick="showMachineDetail('IBR Steam Boilers')" class="glass-panel rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-amber-400/40 transition-all">
              <div class="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-amber-400 text-base">
                <i class="fa-solid fa-fire-flame-curved"></i>
              </div>
              <div>
                <h4 class="text-xs font-bold text-white">IBR Steam Boilers</h4>
                <p class="text-[9px] text-slate-400 font-mono">Thermic • Burners</p>
              </div>
            </div>

            <div onclick="showMachineDetail('Hydraulic Press')" class="glass-panel rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-amber-400/40 transition-all">
              <div class="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-amber-400 text-base">
                <i class="fa-solid fa-compress"></i>
              </div>
              <div>
                <h4 class="text-xs font-bold text-white">Hydraulic Press</h4>
                <p class="text-[9px] text-slate-400 font-mono">Rams • Valves • Seals</p>
              </div>
            </div>

            <div onclick="showMachineDetail('Industrial Chiller')" class="glass-panel rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-amber-400/40 transition-all">
              <div class="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-amber-400 text-base">
                <i class="fa-solid fa-snowflake"></i>
              </div>
              <div>
                <h4 class="text-xs font-bold text-white">Industrial Chiller</h4>
                <p class="text-[9px] text-slate-400 font-mono">Compressor • R134a</p>
              </div>
            </div>
          </div>
        </div>

        <!-- RECENT ACTIVITY OR GUEST PROMO -->
        <div class="glass-panel rounded-3xl p-3.5 border border-white/10 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span class="text-xs font-bold text-white">Zero-Downtime Guarantee</span>
            </div>
            <span class="font-mono text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">30-Day Escrow</span>
          </div>
          <p class="text-[10px] text-slate-300 leading-relaxed">
            Every emergency dispatch is backed by physical arrival verification (OTP 4821) and Razorpay escrow. You pay only after the machine is running smoothly.
          </p>
        </div>
      </div>

      <!-- BOTTOM NAVIGATION BAR -->
      <div class="h-16 px-6 bg-slate-950/90 backdrop-blur-xl border-t border-white/[0.08] flex items-center justify-between absolute bottom-0 left-0 right-0 z-30">
        <button onclick="showScreen('home')" class="flex flex-col items-center gap-0.5 text-amber-400">
          <i class="fa-solid fa-house-chimney text-xs"></i>
          <span class="text-[8px] font-tech font-bold uppercase tracking-wider">Home</span>
        </button>

        <button onclick="showScreen('catalog')" class="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white">
          <i class="fa-solid fa-book-open text-xs"></i>
          <span class="text-[8px] font-tech font-bold uppercase tracking-wider">A-Z Catalog</span>
        </button>

        <button onclick="showScreen('triage')" class="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white">
          <i class="fa-solid fa-waveform-lines text-xs"></i>
          <span class="text-[8px] font-tech font-bold uppercase tracking-wider">Sound AI</span>
        </button>

        <button onclick="requestService('radar')" class="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white relative">
          <span class="w-2 h-2 rounded-full bg-emerald-400 absolute top-0 right-2 animate-pulse"></span>
          <i class="fa-solid fa-crosshairs text-xs text-emerald-400"></i>
          <span class="text-[8px] font-tech font-bold uppercase tracking-wider text-emerald-400">Radar</span>
        </button>

        <button onclick="openAuthModal()" class="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white" id="navProfileBtn">
          <i class="fa-solid fa-user text-xs"></i>
          <span class="text-[8px] font-tech font-bold uppercase tracking-wider">Account</span>
        </button>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 3. A-TO-Z CATALOGUE & MACHINE DETAILS (BROWSE MODE) -->
    <!-- ======================================================== -->
    <div id="view-catalog" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="showScreen('home')" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">A-to-Z Machine Catalogue</h3>
            <span class="text-[9px] font-mono text-amber-400">1,151 Equipment & Machinery Models</span>
          </div>
        </div>
      </div>

      <!-- Quick A-Z Alphabet Filter -->
      <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 text-[10px] font-mono">
        <span class="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">A</span>
        <span class="px-2 py-0.5 rounded bg-white/5 text-slate-400">B</span>
        <span class="px-2 py-0.5 rounded bg-white/5 text-slate-400">C</span>
        <span class="px-2 py-0.5 rounded bg-white/5 text-slate-400">D</span>
        <span class="px-2 py-0.5 rounded bg-white/5 text-slate-400">E</span>
        <span class="px-2 py-0.5 rounded bg-white/5 text-slate-400">F</span>
        <span class="px-2 py-0.5 rounded bg-white/5 text-slate-400">G</span>
        <span class="px-2 py-0.5 rounded bg-white/5 text-slate-400">H</span>
      </div>

      <!-- Catalogue Listings with Action Triggers -->
      <div class="space-y-2">
        <div class="glass-panel rounded-2xl p-3 border border-white/10 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm"><i class="fa-solid fa-gear"></i></div>
              <div>
                <h4 class="text-xs font-bold text-white">CNC 5-Axis VMC Machining Center</h4>
                <p class="text-[9px] text-slate-400 font-mono">Mazak • DMG Mori • Haas • Fanuc</p>
              </div>
            </div>
            <span class="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">24 Techs</span>
          </div>
          <div class="flex gap-2 pt-1">
            <button onclick="requestService('triage')" class="flex-1 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">Sound AI Triage</button>
            <button onclick="requestService('dispatch')" class="flex-1 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-bold">Book Dispatch →</button>
          </div>
        </div>

        <div class="glass-panel rounded-2xl p-3 border border-white/10 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm"><i class="fa-solid fa-fire-burner"></i></div>
              <div>
                <h4 class="text-xs font-bold text-white">IBR High Pressure Steam Boiler (2T)</h4>
                <p class="text-[9px] text-slate-400 font-mono">Thermax • Forbes Marshall</p>
              </div>
            </div>
            <span class="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">18 Techs</span>
          </div>
          <div class="flex gap-2 pt-1">
            <button onclick="requestService('triage')" class="flex-1 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">Sound AI Triage</button>
            <button onclick="requestService('dispatch')" class="flex-1 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-bold">Book Dispatch →</button>
          </div>
        </div>

        <div class="glass-panel rounded-2xl p-3 border border-white/10 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm"><i class="fa-solid fa-compress"></i></div>
              <div>
                <h4 class="text-xs font-bold text-white">500T Hydraulic Deep Draw Press</h4>
                <p class="text-[9px] text-slate-400 font-mono">Rexroth • Vickers Hydraulics</p>
              </div>
            </div>
            <span class="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">15 Techs</span>
          </div>
          <div class="flex gap-2 pt-1">
            <button onclick="requestService('triage')" class="flex-1 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">Sound AI Triage</button>
            <button onclick="requestService('dispatch')" class="flex-1 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-bold">Book Dispatch →</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 4. GEMINI 3.8 FLASH SOUND DIAGNOSTIC (STEP 1) -->
    <!-- ======================================================== -->
    <div id="view-triage" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="showScreen('home')" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Gemini 3.8 Flash Audio FFT</h3>
            <span class="text-[9px] font-mono text-emerald-400">Step 1: AI Sound Diagnostic</span>
          </div>
        </div>
      </div>

      <!-- Real-Time Spectrogram -->
      <div class="glass-panel rounded-2xl p-4 text-center border border-amber-500/30 space-y-2">
        <div class="flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span class="text-amber-400 font-bold flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> LISTENING TO SPINDLE SOUND
          </span>
          <span>48kHz / 24-bit FFT</span>
        </div>
        
        <div class="flex items-center justify-center gap-1.5 h-16 py-1">
          <div class="w-2 bg-amber-400 rounded-full eq-bar" style="animation-delay: 0.1s"></div>
          <div class="w-2 bg-orange-500 rounded-full eq-bar" style="animation-delay: 0.3s"></div>
          <div class="w-2 bg-amber-300 rounded-full eq-bar" style="animation-delay: 0.2s"></div>
          <div class="w-2 bg-amber-500 rounded-full eq-bar" style="animation-delay: 0.4s"></div>
          <div class="w-2 bg-red-500 rounded-full eq-bar" style="animation-delay: 0.15s"></div>
          <div class="w-2 bg-amber-400 rounded-full eq-bar" style="animation-delay: 0.35s"></div>
          <div class="w-2 bg-orange-400 rounded-full eq-bar" style="animation-delay: 0.25s"></div>
          <div class="w-2 bg-amber-500 rounded-full eq-bar" style="animation-delay: 0.45s"></div>
        </div>

        <div class="flex items-center justify-between text-[10px] font-mono px-2 pt-1 border-t border-white/5">
          <span class="text-slate-400">Harmonic Anomaly</span>
          <span class="text-amber-400 font-bold">4,210 Hz High-Frequency Whine</span>
        </div>
      </div>

      <!-- AI Verdict Card -->
      <div class="glass-panel rounded-2xl p-3.5 border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold">Critical Severity • Class 1</span>
          <span class="text-[10px] font-mono font-bold text-emerald-400">97.8% Confidence</span>
        </div>
        <h4 class="text-xs font-display font-black text-white">Spindle Bearing Galling & Oil Starvation</h4>
        <p class="text-[10px] text-slate-300 leading-relaxed">
          Gemini sound wave telemetry isolates inner raceway flaking with impending shaft lockup. Immediate shutdown mandated.
        </p>
      </div>

      <!-- Action Gateways -->
      <div class="space-y-2 pt-1">
        <div onclick="requestService('video')" class="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:border-blue-400/50">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs"><i class="fa-solid fa-video"></i></div>
            <div><h5 class="text-xs font-bold text-white">Step 2: Agora Video Consult</h5><p class="text-[9px] text-slate-400">Remote L3 Engineer triage (₹499)</p></div>
          </div>
          <span class="text-blue-400 text-xs font-bold">Connect →</span>
        </div>

        <div onclick="requestService('dispatch')" class="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between cursor-pointer hover:border-amber-400">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black"><i class="fa-solid fa-truck-fast"></i></div>
            <div><h5 class="text-xs font-bold text-white">Step 3: Emergency Dispatch</h5><p class="text-[9px] text-amber-400/90 font-mono">60% Skill + 40% Distance (14m ETA)</p></div>
          </div>
          <span class="px-2.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-[10px] font-bold">Dispatch Now →</span>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 5. AGORA HD VIDEO CONSULTATION (STEP 2) -->
    <!-- ======================================================== -->
    <div id="view-video" class="hidden flex-1 flex flex-col p-4 z-20 overflow-hidden relative">
      <div class="absolute inset-0 bg-slate-900 overflow-hidden flex items-center justify-center">
        <div class="text-center space-y-2 opacity-30">
          <i class="fa-solid fa-gear text-9xl text-slate-400 animate-spin" style="animation-duration: 20s"></i>
          <p class="font-mono text-xs">AGORA WEBRTC HD VIDEO ROOM (1080P)</p>
        </div>

        <!-- Laser Pointer AR overlay -->
        <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div class="w-12 h-12 rounded-full border-2 border-red-500 border-dashed animate-pulse flex items-center justify-center mx-auto">
            <span class="w-2 h-2 rounded-full bg-red-500"></span>
          </div>
          <span class="text-[9px] font-mono bg-red-500/80 text-white px-2 py-0.5 rounded-full mt-1 inline-block">Engineer Pointer: Inspect Bearing 7014C</span>
        </div>

        <!-- Remote Engineer PiP -->
        <div class="absolute top-14 right-4 w-28 h-36 rounded-2xl bg-slate-950 border-2 border-amber-500/40 shadow-2xl p-2 flex flex-col justify-between overflow-hidden">
          <div class="text-[8px] font-mono text-emerald-400 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> LIVE
          </div>
          <div class="text-center my-auto">
            <div class="w-10 h-10 rounded-full bg-slate-800 border border-white/20 mx-auto flex items-center justify-center text-sm font-bold text-amber-400">RM</div>
            <p class="text-[8px] text-white font-bold mt-1">Rajesh Murthy</p>
            <p class="text-[7px] text-slate-400">L3 Master Eng</p>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="relative mt-auto mb-6 p-3 glass-panel rounded-2xl border border-white/10 flex items-center justify-around z-30">
        <button class="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"><i class="fa-solid fa-microphone"></i></button>
        <button class="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"><i class="fa-solid fa-camera-rotate"></i></button>
        <button onclick="requestService('dispatch')" class="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30">
          <i class="fa-solid fa-truck-fast"></i><span>Dispatch Tech</span>
        </button>
        <button onclick="showScreen('home')" class="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center"><i class="fa-solid fa-phone-slash"></i></button>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 6. SMART DISPATCH & CANDIDATE MATCHING (STEP 3) -->
    <!-- ======================================================== -->
    <div id="view-dispatch" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="showScreen('triage')" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Technician Matching Radar</h3>
            <span class="text-[9px] font-mono text-amber-400">60% Skill + 40% Distance</span>
          </div>
        </div>
      </div>

      <!-- Top Candidate Card -->
      <div class="glass-panel rounded-2xl p-3.5 border-2 border-amber-500/50 space-y-2.5 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black">#1 BEST MATCH • 98%</span>
          <span class="text-[10px] font-mono font-bold text-emerald-400">ETA: 14 mins (1.8 km)</span>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-slate-800 border border-amber-500/30 flex items-center justify-center text-lg text-amber-400 font-display font-black">RM</div>
          <div>
            <h4 class="text-xs font-bold text-white flex items-center gap-1.5">Rajesh Murthy <i class="fa-solid fa-circle-check text-emerald-400 text-[10px]"></i></h4>
            <p class="text-[9px] text-slate-400 font-mono">L3 Master Tech • 14 Yrs CNC Specialist</p>
            <div class="flex items-center gap-2 text-[9px] mt-0.5">
              <span class="text-amber-400 font-bold"><i class="fa-solid fa-star text-[8px]"></i> 4.96 (340 jobs)</span>
              <span class="text-emerald-400 font-mono font-bold">Aadhaar Verified</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
          <div class="p-1.5 rounded-lg bg-slate-950/80 border border-white/5">Labor: <strong>₹2,850 Base</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-950/80 border border-white/5">Tooling: <strong>Digital Dial Indicator</strong></div>
        </div>

        <button onclick="requestService('radar')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-display font-black text-xs shadow-lg shadow-amber-500/30">
          Confirm & Dispatch Rajesh Now →
        </button>
      </div>

      <!-- Second Candidate -->
      <div class="glass-panel rounded-2xl p-3 border border-white/10 space-y-2 opacity-80">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-mono text-slate-400 font-bold">#2 MATCH • 91%</span>
          <span class="text-[10px] font-mono text-slate-300">ETA: 22 mins (4.1 km)</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300">SK</div>
          <div>
            <h4 class="text-xs font-bold text-white">Suresh Kumar</h4>
            <p class="text-[9px] text-slate-400 font-mono">Fanuc & Haas Lathe Specialist</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 7. LIVE MISSION RADAR & ARRIVAL OTP TRACKING -->
    <!-- ======================================================== -->
    <div id="view-radar" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="showScreen('home')" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Live Mission Radar</h3>
            <span class="text-[9px] font-mono text-emerald-400">Google Maps Routes API Telemetry</span>
          </div>
        </div>
      </div>

      <!-- Map Radar HUD -->
      <div class="h-44 rounded-3xl bg-slate-950 relative overflow-hidden border border-emerald-500/30 flex items-center justify-center">
        <svg class="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="gridR" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="#10b981" stroke-width="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#gridR)" />
          <circle cx="50%" cy="50%" r="65" fill="none" stroke="#10b981" stroke-width="1" stroke-dasharray="4 4" />
        </svg>

        <div class="absolute top-8 right-12 flex flex-col items-center">
          <div class="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs shadow-[0_0_15px_rgba(245,158,11,0.8)]"><i class="fa-solid fa-industry"></i></div>
          <span class="text-[8px] font-mono font-bold bg-slate-950/80 px-1 rounded text-amber-400 mt-1">Your Factory</span>
        </div>

        <div class="absolute bottom-10 left-10 flex flex-col items-center animate-bounce">
          <div class="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black shadow-[0_0_20px_rgba(16,185,129,0.8)]"><i class="fa-solid fa-wrench"></i></div>
          <span class="text-[8px] font-mono font-bold bg-slate-950/80 px-1 rounded text-emerald-400 mt-1">Rajesh M. (1.8 km)</span>
        </div>

        <div class="absolute bottom-2 left-3 right-3 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-white/10 flex items-center justify-between text-[10px] font-mono">
          <span class="text-slate-300">ETA: <strong class="text-emerald-400">11 mins</strong></span>
          <span class="text-slate-400">Peenya Ring Rd Traffic: Normal</span>
        </div>
      </div>

      <!-- ARRIVAL OTP BOX -->
      <div class="glass-panel rounded-3xl p-3 border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 text-center space-y-1.5">
        <span class="text-[9px] font-mono uppercase tracking-widest text-slate-400">Give Arrival OTP to Technician Upon On-Site Arrival:</span>
        <div class="flex items-center justify-center gap-2 py-0.5">
          <span class="w-11 h-13 rounded-xl bg-slate-950 border border-emerald-500/40 text-2xl font-mono font-black text-emerald-400 flex items-center justify-center shadow-md">4</span>
          <span class="w-11 h-13 rounded-xl bg-slate-950 border border-emerald-500/40 text-2xl font-mono font-black text-emerald-400 flex items-center justify-center shadow-md">8</span>
          <span class="w-11 h-13 rounded-xl bg-slate-950 border border-emerald-500/40 text-2xl font-mono font-black text-emerald-400 flex items-center justify-center shadow-md">2</span>
          <span class="w-11 h-13 rounded-xl bg-slate-950 border border-emerald-500/40 text-2xl font-mono font-black text-emerald-400 flex items-center justify-center shadow-md">1</span>
        </div>
        <p class="text-[8px] text-slate-400 font-mono">Protects job escrow. Escrow locks into job execution upon physical verification.</p>
      </div>

      <!-- Technician Profile Card & Action -->
      <div class="glass-panel rounded-2xl p-2.5 border border-white/10 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 font-display font-black flex items-center justify-center">RM</div>
          <div>
            <h4 class="text-xs font-bold text-white">Rajesh Murthy</h4>
            <p class="text-[9px] text-slate-400 font-mono">En Route on Royal Enfield Bullet</p>
          </div>
        </div>
        <div class="flex gap-1.5">
          <button onclick="showScreen('payment')" class="px-2.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-[10px]">Escrow Sheet</button>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 8. RAZORPAY PAYMENT & ESCROW SETTLEMENT -->
    <!-- ======================================================== -->
    <div id="view-payment" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="showScreen('radar')" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Razorpay Escrow Vault</h3>
            <span class="text-[9px] font-mono text-emerald-400">Order: order_Txoq3xH32SklTi</span>
          </div>
        </div>
      </div>

      <!-- Itemized Breakdown -->
      <div class="glass-panel rounded-2xl p-3.5 border border-white/10 space-y-2">
        <h4 class="text-xs font-bold text-white uppercase tracking-wider">Itemized Breakdown</h4>
        <div class="space-y-1.5 text-xs text-slate-300 font-mono">
          <div class="flex justify-between"><span>Gemini AI Triage</span><span class="text-white">₹0 (Free)</span></div>
          <div class="flex justify-between"><span>Base Emergency Labor</span><span class="text-white">₹2,850</span></div>
          <div class="flex justify-between"><span>Spindle Bearing Pre-Authorization</span><span class="text-white">₹1,000</span></div>
          <div class="flex justify-between"><span>Platform GST (18%)</span><span class="text-white">₹513</span></div>
          <div class="border-t border-white/10 pt-1.5 flex justify-between font-bold text-sm text-amber-400">
            <span>Total Escrow Amount</span><span>₹4,363</span>
          </div>
        </div>
      </div>

      <!-- Escrow Lifecycle -->
      <div class="glass-panel rounded-2xl p-3 border border-emerald-500/30 space-y-2">
        <span class="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Escrow Release Lifecycle:</span>
        <div class="space-y-1.5 text-[10px]">
          <div class="flex items-center gap-2 text-emerald-400 font-bold"><i class="fa-solid fa-circle-check"></i> 1. Funds Held Safely in Razorpay Escrow</div>
          <div class="flex items-center gap-2 text-emerald-400 font-bold"><i class="fa-solid fa-circle-check"></i> 2. Technician Arrival Verified (OTP 4821)</div>
          <div class="flex items-center gap-2 text-amber-400 font-bold"><i class="fa-solid fa-spinner fa-spin"></i> 3. Machine Repaired & Working Proof Captured</div>
          <div class="flex items-center gap-2 text-slate-500"><i class="fa-solid fa-circle"></i> 4. Escrow Released + 30-Day Warranty Certificate Issued</div>
        </div>
      </div>

      <button onclick="showScreen('warranty')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-display font-black text-xs shadow-lg shadow-emerald-500/30">
        Simulate Repair Complete & View Warranty →
      </button>
    </div>

    <!-- ======================================================== -->
    <!-- 9. 30-DAY WARRANTY & COMPLETION SUMMARY -->
    <!-- ======================================================== -->
    <div id="view-warranty" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="showScreen('home')" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Repair Warranty Certificate</h3>
            <span class="text-[9px] font-mono text-emerald-400">Zero-Downtime Guarantee</span>
          </div>
        </div>
      </div>

      <div class="glass-panel rounded-3xl p-4 border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 text-center space-y-2">
        <div class="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mx-auto border border-emerald-500/30">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <h4 class="text-sm font-display font-black text-white">30-Day Zero-Downtime Warranty Active</h4>
        <p class="text-[10px] text-slate-300 leading-relaxed">
          Repaired component: <strong>Mazak VMC Spindle Angular Contact Bearing (7014C)</strong>. If this machine exhibits any fault within 30 days, we dispatch a senior Level-3 master engineer for free within 30 minutes.
        </p>
        <div class="p-2 rounded-xl bg-slate-950/80 border border-white/5 text-[9px] font-mono text-emerald-400">
          Certificate ID: UPTIME-WAR-2024-88419
        </div>
      </div>

      <!-- Rating and Feedback -->
      <div class="glass-panel rounded-2xl p-3 border border-white/10 text-center space-y-1.5">
        <span class="text-[10px] text-slate-300">Rate Technician Rajesh Murthy</span>
        <div class="flex justify-center gap-2 text-amber-400 text-lg">
          <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
        </div>
      </div>

      <button onclick="showScreen('home')" class="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-display font-black text-xs shadow-lg shadow-amber-500/30">
        Back to Owner Home
      </button>
    </div>

    <!-- ======================================================== -->
    <!-- SEAMLESS AUTH MODAL (TRIGGERED ON TAKING SERVICE) -->
    <!-- ======================================================== -->
    <div id="authModal" class="hidden absolute inset-0 bg-slate-950/95 backdrop-blur-2xl z-50 flex flex-col justify-end animate-in fade-in duration-200">
      <div class="glass-panel rounded-t-[36px] p-5 border-t border-white/10 space-y-3.5 shadow-2xl">
        <div class="w-12 h-1 bg-white/20 rounded-full mx-auto"></div>
        
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-display font-black text-white">Quick Login / Signup</h3>
            <p class="text-[10px] text-slate-400">Enter your mobile number to confirm your service booking</p>
          </div>
          <button onclick="closeAuthModal()" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-xmark text-xs"></i></button>
        </div>

        <div class="space-y-2.5">
          <div>
            <label class="text-[10px] font-mono text-slate-400 block mb-1">Mobile Number (India)</label>
            <div class="flex gap-2">
              <span class="px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs font-mono text-slate-300 flex items-center">+91</span>
              <input type="tel" id="loginPhoneInput" value="98450 12345" class="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none">
            </div>
          </div>

          <div>
            <label class="text-[10px] font-mono text-slate-400 block mb-1">Factory / Workshop Name</label>
            <input type="text" id="loginFactoryInput" value="Apex Aerospace Precision Tooling" class="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
          </div>

          <div>
            <label class="text-[10px] font-mono text-slate-400 block mb-1">Enter 4-Digit OTP</label>
            <div class="flex gap-2">
              <input type="text" maxlength="4" value="5921" class="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-mono tracking-widest text-emerald-400 text-center focus:outline-none font-black text-sm">
            </div>
          </div>
        </div>

        <button onclick="completeLogin()" class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-display font-black text-xs shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2">
          <span>Verify & Continue Booking</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>

        <span class="text-[8px] font-mono text-slate-500 block text-center">Your booking state will be preserved automatically</span>
      </div>
    </div>

  </main>

  <script>
    // State
    let isLoggedIn = false;
    let pendingServiceAction = null;

    // Portal data
    const portalData = {
      industries: {
        glowPrimary: 'bg-amber-500',
        glowSecondary: 'bg-orange-600',
        heroBadge: 'Emergency Breakdown Center',
        heroTitle: 'Machine Stalled on Assembly Line?',
        heroSubtitle: 'Zero-downtime emergency response. Certified Level-3 master technicians nearby.',
        heroBgIcon: 'fa-triangle-exclamation',
        catTitle: 'Heavy Industrial Machinery',
        searchPlaceholder: 'Search CNC lathe, boiler, hydraulic press...',
        chips: ['⚡ CNC Spindles', '🔥 IBR Steam Boilers', '💧 Hydraulic Valves', '❄️ Chillers'],
        categories: [
          { name: 'CNC Lathe & Mill', sub: 'Fanuc • Siemens • Haas', icon: 'fa-gear', color: 'text-amber-400' },
          { name: 'IBR Steam Boilers', sub: 'Thermic • Burners', icon: 'fa-fire-flame-curved', color: 'text-amber-400' },
          { name: 'Hydraulic Press', sub: 'Rams • Valves • Seals', icon: 'fa-compress', color: 'text-amber-400' },
          { name: 'Industrial Chiller', sub: 'Compressor • R134a', icon: 'fa-snowflake', color: 'text-amber-400' }
        ]
      },
      automobile: {
        glowPrimary: 'bg-red-600',
        glowSecondary: 'bg-rose-700',
        heroBadge: '24/7 Highway & Fleet SOS',
        heroTitle: 'Vehicle Broken Down on the Road?',
        heroSubtitle: 'Instant roadside mechanic dispatch with live GPS tracking and battery boost SOS.',
        heroBgIcon: 'fa-truck-pickup',
        catTitle: 'Automobile Breakdown Services',
        searchPlaceholder: 'Search alternator, clutch plate, EV battery, puncture...',
        chips: ['🔋 Battery Jumpstart', '🛞 Flat Tyre / SOS', '⚙️ Clutch / Gearbox', '⚡ EV Motor Diagnostics'],
        categories: [
          { name: 'Car Alternator & Battery', sub: 'Exide • Amaron • Jumpstart', icon: 'fa-car-battery', color: 'text-red-400' },
          { name: 'Commercial Truck Engine', sub: 'Tata • Ashok Leyland • Eicher', icon: 'fa-truck-moving', color: 'text-red-400' },
          { name: 'EV Lithium Battery & BMS', sub: 'Ola • Ather • Tata EV', icon: 'fa-charging-station', color: 'text-red-400' },
          { name: '2-Wheeler On-Spot Repair', sub: 'Puncture • Clutch Wire • Oil', icon: 'fa-motorcycle', color: 'text-red-400' }
        ]
      },
      electronics: {
        glowPrimary: 'bg-cyan-500',
        glowSecondary: 'bg-blue-600',
        heroBadge: 'Smart Appliance Care',
        heroTitle: 'Commercial & Home Electronics',
        heroSubtitle: 'Inverter AC, industrial refrigeration, PCB circuit diagnostics and precision repair.',
        heroBgIcon: 'fa-microchip',
        catTitle: 'Electronic Appliances & Systems',
        searchPlaceholder: 'Search inverter AC, PCB board, double door fridge...',
        chips: ['❄️ Inverter Split AC', '🧊 Refrigeration PCB', '⚡ Industrial UPS', '📺 Commercial Displays'],
        categories: [
          { name: 'Inverter Split AC', sub: 'Gas Leak R32 • PCB Board', icon: 'fa-wind', color: 'text-cyan-400' },
          { name: 'Industrial Cold Storage', sub: 'Walk-in Freezers • Compressors', icon: 'fa-temperature-arrow-down', color: 'text-cyan-400' },
          { name: 'Server Room UPS / Inverter', sub: 'Schneider • APC • Batteries', icon: 'fa-server', color: 'text-cyan-400' },
          { name: 'Washing Machine & Dryers', sub: 'Drum Motor • Water Pump', icon: 'fa-soap', color: 'text-cyan-400' }
        ]
      }
    };

    function showScreen(screenKey) {
      const screens = ['splash', 'home', 'catalog', 'triage', 'video', 'dispatch', 'radar', 'payment', 'warranty'];
      screens.forEach(s => {
        const el = document.getElementById(`view-${s}`);
        const tab = document.getElementById(`tab-${s}`);
        if (el) {
          if (s === screenKey) el.classList.remove('hidden');
          else el.classList.add('hidden');
        }
        if (tab) {
          if (s === screenKey) tab.className = 'px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold whitespace-nowrap shadow-md';
          else tab.className = 'px-2.5 py-1 rounded-lg text-slate-400 hover:text-white whitespace-nowrap';
        }
      });
    }

    // When the user takes any service action
    function requestService(targetScreen) {
      if (!isLoggedIn) {
        pendingServiceAction = targetScreen;
        openAuthModal();
      } else {
        showScreen(targetScreen);
      }
    }

    function openAuthModal() {
      document.getElementById('authModal').classList.remove('hidden');
    }

    function closeAuthModal() {
      document.getElementById('authModal').classList.add('hidden');
    }

    function completeLogin() {
      isLoggedIn = true;
      closeAuthModal();
      // Update Auth Pill
      document.getElementById('authDot').className = 'w-2 h-2 rounded-full bg-emerald-400';
      document.getElementById('authStatusText').textContent = 'Apex Aerospace (Logged In)';
      document.getElementById('authActionBtn').textContent = 'My Account';
      
      // If there was a pending action, resume it immediately
      if (pendingServiceAction) {
        showScreen(pendingServiceAction);
        pendingServiceAction = null;
      } else {
        showScreen('home');
      }
    }

    function toggleGuestLogin() {
      if (isLoggedIn) {
        isLoggedIn = false;
        document.getElementById('authDot').className = 'w-2 h-2 rounded-full bg-slate-500';
        document.getElementById('authStatusText').textContent = 'Guest Mode (Browse)';
        document.getElementById('authActionBtn').textContent = 'Login / Signup';
      } else {
        openAuthModal();
      }
    }

    function setPortal(portalKey) {
      const data = portalData[portalKey];
      document.getElementById('glowPrimary').className = `ambient-glow -top-20 -left-20 ${data.glowPrimary}`;
      document.getElementById('glowSecondary').className = `ambient-glow top-1/2 -right-24 ${data.glowSecondary}`;

      ['industries', 'automobile', 'electronics'].forEach(k => {
        const btn = document.getElementById(`tabBtn-${k}`);
        if (k === portalKey) {
          btn.className = `relative py-2.5 px-1 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1 shadow-lg ${
            portalKey === 'industries' ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.4)]' :
            portalKey === 'automobile' ? 'bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[0_4px_16px_rgba(239,68,68,0.4)]' :
            'bg-gradient-to-b from-cyan-400 to-cyan-500 text-slate-950 shadow-[0_4px_16px_rgba(6,182,212,0.4)]'
          }`;
        } else {
          btn.className = 'relative py-2.5 px-1 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200';
        }
      });

      document.getElementById('heroTitle').textContent = data.heroTitle;
      document.getElementById('heroSubtitle').textContent = data.heroSubtitle;
      document.getElementById('heroBadge').textContent = data.heroBadge;
      document.getElementById('heroBgIcon').className = `fa-solid ${data.heroBgIcon}`;
      document.getElementById('catTitle').textContent = data.catTitle;
      document.getElementById('masterSearch').placeholder = data.searchPlaceholder;

      document.getElementById('filterChips').innerHTML = data.chips.map(chip => `
        <span class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 whitespace-nowrap cursor-pointer hover:border-white/30">${chip}</span>
      `).join('');

      document.getElementById('categoriesContainer').innerHTML = data.categories.map(cat => `
        <div onclick="showMachineDetail('${cat.name}')" class="glass-panel rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-white/20 transition-all">
          <div class="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center ${cat.color} text-base">
            <i class="fa-solid ${cat.icon}"></i>
          </div>
          <div>
            <h4 class="text-xs font-bold text-white">${cat.name}</h4>
            <p class="text-[9px] text-slate-400 font-mono">${cat.sub}</p>
          </div>
        </div>
      `).join('');
    }

    function handleSearch(val) {
      const box = document.getElementById('searchResults');
      if (!val || val.length < 2) {
        box.classList.add('hidden');
        return;
      }
      box.classList.remove('hidden');

      const matches = [
        'CNC Lathe 5-Axis Spindle Repair', 'IBR High Pressure Steam Boiler', '500T Hydraulic Ram Pump',
        'Industrial Chiller Gas R134a', 'Car Alternator & Battery Drain SOS', '2-Wheeler Engine Clutch Plate',
        'EV Lithium Battery BMS Warning', 'Inverter Split AC PCB Circuit Leak', 'Double Door Refrigerator Thermostat'
      ].filter(item => item.toLowerCase().includes(val.toLowerCase()));

      if (matches.length === 0) {
        box.innerHTML = `<div class="p-2 text-slate-500 text-center font-mono">No matching machine found</div>`;
      } else {
        box.innerHTML = matches.map(m => `
          <div onclick="selectSearchResult('${m}')" class="p-2 hover:bg-white/10 rounded-xl cursor-pointer flex items-center justify-between text-slate-200">
            <span>${m}</span>
            <span class="text-[10px] font-mono text-amber-400">View & Diagnose →</span>
          </div>
        `).join('');
      }
    }

    function selectSearchResult(m) {
      document.getElementById('masterSearch').value = m;
      document.getElementById('searchResults').classList.add('hidden');
      showMachineDetail(m);
    }

    function showMachineDetail(machineName) {
      showScreen('catalog');
    }
  </script>
</body>
</html>
"""

with open('F:/uptime/design-system/index.html', 'w', encoding='utf-8') as f:
    f.write(owner_app_html)

with open('F:/uptime/design-system/dist/index.html', 'w', encoding='utf-8') as f:
    f.write(owner_app_html)

print(f"Generated dedicated Owner App (User App): {len(owner_app_html)} bytes")
