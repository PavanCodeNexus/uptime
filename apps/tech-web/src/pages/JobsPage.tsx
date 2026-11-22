import { Button, errorMessage, formatDateTime, formatINR, industryInfo, jobsApi, Notice, StatusBadge, TextField, useAuth, workApi, type Job } from '@uptime/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { http } from '../lib/api';

const DEMO_TECH_JOBS = [
  { id: 9821, jobNumber: 'JOB-9821', client: 'Apex Precision Tools (Bay 2)', equipmentSummary: 'Siemens Sinumerik 828D Spindle Bearing', createdAt: '2026-11-22T11:30:00Z', status: 'IN_PROGRESS', payout: 1400 },
  { id: 9810, jobNumber: 'JOB-9810', client: 'Bharat Forge • Unit 3', equipmentSummary: 'Hydraulic Pressure Relief Valve Calibration', createdAt: '2026-11-22T09:15:00Z', status: 'COMPLETED', payout: 1850 },
  { id: 9788, jobNumber: 'JOB-9788', client: 'Kirloskar Motors • Bay 1', equipmentSummary: '415V 3-Phase Servo Drive Fault F30002', createdAt: '2026-11-21T16:10:00Z', status: 'COMPLETED', payout: 2400 },
];

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
    if (!Number.isInteger(n) || n < 1) return setErr('Enter a numeric job ID, for example 1.');
    setErr(null);
    setJob(null);
    accept.reset();
    find.mutate(n);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4" aria-labelledby="acc-h">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="acc-h" className="text-base font-display font-black text-slate-900">
            Accept Emergency Dispatch by Job ID
          </h2>
          <p className="text-xs text-slate-500">Enter the numeric job ID provided by the factory owner or live flash dispatch alert.</p>
        </div>
        <Link to="/dispatch" className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm">
          Open 60s Flash Offer (TW07) →
        </Link>
      </div>
      <form onSubmit={onFind} className="flex flex-wrap items-end gap-3" noValidate>
        <div className="w-48">
          <TextField label="Job ID" inputMode="numeric" value={input} onChange={(e) => setInput(e.target.value.replace(/\D/g, ''))} error={err} placeholder="e.g. 1" />
        </div>
        <Button type="submit" variant="secondary" loading={find.isPending}>
          Locate Job
        </Button>
      </form>
      {find.isError && <Notice tone="danger">{errorMessage(find.error)}</Notice>}
      {job && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50/40 p-4 text-xs space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono font-extrabold text-slate-900">{job.jobNumber}</span>
            <StatusBadge status={job.status} />
          </div>
          <p className="font-bold text-slate-900">
            {industryInfo(job.industry)?.label ?? job.industry} • {job.equipmentSummary}
          </p>
          <p className="text-slate-600">{job.problemDescription}</p>
          <p className="text-slate-500">{[job.ownerAddress, job.ownerCity].filter(Boolean).join(', ')}</p>
          {accept.isError && <Notice tone="danger">{errorMessage(accept.error)}</Notice>}
          <Button className="mt-2 bg-orange-500 hover:bg-orange-600" onClick={() => accept.mutate(job.id)} loading={accept.isPending}>
            Accept This Dispatch
          </Button>
        </div>
      )}
    </section>
  );
}

/** Figma TW08: Completed Jobs Ledger & Dispatch Desk — live jobsApi.list + accept wired with Demo fallback. */
export default function JobsPage() {
  const { isDemo } = useAuth();
  const [search, setSearch] = useState('');
  const q = useQuery({ queryKey: ['tech', 'jobs'], queryFn: () => jobsApi.list(http), enabled: !isDemo, refetchInterval: 15000 });

  const rows = isDemo
    ? DEMO_TECH_JOBS
    : (q.data ?? []).map((j) => ({
        id: j.id,
        jobNumber: j.jobNumber,
        client: [j.ownerAddress, j.ownerCity].filter(Boolean).join(', ') || 'Verified Plant',
        equipmentSummary: j.equipmentSummary,
        createdAt: j.createdAt,
        status: j.status,
        payout: j.totalAmount,
      }));

  const filtered = rows.filter((r) => {
    const s = search.trim().toLowerCase();
    return !s || r.jobNumber.toLowerCase().includes(s) || (r.equipmentSummary ?? '').toLowerCase().includes(s) || r.client.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="px-2.5 py-0.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 font-mono text-[10px] font-extrabold">
            TW08 • SPECIALIST JOBS LEDGER
          </span>
          <h1 className="mt-1 text-2xl font-display font-black tracking-tight text-slate-900">My Jobs &amp; Dispatch Ledger</h1>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search job #, plant, or asset..."
          className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:bg-white focus:border-orange-500"
        />
      </div>

      {!isDemo && <AcceptByNumber />}

      {!isDemo && q.isPending && <p className="font-mono text-xs text-slate-500" role="status">Loading dispatches...</p>}
      {!isDemo && q.isError && <Notice tone="danger">{errorMessage(q.error)}</Notice>}

      {filtered.length === 0 && (isDemo || q.isSuccess) && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
          No jobs in your ledger yet. Go online or accept a job by ID above.
        </div>
      )}

      {filtered.length > 0 && (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-4">Job #</th>
                <th className="p-4">Plant / Client</th>
                <th className="p-4">Equipment &amp; Fault</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((j) => (
                <tr key={j.id} className="hover:bg-orange-50/40 transition-colors">
                  <td className="p-4">
                    <Link to={isDemo ? '/active-job' : `/jobs/${j.id}`} className="font-mono font-extrabold text-orange-600 hover:underline">
                      {j.jobNumber}
                    </Link>
                  </td>
                  <td className="p-4 font-bold text-slate-800">{j.client}</td>
                  <td className="p-4 text-slate-600">{j.equipmentSummary}</td>
                  <td className="p-4 font-mono text-[11px] text-slate-500">{formatDateTime(j.createdAt)}</td>
                  <td className="p-4">
                    <StatusBadge status={j.status} />
                  </td>
                  <td className="p-4 text-right font-mono font-extrabold text-emerald-700">{j.payout > 0 ? formatINR(j.payout) : 'TBD'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
