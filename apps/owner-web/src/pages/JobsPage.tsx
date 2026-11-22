import { Button, errorMessage, formatDateTime, formatINR, industryInfo, Notice, StatusBadge, jobsApi, useAuth } from '@uptime/shared';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../lib/api';

const DEMO_LEDGER = [
  { id: 9821, jobNumber: 'JOB-9821', industry: 'INDUSTRIAL', equipmentSummary: 'Siemens Sinumerik 828D Spindle Bearing', createdAt: '2026-11-22T09:15:00Z', status: 'EN_ROUTE', totalAmount: 10850, tech: 'Ramesh K. (L2-P)' },
  { id: 9794, jobNumber: 'JOB-9794', industry: 'AUTOMOTIVE', equipmentSummary: 'Tata Prima BS-VI DEF Injector Calibration', createdAt: '2026-11-20T14:40:00Z', status: 'COMPLETED', totalAmount: 6490, tech: 'Syed M. (L3 Master)' },
  { id: 9752, jobNumber: 'JOB-9752', industry: 'ELECTRONICS', equipmentSummary: 'APC 40kVA Cleanroom UPS Capacitor Bank', createdAt: '2026-11-18T11:20:00Z', status: 'COMPLETED', totalAmount: 14200, tech: 'Anil Hegde (L2)' },
];

/** Figma W11: Enterprise Job History & Past Orders Ledger — wired to live jobsApi.list with demo fallback. */
export default function JobsPage() {
  const { isDemo } = useAuth();
  const [filter, setFilter] = useState<'ALL' | 'INDUSTRIAL' | 'AUTOMOTIVE' | 'ELECTRONICS'>('ALL');
  const [search, setSearch] = useState('');

  const q = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.list(http),
    enabled: !isDemo,
    refetchInterval: 15000,
  });

  const rows = isDemo
    ? DEMO_LEDGER
    : (q.data ?? []).map((j) => ({
        id: j.id,
        jobNumber: j.jobNumber,
        industry: j.industry,
        equipmentSummary: j.equipmentSummary,
        createdAt: j.createdAt,
        status: j.status,
        totalAmount: j.totalAmount,
        tech: j.technicianId ? `Specialist #${j.technicianId}` : 'Matching...',
      }));

  const filtered = rows.filter((r) => {
    const matchSector = filter === 'ALL' || r.industry.toUpperCase() === filter;
    const s = search.trim().toLowerCase();
    const matchText = !s || r.jobNumber.toLowerCase().includes(s) || (r.equipmentSummary ?? '').toLowerCase().includes(s);
    return matchSector && matchText;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px] font-extrabold">
              W11 • ENTERPRISE JOB LEDGER
            </span>
            <span className="font-mono text-xs text-slate-400">{filtered.length} dispatches</span>
          </div>
          <h1 className="mt-1 text-2xl font-display font-black tracking-tight text-slate-900">Job History &amp; Past Orders</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job # or asset..."
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:bg-white focus:border-blue-600"
          />
          <Link to="/report" className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5">
            <i className="fa-solid fa-plus"></i>
            <span>Report Breakdown</span>
          </Link>
        </div>
      </div>

      {/* Sector Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {(['ALL', 'INDUSTRIAL', 'AUTOMOTIVE', 'ELECTRONICS'] as const).map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => setFilter(sec)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === sec ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {sec === 'ALL' ? 'All Sectors' : industryInfo(sec)?.label ?? sec}
          </button>
        ))}
      </div>

      {!isDemo && q.isPending && (
        <p className="text-sm text-slate-500 font-mono" role="status">
          Loading enterprise job ledger...
        </p>
      )}
      {!isDemo && q.isError && (
        <div className="space-y-3">
          <Notice tone="danger">{errorMessage(q.error)}</Notice>
          <Button variant="secondary" onClick={() => void q.refetch()}>
            Try again
          </Button>
        </div>
      )}

      {filtered.length === 0 && (isDemo || q.isSuccess) && (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center space-y-2 shadow-sm">
          <p className="text-base font-display font-extrabold text-slate-900">No dispatches match this filter</p>
          <p className="text-xs text-slate-500">Report a machine or fleet breakdown and a verified specialist will be dispatched within 15 minutes.</p>
          <Link to="/report" className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white">
            Report a Fault →
          </Link>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-4">Job # &amp; Sector</th>
                <th className="p-4">Equipment / Asset</th>
                <th className="p-4">Specialist</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Escrow Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((j) => (
                <tr key={j.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="p-4">
                    <Link to={isDemo ? '/job-details' : `/jobs/${j.id}`} className="font-mono font-extrabold text-blue-700 hover:underline">
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
