import { adminApi, Button, errorMessage, Notice, TextField, useAuth, type Technician } from '@uptime/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../lib/api';

const LEVELS = [
  { v: 0, t: 'Level 0: Registered (No Dispatch)' },
  { v: 1, t: 'Level 1: Identity Verified' },
  { v: 2, t: 'Level 2: Verified Specialist (Dispatch Eligible)' },
  { v: 3, t: 'Level 3: Master Certified (415V SOS Priority)' },
];
const STATUSES = ['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'];

const DEMO_ROSTER = [
  { id: 401, name: 'Raju Kumar Sharma', tier: 'L2 Senior', track: 'Track A Regulated', nft: '0x88f2...a91c', shift: '6.2h / 12h', fatigue: false, rating: '4.9★' },
  { id: 405, name: 'Ramesh K. Vishwakarma', tier: 'L2-P Provisional', track: 'Track B Ustad (4/5 jobs)', nft: 'Pending Graduation', shift: '4.5h / 12h', fatigue: false, rating: '4.8★' },
  { id: 409, name: 'Suresh Gowda', tier: 'L2 Senior', track: 'Track A Regulated', nft: '0x41c9...d02e', shift: '12.0h MAX', fatigue: true, rating: '4.7★' },
  { id: 412, name: 'Syed Mahmood', tier: 'L3 Master', track: 'CEA 415V Master', nft: '0x9b14...f77a', shift: '3.1h / 12h', fatigue: false, rating: '5.0★' },
];

function Panel({ t, id }: { t: Technician; id: number }) {
  const [level, setLevel] = useState(t.verificationLevel);
  const [status, setStatus] = useState(t.verificationStatus || 'PENDING');
  const [reason, setReason] = useState('');
  const save = useMutation({ mutationFn: () => adminApi.verifyTechnician(http, id, level, status, reason.trim() || undefined) });
  return (
    <section className="console-card rounded-3xl border border-indigo-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-display font-black text-slate-900">
            {t.fullName} <span className="font-mono text-xs text-slate-400">(#{id})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Current Tier: <strong>L{t.verificationLevel}</strong> ({String(t.verificationStatus).toLowerCase()}) • Rating{' '}
            {t.ratingCount > 0 ? Number(t.ratingAvg).toFixed(1) : 'New'} • {t.jobsCompleted} jobs completed
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold">LIVE UPDATE</span>
      </div>
      {save.isError && <Notice tone="danger">{errorMessage(save.error)}</Notice>}
      {save.isSuccess && <Notice tone="success">Technician tier &amp; status updated in PostgreSQL. Dispatch matching reflects this immediately.</Notice>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="lvl" className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
            Verification Tier
          </label>
          <select id="lvl" value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full min-h-tap rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold">
            {LEVELS.map((l) => (
              <option key={l.v} value={l.v}>
                {l.t}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="st" className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
            Account Status
          </label>
          <select id="st" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full min-h-tap rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold">
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <TextField label="Audit Note (optional)" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. CEA 415V permit verified via Digilocker" />
      <Button onClick={() => save.mutate()} loading={save.isPending} className="bg-indigo-600 hover:bg-indigo-700">
        Commit Tier Update
      </Button>
    </section>
  );
}

/** Figma A10: Technician Directory, Polygon NFT, RULE SB-00 Fatigue Monitor & Live Level Verification. */
export default function TechniciansPage() {
  const { isDemo } = useAuth();
  const [input, setInput] = useState('');
  const [id, setId] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const q = useQuery({ queryKey: ['admin', 'tech', id], queryFn: () => adminApi.technician(http, id as number), enabled: !isDemo && id !== null, retry: false });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const n = Number(input);
    if (!Number.isInteger(n) || n < 1) return setErr('Enter a numeric technician ID, for example 1.');
    setErr(null);
    setId(n);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 text-white p-6 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-[10px] font-bold">
            A10 • MASTER ROSTER &amp; RULE SB-00 FATIGUE AUDIT
          </span>
          <h1 className="mt-1 text-2xl font-display font-black">Technician Directory, Polygon NFTs &amp; Tier Control</h1>
          <p className="text-xs text-slate-300">2,840 registered specialists • ISO 45001 12-hour shift fatigue lock enforced at database scoring level.</p>
        </div>
        <Link to="/provisional" className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold">
          L2-P Graduation Desk (A09) →
        </Link>
      </div>

      {/* Live Backend Technician Lookup & Level Control */}
      <section className="console-card rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-display font-black text-slate-900">Live Backend Tier &amp; Status Override</h2>
          <p className="text-xs text-slate-500">Look up any technician by numeric ID to update their L0–L3 verification level or suspension status.</p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3" noValidate>
          <div className="w-52">
            <TextField label="Technician ID" inputMode="numeric" value={input} onChange={(e) => setInput(e.target.value.replace(/\D/g, ''))} error={err ?? undefined} placeholder="e.g. 1" />
          </div>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
            Find Specialist
          </Button>
        </form>
        {q.isFetching && <p className="font-mono text-xs text-slate-500" role="status">Fetching technician profile...</p>}
        {q.isError && <Notice tone="danger">{errorMessage(q.error)}</Notice>}
        {q.isSuccess && id !== null && <Panel key={id} t={q.data} id={id} />}
      </section>

      {/* Master Roster Table (Figma A10) */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 font-mono text-[10px] uppercase">
            <tr>
              <th className="p-4">Specialist</th>
              <th className="p-4">Tier &amp; Track</th>
              <th className="p-4">Polygon Soulbound NFT</th>
              <th className="p-4">Shift / RULE SB-00</th>
              <th className="p-4 text-right">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {DEMO_ROSTER.map((r) => (
              <tr key={r.id} className={r.fatigue ? 'bg-amber-50/50' : 'hover:bg-slate-50'}>
                <td className="p-4">
                  <div className="font-bold text-slate-900">{r.name}</div>
                  <div className="font-mono text-[10px] text-slate-400">ID #{r.id}</div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold">{r.tier}</span>
                  <div className="text-[11px] text-slate-500 mt-0.5">{r.track}</div>
                </td>
                <td className="p-4 font-mono text-[11px] text-purple-700">{r.nft}</td>
                <td className="p-4">
                  {r.fatigue ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] font-extrabold">
                      🔒 8H REST LOCK ({r.shift})
                    </span>
                  ) : (
                    <span className="font-mono text-emerald-700 font-bold">● Active ({r.shift})</span>
                  )}
                </td>
                <td className="p-4 text-right font-mono font-bold text-slate-900">{r.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
