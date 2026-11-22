# -*- coding: utf-8 -*-
import json
from build_owner_web_full import screens_data
from assemble_owner_web import get_cases_js

output_path = r"F:\uptime\design-system\owner-web.html"

screens_json = json.dumps(screens_data, indent=2)
cases_js = get_cases_js()

html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UPTIME — Enterprise Factory & Fleet Owner Web (44 Screens: W01–W44)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700;800&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root {{
      --font-display: 'Plus Jakarta Sans', -apple-system, sans-serif;
      --font-body: 'Plus Jakarta Sans', -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }}
    body {{
      font-family: var(--font-body);
      margin: 0;
      background-color: #F8FAFC;
      color: #0F172A;
    }}
    .font-display {{ font-family: var(--font-display); }}
    .font-mono {{ font-family: var(--font-mono); }}
    .no-scrollbar::-webkit-scrollbar {{ display: none; }}
    .no-scrollbar {{ -ms-overflow-style: none; scrollbar-width: none; }}
    @keyframes pulse-dot {{
      0%, 100% {{ transform: scale(1); opacity: 1; }}
      50% {{ transform: scale(1.35); opacity: 0.55; }}
    }}
    .pulse-live {{ animation: pulse-dot 1.8s infinite ease-in-out; }}
  </style>
