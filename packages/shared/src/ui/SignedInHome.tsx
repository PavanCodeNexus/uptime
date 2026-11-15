import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { BrandMark, Button } from './kit';
import { useTheme } from './useTheme';

/** Temporary landing page after sign-in (Phase 1). Each later phase replaces it with real screens. */
export function SignedInHome({ appName, nextUp }: { appName: string; nextUp: string }) {
  const { user, admin, session } = useAuth();
  const { cycle, theme } = useTheme();
  const who = admin?.fullName ?? user?.fullName ?? 'there';
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <header className="flex items-center justify-between gap-3">
        <BrandMark appName={appName} />
        <div className="flex gap-2">
          <Button variant="secondary" onClick={cycle}>
            Theme: {theme}
          </Button>
          <Button variant="secondary" onClick={() => void session.logout()}>
            Sign out
          </Button>
        </div>
      </header>
      <main className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Welcome, {who}</h1>
        <p className="text-fg-2">You are signed in. {nextUp}</p>
        <Link to="/status" className="text-sm text-brand-ink underline">
          Check the backend connection
        </Link>
      </main>
    </div>
  );
}
