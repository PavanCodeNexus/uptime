import os

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UPTIME — Production Design System & App Suite</title>
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
      background: #020617;
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
      width: 380px;
      height: 380px;
      border-radius: 50%;
      filter: blur(100px);
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
      25% { height: 38px; }
      50% { height: 18px; }
      75% { height: 46px; }
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
<body class="min-h-screen flex flex-col items-center justify-start p-3 sm:p-6 select-none bg-[#030712]">

  <!-- TOP APP NAVIGATION & VIEWPORT SWITCHER -->
  <header class="w-full max-w-6xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4 p-3.5 glass-panel rounded-2xl border border-white/10 z-40">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-display font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.5)]">
        U
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-base font-display font-black tracking-tight text-white">UPTIME</h1>
          <span class="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">DSATM Student Edition</span>
        </div>
        <p class="text-[11px] text-slate-400 font-mono">Downtime ends here • Production Design System</p>
      </div>
    </div>

    <!-- Active View Selector Tabs -->
    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full bg-slate-950/80 p-1 rounded-xl border border-white/5 text-xs font-semibold">
      <button onclick="switchScreen('owner')" id="viewBtn-owner" class="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center gap-1.5 transition-all">
        <i class="fa-solid fa-mobile-screen"></i>
        <span>1. Owner App</span>
      </button>
      <button onclick="switchScreen('ai')" id="viewBtn-ai" class="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white flex items-center gap-1.5 transition-all">
        <i class="fa-solid fa-brain text-amber-400"></i>
        <span>2. Gemini AI</span>
      </button>
      <button onclick="switchScreen('radar')" id="viewBtn-radar" class="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white flex items-center gap-1.5 transition-all">
        <i class="fa-solid fa-radar text-emerald-400"></i>
        <span>3. Live Radar & OTP</span>
      </button>
      <button onclick="switchScreen('tech')" id="viewBtn-tech" class="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white flex items-center gap-1.5 transition-all">
        <i class="fa-solid fa-wrench text-blue-400"></i>
        <span>4. Technician HUD</span>
      </button>
      <button onclick="switchScreen('admin')" id="viewBtn-admin" class="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white flex items-center gap-1.5 transition-all">
        <i class="fa-solid fa-shield-halved text-purple-400"></i>
        <span>5. Admin & KYC</span>
      </button>
      <button onclick="switchScreen('tokens')" id="viewBtn-tokens" class="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white flex items-center gap-1.5 transition-all">
        <i class="fa-solid fa-palette text-pink-400"></i>
        <span>6. Design Tokens</span>
      </button>
    </div>
  </header>

  <!-- SCREEN VIEWPORT CHASSIS -->
  <main class="w-full max-w-[420px] h-[890px] bg-[#070B12] rounded-[48px] border-[10px] border-[#161F2E] shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] relative overflow-hidden flex flex-col transition-colors duration-500">
    
    <!-- Dynamic Ambient Spotlights -->
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

    <!-- ========================================== -->
    <!-- VIEW 1: OWNER APP (HOME & 3-PORTAL SWITCHER) -->
    <!-- ========================================== -->
    <div id="screen-owner" class="flex-1 flex flex-col overflow-hidden z-20">
      <!-- Location Telemetry Bar -->
      <div class="px-5 py-1.5 flex items-center justify-between text-xs border-b border-white/[0.06] bg-slate-950/40 backdrop-blur-md z-20 shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="relative flex items-center justify-center">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span class="absolute w-5 h-5 rounded-full bg-amber-400/30 radar-ring"></span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-mono text-[9px] uppercase tracking-wider text-slate-400">Live Coverage</span>
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
          <!-- Tab 1: Industries -->
          <button onclick="setPortal('industries')" id="tabBtn-industries"
                  class="relative py-2.5 px-1 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1 bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.4)]">
            <div class="flex items-center gap-1.5">
              <i class="fa-solid fa-industry text-xs"></i>
              <span class="font-display tracking-tight text-[11px]">Industries</span>
            </div>
            <span class="text-[8px] font-mono uppercase tracking-widest font-black opacity-80">1,151 Techs</span>
          </button>

          <!-- Tab 2: Automobile -->
          <button onclick="setPortal('automobile')" id="tabBtn-automobile"
                  class="relative py-2.5 px-1 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200">
            <div class="flex items-center gap-1.5">
              <i class="fa-solid fa-car-rear text-xs"></i>
              <span class="font-display tracking-tight text-[11px]">Automobile</span>
            </div>
            <span class="text-[8px] font-mono uppercase tracking-widest opacity-60">24/7 SOS</span>
          </button>

          <!-- Tab 3: Electronics -->
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
      <div class="flex-1 overflow-y-auto px-4 pb-24 space-y-4 z-10 no-scrollbar">
        <!-- SEARCH BAR -->
        <div class="space-y-2">
          <div class="relative glass-panel rounded-2xl p-1 flex items-center border border-white/10 shadow-lg">
            <div class="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 ml-1">
              <i class="fa-solid fa-magnifying-glass text-xs" id="searchIcon"></i>
            </div>
            <input type="text" id="masterSearch" placeholder="Search CNC lathe, boiler, hydraulic press..." oninput="handleSearch(this.value)"
                   class="w-full bg-transparent px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-medium">
            <button onclick="switchScreen('ai')" class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mr-1 hover:bg-amber-500/30">
              <i class="fa-solid fa-waveform-lines text-xs"></i>
            </button>
          </div>
          <div id="searchResults" class="hidden glass-panel rounded-2xl p-2 space-y-1 text-xs border border-amber-500/30 shadow-2xl"></div>
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10px]" id="filterChips">
            <span class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 whitespace-nowrap cursor-pointer hover:border-amber-400/50">⚡ CNC Spindles</span>
            <span class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 whitespace-nowrap cursor-pointer hover:border-amber-400/50">🔥 IBR Steam Boilers</span>
            <span class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 whitespace-nowrap cursor-pointer hover:border-amber-400/50">💧 Hydraulic Valves</span>
            <span class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 whitespace-nowrap cursor-pointer hover:border-amber-400/50">❄️ Chillers</span>
          </div>
        </div>

        <!-- BREAKDOWN COMMAND CENTER (TACTILE HUD CARD) -->
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
            <div class="pt-1.5 grid grid-cols-2 gap-2">
              <button onclick="switchScreen('ai')"
                      class="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-display font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_6px_20px_rgba(245,158,11,0.35)] transition-all">
                <i class="fa-solid fa-bolt text-xs"></i>
                <span>Report Fault</span>
              </button>
              <button onclick="switchScreen('radar')"
                      class="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/10 font-tech font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
                <i class="fa-solid fa-radar text-amber-400 text-xs"></i>
                <span>Radar Track</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 4 ACTION SATELLITES -->
        <div class="grid grid-cols-4 gap-2">
          <div onclick="switchScreen('ai')" class="glass-panel rounded-2xl p-2.5 text-center cursor-pointer hover:border-amber-400/50 transition-all">
            <div class="w-9 h-9 mx-auto rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm mb-1 border border-amber-500/20">
              <i class="fa-solid fa-microphone-lines"></i>
            </div>
            <span class="text-[10px] font-semibold text-slate-200 block leading-tight">Sound AI</span>
            <span class="text-[8px] font-mono text-slate-500">FFT Wave</span>
          </div>

          <div onclick="alert('Agora HD WebRTC Video Room connected')" class="glass-panel rounded-2xl p-2.5 text-center cursor-pointer hover:border-blue-400/50 transition-all">
            <div class="w-9 h-9 mx-auto rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm mb-1 border border-blue-500/20">
              <i class="fa-solid fa-video"></i>
            </div>
            <span class="text-[10px] font-semibold text-slate-200 block leading-tight">Video Call</span>
            <span class="text-[8px] font-mono text-slate-500">Remote L3</span>
          </div>

          <div onclick="alert('Digital Twin Telemetry Synced with Supabase PostGIS')" class="glass-panel rounded-2xl p-2.5 text-center cursor-pointer hover:border-purple-400/50 transition-all">
            <div class="w-9 h-9 mx-auto rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-sm mb-1 border border-purple-500/20">
              <i class="fa-solid fa-cube"></i>
            </div>
            <span class="text-[10px] font-semibold text-slate-200 block leading-tight">Digital Twin</span>
            <span class="text-[8px] font-mono text-slate-500">Telemetry</span>
          </div>

          <div onclick="alert('30-Day Escrow Warranty Protection Guaranteed')" class="glass-panel rounded-2xl p-2.5 text-center cursor-pointer hover:border-emerald-400/50 transition-all">
            <div class="w-9 h-9 mx-auto rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm mb-1 border border-emerald-500/20">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <span class="text-[10px] font-semibold text-slate-200 block leading-tight">Warranty</span>
            <span class="text-[8px] font-mono text-slate-500">Per-Job</span>
          </div>
        </div>

        <!-- DYNAMIC CATALOGUE LIST -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-3 bg-amber-400 rounded-full" id="sectionPill"></span>
              <h3 class="text-xs font-display font-extrabold uppercase tracking-wider text-slate-300" id="catTitle">Heavy Industrial Machinery</h3>
            </div>
            <span class="text-[10px] font-tech text-amber-400 font-bold hover:underline cursor-pointer">Explore All 1,151 →</span>
          </div>

          <div class="grid grid-cols-2 gap-2" id="categoriesContainer">
            <div onclick="switchScreen('ai')" class="glass-panel rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-amber-400/40 transition-all">
              <div class="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-amber-400 text-base">
                <i class="fa-solid fa-gear"></i>
              </div>
              <div>
                <h4 class="text-xs font-bold text-white">CNC Lathe & Mill</h4>
                <p class="text-[9px] text-slate-400 font-mono">Fanuc • Siemens • Haas</p>
              </div>
            </div>
            <div onclick="switchScreen('ai')" class="glass-panel rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-amber-400/40 transition-all">
              <div class="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-amber-400 text-base">
                <i class="fa-solid fa-fire-flame-curved"></i>
              </div>
              <div>
                <h4 class="text-xs font-bold text-white">IBR Steam Boilers</h4>
                <p class="text-[9px] text-slate-400 font-mono">Thermic • Burners</p>
              </div>
            </div>
            <div onclick="switchScreen('ai')" class="glass-panel rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-amber-400/40 transition-all">
              <div class="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-amber-400 text-base">
                <i class="fa-solid fa-compress"></i>
              </div>
              <div>
                <h4 class="text-xs font-bold text-white">Hydraulic Press</h4>
                <p class="text-[9px] text-slate-400 font-mono">Rams • Valves • Seals</p>
              </div>
            </div>
            <div onclick="switchScreen('ai')" class="glass-panel rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-amber-400/40 transition-all">
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

        <!-- REGISTERED ASSET CARD -->
        <div class="glass-panel rounded-3xl p-3.5 border border-white/10 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span class="text-xs font-bold text-white">Registered Machine Asset</span>
            </div>
            <span class="font-mono text-[9px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">SN: VMC-850-2024</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-200">Mazak Vertical Machining Center</span>
            <span class="font-mono font-bold text-emerald-400">96.4% Health</span>
          </div>
          <div class="grid grid-cols-12 gap-1 py-1">
            <div class="h-1.5 rounded-full bg-emerald-400 col-span-11"></div>
            <div class="h-1.5 rounded-full bg-amber-400 col-span-1"></div>
          </div>
          <div class="p-2 rounded-xl bg-slate-950/70 border border-white/5 text-[10px] text-slate-300 flex items-start gap-2">
            <i class="fa-solid fa-brain text-amber-400 text-xs mt-0.5"></i>
            <span><strong>AI Wear Prediction:</strong> Fleet repair analysis indicates spindle bearing replacement optimal in <strong>42 operating hours</strong>.</span>
          </div>
        </div>
      </div>

      <!-- BOTTOM NAV BAR -->
      <div class="h-20 px-6 bg-slate-950/90 backdrop-blur-xl border-t border-white/[0.08] flex items-center justify-between absolute bottom-0 left-0 right-0 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <button onclick="switchScreen('owner')" class="flex flex-col items-center gap-1 text-amber-400 scale-105">
          <div class="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <i class="fa-solid fa-house-chimney text-xs"></i>
          </div>
          <span class="text-[9px] font-tech font-bold uppercase tracking-wider">Home</span>
        </button>
        <button onclick="switchScreen('ai')" class="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200">
          <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
            <i class="fa-solid fa-brain text-xs"></i>
          </div>
          <span class="text-[9px] font-tech font-bold uppercase tracking-wider">AI Triage</span>
        </button>
        <button onclick="switchScreen('radar')" class="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 relative">
          <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center relative">
            <span class="w-2 h-2 rounded-full bg-emerald-400 absolute top-0 right-0 animate-pulse"></span>
            <i class="fa-solid fa-crosshairs text-xs text-emerald-400"></i>
          </div>
          <span class="text-[9px] font-tech font-bold uppercase tracking-wider text-emerald-400">Radar</span>
        </button>
        <button onclick="switchScreen('tech')" class="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200">
          <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
            <i class="fa-solid fa-wrench text-xs"></i>
          </div>
          <span class="text-[9px] font-tech font-bold uppercase tracking-wider">Tech Mode</span>
        </button>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- VIEW 2: GEMINI 3.8 FLASH SOUND DIAGNOSTICS -->
    <!-- ========================================== -->
    <div id="screen-ai" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-24">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs border border-amber-500/30">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Gemini 3.8 Flash Diagnostic</h3>
            <span class="text-[9px] font-mono text-emerald-400">Interactions API Live • Audio FFT</span>
          </div>
        </div>
        <button onclick="switchScreen('owner')" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center hover:text-white border border-white/10">
          <i class="fa-solid fa-chevron-left text-xs"></i>
        </button>
      </div>

      <!-- Real-Time Spectrogram -->
      <div class="glass-panel rounded-2xl p-4 text-center border border-amber-500/30 space-y-2">
        <div class="flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span class="text-amber-400 font-bold flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            LISTENING TO SPINDLE NOISE
          </span>
          <span>48kHz / 24-bit Float</span>
        </div>
        
        <div class="flex items-center justify-center gap-1.5 h-20 py-2">
          <div class="w-2 bg-amber-400 rounded-full eq-bar" style="animation-delay: 0.1s"></div>
          <div class="w-2 bg-orange-500 rounded-full eq-bar" style="animation-delay: 0.3s"></div>
          <div class="w-2 bg-amber-300 rounded-full eq-bar" style="animation-delay: 0.2s"></div>
          <div class="w-2 bg-amber-500 rounded-full eq-bar" style="animation-delay: 0.4s"></div>
          <div class="w-2 bg-red-500 rounded-full eq-bar" style="animation-delay: 0.15s"></div>
          <div class="w-2 bg-amber-400 rounded-full eq-bar" style="animation-delay: 0.35s"></div>
          <div class="w-2 bg-orange-400 rounded-full eq-bar" style="animation-delay: 0.25s"></div>
          <div class="w-2 bg-amber-500 rounded-full eq-bar" style="animation-delay: 0.45s"></div>
          <div class="w-2 bg-amber-300 rounded-full eq-bar" style="animation-delay: 0.5s"></div>
        </div>

        <div class="flex items-center justify-between text-[10px] font-mono px-2 pt-1 border-t border-white/5">
          <span class="text-slate-400">FFT Harmonic Peak</span>
          <span class="text-amber-400 font-bold">4,210 Hz High-Frequency Whine</span>
        </div>
      </div>

      <!-- AI Verdict Card -->
      <div class="glass-panel rounded-2xl p-3.5 border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold">Critical Severity • Class 1</span>
          <span class="text-[10px] font-mono font-bold text-emerald-400">97.8% Confidence</span>
        </div>
        <h4 class="text-xs font-display font-black text-white">Main Spindle Bearing Micro-Fracture & Lubrication Starvation</h4>
        <p class="text-[10px] text-slate-300 leading-relaxed">
          Gemini sound wave telemetry detects characteristic harmonic spikes at 4.2 kHz indicating race galling. Continued operation risks catastrophic shaft seizure.
        </p>
      </div>

      <!-- Protocol 3-Step Actions -->
      <div class="space-y-2 pt-1">
        <span class="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">Universal 3-Step Protocol:</span>
        
        <div class="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">
              <i class="fa-solid fa-headset"></i>
            </div>
            <div>
              <h5 class="text-xs font-bold text-white">Step 2: Agora Video Consult</h5>
              <p class="text-[9px] text-slate-400">Remote L3 Master Engineer triage (₹499)</p>
            </div>
          </div>
          <button onclick="alert('Starting Agora Video consultation...')" class="px-2.5 py-1.5 rounded-lg bg-blue-500 text-white text-[10px] font-bold">Connect</button>
        </div>

        <div class="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">
              <i class="fa-solid fa-truck-fast"></i>
            </div>
            <div>
              <h5 class="text-xs font-bold text-white">Step 3: Emergency Dispatch</h5>
              <p class="text-[9px] text-amber-400/90 font-mono">Rank: 60% Skill + 40% Distance (14m ETA)</p>
            </div>
          </div>
          <button onclick="switchScreen('radar')" class="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/30">
            Dispatch Now →
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- VIEW 3: LIVE MISSION RADAR & OTP VERIFICATION -->
    <!-- ========================================== -->
    <div id="screen-radar" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-24">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs border border-emerald-500/30">
            <i class="fa-solid fa-satellite-dish"></i>
          </div>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Mission Radar Tracking</h3>
            <span class="text-[9px] font-mono text-emerald-400">Google Maps Routes API Live</span>
          </div>
        </div>
        <button onclick="switchScreen('owner')" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center hover:text-white border border-white/10">
          <i class="fa-solid fa-chevron-left text-xs"></i>
        </button>
      </div>

      <!-- Interactive Radar Map HUD -->
      <div class="h-56 rounded-3xl bg-slate-950 relative overflow-hidden border border-emerald-500/30 flex items-center justify-center">
        <!-- SVG Radar Grid -->
        <svg class="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#10b981" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="50%" cy="50%" r="80" fill="none" stroke="#10b981" stroke-width="1" stroke-dasharray="4 4" />
          <circle cx="50%" cy="50%" r="40" fill="none" stroke="#10b981" stroke-width="1" />
        </svg>

        <!-- Simulated Road Path Line -->
        <svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M 60 180 Q 150 140 210 110 T 320 60" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 4"/>
        </svg>

        <!-- Target Destination (Factory Pin) -->
        <div class="absolute top-12 right-16 flex flex-col items-center">
          <div class="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs shadow-[0_0_15px_rgba(245,158,11,0.8)]">
            <i class="fa-solid fa-industry"></i>
          </div>
          <span class="text-[8px] font-mono font-bold bg-slate-950/80 px-1 rounded text-amber-400 mt-1 border border-amber-500/20">Factory #4</span>
        </div>

        <!-- Moving Technician Marker -->
        <div class="absolute bottom-16 left-12 flex flex-col items-center animate-bounce">
          <div class="relative flex items-center justify-center">
            <span class="w-8 h-8 rounded-full bg-emerald-500/20 radar-ring absolute"></span>
            <div class="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black shadow-[0_0_20px_rgba(16,185,129,0.8)]">
              <i class="fa-solid fa-wrench"></i>
            </div>
          </div>
          <span class="text-[8px] font-mono font-bold bg-slate-950/80 px-1 rounded text-emerald-400 mt-1 border border-emerald-500/20">Rajesh M. (1.8 km)</span>
        </div>

        <!-- Floating HUD Pill -->
        <div class="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md p-2 rounded-2xl border border-white/10 flex items-center justify-between text-xs font-mono">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-slate-300">ETA: <strong class="text-emerald-400">11 mins</strong></span>
          </div>
          <span class="text-[10px] text-slate-400">Routes API Traffic: Clear</span>
        </div>
      </div>

      <!-- ARRIVAL OTP BOX -->
      <div class="glass-panel rounded-3xl p-4 border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 text-center space-y-2">
        <span class="text-[9px] font-mono uppercase tracking-widest text-slate-400">Share Arrival OTP With Technician Upon On-Site Arrival</span>
        <div class="flex items-center justify-center gap-2.5 py-1">
          <span class="w-12 h-14 rounded-2xl bg-slate-950 border border-emerald-500/40 text-2xl font-mono font-black text-emerald-400 flex items-center justify-center shadow-lg">4</span>
          <span class="w-12 h-14 rounded-2xl bg-slate-950 border border-emerald-500/40 text-2xl font-mono font-black text-emerald-400 flex items-center justify-center shadow-lg">8</span>
          <span class="w-12 h-14 rounded-2xl bg-slate-950 border border-emerald-500/40 text-2xl font-mono font-black text-emerald-400 flex items-center justify-center shadow-lg">2</span>
          <span class="w-12 h-14 rounded-2xl bg-slate-950 border border-emerald-500/40 text-2xl font-mono font-black text-emerald-400 flex items-center justify-center shadow-lg">1</span>
        </div>
        <p class="text-[9px] text-slate-400 font-mono">Protects job escrow. Escrow unlocks only after verified physical arrival.</p>
      </div>

      <!-- TECHNICIAN PROFILE CARD -->
      <div class="glass-panel rounded-2xl p-3 border border-white/10 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-slate-800 border border-emerald-500/30 flex items-center justify-center text-lg text-emerald-400 font-display font-black">
            RM
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <h4 class="text-xs font-bold text-white">Rajesh Murthy</h4>
              <i class="fa-solid fa-circle-check text-emerald-400 text-[10px]"></i>
            </div>
            <p class="text-[9px] text-slate-400 font-mono">L3 Certified Fanuc/Siemens Specialist</p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-[9px] text-amber-400 font-bold"><i class="fa-solid fa-star text-[8px]"></i> 4.96 (340 jobs)</span>
              <span class="text-[8px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">Aadhaar Verified</span>
            </div>
          </div>
        </div>
        <button onclick="alert('Calling technician via Twilio/Agora Masked VoIP...')" class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-500/30">
          <i class="fa-solid fa-phone text-xs"></i>
        </button>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- VIEW 4: TECHNICIAN WORKSTATION HUD -->
    <!-- ========================================== -->
    <div id="screen-tech" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-24">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs border border-blue-500/30">
            <i class="fa-solid fa-toolbox"></i>
          </div>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Technician Field Terminal</h3>
            <span class="text-[9px] font-mono text-emerald-400">Rajesh Murthy • Peenya Zone</span>
          </div>
        </div>
        <!-- Duty Toggle -->
        <div class="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-full border border-emerald-500/30">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-[9px] font-mono font-bold text-emerald-400">ONLINE</span>
        </div>
      </div>

      <!-- INCOMING EMERGENCY DISPATCH BROADCAST CARD -->
      <div class="glass-panel rounded-3xl p-4 border border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 space-y-3 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold flex items-center gap-1">
            <i class="fa-solid fa-fire text-[8px]"></i> EMERGENCY BROADCAST
          </span>
          <span class="text-xs font-mono font-black text-amber-400">42s Left</span>
        </div>

        <div>
          <h4 class="text-sm font-display font-black text-white">CNC 5-Axis Spindle Seizure SOS</h4>
          <p class="text-[10px] text-slate-400 font-mono">Precision Aerospace Ltd, Peenya Industrial Area</p>
        </div>

        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="p-2 rounded-xl bg-slate-950/80 border border-white/5">
            <span class="text-[8px] font-mono text-slate-400 block">Payout (Escrow)</span>
            <strong class="text-xs font-mono text-emerald-400 font-bold">₹3,850</strong>
          </div>
          <div class="p-2 rounded-xl bg-slate-950/80 border border-white/5">
            <span class="text-[8px] font-mono text-slate-400 block">Distance</span>
            <strong class="text-xs font-mono text-slate-200 font-bold">1.8 km</strong>
          </div>
          <div class="p-2 rounded-xl bg-slate-950/80 border border-white/5">
            <span class="text-[8px] font-mono text-slate-400 block">Skill Match</span>
            <strong class="text-xs font-mono text-amber-400 font-bold">98%</strong>
          </div>
        </div>

        <!-- Dual Action Buttons -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <button onclick="alert('Declining job broadcast...')" class="py-2 rounded-xl bg-white/5 text-slate-400 border border-white/10 font-bold text-xs hover:bg-white/10">
            Decline
          </button>
          <button onclick="alert('Job Accepted! Navigating to Factory #4...')" class="py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-display font-black text-xs shadow-lg shadow-emerald-500/30">
            Accept Dispatch
          </button>
        </div>
      </div>

      <!-- WORKFLOW PROTOCOL STEPS -->
      <div class="space-y-2">
        <span class="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">Job Execution Checklist:</span>

        <!-- Step 1: Arrival OTP Verification -->
        <div class="glass-panel rounded-2xl p-3 border border-white/10 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-white flex items-center gap-1.5">
              <i class="fa-solid fa-key text-amber-400 text-xs"></i> 1. Enter Customer Arrival OTP
            </span>
            <span class="text-[9px] font-mono text-amber-400">Pending</span>
          </div>
          <div class="flex gap-2">
            <input type="text" maxlength="4" placeholder="4821" class="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono tracking-widest text-emerald-400 text-center focus:outline-none">
            <button onclick="alert('OTP 4821 Verified! Escrow Active.')" class="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs">Verify</button>
          </div>
        </div>

        <!-- Step 2: Before & After Evidence -->
        <div class="glass-panel rounded-2xl p-3 border border-white/10 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-white flex items-center gap-1.5">
              <i class="fa-solid fa-camera text-blue-400 text-xs"></i> 2. Before/After Photo Protocol
            </span>
            <span class="text-[9px] font-mono text-slate-400">Cloudinary Vault</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-center text-[10px]">
            <div onclick="alert('Capturing Pre-Repair Photo...')" class="border border-dashed border-white/20 rounded-xl p-3 bg-white/5 cursor-pointer hover:border-white/40">
              <i class="fa-solid fa-image text-slate-400 mb-1 block"></i>
              <span class="text-slate-300 font-medium">Pre-Repair Photo</span>
            </div>
            <div onclick="alert('Capturing Post-Repair Working Proof...')" class="border border-dashed border-white/20 rounded-xl p-3 bg-white/5 cursor-pointer hover:border-white/40">
              <i class="fa-solid fa-circle-check text-slate-400 mb-1 block"></i>
              <span class="text-slate-300 font-medium">Post-Repair Proof</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- VIEW 5: ADMIN VERIFICATION & KYC TERMINAL -->
    <!-- ========================================== -->
    <div id="screen-admin" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-24">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs border border-purple-500/30">
            <i class="fa-solid fa-fingerprint"></i>
          </div>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Govt KYC & Admin Terminal</h3>
            <span class="text-[9px] font-mono text-purple-400">Technician Approval Gate</span>
          </div>
        </div>
        <button onclick="switchScreen('owner')" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center hover:text-white border border-white/10">
          <i class="fa-solid fa-chevron-left text-xs"></i>
        </button>
      </div>

      <!-- PENDING APPROVAL QUEUE CARD -->
      <div class="glass-panel rounded-3xl p-4 border border-purple-500/40 bg-gradient-to-br from-purple-500/10 via-slate-900 to-slate-950 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">Verification Pending</span>
          <span class="text-[10px] font-mono text-slate-400">Applied: 10m ago</span>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-slate-800 border border-purple-500/30 flex items-center justify-center text-xl text-purple-400 font-display font-black">
            AS
          </div>
          <div>
            <h4 class="text-xs font-bold text-white">Anil Sharma</h4>
            <p class="text-[10px] text-slate-400 font-mono">Govt ITI Turner & Machinist • 7 Yrs Exp</p>
            <span class="text-[9px] font-mono text-emerald-400">Aadhaar: XXXX-XXXX-9182</span>
          </div>
        </div>

        <!-- Document Previews -->
        <div class="space-y-1.5 pt-1">
          <div class="p-2 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-id-card text-purple-400"></i>
              <span class="text-slate-300 font-mono text-[10px]">Aadhaar_Front_Back.pdf</span>
            </div>
            <button onclick="alert('Viewing Aadhaar document in secure sandbox...')" class="text-purple-400 text-[10px] font-mono hover:underline">Inspect</button>
          </div>

          <div class="p-2 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-certificate text-amber-400"></i>
              <span class="text-slate-300 font-mono text-[10px]">NCVT_Trade_Certificate.pdf</span>
            </div>
            <button onclick="alert('Viewing NCVT Mechanical Certificate...')" class="text-amber-400 text-[10px] font-mono hover:underline">Inspect</button>
          </div>
        </div>

        <!-- Approval Actions -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <button onclick="alert('Technician Application Rejected with reason.')" class="py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 font-bold text-xs hover:bg-red-500/20">
            Reject Application
          </button>
          <button onclick="alert('Technician Approved! Badge granted and live on dispatch radar.')" class="py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display font-black text-xs shadow-lg shadow-purple-600/30">
            Approve & Grant Badge
          </button>
        </div>
      </div>

      <!-- LIVE CITY TELEMETRY STATS -->
      <div class="grid grid-cols-2 gap-2">
        <div class="glass-panel rounded-2xl p-3 border border-white/10 text-center">
          <span class="text-[9px] font-mono text-slate-400 block">Verified Techs (BLR)</span>
          <span class="text-lg font-mono font-black text-emerald-400">1,151</span>
        </div>
        <div class="glass-panel rounded-2xl p-3 border border-white/10 text-center">
          <span class="text-[9px] font-mono text-slate-400 block">Avg MTTR (Recovery)</span>
          <span class="text-lg font-mono font-black text-amber-400">28 mins</span>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- VIEW 6: DESIGN SYSTEM TOKENS & SPECS -->
    <!-- ========================================== -->
    <div id="screen-tokens" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-24">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs border border-pink-500/30">
            <i class="fa-solid fa-palette"></i>
          </div>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">UPTIME Design Tokens</h3>
            <span class="text-[9px] font-mono text-pink-400">Primitive • Semantic • Component</span>
          </div>
        </div>
        <button onclick="switchScreen('owner')" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center hover:text-white border border-white/10">
          <i class="fa-solid fa-chevron-left text-xs"></i>
        </button>
      </div>

      <!-- Color Swatches -->
      <div class="space-y-2">
        <span class="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">Dynamic 3-Theme Palettes:</span>
        <div class="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
          <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <span class="w-4 h-4 rounded-full bg-amber-500 mx-auto block mb-1"></span>
            <strong>Industrial</strong>
            <span class="text-[8px] text-slate-400 block">Amber #F59E0B</span>
          </div>
          <div class="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <span class="w-4 h-4 rounded-full bg-red-500 mx-auto block mb-1"></span>
            <strong>Automobile</strong>
            <span class="text-[8px] text-slate-400 block">Crimson #EF4444</span>
          </div>
          <div class="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <span class="w-4 h-4 rounded-full bg-cyan-500 mx-auto block mb-1"></span>
            <strong>Electronics</strong>
            <span class="text-[8px] text-slate-400 block">Cyan #06B6D4</span>
          </div>
        </div>
      </div>

      <!-- Typography Tokens -->
      <div class="space-y-2">
        <span class="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">Typography Hierarchy:</span>
        <div class="glass-panel rounded-2xl p-3 border border-white/10 space-y-2">
          <div>
            <span class="text-[8px] font-mono text-slate-400">Display / Hero (Cabinet Grotesk 900)</span>
            <div class="font-display font-black text-base text-white">UPTIME: ZERO DOWNTIME</div>
          </div>
          <div>
            <span class="text-[8px] font-mono text-slate-400">Body & UI (Plus Jakarta Sans 600)</span>
            <div class="font-medium text-xs text-slate-200">Certified industrial mechanics within 15 minutes.</div>
          </div>
          <div>
            <span class="text-[8px] font-mono text-slate-400">Telemetry & Numbers (JetBrains Mono 700)</span>
            <div class="font-mono font-bold text-xs text-emerald-400">PIN: 4821 • 4,210 Hz FFT • ETA 11m</div>
          </div>
        </div>
      </div>
    </div>

  </main>

  <script>
    // Portal dynamic content dictionary
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

    function switchScreen(screenKey) {
      const screens = ['owner', 'ai', 'radar', 'tech', 'admin', 'tokens'];
      screens.forEach(s => {
        const el = document.getElementById(`screen-${s}`);
        const btn = document.getElementById(`viewBtn-${s}`);
        if (s === screenKey) {
          el.classList.remove('hidden');
          btn.className = 'px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center gap-1.5 transition-all';
        } else {
          el.classList.add('hidden');
          btn.className = 'px-3 py-1.5 rounded-lg text-slate-400 hover:text-white flex items-center gap-1.5 transition-all';
        }
      });
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
        <div onclick="switchScreen('ai')" class="glass-panel rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-white/20 transition-all">
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
          <div onclick="selectMachine('${m}')" class="p-2 hover:bg-white/10 rounded-xl cursor-pointer flex items-center justify-between text-slate-200">
            <span>${m}</span>
            <span class="text-[10px] font-mono text-amber-400">Diagnose & Triage →</span>
          </div>
        `).join('');
      }
    }

    function selectMachine(name) {
      document.getElementById('masterSearch').value = name;
      document.getElementById('searchResults').classList.add('hidden');
      switchScreen('ai');
    }
  </script>
</body>
</html>
"""

os.makedirs('F:/uptime/design-system/dist', exist_ok=True)
with open('F:/uptime/design-system/index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

with open('F:/uptime/design-system/dist/index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Successfully generated F:/uptime/design-system/index.html ({len(html_content)} bytes)")
