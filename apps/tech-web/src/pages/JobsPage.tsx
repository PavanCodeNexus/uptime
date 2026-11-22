import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTechStore } from '../store/techStore';

export default function JobsPage() {
  const { jobs, acceptJob, declineJob } = useTechStore();
  const [tab, setTab] = useState<'ALL' | 'INCOMING' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const navigate = useNavigate();

  const visible = jobs.filter((j) => {
    if (tab === 'ALL') return true;
    if (tab === 'INCOMING') return j.status === 'INCOMING';
    if (tab === 'ACTIVE') return j.status === 'ACCEPTED' || j.status === 'ARRIVED' || j.status === 'IN_PROGRESS';
    return j.status === 'COMPLETED';
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full border border-[#E2EAE7] bg-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0F4C4C]">
            Field Jobs &amp; Radar
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold text-[#102020] sm:text-3xl">Assigned &amp; Nearby Jobs</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['ALL', 'INCOMING', 'ACTIVE', 'COMPLETED'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                tab === t
                  ? 'bg-[#0F4C4C] text-white'
                  : 'border border-[#E2EAE7] bg-white text-[#556868] hover:border-[#0F4C4C] hover:text-[#0F4C4C]'
              }`}
            >
              {t === 'ALL' ? 'All Jobs' : t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {visible.map((job) => (
          <div key={job.id} className="tech-card tech-card-hover p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#0F4C4C]">{job.id}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                    job.status === 'INCOMING'
                      ? 'bg-[#FDF2EA] text-[#D96B27]'
                      : job.status === 'COMPLETED'
                        ? 'bg-[#ECFDF5] text-[#065F46]'
                        : 'bg-[#EBF3F2] text-[#0F4C4C]'
                  }`}
                >
                  {job.status.replace('_', ' ')}
                </span>
                <span className="text-[11px] text-[#556868]">
                  {job.cluster} • {job.distanceKm} km
                </span>
              </div>
              <h2 className="font-display text-base font-bold text-[#102020]">
                {job.asset} — {job.plantName}
              </h2>
              <p className="text-xs text-[#556868]">{job.symptom}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-mono text-lg font-bold text-[#0F4C4C]">₹{job.payoutInr.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-[#556868]">{job.createdAt}</p>
              </div>
              {job.status === 'INCOMING' ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => declineJob(job.id)}
                    className="cursor-pointer rounded-xl border border-[#E2EAE7] px-3 py-2 text-xs font-semibold text-[#556868]"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      acceptJob(job.id);
                      navigate(`/jobs/${job.id}`);
                    }}
                    className="cursor-pointer rounded-xl bg-[#D96B27] px-4 py-2 text-xs font-bold text-white"
                  >
                    Accept
                  </button>
                </div>
              ) : (
                <Link
                  to={`/jobs/${job.id}`}
                  className="rounded-xl bg-[#0F4C4C] px-4 py-2 text-xs font-bold text-white hover:bg-[#0A3535]"
                >
                  Open Workspace →
                </Link>
              )}
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="tech-card p-10 text-center text-xs text-[#556868]">No jobs in this category yet.</div>
        )}
      </div>
    </div>
  );
}
