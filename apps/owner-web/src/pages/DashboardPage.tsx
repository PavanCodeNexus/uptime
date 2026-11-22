import { formatDateTime, formatINR, getArrivalCode, jobsApi, StatusBadge, useAuth } from '@uptime/shared';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { http } from '../lib/api';
import { useOwnerStore } from '../store/ownerStore';

export default function DashboardPage() {
  const { isDemo } = useAuth();
  const { activePlant, assets, localJobs, walletBalance, proPassActive } = useOwnerStore();

  const q = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.list(http),
    enabled: !isDemo,
    refetchInterval: 15000,
    retry: false,
  });

  const liveJobs = q.data ?? [];
  const activeLive = liveJobs.find((j) => !['COMPLETED', 'CANCELLED'].includes(j.status.toUpperCase()));
  const activeLocal = localJobs.find((j) => !['COMPLETED', 'CANCELLED'].includes(j.status.toUpperCase()));

  const machineAssets = assets.filter((a) => a.category === 'MACHINE');
  const vehicleAssets = assets.filter((a) => a.category === 'VEHICLE');
  const deviceAssets = assets.filter((a) => a.category === 'DEVICE');

  const avgHealth = (list: typeof assets) =>
    list.length === 0 ? 100 : Math.round((list.reduce((s, a) => s + a.healthScore, 0) / list.length) * 10) / 10;

  const warningAsset = assets.find((a) => a.status === 'WARNING' || a.status === 'IN_REPAIR');

  const activeTitle = activeLive
    ? activeLive.equipmentSummary
    : activeLocal
      ? activeLocal.equipmentSummary
      : 'All systems nominal — no active emergency breakdown';
  const activeJobNumber = activeLive ? activeLive.jobNumber : activeLocal?.jobNumber;
  const activeJobOtp = activeLive ? getArrivalCode(activeLive.id) : activeLocal?.arrivalOtp;
  const activeJobPath = activeLive ? `/jobs/${activeLive.id}` : activeLocal ? `/jobs/${activeLocal.id}` : '/report';

  const recentRows =
    liveJobs.length > 0
      ? liveJobs.slice(0, 4).map((j) => ({
          id: j.id,
          jobNumber: j.jobNumber,
          equipmentSummary: j.equipmentSummary ?? 'Equipment Repair',
          createdAt: j.createdAt,
          status: j.status,
          totalAmount: j.totalAmount,
        }))
      : localJobs.slice(0, 4).map((j) => ({
          id: j.id,
          jobNumber: j.jobNumber,
          equipmentSummary: j.equipmentSummary,
          createdAt: j.createdAt,
          status: j.status,
          totalAmount: j.totalAmount,
        }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-black tracking-tight text-slate-900">Plant Operations Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activePlant.name} • {activePlant.address}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/ai-triage" className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <i className="fa-solid fa-brain text-purple-600" aria-hidden="true"></i>
            <span>AI Fault Triage</span>
          </Link>
          <Link to="/report" className="px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5">
            <i className="fa-solid fa-bolt" aria-hidden="true"></i>
            <span>Report Breakdown</span>
          </Link>
        </div>
      </div>

      {/* Quick Actions Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Link to="/report" className="p-4 rounded-2xl bg-[#EA580C] hover:bg-orange-700 text-white space-y-1 shadow-sm transition-colors">
          <div className="text-[11px] font-mono uppercase text-orange-100 font-bold">
            <i className="fa-solid fa-bolt mr-1" aria-hidden="true"></i>Emergency SOS
          </div>
          <div className="text-sm font-display font-extrabold">Book Technician</div>
          <div className="text-[11px] text-orange-100">15-min arrival SLA</div>
        </Link>

        <Link to="/digital-twin" className="p-4 rounded-2xl bg-slate-900 hover:bg-black text-white space-y-1 shadow-sm transition-colors">
          <div className="text-[11px] font-mono uppercase text-[#00D4AA] font-bold">
            <i className="fa-solid fa-wave-square mr-1" aria-hidden="true"></i>Predictive AI
          </div>
          <div className="text-sm font-display font-extrabold">Digital Twin FFT</div>
          <div className="text-[11px] text-slate-300">Acoustic vibration monitor</div>
        </Link>

        <Link to="/marketplace" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 space-y-1 transition-colors">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
            <i className="fa-solid fa-boxes-stacked mr-1" aria-hidden="true"></i>OEM Spares
          </div>
          <div className="text-sm font-display font-extrabold text-slate-900">Order Spare Parts</div>
          <div className="text-[11px] text-slate-500">60-min depot delivery</div>
        </Link>

        <Link to="/wallet" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 space-y-1 transition-colors">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
            <i className="fa-solid fa-wallet mr-1" aria-hidden="true"></i>Corporate Wallet
          </div>
          <div className="text-sm font-display font-extrabold text-slate-900">{formatINR(walletBalance)}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">{proPassActive ? 'Pro Pass Active' : 'Pay-per-repair'}</div>
        </Link>
      </div>

      {/* Active Dispatch Card */}
      <section className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full shrink-0 ${activeJobNumber ? 'bg-emerald-400 pulse-live' : 'bg-slate-500'}`} aria-hidden="true"></span>
            <div>
              <div className="text-xs font-mono text-[#00D4AA] font-bold">
                {activeJobNumber ? `ACTIVE DISPATCH • ${activeJobNumber}` : 'DISPATCH STANDBY'}
              </div>
              <div className="text-base sm:text-lg font-display font-extrabold text-white">{activeTitle}</div>
            </div>
          </div>
          {activeJobOtp && (
            <div className="px-4 py-2 rounded-2xl bg-black/60 border border-slate-700 font-mono text-xs flex items-center gap-2.5">
              <span className="text-slate-400">ARRIVAL OTP:</span>
              <span className="text-xl font-black text-amber-400 tracking-widest">{activeJobOtp}</span>
            </div>
          )}
        </div>

        {activeJobNumber && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px] font-mono">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✓ AI Triage</div>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✓ Matched</div>
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-200 border border-blue-400/40 font-bold">
              ● En-Route ({activeLocal?.etaMinutes ?? 8}m)
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800 text-slate-500">4. In-Repair</div>
            <div className="p-2.5 rounded-xl bg-slate-800 text-slate-500">5. Handover</div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="text-slate-300">
            {activeJobNumber
              ? `Assigned Specialist: ${activeLocal?.technicianName ?? 'Verified L2 Specialist'} • 500m Geofence Active`
              : 'Need urgent assistance? Dispatch a verified engineer in under 15 minutes.'}
          </div>
          <Link
            to={activeJobPath}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2"
          >
            <i className="fa-solid fa-map-location-dot" aria-hidden="true"></i>
            <span>{activeJobNumber ? 'Track Live Arrival' : 'Report Breakdown'}</span>
          </Link>
        </div>
      </section>

      {/* Asset Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/assets?tab=MACHINE" className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 space-y-1.5 transition-colors">
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>INDUSTRIAL MACHINES</span>
            <span className="text-purple-700 font-bold">{machineAssets.length} UNITS</span>
          </div>
          <div className="text-3xl font-display font-black text-slate-900">{avgHealth(machineAssets)}%</div>
          <div className="text-xs text-slate-600">
            {machineAssets.filter((a) => a.status === 'NOMINAL').length} Nominal • {machineAssets.filter((a) => a.status !== 'NOMINAL').length} Needs Attention
          </div>
        </Link>

        <Link to="/assets?tab=VEHICLE" className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 space-y-1.5 transition-colors">
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>COMMERCIAL FLEETS</span>
            <span className="text-blue-700 font-bold">{vehicleAssets.length} VEHICLES</span>
          </div>
          <div className="text-3xl font-display font-black text-slate-900">{avgHealth(vehicleAssets)}%</div>
          <div className="text-xs text-emerald-700 font-semibold">OBD-II Telemetry Synchronized</div>
        </Link>

        <Link to="/assets?tab=DEVICE" className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 space-y-1.5 transition-colors">
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>POWER &amp; CLEANROOM</span>
            <span className="text-cyan-700 font-bold">{deviceAssets.length} UNITS</span>
          </div>
          <div className="text-3xl font-display font-black text-slate-900">{avgHealth(deviceAssets)}%</div>
          <div className="text-xs text-emerald-700 font-semibold">415V UPS &amp; Power Healthy</div>
        </Link>
      </div>

      {/* Predictive Warning Alert */}
      {warningAsset && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-base shrink-0" aria-hidden="true">
              <i className="fa-solid fa-wave-square"></i>
            </div>
            <div>
              <div className="font-mono text-[10px] font-bold uppercase text-amber-800">Predictive Acoustic Advisory</div>
              <div className="text-sm font-display font-extrabold text-slate-900">
                {warningAsset.name} — {warningAsset.acousticDb ?? 78} dB vibration drift (Est. RUL: {warningAsset.rulHours ?? 24} hrs)
              </div>
            </div>
          </div>
          <Link to="/digital-twin" className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold">
            Inspect Digital Twin →
          </Link>
        </div>
      )}

      {/* Recent Jobs */}
      <section className="rounded-2xl bg-white border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-display font-black text-slate-900">Recent Repair Dispatches</h2>
          <Link to="/jobs" className="text-xs font-bold text-blue-600 hover:underline">
            View All Jobs →
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentRows.map((j) => (
            <Link key={j.id} to={`/jobs/${j.id}`} className="py-3 px-2 rounded-xl hover:bg-slate-50 flex flex-wrap items-center justify-between gap-2 transition-colors">
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
    </div>
  );
}
