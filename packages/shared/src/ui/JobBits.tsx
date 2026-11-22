import { jobStatusInfo, TRACKER_STEPS, trackerIndex, type Tone } from '../constants/job';

const TONE_CLASS: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
};

/** A small coloured pill with the plain-language status ("Finding a technician", "On the way"...). */
export function StatusBadge({ status }: { status: string | undefined | null }) {
  const info = jobStatusInfo(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-bold ${TONE_CLASS[info.tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true"></span>
      {info.label}
    </span>
  );
}

const STEP_LABEL: Record<(typeof TRACKER_STEPS)[number], string> = {
  CREATED: 'Posted',
  MATCHING: 'Matching',
  ACCEPTED: 'Accepted',
  EN_ROUTE: 'En-Route',
  ARRIVED: 'Arrived',
  IN_PROGRESS: 'In-Repair',
  COMPLETED: 'Handover',
};

/** The 7-step progress bar styled in UPTIME industrial command cards. */
export function StatusTracker({ status }: { status: string | undefined | null }) {
  const current = trackerIndex(status);
  return (
    <ol className="grid grid-cols-2 gap-2 rounded-3xl border border-slate-800 bg-slate-900 p-4 text-white sm:grid-cols-4 lg:grid-cols-7" aria-label="Job progress">
      {TRACKER_STEPS.map((s, i) => {
        const done = current > i || (current === i && s === 'COMPLETED');
        const now = current === i && !done;
        return (
          <li
            key={s}
            aria-current={now ? 'step' : undefined}
            className={`flex flex-col items-center justify-center gap-1 rounded-2xl border p-2.5 text-center font-mono text-[11px] transition-all ${
              done
                ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                : now
                  ? 'border-blue-400/50 bg-blue-500/20 text-blue-200 font-bold shadow-sm'
                  : 'border-slate-800 bg-slate-800/60 text-slate-500'
            }`}
          >
            <span className="text-xs font-black">{done ? '✓' : now ? '●' : `${i + 1}.`}</span>
            <span>{STEP_LABEL[s]}</span>
          </li>
        );
      })}
    </ol>
  );
}

/** A "Sample data" pill for screens backed by a stub endpoint (see docs/FRONTEND_DECISIONS.md). */
export function SampleBadge() {
  return (
    <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-800">
      SAMPLE FALLBACK
    </span>
  );
}
