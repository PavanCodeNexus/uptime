import { adminApi, errorMessage, useAuth, type Technician } from '@uptime/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { http } from '../lib/api';
import { useAdminStore, type AdminTechRecord } from '../store/adminStore';

const LEVELS: Array<{ v: 0 | 1 | 2 | 3; label: string }> = [
  { v: 0, label: 'L0 • Registered' },
  { v: 1, label: 'L1 • Identity Verified' },
  { v: 2, label: 'L2 • Field Specialist' },
  { v: 3, label: 'L3 • 415V Master' },
];

function LiveLookupPanel({ t, id }: { t: Technician; id: number }) {
  const [level, setLevel] = useState(t.verificationLevel);
  const [status, setStatus] = useState(t.verificationStatus || 'PENDING');
  const [reason, setReason] = useState('');
  const save = useMutation({
    mutationFn: () => adminApi.verifyTechnician(http, id, level, status, reason.trim() || undefined),
  });

  return (
    <div className="mt-4 rounded-2xl border border-[#7D885E]/40 bg-[#FAFAF8] p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-bold text-[#050506]">
            {t.fullName} <span className="font-mono text-xs text-[#64675F]">(#{id})</span>
          </h3>
          <p className="text-xs text-[#64675F]">
            Tier L{t.verificationLevel} • {String(t.verificationStatus)} • {t.jobsCompleted} jobs completed
          </p>
        </div>
        <span className="rounded-full bg-[#F3F5EE] px-2.5 py-1 font-mono text-[10px] font-bold text-[#5B6443]">
          LIVE DATABASE
        </span>
      </div>

      {save.isError && <p className="text-xs font-medium text-red-600">{errorMessage(save.error)}</p>}
      {save.isSuccess && <p className="text-xs font-semibold text-[#5B6443]">Technician tier updated successfully.</p>}

      <div className="grid gap-3 sm:grid-cols-3">
        <select
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          className="rounded-xl border border-[#E8E8E2] bg-white px-3 py-2 text-xs font-semibold text-[#050506]"
        >
          {LEVELS.map((l) => (
            <option key={l.v} value={l.v}>
              {l.label}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-[#E8E8E2] bg-white px-3 py-2 text-xs font-semibold text-[#050506]"
        >
          {['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Audit note (optional)"
          className="rounded-xl border border-[#E8E8E2] bg-white px-3 py-2 text-xs text-[#050506]"
        />
      </div>
      <button
        type="button"
        disabled={save.isPending}
        onClick={() => save.mutate()}
        className="cursor-pointer rounded-xl bg-[#050506] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E1F1D]"
      >
        {save.isPending ? 'Saving...' : 'Commit Tier Update'}
      </button>
    </div>
  );
}

export default function TechniciansPage() {
  const { isDemo } = useAuth();
  const { technicians, cluster, updateTechnicianTier, toggleFatigueLock, setTechnicianStatus } = useAdminStore();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'ALL' | 1 | 2 | 3>('ALL');
  const [lookupInput, setLookupInput] = useState('');
  const [lookupId, setLookupId] = useState<number | null>(null);

  const liveQuery = useQuery({
    queryKey: ['admin', 'tech', lookupId],
    queryFn: () => adminApi.technician(http, lookupId as number),
    enabled: !isDemo && lookupId !== null,
    retry: false,
  });

  function handleLookup(e: FormEvent) {
    e.preventDefault();
    const n = Number(lookupInput);
    if (Number.isInteger(n) && n > 0) setLookupId(n);
  }

  const visible = technicians.filter((t) => {
    if (cluster !== 'ALL' && t.cluster !== cluster) return false;
    if (tierFilter !== 'ALL' && t.level !== tierFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.track.toLowerCase().includes(q) || String(t.id).includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E8E2] bg-white px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5B6443]">
            Workforce &amp; Fatigue Governance
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold text-[#050506] sm:text-3xl">
            Technician Roster &amp; Tier Control
          </h1>
          <p className="mt-1 text-xs text-[#64675F] sm:text-sm">
            Manage verification levels, ISO 45001 12-hour shift fatigue locks, and Soulbound credential status.
          </p>
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, skill track, or ID..."
          className="w-full rounded-xl border border-[#E8E8E2] bg-white px-4 py-2.5 text-xs text-[#050506] outline-none focus:border-[#050506] sm:w-72"
        />
      </div>

      {/* Tier Filter Pills + Optional Live DB Lookup */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(['ALL', 3, 2, 1] as const).map((tier) => (
            <button
              key={String(tier)}
              type="button"
              onClick={() => setTierFilter(tier)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                tierFilter === tier
                  ? 'bg-[#050506] text-white'
                  : 'border border-[#E8E8E2] bg-white text-[#64675F] hover:border-[#050506] hover:text-[#050506]'
              }`}
            >
              {tier === 'ALL' ? 'All Tiers' : `Level ${tier}`}
            </button>
          ))}
        </div>

        {!isDemo && (
          <form onSubmit={handleLookup} className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={lookupInput}
              onChange={(e) => setLookupInput(e.target.value.replace(/\D/g, ''))}
              placeholder="DB Tech ID (e.g. 1)"
              className="w-40 rounded-xl border border-[#E8E8E2] bg-white px-3 py-1.5 text-xs text-[#050506] outline-none focus:border-[#050506]"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-[#050506] px-3.5 py-1.5 text-xs font-semibold text-white"
            >
              Lookup
            </button>
          </form>
        )}
      </div>

      {liveQuery.isSuccess && lookupId !== null && <LiveLookupPanel key={lookupId} t={liveQuery.data} id={lookupId} />}

      {/* Roster Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E8E8E2] bg-[#FAFAF8] font-mono text-[10px] uppercase tracking-wider text-[#64675F]">
              <tr>
                <th className="px-5 py-3.5">Specialist</th>
                <th className="px-5 py-3.5">Tier &amp; Track</th>
                <th className="px-5 py-3.5">Credential Hash</th>
                <th className="px-5 py-3.5">Shift / Fatigue</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5 text-right">Governance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EA]">
              {visible.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-[#FAFAF8]">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#050506]">{t.name}</p>
                    <p className="font-mono text-[11px] text-[#7B7E76]">
                      #{t.id} • {t.cluster} • {t.jobsCompleted} jobs
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      aria-label={`Verification tier for ${t.name}`}
                      value={t.level}
                      onChange={(e) => updateTechnicianTier(t.id, Number(e.target.value) as AdminTechRecord['level'])}
                      className="cursor-pointer rounded-lg border border-[#E8E8E2] bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-[#050506] outline-none focus:border-[#7D885E]"
                    >
                      {LEVELS.map((l) => (
                        <option key={l.v} value={l.v}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[11px] text-[#64675F]">{t.track}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-[#5B6443]">{t.nftHash}</td>
                  <td className="px-5 py-4">
                    {t.fatigueLocked ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF6EA] px-2.5 py-1 font-mono text-[10px] font-bold text-[#9B711C]">
                        8h Rest Lock ({t.shiftHours.toFixed(1)}h)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#5B6443]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#7D885E]" />
                        Active ({t.shiftHours.toFixed(1)}h / 12h)
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-[#050506]">{t.rating.toFixed(1)}★</td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleFatigueLock(t.id)}
                        className="cursor-pointer rounded-lg border border-[#E8E8E2] px-2.5 py-1.5 text-[11px] font-semibold text-[#050506] hover:border-[#050506]"
                      >
                        {t.fatigueLocked ? 'Unlock Rest' : 'Lock Shift'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setTechnicianStatus(t.id, t.status === 'SUSPENDED' ? 'VERIFIED' : 'SUSPENDED')}
                        className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                          t.status === 'SUSPENDED'
                            ? 'bg-[#7D885E] text-white'
                            : 'border border-[#E8E8E2] text-[#64675F] hover:border-[#050506] hover:text-[#050506]'
                        }`}
                      >
                        {t.status === 'SUSPENDED' ? 'Reinstate' : 'Suspend'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
