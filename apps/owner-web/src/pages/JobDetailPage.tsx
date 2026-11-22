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
  TrackingCard,
  spacedCode,
  StatusBadge,
  StatusTracker,
  type CopilotStep,
  type Job,
} from '@uptime/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PayCard, RateCard } from '../components/PayAndRate';
import { http } from '../lib/api';
import { env } from '../lib/env';

const FINISHED = ['COMPLETED', 'CANCELLED'];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-xs py-1.5 border-b border-slate-100 last:border-0">
      <span className="font-mono text-slate-500 uppercase text-[10px] font-bold">{label}</span>
      <span className="text-right font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function ArrivalCodeCard({ job }: { job: Job }) {
  if (job.otpVerified || FINISHED.includes(job.status.toUpperCase())) return null;
  const code = getArrivalCode(job.id);
  return (
    <section className="rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white shadow-xl space-y-2" aria-labelledby="code-h">
      <div className="flex items-center justify-between">
        <h2 id="code-h" className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-400">
          On-Site Arrival Handshake OTP
        </h2>
        <i className="fa-solid fa-shield-halved text-amber-400"></i>
      </div>
      {code ? (
        <>
          <p className="font-mono text-4xl font-black tracking-widest text-amber-400">{spacedCode(code)}</p>
          <p className="text-xs text-slate-300">Share this code ONLY when the technician physically arrives within the 500m plant geofence.</p>
        </>
      ) : (
        <p className="text-xs text-slate-300">
          This code was displayed once upon job creation and is not stored on this device.
        </p>
      )}
    </section>
  );
}

