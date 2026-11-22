import { useAuth } from '@uptime/shared';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTechStore } from '../store/techStore';

const COLLAPSE_KEY = 'uptime.tech.sidebar.collapsed';

function TechIcon({ name }: { name: 'cockpit' | 'jobs' | 'earnings' | 'kyc' | 'profile' }) {
  const cls = 'h-[18px] w-[18px] flex-shrink-0';
  switch (name) {
    case 'cockpit':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      );
    case 'jobs':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 'earnings':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
          <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
        </svg>
      );
    case 'kyc':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'profile':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20a8 8 0 0 1 16 0" />
        </svg>
      );
  }
}

export function TechLayout({ children }: { children?: ReactNode }) {
  const { session, user } = useAuth();
  const { online, toggleOnline, shiftHours, jobs, availableBalanceInr, profile } = useTechStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(COLLAPSE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSE_KEY, String(collapsed));
    } catch {
      // ignore storage errors
    }
  }, [collapsed]);

  const incomingCount = jobs.filter((j) => j.status === 'INCOMING').length;
  const activeCount = jobs.filter((j) => j.status === 'ACCEPTED' || j.status === 'ARRIVED' || j.status === 'IN_PROGRESS').length;

  const navItems: Array<{
    to: string;
    label: string;
    icon: 'cockpit' | 'jobs' | 'earnings' | 'kyc' | 'profile';
    badge?: number;
  }> = [
    { to: '/', label: 'Dispatch Cockpit', icon: 'cockpit' },
    { to: '/jobs', label: 'Jobs & Radar', icon: 'jobs', badge: incomingCount + activeCount || undefined },
    { to: '/earnings', label: 'Earnings & IMPS', icon: 'earnings' },
    { to: '/verification', label: 'KYC & Permits', icon: 'kyc' },
    { to: '/profile', label: 'Skills & Profile', icon: 'profile' },
  ];

  async function handleSignOut() {
    await session.logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7F6] text-[#102020]">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0A3535]/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Collapsible Pine Teal Icon Sidebar Navigator */}
      <aside
        className={`${
          mobileOpen ? 'fixed inset-y-0 left-0 z-50 flex w-64 shadow-2xl' : 'hidden'
        } lg:sticky lg:top-0 lg:flex lg:h-screen flex-shrink-0 flex-col justify-between bg-[#0F4C4C] text-white transition-all duration-300 ease-out ${
          collapsed ? 'lg:w-[76px]' : 'lg:w-64'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className={`flex items-center border-b border-white/10 py-5 ${collapsed ? 'lg:justify-center lg:px-2 px-5 justify-between' : 'justify-between px-5'}`}>
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path d="M12 4l6 8h-3.8v8H9.8v-8H6l6-8z" fill="#D96B27" />
                </svg>
                <span className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0F4C4C] ${online ? 'bg-[#10B981]' : 'bg-slate-400'}`} />
              </div>
              <div className={collapsed ? 'lg:hidden' : ''}>
                <div className="font-display text-base font-bold tracking-tight text-white">UPTIME</div>
                <div className="text-[11px] font-medium text-[#A8C9C6]">Field Specialist</div>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className={`space-y-1.5 py-5 ${collapsed ? 'lg:px-2.5 px-3' : 'px-3'}`} aria-label="Specialist Navigation">
            {!collapsed && (
              <p className="px-3 pb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8BB3AF]">
                Workstation
              </p>
            )}
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                title={collapsed ? item.label : undefined}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                    collapsed ? 'lg:justify-center lg:px-0 py-2.5 px-3.5 justify-between' : 'justify-between px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-[#D96B27] text-white shadow-md'
                      : 'text-[#CBE0DD] hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <span className={`flex items-center ${collapsed ? 'lg:justify-center gap-3' : 'gap-3'}`}>
                  <TechIcon name={item.icon} />
                  <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full bg-[#10B981] font-mono text-[10px] font-bold text-[#052E24] ${
                      collapsed
                        ? 'lg:absolute lg:right-1.5 lg:top-1 lg:flex lg:h-4 lg:min-w-[16px] lg:items-center lg:justify-center lg:px-1 px-2 py-0.5'
                        : 'px-2 py-0.5'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {collapsed && (
                  <span className="pointer-events-none hidden lg:block absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-[#0A3535] px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-xl border border-white/15 opacity-0 -translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Shift Fatigue Card & Collapse Toggle */}
        <div className={`space-y-3 border-t border-white/10 ${collapsed ? 'lg:p-2.5 p-4' : 'p-4'}`}>
          <div className={`rounded-xl bg-white/8 p-3 ${collapsed ? 'lg:hidden' : ''}`}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-white">ISO Shift Timer</span>
              <span className="font-mono font-bold text-[#10B981]">{shiftHours.toFixed(1)}h / 12h</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-[#10B981] transition-all duration-500"
                style={{ width: `${Math.min(100, (shiftHours / 12) * 100)}%` }}
              />
            </div>
            <p className="mt-1.5 text-[10px] text-[#A8C9C6]">Balance: ₹{availableBalanceInr.toLocaleString('en-IN')}</p>
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar navigator' : 'Collapse sidebar to icons'}
            className="hidden lg:flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-2 text-[11px] font-semibold text-[#CBE0DD] transition-colors hover:bg-white/15 hover:text-white"
          >
            <span>{collapsed ? '»' : '« Collapse Rail'}</span>
          </button>

          <button
            type="button"
            onClick={() => void handleSignOut()}
            title={collapsed ? 'Sign out' : undefined}
            className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-white/15 py-2 text-xs font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            {collapsed ? '⎋' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-[#E2EAE7] bg-white/90 px-4 py-3.5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#E2EAE7] bg-white text-[#0F4C4C] hover:bg-[#EBF3F2] lg:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0F4C4C]">
                {profile.tier} • {profile.rating.toFixed(1)}★
              </p>
              <p className="text-sm font-bold text-[#102020]">{user?.fullName ?? profile.fullName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleOnline}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                online
                  ? 'bg-[#ECFDF5] text-[#065F46] ring-1 ring-[#10B981]/50 hover:bg-[#D1FAE5]'
                  : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${online ? 'bg-[#10B981]' : 'bg-slate-400'}`} />
              <span>{online ? 'On Duty • Receiving SOS' : 'Offline • Paused'}</span>
            </button>

            <Link
              to="/earnings"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#0F4C4C] px-3.5 py-2 font-mono text-xs font-bold text-white transition-colors hover:bg-[#0A3535]"
            >
              ₹{availableBalanceInr.toLocaleString('en-IN')}
            </Link>
          </div>
        </header>

        <main key={location.pathname} className="animate-tech-in mx-auto w-full max-w-[1320px] flex-1 px-4 py-6 sm:px-8 sm:py-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
