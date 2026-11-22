import { AdminLoginPage, BackendStatusPage, RequireAuth } from '@uptime/shared';
import { Link, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { http } from './lib/api';
import { env } from './lib/env';
import FigmaScreenPage from './pages/FigmaScreenPage';
import FigmaStudioPage from './pages/FigmaStudioPage';
import KycQueuePage from './pages/KycQueuePage';
import OverviewPage from './pages/OverviewPage';
import TechniciansPage from './pages/TechniciansPage';
import { ADMIN_SCREENS } from './screens/adminFigmaScreens';

const LIVE_ADMIN_CODES = new Set(['A01', 'A04', 'A07', 'A10']);

function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-mono text-xs font-bold">HTTP 404 • NOC ROUTE NOT FOUND</span>
      <h1 className="text-2xl font-display font-black text-slate-900">Command Console Route Not Found</h1>
      <p className="text-xs text-slate-500">That path does not exist in the UPTIME Admin Command Console.</p>
      <Link to="/" className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-md">
        Return to Live Platform Command (A04)
      </Link>
    </main>
  );
}

export default function App() {
  const extraFigmaScreens = ADMIN_SCREENS.filter((s) => !LIVE_ADMIN_CODES.has(s.code));

  return (
    <Routes>
      {/* A01 / A02 / A03 Zero-Trust NOC Authentication */}
      <Route path="/login" element={<AdminLoginPage showDevHint={env.isDev} />} />

      {/* Protected NOC Command Console (all 24 screens native via Dark Sidebar + Top Cluster Bar) */}
      <Route
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<OverviewPage />} />
        <Route path="/dashboard" element={<OverviewPage />} />
        <Route path="/kyc" element={<KycQueuePage />} />
        <Route path="/technicians" element={<TechniciansPage />} />
        <Route path="/gallery" element={<FigmaStudioPage />} />
        <Route path="/studio" element={<FigmaStudioPage />} />
        <Route path="/catalog" element={<FigmaStudioPage />} />
        {extraFigmaScreens.map((s) => (
          <Route key={s.code} path={s.appPath} element={<FigmaScreenPage code={s.code} />} />
        ))}
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