function CostCard({ job }: { job: Job }) {
  const hasFinal = job.totalAmount > 0;
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3" aria-labelledby="cost-h">
      <div className="flex items-center justify-between">
        <h2 id="cost-h" className="text-base font-display font-black text-slate-900">
          {hasFinal ? 'Escrow Cost Breakdown' : 'Estimated Repair Cost'}
        </h2>
        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">18% GST ITC</span>
      </div>
      {hasFinal ? (
        <div className="space-y-1">
          <Row label="Labour" value={formatINR(job.laborCharge)} />
          <Row label="OEM Parts" value={formatINR(job.partsCharge)} />
          {job.discountAmount > 0 && <Row label="Discount" value={`- ${formatINR(job.discountAmount)}`} />}
          <Row label="GST" value={formatINR(job.gstAmount)} />
          <div className="mt-2 flex justify-between border-t border-slate-200 pt-3 text-base font-display font-black">
            <span>Total Escrow</span>
            <span className="text-blue-700 font-mono">{formatINR(job.totalAmount)}</span>
          </div>
        </div>
      ) : job.aiEstimatedCostMax ? (
        <p className="text-xs text-slate-600">
          Estimated <strong className="font-mono text-slate-900">{formatINR(job.aiEstimatedCostMin ?? 0)} – {formatINR(job.aiEstimatedCostMax)}</strong>. Final amount locks on handover.
        </p>
      ) : (
        <p className="text-xs text-slate-500">The final invoice amount is confirmed after repair completion.</p>
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
    <section className="rounded-3xl border border-purple-200 bg-white p-6 shadow-sm space-y-4" aria-labelledby="cop-h">
      <div className="flex items-center justify-between gap-2">
        <h2 id="cop-h" className="text-base font-display font-black text-slate-900">
          <i className="fa-solid fa-robot text-purple-600 mr-2"></i>Gemini AI Guided Copilot
        </h2>
        {(!step || step.fallbackUsed) && <SampleBadge />}
      </div>
      {error && <Notice tone="danger">{errorMessage(error)}</Notice>}
      {!step ? (
        <>
          <p className="text-xs text-slate-600">Follow verified, safe diagnostic steps before dispatching an engineer. Escalate to field dispatch anytime.</p>
          <Button onClick={() => start.mutate()} loading={start.isPending}>
            Start Guided Step 1
          </Button>
        </>
      ) : (
        <div className="space-y-3 rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <p className="font-mono text-[11px] font-bold uppercase text-purple-700">Step {step.stepNumber}</p>
          <p className="font-display font-extrabold text-sm text-slate-900">{step.title}</p>
          <p className="text-xs text-slate-700 leading-relaxed">{step.instruction}</p>
          {step.toolNeeded && <p className="text-xs font-mono text-slate-500">Tools needed: {step.toolNeeded}</p>}
          {step.safetyWarning && <Notice tone="warning">{step.safetyWarning}</Notice>}
          {step.expectedResult && <p className="text-xs text-emerald-700 font-semibold">Expected result: {step.expectedResult}</p>}
          <Button variant="secondary" onClick={() => next.mutate(step.stepNumber + 1)} loading={busy}>
            Next Step →
          </Button>
        </div>
      )}
      <Button variant={step?.suggestEscalationToVideo ? 'danger' : 'ghost'} onClick={() => escalate.mutate()} loading={escalate.isPending}>
        Still not resolved? Dispatch Field Specialist
      </Button>
    </section>
  );
}

function MatchingPanel({ jobId }: { jobId: number }) {
  const q = useQuery({ queryKey: ['candidates', jobId], queryFn: () => matchingApi.candidates(http, jobId), refetchInterval: 10000 });
  return (
    <section className="rounded-3xl border border-blue-200 bg-blue-50/60 p-6 space-y-2" aria-labelledby="match-h">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 pulse-live"></span>
        <h2 id="match-h" className="text-base font-display font-black text-blue-950">
          40/60 Specialist Matching Engine Active
        </h2>
      </div>
      {q.isPending && <p className="text-xs font-mono text-blue-700">Scanning nearby L2/L3 specialists via PostGIS...</p>}
      {q.isError && <Notice tone="warning">Temporarily unable to poll nearby specialists. Retrying automatically.</Notice>}
      {q.isSuccess && q.data.length === 0 && (
        <p className="text-xs text-blue-900">No verified technician is free nearby yet. Keep this console open; it updates automatically.</p>
      )}
      {q.isSuccess && q.data.length > 0 && (
        <p className="text-xs font-semibold text-blue-900">
          {q.data.length} verified specialist{q.data.length === 1 ? '' : 's'} matched in your industrial cluster. First to accept will dispatch immediately.
        </p>
      )}
    </section>
  );
}

/** Figma W10 / W12 / W13: Live Job Detail, Tracking, Forensic Handover, Escrow Payment & Blind Rating. */
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
  if (q.isPending) return <p className="text-sm font-mono text-slate-500" role="status">Loading job telemetry...</p>;
  if (q.isError) {
    return (
      <div className="space-y-3">
        <Notice tone="danger">{errorMessage(q.error)}</Notice>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => void q.refetch()}>
            Try again
          </Button>
          <Link to="/jobs" className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const job = q.data;
  const status = job.status.toUpperCase();
  const refresh = () => void queryClient.invalidateQueries({ queryKey: ['job', jobId] });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/jobs" className="font-mono text-xs font-bold text-blue-600 hover:underline">
            ← Back to Job Ledger
          </Link>
          <h1 className="mt-1 text-2xl font-display font-black tracking-tight text-slate-900">{job.jobNumber}</h1>
          <p className="text-xs font-semibold text-slate-600">
            {industryInfo(job.industry)?.label ?? job.industry} • {job.equipmentSummary}
          </p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <StatusTracker status={job.status} />

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          {status === 'COPILOT_ACTIVE' && <CopilotPanel job={job} onEscalated={refresh} />}
          {status === 'MATCHING' && <MatchingPanel jobId={job.id} />}
          {job.technicianId && (
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-display font-black flex items-center justify-center">
                  #{job.technicianId}
                </div>
                <div>
                  <h2 className="text-sm font-display font-extrabold text-slate-900">Assigned Field Specialist</h2>
                  <p className="text-xs text-slate-500">Verified Technician #{job.technicianId} • 100% Escrow Protected</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">VERIFIED L2+</span>
            </section>
          )}
          {['EN_ROUTE', 'ARRIVED'].includes(status) && (
            <TrackingCard http={http} jobId={job.id} destLat={job.ownerLat} destLng={job.ownerLng} mapsKey={env.googleMapsKey} active />
          )}
          {status === 'COMPLETED' && <PayCard job={job} />}
          {status === 'COMPLETED' && <RateCard jobId={job.id} />}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2" aria-labelledby="det-h">
            <h2 id="det-h" className="text-base font-display font-black text-slate-900 mb-2">
              Forensic Dispatch Dossier
            </h2>
            <Row label="Problem" value={job.problemDescription ?? '-'} />
            <Row label="Urgency" value={job.urgency} />
            <Row label="Location" value={[job.ownerAddress, job.ownerCity].filter(Boolean).join(', ') || '-'} />
            <Row label="Reported" value={formatDateTime(job.createdAt)} />
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <ArrivalCodeCard job={job} />
          <CostCard job={job} />
        </div>
      </div>
    </div>
  );
}
