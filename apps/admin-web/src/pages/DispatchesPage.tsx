import { useState } from 'react';
import { useAdminStore, type AdminDispatch } from '../store/adminStore';

const STATUS_FILTERS: Array<{ value: 'ALL' | AdminDispatch['status']; label: string }> = [
  { value: 'ALL', label: 'All Dispatches' },
  { value: 'SLA_RISK', label: 'SLA At Risk' },
  { value: 'EN_ROUTE', label: 'En Route' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

export default function DispatchesPage() {
  const { dispatches, cluster, escalateDispatch, reassignDispatch, resolveDispatch, technicians } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState<'ALL' | AdminDispatch['status']>('ALL');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visible = dispatches.filter((d) => {
    if (cluster !== 'ALL' && d.cluster !== cluster) return false;
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        d.id.toLowerCase().includes(q) ||
        d.plantName.toLowerCase().includes(q) ||
        d.asset.toLowerCase().includes(q) ||
        d.technician.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selected = dispatches.find((d) => d.id === selectedId) ?? null;
  const availableTechs = technicians.filter((t) => !t.fatigueLocked && t.status === 'VERIFIED');

  function badgeStyle(status: AdminDispatch['status']) {
    switch (status) {
      case 'SLA_RISK':
        return 'bg-[#FBF6EA] text-[#9B711C] border border-[#D9A53A]/50';
      case 'EN_ROUTE':
        return 'bg-[#F3F5EE] text-[#5B6443] border border-[#7D885E]/40';
      case 'IN_PROGRESS':
        return 'bg-[#050506] text-white';
      case 'COMPLETED':
        return 'bg-[#F3F3EE] text-[#64675F]';
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E8E2] bg-white px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9B711C]">
            Live Operations Desk
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold text-[#050506] sm:text-3xl">
            Active Dispatches &amp; SLA Control
          </h1>
          <p className="mt-1 text-xs text-[#64675F] sm:text-sm">
            Monitor corridor arrivals, escalate at-risk tickets, reassign specialists, and close resolved jobs.
          </p>
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search job ID, plant, asset, tech..."
          className="w-full rounded-xl border border-[#E8E8E2] bg-white px-4 py-2.5 text-xs text-[#050506] outline-none transition-colors focus:border-[#050506] sm:w-72"
        />
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const active = statusFilter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                active
                  ? 'bg-[#050506] text-white shadow-xs'
                  : 'border border-[#E8E8E2] bg-white text-[#64675F] hover:border-[#050506] hover:text-[#050506]'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Responsive Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E8E8E2] bg-[#FAFAF8] font-mono text-[10px] uppercase tracking-wider text-[#64675F]">
              <tr>
                <th className="px-5 py-3.5">Job / Plant</th>
                <th className="px-5 py-3.5">Asset &amp; Sector</th>
                <th className="px-5 py-3.5">Specialist</th>
                <th className="px-5 py-3.5">ETA / SLA</th>
                <th className="px-5 py-3.5">Escrow</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EA]">
              {visible.map((d) => (
                <tr key={d.id} className="transition-colors hover:bg-[#FAFAF8]">
                  <td className="px-5 py-4">
                    <p className="font-mono font-bold text-[#050506]">{d.id}</p>
                    <p className="mt-0.5 font-medium text-[#050506]">{d.plantName}</p>
                    <p className="text-[11px] text-[#7B7E76]">{d.cluster} • {d.createdAt}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-[#050506]">{d.asset}</p>
                    <p className="mt-0.5 text-[11px] text-[#5B6443]">{d.sector}</p>
                  </td>
                  <td className="px-5 py-4 font-medium text-[#050506]">{d.technician}</td>
                  <td className="px-5 py-4 font-mono">
                    <span className={d.etaMins >= 14 && d.status !== 'COMPLETED' ? 'font-bold text-[#9B711C]' : 'font-semibold text-[#050506]'}>
                      {d.etaMins}m
                    </span>
                    <span className="text-[#8B8E85]"> / {d.slaLimitMins}m</span>
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold text-[#050506]">
                    ₹{d.escrowInr.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block rounded-full px-2.5 py-1 font-mono text-[10px] font-bold ${badgeStyle(d.status)}`}>
                      {d.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      {d.status === 'SLA_RISK' && (
                        <button
                          type="button"
                          onClick={() => escalateDispatch(d.id)}
                          className="cursor-pointer rounded-lg bg-[#D9A53A] px-2.5 py-1.5 text-[11px] font-bold text-[#050506] transition-opacity hover:opacity-90"
                        >
                          Escalate
                        </button>
                      )}
                      {d.status !== 'COMPLETED' && (
                        <>
                          <button
                            type="button"
                            onClick={() => setSelectedId(d.id)}
                            className="cursor-pointer rounded-lg border border-[#E8E8E2] px-2.5 py-1.5 text-[11px] font-semibold text-[#050506] hover:border-[#050506]"
                          >
                            Reassign
                          </button>
                          <button
                            type="button"
                            onClick={() => resolveDispatch(d.id)}
                            className="cursor-pointer rounded-lg bg-[#7D885E] px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#5B6443]"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-xs text-[#64675F]">
                    No dispatches match the current cluster or status filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reassign Specialist Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050506]/40 p-4 backdrop-blur-[2px]">
          <div className="admin-card animate-fade-up w-full max-w-md p-6">
            <div className="flex items-center justify-between border-b border-[#E8E8E2] pb-3">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#7D885E]">
                  Reassign Dispatch
                </p>
                <h2 className="font-display text-lg font-bold text-[#050506]">
                  {selected.id} • {selected.plantName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close modal"
                className="cursor-pointer rounded-lg p-1.5 text-[#64675F] hover:bg-[#F3F3EE]"
              >
                ✕
              </button>
            </div>
            <p className="mt-3 text-xs text-[#64675F]">
              Select an available, non-fatigue-locked verified specialist to dispatch immediately:
            </p>
            <div className="mt-4 space-y-2">
              {availableTechs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    reassignDispatch(selected.id, t.name);
                    setSelectedId(null);
                  }}
                  className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#E8E8E2] bg-[#FAFAF8] px-3.5 py-2.5 text-left transition-all hover:border-[#050506] hover:bg-white"
                >
                  <div>
                    <p className="text-xs font-bold text-[#050506]">{t.name}</p>
                    <p className="text-[11px] text-[#64675F]">
                      L{t.level} • {t.track} ({t.cluster})
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#5B6443]">{t.rating.toFixed(1)}★</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
