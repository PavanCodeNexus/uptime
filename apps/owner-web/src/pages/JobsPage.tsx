import { Button, errorMessage, formatDateTime, formatINR, industryInfo, jobsApi, Notice, StatusBadge, useAuth } from '@uptime/shared';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../lib/api';
import { useOwnerStore } from '../store/ownerStore';

export default function JobsPage() {
  const { isDemo } = useAuth();
  const { localJobs } = useOwnerStore();
  const [filter, setFilter] = useState<'ALL' | 'INDUSTRIAL' | 'AUTOMOTIVE' | 'ELECTRONICS'>('ALL');
  const [search, setSearch] = useState('');

  const q = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.list(http),
    enabled: !isDemo,
    refetchInterval: 15000,
    retry: false,
  });

  const liveRows = (q.data ?? []).map((j) => ({
    id: j.id,
    jobNumber: j.jobNumber,
    industry: j.industry,
    equipmentSummary: j.equipmentSummary ?? 'Equipment Repair',
    createdAt: j.createdAt,
    status: j.status,
    totalAmount: j.totalAmount,
    tech: j.technicianId ? `Specialist #${j.technicianId}` : 'Matching nearby...',
  }));

  const fallbackRows = localJobs.map((j) => ({
    id: j.id,
    jobNumber: j.jobNumber,
    industry: j.industry,
    equipmentSummary: j.equipmentSummary,
    createdAt: j.createdAt,
    status: j.status,
    totalAmount: j.totalAmount,
    tech: j.technicianName,
  }));

  const rows = liveRows.length > 0 ? liveRows : fallbackRows;

  const filtered = rows.filter((r) => {
    const matchSector = filter === 'ALL' || r.industry.toUpperCase() === filter;
    const s = search.trim().toLowerCase();
    const matchText = !s || r.jobNumber.toLowerCase().includes(s) || r.equipmentSummary.toLowerCase().includes(s);
    return matchSector && matchText;
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black tracking-tight text-slate-900">My Jobs &amp; Service Ledger</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track active technicians, download 18% GST ITC invoices, and review handover evidence.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job # or machine..."
            className="min-h-[40px] px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:bg-white focus:border-blue-600"
          />
          <Link to="/report" className="min-h-[40px] px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5">
            <i className="fa-solid fa-plus" aria-hidden="true"></i>
            <span>Report Breakdown</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(['ALL', 'INDUSTRIAL', 'AUTOMOTIVE', 'ELECTRONICS'] as const).map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => setFilter(sec)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filter === sec ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {sec === 'ALL' ? 'All Sectors' : industryInfo(sec)?.label ?? sec}
          </button>
        ))}
      </div>

      {!isDemo && q.isError && rows.length === 0 && (
        <div className="space-y-3">
          <Notice tone="danger">{errorMessage(q.error)}</Notice>
          <Button variant="secondary" onClick={() => void q.refetch()}>
            Retry
          </Button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center space-y-2 shadow-sm">
          <p className="text-base font-display font-extrabold text-slate-900">No jobs match this filter</p>
          <p className="text-xs text-slate-500">Report a breakdown and a verified specialist will be dispatched within 15 minutes.</p>
          <Link to="/report" className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white">
            Report Breakdown →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-4">Job # &amp; Sector</th>
                <th className="p-4">Equipment / Asset</th>
                <th className="p-4">Assigned Specialist</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Total (incl. GST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((j) => (
                <tr key={j.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="p-4">
                    <Link to={`/jobs/${j.id}`} className="font-mono font-extrabold text-blue-700 hover:underline">
                      {j.jobNumber}
                    </Link>
                    <div className="text-[10px] font-mono text-slate-500">{industryInfo(j.industry)?.label ?? j.industry}</div>
                  </td>
                  <td className="p-4 font-bold text-slate-900">{j.equipmentSummary}</td>
                  <td className="p-4 text-slate-600 font-medium">{j.tech}</td>
                  <td className="p-4 font-mono text-[11px] text-slate-500">{formatDateTime(j.createdAt)}</td>
                  <td className="p-4">
                    <StatusBadge status={j.status} />
                  </td>
                  <td className="p-4 text-right font-mono font-extrabold text-slate-900">
                    {j.totalAmount > 0 ? formatINR(j.totalAmount) : 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
