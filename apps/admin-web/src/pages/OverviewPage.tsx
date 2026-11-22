import { adminApi, useAuth } from '@uptime/shared';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  DonutPieChart,
  GroupedBarChart,
  RevenueAreaChart,
  Sparkline,
  type BarGroup,
  type PieSlice,
  type RevenuePoint,
} from '../components/AnalyticsCharts';
import { http } from '../lib/api';
import { useAdminStore, type Timeframe } from '../store/adminStore';

const TIMEFRAMES: Timeframe[] = ['7D', '30D', '90D', '1Y'];

const REVENUE_BY_TIMEFRAME: Record<Timeframe, RevenuePoint[]> = {
  '7D': [
    { label: 'Mon', gmvLakhs: 14.2, dispatches: 128, slaPct: 98.1 },
    { label: 'Tue', gmvLakhs: 16.8, dispatches: 146, slaPct: 98.4 },
    { label: 'Wed', gmvLakhs: 15.9, dispatches: 139, slaPct: 97.9 },
    { label: 'Thu', gmvLakhs: 19.4, dispatches: 168, slaPct: 98.8 },
    { label: 'Fri', gmvLakhs: 21.6, dispatches: 184, slaPct: 99.1 },
    { label: 'Sat', gmvLakhs: 18.2, dispatches: 157, slaPct: 98.6 },
    { label: 'Sun', gmvLakhs: 20.5, dispatches: 172, slaPct: 98.9 },
  ],
  '30D': [
    { label: 'W1', gmvLakhs: 94.0, dispatches: 820, slaPct: 97.8 },
    { label: 'W2', gmvLakhs: 112.5, dispatches: 965, slaPct: 98.2 },
    { label: 'W3', gmvLakhs: 124.8, dispatches: 1084, slaPct: 98.6 },
    { label: 'W4', gmvLakhs: 148.2, dispatches: 1246, slaPct: 99.0 },
  ],
  '90D': [
    { label: 'Sep', gmvLakhs: 342.0, dispatches: 2940, slaPct: 97.4 },
    { label: 'Oct', gmvLakhs: 418.6, dispatches: 3560, slaPct: 98.3 },
    { label: 'Nov', gmvLakhs: 479.5, dispatches: 4115, slaPct: 98.8 },
  ],
  '1Y': [
    { label: 'Q1', gmvLakhs: 780.0, dispatches: 6820, slaPct: 96.9 },
    { label: 'Q2', gmvLakhs: 965.4, dispatches: 8340, slaPct: 97.7 },
    { label: 'Q3', gmvLakhs: 1184.2, dispatches: 10120, slaPct: 98.4 },
    { label: 'Q4', gmvLakhs: 1420.8, dispatches: 12190, slaPct: 98.9 },
  ],
};

const CLUSTER_SCALE: Record<string, number> = {
  ALL: 1,
  Peenya: 0.34,
  Whitefield: 0.24,
  Bommasandra: 0.17,
  Chakan: 0.14,
  Sriperumbudur: 0.11,
};

