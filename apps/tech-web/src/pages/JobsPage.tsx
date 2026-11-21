import { Button, errorMessage, formatDateTime, industryInfo, jobsApi, Notice, StatusBadge, TextField, workApi, type Job } from '@uptime/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { http } from '../lib/api';

function AcceptByNumber() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [input, setInput] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const find = useMutation({ mutationFn: (id: number) => jobsApi.get(http, id), onSuccess: setJob });
  const accept = useMutation({
    mutationFn: (id: number) => workApi.accept(http, id),
    onSuccess: (j) => {
      void qc.invalidateQueries({ queryKey: ['tech', 'jobs'] });
      nav(`/jobs/${j.id}`);
    },
  });

  function onFind(e: FormEvent) {
    e.preventDefault();
    const n = Number(input);
    if (!Number.isInteger(n) || n < 1) return setErr('Type the job number, for example 1.');
    setErr(null);
    setJob(null);
    accept.reset();
    find.mutate(n);
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5" aria-labelledby="acc-h">
      <h2 id="acc-h" className="text-base font-semibold">
        Take a new job
      </h2>
      <p className="text-sm text-fg-2">There is no open-jobs list yet. The owner gives you the job number, or you see it in the owner's job page.</p>
      <form onSubmit={onFind} className="flex flex-wrap items-end gap-3" noValidate>
        <div className="w-40">
          <TextField label="Job number" inputMode="numeric" value={input} onChange={(e) => setInput(e.target.value.replace(/\D/g, ''))} error={err} />
        </div>
        <Button type="submit" variant="secondary" loading={find.isPending}>
          Find job
        </Button>
      </form>
      {find.isError && <Notice tone="danger">{errorMessage(find.error)}</Notice>}
      {job && (
        <div className="rounded-lg border border-line p-4 text-sm">
          <p className="font-semibold">
            {job.jobNumber} <StatusBadge status={job.status} />
          </p>
          <p className="mt-1">
            {industryInfo(job.industry)?.label ?? job.industry} &middot; {job.equipmentSummary}
          </p>
          <p className="text-fg-2">{job.problemDescription}</p>
          <p className="text-fg-2">{[job.ownerAddress, job.ownerCity].filter(Boolean).join(', ')}</p>
          {accept.isError && (
            <div className="mt-3">
              <Notice tone="danger">{errorMessage(accept.error)}</Notice>
            </div>
          )}
          <Button className="mt-3" onClick={() => accept.mutate(job.id)} loading={accept.isPending}>
            Accept this job
          </Button>
        </div>
      )}
    </section>
  );
}

/** My jobs, plus a box to take a new one. */
export default function JobsPage() {
  const q = useQuery({ queryKey: ['tech', 'jobs'], queryFn: () => jobsApi.list(http), refetchInterval: 15000 });
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">My jobs</h1>
      <AcceptByNumber />
      {q.isPending && <p className="text-fg-2" role="status">Loading...</p>}
      {q.isError && <Notice tone="danger">{errorMessage(q.error)}</Notice>}
      {q.isSuccess && q.data.length === 0 && <p className="rounded-xl border border-line bg-surface p-5 text-fg-2">No jobs yet.</p>}
      {q.isSuccess && q.data.length > 0 && (
        <ul className="flex flex-col gap-3">
          {q.data.map((j) => (
            <li key={j.id}>
              <Link to={`/jobs/${j.id}`} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface p-4 hover:bg-surface-2">
                <span>
                  <span className="font-semibold">{j.jobNumber}</span> <span className="text-fg-2">&middot; {j.equipmentSummary}</span>
                  <span className="block text-xs text-fg-muted">{formatDateTime(j.createdAt)}</span>
                </span>
                <StatusBadge status={j.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
