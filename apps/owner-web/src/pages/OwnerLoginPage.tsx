import {
  ApiError,
  Button,
  errorMessage,
  INDUSTRIES,
  isValidIndianMobile,
  normalizeIndianMobile,
  Notice,
  TextField,
  UptimeEmblem,
  useAuth,
} from '@uptime/shared';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { env } from '../lib/env';
import { useOwnerStore } from '../store/ownerStore';

interface LoginNavState {
  from?: string;
  reason?: string;
  draft?: { industry?: string; equipment?: string; description?: string };
  prefillPhone?: string;
  prefillCompany?: string;
}

type Step = 'phone' | 'otp' | 'profile';

/** Real customer authentication flow — live Spring Boot OTP with seamless local OTP fallback when backend is offline in dev. */
export default function OwnerLoginPage() {
  const { status, needsProfile, user, session } = useAuth();
  const { profile, updateProfile } = useOwnerStore();
  const location = useLocation();
  const navigate = useNavigate();
  const navState = (location.state as LoginNavState | null) ?? {};
  const from = navState.from ?? '/dashboard';

  const [step, setStep] = useState<Step>('phone');
  const [phoneInput, setPhoneInput] = useState(navState.prefillPhone ?? '');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState(navState.prefillCompany ?? '');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState<string>('INDUSTRIAL');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [offlineLocalMode, setOfflineLocalMode] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const phone = normalizeIndianMobile(phoneInput);

  async function sendCode(e?: FormEvent) {
    e?.preventDefault();
    if (!isValidIndianMobile(phoneInput)) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await session.sendOtp(phone);
      setOfflineLocalMode(false);
      setStep('otp');
      setOtp('');
      setCooldown(60);
    } catch (err) {
      if (env.isDev && err instanceof ApiError && err.code === 'NETWORK') {
        setOfflineLocalMode(true);
        setStep('otp');
        setOtp('');
        setCooldown(60);
      } else {
        setError(errorMessage(err));
      }
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit verification code.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (offlineLocalMode) {
        if (otp !== '123456') {
          setError('Invalid verification code. Use 123456 in local development mode.');
          return;
        }
        const displayName = name.trim() || profile.companyName || `Owner ${phone.slice(-4)}`;
        session.enterDemo({
          fullName: displayName,
          phone,
          email: email.trim() || profile.email,
          industryPreference: industry,
        });
        updateProfile({ emergencyPhone: `+91 ${phone}` });
        navigate(from, { replace: true, state: navState.draft ? { draft: navState.draft } : undefined });
        return;
      }
      await session.verifyOtp(phone, otp);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Please enter your name or company name (at least 2 characters).');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await session.saveProfile({
        fullName: name.trim(),
        ...(email.trim() ? { email: email.trim() } : {}),
        industryPreference: industry,
      });
      updateProfile({ companyName: name.trim(), ...(email.trim() ? { email: email.trim() } : {}) });
      navigate(from, { replace: true, state: navState.draft ? { draft: navState.draft } : undefined });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (status === 'authenticated' && !needsProfile) {
    return <Navigate to={from} replace state={navState.draft ? { draft: navState.draft } : undefined} />;
  }

  const showProfile = status === 'authenticated' && needsProfile;
  const otpDigits = Array.from({ length: 6 }, (_, i) => otp[i] ?? '');

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 flex flex-col justify-center">
      <div className="mx-auto w-full max-w-5xl space-y-5">
        <div className="flex items-center justify-between text-xs">
          <Link to="/" className="font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
            <i className="fa-solid fa-arrow-left text-[10px]" aria-hidden="true"></i>
            <span>Back to UPTIME Home</span>
          </Link>
          <span className="font-mono text-[11px] text-slate-500">100% Escrow Protected • DPDP Act 2023</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Brand Panel */}
          <div className="lg:col-span-5 rounded-3xl bg-slate-950 text-white p-8 flex flex-col justify-between border border-slate-800 shadow-2xl min-h-[460px]">
            <div className="flex items-center gap-3">
              <UptimeEmblem size="md" accent="teal" />
              <div>
                <div className="text-base font-display font-black tracking-tight">UPTIME</div>
                <div className="text-[10px] font-mono text-[#00D4AA] tracking-widest">PREDICT. REPAIR. PERFORM.</div>
              </div>
            </div>

            <div className="my-auto py-8 space-y-4">
              <h2 className="text-2xl font-display font-black leading-snug">
                Fast, Verified Industrial &amp; Fleet Maintenance
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sign in with your mobile number to run Gemini AI fault triage, dispatch certified engineers within 15 minutes, track live arrival, and access 18% GST ITC invoices.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2"><i className="fa-solid fa-shield-halved text-[#00D4AA]" aria-hidden="true"></i>500m geofence arrival OTP verification</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-lock text-[#00D4AA]" aria-hidden="true"></i>100% Escrow protection until handover</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-award text-[#00D4AA]" aria-hidden="true"></i>30-Day Zero-Fee Repair Warranty</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              24/7 Emergency Helpline: 1800-415-UPTIME
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 p-7 sm:p-9 shadow-xl flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-display font-black tracking-tight text-slate-900">
                  {showProfile ? 'Complete Your Plant Profile' : step === 'otp' ? 'Verify Your Mobile Number' : 'Sign In to UPTIME'}
                </h1>
                <p className="mt-1 text-xs text-slate-500">
                  {showProfile
                    ? 'Tell us your company name and primary sector so we can tailor AI diagnostics and technician matching.'
                    : step === 'otp'
                      ? `We sent a 6-digit verification code to +91 ${phone}.`
                      : 'Enter your 10-digit mobile number to receive a one-time login code.'}
                </p>
              </div>

              {navState.reason && !showProfile && step === 'phone' && (
                <Notice tone="info">{navState.reason}</Notice>
              )}

              {error && <Notice tone="danger">{error}</Notice>}

              {!showProfile && step === 'phone' && (
                <form onSubmit={sendCode} className="space-y-4" noValidate>
                  <div>
                    <label htmlFor="owner-phone" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Mobile Number
                    </label>
                    <div className="flex rounded-xl bg-slate-50 border border-slate-200 overflow-hidden focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/15">
                      <span className="px-3.5 py-3 bg-slate-100 text-slate-700 font-mono text-xs font-bold border-r border-slate-200 flex items-center">
                        +91
                      </span>
                      <input
                        id="owner-phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder="98450 88210"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        autoFocus
                        className="flex-1 min-h-tap px-3.5 bg-transparent font-mono text-sm font-bold text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full min-h-tap py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <span>{busy ? 'Sending OTP...' : 'Send 6-Digit OTP'}</span>
                    <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>
                  </button>
                </form>
              )}

              {!showProfile && step === 'otp' && (
                <form onSubmit={verify} className="space-y-4" noValidate>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>
                      Sent to <strong className="font-mono text-slate-900">+91 {phone}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('phone');
                        setError(null);
                      }}
                      className="font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Change number
                    </button>
                  </div>

                  <div className="grid grid-cols-6 gap-2" aria-hidden="true">
                    {otpDigits.map((d, idx) => (
                      <div
                        key={idx}
                        className={`h-12 rounded-xl border-2 flex items-center justify-center font-mono text-lg font-black ${
                          d ? 'border-blue-600 bg-blue-50/50 text-slate-900' : 'border-slate-200 bg-slate-50 text-slate-400'
                        }`}
                      >
                        {d || '•'}
                      </div>
                    ))}
                  </div>

                  <TextField
                    label="6-Digit Verification Code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                  />

                  {env.isDev && <Notice tone="warning">Local development OTP code: 123456</Notice>}

                  <div className="flex flex-col gap-2">
                    <Button type="submit" loading={busy} className="w-full bg-blue-600 hover:bg-blue-700">
                      Verify &amp; Continue
                    </Button>
                    <Button variant="ghost" onClick={() => void sendCode()} disabled={cooldown > 0 || busy} className="w-full">
                      {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend OTP via SMS / WhatsApp'}
                    </Button>
                  </div>
                </form>
              )}

              {showProfile && (
                <form onSubmit={saveProfile} className="space-y-4" noValidate>
                  <TextField
                    label="Full Name / Company Name"
                    autoComplete="organization"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={user?.fullName || 'Apex Precision Tools Pvt Ltd'}
                    autoFocus
                  />
                  <TextField label="Business Email (optional)" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <div className="space-y-2">
                    <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">Primary Operating Sector</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {INDUSTRIES.map((i) => (
                        <button
                          key={i.value}
                          type="button"
                          onClick={() => setIndustry(i.value)}
                          className={`p-3 rounded-xl border-2 text-left text-xs font-bold transition-colors cursor-pointer ${
                            industry === i.value ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {i.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" loading={busy} className="bg-blue-600 hover:bg-blue-700">
                      Save &amp; Continue
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        session.skipProfile();
                        navigate(from, { replace: true });
                      }}
                    >
                      Skip for now
                    </Button>
                  </div>
                </form>
              )}
            </div>

            <div className="pt-5 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>New factory, workshop, or fleet?</span>
              <Link to="/signup" className="font-bold text-blue-600 hover:underline">
                Register your company (18% GST ITC) →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