export default function OverviewPage() {
  const { isDemo } = useAuth();
  const { timeframe, setTimeframe, cluster, dispatches, kycQueue, technicians, payouts, auditLog } = useAdminStore();

  const liveDash = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminApi.dashboard(http),
    enabled: !isDemo,
    retry: false,
  });

  const scale = CLUSTER_SCALE[cluster] ?? 1;
  const chartData = REVENUE_BY_TIMEFRAME[timeframe].map((pt) => ({
    ...pt,
    gmvLakhs: Number((pt.gmvLakhs * scale).toFixed(1)),
    dispatches: Math.max(12, Math.round(pt.dispatches * scale)),
  }));

  const totalGmvLakhs = chartData.reduce((s, d) => s + d.gmvLakhs, 0);
  const totalDispatches = chartData.reduce((s, d) => s + d.dispatches, 0);
  const avgSla = chartData.reduce((s, d) => s + d.slaPct, 0) / chartData.length;

  const filteredDispatches = cluster === 'ALL' ? dispatches : dispatches.filter((d) => d.cluster === cluster);
  const pendingEscrowTotal = payouts
    .filter((p) => p.status === 'PENDING_ESCROW')
    .reduce((sum, p) => sum + p.netPayoutInr, 0);

  // Sector Mix Donut Pie Chart (Black, Olive, Brass)
  const sectorSlices: PieSlice[] = [
    {
      label: 'Industrial CNC & Hydraulics',
      value: Math.round(totalDispatches * 0.54),
      color: '#050506',
      detail: 'Peenya • Chakan • Sriperumbudur',
    },
    {
      label: 'Commercial Fleet & EV',
      value: Math.round(totalDispatches * 0.28),
      color: '#7D885E',
      detail: 'BMS • Cold-Chain • Telematics',
    },
    {
      label: 'Power, UPS & Cleanroom',
      value: Math.round(totalDispatches * 0.18),
      color: '#D9A53A',
      detail: '415V Panels • 250kVA UPS',
    },
  ];

  // SLA Breakdown Pie Chart
  const slaSlices: PieSlice[] = [
    { label: 'Instant (<15m SLA)', value: 84, color: '#7D885E', detail: 'Target met on arrival' },
    { label: 'Standard (15–30m)', value: 11, color: '#D9A53A', detail: 'Traffic / multi-part dispatch' },
    { label: 'Warranty Revisit', value: 3, color: '#050506', detail: 'Zero-fee 30-day cover' },
    { label: 'Escrow Disputed', value: 2, color: '#B7BF9F', detail: 'Under admin arbitration' },
  ];

  // Cluster Performance Bar Graph
  const clusterBars: BarGroup[] = [
    { label: 'Peenya', primary: 312, secondary: 218 },
    { label: 'Whitefield', primary: 246, secondary: 174 },
    { label: 'Bommasandra', primary: 194, secondary: 142 },
    { label: 'Chakan', primary: 168, secondary: 121 },
    { label: 'Sriperumbudur', primary: 138, secondary: 98 },
  ];

  // Verification Tier Funnel
  const tierCounts = [
    { label: 'Level 3 • Master 415V Certified', count: technicians.filter((t) => t.level === 3).length, pct: 34, color: '#050506' },
    { label: 'Level 2 • Verified Field Specialist', count: technicians.filter((t) => t.level === 2).length, pct: 48, color: '#7D885E' },
    { label: 'Level 1 • Identity & Provisional', count: technicians.filter((t) => t.level === 1).length, pct: 18, color: '#D9A53A' },
  ];

  const pendingKycCount = liveDash.data?.pendingKycDocuments ?? kycQueue.length;

  return (
    <div className="space-y-6">
      {/* Executive Header Row */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E8E2] bg-white px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5B6443]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7D885E]" />
            Executive Overview &amp; Analytics
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold text-[#050506] sm:text-3xl">
            Platform Performance Intelligence
          </h1>
          <p className="mt-1 text-xs text-[#64675F] sm:text-sm">
            Live revenue velocity, sector distribution, SLA compliance, and corridor dispatch analytics.
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div
          className="inline-flex items-center rounded-xl border border-[#E8E8E2] bg-white p-1 shadow-xs"
          role="group"
          aria-label="Analytics timeframe"
        >
          {TIMEFRAMES.map((tf) => {
            const active = timeframe === tf;
            return (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`cursor-pointer rounded-lg px-3.5 py-1.5 font-mono text-xs font-semibold transition-all duration-200 ${
                  active ? 'bg-[#050506] text-white shadow-xs' : 'text-[#64675F] hover:text-[#050506]'
                }`}
              >
                {tf}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 4 Sparkline KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key Performance Indicators">
        <div className="admin-card admin-card-interactive animate-stagger-1 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#64675F]">
                Gross Volume ({timeframe})
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-[#050506]">
                ₹{totalGmvLakhs >= 100 ? `${(totalGmvLakhs / 100).toFixed(2)} Cr` : `${totalGmvLakhs.toFixed(1)} L`}
              </p>
            </div>
            <span className="rounded-full bg-[#F3F5EE] px-2.5 py-1 font-mono text-[11px] font-bold text-[#5B6443]">
              +18.4%
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-[11px] text-[#64675F]">Escrow settled • 18% GST</span>
            <Sparkline data={chartData.map((d) => d.gmvLakhs)} color="#7D885E" />
          </div>
        </div>

        <div className="admin-card admin-card-interactive animate-stagger-2 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#64675F]">
                Dispatches ({timeframe})
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-[#050506]">
                {totalDispatches.toLocaleString('en-IN')}
              </p>
            </div>
            <span className="rounded-full bg-[#FBF6EA] px-2.5 py-1 font-mono text-[11px] font-bold text-[#9B711C]">
              +12.1%
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-[11px] text-[#64675F]">{filteredDispatches.length} live in corridor</span>
            <Sparkline data={chartData.map((d) => d.dispatches)} color="#D9A53A" />
          </div>
        </div>

        <div className="admin-card admin-card-interactive animate-stagger-3 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#64675F]">
                15-Min SLA Compliance
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-[#050506]">{avgSla.toFixed(1)}%</p>
            </div>
            <span className="rounded-full bg-[#F3F5EE] px-2.5 py-1 font-mono text-[11px] font-bold text-[#5B6443]">
              Target 98%
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-[11px] text-[#64675F]">Avg arrival 11.4 mins</span>
            <Sparkline data={chartData.map((d) => d.slaPct)} color="#050506" />
          </div>
        </div>

        <div className="admin-card admin-card-interactive animate-stagger-4 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#64675F]">
                Pending Actions
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-[#050506]">{pendingKycCount} KYC</p>
            </div>
            <span className="rounded-full bg-[#FBF6EA] px-2.5 py-1 font-mono text-[11px] font-bold text-[#9B711C]">
              ₹{(pendingEscrowTotal / 1000).toFixed(1)}k Escrow
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            <Link
              to="/kyc"
              className="text-xs font-semibold text-[#5B6443] underline-offset-4 hover:text-[#050506] hover:underline"
            >
              Review KYC →
            </Link>
            <Link
              to="/finance"
              className="text-xs font-semibold text-[#9B711C] underline-offset-4 hover:text-[#050506] hover:underline"
            >
              Release Payouts →
            </Link>
          </div>
        </div>
      </section>

      {/* Primary Charts Row: Area Graph (8 cols) + Sector Donut Pie Chart (4 cols) */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="admin-card p-6 lg:col-span-7 xl:col-span-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-bold text-[#050506]">Revenue &amp; Dispatch Velocity</h2>
              <p className="text-xs text-[#64675F]">
                Smooth trend comparison across {timeframe} window ({cluster === 'ALL' ? 'All India' : cluster})
              </p>
            </div>
            <span className="rounded-full border border-[#E8E8E2] bg-[#FAFAF8] px-3 py-1 font-mono text-[11px] font-semibold text-[#5B6443]">
              Live Telemetry
            </span>
          </div>
          <RevenueAreaChart key={`${timeframe}-${cluster}`} data={chartData} />
        </div>

        <div className="admin-card flex flex-col justify-between p-6 lg:col-span-5 xl:col-span-4">
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold text-[#050506]">Sector Mix Distribution</h2>
            <p className="text-xs text-[#64675F]">Hover or tap any slice to inspect vertical share</p>
          </div>
          <DonutPieChart
            key={`sector-${timeframe}-${cluster}`}
            slices={sectorSlices}
            centerLabel="Total Jobs"
            centerValue={totalDispatches.toLocaleString('en-IN')}
          />
        </div>
      </section>

      {/* Secondary Charts Row: SLA Pie Chart (5 cols) + Cluster Bar Graph (7 cols) */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="admin-card p-6 lg:col-span-5">
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold text-[#050506]">SLA &amp; Resolution Breakdown</h2>
            <p className="text-xs text-[#64675F]">Arrival speed and quality compliance ratio</p>
          </div>
          <DonutPieChart
            slices={slaSlices}
            centerLabel="SLA Health"
            centerValue={`${avgSla.toFixed(1)}%`}
            size={184}
            thickness={26}
          />
        </div>

        <div className="admin-card p-6 lg:col-span-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-bold text-[#050506]">Industrial Cluster Performance</h2>
              <p className="text-xs text-[#64675F]">Weekly dispatches vs active verified specialists per hub</p>
            </div>
            <Link
              to="/dispatches"
              className="rounded-lg border border-[#E8E8E2] px-3 py-1.5 text-xs font-semibold text-[#050506] transition-colors hover:border-[#050506] hover:bg-[#050506] hover:text-white"
            >
              Live Dispatches →
            </Link>
          </div>
          <GroupedBarChart
            data={clusterBars}
            primaryName="Weekly Dispatches"
            secondaryName="Active Specialists"
            primaryColor="#7D885E"
            secondaryColor="#D9A53A"
          />
        </div>
      </section>

      {/* Bottom Row: Technician Verification Funnel + Real-Time Audit Feed */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="admin-card p-6 lg:col-span-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-[#050506]">Specialist Verification Funnel</h2>
              <p className="text-xs text-[#64675F]">Distribution of active technicians across credential tiers</p>
            </div>
            <Link
              to="/technicians"
              className="text-xs font-semibold text-[#5B6443] underline-offset-4 hover:text-[#050506] hover:underline"
            >
              Manage Roster →
            </Link>
          </div>
          <div className="space-y-4">
            {tierCounts.map((tier) => (
              <div key={tier.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#050506]">{tier.label}</span>
                  <span className="font-mono text-[#64675F]">
                    <strong className="text-[#050506]">{tier.count}</strong> roster • {tier.pct}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F3F3EE]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${tier.pct}%`, backgroundColor: tier.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card p-6 lg:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-[#050506]">Recent Operations Activity</h2>
              <p className="text-xs text-[#64675F]">Live immutable admin audit stream</p>
            </div>
            <Link
              to="/settings"
              className="text-xs font-semibold text-[#9B711C] underline-offset-4 hover:text-[#050506] hover:underline"
            >
              Full Log →
            </Link>
          </div>
          <ul className="space-y-3">
            {auditLog.slice(0, 4).map((entry) => (
              <li
                key={entry.id}
                className="flex items-start gap-3 rounded-xl border border-[#F0F0EA] bg-[#FAFAF8] p-3 transition-colors hover:border-[#E8E8E2]"
              >
                <span
                  className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${
                    entry.category === 'FINANCE'
                      ? 'bg-[#D9A53A]'
                      : entry.category === 'KYC'
                        ? 'bg-[#7D885E]'
                        : 'bg-[#050506]'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#050506]">{entry.action}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-[#7B7E76]">
                    {entry.category} • {entry.timestamp}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
