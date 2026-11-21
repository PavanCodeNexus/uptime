import { Button, earningsApi, errorMessage, formatINR, Notice } from '@uptime/shared';
import { useQuery } from '@tanstack/react-query';
import { http } from '../lib/api';

const nice = (k: string) => k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').toLowerCase().replace(/^./, (c) => c.toUpperCase());
const looksMoney = (k: string) => /earn|amount|balance|total|payout|wallet|paid|fee/i.test(k);

/** Whatever the backend sends for earnings, shown as a simple list. */
export default function EarningsPage() {
  const q = useQuery({ queryKey: ['tech', 'earnings'], queryFn: () => earningsApi.get(http) });
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Earnings</h1>
      {q.isPending && <p className="text-fg-2" role="status">Loading...</p>}
      {q.isError && (
        <div className="flex flex-col items-start gap-3">
          <Notice tone="danger">{errorMessage(q.error)}</Notice>
          <Button variant="secondary" onClick={() => void q.refetch()}>
            Try again
          </Button>
        </div>
      )}
      {q.isSuccess && (
        <dl className="grid gap-3 sm:grid-cols-2">
          {Object.entries(q.data)
            .filter(([, v]) => typeof v === 'number' || typeof v === 'string')
            .map(([k, v]) => (
              <div key={k} className="rounded-xl border border-line bg-surface p-4">
                <dt className="text-sm text-fg-muted">{nice(k)}</dt>
                <dd className="text-xl font-bold">{looksMoney(k) && !Number.isNaN(Number(v)) ? formatINR(Number(v)) : String(v)}</dd>
              </div>
            ))}
        </dl>
      )}
    </div>
  );
}
