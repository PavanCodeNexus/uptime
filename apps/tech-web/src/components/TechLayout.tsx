import { BrandMark, Button, useAuth, useTheme } from '@uptime/shared';
import { NavLink, Outlet } from 'react-router-dom';

const link = ({ isActive }: { isActive: boolean }) =>
  `min-h-tap inline-flex items-center rounded-lg px-3 text-sm font-medium ${isActive ? 'bg-surface-2 text-brand-ink' : 'text-fg-2 hover:bg-surface-2'}`;

/** Top bar around every signed-in technician screen. */
export function TechLayout() {
  const { user, session } = useAuth();
  const { cycle, theme } = useTheme();
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <BrandMark appName="Technician app" />
          <nav className="flex flex-wrap items-center gap-1" aria-label="Main">
            <NavLink to="/" end className={link}>
              Home
            </NavLink>
            <NavLink to="/jobs" className={link}>
              My jobs
            </NavLink>
            <NavLink to="/earnings" className={link}>
              Earnings
            </NavLink>
            <NavLink to="/profile" className={link}>
              Profile and skills
            </NavLink>
            <NavLink to="/verification" className={link}>
              Verification
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-fg-muted sm:inline">{user?.fullName}</span>
            <Button variant="secondary" onClick={cycle}>
              Theme: {theme}
            </Button>
            <Button variant="secondary" onClick={() => void session.logout()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
