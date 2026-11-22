import { Button, UptimeEmblem, useAuth } from '@uptime/shared';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ADMIN_MODULES, ADMIN_SCREENS } from '../screens/adminFigmaScreens';

const CLUSTERS = [
  { name: 'All India NOC • Bengaluru Peenya Cluster #4', metrics: '184 Active • 642 Techs • ₹14.82L', badge: '184 Jobs', icon: 'fa-industry text-indigo-600' },
  { name: 'Whitefield Auto & EV Fleet Corridor', metrics: '96 Active • 318 Techs • ₹8.40L', badge: '96 Jobs', icon: 'fa-truck-fast text-blue-600' },
  { name: 'Bommasandra Heavy CNC & Foundry Zone', metrics: '74 Active • 215 Techs • ₹6.95L', badge: '74 Jobs', icon: 'fa-gears text-purple-600' },
  { name: 'Electronic City Server & Power UPS Hub', metrics: '52 Active • 190 Techs • ₹5.12L', badge: '52 Jobs', icon: 'fa-microchip text-cyan-600' },
  { name: 'Chennai Sriperumbudur Auto OEM Belt', metrics: '118 Active • 405 Techs • ₹11.20L', badge: '118 Jobs', icon: 'fa-car-battery text-amber-600' },
] as const;

export interface AdminOutletContext {
  clusterName: string;
  clusterMetrics: string;
  isDarkWall: boolean;
}

export function AdminLayout() {
  const { admin, isDemo, session } = useAuth();
  const location = useLocation();
  const [clusterIdx, setClusterIdx] = useState(0);
  const [clusterOpen, setClusterOpen] = useState(false);
  const [isDarkWall, setIsDarkWall] = useState(false);
  const [activeModule, setActiveModule] = useState<string>('ALL');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeCluster = CLUSTERS[clusterIdx];
  const sidebarScreens = ADMIN_SCREENS.filter((s) => {
    if (s.code === 'A01') return false;
    return activeModule === 'ALL' ? true : s.module === activeModule;
  });

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full px-2.5 py-2 rounded-xl text-left flex items-center justify-between gap-2 transition-all text-xs ${
      isActive ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
    }`;

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${isDarkWall ? 'theme-dark bg-[#030712] text-slate-100' : 'theme-light bg-[#F1F5F9] text-slate-900'}`}>
      {/* Top Figma Multi-Cluster NOC Command Header */}
      <header className={`sticky top-0 z-40 border-b px-4 py-2.5 shadow-sm backdrop-blur-md ${isDarkWall ? 'bg-[#0B1120]/95 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
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
              <UptimeEmblem size="md" accent="teal" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-display font-black tracking-tight text-slate-900">UPTIME</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-extrabold">
                    ZERO-TRUST NOC
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-live"></span>
                    SLA 98.4%
                  </span>
                  {isDemo && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                      DEMO NOC
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  {activeCluster.name} • {activeCluster.metrics}
                </p>
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Multi-Cluster Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setClusterOpen((o) => !o)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <i className="fa-solid fa-satellite-dish text-emerald-400"></i>
                <span className="max-w-[180px] truncate hidden sm:inline">{activeCluster.name}</span>
                <span className="sm:hidden">Cluster</span>
                <i className="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
              </button>
              {clusterOpen && (
                <div className="absolute right-0 mt-1.5 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 text-left">
                  <div className="px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Select Command Cluster / Industrial Hub
                  </div>
                  {CLUSTERS.map((c, idx) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setClusterIdx(idx);
                        setClusterOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold ${
                        idx === clusterIdx ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span className="truncate">
                        <i className={`fa-solid ${c.icon} mr-2`}></i>
                        {c.name}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 shrink-0 ml-2">{c.badge}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* NOC Wall Dark Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsDarkWall((d) => !d)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all"
            >
              <i className={`fa-solid ${isDarkWall ? 'fa-sun text-amber-400' : 'fa-tv text-indigo-600'}`}></i>
              <span className="hidden md:inline">{isDarkWall ? 'Clean White Mode' : 'NOC Wall Dark'}</span>
            </button>

            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  isActive ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`
              }
            >
              <i className="fa-solid fa-table-cells-large text-indigo-500"></i>
              <span className="hidden md:inline">All 24 Screens</span>
            </NavLink>

            <Button variant="ghost" onClick={() => void session.logout()} className="!min-h-[36px] !py-1.5 !px-3 !text-xs">
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Split NOC Shell */}
      <div className="mx-auto w-full max-w-[1680px] flex-1 flex items-stretch">
        <aside
          className={`${
            mobileNavOpen ? 'fixed inset-y-0 left-0 z-50 w-72 shadow-2xl' : 'hidden'
          } lg:sticky lg:top-[61px] lg:h-[calc(100vh-61px)] lg:flex lg:w-72 shrink-0 flex-col justify-between bg-[#0B1120] text-slate-200 border-r border-slate-800 p-4`}
        >
          <div className="flex flex-col min-h-0 flex-1 space-y-3">
            {/* Admin Identity Card */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-display font-black flex items-center justify-center text-sm shrink-0">
                {(admin?.fullName ?? 'SA').slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{admin?.fullName ?? 'Pavan NOC Lead'}</div>
                <div className="text-[10px] text-emerald-400 font-mono font-bold">{admin?.role ?? 'SUPER_ADMIN'} • 30M JWT</div>
              </div>
              <button type="button" onClick={() => setMobileNavOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Module Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
              {ADMIN_MODULES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveModule(m.id)}
                  className={`px-2 py-1 rounded-lg font-mono text-[10px] font-bold whitespace-nowrap transition-all ${
                    activeModule === m.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.id === 'ALL' ? 'ALL (24)' : m.id}
                </button>
              ))}
            </div>

            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
              Admin Command Modules (A01–A24)
            </div>

            <nav className="flex-1 overflow-y-auto no-scrollbar space-y-1 pr-0.5" aria-label="Admin screens">
              {sidebarScreens.map((s) => {
                const active = location.pathname === s.appPath;
                return (
                  <NavLink key={s.code} to={s.appPath} end={s.appPath === '/'} className={navLinkClass} onClick={() => setMobileNavOpen(false)}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${active ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'}`}>
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

          <div className="pt-3 mt-3 border-t border-slate-800 space-y-2">
            <Link
              to="/epidemics"
              onClick={() => setMobileNavOpen(false)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-brain"></i>
              <span>AI Epidemic Heatmap (2 Alerts)</span>
            </Link>
            <div className="text-[10px] font-mono text-center text-slate-400">PostgreSQL Trigger: Immutable Audit</div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 console-canvas">
          <div className="mx-auto max-w-6xl">
            <Outlet context={{ clusterName: activeCluster.name, clusterMetrics: activeCluster.metrics, isDarkWall } satisfies AdminOutletContext} />
          </div>
        </main>
      </div>
    </div>
  );
}
