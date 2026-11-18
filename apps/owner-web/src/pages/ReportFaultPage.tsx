import {
  aiApi,
  Button,
  errorMessage,
  formatINR,
  INDUSTRIES,
  jobsApi,
  normalizeIndustry,
  Notice,
  pathFromRecommendation,
  RESOLUTION_PATHS,
  SampleBadge,
  saveArrivalCode,
  TextField,
  URGENCIES,
  useAuth,
  type DiagnosisResult,
  type ResolutionPath,
} from '@uptime/shared';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../lib/api';

type Coords = { lat: number; lng: number };

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-tap rounded-full border px-4 text-sm font-medium ${selected ? 'border-brand bg-brand text-on-brand' : 'border-line-strong bg-surface text-fg-2'}`}
    >
      {children}
    </button>
  );
}

/** "Report a fault": describe the problem, get an AI first look, choose how to be helped, create the job. */
export default function ReportFaultPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [industry, setIndustry] = useState<string>(normalizeIndustry(user?.industryPreference) ?? 'AUTOMOTIVE');
  const [equipment, setEquipment] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('NORMAL');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locNote, setLocNote] = useState<string | null>(null);
  const [path, setPath] = useState<ResolutionPath>('DIRECT_BOOKING');
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const diagnose = useMutation({
    mutationFn: () => aiApi.diagnose(http, industry, description.trim()),
    onSuccess: (d) => {
      setDiagnosis(d);
      const suggested = pathFromRecommendation(d.recommendedPath);
      const ok = RESOLUTION_PATHS.find((p) => p.value === suggested && p.available);
      if (ok) setPath(ok.value);
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      const min = diagnosis?.estimatedCostMin;
      const max = diagnosis?.estimatedCostMax;
      const res = await jobsApi.create(http, {
        industry,
        equipmentSummary: equipment.trim(),
        problemDescription: description.trim(),
        urgency,
        resolutionPath: path,
        ownerAddress: address.trim() || undefined,
        ownerCity: city.trim() || undefined,
        ...(coords ? { ownerLat: coords.lat, ownerLng: coords.lng } : {}),
        ...(min && max && max >= min ? { estimatedCostMin: min, estimatedCostMax: max } : {}),
      });
      // The arrival code is shown only now. Keep it on this device before anything else can fail.
      saveArrivalCode(res.job.id, res.arrivalOtpPlaintextForOwner);
      try {
        await jobsApi.choosePath(http, res.job.id, path);
      } catch {
        // The job exists; the detail page shows its real status and the owner can continue from there.
      }
      return res.job.id;
    },
    onSuccess: (id) => navigate(`/jobs/${id}`),
  });

  function useMyLocation() {
    setLocNote(null);
    if (!('geolocation' in navigator)) return setLocNote('This browser cannot share a location. Type your address instead.');
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setCoords({ lat: p.coords.latitude, lng: p.coords.longitude });
        setLocNote('Location saved. Technicians nearby will be matched.');
      },
      () => setLocNote('Location was not shared. Type your address and city instead.'),
      { timeout: 10000 },
    );
  }

  function validate(): string | null {
    if (equipment.trim().length < 2) return 'Tell us what needs fixing (for example, "Maruti Swift 2018").';
    if (description.trim().length < 10) return 'Describe the problem in a few more words (at least 10 letters).';
    if (!city.trim() && !coords) return 'Share your location or type your city.';
    return null;
  }

  function onFirstLook() {
    if (description.trim().length < 10) return setFormError('Describe the problem in a few more words first.');
    setFormError(null);
    diagnose.mutate();
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    setFormError(err);
    if (!err) submit.mutate();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Report a fault</h1>
        <p className="mt-1 text-fg-2">Tell us what stopped working. It takes about a minute.</p>
      </div>

      {formError && <Notice tone="danger">{formError}</Notice>}
      {submit.isError && <Notice tone="danger">{errorMessage(submit.error)}</Notice>}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="flex flex-col gap-5 rounded-xl border border-line bg-surface p-5" aria-labelledby="what-h">
          <h2 id="what-h" className="text-base font-semibold">
            What needs fixing?
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Industry">
            {INDUSTRIES.map((i) => (
              <Chip key={i.value} selected={industry === i.value} onClick={() => setIndustry(i.value)}>
                {i.label}
              </Chip>
            ))}
          </div>
          <TextField label="Equipment or vehicle" placeholder="e.g. Maruti Swift 2018, diesel" value={equipment} onChange={(e) => setEquipment(e.target.value)} />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="desc" className="text-sm font-medium text-fg-2">
              Describe the problem
            </label>
            <textarea
              id="desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Engine cranks but will not start since this morning..."
              className="rounded-lg border border-line-strong bg-surface px-3 py-2 text-base text-fg placeholder:text-fg-muted"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-fg-2">How urgent is it?</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Urgency">
              {URGENCIES.map((u) => (
                <Chip key={u.value} selected={urgency === u.value} onClick={() => setUrgency(u.value)}>
                  {u.label}
                </Chip>
              ))}
            </div>
          </div>

          <h2 className="pt-2 text-base font-semibold">Where is it?</h2>
          <TextField label="Address (optional)" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <TextField label="City" autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} />
          <div className="flex flex-col gap-2">
            <Button variant="secondary" onClick={useMyLocation} className="self-start">
              Use my location
            </Button>
            {locNote && <p className="text-sm text-fg-2">{locNote}</p>}
            {!coords && <p className="text-xs text-fg-muted">Without a shared location, matching uses a default point on the dev backend.</p>}
          </div>

          <div className="rounded-lg border border-dashed border-line-strong bg-surface-2 p-4 text-center text-sm text-fg-muted">
            Photo upload arrives in a later phase.
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5" aria-labelledby="ai-h">
            <div className="flex items-center justify-between gap-2">
              <h2 id="ai-h" className="text-base font-semibold">
                AI first look
              </h2>
              {diagnosis?.fallbackUsed && <SampleBadge />}
            </div>
            {!diagnosis && <p className="text-sm text-fg-2">Get a quick idea of the likely cause and cost before you decide.</p>}
            {diagnose.isError && <Notice tone="danger">{errorMessage(diagnose.error)}</Notice>}
            {diagnosis && (
              <div className="flex flex-col gap-2 text-sm">
                <p className="text-fg">{diagnosis.predictedCause}</p>
                <p className="text-fg-2">
                  Confidence {Math.round(diagnosis.confidenceScore)}% &middot; Severity {String(diagnosis.severity).toLowerCase()}
                </p>
                {diagnosis.estimatedCostMax > 0 && (
                  <p className="text-fg-2">
                    Estimated cost {formatINR(diagnosis.estimatedCostMin)} to {formatINR(diagnosis.estimatedCostMax)}
                  </p>
                )}
                {diagnosis.safetyWarnings?.length > 0 && (
                  <ul className="list-disc pl-5 text-warning">
                    {diagnosis.safetyWarnings.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <Button variant="secondary" onClick={onFirstLook} loading={diagnose.isPending}>
              {diagnosis ? 'Check again' : 'Get AI first look'}
            </Button>
          </section>

          <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5" aria-labelledby="how-h">
            <h2 id="how-h" className="text-base font-semibold">
              How should we help?
            </h2>
            {RESOLUTION_PATHS.map((p) => (
              <label
                key={p.value}
                className={`flex min-h-tap cursor-pointer items-start gap-3 rounded-lg border p-3 ${path === p.value ? 'border-brand bg-surface-2' : 'border-line'} ${p.available ? '' : 'cursor-not-allowed opacity-60'}`}
              >
                <input type="radio" name="path" className="mt-1" checked={path === p.value} disabled={!p.available} onChange={() => setPath(p.value)} />
                <span>
                  <span className="block text-sm font-semibold">{p.label}</span>
                  <span className="block text-xs text-fg-muted">
                    {p.value === 'DIRECT_BOOKING' && 'A verified technician visits you.'}
                    {p.value === 'AI_COPILOT' && 'Step-by-step guide to try yourself, free.'}
                    {p.value === 'VIDEO_CONSULT' && 'Coming soon.'}
                  </span>
                </span>
              </label>
            ))}
            <Button type="submit" loading={submit.isPending}>
              {path === 'AI_COPILOT' ? 'Start AI copilot' : 'Find a technician'}
            </Button>
          </section>
        </aside>
      </div>
    </form>
  );
}
