import { AdminLoginPage, BackendStatusPage, RequireAuth, SignedInHome } from '@uptime/shared';
import { Link, Route, Routes } from 'react-router-dom';
import { http } from './lib/api';
import { env } from './lib/env';

function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-fg-2">That address does not exist in this app.</p>
      <Link to="/" className="min-h-tap rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-on-brand">
        Go to the home page
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage showDevHint={env.isDev} />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <SignedInHome appName="Admin app" nextUp="Next up, Phase 3: review technician documents." />
          </RequireAuth>
        }
      />
      <Route
        path="/status"
        element={
          <BackendStatusPage
            appName="Admin"
            audience="For UPTIME staff. Review technician documents and resolve disputes."
            port={3002}
            http={http}
            mapsKeyPresent={env.googleMapsKey !== ''}
          />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
