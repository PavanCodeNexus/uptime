import { useQuery } from '@tanstack/react-query';
import { getHealth } from '../api/health';
import { isApiError } from '../lib/errors';
import type { HttpClient } from '../lib/http';
import { useTheme } from './useTheme';

export interface BackendStatusPageProps {
  /** For example "Owner" */
  appName: string;
  /** One line about who this app is for. */
  audience: string;
  /** The dev-server port this app runs on. */
  port: number;
  http: HttpClient;
  mapsKeyPresent: boolean;
}

const THEME_LABEL = { system: 'Theme: system', light: 'Theme: light', dark: 'Theme: dark' } as const;

/**
 * Phase 0 home screen for all three apps. It proves the app can reach the backend
 * (right address, CORS allowed, backend running). Phase 1 replaces it with the real login.
 */
export function BackendStatusPage({ appName, audience, port, http, mapsKeyPresent }: BackendStatusPageProps) {
  const { theme, cycle } = useTheme();
  const q = useQuery({
    queryKey: ['backend-health', http.baseUrl],
    queryFn: () => getHealth(http),
    retry: false,
  });

  const state = q.isPending ? 'checking' : q.isError ? 'down' : 'up';
  const pill =
    state === 'up'
      ? 'bg-success-soft text-success'
      : state === 'down'
        ? 'bg-danger-soft text-danger'
        : 'bg-surface-2 text-fg-2';
  const pillText = state === 'up' ? 'Connected' : state === 'down' ? 'Not reachable' : 'Checking...';

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-lg font-bold text-accent" aria-hidden="true">
            &uarr;
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-ink">UPTIME</p>
            <p className="text-xs text-fg-muted">{appName} app</p>
          </div>
        </div>
        <button
          type="button"
          onClick={cycle}
          className="min-h-tap rounded-lg border border-line-strong bg-surface px-3 text-sm text-fg-2 hover:border-brand-ink"
        >
          {THEME_LABEL[theme]}
        </button>
      </header>

      <main className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{appName} app is set up</h1>
          <p className="mt-1 text-fg-2">{audience}</p>
        </div>

        <section className="rounded-xl border border-line bg-surface p-4" aria-labelledby="conn-h">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="conn-h" className="text-base font-semibold">
              Backend connection
            </h2>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${pill}`} role="status" aria-live="polite">
              {pillText}
            </span>
          </div>

          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="text-fg-muted">Backend address</dt>
            <dd className="break-all font-mono text-xs">{http.baseUrl}</dd>
            <dt className="text-fg-muted">This app runs on</dt>
            <dd className="font-mono text-xs">http://localhost:{port}</dd>
            <dt className="text-fg-muted">Google Maps key</dt>
            <dd>{mapsKeyPresent ? 'Set' : 'Not set. Maps will show a simple location card instead.'}</dd>
          </dl>

          {state === 'up' && (
            <pre className="mt-3 overflow-x-auto rounded-lg bg-surface-2 p-3 font-mono text-xs text-fg-2">
              {JSON.stringify(q.data, null, 2)}
            </pre>
          )}

          {state === 'down' && (
            <div className="mt-3 rounded-lg bg-danger-soft p-3 text-sm text-danger">
              <p className="font-semibold">{q.error instanceof Error ? q.error.message : 'Could not connect.'}</p>
              {isApiError(q.error) && q.error.code !== 'NETWORK' ? (
                <p className="mt-1">The backend answered, but not with a healthy reply (code {q.error.code}).</p>
              ) : (
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Is the backend running? Start it from the backend folder, then press Check again.</li>
                  <li>Is the address above right? It comes from VITE_API_BASE_URL in this app&apos;s .env.local file.</li>
                  <li>Is this app on port {port}? The backend only allows ports 3000, 3001, 3002 and 5173.</li>
                </ul>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => void q.refetch()}
            disabled={q.isFetching}
            className="mt-4 min-h-tap rounded-lg bg-brand px-4 text-sm font-semibold text-on-brand disabled:opacity-60"
          >
            {q.isFetching ? 'Checking...' : 'Check again'}
          </button>
        </section>

        <p className="text-sm text-fg-muted">Next up, Phase 1: sign in with phone and one-time code.</p>
      </main>
    </div>
  );
}