</head>
<body id="appBody" class="min-h-screen bg-[#F8FAFC] text-slate-900 select-none">

  <!-- TOP HEADER -->
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 shadow-sm">
    <div class="max-w-[1780px] mx-auto space-y-2">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <!-- Brand -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shadow-md border border-slate-800">
            <svg class="w-6 h-6" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" rx="20" fill="#000000" />
              <path d="M22 24 V 55 C 22 74, 78 74, 78 55 V 24" stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" fill="none" />
              <path d="M64 38 L78 20 L90 38" stroke="#00D4AA" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              <circle cx="50" cy="46" r="11" stroke="#38BDF8" stroke-width="6" fill="none" stroke-dasharray="7 5" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-sm sm:text-base font-display font-extrabold tracking-tight text-slate-900">UPTIME — OWNER WEB WORKSTATION</h1>
              <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-extrabold">ALL 44 SCREENS • W01–W44</span>
              <span class="hidden md:inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-live"></span>
                PRO PASS ACTIVE (₹999/MO)
              </span>
            </div>
            <p class="text-[11px] text-slate-500 font-medium">Enterprise Factory & Fleet Management • Multimodal AI Triage • Digital Twin Telemetry • 15m Dispatch SLA</p>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Plant Dropdown -->
          <div class="relative">
            <button onclick="togglePlantDropdown()" class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all">
              <i class="fa-solid fa-location-dot text-emerald-400"></i>
              <span id="activePlantLabel">Apex Tools • Peenya Plant #1 (HQ)</span>
              <i class="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
            </button>
            <div id="plantDropdown" class="hidden absolute right-0 mt-1.5 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 text-left">
              <div class="px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Select Factory Plant / Fleet Hub</div>
              <button onclick="selectPlant('Apex Tools • Peenya Plant #1 (HQ)', '28 CNC Machines', '1 Active Job')" class="w-full px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800">
                <span><i class="fa-solid fa-industry text-purple-600 mr-2"></i>Peenya Plant #1 (CNC & Lathes)</span>
                <span class="text-[10px] font-mono text-emerald-600">28 Assets</span>
              </button>
              <button onclick="selectPlant('Karnataka Logistics • Whitefield Hub', '54 Commercial Fleets', '2 Active Jobs')" class="w-full px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800">
                <span><i class="fa-solid fa-truck-moving text-blue-600 mr-2"></i>Whitefield Fleet Hub (Trucks/EVs)</span>
                <span class="text-[10px] font-mono text-emerald-600">54 Assets</span>
              </button>
              <button onclick="selectPlant('Vidyut Cleanroom • E-City Server Farm', '14 SMT & UPS Units', 'All Nominal')" class="w-full px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800">
                <span><i class="fa-solid fa-microchip text-cyan-600 mr-2"></i>E-City Facility (Cleanroom & UPS)</span>
                <span class="text-[10px] font-mono text-emerald-600">14 Assets</span>
              </button>
            </div>
          </div>

          <!-- Sector Switcher -->
          <div class="p-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1 text-xs font-bold">
            <button id="sectorIndBtn" onclick="setSector('industrial')" class="px-2.5 py-1 rounded-lg bg-white text-purple-700 shadow-xs flex items-center gap-1.5">
              <i class="fa-solid fa-industry"></i><span class="hidden sm:inline">Industrial</span>
            </button>
            <button id="sectorAutoBtn" onclick="setSector('automobile')" class="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
              <i class="fa-solid fa-truck-fast"></i><span class="hidden sm:inline">Auto Fleets</span>
            </button>
            <button id="sectorElecBtn" onclick="setSector('electronics')" class="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
              <i class="fa-solid fa-microchip"></i><span class="hidden sm:inline">Electronics</span>
            </button>
          </div>

          <!-- View Mode -->
          <div class="p-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1 text-xs font-semibold">
            <button id="modeBrowserBtn" onclick="setDisplayMode('browser')" class="px-3 py-1.5 rounded-lg bg-white text-slate-900 font-bold shadow-sm flex items-center gap-1.5 transition-all">
              <i class="fa-solid fa-desktop text-blue-600"></i>
              <span>Interactive Desktop</span>
            </button>
            <button id="modeGridBtn" onclick="setDisplayMode('grid')" class="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-all">
              <i class="fa-solid fa-table-cells-large text-slate-500"></i>
              <span>All 44 Artboards Grid</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Module Pills + Quick Jump -->
      <div class="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-100">
        <div id="modulePillsContainer" class="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5"></div>
        <div class="flex items-center gap-1.5">
          <button onclick="prevScreen()" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"><i class="fa-solid fa-chevron-left"></i></button>
          <select id="screenSelectDropdown" onchange="jumpToScreen(this.value)" class="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none max-w-[280px]"></select>
          <button onclick="nextScreen()" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
      </div>
    </div>
  </header>

  <!-- MODE 1: INTERACTIVE DESKTOP VIEWPORT -->
  <main id="browserModeContainer" class="max-w-[1780px] mx-auto px-4 py-5">
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
      <div class="xl:col-span-9">
        <div class="rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
          <div class="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
            <div class="flex items-center gap-2.5">
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-rose-500"></span>
                <span class="w-3 h-3 rounded-full bg-amber-400"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
              </div>
              <div class="ml-2 px-3 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-[11px] font-mono text-slate-300 flex items-center gap-2">
                <i class="fa-solid fa-lock text-emerald-400 text-[10px]"></i>
                <span id="browserUrlBar">https://app.uptime.in/owner/dashboard</span>
              </div>
            </div>
            <div class="flex items-center gap-3 text-[11px] font-mono">
              <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">ESCROW PROTECTED</span>
              <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">SECTOR: INDUSTRIAL</span>
              <span id="headerPlantMetrics" class="hidden sm:inline text-slate-400">Apex Tools • 28 Assets</span>
            </div>
          </div>

          <div class="grid grid-cols-12 min-h-[720px]">
            <aside class="col-span-12 md:col-span-3 bg-slate-900 text-slate-200 p-4 flex flex-col justify-between border-r border-slate-800">
              <div class="space-y-4">
                <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center font-display text-sm">AT</div>
                  <div class="min-w-0 flex-1">
                    <div class="text-xs font-bold text-white truncate">Apex Precision Tools</div>
                    <div class="text-[10px] text-emerald-400 font-mono">GST: 29AAACA1234A1Z5</div>
                  </div>
                </div>

                <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1">Owner Web Pages (W01–W44)</div>
                <div id="sidebarNavContainer" class="space-y-1 max-h-[500px] overflow-y-auto pr-1 no-scrollbar"></div>
              </div>

              <div class="pt-3 border-t border-slate-800 space-y-2">
                <button onclick="jumpToScreen('W07')" class="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  <span>Report Breakdown (SOS)</span>
                </button>
                <div class="text-[10px] font-mono text-center text-slate-400">Emergency SLA: 15 Mins Guaranteed</div>
              </div>
            </aside>

            <section class="col-span-12 md:col-span-9 bg-[#F8FAFC] p-6 flex flex-col justify-between">
              <div id="activeScreenCanvas"></div>
            </section>
          </div>
        </div>
      </div>

      <!-- Right Inspector Panel -->
      <div class="xl:col-span-3 space-y-4">
        <div class="rounded-3xl bg-white border border-slate-200 p-5 shadow-lg space-y-3.5">
          <div class="flex items-center justify-between">
            <span id="inspectorCodeBadge" class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-mono text-xs font-extrabold">W06</span>
            <span id="inspectorModuleBadge" class="text-[11px] font-mono font-bold text-slate-500 uppercase">MODULE 2 • DASHBOARD</span>
          </div>
          <h2 id="inspectorTitle" class="text-base font-display font-extrabold text-slate-900">Owner Web Dashboard</h2>
          <p id="inspectorDesc" class="text-xs text-slate-600 leading-relaxed"></p>

          <div class="pt-2 border-t border-slate-100 space-y-2">
            <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">React Component Mapping (docs/STRUCTURE.md §4)</div>
            <div id="inspectorComponent" class="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] break-all"></div>
          </div>

          <div class="pt-2 border-t border-slate-100 space-y-1.5">
            <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Enterprise Capabilities</div>
            <ul id="inspectorBullets" class="space-y-1.5 text-xs text-slate-700"></ul>
          </div>
        </div>

        <div class="rounded-3xl bg-white border border-slate-200 p-4 shadow-lg space-y-2.5">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-display font-extrabold uppercase tracking-wider text-slate-800">44-Screen Owner Matrix</h3>
            <span class="text-[10px] font-mono font-bold text-emerald-600">100% COMPLETE</span>
          </div>
          <div id="miniScreenDirectory" class="grid grid-cols-4 gap-1.5 max-h-[320px] overflow-y-auto pr-1"></div>
        </div>
      </div>
    </div>
  </main>

  <!-- MODE 2: ALL 44 SCREENS ARTBOARD GRID -->
  <section id="gridModeContainer" class="hidden max-w-[1780px] mx-auto px-4 py-6 space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div>
        <h2 class="text-base font-display font-extrabold text-slate-900">All 44 Owner Web Desktop Artboards (`W01`–`W44`)</h2>
        <p class="text-xs text-slate-500">Every single page features bespoke desktop UI, realistic industrial data, and domain-tailored controls.</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono text-slate-500">Grid View:</span>
        <button onclick="setGridCols(2)" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold">2-Up Large</button>
        <button onclick="setGridCols(3)" class="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold">3-Up Studio</button>
      </div>
    </div>

    <div id="artboardGridWrapper" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"></div>
  </section>

  <!-- JS ENGINE -->
  <script>
    const OWNER_MODULES = [
      {{ id: 'ALL', name: 'All 44 Screens', icon: 'fa-layer-group' }},
      {{ id: 'M1', name: '1. Landing & Auth (5)', icon: 'fa-door-open' }},
      {{ id: 'M2', name: '2. Dashboard & Booking (5)', icon: 'fa-gauge-high' }},
      {{ id: 'M3', name: '3. Job History & Evidence (3)', icon: 'fa-clock-rotate-left' }},
      {{ id: 'M4', name: '4. Asset Management (9)', icon: 'fa-boxes-stacked' }},
      {{ id: 'M5', name: '5. Digital Twin & FFT (1)', icon: 'fa-satellite-dish' }},
      {{ id: 'M6', name: '6. Insurance & AMC (4)', icon: 'fa-shield-halved' }},
      {{ id: 'M7', name: '7. Spares Marketplace (7)', icon: 'fa-cart-shopping' }},
      {{ id: 'M8', name: '8. Wiki, Video & System (10)', icon: 'fa-sliders' }}
    ];

    const OWNER_SCREENS = {screens_json};

    let currentScreenIndex = 5; // Default W06 Dashboard
    let currentModuleFilter = 'ALL';
    let currentDisplayMode = 'browser';
    let currentSector = 'industrial';

    function setSector(sec) {{
      currentSector = sec;
      document.getElementById('sectorIndBtn').className = sec === 'industrial' ? 'px-2.5 py-1 rounded-lg bg-white text-purple-700 shadow-xs flex items-center gap-1.5' : 'px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
      document.getElementById('sectorAutoBtn').className = sec === 'automobile' ? 'px-2.5 py-1 rounded-lg bg-white text-blue-700 shadow-xs flex items-center gap-1.5' : 'px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
      document.getElementById('sectorElecBtn').className = sec === 'electronics' ? 'px-2.5 py-1 rounded-lg bg-white text-cyan-700 shadow-xs flex items-center gap-1.5' : 'px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
      renderActiveScreen();
    }}

    function togglePlantDropdown() {{
      document.getElementById('plantDropdown').classList.toggle('hidden');
    }}

    function selectPlant(name, assets, jobs) {{
      document.getElementById('activePlantLabel').textContent = name;
      document.getElementById('headerPlantMetrics').textContent = `${{name.split('•')[0]}} • ${{assets}}`;
      document.getElementById('plantDropdown').classList.add('hidden');
      renderActiveScreen();
    }}

    function setDisplayMode(mode) {{
      currentDisplayMode = mode;
      const bContainer = document.getElementById('browserModeContainer');
      const gContainer = document.getElementById('gridModeContainer');
      const bBtn = document.getElementById('modeBrowserBtn');
      const gBtn = document.getElementById('modeGridBtn');
      if (mode === 'browser') {{
        bContainer.classList.remove('hidden');
        gContainer.classList.add('hidden');
        bBtn.className = 'px-3 py-1.5 rounded-lg bg-white text-slate-900 font-bold shadow-sm flex items-center gap-1.5 transition-all';
        gBtn.className = 'px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-all';
      }} else {{
        bContainer.classList.add('hidden');
        gContainer.classList.remove('hidden');
        gBtn.className = 'px-3 py-1.5 rounded-lg bg-white text-slate-900 font-bold shadow-sm flex items-center gap-1.5 transition-all';
        bBtn.className = 'px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-all';
        renderArtboardGrid();
      }}
    }}

    function setGridCols(cols) {{
      const wrapper = document.getElementById('artboardGridWrapper');
      wrapper.className = cols === 2 ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6';
    }}

    function filterByModule(modId) {{
      currentModuleFilter = modId;
      renderModulePills();
      if (modId !== 'ALL') {{
        const firstIdx = OWNER_SCREENS.findIndex(s => s.module === modId);
        if (firstIdx !== -1) currentScreenIndex = firstIdx;
      }}
      renderAll();
    }}

    function jumpToScreen(code) {{
      const idx = OWNER_SCREENS.findIndex(s => s.code === code);
      if (idx !== -1) {{
        currentScreenIndex = idx;
        if (currentDisplayMode === 'grid') setDisplayMode('browser');
        renderAll();
      }}
    }}

    function prevScreen() {{
      currentScreenIndex = (currentScreenIndex - 1 + OWNER_SCREENS.length) % OWNER_SCREENS.length;
      renderAll();
    }}

    function nextScreen() {{
      currentScreenIndex = (currentScreenIndex + 1) % OWNER_SCREENS.length;
      renderAll();
    }}

    function renderModulePills() {{
      const container = document.getElementById('modulePillsContainer');
      container.innerHTML = OWNER_MODULES.map(m => {{
        const active = m.id === currentModuleFilter;
        return `<button onclick="filterByModule('${{m.id}}')" class="px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${{
          active ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
        }}"><i class="fa-solid ${{m.icon}} text-[10px]"></i><span>${{m.name}}</span></button>`;
      }}).join('');
    }}

    function renderDropdownAndSidebar() {{
      const select = document.getElementById('screenSelectDropdown');
      select.innerHTML = OWNER_SCREENS.map((s, idx) =>
        `<option value="${{s.code}}" ${{idx === currentScreenIndex ? 'selected' : ''}}>${{s.code}} — ${{s.title}}</option>`
      ).join('');

      const sidebar = document.getElementById('sidebarNavContainer');
      sidebar.innerHTML = OWNER_SCREENS.map((s, idx) => {{
        const isActive = idx === currentScreenIndex;
        return `<button onclick="jumpToScreen('${{s.code}}')" class="w-full px-2.5 py-1.5 rounded-xl text-left flex items-center justify-between gap-2 transition-all ${{
          isActive ? 'bg-blue-600 text-white font-bold shadow-sm' : 'hover:bg-slate-800 text-slate-300'
        }}">
          <div class="flex items-center gap-2 min-w-0">
            <span class="font-mono text-[10px] px-1.5 py-0.5 rounded ${{isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'}}">${{s.code}}</span>
            <span class="text-xs truncate">${{s.title}}</span>
          </div>
          <i class="fa-solid fa-chevron-right text-[8px] ${{isActive ? 'text-white' : 'text-slate-600'}}"></i>
        </button>`;
      }}).join('');

      const miniDir = document.getElementById('miniScreenDirectory');
      miniDir.innerHTML = OWNER_SCREENS.map((s, idx) => {{
        const isActive = idx === currentScreenIndex;
        return `<button onclick="jumpToScreen('${{s.code}}')" class="p-1.5 rounded-xl border text-center font-mono text-[11px] font-bold transition-all ${{
          isActive
            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
            : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200'
        }}">${{s.code}}</button>`;
      }}).join('');
    }}

    function renderScreenContent(s) {{
      return getBespokeScreenHtml(s.code, s);
    }}

    function renderActiveScreen() {{
      const s = OWNER_SCREENS[currentScreenIndex];
      document.getElementById('browserUrlBar').textContent = `https://app.uptime.in${{s.route}}`;
      document.getElementById('inspectorCodeBadge').textContent = s.code;
      document.getElementById('inspectorModuleBadge').textContent = `${{s.module}} • ${{s.moduleLabel}}`;
      document.getElementById('inspectorTitle').textContent = s.title;
      document.getElementById('inspectorDesc').textContent = s.desc;
      document.getElementById('inspectorComponent').textContent = s.component;
      document.getElementById('inspectorBullets').innerHTML = s.bullets.map(b =>
        `<li class="flex items-start gap-2"><i class="fa-solid fa-circle-check text-emerald-500 mt-0.5"></i><span>${{b}}</span></li>`
      ).join('');

      document.getElementById('activeScreenCanvas').innerHTML = renderScreenContent(s);
    }}

    function renderArtboardGrid() {{
      const wrapper = document.getElementById('artboardGridWrapper');
      const filtered = currentModuleFilter === 'ALL'
        ? OWNER_SCREENS
        : OWNER_SCREENS.filter(s => s.module === currentModuleFilter);

      wrapper.innerHTML = filtered.map(s => `
        <div onclick="jumpToScreen('${{s.code}}')" class="cursor-pointer group rounded-3xl bg-white border border-slate-200 hover:border-blue-500 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between">
          <div class="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-blue-600 font-mono text-xs font-extrabold">${{s.code}}</span>
              <span class="text-xs font-bold truncate max-w-[210px]">${{s.title}}</span>
            </div>
            <span class="font-mono text-[10px] text-emerald-400">${{s.component}}</span>
          </div>
          <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
            <p class="text-xs text-slate-600 line-clamp-2">${{s.desc}}</p>
            <div class="space-y-1 pt-2 border-t border-slate-100">
              ${{s.bullets.map(b => `
                <div class="text-[11px] text-slate-700 flex items-center gap-1.5 truncate">
                  <i class="fa-solid fa-check text-emerald-500 text-[10px]"></i>
                  <span class="truncate">${{b}}</span>
                </div>
              `).join('')}}
            </div>
            <div class="pt-2 flex items-center justify-between text-[11px] font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
              <span>Open in Desktop Browser View</span>
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </div>
          </div>
        </div>
      `).join('');
    }}

    function renderAll() {{
      renderModulePills();
      renderDropdownAndSidebar();
      renderActiveScreen();
      if (currentDisplayMode === 'grid') {{
        renderArtboardGrid();
      }}
    }}

    window.addEventListener('keydown', (e) => {{
      if (e.key === 'ArrowRight') nextScreen();
      if (e.key === 'ArrowLeft') prevScreen();
    }});

    {cases_js}

    renderAll();
  </script>
</body>
</html>
"""

with open(output_path, "w", encoding="utf-8") as f:
    f.write(html_template)

print(f"SUCCESS: Written {len(html_template)} bytes to {output_path}")
