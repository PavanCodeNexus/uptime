import { BackendStatusPage, PhoneLoginPage, RequireAuth } from '@uptime/shared';
import { Route, Routes } from 'react-router-dom';
import { TechLayout } from './components/TechLayout';
import { http } from './lib/api';
import { env } from './lib/env';
import EarningsPage from './pages/EarningsPage';
import FigmaScreenPage from './pages/FigmaScreenPage';
import FigmaStudioPage from './pages/FigmaStudioPage';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobWorkPage from './pages/JobWorkPage';
import ProfilePage from './pages/ProfilePage';
import VerificationPage from './pages/VerificationPage';
import { TECH_SCREENS } from './screens/techFigmaScreens';

const LIVE_TECH_CODES = new Set(['TW01', 'TW05', 'TW08', 'TW10', 'TW13', 'TW14', 'TW15']);
const PUBLIC_TECH_CODES = new Set(['TW02', 'TW03', 'TW04', 'TW25', 'TW26', 'TW27', 'TW28']);

export default function App() {
  const protectedFigmaScreens = TECH_SCREENS.filter((s) => !LIVE_TECH_CODES.has(s.code) && !PUBLIC_TECH_CODES.has(s.code));
  const publicFigmaScreens = TECH_SCREENS.filter((s) => PUBLIC_TECH_CODES.has(s.code));

  return (
    <Routes>
      {/* TW01 / TW03 / TW04 Specialist Authentication */}
      <Route
        path="/login"
        element={
          <PhoneLoginPage
            variant="tech"
            appName="Field Specialist Workstation"
            headline="UPTIME Field Specialist"
            subline="Sign in to accept emergency 415V CNC, fleet & power dispatches with instant IMPS payouts."
            homePath="/"
            signupPath="/signup"
            showDevHint={env.isDev}
          />
        }
      />

      {/* Public Technician Figma screens (TW02 Signup, TW03 OTP, TW04 Onboarding, TW25 Terms, TW26 Privacy, TW27 404, TW28 Offline) */}
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

      {/* Protected Specialist Cockpit (all 28 screens native via Dark Sidebar + Top Command Bar) */}
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
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/skills" element={<ProfilePage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/documents" element={<VerificationPage />} />
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
            appName="Technician"
            audience="For technicians. Get verified, accept jobs, and get paid."
            port={3001}
            http={http}
            mapsKeyPresent={env.googleMapsKey !== ''}
          />
        }
      />

      {/* TW27 Branded 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-[#F8FAFC] p-6 flex items-center justify-center">
            <div className="w-full max-w-4xl">
              <FigmaScreenPage code="TW27" />
            </div>
          </div>
        }
      />
    </Routes>
  );
}
