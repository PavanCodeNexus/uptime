import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { errorMessage } from '../lib/errors';
import { Button, Notice, TextField, UptimeEmblem } from './kit';

/** Figma A01 (Zero-Trust NOC Login) + A02 (RFC 6238 TOTP 2FA & JWT Claims) + A03 (AUTH_003 Lockout Preview). */
export function AdminLoginPage({ homePath = '/', showDevHint }: { homePath?: string; showDevHint?: boolean }) {
  const { status, temp2faToken, session } = useAuth();
  const [email, setEmail] = useState('pavan.noc.lead@uptime.in');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLockoutPreview, setShowLockoutPreview] = useState(false);
  const [ttlSeconds, setTtlSeconds] = useState(282);

  useEffect(() => {
    if (!temp2faToken) return;
    setTtlSeconds(300);
    const id = window.setInterval(() => setTtlSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => window.clearInterval(id);
  }, [temp2faToken]);

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

  if (status === 'authenticated') return <Navigate to={homePath} replace />;

  const step1 = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return setError('Enter your email and password.');
    void run(() => session.adminLogin(email, password));
  };
  const step2 = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) return setError('Enter the 6-digit code from your authenticator app.');
    void run(() => session.adminVerify(code));
  };

  const mins = String(Math.floor(ttlSeconds / 60)).padStart(2, '0');
  const secs = String(ttlSeconds % 60).padStart(2, '0');
  const codeDigits = Array.from({ length: 6 }, (_, i) => code[i] ?? '');

  // A03: 5-Attempt Security Lockout View
  if (showLockoutPreview) {
    return (
      <div className="min-h-screen bg-[#070C18] px-4 py-10 flex items-center justify-center">
        <div className="w-full max-w-4xl rounded-3xl bg-rose-950 text-white border-2 border-rose-500/60 p-7 sm:p-9 space-y-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white text-xl shadow-lg">
                <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-mono text-[10px] font-black">HTTP 423 LOCKED • AUTH_003</span>
                  <span className="font-mono text-xs text-rose-300">INCIDENT #SOC-2026-8841</span>
                </div>
                <h1 className="text-xl font-display font-black text-white mt-0.5">Mandatory 30-Minute Security Lockout Active</h1>
              </div>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-black/50 border border-rose-500/40 text-center font-mono">
              <div className="text-[10px] text-rose-300 uppercase">Lockout Remaining</div>
              <div className="text-2xl font-black text-rose-400">29 : 14</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-black/40 border border-rose-800/60 space-y-1">
              <div className="text-[10px] text-rose-300">TRIGGER RULE</div>
              <div className="font-bold text-white">5 Failed Attempts / 15m</div>
              <div className="text-[11px] text-rose-200/80">Redis sliding-window enforced</div>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-rose-800/60 space-y-1">
              <div className="text-[10px] text-rose-300">SOURCE TELEMETRY</div>
              <div className="font-bold text-white">103.21.58.142 (Bengaluru)</div>
              <div className="text-[11px] text-rose-200/80">Logged to immutable audit_logs</div>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-rose-800/60 space-y-1">
              <div className="text-[10px] text-rose-300">SOC ESCALATION</div>
              <div className="font-bold text-amber-300">PagerDuty CISO Alerted</div>
              <div className="text-[11px] text-rose-200/80">Hardware YubiKey co-sign required</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-rose-800/60">
            <div className="text-xs text-rose-200">
              Per <code className="font-mono">SECURITY.md</code> Section 3.4, locked admin accounts cannot be reset via email and require CISO hardware co-signing.
            </div>
            <button
              type="button"
              onClick={() => setShowLockoutPreview(false)}
              className="px-5 py-2.5 rounded-xl bg-white text-rose-950 font-bold text-xs hover:bg-rose-100"
            >
              Return to Step-1 Login (A01)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] px-4 py-8 flex flex-col justify-center">
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono text-[10px] font-extrabold">
              {temp2faToken ? 'A02 • STEP-2 TOTP 2FA GATE' : 'A01 • ZERO-TRUST NOC LOGIN'}
            </span>
            <span className="font-mono text-[11px] text-slate-500">UPTIME Admin &amp; Enterprise Fleet Command Console</span>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setShowLockoutPreview(true)} className="font-mono text-[11px] text-rose-600 hover:underline font-bold">
              Preview A03 Lockout
            </button>
            <Link to="/status" className="font-mono text-[11px] text-slate-500 hover:text-slate-900 underline">
              Backend Health
            </Link>
          </div>
        </div>

        {!temp2faToken ? (
          /* A01: STEP 1 — ZERO-TRUST SPLIT LOGIN */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[540px]">
            <div className="lg:col-span-6 rounded-3xl bg-black text-white p-8 flex flex-col justify-between border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 font-mono text-[10px] tracking-widest uppercase text-emerald-400 font-bold">
                  ZERO-TRUST NOC GATEWAY
                </span>
                <span className="font-mono text-[11px] text-slate-400">IP ALLOWLIST: VERIFIED</span>
              </div>

              <div className="my-auto py-8 text-center space-y-4">
                <div className="mx-auto w-fit">
                  <UptimeEmblem size="xl" accent="teal" />
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-display font-black tracking-tight text-white">UPTIME</div>
                  <div className="text-xs font-mono tracking-[0.28em] text-[#00D4AA] font-bold">PREDICT. REPAIR. PERFORM.</div>
                </div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Enterprise Fleet &amp; Industrial Command Console • Protected by RFC 6238 TOTP 2FA &amp; Immutable Audit Triggers.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-800 text-center font-mono text-[10px]">
                <div className="p-2 rounded-xl bg-zinc-900/90">
                  <div className="text-emerald-400 font-bold">30 MIN</div>
                  <div className="text-zinc-500">JWT TTL</div>
                </div>
                <div className="p-2 rounded-xl bg-zinc-900/90">
                  <div className="text-sky-400 font-bold">5 MAX</div>
                  <div className="text-zinc-500">LOGIN TRIES</div>
                </div>
                <div className="p-2 rounded-xl bg-zinc-900/90">
                  <div className="text-purple-400 font-bold">DPDP 2023</div>
                  <div className="text-zinc-500">VAULT</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-3xl bg-white border border-slate-200 p-7 sm:p-8 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-mono text-xs font-bold">STEP 1 OF 2 • CREDENTIALS</span>
                  <span className="text-xs font-mono text-emerald-600 font-bold">
                    <i className="fa-solid fa-shield-halved mr-1" aria-hidden="true"></i>Attempt 1 / 5
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-display font-extrabold text-slate-900">Administrator Sign In</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Validates institutional credentials and issues a 5-minute <code className="font-mono text-indigo-600">TEMP_2FA</code> challenge token.
                  </p>
                </div>

                {error && <Notice tone="danger">{error}</Notice>}

                <form onSubmit={step1} className="space-y-4 pt-1" noValidate>
                  <TextField label="Admin Official Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
                  <TextField label="Master Password (Bcrypt-12)" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-[11px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Origin Cluster:</span>
                      <span className="text-slate-800 font-bold">Bengaluru Peenya NOC #4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Rate Limit Window:</span>
                      <span className="text-amber-600 font-bold">5 attempts / 15m (30m Lockout)</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full min-h-tap py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                  >
                    <span>{busy ? 'Verifying...' : 'Verify Credentials & Proceed to Step-2 TOTP 2FA'}</span>
                    <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  </button>
                </form>
              </div>

              <div className="space-y-2.5 pt-4 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => session.enterDemo()}
                  className="w-full py-3 rounded-2xl border-2 border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-800 font-display font-extrabold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <i className="fa-solid fa-satellite-dish" aria-hidden="true"></i>
                  <span>Launch Live NOC Demo Command Console (All 24 Screens)</span>
                </button>
                <div className="text-[11px] text-center text-slate-400 font-mono">POST /api/v1/admin/auth/login → 200 OK (TEMP_2FA)</div>
              </div>
            </div>
          </div>
        ) : (
          /* A02: STEP 2 — TOTP 2FA + JWT CLAIMS PREVIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[540px]">
            <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 p-7 sm:p-8 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs font-bold">
                    STEP 2 OF 2 • RFC 6238 TOTP
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-mono text-xs font-bold">
                    <i className="fa-regular fa-clock mr-1" aria-hidden="true"></i>TEMP_2FA TTL: {mins}:{secs}
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-display font-extrabold text-slate-900">6-Digit Authenticator Verification</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter the 6-digit TOTP code from your hardware token or authenticator app to mint a 30-minute Admin JWT.
                  </p>
                </div>

                {error && <Notice tone="danger">{error}</Notice>}

                <div className="grid grid-cols-6 gap-2.5 py-2" aria-hidden="true">
                  {codeDigits.map((d, i) => (
                    <div
                      key={i}
                      className={`h-14 rounded-2xl border-2 flex items-center justify-center font-mono text-xl font-black shadow-xs ${
                        d ? 'border-indigo-600 bg-indigo-50/40 text-slate-900' : 'border-slate-200 bg-slate-50 text-slate-400'
                      }`}
                    >
                      {d || '•'}
                    </div>
                  ))}
                </div>

                <form onSubmit={step2} className="space-y-4" noValidate>
                  <TextField
                    label="6-digit authenticator code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    hint="You have 5 minutes before TEMP_2FA expires."
                    autoFocus
                  />
                  {showDevHint && <Notice tone="warning">Dev backend accepts 123456 or 654321.</Notice>}

                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-key text-indigo-600 text-lg" aria-hidden="true"></i>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Hardware YubiKey 5C NFC Ready</div>
                        <div className="text-[11px] text-slate-600">FIDO2 WebAuthn attested for KYC Vault signing</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-mono text-[10px] font-bold">READY</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button type="submit" loading={busy} className="bg-emerald-600 hover:bg-emerald-700">
                      <i className="fa-solid fa-unlock-keyhole" aria-hidden="true"></i>
                      Verify 2FA &amp; Launch Live Command Console (30m JWT)
                    </Button>
                    <Button variant="ghost" onClick={() => session.adminBack()}>
                      ← Back to Step-1 Credentials
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-3xl bg-slate-900 text-white p-6 flex flex-col justify-between border border-slate-800 shadow-2xl">
              <div className="space-y-3">
                <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">Issued JWT Claims Preview</div>
                <pre className="p-4 rounded-2xl bg-black/80 border border-slate-800 font-mono text-[11px] text-sky-300 overflow-x-auto leading-relaxed">{`{
  "sub": "adm_994120_pavan",
  "role": "SUPER_ADMIN",
  "amr": ["pwd", "totp", "hwk"],
  "cluster_scope": "ALL_INDIA",
  "kyc_vault_sign": true,
  "ttl_sec": 1800
}`}</pre>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 space-y-1">
                <div className="font-bold text-white">
                  <i className="fa-solid fa-gavel text-amber-400 mr-1.5" aria-hidden="true"></i>Zero-Trust Session Policy
                </div>
                <div>Admin JWTs never use refresh tokens and expire strictly after 30 minutes of wall-clock time.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
