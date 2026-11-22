# -*- coding: utf-8 -*-
import json
from build_tech_web_full import screens_data
from assemble_tech_web import get_cases_js

output_path = r"F:\uptime\design-system\tech-web.html"

screens_json = json.dumps(screens_data, indent=2)
cases_js = get_cases_js()

html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UPTIME — Field Specialist & Technician Web Workstation (28 Screens: TW01–TW28)</title>
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
              <path d="M64 38 L78 20 L90 38" stroke="#F97316" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              <circle cx="50" cy="46" r="11" stroke="#00D4AA" stroke-width="6" fill="none" stroke-dasharray="7 5" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-sm sm:text-base font-display font-extrabold tracking-tight text-slate-900">UPTIME — TECHNICIAN WEB WORKSTATION</h1>
              <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-extrabold">ALL 28 SCREENS • TW01–TW28</span>
              <span class="hidden md:inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-live"></span>
                DISPATCH READY (ONLINE)
              </span>
            </div>
            <p class="text-[11px] text-slate-500 font-medium">Field Specialist Cockpit • 415V LOTO Safety • Instant IMPS Payouts • TanStack Ledger</p>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Trade Depot Dropdown -->
          <div class="relative">
            <button onclick="toggleDepotDropdown()" class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all">
              <i class="fa-solid fa-wrench text-orange-400"></i>
              <span id="activeDepotLabel">Peenya Industrial Depot (Van #14)</span>
              <i class="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
            </button>
            <div id="depotDropdown" class="hidden absolute right-0 mt-1.5 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 text-left">
              <div class="px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Select Specialist Depot Base</div>
              <button onclick="selectDepot('Peenya Industrial Depot (Van #14)', '15km Radius', 'Active Job')" class="w-full px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800">
                <span><i class="fa-solid fa-industry text-orange-600 mr-2"></i>Peenya Industrial Cluster (HQ)</span>
                <span class="text-[10px] font-mono text-emerald-600">Active</span>
              </button>
              <button onclick="selectDepot('Whitefield Auto Hub (Van #08)', '20km Radius', 'Standby')" class="w-full px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800">
                <span><i class="fa-solid fa-truck-moving text-blue-600 mr-2"></i>Whitefield Commercial Hub</span>
                <span class="text-[10px] font-mono text-slate-400">Standby</span>
              </button>
              <button onclick="selectDepot('E-City Electronics Hub (Van #02)', '10km Radius', 'Standby')" class="w-full px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800">
                <span><i class="fa-solid fa-microchip text-emerald-600 mr-2"></i>E-City Power Electronics</span>
                <span class="text-[10px] font-mono text-slate-400">Standby</span>
              </button>
            </div>
          </div>

          <!-- View Mode Toggle -->
          <div class="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button id="btnViewSingle" onclick="setDisplayMode('single')" class="px-3 py-1 rounded-lg bg-white text-slate-900 shadow-sm flex items-center gap-1.5 transition-all">
              <i class="fa-solid fa-desktop text-orange-600"></i>
              <span class="hidden sm:inline">Desktop View</span>
            </button>
            <button id="btnViewGrid" onclick="setDisplayMode('grid')" class="px-3 py-1 rounded-lg text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-all">
              <i class="fa-solid fa-table-cells-large"></i>
              <span class="hidden sm:inline">All 28 Grid</span>
            </button>
          </div>

          <!-- Emergency Simulation CTA -->
          <button onclick="jumpToScreen('TW07')" class="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <i class="fa-solid fa-bell animate-pulse"></i>
            <span>60s Flash Job</span>
          </button>
        </div>
      </div>

      <!-- MODULE SELECTOR PILLS -->
      <div id="modulePillContainer" class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
        <!-- Rendered via JS -->
      </div>
    </div>
  </header>

  <!-- WORKSPACE CONTENT CONTAINER -->
  <main class="max-w-[1780px] mx-auto p-4 md:p-6">
    <!-- SINGLE SCREEN WORKSTATION VIEW -->
    <div id="singleScreenContainer" class="space-y-4">
      <!-- Top Navigation & Details Card -->
      <div class="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span id="currentScreenCode" class="px-2.5 py-0.5 rounded-lg bg-orange-600 text-white font-mono text-xs font-extrabold shadow-sm">TW05</span>
            <span id="currentScreenModule" class="px-2.5 py-0.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 font-mono text-[10px] font-bold">M2: Operations & Dispatch</span>
            <span id="currentScreenComponent" class="font-mono text-xs text-slate-500 hidden sm:inline">DashboardPage.tsx</span>
          </div>
          <h2 id="currentScreenTitle" class="text-base sm:text-lg font-display font-black text-slate-900 tracking-tight">Field Specialist Command Cockpit</h2>
          <p id="currentScreenDesc" class="text-xs text-slate-500 max-w-3xl">Central command cockpit with daily earnings ticker (₹1,850), 4 jobs completed, active job banner, and instant dispatch toggle.</p>
        </div>

        <!-- Quick Jump Dropdown & Prev/Next -->
        <div class="flex items-center gap-2">
          <button onclick="prevScreen()" class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-sm transition-all" title="Previous Screen (Left Arrow)">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          
          <select id="screenJumpSelect" onchange="jumpToScreen(this.value)" class="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 outline-none cursor-pointer max-w-[240px]">
            <!-- Rendered via JS -->
          </select>

          <button onclick="nextScreen()" class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-sm transition-all" title="Next Screen (Right Arrow)">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Live Screen Canvas -->
      <div id="screenCanvasWrapper" class="min-h-[700px] rounded-3xl bg-slate-100/70 border border-slate-200/80 p-4 sm:p-6 shadow-inner relative overflow-hidden">
        <div id="screenCanvas" class="max-w-6xl mx-auto transition-opacity duration-150">
          <!-- Active Screen Content Injected Here -->
        </div>
      </div>
    </div>

    <!-- ARTBOARD ALL 28 SCREENS GRID VIEW (Hidden by default) -->
    <div id="gridScreenContainer" class="hidden space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-display font-black text-slate-900">All 28 Technician Screens Artboard Grid</h2>
          <p class="text-xs text-slate-500">Overview of the entire UPTIME Technician Web application suite.</p>
        </div>
        <span class="font-mono text-xs text-slate-400">Click any card to open in Desktop View</span>
      </div>

      <div id="artboardGridWrapper" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <!-- Rendered via JS -->
      </div>
    </div>
  </main>

  <!-- DATA & LOGIC SCRIPTS -->
  <script>
    const TECH_SCREENS = {screens_json};

    const MODULES = [
      {{ id: 'ALL', label: 'All 28 Screens', count: 28 }},
      {{ id: 'M1', label: 'M1: Auth & Onboarding', count: 4 }},
      {{ id: 'M2', label: 'M2: Operations & Dispatch', count: 5 }},
      {{ id: 'M3', label: 'M3: Earnings & Wallet', count: 2 }},
      {{ id: 'M4', label: 'M4: Credentials & Badges', count: 4 }},
      {{ id: 'M5', label: 'M5: Schedule & Service Area', count: 2 }},
      {{ id: 'M6', label: 'M6: Analytics & Performance', count: 1 }},
      {{ id: 'M7', label: 'M7: Knowledge & Academy', count: 3 }},
      {{ id: 'M8', label: 'M8: Workshop & Inventory', count: 2 }},
      {{ id: 'M9', label: 'M9: Settings & System', count: 5 }}
    ];

    let currentScreenIndex = 4; // Default to TW05: DashboardPage
    let currentModuleFilter = 'ALL';
    let currentDisplayMode = 'single';

    function setDisplayMode(mode) {{
      currentDisplayMode = mode;
      const singleContainer = document.getElementById('singleScreenContainer');
      const gridContainer = document.getElementById('gridScreenContainer');
      const btnSingle = document.getElementById('btnViewSingle');
      const btnGrid = document.getElementById('btnViewGrid');

      if (mode === 'single') {{
        singleContainer.classList.remove('hidden');
        gridContainer.classList.add('hidden');
        btnSingle.className = "px-3 py-1 rounded-lg bg-white text-slate-900 shadow-sm flex items-center gap-1.5 transition-all";
        btnGrid.className = "px-3 py-1 rounded-lg text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-all";
      }} else {{
        singleContainer.classList.add('hidden');
        gridContainer.classList.remove('hidden');
        btnGrid.className = "px-3 py-1 rounded-lg bg-white text-slate-900 shadow-sm flex items-center gap-1.5 transition-all";
        btnSingle.className = "px-3 py-1 rounded-lg text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-all";
        renderArtboardGrid();
      }}
    }}

    function toggleDepotDropdown() {{
      const dd = document.getElementById('depotDropdown');
      dd.classList.toggle('hidden');
    }}

    function selectDepot(label, radius, status) {{
      document.getElementById('activeDepotLabel').innerText = label;
      document.getElementById('depotDropdown').classList.add('hidden');
    }}

    function setModuleFilter(modId) {{
      currentModuleFilter = modId;
      renderModulePills();
      if (currentDisplayMode === 'grid') {{
        renderArtboardGrid();
      }} else {{
        // Jump to first screen in module
        if (modId !== 'ALL') {{
          const targetIndex = TECH_SCREENS.findIndex(s => s.module === modId);
          if (targetIndex !== -1) {{
            currentScreenIndex = targetIndex;
            renderActiveScreen();
          }}
        }}
      }}
    }}

    function renderModulePills() {{
      const container = document.getElementById('modulePillContainer');
      container.innerHTML = MODULES.map(m => {{
        const isActive = currentModuleFilter === m.id;
        const activeClasses = isActive 
          ? "bg-slate-900 text-white shadow-sm"
          : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200";
        return `
          <button onclick="setModuleFilter('${{m.id}}')" class="px-3 py-1.5 rounded-xl text-xs font-bold font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${{activeClasses}}">
            <span>${{m.label}}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full ${{isActive ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}}">${{m.count}}</span>
          </button>
        `;
      }}).join('');
    }}

    function jumpToScreen(code) {{
      const idx = TECH_SCREENS.findIndex(s => s.code === code);
      if (idx !== -1) {{
        currentScreenIndex = idx;
        if (currentDisplayMode === 'grid') {{
          setDisplayMode('single');
        }}
        renderActiveScreen();
      }}
    }}

    function nextScreen() {{
      if (currentScreenIndex < TECH_SCREENS.length - 1) {{
        currentScreenIndex++;
      }} else {{
        currentScreenIndex = 0;
      }}
      renderActiveScreen();
    }}

    function prevScreen() {{
      if (currentScreenIndex > 0) {{
        currentScreenIndex--;
      }} else {{
        currentScreenIndex = TECH_SCREENS.length - 1;
      }}
      renderActiveScreen();
    }}

    function renderDropdownAndSidebar() {{
      const select = document.getElementById('screenJumpSelect');
      select.innerHTML = TECH_SCREENS.map(s => `
        <option value="${{s.code}}" ${{s.code === TECH_SCREENS[currentScreenIndex].code ? 'selected' : ''}}>
          ${{s.code}}: ${{s.title}}
        </option>
      `).join('');
    }}

    function renderActiveScreen() {{
      const s = TECH_SCREENS[currentScreenIndex];
      document.getElementById('currentScreenCode').innerText = s.code;
      document.getElementById('currentScreenModule').innerText = s.moduleLabel;
      document.getElementById('currentScreenComponent').innerText = s.component;
      document.getElementById('currentScreenTitle').innerText = s.title;
      document.getElementById('currentScreenDesc').innerText = s.desc;

      renderDropdownAndSidebar();

      const canvas = document.getElementById('screenCanvas');
      canvas.innerHTML = getBespokeScreenHtml(s.code, s);
      window.scrollTo({{ top: 0, behavior: 'smooth' }});
    }}

    function renderArtboardGrid() {{
      const wrapper = document.getElementById('artboardGridWrapper');
      const filtered = currentModuleFilter === 'ALL' 
        ? TECH_SCREENS 
        : TECH_SCREENS.filter(s => s.module === currentModuleFilter);

      wrapper.innerHTML = filtered.map(s => `
        <div onclick="jumpToScreen('${{s.code}}')" class="cursor-pointer group rounded-3xl bg-white border border-slate-200 hover:border-orange-500 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between">
          <div class="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-orange-600 font-mono text-xs font-extrabold">${{s.code}}</span>
              <span class="text-xs font-bold truncate max-w-[210px]">${{s.title}}</span>
            </div>
            <span class="font-mono text-[10px] text-emerald-400">${{s.component}}</span>
          </div>
          <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
            <p class="text-xs text-slate-600 line-clamp-2">${{s.desc}}</p>
            <div class="space-y-1 pt-2 border-t border-slate-100">
              ${{s.bullets.map(b => `
                <div class="text-[11px] text-slate-700 flex items-center gap-1.5 truncate">
                  <i class="fa-solid fa-check text-orange-500 text-[10px]"></i>
                  <span class="truncate">${{b}}</span>
                </div>
              `).join('')}}
            </div>
            <div class="pt-2 flex items-center justify-between text-[11px] font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform">
              <span>Open in Desktop Specialist View</span>
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
