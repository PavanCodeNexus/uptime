import {
  aiApi,
  Button,
  errorMessage,
  formatDateTime,
  formatINR,
  getArrivalCode,
  industryInfo,
  jobsApi,
  matchingApi,
  Notice,
  SampleBadge,
  spacedCode,
  StatusBadge,
  StatusTracker,
  type CopilotStep,
  type Job,
} from '@uptime/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { http } from '../lib/api';

const FINISHED = ['COMPLETED', 'CANCELLED'];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-fg-2">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function ArrivalCodeCard({ job }: { job: Job }) {
  if (job.otpVerified || FINISHED.includes(job.status.toUpperCase())) return null;
  const code = getArrivalCode(job.id);
  return (
    <section className="rounded-xl bg-brand p-5 text-on-brand" aria-labelledby="code-h">
      <h2 id="code-h" className="text-sm font-medium">
        Your arrival code
      </h2>
      {code ? (
        <>
          <p className="mt-2 font-mono text-3xl font-bold tracking-widest text-accent">{spacedCode(code)}</p>
          <p className="mt-2 text-sm">Tell this to the technician only when they reach you.</p>
        </>
      ) : (
        <p className="mt-2 text-sm">
          This code was shown only when the job was created, and it is not saved on this device. If the technician asks for it, report a new job.
        </p>
      )}
    </section>
  );
}

function CostCard({ job }: { job: Job }) {
  const hasFinal = job.totalAmount > 0;
  return (
    <section className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-5" aria-labelledby="cost-h">
      <h2 id="cost-h" className="text-base font-semibold">
        {hasFinal ? 'Cost' : 'Estimated cost'}
      </h2>
      {hasFinal ? (
        <>
          <Row label="Labour" value={formatINR(job.laborCharge)} />
          <Row label="Parts" value={formatINR(job.partsCharge)} />
          {job.discountAmount > 0 && <Row label="Discount" value={`- ${formatINR(job.discountAmount)}`} />}
          <Row label="GST" value={formatINR(job.gstAmount)} />
          <div className="mt-1 flex justify-between border-t border-line pt-2 text-base font-bold">
            <span>Total</span>
            <span className="text-brand-ink">{formatINR(job.totalAmount)}</span>
          </div>
        </>
      ) : job.aiEstimatedCostMax ? (
        <p className="text-sm text-fg-2">
          About {formatINR(job.aiEstimatedCostMin ?? 0)} to {formatINR(job.aiEstimatedCostMax)}. The final amount is confirmed after the work is done.
        </p>
      ) : (
        <p className="text-sm text-fg-2">The final amount is confirmed after the work is done.</p>
      )}
    </section>
  );
}

function CopilotPanel({ job, onEscalated }: { job: Job; onEscalated: () => void }) {
  const [step, setStep] = useState<CopilotStep | null>(null);
  const start = useMutation({ mutationFn: () => aiApi.copilotStart(http, job.id), onSuccess: setStep });
  const next = useMutation({ mutationFn: (n: number) => aiApi.copilotNext(http, job.id, n), onSuccess: setStep });
  const escalate = useMutation({
    mutationFn: () => jobsApi.escalate(http, job.id, 'DIRECT_BOOKING', 'AI copilot did not fix the problem'),
    onSuccess: onEscalated,
  });
  const busy = start.isPending || next.isPending;
  const error = start.error ?? next.error ?? escalate.error;

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5" aria-labelledby="cop-h">
      <div className="flex items-center justify-between gap-2">
        <h2 id="cop-h" className="text-base font-semibold">
          AI copilot
        </h2>
        {(!step || step.fallbackUsed) && <SampleBadge />}
      </div>
      {error && <Notice tone="danger">{errorMessage(error)}</Notice>}
      {!step ? (
        <>
          <p className="text-sm text-fg-2">Follow short, safe steps to try to fix it yourself. You can book a technician at any point.</p>
          <Button onClick={() => start.mutate()} loading={start.isPending} className="self-start">
            Start step 1
          </Button>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">Step {step.stepNumber}</p>
          <p className="font-semibold">{step.title}</p>
          <p className="text-sm text-fg-2">{step.instruction}</p>
          {step.toolNeeded && <p className="text-sm text-fg-muted">You will need: {step.toolNeeded}</p>}
          {step.safetyWarning && <Notice tone="warning">{step.safetyWarning}</Notice>}
          {step.expectedResult && <p className="text-sm text-fg-muted">What you should see: {step.expectedResult}</p>}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button variant="secondary" onClick={() => next.mutate(step.stepNumber + 1)} loading={busy}>
              Next step
            </Button>
          </div>
        </div>
      )}
      <Button variant={step?.suggestEscalationToVideo ? 'primary' : 'ghost'} onClick={() => escalate.mutate()} loading={escalate.isPending} className="self-start">
        Still not fixed? Book a technician
      </Button>
    </section>
  );
}

