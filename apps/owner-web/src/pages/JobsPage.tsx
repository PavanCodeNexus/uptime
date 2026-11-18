import { Button, errorMessage, formatDateTime, formatINR, industryInfo, Notice, StatusBadge, jobsApi } from '@uptime/shared';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { http } from '../lib/api';

/** "My jobs": every job the signed-in owner has reported, newest first. */
export default function JobsPage() {
  const q = useQuery({ queryKey: ['jobs'], queryFn: () => jobsApi.list(http), refetchInterval: 15000 });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">My jobs</h1>
        <Link to="/report" className="min-h-tap inline-flex items-center rounded-lg bg-brand px-4 text-sm font-semibold text-on-brand">
          Report a fault
        </Link>
      </div>

      {q.isPending && (
        <p className="text-fg-2" role="status">
          Loading your jobs...
        </p>
      )}
      {q.isError && (
        <div className="flex flex-col items-start gap-3">
          <Notice tone="danger">{errorMessage(q.error)}</Notice>
          <Button variant="secondary" onClick={() => void q.refetch()}>
            Try again
          </Button>
        </div>
      )}
      {q.isSuccess && q.data.length === 0 && (
        <div className="rounded-xl border border-line bg-surface p-8 text-center">
          <p className="font-semibold">No jobs yet</p>
          <p className="mt-1 text-sm text-fg-2">When something breaks, report it and a verified technician will be matched.</p>
        </div>
      )}
      {q.isSuccess && q.data.length > 0 && (
        <ul className="flex flex-col gap-3">
          {q.data.map((j) => (
            <li key={j.id}>
              <Link to={`/jobs/${j.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4 hover:border-brand-ink">
                <div className="min-w-0">
                  <p className="font-semibold">
                    {j.jobNumber} <span className="font-normal text-fg-muted">&middot; {industryInfo(j.industry)?.label ?? j.industry}</span>
                  </p>
                  <p className="truncate text-sm text-fg-2">{j.equipmentSummary}</p>
                  <p className="text-xs text-fg-muted">{formatDateTime(j.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={j.status} />
                  <span className="text-sm text-fg-2">{j.totalAmount > 0 ? formatINR(j.totalAmount) : 'Estimate pending'}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
