import {
  Button,
  distanceMeters,
  errorMessage,
  formatINR,
  industryInfo,
  jobsApi,
  nextWorkStep,
  Notice,
  openLocationSender,
  ratingsApi,
  StatusBadge,
  StatusTracker,
  TextField,
  workApi,
  type Job,
} from '@uptime/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { http } from '../lib/api';
import { env } from '../lib/env';

function getPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) return reject(new Error('This browser cannot share a location.'));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => reject(new Error('Location was not shared. Allow location in the browser and try again.')),
      { timeout: 10000, enableHighAccuracy: true },
    );
  });
}

function useShareLocation(job: Job, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const sender = openLocationSender(env.wsUrl, job.id);
    let last: { lat: number; lng: number } | null = null;
    const watch =
      'geolocation' in navigator
        ? navigator.geolocation.watchPosition(
            (p) => (last = { lat: p.coords.latitude, lng: p.coords.longitude }),
            () => undefined,
            { enableHighAccuracy: true },
          )
        : -1;
    const timer = window.setInterval(() => {
      if (!last) return;
      const meters = distanceMeters(last.lat, last.lng, job.ownerLat, job.ownerLng);
      sender.send(last.lat, last.lng, Math.max(1, Math.round(meters / 500)));
    }, 5000);
    return () => {
      window.clearInterval(timer);
      if (watch !== -1) navigator.geolocation.clearWatch(watch);
      sender.close();
    };
  }, [active, job.id, job.ownerLat, job.ownerLng]);
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-base font-display font-black text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function OtpStep({ job, onDone }: { job: Job; onDone: () => void }) {
  const [code, setCode] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const verify = useMutation({
    mutationFn: async (useJobSpot: boolean) => {
      const pos = useJobSpot ? { lat: Number(job.ownerLat), lng: Number(job.ownerLng) } : await getPosition();
      return workApi.verifyOtp(http, job.id, code, pos.lat, pos.lng);
    },
    onSuccess: onDone,
  });
  function submit(e: FormEvent, useJobSpot = false) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) return setErr('The arrival code has 6 digits.');
    setErr(null);
    verify.mutate(useJobSpot);
  }
  return (
    <Step title="Verify Owner Arrival OTP (500m Geofence Gate)">
      <p className="text-xs text-slate-600">Ask the plant coordinator for their 6-digit arrival code. PostGIS verifies you are within 500 metres.</p>
      <form onSubmit={submit} className="space-y-3" noValidate>
        {verify.isError && <Notice tone="danger">{errorMessage(verify.error)}</Notice>}
        <div className="w-52">
          <TextField label="Arrival OTP" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} error={err} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" loading={verify.isPending} className="bg-orange-500 hover:bg-orange-600">
            Verify &amp; Start Repair
          </Button>
          {env.isDev && (
            <Button type="button" variant="secondary" onClick={(e) => submit(e, true)} disabled={verify.isPending}>
              Test mode: use job GPS
            </Button>
          )}
        </div>
      </form>
    </Step>
  );
}

