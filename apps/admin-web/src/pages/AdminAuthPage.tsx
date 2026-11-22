import { ApiError, errorMessage, useAuth } from '@uptime/shared';
import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { env } from '../lib/env';

export default function AdminAuthPage() {
  const { status, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = (location.state as { from?: string } | null)?.from || '/';

  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('admin@uptime.in');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [localFallback, setLocalFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === 'authenticated') {
    return <Navigate to={nextPath} replace />;
  }

  async function handleCredentials(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim().includes('@')) {
      setError('Enter a valid corporate admin email address.');
      return;
    }
    if (password.trim().length < 4) {
      setError('Enter your admin password (minimum 4 characters).');
      return;
    }
    setBusy(true);
    try {
      await session.adminLogin(email.trim(), password);
      setLocalFallback(false);
      setStep('otp');
    } catch (err) {
      if (env.isDev && err instanceof ApiError && err.code === 'NETWORK') {
        setLocalFallback(true);
        setStep('otp');
      } else {
        setError(errorMessage(err));
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const cleaned = otp.replace(/\D/g, '');
    if (cleaned.length !== 6) {
      setError('Enter the 6-digit verification code.');
      return;
    }
    setBusy(true);
    try {
      if (localFallback) {
        if (cleaned !== '123456') {
          setError('Invalid verification code. Use 123456 for local preview.');
          setBusy(false);
          return;
        }
        session.enterDemo({ fullName: 'Operations Admin', email: email.trim() });
        navigate(nextPath, { replace: true });
        return;
      }
      await session.adminVerify(cleaned);
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#FAFAF8] px-4 py-10 text-[#050506]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#050506] text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path d="M12 4l6 8h-3.8v8H9.8v-8H6l6-8z" fill="#D9A53A" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#FAFAF8] bg-[#7D885E]" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight">UPTIME</span>
            <span className="ml-2 rounded-full border border-[#E8E8E2] bg-white px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#5B6443]">
              ADMIN
            </span>
          </div>
        </div>
        <span className="hidden font-mono text-[11px] text-[#64675F] sm:inline">Zero-Trust Operations Access</span>
      </div>

      <main className="mx-auto my-8 grid w-full max-w-5xl items-center gap-8 lg:grid-cols-12">
        {/* Left Editorial Overview */}
        <div className="animate-fade-up space-y-6 lg:col-span-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E8E2] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#5B6443]">
            <span className="h-2 w-2 rounded-full bg-[#7D885E]" />
            Executive Operations &amp; Analytics
          </span>
          <h1 className="font-display text-3xl font-bold leading-tight text-[#050506] sm:text-4xl">
            Precision command for industrial uptime across India.
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-[#64675F]">
            Monitor real-time GMV velocity, 15-minute SLA compliance, technician KYC credentials, and Razorpay escrow
            settlements from one unified workspace.
          </p>

          <div className="grid max-w-md grid-cols-3 gap-3 pt-2">
            <div className="admin-card p-3.5">
              <p className="font-mono text-lg font-bold text-[#050506]">98.6%</p>
              <p className="text-[11px] text-[#64675F]">15m SLA Rate</p>
            </div>
            <div className="admin-card p-3.5">
              <p className="font-mono text-lg font-bold text-[#5B6443]">2,840</p>
              <p className="text-[11px] text-[#64675F]">Specialists</p>
            </div>
            <div className="admin-card p-3.5">
              <p className="font-mono text-lg font-bold text-[#9B711C]">₹4.8Cr</p>
              <p className="text-[11px] text-[#64675F]">Monthly GMV</p>
            </div>
          </div>
        </div>

        {/* Right Clean Sign-In Card */}
        <div className="animate-stagger-2 lg:col-span-6">
          <div className="admin-card mx-auto w-full max-w-md p-7 sm:p-8">
            <div className="mb-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9B711C]">
                {step === 'credentials' ? 'Step 1 of 2 • Staff Credentials' : 'Step 2 of 2 • Authenticator Verification'}
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-[#050506]">
                {step === 'credentials' ? 'Sign in to Admin Console' : 'Enter 6-Digit MFA Code'}
              </h2>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
                {error}
              </div>
            )}

            {step === 'credentials' ? (
              <form onSubmit={handleCredentials} className="space-y-4">
                <div>
                  <label htmlFor="admin-email" className="mb-1.5 block text-xs font-semibold text-[#050506]">
                    Work Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@uptime.in"
                    className="w-full rounded-xl border border-[#E8E8E2] bg-[#FAFAF8] px-3.5 py-2.5 text-sm text-[#050506] outline-none transition-colors focus:border-[#050506] focus:bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="admin-password" className="mb-1.5 block text-xs font-semibold text-[#050506]">
                    Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-[#E8E8E2] bg-[#FAFAF8] px-3.5 py-2.5 text-sm text-[#050506] outline-none transition-colors focus:border-[#050506] focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full cursor-pointer rounded-xl bg-[#050506] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1E1F1D] disabled:opacity-60"
                >
                  {busy ? 'Verifying...' : 'Continue to MFA'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtp} className="space-y-4">
                {localFallback && (
                  <div className="rounded-xl border border-[#D9A53A]/40 bg-[#FBF6EA] px-3.5 py-2.5 text-xs text-[#735412]">
                    Local preview mode active (backend offline). Enter code <strong className="font-mono">123456</strong>.
                  </div>
                )}
                <div>
                  <label htmlFor="admin-otp" className="mb-1.5 block text-xs font-semibold text-[#050506]">
                    6-Digit Authenticator Code
                  </label>
                  <input
                    id="admin-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="w-full rounded-xl border border-[#E8E8E2] bg-[#FAFAF8] px-4 py-3 text-center font-mono text-xl font-bold tracking-[0.4em] text-[#050506] outline-none transition-colors focus:border-[#7D885E] focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full cursor-pointer rounded-xl bg-[#050506] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1E1F1D] disabled:opacity-60"
                >
                  {busy ? 'Signing in...' : 'Verify & Open Console'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('credentials');
                    setOtp('');
                    setError(null);
                  }}
                  className="w-full cursor-pointer rounded-xl border border-[#E8E8E2] py-2.5 text-xs font-semibold text-[#64675F] transition-colors hover:border-[#050506] hover:text-[#050506]"
                >
                  Back to credentials
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-5xl text-center font-mono text-[11px] text-[#8B8E85]">
        UPTIME Industrial Infrastructure Platform • Session-Scoped Admin Security
      </footer>
    </div>
  );
}
