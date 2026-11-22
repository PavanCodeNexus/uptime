import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTechStore } from '../store/techStore';

export default function JobWorkPage() {
  const { id } = useParams();
  const { jobs, markArrived, toggleLotoCheck, startWorkWithOtp, addPartUsed, completeJob } = useTechStore();
  const job = jobs.find((j) => j.id === id);

  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [partInput, setPartInput] = useState('');

  if (!job) {
    return (
      <div className="tech-card p-10 text-center space-y-3">
        <h1 className="font-display text-xl font-bold text-[#102020]">Job Not Found</h1>
        <Link to="/jobs" className="inline-block rounded-xl bg-[#0F4C4C] px-4 py-2 text-xs font-bold text-white">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const allLotoChecked = job.lotoChecks.powerIsolated && job.lotoChecks.lockTagged && job.lotoChecks.zeroEnergyTested;

  function handleStartWork(e: FormEvent) {
    e.preventDefault();
    setOtpError(null);
    if (!allLotoChecked) {
      setOtpError('Complete all 3 mandatory 415V LOTO safety checks before starting repair.');
      return;
    }
    const ok = startWorkWithOtp(job!.id, otpInput);
    if (!ok) {
      setOtpError(`Invalid customer arrival OTP. Ask the plant supervisor (preview OTP: ${job!.arrivalOtp}).`);
    }
  }

  function handleAddPart(e: FormEvent) {
    e.preventDefault();
    if (!partInput.trim()) return;
    addPartUsed(job!.id, partInput.trim());
    setPartInput('');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/jobs" className="text-xs font-semibold text-[#0F4C4C] hover:underline">
            ← All Jobs
          </Link>
          <h1 className="mt-1 font-display text-2xl font-bold text-[#102020]">
            {job.id} • {job.asset}
          </h1>
          <p className="text-xs text-[#556868]">
            {job.plantName} — {job.gateAddress}
          </p>
        </div>
        <div className="text-right">
          <span className="rounded-full bg-[#EBF3F2] px-3 py-1 font-mono text-xs font-bold text-[#0F4C4C]">
            {job.status.replace('_', ' ')}
          </span>
          <p className="mt-1 font-mono text-xl font-bold text-[#0F4C4C]">₹{job.payoutInr.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Diagnostic Brief */}
      <section className="tech-card p-5 space-y-2 border-l-4 border-l-[#0F4C4C]">
        <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0F4C4C]">
          Reported Symptom &amp; AI Triage Brief
        </p>
        <p className="text-sm font-semibold text-[#102020]">{job.symptom}</p>
        <p className="text-xs text-[#556868]">{job.aiBrief}</p>
      </section>

      {/* Stage Execution Controls */}
      {job.status === 'ACCEPTED' && (
        <section className="tech-card p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-[#102020]">Step 1: Arrive at Plant Gate</h2>
            <p className="text-xs text-[#556868]">
              Navigate to {job.gateAddress} ({job.distanceKm} km). Mark arrival once at security gate.
            </p>
          </div>
          <button
            type="button"
            onClick={() => markArrived(job.id)}
            className="cursor-pointer rounded-xl bg-[#D96B27] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95"
          >
            Mark Arrived at Plant Gate
          </button>
        </section>
      )}

      {job.status === 'ARRIVED' && (
        <section className="tech-card p-6 space-y-5">
          <div>
            <h2 className="font-display text-lg font-bold text-[#102020]">
              Step 2: 415V LOTO Safety &amp; Arrival OTP Verification
            </h2>
            <p className="text-xs text-[#556868]">
              Confirm all three Lockout-Tagout checks and enter the 6-digit OTP from the plant supervisor.
            </p>
          </div>

          <div className="space-y-2.5">
            {(
              [
                ['powerIsolated', 'Main 415V isolator switched OFF and capacitor bank discharged'],
                ['lockTagged', 'Personal LOTO padlock & danger tag attached to breaker panel'],
                ['zeroEnergyTested', 'Zero-energy state verified with calibrated multimeter'],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E2EAE7] bg-[#F4F7F6] p-3.5 text-xs font-semibold text-[#102020]"
              >
                <input
                  type="checkbox"
                  checked={job.lotoChecks[key]}
                  onChange={() => toggleLotoCheck(job.id, key)}
                  className="h-4 w-4 accent-[#0F4C4C]"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <form onSubmit={handleStartWork} className="space-y-3 border-t border-[#E2EAE7] pt-4">
            {otpError && <p className="text-xs font-semibold text-red-600">{otpError}</p>}
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label htmlFor="arrival-otp" className="mb-1 block text-xs font-semibold text-[#102020]">
                  Customer Arrival OTP <span className="font-mono text-[#556868]">(Preview: {job.arrivalOtp})</span>
                </label>
                <input
                  id="arrival-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder={job.arrivalOtp}
                  className="w-48 rounded-xl border border-[#E2EAE7] bg-[#F4F7F6] px-3.5 py-2.5 font-mono text-base font-bold tracking-[0.25em] text-[#102020] outline-none focus:border-[#0F4C4C] focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer rounded-xl bg-[#0F4C4C] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0A3535]"
              >
                Verify OTP &amp; Start Repair
              </button>
            </div>
          </form>
        </section>
      )}

      {job.status === 'IN_PROGRESS' && (
        <section className="tech-card p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-[#102020]">Step 3: Repair Execution &amp; Parts Log</h2>
              <p className="text-xs text-[#556868]">Log replaced spare parts and complete handover to credit escrow.</p>
            </div>
            <button
              type="button"
              onClick={() => completeJob(job.id)}
              className="cursor-pointer rounded-xl bg-[#10B981] px-5 py-2.5 text-xs font-bold text-[#052E24] shadow-sm hover:opacity-95"
            >
              Complete Handover &amp; Credit ₹{job.payoutInr.toLocaleString('en-IN')}
            </button>
          </div>

          <form onSubmit={handleAddPart} className="flex flex-wrap gap-2">
            <input
              type="text"
              value={partInput}
              onChange={(e) => setPartInput(e.target.value)}
              placeholder="Add replaced spare part (e.g. 47Ω Braking Resistor)"
              className="flex-1 min-w-[220px] rounded-xl border border-[#E2EAE7] bg-[#F4F7F6] px-3.5 py-2 text-xs text-[#102020] outline-none focus:border-[#0F4C4C] focus:bg-white"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-xl border border-[#0F4C4C] px-4 py-2 text-xs font-bold text-[#0F4C4C] hover:bg-[#0F4C4C] hover:text-white"
            >
              + Log Part
            </button>
          </form>

          {job.partsUsed.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {job.partsUsed.map((part, idx) => (
                <li
                  key={`${part}-${idx}`}
                  className="rounded-full bg-[#EBF3F2] px-3 py-1 font-mono text-[11px] font-semibold text-[#0F4C4C]"
                >
                  ✓ {part}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {job.status === 'COMPLETED' && (
        <section className="tech-card border border-[#10B981]/40 bg-[#ECFDF5] p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-[#065F46]">Repair Completed &amp; Escrow Credited</h2>
            <p className="text-xs text-[#047857]">
              ₹{job.payoutInr.toLocaleString('en-IN')} has been added to your available IMPS payout balance.
            </p>
          </div>
          <Link to="/earnings" className="rounded-xl bg-[#0F4C4C] px-4 py-2 text-xs font-bold text-white">
            View Earnings →
          </Link>
        </section>
      )}
    </div>
  );
}
