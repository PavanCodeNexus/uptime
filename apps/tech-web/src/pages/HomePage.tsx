import { Link, useNavigate } from 'react-router-dom';
import { useTechStore } from '../store/techStore';

const WEEKLY_EARNINGS = [
  { day: 'Mon', base: 3400, bonus: 600 },
  { day: 'Tue', base: 4800, bonus: 900 },
  { day: 'Wed', base: 3100, bonus: 400 },
  { day: 'Thu', base: 5600, bonus: 1100 },
  { day: 'Fri', base: 6200, bonus: 1400 },
  { day: 'Sat', base: 4400, bonus: 750 },
  { day: 'Sun', base: 4200, bonus: 800 },
];

export default function HomePage() {
  const { online, toggleOnline, shiftHours, availableBalanceInr, jobs, profile, acceptJob, declineJob } = useTechStore();
  const navigate = useNavigate();

  const incoming = jobs.filter((j) => j.status === 'INCOMING');
  const activeJobs = jobs.filter((j) => j.status === 'ACCEPTED' || j.status === 'ARRIVED' || j.status === 'IN_PROGRESS');
  const maxDay = Math.max(...WEEKLY_EARNINGS.map((d) => d.base + d.bonus));

  function handleAccept(id: string) {
    acceptJob(id);
    navigate(`/jobs/${id}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E2EAE7] bg-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0F4C4C]">
            <span className={`h-2 w-2 rounded-full ${online ? 'bg-[#10B981]' : 'bg-slate-400'}`} />
            {online ? 'Live Dispatch Radar Active' : 'Radar Paused'}
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold text-[#102020] sm:text-3xl">
            Welcome back, {profile.fullName.split(' ')[0]}
          </h1>
          <p className="mt-1 text-xs text-[#556868] sm:text-sm">
            {profile.cluster} • Service radius {profile.serviceRadiusKm} km • {profile.jobsCompleted} completed repairs
          </p>
        </div>

        <button
          type="button"
          onClick={toggleOnline}
          className={`cursor-pointer rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            online
              ? 'border border-[#E2EAE7] bg-white text-[#102020] hover:border-[#0F4C4C]'
              : 'bg-[#10B981] text-[#052E24] hover:opacity-95'
          }`}
        >
          {online ? 'Pause Duty' : 'Go Online Now'}
        </button>
      </div>

      {/* KPI Row */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="tech-card tech-card-hover p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#556868]">Available for IMPS</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0F4C4C]">
            ₹{availableBalanceInr.toLocaleString('en-IN')}
          </p>
          <Link to="/earnings" className="mt-3 inline-block text-xs font-semibold text-[#D96B27] hover:underline">
            Withdraw instantly →
          </Link>
        </div>

        <div className="tech-card tech-card-hover p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#556868]">Incoming SOS Offers</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#D96B27]">{incoming.length}</p>
          <p className="mt-3 text-xs text-[#556868]">{activeJobs.length} active job in progress</p>
        </div>

        <div className="tech-card tech-card-hover p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#556868]">ISO Shift Fatigue</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#102020]">{shiftHours.toFixed(1)}h / 12h</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#EBF3F2]">
            <div
              className="h-full rounded-full bg-[#10B981] transition-all duration-500"
              style={{ width: `${Math.min(100, (shiftHours / 12) * 100)}%` }}
            />
          </div>
        </div>

        <div className="tech-card tech-card-hover p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#556868]">Specialist Rating</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#102020]">{profile.rating.toFixed(1)}★</p>
          <p className="mt-3 text-xs text-[#0F4C4C] font-semibold">Soulbound ID: {profile.nftHash}</p>
        </div>
      </section>

      {/* Main Grid: Incoming SOS Radar + Active Work / Weekly Earnings Graph */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 7 cols: Incoming SOS Dispatch Radar */}
        <section className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#102020]">Nearby SOS Dispatch Radar</h2>
            <Link to="/jobs" className="text-xs font-semibold text-[#0F4C4C] hover:underline">
              View all jobs →
            </Link>
          </div>

          {!online && (
            <div className="tech-card p-6 text-center">
              <p className="text-sm font-bold text-[#102020]">You are currently Offline</p>
              <p className="mt-1 text-xs text-[#556868]">Switch to On Duty to receive high-priority breakdowns nearby.</p>
            </div>
          )}

          {online && incoming.length === 0 && (
            <div className="tech-card p-6 text-center">
              <p className="text-sm font-bold text-[#0F4C4C]">All nearby SOS offers handled</p>
              <p className="mt-1 text-xs text-[#556868]">Listening for new breakdowns within {profile.serviceRadiusKm} km...</p>
            </div>
          )}

          {online &&
            incoming.map((job) => (
              <article key={job.id} className="tech-card tech-card-hover border-l-4 border-l-[#D96B27] p-5 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#FDF2EA] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#D96B27]">
                        {job.urgency} • {job.etaMins} MIN ETA
                      </span>
                      <span className="font-mono text-[11px] text-[#556868]">{job.id}</span>
                    </div>
                    <h3 className="mt-1.5 font-display text-base font-bold text-[#102020]">
                      {job.asset} — {job.plantName}
                    </h3>
                    <p className="text-xs text-[#556868]">
                      {job.gateAddress} ({job.distanceKm} km away)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xl font-bold text-[#0F4C4C]">₹{job.payoutInr.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] font-mono text-[#10B981] font-semibold">Escrow Guaranteed</p>
                  </div>
                </div>

                <div className="rounded-xl bg-[#F4F7F6] p-3 text-xs text-[#102020]">
                  <p className="font-semibold text-[#0F4C4C]">AI Pre-Diagnostic Brief:</p>
                  <p className="mt-0.5 text-[#556868]">{job.aiBrief}</p>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => declineJob(job.id)}
                    className="cursor-pointer rounded-xl border border-[#E2EAE7] px-4 py-2 text-xs font-semibold text-[#556868] hover:border-[#102020] hover:text-[#102020]"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAccept(job.id)}
                    className="cursor-pointer rounded-xl bg-[#D96B27] px-5 py-2 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-95"
                  >
                    Accept &amp; Navigate →
                  </button>
                </div>
              </article>
            ))}

          {/* Active Jobs Strip */}
          {activeJobs.length > 0 && (
            <div className="space-y-3 pt-2">
              <h2 className="font-display text-base font-bold text-[#102020]">Active Assigned Jobs</h2>
              {activeJobs.map((j) => (
                <Link
                  key={j.id}
                  to={`/jobs/${j.id}`}
                  className="tech-card tech-card-hover flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div>
                    <span className="rounded-full bg-[#EBF3F2] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0F4C4C]">
                      {j.status.replace('_', ' ')}
                    </span>
                    <p className="mt-1 text-sm font-bold text-[#102020]">
                      {j.plantName} • {j.asset}
                    </p>
                    <p className="text-xs text-[#556868]">{j.gateAddress}</p>
                  </div>
                  <span className="rounded-xl bg-[#0F4C4C] px-3.5 py-2 text-xs font-bold text-white">
                    Open Job →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Right 5 cols: Weekly Earnings Graph */}
        <section className="tech-card p-6 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-[#102020]">7-Day Earnings Velocity</h2>
                <p className="text-xs text-[#556868]">Base repair payouts (Teal) + SOS SLA bonuses (Copper)</p>
              </div>
              <span className="font-mono text-sm font-bold text-[#0F4C4C]">₹37,650</span>
            </div>

            <div className="mt-6 grid h-48 grid-cols-7 items-end gap-2.5 border-b border-[#E2EAE7] pb-2">
              {WEEKLY_EARNINGS.map((d, idx) => {
                const baseH = Math.round((d.base / maxDay) * 100);
                const bonusH = Math.round((d.bonus / maxDay) * 100);
                return (
                  <div key={d.day} className="flex h-full flex-col items-center justify-end gap-1" title={`${d.day}: ₹${d.base + d.bonus}`}>
                    <div
                      className="animate-tech-bar w-full max-w-[26px] rounded-t-md bg-[#D96B27]"
                      style={{ height: `${bonusH}%`, animationDelay: `${idx * 60 + 80}ms` }}
                    />
                    <div
                      className="animate-tech-bar w-full max-w-[26px] rounded-t-sm bg-[#0F4C4C]"
                      style={{ height: `${baseH}%`, animationDelay: `${idx * 60}ms` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-2 grid grid-cols-7 text-center font-mono text-[11px] text-[#556868]">
              {WEEKLY_EARNINGS.map((d) => (
                <span key={d.day}>{d.day}</span>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-[#EBF3F2] p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#0F4C4C]">Zero-Delay Escrow Payouts</p>
              <p className="text-[11px] text-[#556868]">Complete handover OTP to credit your balance immediately.</p>
            </div>
            <Link to="/earnings" className="rounded-lg bg-[#0F4C4C] px-3 py-1.5 text-xs font-bold text-white shrink-0">
              Ledger
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
