import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { INDUSTRIES } from '../constants/job';
import { errorMessage } from '../lib/errors';
import { isValidIndianMobile, normalizeIndianMobile } from '../lib/format';
import { BrandMark, Button, Notice, TextField } from './kit';

export interface PhoneLoginPageProps {
  appName: string;
  headline: string;
  subline: string;
  /** Where to go after sign in when the person did not come from a protected page. */
  homePath?: string;
  /** Show the "demo code is 123456" hint. Pass true only for the dev backend. */
  showDevHint?: boolean;
  /** Ask owners for their industry on the profile step. */
  askIndustry?: boolean;
}

type Step = 'phone' | 'otp' | 'profile';

/** Phone number, then 6-digit code, then (for brand new accounts) name and details. */
export function PhoneLoginPage({ appName, headline, subline, homePath = '/', showDevHint, askIndustry }: PhoneLoginPageProps) {
  const { status, needsProfile, user, session } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? homePath;

  const [step, setStep] = useState<Step>('phone');
  const [phoneInput, setPhoneInput] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState<string>('AUTOMOTIVE');
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
      setCooldown(30);
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

  // Signed in and nothing left to ask: go to where they were heading.
  if (status === 'authenticated' && !needsProfile) return <Navigate to={from} replace />;
  const showProfile = status === 'authenticated' && needsProfile;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-4 py-8">
      <BrandMark appName={appName} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{showProfile ? 'Tell us about you' : headline}</h1>
        <p className="mt-1 text-fg-2">{showProfile ? 'This helps technicians and owners recognise you.' : subline}</p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5">
        {error && <Notice tone="danger">{error}</Notice>}

        {!showProfile && step === 'phone' && (
          <form onSubmit={sendCode} className="flex flex-col gap-4" noValidate>
            <TextField
              label="Mobile number"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="98765 43210"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              hint="We will send a one-time code to this number."
              autoFocus
            />
            <Button type="submit" loading={busy}>
              Send code
            </Button>
          </form>
        )}

        {!showProfile && step === 'otp' && (
          <form onSubmit={verify} className="flex flex-col gap-4" noValidate>
            <p className="text-sm text-fg-2">
              Code sent to <span className="font-mono">+91 {phone}</span>.{' '}
              <button type="button" className="text-brand-ink underline" onClick={() => setStep('phone')}>
                Change number
              </button>
            </p>
            <TextField
              label="6-digit code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              autoFocus
            />
            {showDevHint && <Notice tone="warning">Demo mode: the code is always 123456.</Notice>}
            <Button type="submit" loading={busy}>
              Verify and continue
            </Button>
            <Button variant="ghost" onClick={() => sendCode()} disabled={cooldown > 0 || busy}>
              {cooldown > 0 ? `Send again in ${cooldown}s` : 'Send the code again'}
            </Button>
          </form>
        )}

        {showProfile && (
          <form onSubmit={saveProfile} className="flex flex-col gap-4" noValidate>
            <TextField label="Full name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={user?.fullName} autoFocus />
            <TextField label="Email (optional)" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {askIndustry && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="industry" className="text-sm font-medium text-fg-2">
                  What do you mostly need repaired?
                </label>
                <select id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} className="min-h-tap rounded-lg border border-line-strong bg-surface px-3">
                  {INDUSTRIES.map((i) => (
                    <option key={i.value} value={i.value}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Button type="submit" loading={busy}>
              Save and continue
            </Button>
            <Button variant="ghost" onClick={() => session.skipProfile()}>
              Skip for now
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
