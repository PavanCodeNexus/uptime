import { UptimeEmblem, useAuth, useTheme } from '@uptime/shared';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { PLANTS, useOwnerStore } from '../store/ownerStore';

interface NavSection {
  title: string;
  items: { to: string; label: string; icon: string; badge?: number }[];
}

const COLLAPSE_KEY = 'uptime.owner.sidebar.collapsed';

export function OwnerLayout() {
  const { user, session } = useAuth();
  const { cycle, theme } = useTheme();
  const { activePlant, setActivePlantId, profile, proPassActive, cartCount, unreadNotifications } = useOwnerStore();
  const [plantOpen, setPlantOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(COLLAPSE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSE_KEY, String(collapsed));
    } catch {
      // ignore storage errors
    }
  }, [collapsed]);

  const sections: NavSection[] = [
    {
      title: 'Operations',
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
        { to: '/report', label: 'Report Breakdown', icon: 'fa-bolt' },
        { to: '/ai-triage', label: 'AI Fault Triage', icon: 'fa-brain' },
        { to: '/jobs', label: 'My Jobs & Tracking', icon: 'fa-clipboard-list' },
      ],
    },
    {
      title: 'Assets & Health',
      items: [
        { to: '/assets', label: 'Plant & Fleet Assets', icon: 'fa-industry' },
        { to: '/digital-twin', label: 'Digital Twin FFT', icon: 'fa-wave-square' },
      ],
    },
    {
      title: 'Procurement & Plans',
      items: [
        { to: '/marketplace', label: 'Spare Parts Store', icon: 'fa-boxes-stacked' },
        { to: '/cart', label: 'Procurement Cart', icon: 'fa-cart-shopping', badge: cartCount > 0 ? cartCount : undefined },
        { to: '/protection', label: 'Warranty & AMC', icon: 'fa-shield-halved' },
        { to: '/wallet', label: 'Wallet & Pro Pass', icon: 'fa-wallet' },
      ],
    },
    {
      title: 'Resources & Account',
      items: [
        { to: '/wiki', label: 'Repair Wiki', icon: 'fa-book-open' },
        { to: '/notifications', label: 'Notifications', icon: 'fa-bell', badge: unreadNotifications > 0 ? unreadNotifications : undefined },
        { to: '/settings', label: 'Profile & Settings', icon: 'fa-gear' },
      ],
    },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative w-full rounded-xl flex items-center text-xs font-semibold transition-all duration-200 ${
      collapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5 justify-between gap-2' : 'justify-between gap-2 px-3 py-2.5'
    } ${
      isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Clean Real Product Top Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 h-16 flex items-center">
        <div className="mx-auto w-full max-w-[1600px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label={mobileNavOpen ? 'Close sidebar' : 'Open sidebar'}
              className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
            >
              <i className={`fa-solid ${mobileNavOpen ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true"></i>
            </button>

            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? 'Expand sidebar navigator' : 'Collapse sidebar to icons'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:flex w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <i className={`fa-solid ${collapsed ? 'fa-angles-right' : 'fa-angles-left'} text-xs`} aria-hidden="true"></i>
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <UptimeEmblem size="md" accent="teal" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-display font-black tracking-tight text-slate-900">UPTIME</span>
                  {proPassActive && (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
                      PRO PASS
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 hidden md:block">{activePlant.name}</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Active Plant Switcher (persists in real cookie) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPlantOpen((o) => !o)}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-location-dot text-[#00D4AA]" aria-hidden="true"></i>
                <span className="max-w-[160px] truncate hidden sm:inline">{activePlant.name}</span>
                <span className="sm:hidden">Plant</span>
                <i className="fa-solid fa-chevron-down text-[10px] text-slate-400" aria-hidden="true"></i>
              </button>
              {plantOpen && (
                <div className="absolute right-0 mt-1.5 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 text-left">
                  <div className="px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Switch Active Facility
                  </div>
                  {PLANTS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setActivePlantId(p.id);
                        setPlantOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-xs font-bold cursor-pointer ${
                        p.id === activePlant.id ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      <span className="text-[10px] font-mono text-emerald-600 shrink-0 ml-2">{p.assetSummary}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/cart"
              aria-label={`Cart (${cartCount} items)`}
              className="relative w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700"
            >
              <i className="fa-solid fa-cart-shopping text-xs" aria-hidden="true"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/notifications"
              aria-label={`Notifications (${unreadNotifications} unread)`}
              className="relative w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700"
            >
              <i className="fa-solid fa-bell text-xs" aria-hidden="true"></i>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={cycle}
              aria-label={`Switch theme (current: ${theme})`}
              className="h-9 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-circle-half-stroke text-slate-500" aria-hidden="true"></i>
              <span className="hidden md:inline capitalize">{theme}</span>
            </button>

            <button
              type="button"
              onClick={() => void session.logout()}
              className="h-9 px-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Shell with Collapsible Icon Sidebar Navigator */}
      <div className="mx-auto w-full max-w-[1600px] flex-1 flex items-stretch">
        {mobileNavOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        <aside
          className={`${
            mobileNavOpen ? 'fixed inset-y-0 left-0 z-50 w-64 shadow-2xl flex' : 'hidden'
          } lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:flex shrink-0 flex-col justify-between bg-slate-900 text-slate-200 border-r border-slate-800 transition-all duration-300 ease-out ${
            collapsed ? 'lg:w-[76px] lg:px-2.5 lg:py-4 p-4' : 'lg:w-64 p-4'
          }`}
        >
          <div className="flex flex-col min-h-0 flex-1 space-y-4">
            {/* Account Card (Adapts cleanly to collapsed icon rail) */}
            <div
              className={`rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center transition-all ${
                collapsed ? 'lg:justify-center lg:p-2 p-3 gap-3' : 'p-3 gap-3'
              }`}
              title={collapsed ? `${user?.fullName ?? profile.companyName} (GST: ${profile.gstin})` : undefined}
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-display font-black flex items-center justify-center text-xs shrink-0">
                {(user?.fullName ?? profile.companyName).slice(0, 2).toUpperCase()}
              </div>
              <div className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : ''}`}>
                <div className="text-xs font-bold text-white truncate">{user?.fullName ?? profile.companyName}</div>
                <div className="text-[10px] text-emerald-400 font-mono truncate">GST: {profile.gstin}</div>
              </div>
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setMobileNavOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white cursor-pointer"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            </div>

            {/* Collapsible Icon Sidebar Navigation */}
            <nav className="flex-1 overflow-y-auto overflow-x-visible no-scrollbar space-y-4" aria-label="Workspace navigation">
              {sections.map((sec, secIdx) => (
                <div key={sec.title} className="space-y-1">
                  {collapsed ? (
                    <>
                      <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 lg:hidden">
                        {sec.title}
                      </div>
                      {secIdx > 0 && <div className="hidden lg:block mx-2 my-2 border-t border-slate-800" />}
                    </>
                  ) : (
                    <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {sec.title}
                    </div>
                  )}

                  {sec.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      title={collapsed ? item.label : undefined}
                      className={navLinkClass}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <span className={`flex items-center ${collapsed ? 'lg:justify-center gap-2.5' : 'gap-2.5 truncate'}`}>
                        <i
                          className={`fa-solid ${item.icon} w-4 text-center text-[13px] opacity-90 transition-transform group-hover:scale-110`}
                          aria-hidden="true"
                        ></i>
                        <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                      </span>

                      {item.badge !== undefined && (
                        <span
                          className={`rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold ${
                            collapsed
                              ? 'lg:absolute lg:top-1 lg:right-1.5 lg:min-w-[16px] lg:h-[16px] lg:px-1 lg:flex lg:items-center lg:justify-center lg:text-[9px] px-1.5 py-0.5'
                              : 'px-1.5 py-0.5'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Floating Tooltip in Collapsed Icon Mode */}
                      {collapsed && (
                        <span className="pointer-events-none hidden lg:block absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-xl border border-slate-700 opacity-0 -translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0">
                          {item.label}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              ))}
            </nav>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800 space-y-2">
            <Link
              to="/report"
              title={collapsed ? 'Emergency SOS Dispatch' : undefined}
              onClick={() => setMobileNavOpen(false)}
              className={`w-full py-2.5 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all ${
                collapsed ? 'lg:px-0' : 'px-3'
              }`}
            >
              <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
              <span className={collapsed ? 'lg:hidden' : ''}>Emergency SOS Dispatch</span>
            </Link>

            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="hidden lg:flex w-full py-2 rounded-xl border border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <i className={`fa-solid ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-[10px]`} aria-hidden="true"></i>
              {!collapsed && <span>Collapse Rail</span>}
            </button>

            <div className={`text-[10px] font-mono text-center text-slate-400 ${collapsed ? 'lg:hidden' : ''}`}>
              15-Min Guaranteed Arrival SLA
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 transition-all duration-300">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
