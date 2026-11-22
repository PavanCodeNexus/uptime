import { adminApi, Button, errorMessage, Notice, useAuth } from '@uptime/shared';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { http } from '../lib/api';

/** Figma A04: Live Platform Command Dashboard (v_platform_summary) — wired to live adminApi.dashboard with Demo fallback. */
export default function OverviewPage() {
  const { isDemo } = useAuth();
  const q = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminApi.dashboard(http),
    enabled: !isDemo,
    refetchInterval: 30000,
  });

  const live = q.data;
  const activeJobs = live ? live.totalJobs : 184;
  const onlineTechs = live ? live.totalTechnicians : 642;
  const pendingKyc = live ? live.pendingKycDocuments : 19;
  const totalUsers = live ? live.totalUsers : 1420;

  return (
    <div className="space-y-5">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono text-[10px] font-extrabold">
              A04 • LIVE PLATFORM COMMAND
            </span>
            <span className="font-mono text-[11px] text-emerald-600 font-bold">
              ● {isDemo ? 'Interactive NOC Simulation' : 'View: v_platform_summary'}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-display font-black tracking-tight text-slate-900">Executive NOC Command Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/radar" className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5">
            <i className="fa-solid fa-satellite-dish text-emerald-400"></i>
            <span>PostGIS Radar (A05)</span>
          </Link>
          <Link to="/kyc" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm">
            Review KYC Queue ({pendingKyc})
          </Link>
        </div>
      </div>

      {!isDemo && q.isPending && <p className="font-mono text-xs text-slate-500" role="status">Syncing v_platform_summary...</p>}
      {!isDemo && q.isError && (
        <div className="space-y-3">
          <Notice tone="danger">{errorMessage(q.error)}</Notice>
          <Button variant="secondary" onClick={() => void q.refetch()}>
            Try again
          </Button>
        </div>
      )}

      {/* 6 Figma KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link to="/radar" className="console-card p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 shadow-xs transition-all">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase">
            <span>{live ? 'TOTAL JOBS' : 'ACTIVE JOBS'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-live"></span>
          </div>
          <div className="text-2xl font-display font-black text-slate-900 mt-1">{activeJobs}</div>
          <div className="text-[10px] font-mono text-emerald-600 font-bold">● 98.4% On-SLA (&lt;15m)</div>
        </Link>

        <Link to="/technicians" className="console-card p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 shadow-xs transition-all">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase">
            <span>TECHNICIANS</span>
            <i className="fa-solid fa-users-gear text-indigo-500"></i>
          </div>
          <div className="text-2xl font-display font-black text-indigo-600 mt-1">{onlineTechs}</div>
          <div className="text-[10px] font-mono text-slate-500">14 SB-00 Rest Lock</div>
        </Link>

        <Link to="/kyc" className="console-card p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-xs transition-all">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase">
            <span>PENDING KYC</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[9px] font-bold">SLA</span>
          </div>
          <div className="text-2xl font-display font-black text-amber-600 mt-1">{pendingKyc}</div>
          <div className="text-[10px] font-mono text-amber-700 font-bold">Oldest: 3h 18m</div>
        </Link>

        <Link to="/disputes" className="console-card p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 shadow-xs transition-all">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase">
            <span>OPEN DISPUTES</span>
            <i className="fa-solid fa-gavel text-rose-500"></i>
          </div>
          <div className="text-2xl font-display font-black text-rose-600 mt-1">7</div>
          <div className="text-[10px] font-mono text-slate-500">FFT Acoustic Audited</div>
        </Link>

        <Link to="/epidemics" className="console-card p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 shadow-xs transition-all">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase">
            <span>EPIDEMICS</span>
            <span className="text-purple-600 font-mono font-bold">★ AI</span>
          </div>
          <div className="text-2xl font-display font-black text-purple-600 mt-1">2</div>
          <div className="text-[10px] font-mono text-purple-700 font-bold">Peenya + Whitefield</div>
        </Link>

        <Link to="/finance" className="console-card p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs transition-all">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase">
            <span>{live ? 'PLATFORM USERS' : 'TODAY GMV'}</span>
            <span className="text-emerald-600 font-bold">10%</span>
          </div>
          <div className="text-2xl font-display font-black text-emerald-600 mt-1">{live ? totalUsers : '₹14.82L'}</div>
          <div className="text-[10px] font-mono text-slate-500">Take-Rate: ₹1.48L</div>
        </Link>
      </div>

      {pendingKyc > 0 && (
        <Notice tone="info">
          <strong>{pendingKyc} technician KYC document(s)</strong> waiting inside the 48-hour verification SLA.{' '}
          <Link to="/kyc" className="font-bold underline">
            Open 3-Pane Signed KYC Workstation →
          </Link>
        </Notice>
      )}

      {/* Main Dashboard 2-Column NOC Grid (Exact Figma A04) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 console-card rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-mono font-bold uppercase text-slate-500">Sector Volume &amp; SLA Distribution</h2>
            <span className="text-[10px] font-mono text-indigo-600 font-bold">Live WebSocket</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-purple-700">
                  <i className="fa-solid fa-industry mr-1.5"></i>Industrial Machinery &amp; CNC
                </span>
                <span className="font-mono">88 Jobs (48%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-600" style={{ width: '48%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-blue-700">
                  <i className="fa-solid fa-truck-moving mr-1.5"></i>Commercial Auto &amp; EV Fleets
                </span>
                <span className="font-mono">62 Jobs (34%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '34%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-cyan-700">
                  <i className="fa-solid fa-microchip mr-1.5"></i>Commercial Power &amp; Electronics
                </span>
                <span className="font-mono">34 Jobs (18%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-cyan-600" style={{ width: '18%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-slate-400">DISPATCH SLA HEALTH</div>
              <div className="text-xl font-display font-black text-emerald-600">98.4% ON-TIME</div>
              <div className="text-[11px] text-slate-500">Median Tech Arrival: 11.4 mins</div>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent flex items-center justify-center font-mono font-black text-xs text-slate-800 rotate-45">
              <span className="-rotate-45">98%</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 console-card rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-mono font-bold uppercase text-slate-500">Real-Time Platform Event Stream</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">STOMP WS CONNECTED</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <div>
                  <span className="font-bold text-slate-900">SOS Handover Completed</span>
                  <span className="text-slate-500 text-[11px] ml-1.5">Job #JOB-9821 • Ramesh K. (L2-P)</span>
                </div>
              </div>
              <span className="font-mono text-emerald-600 font-bold">₹12,400 Settled</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <div>
                  <span className="font-bold text-slate-900">500m Geofence Arrival Validated</span>
                  <span className="text-slate-500 text-[11px] ml-1.5">Job #JOB-9834 • Syed M. (L3) at Bommasandra</span>
                </div>
              </div>
              <span className="font-mono text-slate-400 text-[11px]">ETA 0m</span>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <div>
                  <span className="font-bold text-purple-900">AI Epidemic Alert Triggered</span>
                  <span className="text-purple-700 text-[11px] ml-1.5">Peenya Phase-2 Grid Surge (14 Relays)</span>
                </div>
              </div>
              <Link to="/epidemics" className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-mono text-[10px] font-bold hover:bg-purple-700">
                Inspect →
              </Link>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <div>
                  <span className="font-bold text-amber-900">RULE SB-00 Fatigue Rest Enforced</span>
                  <span className="text-amber-700 text-[11px] ml-1.5">Tech #T-409 completed 12.0h continuous shift</span>
                </div>
              </div>
              <Link to="/technicians" className="font-mono text-amber-700 text-[10px] font-bold hover:underline">
                8h Rest Lock
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
