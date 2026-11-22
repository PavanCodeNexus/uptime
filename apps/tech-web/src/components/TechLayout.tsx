import { Button, UptimeEmblem, useAuth, useTheme } from '@uptime/shared';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { TECH_MODULES, TECH_SCREENS } from '../screens/techFigmaScreens';

const DEPOTS = [
  { name: 'Peenya Industrial Depot (Van #14)', radius: '15km Radius', status: 'Active', icon: 'fa-industry text-orange-600' },
  { name: 'Whitefield Auto Hub (Van #08)', radius: '20km Radius', status: 'Standby', icon: 'fa-truck-moving text-blue-600' },
  { name: 'E-City Electronics Hub (Van #02)', radius: '10km Radius', status: 'Standby', icon: 'fa-microchip text-emerald-600' },
] as const;

export function TechLayout() {
  const { user, isDemo, session } = useAuth();
  const { cycle, theme } = useTheme();
  const location = useLocation();
  const [depotIdx, setDepotIdx] = useState(0);
  const [depotOpen, setDepotOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<string>('ALL');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeDepot = DEPOTS[depotIdx];
  const sidebarScreens = TECH_SCREENS.filter((s) => {
    if (s.code === 'TW01' || s.code === 'TW03' || s.code === 'TW04') return false;
    return activeModule === 'ALL' ? true : s.module === activeModule;
  });

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full px-2.5 py-2 rounded-xl text-left flex items-center justify-between gap-2 transition-all text-xs ${
      isActive ? 'bg-orange-500 text-white font-bold shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Top Figma Technician Specialist Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-sm">
        <div className="mx-auto max-w-[1680px] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
              aria-label="Toggle navigation menu"
            >
              <i className={`fa-solid ${mobileNavOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>

            <Link to="/" className="flex items-center gap-3">
              <UptimeEmblem size="md" accent="orange" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-display font-black tracking-tight text-slate-900">UPTIME</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-extrabold">
                    SPECIALIST COCKPIT
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-live"></span>
                    DISPATCH READY (ONLINE)
                  </span>
                  {isDemo && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                      DEMO MODE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  {activeDepot.name} • {activeDepot.radius} • 415V LOTO Certified
                </p>
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Depot Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDepotOpen((o) => !o)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <i className="fa-solid fa-wrench text-orange-400"></i>
                <span className="max-w-[175px] truncate hidden sm:inline">{activeDepot.name}</span>
                <span className="sm:hidden">Depot</span>
                <i className="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
              </button>
              {depotOpen && (
                <div className="absolute right-0 mt-1.5 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 text-left">
                  <div className="px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Select Specialist Depot Base
                  </div>
                  {DEPOTS.map((d, idx) => (
                    <button
                      key={d.name}
                      type="button"
                      onClick={() => {
                        setDepotIdx(idx);
                        setDepotOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold ${
                        idx === depotIdx ? 'bg-orange-50 text-orange-900' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span className="truncate">
                        <i className={`fa-solid ${d.icon} mr-2`}></i>
                        {d.name}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 shrink-0 ml-2">{d.status}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/dispatch"
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <i className="fa-solid fa-bell animate-pulse"></i>
              <span className="hidden sm:inline">60s Flash Job</span>
            </Link>

            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  isActive ? 'bg-orange-500 text-white border-orange-500' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`
              }
            >
              <i className="fa-solid fa-table-cells-large text-orange-500"></i>
              <span className="hidden md:inline">All 28 Screens</span>
            </NavLink>

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

      {/* Main Split Shell: Dark Specialist Sidebar + Canvas */}
      <div className="mx-auto w-full max-w-[1680px] flex-1 flex items-stretch">
        <aside
          className={`${
            mobileNavOpen ? 'fixed inset-y-0 left-0 z-50 w-72 shadow-2xl' : 'hidden'
          } lg:sticky lg:top-[61px] lg:h-[calc(100vh-61px)] lg:flex lg:w-72 shrink-0 flex-col justify-between bg-slate-900 text-slate-200 border-r border-slate-800 p-4`}
        >
          <div className="flex flex-col min-h-0 flex-1 space-y-3">
            {/* Specialist Profile Card */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-display font-black flex items-center justify-center text-sm shrink-0">
                {(user?.fullName ?? 'RK').slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{user?.fullName ?? 'Raju Kumar Sharma'}</div>
                <div className="text-[10px] text-orange-400 font-mono font-bold">L2 SENIOR • 4.9★ • #TECH-8841</div>
              </div>
              <button type="button" onClick={() => setMobileNavOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Module Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
              {TECH_MODULES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveModule(m.id)}
                  className={`px-2 py-1 rounded-lg font-mono text-[10px] font-bold whitespace-nowrap transition-all ${
                    activeModule === m.id ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.id === 'ALL' ? 'ALL (28)' : m.id}
                </button>
              ))}
            </div>

            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
              Specialist Pages (TW01–TW28)
            </div>

            {/* Navigation List */}
            <nav className="flex-1 overflow-y-auto no-scrollbar space-y-1 pr-0.5" aria-label="Technician screens">
              {sidebarScreens.map((s) => {
                const active = location.pathname === s.appPath;
                return (
                  <NavLink key={s.code} to={s.appPath} end={s.appPath === '/'} className={navLinkClass} onClick={() => setMobileNavOpen(false)}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${active ? 'bg-orange-700 text-orange-100' : 'bg-slate-800 text-slate-400'}`}>
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

          {/* Sticky Bottom Flash Dispatch CTA */}
          <div className="pt-3 mt-3 border-t border-slate-800 space-y-2">
            <Link
              to="/dispatch"
              onClick={() => setMobileNavOpen(false)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-bolt"></i>
              <span>60s Flash Dispatch Offer</span>
            </Link>
            <div className="text-[10px] font-mono text-center text-slate-400">ISO 45001 RULE SB-00 Active</div>
          </div>
        </aside>

        {/* Active Screen Canvas */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet context={{ activeDepot }} />
          </div>
        </main>
      </div>
    </div>
  );
}
