import { BackendStatusPage, PhoneLoginPage, RequireAuth } from '@uptime/shared';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { OwnerLayout } from './components/OwnerLayout';
import { http } from './lib/api';
import { env } from './lib/env';
import JobDetailPage from './pages/JobDetailPage';
import JobsPage from './pages/JobsPage';
import ReportFaultPage from './pages/ReportFaultPage';

function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-fg-2">That address does not exist in this app.</p>
      <Link to="/" className="min-h-tap inline-flex items-center rounded-lg bg-brand px-4 text-sm font-semibold text-on-brand">
        Go to the home page
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<PhoneLoginPage appName="Owner app" headline="Sign in to UPTIME" subline="Report a fault and get a verified technician." homePath="/report" showDevHint={env.isDev} askIndustry />}
      />
      <Route
        element={
          <RequireAuth>
            <OwnerLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Navigate to="/report" replace />} />
        <Route path="/report" element={<ReportFaultPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
      </Route>
      <Route
        path="/status"
        element={
          <BackendStatusPage
            appName="Owner"
            audience="For factory owners, vehicle owners and households. Report a fault, get matched with a verified technician, track, and pay."
            port={3000}
            http={http}
            mapsKeyPresent={env.googleMapsKey !== ''}
          />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
