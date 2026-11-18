import { adminApi, Button, errorMessage, Notice, TextField, type Technician } from '@uptime/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { http } from '../lib/api';

const LEVELS = [
  { v: 0, t: 'Level 0: just signed up' },
  { v: 1, t: 'Level 1: identity checked' },
  { v: 2, t: 'Level 2: can take jobs' },
  { v: 3, t: 'Level 3: top verified' },
];
const STATUSES = ['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'];

function Panel({ t, id }: { t: Technician; id: number }) {
  const [level, setLevel] = useState(t.verificationLevel);
  const [status, setStatus] = useState(t.verificationStatus || 'PENDING');
  const [reason, setReason] = useState('');
  const save = useMutation({ mutationFn: () => adminApi.verifyTechnician(http, id, level, status, reason.trim() || undefined) });
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5">
      <div>
        <h2 className="text-base font-semibold">
          {t.fullName} <span className="font-normal text-fg-muted">(#{id})</span>
        </h2>
        <p className="text-sm text-fg-2">
          Now level {t.verificationLevel}, status {String(t.verificationStatus).toLowerCase()}. Rating {t.ratingCount > 0 ? Number(t.ratingAvg).toFixed(1) : 'new'}, {t.jobsCompleted} jobs done.
        </p>
      </div>
      {save.isError && <Notice tone="danger">{errorMessage(save.error)}</Notice>}
      {save.isSuccess && <Notice tone="success">Saved. The technician can now be matched if they are online and available.</Notice>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lvl" className="text-sm font-medium text-fg-2">
            Level
          </label>
          <select id="lvl" value={level} onChange={(e) => setLevel(Number(e.target.value))} className="min-h-tap rounded-lg border border-line-strong bg-surface px-3">
            {LEVELS.map((l) => (
              <option key={l.v} value={l.v}>
                {l.t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="st" className="text-sm font-medium text-fg-2">
            Status
          </label>
          <select id="st" value={status} onChange={(e) => setStatus(e.target.value)} className="min-h-tap rounded-lg border border-line-strong bg-surface px-3">
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
      <TextField label="Note (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
      <Button onClick={() => save.mutate()} loading={save.isPending} className="self-start">
        Save
      </Button>
    </section>
  );
}

/** Find a technician by number and set their verification level. */
export default function TechniciansPage() {
  const [input, setInput] = useState('');
  const [id, setId] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const q = useQuery({ queryKey: ['admin', 'tech', id], queryFn: () => adminApi.technician(http, id as number), enabled: id !== null, retry: false });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const n = Number(input);
    if (!Number.isInteger(n) || n < 1) return setErr('Type the technician number, for example 1.');
    setErr(null);
    setId(n);
  }
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Set level</h1>
        <p className="mt-1 text-fg-2">The backend cannot list all technicians yet, so enter the technician number shown on the document review page.</p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3" noValidate>
        <div className="w-48">
          <TextField label="Technician number" inputMode="numeric" value={input} onChange={(e) => setInput(e.target.value.replace(/\D/g, ''))} error={err ?? undefined} />
        </div>
        <Button type="submit">Find</Button>
      </form>
      {q.isFetching && <p className="text-fg-2" role="status">Looking...</p>}
      {q.isError && <Notice tone="danger">{errorMessage(q.error)}</Notice>}
      {q.isSuccess && id !== null && <Panel key={id} t={q.data} id={id} />}
    </div>
  );
}
