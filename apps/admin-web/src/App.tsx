import { BackendStatusPage, RequireAuth } from '@uptime/shared';
import { Link, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { http } from './lib/api';
import { env } from './lib/env';
import AdminAuthPage from './pages/AdminAuthPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import DispatchesPage from './pages/DispatchesPage';
import FinancePage from './pages/FinancePage';
import KycQueuePage from './pages/KycQueuePage';
import OverviewPage from './pages/OverviewPage';
import TechniciansPage from './pages/TechniciansPage';

function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 bg-[#FAFAF8] px-4 text-center">
      <span className="rounded-full border border-[#E8E8E2] bg-white px-3 py-1 font-mono text-xs font-bold text-[#9B711C]">
        404 • NOT FOUND
      </span>
      <h1 className="font-display text-2xl font-bold text-[#050506]">Page Not Found</h1>
      <p className="text-xs text-[#64675F]">The requested route does not exist in the UPTIME Admin Console.</p>
      <Link
        to="/"
        className="rounded-xl bg-[#050506] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1E1F1D]"
      >
        Return to Overview
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminAuthPage />} />

      <Route
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<OverviewPage />} />
        <Route path="/dashboard" element={<OverviewPage />} />
        <Route path="/analytics" element={<OverviewPage />} />
        <Route path="/dispatches" element={<DispatchesPage />} />
        <Route path="/kyc" element={<KycQueuePage />} />
        <Route path="/technicians" element={<TechniciansPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/settings" element={<AdminSettingsPage />} />
      </Route>

      <Route
        path="/status"
        element={
          <BackendStatusPage
            appName="Admin"
            audience="For UPTIME operations staff. Review KYC credentials, dispatches, and escrow settlements."
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
