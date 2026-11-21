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

/** Reads the browser's position once. */
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

/** While EN_ROUTE, sends the technician's position to the backend every 5 seconds. */
function useShareLocation(job: Job, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const sender = openLocationSender(env.wsUrl, job.id);
    let last: { lat: number; lng: number } | null = null;
    const watch = 'geolocation' in navigator ? navigator.geolocation.watchPosition((p) => (last = { lat: p.coords.latitude, lng: p.coords.longitude }), () => undefined, { enableHighAccuracy: true }) : -1;
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
    <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5">
      <h2 className="text-base font-semibold">{title}</h2>
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
    <Step title="Enter the owner's arrival code">
      <p className="text-sm text-fg-2">Ask the owner for the 6-digit code. You must be within 500 metres of the job.</p>
      <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
        {verify.isError && <Notice tone="danger">{errorMessage(verify.error)}</Notice>}
        <div className="w-48">
          <TextField label="Arrival code" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} error={err} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" loading={verify.isPending}>
            Verify and start
          </Button>
          {env.isDev && (
            <Button type="button" variant="secondary" onClick={(e) => submit(e, true)} disabled={verify.isPending}>
              Test mode: use the job's location
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
    if (summary.trim().length < 5) return setErr('Write a short note on the work done.');
    setErr(null);
    complete.mutate();
  }

  return (
    <>
      <Step title="Parts used (optional)">
        <form onSubmit={onAddPart} className="grid gap-3 sm:grid-cols-3" noValidate>
          <TextField label="Part" value={partName} onChange={(e) => setPartName(e.target.value)} />
          <TextField label="Quantity" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value.replace(/\D/g, ''))} />
          <TextField label="Price each (Rs)" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ''))} />
          <Button type="submit" variant="secondary" loading={addPart.isPending} className="self-start sm:col-span-3">
            Add part
          </Button>
        </form>
        {addPart.isError && <Notice tone="danger">{errorMessage(addPart.error)}</Notice>}
        {partsAdded.length > 0 && <p className="text-sm text-fg-2">Added: {partsAdded.join(', ')}</p>}
      </Step>
      <Step title="Finish the job">
        <form onSubmit={onComplete} className="flex flex-col gap-3" noValidate>
          {err && <Notice tone="danger">{err}</Notice>}
          {complete.isError && <Notice tone="danger">{errorMessage(complete.error)}</Notice>}
          <div className="w-48">
            <TextField label="Labour charge (Rs)" inputMode="decimal" value={labor} onChange={(e) => setLabor(e.target.value.replace(/[^\d.]/g, ''))} />
          </div>
          <TextField label="What did you do?" placeholder="Replaced the worn belt and tested" value={summary} onChange={(e) => setSummary(e.target.value)} />
          <p className="text-xs text-fg-muted">GST is added automatically. The job is locked once you finish.</p>
          <Button type="submit" loading={complete.isPending} className="self-start">
            Mark job complete
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
    <Step title="Rate the owner">
      {send.isSuccess ? (
        <Notice tone="success">Thanks. Your rating is sealed until the owner rates you too.</Notice>
      ) : (
        <>
          <div role="radiogroup" aria-label="Stars" className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" role="radio" aria-checked={stars === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => setStars(n)} className={`min-h-tap min-w-tap rounded-lg border text-xl ${n <= stars ? 'border-brand bg-brand text-on-brand' : 'border-line-strong text-fg-2'}`}>
                ★
              </button>
            ))}
          </div>
          {send.isError && <Notice tone="danger">{errorMessage(send.error)}</Notice>}
          <Button onClick={() => send.mutate()} disabled={stars === 0} loading={send.isPending} className="self-start">
            Send rating
          </Button>
        </>
      )}
    </Step>
  );
}

/** The technician's side of one job, one step at a time. */
export default function JobWorkPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const jobId = Number(id);
  const valid = Number.isInteger(jobId) && jobId > 0;
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
  if (q.isPending) return <p className="text-fg-2" role="status">Loading the job...</p>;
  if (q.isError) {
    return (
      <div className="flex flex-col items-start gap-3">
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

      <section className="rounded-xl border border-line bg-surface p-5 text-sm">
        <h2 className="text-base font-semibold">The problem</h2>
        <p className="mt-1">{job.problemDescription}</p>
        <p className="mt-1 text-fg-2">{[job.ownerAddress, job.ownerCity].filter(Boolean).join(', ')}</p>
        <a href={mapsLink} target="_blank" rel="noreferrer" className="mt-2 inline-block font-semibold text-brand-ink underline">
          Directions in Google Maps
        </a>
      </section>

      {go.isError && <Notice tone="danger">{errorMessage(go.error)}</Notice>}

      {step === 'ENROUTE' && (
        <Step title="Start your trip">
          <p className="text-sm text-fg-2">The owner will see you on the way.</p>
          <Button onClick={() => go.mutate('ENROUTE')} loading={go.isPending} className="self-start">
            I am on my way
          </Button>
        </Step>
      )}
      {step === 'ARRIVE' && (
        <Step title="On the way">
          <p className="text-sm text-fg-2">Keep this page open so your position is shared with the owner.</p>
          <Button onClick={() => go.mutate('ARRIVE')} loading={go.isPending} className="self-start">
            I have arrived
          </Button>
        </Step>
      )}
      {step === 'OTP' && <OtpStep job={job} onDone={refresh} />}
      {step === 'COMPLETE' && <WorkStep job={job} onDone={refresh} />}
      {step === 'DONE' && (
        <>
          <Step title="Job complete">
            <p className="text-sm">
              Total billed <strong>{formatINR(job.totalAmount)}</strong> (labour {formatINR(job.laborCharge)}, parts {formatINR(job.partsCharge)}, GST {formatINR(job.gstAmount)}).
            </p>
            <p className="text-sm text-fg-2">The owner pays from their app. You are available for new jobs again.</p>
          </Step>
          <RateOwner jobId={job.id} />
        </>
      )}
      {step === 'NONE' && <Notice tone="info">Nothing to do on this job right now (status: {job.status.toLowerCase().replace(/_/g, ' ')}).</Notice>}
    </div>
  );
}
