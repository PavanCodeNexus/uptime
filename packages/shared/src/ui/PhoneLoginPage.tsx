import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { INDUSTRIES } from '../constants/job';
import { errorMessage } from '../lib/errors';
import { isValidIndianMobile, normalizeIndianMobile } from '../lib/format';
import { Button, Notice, TextField, UptimeEmblem } from './kit';

export interface PhoneLoginPageProps {
  appName: string;
  headline: string;
  subline: string;
  /** Visual variant matching the Figma Owner Web (W02/W04/W05) or Technician Web (TW01/TW03/TW04) designs. */
  variant?: 'owner' | 'tech';
  /** Where to go after sign in when the person did not come from a protected page. */
  homePath?: string;
  /** Optional route to the signup/registration screen. */
  signupPath?: string;
  /** Optional route back to public landing portal (Owner W01). */
  landingPath?: string;
  /** Show the "demo code is 123456" hint. Pass true only for the dev backend. */
  showDevHint?: boolean;
  /** Ask owners for their industry on the profile step. */
  askIndustry?: boolean;
}

type Step = 'phone' | 'otp' | 'profile';

const DEMO_TIERS = ['L0 Novice', 'L1 Junior', 'L2 Senior', 'L3 Master'] as const;

/** Figma W02/W04/W05 (Owner) & TW01/TW03/TW04 (Technician) authentication flow with live backend OTP + Demo mode. */
export function PhoneLoginPage({
  appName,
  headline,
  subline,
  variant = 'owner',
  homePath = '/',
  signupPath = '/signup',
  landingPath,
  showDevHint,
  askIndustry,
}: PhoneLoginPageProps) {
  const { status, needsProfile, user, session } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? homePath;

  const isTech = variant === 'tech';
  const [step, setStep] = useState<Step>('phone');
  const [phoneInput, setPhoneInput] = useState(isTech ? '98765 43210' : '98450 88210');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState<string>('INDUSTRIAL');
  const [demoTier, setDemoTier] = useState<(typeof DEMO_TIERS)[number]>('L2 Senior');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const phone = normalizeIndianMobile(phoneInput);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  const sendCode = (e?: FormEvent) => {
    e?.preventDefault();
    if (!isValidIndianMobile(phoneInput)) return setError('Enter a valid 10-digit mobile number.');
    void run(async () => {
      await session.sendOtp(phone);
      setStep('otp');
      setOtp('');
      setCooldown(60);
    });
  };

  const verify = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) return setError('Enter the 6-digit code.');
    void run(() => session.verifyOtp(phone, otp));
  };

  const saveProfile = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError('Please enter your name (at least 2 letters).');
    void run(() =>
      session.saveProfile({
        fullName: name.trim(),
        ...(email.trim() ? { email: email.trim() } : {}),
        ...(askIndustry ? { industryPreference: industry } : {}),
      }),
    );
  };

  if (status === 'authenticated' && !needsProfile) return <Navigate to={from} replace />;
  const showProfile = status === 'authenticated' && needsProfile;

  const otpDigits = Array.from({ length: 6 }, (_, i) => otp[i] ?? '');

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 flex flex-col justify-center">
      <div className="mx-auto w-full max-w-5xl space-y-5">
        {/* Top Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-extrabold border ${isTech ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
              {isTech ? 'TW01 • SPECIALIST PORTAL' : 'W02 • OWNER WORKSTATION'}
            </span>
            <span className="font-mono text-[11px] text-slate-500">{appName}</span>
          </div>
          <div className="flex items-center gap-3">
            {landingPath && (
              <Link to={landingPath} className="font-bold text-slate-600 hover:text-slate-900">
                ← Public Portal (W01)
              </Link>
            )}
            <Link to="/status" className="font-mono text-[11px] text-slate-500 hover:text-slate-900 underline">
              Backend Health
            </Link>
          </div>
        </div>

        {/* Main Split Figma Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left: Pitch-Black UPTIME Official Master Lockup */}
          <div className="lg:col-span-6 rounded-3xl bg-black text-white p-8 flex flex-col justify-between border border-slate-800 shadow-2xl min-h-[500px]">
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full bg-white/10 border border-white/15 font-mono text-[10px] tracking-widest uppercase font-bold ${isTech ? 'text-orange-400' : 'text-emerald-400'}`}>
                {isTech ? 'FIELD SPECIALIST WORKSTATION' : 'ENTERPRISE OWNER WORKSTATION'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">SECURE HTTPS</span>
            </div>

            <div className="my-auto py-8 text-center space-y-4">
              <div className="mx-auto w-fit">
                <UptimeEmblem size="xl" accent={isTech ? 'orange' : 'teal'} />
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-display font-black tracking-tight text-white">UPTIME</div>
                <div className={`text-xs font-mono tracking-[0.26em] font-bold ${isTech ? 'text-orange-400' : 'text-[#00D4AA]'}`}>
                  PREDICT. REPAIR. PERFORM.
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                {isTech
                  ? 'Manage industrial CNC, fleet & 415V power dispatches, mandatory LOTO checklists, Polygon NFT badges, and instant T+1 IMPS payouts.'
                  : 'Access real-time plant diagnostics, Gemini AI fault triage, 15-minute emergency technician dispatch, Digital Twin FFT telemetry, and 100% escrow protection.'}
              </p>
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border font-mono text-[11px] font-bold ${isTech ? 'bg-orange-500/15 border-orange-500/30 text-orange-300' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'}`}>
                <span className={`w-2 h-2 rounded-full pulse-live ${isTech ? 'bg-orange-400' : 'bg-emerald-400'}`}></span>
                {isTech ? '2,840 CERTIFIED SPECIALISTS ONLINE' : '15-MINUTE EMERGENCY SLA GUARANTEED'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-800 text-center font-mono text-[10px]">
              <div className="p-2 rounded-xl bg-zinc-900/90">
                <div className="text-emerald-400 font-bold">{isTech ? 'T+1 IMPS' : '100%'}</div>
                <div className="text-zinc-500">{isTech ? 'PAYOUTS' : 'ESCROW HOLD'}</div>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900/90">
                <div className={isTech ? 'text-orange-400 font-bold' : 'text-sky-400 font-bold'}>{isTech ? '415V LOTO' : '98.4%'}</div>
                <div className="text-zinc-500">{isTech ? 'CERTIFIED' : 'ON-TIME SLA'}</div>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900/90">
                <div className="text-purple-400 font-bold">DPDP 2023</div>
                <div className="text-zinc-500">COMPLIANT</div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Auth Card */}
          <div className="lg:col-span-6 rounded-3xl bg-white border border-slate-200 p-7 sm:p-8 flex flex-col justify-between shadow-xl">
            <div className="space-y-5">
              <div>
                <span className={`inline-block px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold mb-2 ${isTech ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>
                  {showProfile
                    ? isTech
                      ? 'TW04 • PROFILE & TRADE SETUP'
                      : 'W05 • PLANT SECTOR ONBOARDING'
                    : step === 'otp'
                      ? isTech
                        ? 'TW03 • 6-DIGIT SECURITY OTP'
                        : 'W04 • 6-DIGIT SECURE OTP'
                      : isTech
                        ? 'TW01 • SPECIALIST SIGN IN'
                        : 'W02 • CORPORATE SIGN IN'}
                </span>
                <h1 className="text-2xl font-display font-black tracking-tight text-slate-900">
                  {showProfile ? 'Configure Your Primary Sector' : step === 'otp' ? 'Verify Your Phone' : headline}
                </h1>
                <p className="mt-1 text-xs text-slate-500">
                  {showProfile ? 'Tailors your diagnostic AI, spare parts catalog, and certified dispatch.' : subline}
                </p>
              </div>

              {error && <Notice tone="danger">{error}</Notice>}

              {/* Tech Demo Tier Switcher (TW01) */}
              {isTech && !showProfile && step === 'phone' && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>Quick Demo Role Switcher</span>
                    <span className="text-emerald-600 font-bold">{demoTier} Active</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 text-[11px] font-bold">
                    {DEMO_TIERS.map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setDemoTier(tier)}
                        className={`px-2 py-1.5 rounded-xl border transition-all ${
                          demoTier === tier
                            ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 1: PHONE */}
              {!showProfile && step === 'phone' && (
                <form onSubmit={sendCode} className="space-y-4" noValidate>
                  <div>
                    <label htmlFor="f-mobile" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      {isTech ? 'Registered Mobile Number / Specialist ID' : 'Business Mobile Number'}
                    </label>
                    <div className="flex rounded-xl bg-slate-50 border border-slate-200 overflow-hidden focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/15">
                      <span className="px-3.5 py-3 bg-slate-100 text-slate-600 font-mono text-xs font-bold border-r border-slate-200 flex items-center">+91</span>
                      <input
                        id="f-mobile"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder="98765 43210"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        autoFocus
                        className="flex-1 px-3.5 py-3 bg-transparent font-mono text-sm font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">We will send a one-time 6-digit verification code via SMS / WhatsApp.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className={`w-full min-h-tap py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${
                      isTech ? 'bg-slate-900 hover:bg-black' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <span>{busy ? 'Sending code...' : 'Send Secure 6-Digit OTP'}</span>
                    <i className={`fa-solid fa-arrow-right text-xs ${isTech ? 'text-orange-400' : 'text-blue-200'}`} aria-hidden="true"></i>
                  </button>
                </form>
              )}

              {/* STEP 2: 6-DIGIT OTP (W04 / TW03) */}
              {!showProfile && step === 'otp' && (
                <form onSubmit={verify} className="space-y-4" noValidate>
                  <p className="text-xs text-slate-600">
                    Code sent to <span className="font-mono font-bold text-slate-900">+91 {phone}</span>.{' '}
                    <button type="button" className="font-bold text-blue-600 underline" onClick={() => setStep('phone')}>
                      Change number
                    </button>
                  </p>

                  {/* 6 Visual OTP Boxes synced to input */}
                  <div className="grid grid-cols-6 gap-2" aria-hidden="true">
                    {otpDigits.map((d, idx) => (
                      <div
                        key={idx}
                        className={`h-12 rounded-xl border-2 flex items-center justify-center font-mono text-lg font-black ${
                          d ? (isTech ? 'border-orange-500 bg-orange-50/40 text-slate-900' : 'border-blue-600 bg-blue-50/40 text-slate-900') : 'border-slate-200 bg-slate-50 text-slate-400'
                        }`}
                      >
                        {d || '•'}
                      </div>
                    ))}
                  </div>

                  <TextField
                    label="Enter 6-digit code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                  />
                  {showDevHint && <Notice tone="warning">Dev backend mode: the verification OTP is always 123456.</Notice>}
                  <div className="flex flex-col gap-2">
                    <Button type="submit" loading={busy} className={isTech ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}>
                      Verify &amp; Enter Workstation
                    </Button>
                    <Button variant="ghost" onClick={() => sendCode()} disabled={cooldown > 0 || busy}>
                      {cooldown > 0 ? `Resend via WhatsApp / SMS in ${cooldown}s` : 'Send the code again'}
                    </Button>
                  </div>
                </form>
              )}

              {/* STEP 3: PROFILE / SECTOR ONBOARDING (W05) */}
              {showProfile && (
                <form onSubmit={saveProfile} className="space-y-4" noValidate>
                  <TextField label="Full name / Plant Coordinator" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={user?.fullName} autoFocus />
                  <TextField label="Corporate email (optional)" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  {askIndustry && (
                    <div className="space-y-2">
                      <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">Primary Operating Sector</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {INDUSTRIES.map((i) => (
                          <button
                            key={i.value}
                            type="button"
                            onClick={() => setIndustry(i.value)}
                            className={`p-3 rounded-2xl border-2 text-left text-xs font-bold transition-all ${
                              industry === i.value ? 'border-purple-600 bg-purple-50 text-purple-900' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                            }`}
                          >
                            {i.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" loading={busy} className="bg-blue-600 hover:bg-blue-700">
                      Save &amp; Continue
                    </Button>
                    <Button variant="ghost" onClick={() => session.skipProfile()}>
                      Skip for now
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Bottom: Instant Interactive Demo Preview + Signup Link */}
            <div className="pt-5 mt-5 border-t border-slate-100 space-y-3">
              <button
                type="button"
                onClick={() => session.enterDemo()}
                className={`w-full py-3 rounded-2xl border-2 font-display font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                  isTech
                    ? 'border-orange-200 bg-orange-50/70 hover:bg-orange-100 text-orange-800'
                    : 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800'
                }`}
              >
                <i className="fa-solid fa-rocket" aria-hidden="true"></i>
                <span>{isTech ? `Enter Live Demo Specialist Cockpit (${demoTier} • All 28 Screens)` : 'Enter Live Demo Owner Dashboard (All 44 Screens)'}</span>
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{isTech ? 'New industrial specialist?' : 'New factory plant or fleet?'}</span>
                <Link to={signupPath} className={`font-bold hover:underline ${isTech ? 'text-orange-600' : 'text-blue-600'}`}>
                  {isTech ? 'Apply for Certification →' : 'Register your company →'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
