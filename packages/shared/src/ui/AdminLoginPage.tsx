import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { errorMessage } from '../lib/errors';
import { BrandMark, Button, Notice, TextField } from './kit';

/** Admin sign-in: email and password first, then a 6-digit authenticator code. */
export function AdminLoginPage({ homePath = '/', showDevHint }: { homePath?: string; showDevHint?: boolean }) {
  const { status, temp2faToken, session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-4 py-8">
      <BrandMark appName="Admin" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin sign in</h1>
        <p className="mt-1 text-fg-2">Staff only. Your session ends after 30 minutes.</p>
      </div>
      <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5">
        {error && <Notice tone="danger">{error}</Notice>}
        {!temp2faToken ? (
          <form onSubmit={step1} className="flex flex-col gap-4" noValidate>
            <TextField label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
            <TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" loading={busy}>
              Continue
            </Button>
          </form>
        ) : (
          <form onSubmit={step2} className="flex flex-col gap-4" noValidate>
            <TextField
              label="6-digit code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              hint="You have 5 minutes to enter it."
              autoFocus
            />
            {showDevHint && <Notice tone="warning">Dev backend accepts 123456 or 654321.</Notice>}
            <Button type="submit" loading={busy}>
              Sign in
            </Button>
            <Button variant="ghost" onClick={() => session.adminBack()}>
              Back
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
