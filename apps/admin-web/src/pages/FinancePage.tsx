import { DonutPieChart, GroupedBarChart, type BarGroup, type PieSlice } from '../components/AnalyticsCharts';
import { useAdminStore } from '../store/adminStore';

const MONTHLY_CASHFLOW: BarGroup[] = [
  { label: 'Jun', primary: 284, secondary: 249 },
  { label: 'Jul', primary: 326, secondary: 286 },
  { label: 'Aug', primary: 358, secondary: 315 },
  { label: 'Sep', primary: 394, secondary: 346 },
  { label: 'Oct', primary: 432, secondary: 380 },
  { label: 'Nov', primary: 479, secondary: 421 },
];

export default function FinancePage() {
  const { payouts, releasePayout } = useAdminStore();

  const pendingTotal = payouts.filter((p) => p.status === 'PENDING_ESCROW').reduce((s, p) => s + p.netPayoutInr, 0);
  const releasedTotal = payouts.filter((p) => p.status === 'RELEASED').reduce((s, p) => s + p.netPayoutInr, 0);
  const platformRevenue = payouts.reduce((s, p) => s + p.platformFeeInr, 0);

  const allocationSlices: PieSlice[] = [
    { label: 'Technician Net Payouts', value: releasedTotal + pendingTotal, color: '#7D885E', detail: '88% specialist share' },
    { label: 'Platform Commission', value: platformRevenue, color: '#050506', detail: '12% service & dispatch fee' },
    { label: 'Warranty Reserve Pool', value: 6400, color: '#D9A53A', detail: '30-day revisit protection' },
  ];

  function exportCsv() {
    const headers = ['Payout ID', 'Job ID', 'Technician', 'Cluster', 'Gross INR', 'Fee INR', 'Net INR', 'Status'];
    const rows = payouts.map((p) => [
      p.id,
      p.jobId,
      p.technician,
      p.cluster,
      p.grossInr,
      p.platformFeeInr,
      p.netPayoutInr,
      p.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'uptime-escrow-ledger.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E8E2] bg-white px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9B711C]">
            Treasury &amp; Settlement
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold text-[#050506] sm:text-3xl">
            Escrow Ledger &amp; Payout Analytics
          </h1>
          <p className="mt-1 text-xs text-[#64675F] sm:text-sm">
            Track monthly GMV inflows, technician settlements, 18% GST compliance, and pending escrow releases.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          className="cursor-pointer rounded-xl bg-[#050506] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1E1F1D]"
        >
          Export CSV Ledger
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="admin-card p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#64675F]">Pending Escrow Release</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#9B711C]">₹{pendingTotal.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-[#64675F]">
            {payouts.filter((p) => p.status === 'PENDING_ESCROW').length} settlements awaiting approval
          </p>
        </div>
        <div className="admin-card p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#64675F]">Released to Specialists</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#5B6443]">₹{releasedTotal.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-[#64675F]">Instant IMPS / UPI settlements</p>
        </div>
        <div className="admin-card p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#64675F]">Net Platform Commission</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#050506]">₹{platformRevenue.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-[#64675F]">12% platform fee + GST reconciled</p>
        </div>
      </div>

      {/* Finance Charts Row */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="admin-card p-6 lg:col-span-7">
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold text-[#050506]">Monthly GMV vs Technician Payouts</h2>
            <p className="text-xs text-[#64675F]">6-month cashflow trajectory in ₹ Lakhs</p>
          </div>
          <GroupedBarChart
            data={MONTHLY_CASHFLOW}
            primaryName="Gross Volume (₹L)"
            secondaryName="Tech Payouts (₹L)"
            primaryColor="#050506"
            secondaryColor="#7D885E"
            unitPrefix="₹"
            unitSuffix="L"
          />
        </div>

        <div className="admin-card p-6 lg:col-span-5">
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold text-[#050506]">Escrow Allocation Split</h2>
            <p className="text-xs text-[#64675F]">Distribution across payouts, platform fee, and warranty reserve</p>
          </div>
          <DonutPieChart
            slices={allocationSlices}
            centerLabel="Escrow Pool"
            centerValue={`₹${Math.round((pendingTotal + releasedTotal + platformRevenue) / 1000)}k`}
            size={184}
          />
        </div>
      </div>

      {/* Settlement Table */}
      <div className="admin-card overflow-hidden">
        <div className="border-b border-[#E8E8E2] px-5 py-4">
          <h2 className="font-display text-base font-bold text-[#050506]">Settlement Queue</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E8E8E2] bg-[#FAFAF8] font-mono text-[10px] uppercase tracking-wider text-[#64675F]">
              <tr>
                <th className="px-5 py-3">Payout / Job</th>
                <th className="px-5 py-3">Technician</th>
                <th className="px-5 py-3">Gross</th>
                <th className="px-5 py-3">Fee (12%)</th>
                <th className="px-5 py-3">Net Payout</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EA]">
              {payouts.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-[#FAFAF8]">
                  <td className="px-5 py-4">
                    <p className="font-mono font-bold text-[#050506]">{p.id}</p>
                    <p className="font-mono text-[11px] text-[#7B7E76]">
                      {p.jobId} • {p.createdAt}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#050506]">{p.technician}</p>
                    <p className="text-[11px] text-[#64675F]">{p.cluster}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-[#050506]">₹{p.grossInr.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 font-mono text-[#64675F]">₹{p.platformFeeInr.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 font-mono font-bold text-[#050506]">₹{p.netPayoutInr.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4">
                    {p.status === 'PENDING_ESCROW' ? (
                      <span className="rounded-full bg-[#FBF6EA] px-2.5 py-1 font-mono text-[10px] font-bold text-[#9B711C]">
                        HOLDING
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#F3F5EE] px-2.5 py-1 font-mono text-[10px] font-bold text-[#5B6443]">
                        RELEASED
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {p.status === 'PENDING_ESCROW' ? (
                      <button
                        type="button"
                        onClick={() => releasePayout(p.id)}
                        className="cursor-pointer rounded-lg bg-[#7D885E] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#5B6443]"
                      >
                        Release Payout
                      </button>
                    ) : (
                      <span className="font-mono text-[11px] text-[#8B8E85]">Settled</span>
                    )}
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
