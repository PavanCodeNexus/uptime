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
  TrackingCard,
  useAuth,
  type CopilotStep,
  type Job,
} from '@uptime/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PayCard, RateCard } from '../components/PayAndRate';
import { http } from '../lib/api';
import { env } from '../lib/env';
import { useOwnerStore } from '../store/ownerStore';

const FINISHED = ['COMPLETED', 'CANCELLED'];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-xs py-2 border-b border-slate-100 last:border-0">
      <span className="font-mono text-slate-500 uppercase text-[10px] font-bold">{label}</span>
      <span className="text-right font-semibold text-slate-900">{value}</span>
    </div>
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
    <section className="rounded-3xl border border-purple-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-display font-black text-slate-900">
          <i className="fa-solid fa-robot text-purple-600 mr-2" aria-hidden="true"></i>Gemini AI Guided Copilot
        </h2>
        {(!step || step.fallbackUsed) && <SampleBadge />}
      </div>
      {error && <Notice tone="danger">{errorMessage(error)}</Notice>}
      {!step ? (
        <>
          <p className="text-xs text-slate-600">Follow verified, safe diagnostic steps before dispatching an engineer.</p>
          <Button onClick={() => start.mutate()} loading={start.isPending}>Start Guided Step 1</Button>
        </>
      ) : (
        <div className="space-y-3 rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <p className="font-mono text-[11px] font-bold uppercase text-purple-700">Step {step.stepNumber}</p>
          <p className="font-display font-extrabold text-sm text-slate-900">{step.title}</p>
          <p className="text-xs text-slate-700">{step.instruction}</p>
          {step.safetyWarning && <Notice tone="warning">{step.safetyWarning}</Notice>}
          <Button variant="secondary" onClick={() => next.mutate(step.stepNumber + 1)} loading={busy}>Next Step →</Button>
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
    <section className="rounded-3xl border border-blue-200 bg-blue-50/60 p-6 space-y-2">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 pulse-live" aria-hidden="true"></span>
        <h2 className="text-base font-display font-black text-blue-950">Matching Nearby Verified Specialists</h2>
      </div>
      {q.isPending && <p className="text-xs font-mono text-blue-700">Scanning nearby L2/L3 specialists...</p>}
      {q.isSuccess && (
        <p className="text-xs font-semibold text-blue-900">
          {q.data.length > 0 ? `${q.data.length} verified specialist(s) matched. First to accept will dispatch immediately.` : 'Checking nearby availability automatically...'}
        </p>
      )}
    </section>
  );
}

