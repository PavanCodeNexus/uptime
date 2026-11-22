import { Button, UptimeEmblem, useAuth, useTheme } from '@uptime/shared';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { OWNER_MODULES, OWNER_SCREENS } from '../screens/ownerFigmaScreens';

const PLANTS = [
  { name: 'Apex Tools • Peenya Plant #1 (HQ)', assets: '28 CNC Machines', badge: '28 Assets', icon: 'fa-industry text-purple-600' },
  { name: 'Karnataka Logistics • Whitefield Hub', assets: '54 Commercial Fleets', badge: '54 Assets', icon: 'fa-truck-moving text-blue-600' },
  { name: 'Vidyut Cleanroom • E-City Server Farm', assets: '14 SMT & UPS Units', badge: '14 Assets', icon: 'fa-microchip text-cyan-600' },
] as const;

type Sector = 'industrial' | 'automobile' | 'electronics';

export function OwnerLayout() {
  const { user, isDemo, session } = useAuth();
  const { cycle, theme } = useTheme();
  const location = useLocation();
  const [plantIdx, setPlantIdx] = useState(0);
  const [plantOpen, setPlantOpen] = useState(false);
  const [sector, setSector] = useState<Sector>('industrial');
  const [activeModule, setActiveModule] = useState<string>('ALL');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activePlant = PLANTS[plantIdx];
  const sidebarScreens = OWNER_SCREENS.filter((s) => {
    if (s.code === 'W01' || s.code === 'W02' || s.code === 'W04' || s.code === 'W05') return false;
    return activeModule === 'ALL' ? true : s.module === activeModule;
  });

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full px-2.5 py-2 rounded-xl text-left flex items-center justify-between gap-2 transition-all text-xs ${
      isActive ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Top Figma Command Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-sm">
        <div className="mx-auto max-w-[1680px] flex flex-wrap items-center justify-between gap-3">
          {/* Left: Brand Identity + Mobile Sidebar Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
              aria-label="Toggle navigation menu"
            >
              <i className={`fa-solid ${mobileNavOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>

            <Link to="/dashboard" className="flex items-center gap-3">
              <UptimeEmblem size="md" accent="teal" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-display font-black tracking-tight text-slate-900">UPTIME</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-extrabold">
                    OWNER WORKSTATION
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-live"></span>
                    PRO PASS ACTIVE (₹999/MO)
                  </span>
                  {isDemo && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                      DEMO MODE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  {activePlant.name} • {activePlant.assets} • 15m Dispatch SLA
                </p>
              </div>
            </Link>
          </div>

          {/* Right Controls: Plant Switcher + Sector Switcher + Gallery + Sign Out */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Plant Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPlantOpen((o) => !o)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <i className="fa-solid fa-location-dot text-emerald-400"></i>
                <span className="max-w-[170px] truncate hidden sm:inline">{activePlant.name}</span>
                <span className="sm:hidden">Plant</span>
                <i className="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
              </button>
              {plantOpen && (
                <div className="absolute right-0 mt-1.5 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 text-left">
                  <div className="px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Select Factory Plant / Fleet Hub
                  </div>
                  {PLANTS.map((p, idx) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setPlantIdx(idx);
                        setPlantOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold ${
                        idx === plantIdx ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span className="truncate">
                        <i className={`fa-solid ${p.icon} mr-2`}></i>
                        {p.name}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 shrink-0 ml-2">{p.badge}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sector Switcher */}
            <div className="hidden xl:flex p-1 rounded-xl bg-slate-100 border border-slate-200 items-center gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSector('industrial')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${sector === 'industrial' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <i className="fa-solid fa-industry"></i>
                <span>Industrial</span>
              </button>
              <button
                type="button"
                onClick={() => setSector('automobile')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${sector === 'automobile' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <i className="fa-solid fa-truck-fast"></i>
                <span>Auto Fleets</span>
              </button>
              <button
                type="button"
                onClick={() => setSector('electronics')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${sector === 'electronics' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <i className="fa-solid fa-microchip"></i>
                <span>Electronics</span>
              </button>
            </div>

            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`
              }
            >
              <i className="fa-solid fa-table-cells-large text-blue-500"></i>
              <span className="hidden md:inline">All 44 Screens</span>
            </NavLink>

            <span className="hidden 2xl:inline text-xs font-mono font-bold text-slate-600">{user?.fullName ?? 'Owner'}</span>

            <Button variant="secondary" onClick={cycle} className="!min-h-[36px] !py-1.5 !px-3 !text-xs">
              <i className="fa-solid fa-circle-half-stroke text-slate-500"></i>
              <span className="hidden sm:inline">{theme}</span>
            </Button>

            <Button variant="ghost" onClick={() => void session.logout()} className="!min-h-[36px] !py-1.5 !px-3 !text-xs">
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Split Body: Industrial Dark Sidebar + Active Workspace Canvas */}
      <div className="mx-auto w-full max-w-[1680px] flex-1 flex items-stretch">
        {/* Left Industrial Dark Sidebar (matches Figma Owner Web Shell) */}
        <aside
          className={`${
            mobileNavOpen ? 'fixed inset-y-0 left-0 z-50 w-72 shadow-2xl' : 'hidden'
          } lg:sticky lg:top-[61px] lg:h-[calc(100vh-61px)] lg:flex lg:w-72 shrink-0 flex-col justify-between bg-slate-900 text-slate-200 border-r border-slate-800 p-4`}
        >
          <div className="flex flex-col min-h-0 flex-1 space-y-3">
            {/* Company GST Card */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center font-display text-sm shrink-0">
                {(user?.fullName ?? 'AT').slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{user?.fullName ?? 'Apex Precision Tools'}</div>
                <div className="text-[10px] text-emerald-400 font-mono">GST: 29AAACA1234A1Z5</div>
              </div>
              <button type="button" onClick={() => setMobileNavOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Module Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
              {OWNER_MODULES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveModule(m.id)}
                  className={`px-2 py-1 rounded-lg font-mono text-[10px] font-bold whitespace-nowrap transition-all ${
                    activeModule === m.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.id === 'ALL' ? 'ALL (44)' : m.id}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Owner Web Pages</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">{sector}</span>
            </div>

            {/* Scrollable Screen Links */}
            <nav className="flex-1 overflow-y-auto no-scrollbar space-y-1 pr-0.5" aria-label="Owner screens">
              <NavLink to="/" end className={navLinkClass} onClick={() => setMobileNavOpen(false)}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">W01</span>
                  <span className="truncate">Enterprise Landing Portal</span>
                </div>
                <i className="fa-solid fa-chevron-right text-[9px] opacity-60"></i>
              </NavLink>
              {sidebarScreens.map((s) => {
                const active = location.pathname === s.appPath;
                return (
                  <NavLink key={s.code} to={s.appPath} className={navLinkClass} onClick={() => setMobileNavOpen(false)}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${active ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'}`}>
                        {s.code}
                      </span>
                      <span className="truncate">{s.title}</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-[9px] opacity-60"></i>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Sticky Bottom SOS Breakdown Button */}
          <div className="pt-3 mt-3 border-t border-slate-800 space-y-2">
            <Link
              to="/report"
              onClick={() => setMobileNavOpen(false)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>Report Breakdown (SOS)</span>
            </Link>
            <div className="text-[10px] font-mono text-center text-slate-400">Emergency SLA: 15 Mins Guaranteed</div>
          </div>
        </aside>

        {/* Active Screen Canvas */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet context={{ activePlant, sector }} />
          </div>
        </main>
      </div>
    </div>
  );
}
