import { useAuth } from '@uptime/shared';
import { useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminStore, type ClusterFilter } from '../store/adminStore';

const CLUSTERS: ClusterFilter[] = ['ALL', 'Peenya', 'Whitefield', 'Bommasandra', 'Chakan', 'Sriperumbudur'];

function NavIcon({ name }: { name: 'analytics' | 'dispatches' | 'kyc' | 'techs' | 'finance' | 'settings' }) {
  const cls = 'h-[18px] w-[18px] flex-shrink-0';
  switch (name) {
    case 'analytics':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-6" />
        </svg>
      );
    case 'dispatches':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case 'kyc':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'techs':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'finance':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
  }
}

export function AdminLayout({ children }: { children?: ReactNode }) {
  const { session, admin, user } = useAuth();
  const { kycQueue, dispatches, payouts, cluster, setCluster } = useAdminStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const displayName = admin?.fullName ?? user?.fullName ?? 'Operations Admin';
  const displayEmail = admin?.email ?? user?.email ?? 'admin@uptime.in';

  const atRiskCount = dispatches.filter((d) => d.status === 'SLA_RISK').length;
  const pendingPayoutCount = payouts.filter((p) => p.status === 'PENDING_ESCROW').length;

  const navItems: Array<{
    to: string;
    label: string;
    icon: 'analytics' | 'dispatches' | 'kyc' | 'techs' | 'finance' | 'settings';
    badge?: number;
    badgeTone?: 'brass' | 'olive';
  }> = [
    { to: '/', label: 'Overview & Analytics', icon: 'analytics' },
    { to: '/dispatches', label: 'Live Dispatches', icon: 'dispatches', badge: atRiskCount || undefined, badgeTone: 'brass' },
    { to: '/kyc', label: 'KYC Verification', icon: 'kyc', badge: kycQueue.length || undefined, badgeTone: 'olive' },
    { to: '/technicians', label: 'Technicians', icon: 'techs' },
    { to: '/finance', label: 'Escrow & Finance', icon: 'finance', badge: pendingPayoutCount || undefined, badgeTone: 'brass' },
    { to: '/settings', label: 'Policies & Audit', icon: 'settings' },
  ];

  async function handleSignOut() {
    await session.logout();
    navigate('/login', { replace: true });
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-[#E8E8E2] px-6 py-5">
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#050506] text-white shadow-xs">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M12 4l6 8h-3.8v8H9.8v-8H6l6-8z" fill="#D9A53A" />
              </svg>
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#7D885E]" />
            </div>
            <div>
              <div className="font-display text-base font-bold tracking-tight text-[#050506]">UPTIME</div>
              <div className="text-[11px] font-medium text-[#64675F]">Executive Console</div>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-lg p-1.5 text-[#64675F] hover:bg-[#F3F3EE] lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 px-3 py-5" aria-label="Admin Navigation">
          <p className="px-3 pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8B8E85]">
            Operations
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#050506] text-white shadow-xs'
                    : 'text-[#4B4E46] hover:bg-[#F3F3EE] hover:text-[#050506]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#D9A53A]' : 'text-[#7D885E] group-hover:text-[#050506]'}>
                      <NavIcon name={item.icon} />
                    </span>
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                        isActive
                          ? 'bg-[#D9A53A] text-[#050506]'
                          : item.badgeTone === 'brass'
                            ? 'bg-[#FBF6EA] text-[#9B711C]'
                            : 'bg-[#F3F5EE] text-[#5B6443]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Executive Status Card & Sign Out */}
      <div className="space-y-3 border-t border-[#E8E8E2] p-4">
        <div className="rounded-xl border border-[#E8E8E2] bg-[#FAFAF8] p-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#050506]">
              <span className="animate-pulse-soft h-2 w-2 rounded-full bg-[#7D885E]" />
              Network Healthy
            </span>
            <span className="font-mono text-[10px] font-semibold text-[#9B711C]">98.6% SLA</span>
          </div>
          <p className="mt-1 text-[11px] text-[#64675F]">5 active industrial corridors monitored in real time.</p>
        </div>

        <div className="flex items-center justify-between gap-2 px-1">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[#050506]">{displayName}</p>
            <p className="truncate font-mono text-[10px] text-[#64675F]">{displayEmail}</p>
          </div>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="cursor-pointer rounded-lg border border-[#E8E8E2] px-2.5 py-1.5 text-[11px] font-semibold text-[#050506] transition-colors hover:border-[#050506] hover:bg-[#050506] hover:text-white"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FAFAF8] text-[#050506]">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 border-r border-[#E8E8E2] bg-white lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#050506]/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 h-full w-72 max-w-[85vw] border-r border-[#E8E8E2] bg-white shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Architectural Bar */}
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E8E2] bg-white/90 px-4 py-3.5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#E8E8E2] bg-white text-[#050506] hover:bg-[#F3F3EE] lg:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7D885E]">
                UPTIME INDIA • OPERATIONS
              </p>
              <p className="text-sm font-semibold text-[#050506]">
                {cluster === 'ALL' ? 'All Industrial Corridors' : `${cluster} Cluster`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <label htmlFor="cluster-select" className="sr-only">
              Filter by Industrial Cluster
            </label>
            <select
              id="cluster-select"
              value={cluster}
              onChange={(e) => setCluster(e.target.value as ClusterFilter)}
              className="cursor-pointer rounded-xl border border-[#E8E8E2] bg-[#FAFAF8] px-3 py-2 text-xs font-semibold text-[#050506] outline-none transition-colors focus:border-[#7D885E]"
            >
              {CLUSTERS.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Clusters (India)' : `${c} Cluster`}
                </option>
              ))}
            </select>

            <Link
              to="/kyc"
              className="hidden cursor-pointer items-center gap-2 rounded-xl bg-[#050506] px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-[#1E1F1D] sm:inline-flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#D9A53A]" />
              <span>Review KYC ({kycQueue.length})</span>
            </Link>
          </div>
        </header>

        {/* Smooth Route Transition Container */}
        <main key={location.pathname} className="animate-fade-up mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-8 sm:py-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