export default function JobDetailPage() {
  const { id } = useParams();
  const { isDemo } = useAuth();
  const { localJobs, walletBalance, advanceLocalJobStatus, payLocalJob, rateLocalJob } = useOwnerStore();
  const queryClient = useQueryClient();
  const jobId = Number(id);
  const valid = Number.isInteger(jobId) && jobId > 0;
  const localJob = localJobs.find((j) => j.id === jobId);

  const [starPick, setStarPick] = useState(0);

  const q = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsApi.get(http, jobId),
    enabled: valid && !isDemo && !localJob,
    refetchInterval: (query) => (query.state.data && FINISHED.includes(query.state.data.status.toUpperCase()) ? false : 5000),
    retry: false,
  });

  if (!valid) return <Notice tone="danger">That job ID is not valid.</Notice>;

  // Interactive Local Job View (fully functional tracking, stage progression, escrow payment, GST invoice & double-blind rating!)
  if (localJob) {
    const status = localJob.status.toUpperCase();
    const isFinished = FINISHED.includes(status);

    return (
      <div className="space-y-6">
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link to="/jobs" className="font-mono text-xs font-bold text-blue-600 hover:underline">
              ← Back to My Jobs
            </Link>
            <h1 className="mt-1 text-2xl font-display font-black tracking-tight text-slate-900">{localJob.jobNumber}</h1>
            <p className="text-xs font-semibold text-slate-600">
              {industryInfo(localJob.industry)?.label ?? localJob.industry} • {localJob.equipmentSummary}
            </p>
          </div>
          <StatusBadge status={localJob.status} />
        </div>

        <StatusTracker status={localJob.status} />

        <div className="grid gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Assigned Specialist & Live Radar */}
            <section className="rounded-3xl bg-slate-900 text-white border border-slate-800 p-6 shadow-lg space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-display font-black flex items-center justify-center">
                    {localJob.technicianName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-display font-extrabold">{localJob.technicianName}</div>
                    <div className="text-xs text-slate-400">
                      {localJob.technicianTier} • {localJob.technicianRating}★ • Verified KYC
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 font-mono text-[11px] font-bold text-emerald-300">
                  {status === 'EN_ROUTE' ? `ETA ${localJob.etaMinutes} MINS` : status === 'ARRIVED' ? 'WITHIN 500M GEOFENCE' : status}
                </span>
              </div>

              {!isFinished && (
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-300">
                    {status === 'EN_ROUTE' && 'Live PostGIS GPS streaming from specialist van (Peenya Industrial Corridor).'}
                    {status === 'ARRIVED' && 'Specialist has arrived at your plant gate. Share Arrival OTP to begin repair.'}
                    {status === 'IN_PROGRESS' && '415V LOTO verified. Repair & OEM parts installation in progress.'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {status === 'EN_ROUTE' && (
                      <button
                        type="button"
                        onClick={() => advanceLocalJobStatus(localJob.id, 'ARRIVED')}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white cursor-pointer"
                      >
                        Mark Specialist Arrived
                      </button>
                    )}
                    {status === 'ARRIVED' && (
                      <button
                        type="button"
                        onClick={() => advanceLocalJobStatus(localJob.id, 'IN_PROGRESS')}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white cursor-pointer"
                      >
                        Verify OTP &amp; Start Work
                      </button>
                    )}
                    {status === 'IN_PROGRESS' && (
                      <button
                        type="button"
                        onClick={() => advanceLocalJobStatus(localJob.id, 'COMPLETED')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white cursor-pointer"
                      >
                        Complete Handover
                      </button>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Escrow Payment & Invoice */}
            {status === 'COMPLETED' && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-display font-black text-slate-900">100% Escrow Settlement &amp; 18% GST Invoice</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
                    {localJob.paid ? 'SETTLED' : 'ESCROW READY'}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  <strong>Work Completed:</strong> {localJob.workDoneSummary}
                </p>

                {localJob.paid ? (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 space-y-1.5 text-xs">
                    <div className="font-bold text-emerald-900">
                      <i className="fa-solid fa-circle-check mr-1.5" aria-hidden="true"></i>Payment Settled &amp; 30-Day Repair Warranty Active
                    </div>
                    <div className="font-mono text-emerald-800">
                      Invoice #INV-2026-{localJob.id} • Total {formatINR(localJob.totalAmount)} (incl. {formatINR(localJob.gstAmount)} GST ITC)
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => payLocalJob(localJob.id, false)}
                      className="min-h-tap px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                    >
                      Pay {formatINR(localJob.totalAmount)} via Razorpay Escrow
                    </button>
                    <button
                      type="button"
                      disabled={walletBalance < localJob.totalAmount}
                      onClick={() => payLocalJob(localJob.id, true)}
                      className="min-h-tap px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-bold cursor-pointer disabled:opacity-50"
                    >
                      Pay from Corporate Wallet ({formatINR(walletBalance)})
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Double-Blind Mutual Rating */}
            {status === 'COMPLETED' && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-display font-black text-slate-900">Double-Blind Specialist Rating</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-mono text-[10px] font-bold">
                    48H SEALED VAULT
                  </span>
                </div>
                {localJob.ratedStars > 0 ? (
                  <Notice tone="success">
                    You submitted {localJob.ratedStars} / 5 stars. Sealed securely until both parties rate or 48 hours elapse.
                  </Notice>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2" role="radiogroup" aria-label="Rating stars">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          role="radio"
                          aria-checked={starPick === n}
                          aria-label={`${n} stars`}
                          onClick={() => setStarPick(n)}
                          className={`min-h-tap min-w-tap rounded-xl border-2 text-xl cursor-pointer ${
                            n <= starPick ? 'border-amber-400 bg-amber-50 text-amber-500' : 'border-slate-200 text-slate-400'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <Button disabled={starPick === 0} onClick={() => rateLocalJob(localJob.id, starPick)}>
                      Seal &amp; Submit Rating
                    </Button>
                  </div>
                )}
              </section>
            )}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-1">
              <h2 className="text-base font-display font-black text-slate-900 mb-2">Service Dossier</h2>
              <Row label="Problem" value={localJob.problemDescription} />
              <Row label="Urgency" value={localJob.urgency} />
              <Row label="Plant Address" value={`${localJob.ownerAddress}, ${localJob.ownerCity}`} />
              <Row label="Reported At" value={formatDateTime(localJob.createdAt)} />
              <Row label="Forensic Hash" value={`SHA-256: 9f84c2e1...a40${localJob.id}`} />
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {!isFinished && (
              <section className="rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white shadow-lg space-y-2">
                <div className="font-mono text-[11px] font-bold uppercase text-[#00D4AA]">Plant Gate Arrival OTP</div>
                <div className="font-mono text-4xl font-black tracking-widest text-amber-400">{spacedCode(localJob.arrivalOtp)}</div>
                <p className="text-xs text-slate-300">Share this code ONLY when the technician arrives at your plant gate.</p>
              </section>
            )}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-display font-black text-slate-900">Cost Breakdown</h2>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">18% GST ITC</span>
              </div>
              <Row label="Certified Labour" value={formatINR(localJob.laborCharge)} />
              <Row label="OEM Parts" value={formatINR(localJob.partsCharge)} />
              <Row label="CGST 9% + SGST 9%" value={formatINR(localJob.gstAmount)} />
              <div className="pt-3 mt-2 border-t border-slate-200 flex justify-between text-base font-display font-black">
                <span>Total Escrow</span>
                <span className="font-mono text-blue-700">{formatINR(localJob.totalAmount)}</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // Live Backend Job View
  if (q.isPending) return <p className="text-xs font-mono text-slate-500" role="status">Loading job telemetry...</p>;
  if (q.isError || !q.data) {
    return (
      <div className="space-y-3">
        <Notice tone="danger">{q.isError ? errorMessage(q.error) : 'Job not found.'}</Notice>
        <Link to="/jobs" className="inline-block px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold">
          ← Back to My Jobs
        </Link>
      </div>
    );
  }

  const job = q.data;
  const status = job.status.toUpperCase();
  const refresh = () => void queryClient.invalidateQueries({ queryKey: ['job', jobId] });
  const arrivalCode = getArrivalCode(job.id);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/jobs" className="font-mono text-xs font-bold text-blue-600 hover:underline">← Back to My Jobs</Link>
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
          {['EN_ROUTE', 'ARRIVED'].includes(status) && (
            <TrackingCard http={http} jobId={job.id} destLat={job.ownerLat} destLng={job.ownerLng} mapsKey={env.googleMapsKey} active />
          )}
          {status === 'COMPLETED' && <PayCard job={job} />}
          {status === 'COMPLETED' && <RateCard jobId={job.id} />}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-display font-black text-slate-900 mb-2">Service Dossier</h2>
            <Row label="Problem" value={job.problemDescription ?? '-'} />
            <Row label="Urgency" value={job.urgency} />
            <Row label="Location" value={[job.ownerAddress, job.ownerCity].filter(Boolean).join(', ') || '-'} />
            <Row label="Reported" value={formatDateTime(job.createdAt)} />
          </section>
        </div>
        <div className="lg:col-span-4 space-y-6">
          {!job.otpVerified && !FINISHED.includes(status) && (
            <section className="rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white shadow-lg space-y-2">
              <div className="font-mono text-[11px] font-bold uppercase text-[#00D4AA]">Plant Gate Arrival OTP</div>
              <p className="font-mono text-4xl font-black tracking-widest text-amber-400">{arrivalCode ? spacedCode(arrivalCode) : '—'}</p>
              <p className="text-xs text-slate-300">Share this code ONLY when the technician physically arrives on-site.</p>
            </section>
          )}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-1">
            <h2 className="text-base font-display font-black text-slate-900 mb-2">Cost Summary</h2>
            <Row label="Labour" value={formatINR(job.laborCharge)} />
            <Row label="Parts" value={formatINR(job.partsCharge)} />
            <Row label="GST" value={formatINR(job.gstAmount)} />
            <div className="pt-3 mt-2 border-t border-slate-200 flex justify-between text-base font-display font-black">
              <span>Total</span>
              <span className="font-mono text-blue-700">{formatINR(job.totalAmount)}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
