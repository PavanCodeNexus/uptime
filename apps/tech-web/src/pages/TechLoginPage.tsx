import { ApiError, errorMessage, useAuth } from '@uptime/shared';
import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { env } from '../lib/env';

export default function TechLoginPage() {
  const { status, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = (location.state as { from?: string } | null)?.from || '/';

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('9845099111');
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [localFallback, setLocalFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === 'authenticated') {
    return <Navigate to={nextPath} replace />;
  }

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setBusy(true);
    try {
      await session.sendOtp(digits);
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

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const cleaned = otp.replace(/\D/g, '');
    if (cleaned.length !== 6) {
      setError('Enter the 6-digit OTP code.');
      return;
    }
    setBusy(true);
    try {
      if (localFallback) {
        if (cleaned !== '123456') {
          setError('Invalid OTP. Use 123456 for local preview.');
          setBusy(false);
          return;
        }
        session.enterDemo({ fullName: 'Raju Kumar Sharma', phone: phone.replace(/\D/g, '') });
        navigate(nextPath, { replace: true });
        return;
      }
      await session.verifyOtp(phone.replace(/\D/g, ''), cleaned);
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#F4F7F6] px-4 py-10 text-[#102020]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F4C4C] text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path d="M12 4l6 8h-3.8v8H9.8v-8H6l6-8z" fill="#D96B27" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#F4F7F6] bg-[#10B981]" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-[#0F4C4C]">UPTIME</span>
            <span className="ml-2 rounded-full bg-[#EBF3F2] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0F4C4C]">
              SPECIALIST
            </span>
          </div>
        </div>
        <span className="hidden font-mono text-[11px] text-[#556868] sm:inline">415V Certified Field Network</span>
      </div>

      <main className="mx-auto my-8 grid w-full max-w-5xl items-center gap-8 lg:grid-cols-12">
        <div className="animate-tech-in space-y-5 lg:col-span-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E2EAE7] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0F4C4C]">
            <span className="h-2 w-2 rounded-full bg-[#10B981]" />
            Field Specialist Workstation
          </span>
          <h1 className="font-display text-3xl font-bold leading-tight text-[#102020] sm:text-4xl">
            Accept high-priority breakdowns. Get paid instantly via IMPS.
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-[#556868]">
            Receive AI-triaged CNC, EV fleet, and 415V power jobs in your cluster with transparent upfront payouts,
            digital LOTO safety checklists, and 88% take-home earnings.
          </p>
          <div className="grid max-w-md grid-cols-3 gap-3 pt-1">
            <div className="tech-card p-3.5">
              <p className="font-mono text-lg font-bold text-[#0F4C4C]">88%</p>
              <p className="text-[11px] text-[#556868]">Payout Share</p>
            </div>
            <div className="tech-card p-3.5">
              <p className="font-mono text-lg font-bold text-[#D96B27]">Instant</p>
              <p className="text-[11px] text-[#556868]">IMPS Escrow</p>
            </div>
            <div className="tech-card p-3.5">
              <p className="font-mono text-lg font-bold text-[#10B981]">ISO 45001</p>
              <p className="text-[11px] text-[#556868]">Shift Guard</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="tech-card mx-auto w-full max-w-md p-7 sm:p-8">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D96B27]">
              {step === 'phone' ? 'Specialist Sign-In' : 'Verify Mobile OTP'}
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-[#102020]">
              {step === 'phone' ? 'Start Your Field Shift' : 'Enter 6-Digit SMS Code'}
            </h2>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
                {error}
              </div>
            )}

            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="mt-5 space-y-4">
                <div>
                  <label htmlFor="tech-phone" className="mb-1.5 block text-xs font-semibold text-[#102020]">
                    Registered Mobile Number
                  </label>
                  <div className="flex items-center overflow-hidden rounded-xl border border-[#E2EAE7] bg-[#F4F7F6] focus-within:border-[#0F4C4C] focus-within:bg-white">
                    <span className="border-r border-[#E2EAE7] px-3.5 py-2.5 font-mono text-xs font-bold text-[#0F4C4C]">
                      +91
                    </span>
                    <input
                      id="tech-phone"
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9845099111"
                      className="w-full bg-transparent px-3.5 py-2.5 font-mono text-sm font-semibold text-[#102020] outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full cursor-pointer rounded-xl bg-[#0F4C4C] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0A3535] disabled:opacity-60"
                >
                  {busy ? 'Sending OTP...' : 'Send 6-Digit OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="mt-5 space-y-4">
                {localFallback && (
                  <div className="rounded-xl border border-[#D96B27]/30 bg-[#FDF2EA] px-3.5 py-2.5 text-xs text-[#9A4311]">
                    Local preview mode active. Enter OTP <strong className="font-mono">123456</strong>.
                  </div>
                )}
                <div>
                  <label htmlFor="tech-otp" className="mb-1.5 block text-xs font-semibold text-[#102020]">
                    6-Digit OTP sent to +91 {phone}
                  </label>
                  <input
                    id="tech-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="w-full rounded-xl border border-[#E2EAE7] bg-[#F4F7F6] px-4 py-3 text-center font-mono text-xl font-bold tracking-[0.4em] text-[#102020] outline-none focus:border-[#0F4C4C] focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full cursor-pointer rounded-xl bg-[#D96B27] px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
                >
                  {busy ? 'Verifying...' : 'Verify & Go Online'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                    setError(null);
                  }}
                  className="w-full cursor-pointer rounded-xl border border-[#E2EAE7] py-2.5 text-xs font-semibold text-[#556868] hover:border-[#0F4C4C] hover:text-[#0F4C4C]"
                >
                  Change mobile number
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-5xl text-center font-mono text-[11px] text-[#6E8282]">
        UPTIME Field Network • Verified Technicians &amp; Safe 415V Operations
      </footer>
    </div>
  );
}
