import os

html_template = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UPTIME — Master Platform Design System (18 Production Screens)</title>
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

  <!-- TOP MASTER APP CONTROL HEADER & SCREEN MATRIX -->
  <header class="w-full max-w-6xl mb-4 p-3.5 glass-panel rounded-2xl border border-white/10 z-40 space-y-3">
    <div class="flex flex-col md:flex-row items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-display font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.5)]">
          U
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base font-display font-black tracking-tight text-white">UPTIME MASTER SUITE</h1>
            <span class="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">18 Screens • Student Edition</span>
          </div>
          <p class="text-[11px] text-slate-400 font-mono">Downtime ends here • Full Owner, Technician & Admin Architecture</p>
        </div>
      </div>

      <!-- Quick Category Filters for Screens -->
      <div class="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/5 text-[10px] font-mono">
        <span class="text-slate-500 px-2">Filter View:</span>
        <button onclick="filterCat('all')" id="f-all" class="px-2 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold">All 18</button>
        <button onclick="filterCat('owner')" id="f-owner" class="px-2 py-1 rounded-lg text-slate-400 hover:text-white">Owner</button>
        <button onclick="filterCat('protocol')" id="f-protocol" class="px-2 py-1 rounded-lg text-slate-400 hover:text-white">Protocol</button>
        <button onclick="filterCat('tech')" id="f-tech" class="px-2 py-1 rounded-lg text-slate-400 hover:text-white">Technician</button>
        <button onclick="filterCat('admin')" id="f-admin" class="px-2 py-1 rounded-lg text-slate-400 hover:text-white">Admin</button>
      </div>
    </div>

    <!-- 18 SCREEN PILL PICKER SCROLLER -->
    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px] font-semibold" id="screenPicker">
      <!-- 1 --> <button onclick="setScreen(1)" id="btn-s1" class="px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold whitespace-nowrap">01. Splash & Persona</button>
      <!-- 2 --> <button onclick="setScreen(2)" id="btn-s2" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">02. Owner Auth & Profile</button>
      <!-- 3 --> <button onclick="setScreen(3)" id="btn-s3" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">03. 3-Portal Home</button>
      <!-- 4 --> <button onclick="setScreen(4)" id="btn-s4" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">04. A-Z Catalogue</button>
      <!-- 5 --> <button onclick="setScreen(5)" id="btn-s5" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">05. Gemini Sound AI</button>
      <!-- 6 --> <button onclick="setScreen(6)" id="btn-s6" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">06. Agora HD Video</button>
      <!-- 7 --> <button onclick="setScreen(7)" id="btn-s7" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">07. Smart Dispatch</button>
      <!-- 8 --> <button onclick="setScreen(8)" id="btn-s8" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">08. Live Radar & OTP</button>
      <!-- 9 --> <button onclick="setScreen(9)" id="btn-s9" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">09. Razorpay Escrow</button>
      <!-- 10 --> <button onclick="setScreen(10)" id="btn-s10" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">10. Asset Health Vault</button>
      <!-- 11 --> <button onclick="setScreen(11)" id="btn-s11" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">11. Tech Govt KYC</button>
      <!-- 12 --> <button onclick="setScreen(12)" id="btn-s12" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">12. Tech Radar HUD</button>
      <!-- 13 --> <button onclick="setScreen(13)" id="btn-s13" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">13. In-Route GPS Nav</button>
      <!-- 14 --> <button onclick="setScreen(14)" id="btn-s14" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">14. Customer OTP Keypad</button>
      <!-- 15 --> <button onclick="setScreen(15)" id="btn-s15" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">15. Camera Evidence</button>
      <!-- 16 --> <button onclick="setScreen(16)" id="btn-s16" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">16. Tech Wallet & Pay</button>
      <!-- 17 --> <button onclick="setScreen(17)" id="btn-s17" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">17. Admin Command HUD</button>
      <!-- 18 --> <button onclick="setScreen(18)" id="btn-s18" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap">18. 30-Day Warranty</button>
    </div>
  </header>

  <!-- SCREEN VIEWPORT CHASSIS (CYBER-INDUSTRIAL SMARTPHONE) -->
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
    <!-- SCREEN 1: SPLASH & PERSONA SELECTOR -->
    <!-- ======================================================== -->
    <div id="screen-1" class="flex-1 flex flex-col p-6 z-20 justify-between">
      <div class="text-center pt-8 space-y-3">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-display font-black text-3xl shadow-[0_0_30px_rgba(245,158,11,0.6)]">
          U
        </div>
        <div>
          <h2 class="text-2xl font-display font-black text-white tracking-tight">UPTIME</h2>
          <p class="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest mt-1">Downtime Ends Here</p>
          <p class="text-[11px] text-slate-400 mt-2 max-w-xs mx-auto">India's first real-time emergency triage and zero-downtime field engineering network.</p>
        </div>
      </div>

      <!-- Persona Cards -->
      <div class="space-y-3 my-auto">
        <span class="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold block text-center">Select Your Platform Role:</span>

        <div onclick="setScreen(2)" class="glass-panel rounded-2xl p-4 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer flex items-center gap-3.5 group">
          <div class="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
            <i class="fa-solid fa-industry"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Plant & Asset Owner</span>
              <i class="fa-solid fa-arrow-right text-[10px] text-amber-400"></i>
            </h3>
            <p class="text-[10px] text-slate-400">Factories, vehicle fleets, and commercial equipment managers</p>
          </div>
        </div>

        <div onclick="setScreen(11)" class="glass-panel rounded-2xl p-4 border border-blue-500/30 hover:border-blue-400 transition-all cursor-pointer flex items-center gap-3.5 group">
          <div class="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
            <i class="fa-solid fa-wrench"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Certified Technician</span>
              <i class="fa-solid fa-arrow-right text-[10px] text-blue-400"></i>
            </h3>
            <p class="text-[10px] text-slate-400">Verified mechanical, electrical & automotive engineers</p>
          </div>
        </div>
      </div>

      <div class="text-center text-[10px] text-slate-500 font-mono pb-2">
        Protected by Razorpay Escrow & Govt KYC
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- SCREEN 2: OWNER AUTH & FACTORY PROFILE -->
    <!-- ======================================================== -->
    <div id="screen-2" class="hidden flex-1 flex flex-col p-6 z-20 justify-between">
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <button onclick="setScreen(1)" class="w-8 h-8 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <span class="text-xs font-mono text-slate-400 uppercase">Step 1 of 2 • Authentication</span>
        </div>
        <div>
          <h2 class="text-lg font-display font-black text-white">Owner Registration</h2>
          <p class="text-xs text-slate-400">Link your factory or business to the emergency response grid.</p>
        </div>

        <div class="space-y-3 pt-2">
          <div>
            <label class="text-[10px] font-mono text-slate-400 block mb-1">Mobile Number (India)</label>
            <div class="flex gap-2">
              <span class="px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs font-mono text-slate-300 flex items-center">+91</span>
              <input type="tel" value="98450 12345" class="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none">
            </div>
          </div>

          <div>
            <label class="text-[10px] font-mono text-slate-400 block mb-1">Factory / Workshop Name</label>
            <input type="text" value="Apex Aerospace Precision Tooling Ltd" class="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
          </div>

          <div>
            <label class="text-[10px] font-mono text-slate-400 block mb-1">Industrial Zone / Cluster</label>
            <div class="p-2.5 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-xs text-slate-200">
              <span class="flex items-center gap-2"><i class="fa-solid fa-location-dot text-amber-400"></i> Peenya Industrial Area, Phase II</span>
              <i class="fa-solid fa-check text-emerald-400"></i>
            </div>
          </div>

          <div>
            <label class="text-[10px] font-mono text-slate-400 block mb-1">GSTIN Number (Optional)</label>
            <input type="text" value="29AABCA1234F1Z8" class="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none">
          </div>
        </div>
      </div>

      <button onclick="setScreen(3)" class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-display font-black text-xs shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2">
        <span>Enter Command Center</span>
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>

    <!-- ======================================================== -->
    <!-- SCREEN 3: 3-PORTAL OWNER HOME (THE CORE) -->
    <!-- ======================================================== -->
    <div id="screen-3" class="hidden flex-1 flex flex-col overflow-hidden z-20">
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

      <!-- AJIO-STYLE 3-PORTAL SWITCHER -->
      <div class="p-3 z-20 shrink-0">
        <div class="relative p-1 bg-slate-950/90 rounded-2xl border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] grid grid-cols-3 gap-1">
          <button onclick="setPortal('industries')" id="tabBtn-industries" class="relative py-2 px-1 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1 bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.4)]">
            <div class="flex items-center gap-1"><i class="fa-solid fa-industry text-[11px]"></i><span class="font-display text-[11px]">Industries</span></div>
            <span class="text-[8px] font-mono uppercase tracking-widest font-black opacity-80">1,151 Techs</span>
          </button>
          <button onclick="setPortal('automobile')" id="tabBtn-automobile" class="relative py-2 px-1 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200">
            <div class="flex items-center gap-1"><i class="fa-solid fa-car-rear text-[11px]"></i><span class="font-display text-[11px]">Automobile</span></div>
            <span class="text-[8px] font-mono uppercase tracking-widest opacity-60">24/7 SOS</span>
          </button>
          <button onclick="setPortal('electronics')" id="tabBtn-electronics" class="relative py-2 px-1 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200">
            <div class="flex items-center gap-1"><i class="fa-solid fa-bolt-lightning text-[11px]"></i><span class="font-display text-[11px]">Electronics</span></div>
            <span class="text-[8px] font-mono uppercase tracking-widest opacity-60">Appliances</span>
          </button>
        </div>
      </div>

      <!-- SCROLLABLE DASHBOARD -->
      <div class="flex-1 overflow-y-auto px-4 pb-20 space-y-3.5 z-10 no-scrollbar">
        <!-- Search bar -->
        <div class="relative glass-panel rounded-2xl p-1 flex items-center border border-white/10">
          <div class="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 ml-1"><i class="fa-solid fa-magnifying-glass text-xs"></i></div>
          <input type="text" placeholder="Search CNC lathe, boiler, hydraulic press..." onclick="setScreen(4)" readonly class="w-full bg-transparent px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none cursor-pointer">
          <button onclick="setScreen(5)" class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mr-1"><i class="fa-solid fa-waveform-lines text-xs"></i></button>
        </div>

        <!-- BREAKDOWN COMMAND HERO -->
        <div class="glass-panel rounded-3xl p-4 relative overflow-hidden shimmer-effect border border-amber-500/30">
          <div class="relative z-10 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[9px] font-mono font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span> EMERGENCY BREAKDOWN CENTER
              </span>
              <span class="text-[9px] font-mono text-slate-400">&lt; 30m Guarantee</span>
            </div>
            <h2 class="text-sm font-display font-black text-white leading-tight">Spindle Jam or Boiler Stalled?</h2>
            <p class="text-[10px] text-slate-300 leading-snug">Zero-downtime field dispatch with calibrated Level-3 engineers.</p>
            <div class="pt-1 grid grid-cols-2 gap-2">
              <button onclick="setScreen(5)" class="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-display font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/30">
                <i class="fa-solid fa-bolt text-xs"></i><span>Sound AI Triage</span>
              </button>
              <button onclick="setScreen(8)" class="py-2 px-3 rounded-xl bg-slate-900 text-slate-200 border border-white/10 font-bold text-xs flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-radar text-amber-400 text-xs"></i><span>Radar Track</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 4 SATELLITES -->
        <div class="grid grid-cols-4 gap-2">
          <div onclick="setScreen(5)" class="glass-panel rounded-2xl p-2 text-center cursor-pointer hover:border-amber-400/50">
            <div class="w-8 h-8 mx-auto rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs mb-1"><i class="fa-solid fa-microphone-lines"></i></div>
            <span class="text-[9px] font-semibold text-slate-200 block">Sound AI</span>
          </div>
          <div onclick="setScreen(6)" class="glass-panel rounded-2xl p-2 text-center cursor-pointer hover:border-blue-400/50">
            <div class="w-8 h-8 mx-auto rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs mb-1"><i class="fa-solid fa-video"></i></div>
            <span class="text-[9px] font-semibold text-slate-200 block">Video Call</span>
          </div>
          <div onclick="setScreen(10)" class="glass-panel rounded-2xl p-2 text-center cursor-pointer hover:border-purple-400/50">
            <div class="w-8 h-8 mx-auto rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs mb-1"><i class="fa-solid fa-cube"></i></div>
            <span class="text-[9px] font-semibold text-slate-200 block">Assets</span>
          </div>
          <div onclick="setScreen(18)" class="glass-panel rounded-2xl p-2 text-center cursor-pointer hover:border-emerald-400/50">
            <div class="w-8 h-8 mx-auto rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs mb-1"><i class="fa-solid fa-shield-halved"></i></div>
            <span class="text-[9px] font-semibold text-slate-200 block">Warranty</span>
          </div>
        </div>

        <!-- POPULAR CATEGORIES -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-display font-extrabold uppercase tracking-wider text-slate-300">Catalogues (1,151+ Machines)</span>
            <button onclick="setScreen(4)" class="text-[10px] font-tech text-amber-400 font-bold">View A-Z →</button>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div onclick="setScreen(5)" class="glass-panel rounded-2xl p-2.5 flex items-center gap-2.5 cursor-pointer">
              <div class="w-8 h-8 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-amber-400 text-xs"><i class="fa-solid fa-gear"></i></div>
              <div><h4 class="text-[11px] font-bold text-white">CNC 5-Axis Mill</h4><p class="text-[8px] text-slate-400 font-mono">Fanuc / Siemens</p></div>
            </div>
            <div onclick="setScreen(5)" class="glass-panel rounded-2xl p-2.5 flex items-center gap-2.5 cursor-pointer">
              <div class="w-8 h-8 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-amber-400 text-xs"><i class="fa-solid fa-fire-flame-curved"></i></div>
              <div><h4 class="text-[11px] font-bold text-white">IBR Steam Boiler</h4><p class="text-[8px] text-slate-400 font-mono">Thermic Fluid</p></div>
            </div>
          </div>
        </div>
      </div>

      <!-- BOTTOM NAV BAR -->
      <div class="h-16 px-6 bg-slate-950/90 backdrop-blur-xl border-t border-white/[0.08] flex items-center justify-between absolute bottom-0 left-0 right-0 z-30">
        <button onclick="setScreen(3)" class="flex flex-col items-center gap-0.5 text-amber-400"><i class="fa-solid fa-house-chimney text-xs"></i><span class="text-[8px] font-tech font-bold uppercase">Home</span></button>
        <button onclick="setScreen(4)" class="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white"><i class="fa-solid fa-book-open text-xs"></i><span class="text-[8px] font-tech font-bold uppercase">Catalog</span></button>
        <button onclick="setScreen(8)" class="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white"><i class="fa-solid fa-radar text-xs text-emerald-400"></i><span class="text-[8px] font-tech font-bold uppercase text-emerald-400">Radar</span></button>
        <button onclick="setScreen(10)" class="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white"><i class="fa-solid fa-layer-group text-xs"></i><span class="text-[8px] font-tech font-bold uppercase">Assets</span></button>
        <button onclick="setScreen(12)" class="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white"><i class="fa-solid fa-wrench text-xs text-blue-400"></i><span class="text-[8px] font-tech font-bold uppercase text-blue-400">Tech</span></button>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- SCREEN 4: A-TO-Z MACHINE CATALOGUE EXPLORER -->
    <!-- ======================================================== -->
    <div id="screen-4" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="setScreen(3)" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">A-to-Z Machine Catalogue</h3>
            <span class="text-[9px] font-mono text-amber-400">1,151 Heavy & Industrial Machines</span>
          </div>
        </div>
      </div>

      <!-- Alphabetical Index Scroller -->
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

      <!-- Catalogue Listings -->
      <div class="space-y-2">
        <div onclick="setScreen(5)" class="glass-panel rounded-2xl p-3 border border-white/10 flex items-center justify-between hover:border-amber-400/40 cursor-pointer">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-base"><i class="fa-solid fa-gear"></i></div>
            <div>
              <h4 class="text-xs font-bold text-white">Air Compressor (Rotary Screw 100 HP)</h4>
              <p class="text-[9px] text-slate-400 font-mono">Atlas Copco • Ingersoll Rand • Elgi</p>
              <span class="text-[8px] font-mono text-emerald-400">32 Verified Specialists within 12km</span>
            </div>
          </div>
          <i class="fa-solid fa-chevron-right text-xs text-slate-500"></i>
        </div>

        <div onclick="setScreen(5)" class="glass-panel rounded-2xl p-3 border border-white/10 flex items-center justify-between hover:border-amber-400/40 cursor-pointer">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-base"><i class="fa-solid fa-fire-burner"></i></div>
            <div>
              <h4 class="text-xs font-bold text-white">Boiler (IBR Steam 2 Ton/Hr)</h4>
              <p class="text-[9px] text-slate-400 font-mono">Thermax • Forbes Marshall</p>
              <span class="text-[8px] font-mono text-emerald-400">18 Class-A Certified Welders</span>
            </div>
          </div>
          <i class="fa-solid fa-chevron-right text-xs text-slate-500"></i>
        </div>

        <div onclick="setScreen(5)" class="glass-panel rounded-2xl p-3 border border-white/10 flex items-center justify-between hover:border-amber-400/40 cursor-pointer">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-base"><i class="fa-solid fa-microchip"></i></div>
            <div>
              <h4 class="text-xs font-bold text-white">CNC 5-Axis Machining Center</h4>
              <p class="text-[9px] text-slate-400 font-mono">DMG Mori • Mazak • Haas</p>
              <span class="text-[8px] font-mono text-emerald-400">24 Master Level-3 Spindle Techs</span>
            </div>
          </div>
          <i class="fa-solid fa-chevron-right text-xs text-slate-500"></i>
        </div>

        <div onclick="setScreen(5)" class="glass-panel rounded-2xl p-3 border border-white/10 flex items-center justify-between hover:border-amber-400/40 cursor-pointer">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-base"><i class="fa-solid fa-compress"></i></div>
            <div>
              <h4 class="text-xs font-bold text-white">Hydraulic Deep Drawing Press (500T)</h4>
              <p class="text-[9px] text-slate-400 font-mono">Rexroth • Vickers Hydraulics</p>
              <span class="text-[8px] font-mono text-emerald-400">15 Valve & Seal Specialists</span>
            </div>
          </div>
          <i class="fa-solid fa-chevron-right text-xs text-slate-500"></i>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- SCREEN 5: GEMINI 3.8 FLASH SOUND DIAGNOSTIC (STEP 1) -->
    <!-- ======================================================== -->
    <div id="screen-5" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="setScreen(3)" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Gemini 3.8 Flash Audio FFT</h3>
            <span class="text-[9px] font-mono text-emerald-400">Interactions API Live • Step 1</span>
          </div>
        </div>
      </div>

      <!-- Real-Time Spectrogram -->
      <div class="glass-panel rounded-2xl p-4 text-center border border-amber-500/30 space-y-2">
        <div class="flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span class="text-amber-400 font-bold flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> RECORDING SPINDLE NOISE
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
        <h4 class="text-xs font-display font-black text-white">Spindle Angular Contact Bearing Failure</h4>
        <p class="text-[10px] text-slate-300 leading-relaxed">
          Gemini sound wave telemetry isolates inner raceway flaking with impending shaft lockup. Immediate shutdown mandated.
        </p>
      </div>

      <!-- Action Split -->
      <div class="space-y-2 pt-1">
        <div onclick="setScreen(6)" class="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:border-blue-400/50">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs"><i class="fa-solid fa-video"></i></div>
            <div><h5 class="text-xs font-bold text-white">Step 2: Agora Video Consult</h5><p class="text-[9px] text-slate-400">Remote L3 Engineer triage (₹499)</p></div>
          </div>
          <span class="text-blue-400 text-xs font-bold">Connect →</span>
        </div>

        <div onclick="setScreen(7)" class="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between cursor-pointer hover:border-amber-400">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black"><i class="fa-solid fa-truck-fast"></i></div>
            <div><h5 class="text-xs font-bold text-white">Step 3: Emergency Dispatch</h5><p class="text-[9px] text-amber-400/90 font-mono">60% Skill + 40% Distance (14m ETA)</p></div>
          </div>
          <span class="px-2.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-[10px] font-bold">Match Tech →</span>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- SCREEN 6: AGORA HD VIDEO CALL CONSULTATION (STEP 2) -->
    <!-- ======================================================== -->
    <div id="screen-6" class="hidden flex-1 flex flex-col p-4 z-20 overflow-hidden relative">
      <!-- Simulated Video Feed -->
      <div class="absolute inset-0 bg-slate-900 overflow-hidden flex items-center justify-center">
        <!-- Background industrial machine simulation -->
        <div class="text-center space-y-2 opacity-30">
          <i class="fa-solid fa-gear text-9xl text-slate-400 animate-spin" style="animation-duration: 20s"></i>
          <p class="font-mono text-xs">AGORA WEBRTC HD VIDEO FEED (1080P)</p>
        </div>

        <!-- Laser Pointer AR overlay -->
        <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div class="w-12 h-12 rounded-full border-2 border-red-500 border-dashed animate-pulse flex items-center justify-center mx-auto">
            <span class="w-2 h-2 rounded-full bg-red-500"></span>
          </div>
          <span class="text-[9px] font-mono bg-red-500/80 text-white px-2 py-0.5 rounded-full mt-1 inline-block">Engineer Pointer: Inspect Bearing 7014C</span>
        </div>

        <!-- Picture-in-Picture of Remote Engineer -->
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

      <!-- Floating Controls Bar -->
      <div class="relative mt-auto mb-6 p-3 glass-panel rounded-2xl border border-white/10 flex items-center justify-around z-30">
        <button class="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"><i class="fa-solid fa-microphone"></i></button>
        <button class="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"><i class="fa-solid fa-camera-rotate"></i></button>
        <button onclick="setScreen(7)" class="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30">
          <i class="fa-solid fa-truck-fast"></i><span>Dispatch Tech</span>
        </button>
        <button onclick="setScreen(3)" class="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center"><i class="fa-solid fa-phone-slash"></i></button>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- SCREEN 7: SMART EMERGENCY DISPATCH MATCHING (STEP 3) -->
    <!-- ======================================================== -->
    <div id="screen-7" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="setScreen(5)" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Technician Matching Radar</h3>
            <span class="text-[9px] font-mono text-amber-400">60% Skill + 40% Distance Scoring</span>
          </div>
        </div>
      </div>

      <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 font-mono">
        Target Machine: <strong>Mazak CNC VMC-850 (Spindle Seizure)</strong>
      </div>

      <!-- Candidate 1 (Top Match) -->
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
              <span class="text-emerald-400 font-mono">Aadhaar & Police Verified</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
          <div class="p-1.5 rounded-lg bg-slate-950/80 border border-white/5">Rate: <strong>₹2,850 Base</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-950/80 border border-white/5">Tooling: <strong>Digital Dial & Puller</strong></div>
        </div>

        <button onclick="setScreen(8)" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-display font-black text-xs shadow-lg shadow-amber-500/30">
          Confirm & Dispatch Rajesh Now →
        </button>
      </div>

      <!-- Candidate 2 -->
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
    <!-- SCREEN 8: LIVE MISSION RADAR & ARRIVAL OTP TRACKING -->
    <!-- ======================================================== -->
    <div id="screen-8" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="setScreen(3)" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Live Mission Radar</h3>
            <span class="text-[9px] font-mono text-emerald-400">Google Maps Routes API Telemetry</span>
          </div>
        </div>
      </div>

      <!-- Interactive Map Radar HUD -->
      <div class="h-48 rounded-3xl bg-slate-950 relative overflow-hidden border border-emerald-500/30 flex items-center justify-center">
        <svg class="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid8" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="#10b981" stroke-width="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid8)" />
          <circle cx="50%" cy="50%" r="70" fill="none" stroke="#10b981" stroke-width="1" stroke-dasharray="4 4" />
        </svg>

        <div class="absolute top-8 right-12 flex flex-col items-center">
          <div class="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs shadow-[0_0_15px_rgba(245,158,11,0.8)]"><i class="fa-solid fa-industry"></i></div>
          <span class="text-[8px] font-mono font-bold bg-slate-950/80 px-1 rounded text-amber-400 mt-1">Factory #4</span>
        </div>

        <div class="absolute bottom-12 left-10 flex flex-col items-center animate-bounce">
          <div class="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black shadow-[0_0_20px_rgba(16,185,129,0.8)]"><i class="fa-solid fa-wrench"></i></div>
          <span class="text-[8px] font-mono font-bold bg-slate-950/80 px-1 rounded text-emerald-400 mt-1">Rajesh M. (1.8 km)</span>
        </div>

        <div class="absolute bottom-2 left-3 right-3 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-white/10 flex items-center justify-between text-[10px] font-mono">
          <span class="text-slate-300">ETA: <strong class="text-emerald-400">11 mins</strong></span>
          <span class="text-slate-400">Routes API: Peenya Ring Rd</span>
        </div>
      </div>

      <!-- ARRIVAL OTP BOX -->
      <div class="glass-panel rounded-3xl p-3 border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 text-center space-y-1.5">
        <span class="text-[9px] font-mono uppercase tracking-widest text-slate-400">Give Arrival OTP to Technician Upon Arrival:</span>
        <div class="flex items-center justify-center gap-2 py-0.5">
          <span class="w-10 h-12 rounded-xl bg-slate-950 border border-emerald-500/40 text-xl font-mono font-black text-emerald-400 flex items-center justify-center">4</span>
          <span class="w-10 h-12 rounded-xl bg-slate-950 border border-emerald-500/40 text-xl font-mono font-black text-emerald-400 flex items-center justify-center">8</span>
          <span class="w-10 h-12 rounded-xl bg-slate-950 border border-emerald-500/40 text-xl font-mono font-black text-emerald-400 flex items-center justify-center">2</span>
          <span class="w-10 h-12 rounded-xl bg-slate-950 border border-emerald-500/40 text-xl font-mono font-black text-emerald-400 flex items-center justify-center">1</span>
        </div>
        <p class="text-[8px] text-slate-400 font-mono">Escrow payment is secured. Released only after full job verification.</p>
      </div>

      <!-- Tech Profile & Actions -->
      <div class="glass-panel rounded-2xl p-2.5 border border-white/10 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-slate-800 text-emerald-400 font-display font-black flex items-center justify-center">RM</div>
          <div><h4 class="text-xs font-bold text-white">Rajesh Murthy</h4><p class="text-[9px] text-slate-400 font-mono">En Route on Royal Enfield Bullet</p></div>
        </div>
        <div class="flex gap-1.5">
          <button onclick="setScreen(9)" class="px-2.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-[10px]">Payment Details</button>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- SCREEN 9: RAZORPAY PAYMENT & ESCROW SETTLEMENT -->
    <!-- ======================================================== -->
    <div id="screen-9" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="setScreen(8)" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Razorpay Escrow Vault</h3>
            <span class="text-[9px] font-mono text-emerald-400">Order: order_Txoq3xH32SklTi</span>
          </div>
        </div>
      </div>

      <!-- Transparent Breakdown -->
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

      <!-- Escrow Protection Milestone Bar -->
      <div class="glass-panel rounded-2xl p-3 border border-emerald-500/30 space-y-2">
        <span class="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Escrow Release Lifecycle:</span>
        <div class="space-y-1.5 text-[10px]">
          <div class="flex items-center gap-2 text-emerald-400 font-bold"><i class="fa-solid fa-circle-check"></i> 1. Funds Deposited into Escrow</div>
          <div class="flex items-center gap-2 text-amber-400"><i class="fa-solid fa-spinner fa-spin"></i> 2. Technician Arrival Verified (OTP 4821)</div>
          <div class="flex items-center gap-2 text-slate-500"><i class="fa-solid fa-circle"></i> 3. Machine Repair & Before/After Proof</div>
          <div class="flex items-center gap-2 text-slate-500"><i class="fa-solid fa-circle"></i> 4. Escrow Released + 30-Day Warranty</div>
        </div>
      </div>

      <button onclick="setScreen(8)" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-display font-black text-xs shadow-lg shadow-emerald-500/30">
        Pay via Razorpay UPI / Cards (₹4,363)
      </button>
    </div>

    <!-- ======================================================== -->
    <!-- SCREEN 10: ASSET VAULT & PREDICTIVE HEALTH TELEMETRY -->
    <!-- ======================================================== -->
    <div id="screen-10" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="setScreen(3)" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Registered Machine Vault</h3>
            <span class="text-[9px] font-mono text-purple-400">IoT Telemetry & Health AI</span>
          </div>
        </div>
      </div>

      <!-- Asset 1 -->
      <div class="glass-panel rounded-2xl p-3.5 border border-white/10 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-white">Mazak VMC-850 (5-Axis)</span>
          <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">96.4% Health</span>
        </div>
        <p class="text-[10px] text-slate-400 font-mono">SN: MZK-2024-BLR • 3,420 Operating Hours</p>
        <div class="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
          <div class="bg-emerald-400 h-full rounded-full" style="width: 96%"></div>
        </div>
        <div class="p-2 rounded-xl bg-slate-950/80 border border-white/5 text-[9px] text-slate-300">
          <strong>AI Recommendation:</strong> Spindle bearing replacement optimal in <strong>42 hours</strong>.
        </div>
      </div>

      <!-- Asset 2 -->
      <div class="glass-panel rounded-2xl p-3.5 border border-white/10 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-white">Thermax IBR Steam Boiler 2T</span>
          <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">81.2% Health</span>
        </div>
        <p class="text-[10px] text-slate-400 font-mono">SN: THX-BLR-09 • Pressure Valve Inspection Due</p>
        <div class="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
          <div class="bg-amber-400 h-full rounded-full" style="width: 81%"></div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- SCREEN 11: TECHNICIAN REGISTRATION & GOVT KYC -->
    <!-- ======================================================== -->
    <div id="screen-11" class="hidden flex-1 flex flex-col p-5 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="setScreen(1)" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Technician KYC Onboarding</h3>
            <span class="text-[9px] font-mono text-blue-400">Indian Citizenship & Govt Trade Gate</span>
          </div>
        </div>
      </div>

      <div class="space-y-2.5">
        <div>
          <label class="text-[10px] font-mono text-slate-400 block mb-1">Aadhaar Card Front & Back (PDF/JPG)</label>
          <div class="border border-dashed border-emerald-500/40 rounded-xl p-3 bg-emerald-500/5 text-center">
            <i class="fa-solid fa-id-card text-emerald-400 text-lg mb-1 block"></i>
            <span class="text-xs text-white font-bold block">Aadhaar_Verified_XXXX_9182.pdf</span>
            <span class="text-[8px] font-mono text-emerald-400">UIDAI Digilocker OCR Verified</span>
          </div>
        </div>

        <div>
          <label class="text-[10px] font-mono text-slate-400 block mb-1">NCVT / ITI / Diploma Trade Certificate</label>
          <div class="border border-dashed border-blue-500/40 rounded-xl p-3 bg-blue-500/5 text-center">
            <i class="fa-solid fa-certificate text-blue-400 text-lg mb-1 block"></i>
            <span class="text-xs text-white font-bold block">Govt_ITI_Machinist_Certificate.pdf</span>
            <span class="text-[8px] font-mono text-blue-400">NCVT Mechanical Engineering Level 3</span>
          </div>
        </div>

        <div>
          <label class="text-[10px] font-mono text-slate-400 block mb-1">Skill Specializations</label>
          <div class="flex flex-wrap gap-1 text-[10px]">
            <span class="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">CNC Fanuc</span>
            <span class="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">Siemens Sinumerik</span>
            <span class="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">Hydraulic Rams</span>
          </div>
        </div>
      </div>

      <button onclick="setScreen(12)" class="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-display font-black text-xs shadow-lg shadow-blue-600/30">
        Submit & Open Field Workstation →
      </button>
    </div>

    <!-- ======================================================== -->
    <!-- SCREEN 12: TECHNICIAN FIELD WORKSTATION HUD -->
    <!-- ======================================================== -->
    <div id="screen-12" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs"><i class="fa-solid fa-toolbox"></i></div>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Technician HUD</h3>
            <span class="text-[9px] font-mono text-emerald-400">Rajesh Murthy • Peenya Hub</span>
          </div>
        </div>
        <div class="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-full border border-emerald-500/30">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-[9px] font-mono font-bold text-emerald-400">ONLINE</span>
        </div>
      </div>

      <!-- INCOMING EMERGENCY DISPATCH BROADCAST CARD -->
      <div class="glass-panel rounded-3xl p-4 border border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 space-y-2.5">
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

        <div class="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
          <div class="p-1.5 rounded-xl bg-slate-950/80 border border-white/5"><span class="text-[8px] text-slate-400 block">Payout</span><strong class="text-emerald-400">₹3,850</strong></div>
          <div class="p-1.5 rounded-xl bg-slate-950/80 border border-white/5"><span class="text-[8px] text-slate-400 block">Distance</span><strong class="text-slate-200">1.8 km</strong></div>
          <div class="p-1.5 rounded-xl bg-slate-950/80 border border-white/5"><span class="text-[8px] text-slate-400 block">Match</span><strong class="text-amber-400">98%</strong></div>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-1">
          <button onclick="setScreen(3)" class="py-2 rounded-xl bg-white/5 text-slate-400 text-xs font-bold">Decline</button>
          <button onclick="setScreen(13)" class="py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30">
            Accept Dispatch →
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 text-center text-xs">
        <button onclick="setScreen(16)" class="p-3 rounded-2xl glass-panel border border-white/10 hover:border-white/20">
          <span class="text-[9px] font-mono text-slate-400 block">Today's Earnings</span>
          <strong class="text-base font-mono text-emerald-400 font-black">₹7,700</strong>
        </button>
        <button onclick="setScreen(15)" class="p-3 rounded-2xl glass-panel border border-white/10 hover:border-white/20">
          <span class="text-[9px] font-mono text-slate-400 block">Evidence Vault</span>
          <strong class="text-xs font-mono text-blue-400 font-bold">Pre/Post Camera</strong>
        </button>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- SCREEN 13: IN-ROUTE TURN-BY-TURN NAVIGATION -->
    <!-- ======================================================== -->
    <div id="screen-13" class="hidden flex-1 flex flex-col p-4 z-20 overflow-hidden relative">
      <div class="absolute inset-0 bg-slate-950 flex items-center justify-center">
        <!-- Map route simulation -->
        <svg class="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <line x1="100" y1="400" x2="300" y2="150" stroke="#06b6d4" stroke-width="6" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- Navigation Banner -->
      <div class="relative z-30 p-3 bg-slate-900/90 rounded-2xl border border-white/10 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center text-lg font-black">
          <i class="fa-solid fa-arrow-turn-up"></i>
        </div>
        <div>
          <h4 class="text-xs font-bold text-white">In 200m, turn right onto Peenya 2nd Cross</h4>
          <p class="text-[10px] text-slate-400 font-mono">Factory #4 is on the left</p>
        </div>
      </div>

      <!-- Arrival Action -->
      <div class="relative mt-auto mb-6 p-3 glass-panel rounded-2xl border border-white/10 flex items-center justify-between z-30">
        <div>
          <span class="text-[9px] font-mono text-slate-400 block">Remaining: 1.2 km</span>
          <strong class="text-sm font-mono text-emerald-400">4 mins left</strong>
        </div>
        <button onclick="setScreen(14)" class="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-display font-black text-xs shadow-lg shadow-amber-500/30">
          I Have Arrived →
        </button>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- SCREEN 14: CUSTOMER ARRIVAL OTP NUMERIC KEYPAD -->
    <!-- ======================================================== -->
    <div id="screen-14" class="hidden flex-1 flex flex-col p-5 z-20 justify-between">
      <div class="space-y-3 text-center pt-2">
        <div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl mx-auto border border-amber-500/30">
          <i class="fa-solid fa-key"></i>
        </div>
        <div>
          <h2 class="text-base font-display font-black text-white">Enter Customer Arrival OTP</h2>
          <p class="text-xs text-slate-400">Ask the factory manager for their 4-digit verification code.</p>
        </div>

        <div class="flex items-center justify-center gap-3 py-2">
          <span class="w-12 h-14 rounded-2xl bg-slate-900 border border-amber-500 text-2xl font-mono font-black text-amber-400 flex items-center justify-center">4</span>
          <span class="w-12 h-14 rounded-2xl bg-slate-900 border border-amber-500 text-2xl font-mono font-black text-amber-400 flex items-center justify-center">8</span>
          <span class="w-12 h-14 rounded-2xl bg-slate-900 border border-amber-500 text-2xl font-mono font-black text-amber-400 flex items-center justify-center">2</span>
          <span class="w-12 h-14 rounded-2xl bg-slate-900 border border-amber-500 text-2xl font-mono font-black text-amber-400 flex items-center justify-center">1</span>
        </div>
      </div>

      <!-- Numeric Keypad Simulation -->
      <div class="grid grid-cols-3 gap-2 text-center font-mono font-bold text-base my-auto">
        <button class="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/5">1</button>
        <button class="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/5">2</button>
        <button class="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/5">3</button>
        <button class="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/5">4</button>
        <button class="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/5">5</button>
        <button class="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/5">6</button>
        <button class="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/5">7</button>
        <button class="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/5">8</button>
        <button class="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/5">9</button>
        <button class="py-3 rounded-xl bg-transparent text-slate-500">C</button>
        <button class="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/5">0</button>
        <button class="py-3 rounded-xl bg-transparent text-slate-400"><i class="fa-solid fa-delete-left"></i></button>
      </div>

      <button onclick="setScreen(15)" class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-display font-black text-xs shadow-lg shadow-emerald-500/30">
        Verify Arrival & Start Job →
      </button>
    </div>

    <!-- ======================================================== -->
    <!-- SCREEN 15: CAMERA EVIDENCE CHECKLIST (PRE/POST) -->
    <!-- ======================================================== -->
    <div id="screen-15" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="setScreen(14)" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Repair Evidence Vault</h3>
            <span class="text-[9px] font-mono text-emerald-400">Cloudinary Media Storage</span>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <!-- Pre-Repair Photo -->
        <div class="glass-panel rounded-2xl p-3 border border-white/10 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-white flex items-center gap-1.5"><i class="fa-solid fa-camera text-amber-400"></i> Pre-Repair Photo (Mandatory)</span>
            <span class="text-[9px] font-mono text-emerald-400">Uploaded</span>
          </div>
          <div class="h-28 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 text-xs font-mono">
            <i class="fa-solid fa-image text-2xl mr-2 text-amber-400"></i> Bearing_Spindle_Damage_Pre.jpg
          </div>
        </div>

        <!-- Post-Repair Working Proof -->
        <div class="glass-panel rounded-2xl p-3 border border-white/10 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-white flex items-center gap-1.5"><i class="fa-solid fa-video text-blue-400"></i> Post-Repair Proof (Spin Test)</span>
            <span class="text-[9px] font-mono text-emerald-400">Uploaded</span>
          </div>
          <div class="h-28 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 text-xs font-mono">
            <i class="fa-solid fa-circle-play text-2xl mr-2 text-blue-400"></i> Spindle_RPM_Test_Proof.mp4
          </div>
        </div>
      </div>

      <button onclick="setScreen(16)" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-display font-black text-xs shadow-lg shadow-emerald-500/30">
        Submit Job & Unlock Escrow Payout →
      </button>
    </div>

    <!-- ======================================================== -->
    <!-- SCREEN 16: TECHNICIAN WALLET & EARNINGS -->
    <!-- ======================================================== -->
    <div id="screen-16" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="setScreen(12)" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Technician Wallet</h3>
            <span class="text-[9px] font-mono text-emerald-400">Instant UPI Bank Settlements</span>
          </div>
        </div>
      </div>

      <div class="glass-panel rounded-3xl p-4 border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 text-center space-y-2">
        <span class="text-[9px] font-mono uppercase tracking-widest text-slate-400">Available Wallet Balance</span>
        <h2 class="text-3xl font-mono font-black text-emerald-400">₹7,700</h2>
        <p class="text-[9px] text-slate-400 font-mono">Linked UPI: rajesh.murthy@okhdfcbank</p>
        <button onclick="alert('Instant Payout of ₹7,700 dispatched to bank!')" class="py-2 px-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/30">
          Instant Withdraw to Bank →
        </button>
      </div>

      <!-- Recent Jobs List -->
      <div class="space-y-2">
        <span class="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">Completed Jobs Today:</span>
        <div class="glass-panel rounded-xl p-2.5 border border-white/10 flex items-center justify-between text-xs">
          <div><h5 class="font-bold text-white">Mazak VMC-850 Bearing Repair</h5><p class="text-[9px] text-slate-400 font-mono">Peenya Phase II • 1.5 hrs</p></div>
          <span class="font-mono font-bold text-emerald-400">+₹3,850</span>
        </div>
        <div class="glass-panel rounded-xl p-2.5 border border-white/10 flex items-center justify-between text-xs">
          <div><h5 class="font-bold text-white">Haas Lathe Chuck Alignment</h5><p class="text-[9px] text-slate-400 font-mono">Yeshwantpur Indl • 2 hrs</p></div>
          <span class="font-mono font-bold text-emerald-400">+₹3,850</span>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- SCREEN 17: ADMIN COMMAND HUD & KYC APPROVAL TERMINAL -->
    <!-- ======================================================== -->
    <div id="screen-17" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="setScreen(3)" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">Admin Command Terminal</h3>
            <span class="text-[9px] font-mono text-purple-400">Govt KYC Verification & City Telemetry</span>
          </div>
        </div>
      </div>

      <!-- Pending Verification Card -->
      <div class="glass-panel rounded-2xl p-3 border border-purple-500/40 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">1 Verification Pending</span>
          <span class="text-[9px] font-mono text-slate-400">Applied: 5m ago</span>
        </div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-slate-800 text-purple-400 font-display font-black flex items-center justify-center">AS</div>
          <div><h4 class="text-xs font-bold text-white">Anil Sharma</h4><p class="text-[9px] text-slate-400 font-mono">ITI Machinist • Aadhaar: XXXX-9182</p></div>
        </div>
        <div class="grid grid-cols-2 gap-2 pt-1">
          <button onclick="alert('Application rejected with feedback sent to tech.')" class="py-1.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">Reject</button>
          <button onclick="alert('Approved! Verified badge granted to Anil Sharma.')" class="py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold">Approve & Badge</button>
        </div>
      </div>

      <!-- Citywide Breakdown Radar Metrics -->
      <div class="grid grid-cols-2 gap-2 text-center text-xs">
        <div class="glass-panel rounded-xl p-3 border border-white/10"><span class="text-[9px] font-mono text-slate-400 block">Active Technicians (BLR)</span><strong class="text-lg font-mono text-emerald-400">1,151</strong></div>
        <div class="glass-panel rounded-xl p-3 border border-white/10"><span class="text-[9px] font-mono text-slate-400 block">Avg MTTR (Recovery)</span><strong class="text-lg font-mono text-amber-400">28 mins</strong></div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- SCREEN 18: 30-DAY ESCROW WARRANTY PROTECTION PORTAL -->
    <!-- ======================================================== -->
    <div id="screen-18" class="hidden flex-1 flex flex-col p-4 z-20 overflow-y-auto no-scrollbar space-y-3 pb-20">
      <div class="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2">
          <button onclick="setScreen(3)" class="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <div>
            <h3 class="text-xs font-display font-extrabold text-white">30-Day Escrow Warranty</h3>
            <span class="text-[9px] font-mono text-emerald-400">Per-Job Guaranteed Protection</span>
          </div>
        </div>
      </div>

      <div class="glass-panel rounded-3xl p-4 border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 text-center space-y-2">
        <div class="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mx-auto border border-emerald-500/30"><i class="fa-solid fa-shield-halved"></i></div>
        <h4 class="text-sm font-display font-black text-white">Uptime Zero-Downtime Warranty</h4>
        <p class="text-[10px] text-slate-300">If the repaired component fails within 30 days, we dispatch a senior Level-3 master engineer for free within 30 minutes.</p>
        <div class="p-2 rounded-xl bg-slate-950/80 border border-white/5 text-[9px] font-mono text-emerald-400">
          Certificate ID: UPTIME-WAR-2024-88419
        </div>
      </div>

      <button onclick="alert('Claim submitted! Senior engineer auto-dispatched.')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-display font-black text-xs shadow-lg shadow-emerald-500/30">
        Claim Free 30-Day Re-Dispatch
      </button>
    </div>

  </main>

  <script>
    function setScreen(num) {
      for (let i = 1; i <= 18; i++) {
        const el = document.getElementById(`screen-${i}`);
        const btn = document.getElementById(`btn-s${i}`);
        if (el) {
          if (i === num) {
            el.classList.remove('hidden');
          } else {
            el.classList.add('hidden');
          }
        }
        if (btn) {
          if (i === num) {
            btn.className = 'px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold whitespace-nowrap shadow-md';
          } else {
            btn.className = 'px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white whitespace-nowrap';
          }
        }
      }
      // Scroll picker into view
      const activeBtn = document.getElementById(`btn-s${num}`);
      if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    function filterCat(cat) {
      const allScreens = [
        { id: 1, cat: 'owner' }, { id: 2, cat: 'owner' }, { id: 3, cat: 'owner' }, { id: 4, cat: 'owner' },
        { id: 5, cat: 'protocol' }, { id: 6, cat: 'protocol' }, { id: 7, cat: 'protocol' }, { id: 8, cat: 'protocol' }, { id: 9, cat: 'protocol' },
        { id: 10, cat: 'owner' }, { id: 11, cat: 'tech' }, { id: 12, cat: 'tech' }, { id: 13, cat: 'tech' },
        { id: 14, cat: 'tech' }, { id: 15, cat: 'tech' }, { id: 16, cat: 'tech' }, { id: 17, cat: 'admin' }, { id: 18, cat: 'admin' }
      ];

      ['all', 'owner', 'protocol', 'tech', 'admin'].forEach(c => {
        const b = document.getElementById(`f-${c}`);
        if (b) {
          if (c === cat) {
            b.className = 'px-2 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold';
          } else {
            b.className = 'px-2 py-1 rounded-lg text-slate-400 hover:text-white';
          }
        }
      });

      allScreens.forEach(s => {
        const btn = document.getElementById(`btn-s${s.id}`);
        if (btn) {
          if (cat === 'all' || s.cat === cat) {
            btn.style.display = 'inline-block';
          } else {
            btn.style.display = 'none';
          }
        }
      });
    }

    function setPortal(portalKey) {
      const colors = {
        industries: { glow1: 'bg-amber-500', glow2: 'bg-orange-600', activeBtn: 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.4)]' },
        automobile: { glow1: 'bg-red-600', glow2: 'bg-rose-700', activeBtn: 'bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[0_4px_16px_rgba(239,68,68,0.4)]' },
        electronics: { glow1: 'bg-cyan-500', glow2: 'bg-blue-600', activeBtn: 'bg-gradient-to-b from-cyan-400 to-cyan-500 text-slate-950 shadow-[0_4px_16px_rgba(6,182,212,0.4)]' }
      };
      const c = colors[portalKey];
      document.getElementById('glowPrimary').className = `ambient-glow -top-20 -left-20 ${c.glow1}`;
      document.getElementById('glowSecondary').className = `ambient-glow top-1/2 -right-24 ${c.glow2}`;

      ['industries', 'automobile', 'electronics'].forEach(k => {
        const b = document.getElementById(`tabBtn-${k}`);
        if (b) {
          if (k === portalKey) {
            b.className = `relative py-2 px-1 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1 ${c.activeBtn}`;
          } else {
            b.className = 'relative py-2 px-1 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200';
          }
        }
      });
    }
  </script>
</body>
</html>
"""

with open('F:/uptime/design-system/index.html', 'w', encoding='utf-8') as f:
    f.write(html_template)

with open('F:/uptime/design-system/dist/index.html', 'w', encoding='utf-8') as f:
    f.write(html_template)

print(f"Generated complete 18-screen master design system: {len(html_template)} bytes")