function MatchingPanel({ jobId }: { jobId: number }) {
  const q = useQuery({ queryKey: ['candidates', jobId], queryFn: () => matchingApi.candidates(http, jobId), refetchInterval: 10000 });
  return (
    <section className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-5" aria-labelledby="match-h">
      <h2 id="match-h" className="text-base font-semibold">
        Finding a technician
      </h2>
      {q.isPending && <p className="text-sm text-fg-2">Checking who is nearby...</p>}
      {q.isError && <Notice tone="warning">Could not check nearby technicians right now. We will keep trying.</Notice>}
      {q.isSuccess && q.data.length === 0 && (
        <p className="text-sm text-fg-2">No verified technician is free nearby yet. Keep this page open; it updates by itself.</p>
      )}
      {q.isSuccess && q.data.length > 0 && (
        <p className="text-sm text-fg-2">
          {q.data.length} verified technician{q.data.length === 1 ? '' : 's'} nearby {q.data.length === 1 ? 'matches' : 'match'} your job. The first to accept will be assigned.
        </p>
      )}
    </section>
  );
}

/** One job: progress, details, arrival code, cost, plus the AI copilot or matching panel while they apply. */
export default function JobDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const jobId = Number(id);
  const valid = Number.isInteger(jobId) && jobId > 0;

  const q = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsApi.get(http, jobId),
    enabled: valid,
    refetchInterval: (query) => (query.state.data && FINISHED.includes(query.state.data.status.toUpperCase()) ? false : 5000),
  });

  if (!valid) return <Notice tone="danger">That job address is not valid.</Notice>;
  if (q.isPending) return <p className="text-fg-2" role="status">Loading the job...</p>;
  if (q.isError) {
    return (
      <div className="flex flex-col items-start gap-3">
        <Notice tone="danger">{errorMessage(q.error)}</Notice>
        <Button variant="secondary" onClick={() => void q.refetch()}>
          Try again
        </Button>
        <Link to="/jobs" className="text-sm text-brand-ink underline">
          Back to my jobs
        </Link>
      </div>
    );
  }

  const job = q.data;
  const status = job.status.toUpperCase();
  const refresh = () => void queryClient.invalidateQueries({ queryKey: ['job', jobId] });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/jobs" className="text-sm text-brand-ink underline">
            &larr; My jobs
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{job.jobNumber}</h1>
          <p className="text-fg-2">
            {industryInfo(job.industry)?.label ?? job.industry} &middot; {job.equipmentSummary}
          </p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <StatusTracker status={job.status} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          {status === 'COPILOT_ACTIVE' && <CopilotPanel job={job} onEscalated={refresh} />}
          {status === 'MATCHING' && <MatchingPanel jobId={job.id} />}
          {job.technicianId && (
            <section className="rounded-xl border border-line bg-surface p-5">
              <h2 className="text-base font-semibold">Your technician</h2>
              <p className="mt-1 text-sm text-fg-2">Technician #{job.technicianId} is assigned to this job. Live tracking arrives in the next phase.</p>
            </section>
          )}
          <section className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-5" aria-labelledby="det-h">
            <h2 id="det-h" className="text-base font-semibold">
              Details
            </h2>
            <Row label="Problem" value={job.problemDescription ?? '-'} />
            <Row label="Urgency" value={job.urgency} />
            <Row label="Location" value={[job.ownerAddress, job.ownerCity].filter(Boolean).join(', ') || '-'} />
            <Row label="Reported" value={formatDateTime(job.createdAt)} />
          </section>
        </div>
        <div className="flex flex-col gap-6">
          <ArrivalCodeCard job={job} />
          <CostCard job={job} />
        </div>
      </div>
    </div>
  );
}
