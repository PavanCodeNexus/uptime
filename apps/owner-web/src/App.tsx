import { BackendStatusPage, RequireAuth } from '@uptime/shared';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { HybridLayout } from './components/HybridLayout';
import { OwnerLayout } from './components/OwnerLayout';
import { http } from './lib/api';
import { env } from './lib/env';
import AiTriagePage from './pages/AiTriagePage';
import AssetsPage from './pages/AssetsPage';
import CartCheckoutPage from './pages/CartCheckoutPage';
import DashboardPage from './pages/DashboardPage';
import DigitalTwinPage from './pages/DigitalTwinPage';
import JobDetailPage from './pages/JobDetailPage';
import JobsPage from './pages/JobsPage';
import LandingPage from './pages/LandingPage';
import { NotFoundPage, PrivacyPage, TermsPage } from './pages/LegalPages';
import MarketplacePage from './pages/MarketplacePage';
import NotificationsPage from './pages/NotificationsPage';
import OwnerLoginPage from './pages/OwnerLoginPage';
import ProtectionPage from './pages/ProtectionPage';
import ReportFaultPage from './pages/ReportFaultPage';
import SettingsPage from './pages/SettingsPage';
import SignupPage from './pages/SignupPage';
import WalletPage from './pages/WalletPage';
import WikiPage from './pages/WikiPage';

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Customer Website */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<OwnerLoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Publicly browsable Marketplace, Cart & Repair Wiki (uses OwnerLayout when signed in, PublicHeader/Footer when guest) */}
        <Route element={<HybridLayout />}>
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/cart" element={<CartCheckoutPage />} />
          <Route path="/wiki" element={<WikiPage />} />
        </Route>

        {/* Protected Customer Workspace — redirects to /login with return path if guest clicks Book Technician / AI Triage / Dashboard */}
        <Route
          element={
            <RequireAuth>
              <OwnerLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/report" element={<ReportFaultPage />} />
          <Route path="/ai-triage" element={<AiTriagePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/machines" element={<Navigate to="/assets?tab=MACHINE" replace />} />
          <Route path="/vehicles" element={<Navigate to="/assets?tab=VEHICLE" replace />} />
          <Route path="/devices" element={<Navigate to="/assets?tab=DEVICE" replace />} />
          <Route path="/digital-twin" element={<DigitalTwinPage />} />
          <Route path="/protection" element={<ProtectionPage />} />
          <Route path="/insurance" element={<Navigate to="/protection" replace />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/subscription" element={<Navigate to="/wallet" replace />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<Navigate to="/settings" replace />} />
        </Route>

        <Route
          path="/status"
          element={
            <BackendStatusPage
              appName="Owner"
              audience="For factory owners, fleet operators and households. Report a fault, get matched with a verified technician, track, and pay."
              port={3000}
              http={http}
              mapsKeyPresent={env.googleMapsKey !== ''}
            />
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global DPDP Act 2023 Cookie Consent Banner & Preferences Modal */}
      <CookieConsentBanner />
    </>
  );
}
