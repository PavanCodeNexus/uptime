import { Button, useAuth, useTheme } from '@uptime/shared';
import { NavLink, Outlet } from 'react-router-dom';

const link = ({ isActive }: { isActive: boolean }) =>
  `min-h-tap inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
    isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export function AdminLayout() {
  const { admin, session } = useAuth();
  const { cycle, theme } = useTheme();

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900">
      {/* Top NOC Command Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shadow-md border border-slate-800">
              <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" rx="20" fill="#000000" />
                <path d="M22 24 V 55 C 22 74, 78 74, 78 55 V 24" stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" fill="none" />
                <path d="M64 38 L78 20 L90 38" stroke="#00D4AA" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <circle cx="50" cy="46" r="11" stroke="#38BDF8" stroke-width="6" fill="none" stroke-dasharray="7 5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-display font-black tracking-tight text-slate-900">UPTIME</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-extrabold">ADMIN NOC COMMAND</span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  4 CLUSTERS MONITORED
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Peenya • Whitefield • Electronic City • Bommasandra</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-1.5" aria-label="Main">
            <NavLink to="/" end className={link}>
              <i className="fa-solid fa-chart-line text-slate-500"></i>
              <span>Overview</span>
            </NavLink>
            <NavLink to="/kyc" className={link}>
              <i className="fa-solid fa-id-card-clip text-purple-500"></i>
              <span>Document Review</span>
            </NavLink>
            <NavLink to="/technicians" className={link}>
              <i className="fa-solid fa-users-gear text-blue-500"></i>
              <span>Technicians</span>
            </NavLink>
            <NavLink to="/studio" className={link}>
              <i className="fa-brands fa-figma text-indigo-500"></i>
              <span>Figma Design Studio (24 Screens)</span>
            </NavLink>
          </nav>

          {/* User & Controls */}
          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-mono font-bold text-slate-600 sm:inline">{admin?.email ?? 'Admin'}</span>
            <Button variant="secondary" onClick={cycle}>
              Theme: {theme}
            </Button>
            <Button variant="secondary" onClick={() => void session.logout()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
