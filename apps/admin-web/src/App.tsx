import { AdminLoginPage, BackendStatusPage, RequireAuth } from '@uptime/shared';
import { Link, Route, Routes } from 'react-router-dom';
import { http } from './lib/api';
import { env } from './lib/env';
import { AdminLayout } from './components/AdminLayout';
import KycQueuePage from './pages/KycQueuePage';
import OverviewPage from './pages/OverviewPage';
import TechniciansPage from './pages/TechniciansPage';
import FigmaStudioPage from './pages/FigmaStudioPage';

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
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<OverviewPage />} />
        <Route path="/kyc" element={<KycQueuePage />} />
        <Route path="/technicians" element={<TechniciansPage />} />
        <Route path="/studio" element={<FigmaStudioPage />} />
        <Route path="/catalog" element={<FigmaStudioPage />} />
      </Route>
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