function WorkStep({ job, onDone }: { job: Job; onDone: () => void }) {
  const [partName, setPartName] = useState('');
  const [qty, setQty] = useState('1');
  const [price, setPrice] = useState('');
  const [labor, setLabor] = useState('500');
  const [summary, setSummary] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [partsAdded, setPartsAdded] = useState<string[]>([]);

  const addPart = useMutation({
    mutationFn: () => workApi.addPart(http, job.id, { partName: partName.trim(), quantity: Number(qty), unitPrice: Number(price) }),
    onSuccess: (p) => {
      setPartsAdded((l) => [...l, `${p.partName} (${formatINR(p.totalPrice)})`]);
      setPartName('');
      setPrice('');
      setQty('1');
      onDone();
    },
  });
  const complete = useMutation({ mutationFn: () => workApi.complete(http, job.id, Number(labor), summary.trim()), onSuccess: onDone });

  function onAddPart(e: FormEvent) {
    e.preventDefault();
    if (partName.trim().length < 2) return setErr('Type the part name.');
    if (!(Number(qty) >= 1) || !(Number(price) > 0)) return setErr('Quantity and price must be more than 0.');
    setErr(null);
    addPart.mutate();
  }
  function onComplete(e: FormEvent) {
    e.preventDefault();
    if (!(Number(labor) >= 0)) return setErr('Enter your labour charge.');
    if (summary.trim().length < 5) return setErr('Write a short summary of the repair performed.');
    setErr(null);
    complete.mutate();
  }

  return (
    <>
      <Step title="Parts Used (Van Stock Logger)">
        <form onSubmit={onAddPart} className="grid gap-3 sm:grid-cols-3" noValidate>
          <TextField label="OEM Part Name" value={partName} onChange={(e) => setPartName(e.target.value)} />
          <TextField label="Quantity" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value.replace(/\D/g, ''))} />
          <TextField label="Unit Price (₹)" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ''))} />
          <Button type="submit" variant="secondary" loading={addPart.isPending} className="self-start sm:col-span-3">
            + Log Part on Invoice
          </Button>
        </form>
        {addPart.isError && <Notice tone="danger">{errorMessage(addPart.error)}</Notice>}
        {partsAdded.length > 0 && <p className="text-xs font-mono font-bold text-emerald-700">Added: {partsAdded.join(', ')}</p>}
      </Step>

      <Step title="Complete Repair & Digital Handover">
        <form onSubmit={onComplete} className="space-y-3" noValidate>
          {err && <Notice tone="danger">{err}</Notice>}
          {complete.isError && <Notice tone="danger">{errorMessage(complete.error)}</Notice>}
          <div className="w-52">
            <TextField label="Labour Charge (₹)" inputMode="decimal" value={labor} onChange={(e) => setLabor(e.target.value.replace(/[^\d.]/g, ''))} />
          </div>
          <TextField label="Repair Work Summary" placeholder="Replaced SKF spindle bearing & verified 61 dB acoustic baseline" value={summary} onChange={(e) => setSummary(e.target.value)} />
          <p className="text-[11px] font-mono text-slate-400">18% GST and SHA-256 forensic handover certificate generate automatically on lock.</p>
          <Button type="submit" loading={complete.isPending} className="bg-emerald-600 hover:bg-emerald-700">
            Mark Job Complete &amp; Lock Invoice
          </Button>
        </form>
      </Step>
    </>
  );
}

