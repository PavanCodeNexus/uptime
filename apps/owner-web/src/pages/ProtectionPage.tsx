import { Button, Notice, TextField } from '@uptime/shared';
import { useState, type FormEvent } from 'react';
import { useOwnerStore } from '../store/ownerStore';

const WARRANTIES = [
  { jobNumber: 'JOB-9794', assetName: 'Tata Prima 5530.S BS-VI DEF Injector', daysLeft: 26, completed: '18 Nov 2026', covered: 'Bosch DEF injector & dosing calibration' },
  { jobNumber: 'JOB-9752', assetName: 'APC Symmetra PX 40kVA UPS Capacitor Bank', daysLeft: 19, completed: '11 Nov 2026', covered: 'EPCOS 440V capacitor bank & bus torque' },
];

const AMC_TIERS = [
  {
    id: 'BASIC' as const,
    name: 'Workshop Basic AMC',
    price: '₹4,999 / quarter',
    sla: '2-Hour Dispatch SLA',
    perks: ['Bi-annual preventive audit', '10% off OEM spare parts', '30-Day Repair Warranty'],
  },
  {
    id: 'PRO' as const,
    name: 'Factory Pro AMC',
    price: '₹12,500 / quarter',
    sla: '15-Min Emergency SLA',
    perks: ['Quarterly acoustic & thermal audits', '₹0 emergency booking fees', '5 Digital Twin telemetry slots', 'Priority L2/L3 engineers'],
  },
  {
    id: 'ENTERPRISE' as const,
    name: 'Multi-Plant Enterprise 24/7',
    price: '₹28,000 / quarter',
    sla: '10-Min Dedicated SLA',
    perks: ['Dedicated L3 cluster lead engineer', 'Pre-stocked critical spares at depot', 'Unlimited Digital Twin sensors', 'Net-30 PO corporate billing'],
  },
];

