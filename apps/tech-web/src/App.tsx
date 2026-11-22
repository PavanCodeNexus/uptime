import { BackendStatusPage, RequireAuth } from '@uptime/shared';
import { Link, Route, Routes } from 'react-router-dom';
import { TechLayout } from './components/TechLayout';
import { http } from './lib/api';
import { env } from './lib/env';
import EarningsPage from './pages/EarningsPage';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobWorkPage from './pages/JobWorkPage';
import ProfilePage from './pages/ProfilePage';
import TechLoginPage from './pages/TechLoginPage';
import VerificationPage from './pages/VerificationPage';

function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 bg-[#F4F7F6] px-4 text-center">
      <span className="rounded-full bg-[#EBF3F2] px-3 py-1 font-mono text-xs font-bold text-[#0F4C4C]">404 • NOT FOUND</span>
      <h1 className="font-display text-2xl font-bold text-[#102020]">Page Not Found</h1>
      <Link to="/" className="rounded-xl bg-[#0F4C4C] px-5 py-2.5 text-xs font-bold text-white">
        Return to Dispatch Cockpit
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<TechLoginPage />} />

      <Route
        element={
          <RequireAuth>
            <TechLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobWorkPage />} />
        <Route path="/earnings" element={<EarningsPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/documents" element={<VerificationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/skills" element={<ProfilePage />} />
      </Route>

      <Route
        path="/status"
        element={
          <BackendStatusPage
            appName="Technician"
            audience="For field specialists. Accept emergency jobs, verify 415V LOTO, and withdraw IMPS earnings."
            port={3001}
            http={http}
            mapsKeyPresent={env.googleMapsKey !== ''}
          />
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
