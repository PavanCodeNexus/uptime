import { formatDateTime, formatINR, getArrivalCode, jobsApi, StatusBadge, useAuth } from '@uptime/shared';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { http } from '../lib/api';

/** Figma W06: Owner Web Workstation Operations Cockpit — wired to live jobsApi.list with graceful demo view. */
export default function DashboardPage() {
  const { isDemo } = useAuth();
  const q = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.list(http),
    enabled: !isDemo,
    refetchInterval: 15000,
    retry: false,
  });

  const liveJobs = q.data ?? [];
  const activeLiveJob = liveJobs.find((j) => !['COMPLETED', 'CANCELLED'].includes(j.status.toUpperCase()));
  const liveArrivalOtp = activeLiveJob ? getArrivalCode(activeLiveJob.id) : null;

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px] font-extrabold">
              W06 • OPERATIONS COCKPIT
            </span>
            <span className="font-mono text-[11px] text-emerald-600 font-bold">
              ● {isDemo ? 'Interactive Plant Telemetry' : 'Live Backend Sync'}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-display font-black tracking-tight text-slate-900">Owner Web Workstation Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/jobs" className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800">
            Job History ({liveJobs.length > 0 ? liveJobs.length : 12})
          </Link>
          <Link to="/report" className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5">
            <i className="fa-solid fa-bolt"></i>
            <span>Report Breakdown (SOS)</span>
          </Link>
        </div>
      </div>

      {/* Quick Actions 4-Card Strip (Exact Figma W06) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Link to="/report" className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-left space-y-1 shadow-md transition-all">
          <div className="text-[11px] font-mono uppercase text-rose-200 font-bold">
            <i className="fa-solid fa-bolt mr-1"></i>EMERGENCY SOS
          </div>
          <div className="text-sm font-display font-extrabold">Report Breakdown</div>
          <div className="text-[11px] text-rose-100">15m Arrival SLA</div>
        </Link>

        <Link to="/digital-twin" className="p-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-left space-y-1 shadow-md transition-all">
          <div className="text-[11px] font-mono uppercase text-purple-200 font-bold">
            <i className="fa-solid fa-brain mr-1"></i>AI DIAGNOSTICS
          </div>
          <div className="text-sm font-display font-extrabold">Digital Twin Console</div>
          <div className="text-[11px] text-purple-100">Acoustic Vibration FFT</div>
        </Link>

        <Link to="/marketplace" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 text-left space-y-1 shadow-xs transition-all">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
            <i className="fa-solid fa-boxes-stacked mr-1"></i>SPARE PARTS
          </div>
          <div className="text-sm font-display font-extrabold text-slate-900">Procure OEM Spares</div>
          <div className="text-[11px] text-slate-500">60m Depot Delivery</div>
        </Link>

        <Link to="/insurance/amc" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 text-left space-y-1 shadow-xs transition-all">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
            <i className="fa-solid fa-calendar-check mr-1"></i>MAINTENANCE
          </div>
          <div className="text-sm font-display font-extrabold text-slate-900">Annual AMC Desk</div>
          <div className="text-[11px] text-emerald-600 font-bold">Quarterly Audit Active</div>
        </Link>
      </div>

      {/* Active Breakdown Job Command Card (Live backend job if present, else Figma #JOB-9821 showcase) */}
      <section className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 pulse-live shrink-0"></span>
            <div>
              <div className="text-xs font-mono text-emerald-400 font-bold">
                {activeLiveJob ? `ACTIVE BREAKDOWN JOB ${activeLiveJob.jobNumber}` : 'ACTIVE BREAKDOWN JOB #JOB-9821'}
              </div>
              <div className="text-base sm:text-lg font-display font-extrabold text-white">
                {activeLiveJob ? activeLiveJob.equipmentSummary : 'Siemens Sinumerik 828D — Spindle Vibration & 415V Warning'}
              </div>
            </div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-black/60 border border-slate-700 font-mono text-xs flex items-center gap-2.5">
            <span className="text-slate-400">ARRIVAL OTP:</span>
            <span className="text-xl font-black text-amber-400 tracking-widest">{liveArrivalOtp ?? '8841'}</span>
          </div>
        </div>

        {/* 5-Stage Progress Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px] font-mono">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✓ Triage Done</div>
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✓ Dispatched</div>
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">● En-Route (8m)</div>
          <div className="p-2.5 rounded-xl bg-slate-800 text-slate-500">4. In-Repair</div>
          <div className="p-2.5 rounded-xl bg-slate-800 text-slate-500">5. Handover</div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="text-slate-300">
            Assigned Specialist: <span className="font-bold text-white">Ramesh K. (L2-P Ustad • 4.84★)</span> • 1.1 km away • 500m Geofence Active
          </div>
          <Link
            to={activeLiveJob ? `/jobs/${activeLiveJob.id}` : '/tracking'}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md"
          >
            <i className="fa-solid fa-map-location-dot"></i>
            <span>Track Live GPS Radar</span>
          </Link>
        </div>
      </section>

      {/* Plant Health 3-Card Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/machines" className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-purple-400 shadow-sm space-y-1.5 transition-all">
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>MACHINERY HEALTH</span>
            <span className="text-purple-600 font-bold">28 ASSETS</span>
          </div>
          <div className="text-3xl font-display font-black text-slate-900">94.2%</div>
          <div className="text-xs text-emerald-600 font-semibold">27 Nominal • 1 In-Repair</div>
        </Link>

        <Link to="/vehicles" className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 shadow-sm space-y-1.5 transition-all">
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>FLEET LOGISTICS</span>
            <span className="text-blue-600 font-bold">54 TRUCKS</span>
          </div>
          <div className="text-3xl font-display font-black text-slate-900">96.8%</div>
          <div className="text-xs text-emerald-600 font-semibold">53 Nominal • 1 Scheduled PM</div>
        </Link>

        <Link to="/devices" className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-cyan-400 shadow-sm space-y-1.5 transition-all">
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>CLEANROOM UPS</span>
            <span className="text-cyan-600 font-bold">14 UNITS</span>
          </div>
          <div className="text-3xl font-display font-black text-slate-900">99.1%</div>
          <div className="text-xs text-emerald-600 font-semibold">All 14 Units Synchronized</div>
        </Link>
      </div>

      {/* Predictive Acoustic Anomaly Banner */}
      <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-sm shrink-0">
            <i className="fa-solid fa-wave-square"></i>
          </div>
          <div>
            <div className="font-mono text-[10px] font-bold uppercase text-amber-800">AI PREDICTIVE ACOUSTIC WARNING • DIGITAL TWIN</div>
            <div className="text-sm font-display font-extrabold text-slate-900">
              Haas VF-2 Spindle Bearing Drift Detected (84.2 dB spike • Est. RUL: 18 hours)
            </div>
          </div>
        </div>
        <Link to="/digital-twin" className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-sm">
          Inspect FFT Spectrogram →
        </Link>
      </div>

      {/* Live Backend Jobs Preview (when live jobs exist) */}
      {liveJobs.length > 0 && (
        <section className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-display font-black text-slate-900">Recent Backend Dispatches</h2>
            <Link to="/jobs" className="text-xs font-bold text-blue-600 hover:underline">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {liveJobs.slice(0, 4).map((j) => (
              <Link key={j.id} to={`/jobs/${j.id}`} className="py-3 flex flex-wrap items-center justify-between gap-2 hover:bg-slate-50 px-2 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {j.jobNumber} • {j.equipmentSummary}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">{formatDateTime(j.createdAt)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={j.status} />
                  <span className="font-mono text-xs font-bold text-slate-800">{j.totalAmount > 0 ? formatINR(j.totalAmount) : 'Pending'}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