export default function ProtectionPage() {
  const { claims, amcPlan, fileWarrantyClaim, setAmcPlan } = useOwnerStore();
  const [tab, setTab] = useState<'WARRANTY' | 'CLAIM' | 'AMC'>('WARRANTY');
  const [claimJob, setClaimJob] = useState(WARRANTIES[0].jobNumber);
  const [claimSymptom, setClaimSymptom] = useState('');
  const [claimErr, setClaimErr] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);

  function submitClaim(e: FormEvent) {
    e.preventDefault();
    if (claimSymptom.trim().length < 8) return setClaimErr('Describe the recurring symptom in at least 8 characters.');
    setClaimErr(null);
    const target = WARRANTIES.find((w) => w.jobNumber === claimJob) ?? WARRANTIES[0];
    const created = fileWarrantyClaim({ jobNumber: target.jobNumber, assetName: target.assetName, symptom: claimSymptom.trim() });
    setClaimSymptom('');
    setClaimSuccess(`Claim ${created.id} approved! A zero-fee warranty revisit specialist has been scheduled for ${target.assetName}.`);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 text-white p-6 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-mono text-[11px] font-bold text-[#00D4AA] uppercase">Plant &amp; Repair Protection</div>
          <h1 className="text-2xl font-display font-black tracking-tight">30-Day Warranty, Micro-Insurance &amp; AMC</h1>
          <p className="text-xs text-slate-300">Zero-fee revisit guarantees, ₹15 per-job micro-insurance (₹1,00,000 cover), and preventive AMC tiers.</p>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 font-mono text-xs">
          Active AMC: <strong className="text-[#00D4AA]">{amcPlan}</strong>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2" role="tablist">
        {(
          [
            { id: 'WARRANTY', label: '30-Day Warranties & Insurance' },
            { id: 'CLAIM', label: `File Revisit Claim (${claims.length})` },
            { id: 'AMC', label: 'Annual Maintenance Contracts (AMC)' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              tab === t.id ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'WARRANTY' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <div className="font-mono text-[10px] font-bold text-slate-400 uppercase">Active 30-Day Warranties</div>
              <div className="text-2xl font-display font-black text-slate-900">{WARRANTIES.length} Covered Jobs</div>
              <div className="text-xs text-emerald-700 font-semibold">₹0 Revisit Dispatch Fee</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <div className="font-mono text-[10px] font-bold text-slate-400 uppercase">₹15 Micro-Insurance Pool</div>
              <div className="text-2xl font-display font-black text-blue-700">₹1,00,000 Cover</div>
              <div className="text-xs text-slate-500">Accidental repair damage protection</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <div className="font-mono text-[10px] font-bold text-slate-400 uppercase">Active AMC Contract</div>
              <div className="text-2xl font-display font-black text-purple-700">{amcPlan} Tier</div>
              <div className="text-xs text-slate-500">Next audit: 15 Dec 2026</div>
            </div>
          </div>

          <div className="space-y-3">
            {WARRANTIES.map((w) => (
              <div key={w.jobNumber} className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-blue-700">{w.jobNumber}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
                      {w.daysLeft} DAYS LEFT
                    </span>
                  </div>
                  <div className="text-sm font-display font-extrabold text-slate-900">{w.assetName}</div>
                  <div className="text-xs text-slate-500">Covered scope: {w.covered} • Completed {w.completed}</div>
                  <div className="h-2 w-64 max-w-full rounded-full bg-slate-100 overflow-hidden pt-0">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(w.daysLeft / 30) * 100}%` }}></div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setClaimJob(w.jobNumber);
                    setTab('CLAIM');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
                >
                  Request Zero-Fee Revisit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'CLAIM' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form onSubmit={submitClaim} className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4" noValidate>
            <h2 className="text-base font-display font-black text-slate-900">File Zero-Fee Warranty Revisit Claim</h2>
            {claimErr && <Notice tone="danger">{claimErr}</Notice>}
            {claimSuccess && <Notice tone="success">{claimSuccess}</Notice>}

            <div className="space-y-1.5">
              <label htmlFor="claim-job" className="text-[11px] font-mono font-bold uppercase text-slate-500">Select Covered Job</label>
              <select
                id="claim-job"
                value={claimJob}
                onChange={(e) => setClaimJob(e.target.value)}
                className="w-full min-h-tap rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold"
              >
                {WARRANTIES.map((w) => (
                  <option key={w.jobNumber} value={w.jobNumber}>
                    {w.jobNumber} — {w.assetName} ({w.daysLeft} days left)
                  </option>
                ))}
              </select>
            </div>

            <TextField
              label="Recurring Symptom"
              placeholder="e.g. Same fault code returned after 48 hours of continuous operation"
              value={claimSymptom}
              onChange={(e) => setClaimSymptom(e.target.value)}
            />

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Submit Zero-Fee Revisit Claim
            </Button>
          </form>

          <aside className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-display font-black text-slate-900">Your Submitted Claims</h3>
            {claims.length === 0 ? (
              <p className="text-xs text-slate-500">No warranty revisit claims filed yet.</p>
            ) : (
              claims.map((c) => (
                <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between font-mono font-bold">
                    <span className="text-blue-700">{c.id} ({c.jobNumber})</span>
                    <span className="text-emerald-700">{c.status.replace('_', ' ')}</span>
                  </div>
                  <div className="font-bold text-slate-900">{c.assetName}</div>
                  <p className="text-slate-600">{c.symptom}</p>
                </div>
              ))
            )}
          </aside>
        </div>
      )}

      {tab === 'AMC' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {AMC_TIERS.map((tier) => {
            const active = amcPlan === tier.id;
            return (
              <div
                key={tier.id}
                className={`rounded-3xl p-6 border-2 flex flex-col justify-between space-y-5 ${
                  active ? 'border-blue-600 bg-slate-900 text-white shadow-xl' : 'border-slate-200 bg-white text-slate-900'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-xs font-bold uppercase ${active ? 'text-[#00D4AA]' : 'text-blue-700'}`}>{tier.sla}</span>
                    {active && <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-mono text-[10px] font-bold">ACTIVE PLAN</span>}
                  </div>
                  <h2 className="text-lg font-display font-black">{tier.name}</h2>
                  <div className="text-2xl font-display font-black">{tier.price}</div>
                  <ul className="space-y-2 text-xs pt-2">
                    {tier.perks.map((p) => (
                      <li key={p} className="flex items-center gap-2">
                        <i className={`fa-solid fa-check ${active ? 'text-[#00D4AA]' : 'text-emerald-600'}`} aria-hidden="true"></i>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  disabled={active}
                  onClick={() => setAmcPlan(tier.id)}
                  className={`w-full py-3 rounded-xl text-xs font-bold cursor-pointer transition-colors disabled:opacity-60 ${
                    active ? 'bg-white/15 text-white cursor-default' : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {active ? 'Current Active Plan' : `Switch to ${tier.name}`}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