function RateOwner({ jobId }: { jobId: number }) {
  const [stars, setStars] = useState(0);
  const send = useMutation({ mutationFn: () => ratingsApi.submit(http, jobId, 'TECHNICIAN', stars) });
  return (
    <Step title="Double-Blind Owner Rating (CORE-07)">
      {send.isSuccess ? (
        <Notice tone="success">Rating sealed in the CORE-07 vault until the owner submits or 48 hours pass.</Notice>
      ) : (
        <>
          <div role="radiogroup" aria-label="Stars" className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={stars === n}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                onClick={() => setStars(n)}
                className={`min-h-tap min-w-tap rounded-xl border-2 text-xl ${
                  n <= stars ? 'border-amber-400 bg-amber-50 text-amber-500' : 'border-slate-200 text-slate-400'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          {send.isError && <Notice tone="danger">{errorMessage(send.error)}</Notice>}
          <Button onClick={() => send.mutate()} disabled={stars === 0} loading={send.isPending}>
            Seal &amp; Submit Rating
          </Button>
        </>
      )}
    </Step>
  );
}

/** Figma TW06: Live Job Execution & 415V LOTO Safety Console — live workApi + STOMP GPS wired. */
export default function JobWorkPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const jobId = Number(id);
  const valid = Number.isInteger(jobId) && jobId > 0;
  const [loto, setLoto] = useState([true, true, true]);

  const q = useQuery({
    queryKey: ['tech', 'job', jobId],
    queryFn: () => jobsApi.get(http, jobId),
    enabled: valid,
    refetchInterval: (query) => (query.state.data?.status.toUpperCase() === 'COMPLETED' ? false : 8000),
  });
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ['tech', 'job', jobId] });
    void qc.invalidateQueries({ queryKey: ['tech', 'me'] });
  };
  const go = useMutation({
    mutationFn: (step: 'ENROUTE' | 'ARRIVE') => (step === 'ENROUTE' ? workApi.enRoute(http, jobId) : workApi.arrive(http, jobId)),
    onSuccess: refresh,
  });
  const status = q.data?.status.toUpperCase();
  useShareLocation(q.data ?? ({ id: jobId, ownerLat: 0, ownerLng: 0 } as Job), status === 'EN_ROUTE');

  if (!valid) return <Notice tone="danger">That job address is not valid.</Notice>;
  if (q.isPending) return <p className="font-mono text-xs text-slate-500" role="status">Loading active job console...</p>;
  if (q.isError) {
    return (
      <div className="space-y-3">
        <Notice tone="danger">{errorMessage(q.error)}</Notice>
        <Button variant="secondary" onClick={() => void q.refetch()}>
          Try again
        </Button>
      </div>
    );
  }
  const job = q.data;
  const step = nextWorkStep(job.status);
  const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${job.ownerLat},${job.ownerLng}`;

  return (
    <div className="space-y-6">
      {/* Dark Active Execution Header */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link to="/jobs" className="font-mono text-xs text-orange-400 hover:underline">
              ← My Jobs
            </Link>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold">TW06 • LIVE EXECUTION</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-black">{job.jobNumber} • {job.equipmentSummary}</h1>
          <p className="text-xs text-slate-300">{industryInfo(job.industry)?.label ?? job.industry} • {[job.ownerAddress, job.ownerCity].filter(Boolean).join(', ')}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <StatusTracker status={job.status} />

      {/* Mandatory 415V Lockout-Tagout (LOTO) Safety Gate (Exact Figma TW06) */}
      <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-md">
            <i className="fa-solid fa-lock"></i>
          </div>
          <div>
            <h2 className="text-sm font-display font-black text-amber-950 uppercase">Mandatory 415V Lockout-Tagout (LOTO) Safety Protocol</h2>
            <p className="text-xs text-amber-800">Verify zero electrical energy before opening high-voltage drive enclosures.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {['Main 415V Isolator Switched OFF', 'Fluke 87V Zero Energy Verified', 'Red Padlock & Tag #98 Attached'].map((label, i) => (
            <label key={label} className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-amber-200 cursor-pointer">
              <input
                type="checkbox"
                checked={loto[i]}
                onChange={() => setLoto((prev) => prev.map((v, idx) => (idx === i ? !v : v)))}
                className="w-4 h-4 rounded text-orange-600"
              />
              <span className="font-bold text-slate-800">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2 text-xs">
        <h2 className="text-base font-display font-black text-slate-900">Reported Fault Details</h2>
        <p className="text-slate-700 leading-relaxed">{job.problemDescription}</p>
        <p className="font-mono text-slate-500">{[job.ownerAddress, job.ownerCity].filter(Boolean).join(', ')}</p>
        <a href={mapsLink} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 font-bold text-blue-600 hover:underline">
          <i className="fa-solid fa-map-location-dot"></i>
          Open Turn-by-Turn Navigation in Google Maps →
        </a>
      </section>

      {go.isError && <Notice tone="danger">{errorMessage(go.error)}</Notice>}

      {step === 'ENROUTE' && (
        <Step title="Start Dispatch Travel">
          <p className="text-xs text-slate-600">Once started, your live GPS broadcasts every 5 seconds to the owner&apos;s PostGIS radar.</p>
          <Button onClick={() => go.mutate('ENROUTE')} loading={go.isPending} className="bg-orange-500 hover:bg-orange-600">
            I Am En-Route Now
          </Button>
        </Step>
      )}
      {step === 'ARRIVE' && (
        <Step title="En-Route Telemetry Streaming">
          <p className="text-xs text-slate-600">Keep this console open while traveling. Tap below once inside the 500m factory gate.</p>
          <Button onClick={() => go.mutate('ARRIVE')} loading={go.isPending} className="bg-blue-600 hover:bg-blue-700">
            Confirm Arrival at Plant
          </Button>
        </Step>
      )}
      {step === 'OTP' && <OtpStep job={job} onDone={refresh} />}
      {step === 'COMPLETE' && <WorkStep job={job} onDone={refresh} />}
      {step === 'DONE' && (
        <>
          <Step title="Repair Completed & Billed">
            <p className="text-xs text-slate-700">
              Total billed <strong className="font-mono text-slate-900">{formatINR(job.totalAmount)}</strong> (Labour {formatINR(job.laborCharge)}, Parts{' '}
              {formatINR(job.partsCharge)}, GST {formatINR(job.gstAmount)}).
            </p>
            <p className="text-xs text-slate-500">Escrow settles directly to your verified UPI/Bank account upon owner release.</p>
          </Step>
          <RateOwner jobId={job.id} />
        </>
      )}
      {step === 'NONE' && <Notice tone="info">No action required right now (status: {job.status.toLowerCase().replace(/_/g, ' ')}).</Notice>}
    </div>
  );
}
