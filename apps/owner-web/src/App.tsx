import { BackendStatusPage, PhoneLoginPage, RequireAuth } from '@uptime/shared';
import { Route, Routes } from 'react-router-dom';
import { OwnerLayout } from './components/OwnerLayout';
import { http } from './lib/api';
import { env } from './lib/env';
import DashboardPage from './pages/DashboardPage';
import FigmaScreenPage from './pages/FigmaScreenPage';
import FigmaStudioPage from './pages/FigmaStudioPage';
import JobDetailPage from './pages/JobDetailPage';
import JobsPage from './pages/JobsPage';
import LandingPage from './pages/LandingPage';
import ReportFaultPage from './pages/ReportFaultPage';
import { OWNER_SCREENS } from './screens/ownerFigmaScreens';

/** Screens wired to bespoke live React pages (others render their exact Figma screen natively via FigmaScreenPage). */
const LIVE_OWNER_CODES = new Set(['W01', 'W02', 'W06', 'W07', 'W11']);
const PUBLIC_FIGMA_CODES = new Set(['W03', 'W04', 'W05', 'W41', 'W42', 'W43', 'W44']);

export default function App() {
  const protectedFigmaScreens = OWNER_SCREENS.filter((s) => !LIVE_OWNER_CODES.has(s.code) && !PUBLIC_FIGMA_CODES.has(s.code));
  const publicFigmaScreens = OWNER_SCREENS.filter((s) => PUBLIC_FIGMA_CODES.has(s.code));

  return (
    <Routes>
      {/* W01 Public Enterprise Landing Portal */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />

      {/* W02 / W04 / W05 Owner Authentication & Sector Onboarding */}
      <Route
        path="/login"
        element={
          <PhoneLoginPage
            variant="owner"
            appName="Owner Workstation"
            headline="Sign In to Owner Portal"
            subline="Enter your registered business phone to dispatch verified L2/L3 specialists."
            homePath="/dashboard"
            signupPath="/signup"
            landingPath="/"
            showDevHint={env.isDev}
            askIndustry
          />
        }
      />

      {/* Public Figma screens (W03 Signup, W04 OTP preview, W05 Onboarding preview, W41 Terms, W42 Privacy, W43 404, W44 Offline) */}
      {publicFigmaScreens.map((s) => (
        <Route
          key={s.code}
          path={s.appPath}
          element={
            <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8">
              <div className="mx-auto max-w-5xl">
                <FigmaScreenPage code={s.code} />
              </div>
            </div>
          }
        />
      ))}

      {/* Protected Owner Workspace (all 44 screens reachable via Dark Sidebar + Top Command Bar) */}
      <Route
        element={
          <RequireAuth>
            <OwnerLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/report" element={<ReportFaultPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/gallery" element={<FigmaStudioPage />} />
        <Route path="/studio" element={<FigmaStudioPage />} />
        <Route path="/catalog" element={<FigmaStudioPage />} />
        {protectedFigmaScreens.map((s) => (
          <Route key={s.code} path={s.appPath} element={<FigmaScreenPage code={s.code} />} />
        ))}
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

      {/* W43 Branded 404 Recovery */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-[#F8FAFC] p-6 flex items-center justify-center">
            <div className="w-full max-w-4xl">
              <FigmaScreenPage code="W43" />
            </div>
          </div>
        }
      />
    </Routes>
  );
}
