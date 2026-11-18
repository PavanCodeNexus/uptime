import { adminApi, Button, errorMessage, Notice } from '@uptime/shared';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { http } from '../lib/api';

/** Four headline numbers. */
export default function OverviewPage() {
  const q = useQuery({ queryKey: ['admin', 'dashboard'], queryFn: () => adminApi.dashboard(http), refetchInterval: 30000 });
  const cards = q.data
    ? [
        { label: 'Users', value: q.data.totalUsers },
        { label: 'Technicians', value: q.data.totalTechnicians },
        { label: 'Jobs', value: q.data.totalJobs },
        { label: 'Documents waiting', value: q.data.pendingKycDocuments },
      ]
    : [];
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
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
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-xl border border-line bg-surface p-5">
              <dt className="text-sm text-fg-muted">{c.label}</dt>
              <dd className="mt-1 text-3xl font-bold">{c.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {q.isSuccess && q.data.pendingKycDocuments > 0 && (
        <Notice tone="info">
          {q.data.pendingKycDocuments} document(s) are waiting.{' '}
          <Link to="/kyc" className="font-semibold underline">
            Review them
          </Link>
        </Notice>
      )}
    </div>
  );
}
