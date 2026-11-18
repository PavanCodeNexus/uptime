import { jobStatusInfo, TRACKER_STEPS, trackerIndex, type Tone } from '../constants/job';

const TONE_CLASS: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-fg-2',
  info: 'bg-info-soft text-info',
  warning: 'bg-warning-soft text-warning',
  purple: 'bg-surface-2 text-industrial',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
  orange: 'bg-warning-soft text-warning',
};

/** A small coloured pill with the plain-language status ("Finding a technician", "On the way"...). */
export function StatusBadge({ status }: { status: string | undefined | null }) {
  const info = jobStatusInfo(status);
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${TONE_CLASS[info.tone]}`}>{info.label}</span>;
}

const STEP_LABEL: Record<(typeof TRACKER_STEPS)[number], string> = {
  CREATED: 'Posted',
  MATCHING: 'Matching',
  ACCEPTED: 'Accepted',
  EN_ROUTE: 'On the way',
  ARRIVED: 'Arrived',
  IN_PROGRESS: 'Working',
  COMPLETED: 'Done',
};

/** The 7-step progress line. Steps before the current one show a tick. */
export function StatusTracker({ status }: { status: string | undefined | null }) {
  const current = trackerIndex(status);
  return (
    <ol className="flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface p-4" aria-label="Job progress">
      {TRACKER_STEPS.map((s, i) => {
        const done = current > i || (current === i && s === 'COMPLETED');
        const now = current === i && !done;
        return (
          <li key={s} className="flex min-w-[64px] flex-1 flex-col items-center gap-1.5 text-center" aria-current={now ? 'step' : undefined}>
            <span
              className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                done ? 'bg-success text-on-brand' : now ? 'bg-brand text-on-brand' : 'bg-surface-2 text-fg-muted'
              }`}
            >
              {done ? '✓' : i + 1}
            </span>
            <span className={`text-xs ${now ? 'font-semibold text-brand-ink' : done ? 'text-fg' : 'text-fg-muted'}`}>{STEP_LABEL[s]}</span>
          </li>
        );
      })}
    </ol>
  );
}

/** A "Sample data" pill for screens backed by a stub endpoint (see docs/FRONTEND_DECISIONS.md). */
export function SampleBadge() {
  return <span className="rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-semibold text-warning">Sample data</span>;
}
