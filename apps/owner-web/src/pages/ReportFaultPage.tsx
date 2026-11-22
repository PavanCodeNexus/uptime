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
import { Link, useNavigate } from 'react-router-dom';
import { http } from '../lib/api';

type Coords = { lat: number; lng: number };

const DEMO_DIAGNOSIS: DiagnosisResult = {
  predictedCause: 'High-Frequency Spindle Bearing Seizure (SKF 7210 ACD) with 415V thermal load drift',
  confidenceScore: 94.2,
  severity: 'CRITICAL',
  diyPossible: false,
  estimatedDurationMin: 45,
  estimatedCostMin: 8000,
  estimatedCostMax: 12000,
  recommendedPath: 'FIELD_TECH',
  safetyWarnings: [
    'MANDATORY 415V LOTO: Isolate primary 3-phase breaker before opening drive enclosure.',
    'Wait 5 minutes for DC link capacitor discharge before inspection.',
  ],
  fallbackUsed: true,
};

/** Figma W07: Multimodal Breakdown & SOS Reporting Studio — 100% live backend wired with Demo fallback. */
export default function ReportFaultPage() {
  const navigate = useNavigate();
  const { user, isDemo } = useAuth();

  const [industry, setIndustry] = useState<string>(normalizeIndustry(user?.industryPreference) ?? 'INDUSTRIAL');
  const [equipment, setEquipment] = useState(isDemo ? 'Siemens Sinumerik 828D CNC Spindle' : '');
  const [description, setDescription] = useState(
    isDemo ? 'Abnormal 84.2 dB metallic grinding from main spindle bearing above 4000 RPM with 415V drive overcurrent alarm.' : '',
  );
  const [urgency, setUrgency] = useState(isDemo ? 'CRITICAL' : 'NORMAL');
  const [address, setAddress] = useState(isDemo ? 'Peenya Industrial Estate, Phase 2, Bay 2' : '');
  const [city, setCity] = useState(isDemo ? 'Bengaluru' : '');
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locNote, setLocNote] = useState<string | null>(null);
  const [path, setPath] = useState<ResolutionPath>('DIRECT_BOOKING');
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);

  const diagnose = useMutation({
    mutationFn: async () => {
      if (isDemo) return DEMO_DIAGNOSIS;
      return aiApi.diagnose(http, industry, description.trim());
    },
    onSuccess: (d) => {
      setDiagnosis(d);
      const suggested = pathFromRecommendation(d.recommendedPath);
      const ok = RESOLUTION_PATHS.find((p) => p.value === suggested && p.available);
      if (ok) setPath(ok.value);
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      if (isDemo) return null;
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
      saveArrivalCode(res.job.id, res.arrivalOtpPlaintextForOwner);
      try {
        await jobsApi.choosePath(http, res.job.id, path);
      } catch {
        // Job exists; detail page displays live status.
      }
      return res.job.id;
    },
    onSuccess: (id) => {
      if (id === null) {
        navigate('/select-technician');
      } else {
        navigate(`/jobs/${id}`);
      }
    },
  });

  function useMyLocation() {
    setLocNote(null);
    if (!('geolocation' in navigator)) return setLocNote('This browser cannot share a location. Type your address instead.');
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setCoords({ lat: p.coords.latitude, lng: p.coords.longitude });
        setLocNote('GPS coordinates locked. Specialists within 15 km will be ranked via 40/60 scoring.');
      },
      () => setLocNote('Location permission denied. Type your plant address and city instead.'),
      { timeout: 10000 },
    );
  }

  function validate(): string | null {
    if (equipment.trim().length < 2) return 'Tell us what needs fixing (for example, "Siemens Sinumerik 828D" or "Maruti Swift 2018").';
    if (description.trim().length < 10) return 'Describe the fault in a few more words (at least 10 characters).';
    if (!city.trim() && !coords) return 'Share your GPS location or enter your city.';
    return null;
  }

  function onFirstLook() {
    if (description.trim().length < 10) return setFormError('Describe the problem in at least 10 characters first.');
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
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {/* Top Figma Dark Banner */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-[10px] font-bold">
              W07 • MULTIMODAL SOS DESK
            </span>
            <span className="font-mono text-xs text-emerald-400 font-bold">15-MINUTE EMERGENCY SLA</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-black tracking-tight">Report Machine Breakdown &amp; Fault Triage</h1>
          <p className="text-xs text-slate-300">Describe the failure, run Gemini AI Multimodal Triage, and dispatch a verified L2/L3 engineer.</p>
        </div>
        <Link to="/ai-diagnosis" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white">
          Preview AI Triage (W08) →
        </Link>
      </div>

      {formError && <Notice tone="danger">{formError}</Notice>}
      {submit.isError && <Notice tone="danger">{errorMessage(submit.error)}</Notice>}

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left 7 Cols: Breakdown Form */}
        <section className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5" aria-labelledby="what-h">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 id="what-h" className="text-base font-display font-black text-slate-900">
              1. Asset &amp; Fault Telemetry
            </h2>
            <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">POST /api/v1/jobs</span>
          </div>

          {/* Sector Chips */}
          <div className="space-y-2">
            <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">Operating Sector</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Industry">
              {INDUSTRIES.map((i) => {
                const selected = industry === i.value;
                return (
                  <button
                    key={i.value}
                    type="button"
                    onClick={() => setIndustry(i.value)}
                    aria-pressed={selected}
                    className={`min-h-tap px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                      selected ? 'border-blue-600 bg-blue-600 text-white shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {i.label}
                  </button>
                );
              })}
            </div>
          </div>

          <TextField
            label="Machine / Fleet Equipment"
            placeholder="e.g. Siemens Sinumerik 828D CNC, or Maruti Swift 2018 diesel"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="desc" className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Fault Symptoms &amp; Error Codes
              </label>
              <button
                type="button"
                onClick={() => setVoiceActive((v) => !v)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold flex items-center gap-1.5 ${
                  voiceActive ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <i className="fa-solid fa-microphone"></i>
                <span>{voiceActive ? 'Listening (Bhashini 9-Lang)...' : 'Voice / Acoustic Capture'}</span>
              </button>
            </div>
            <textarea
              id="desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe abnormal noise, vibration frequency, error codes, or voltage faults..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
            />
          </div>

          {/* Urgency Selector */}
          <div className="space-y-2">
            <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">Dispatch Priority / SLA Tier</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="group" aria-label="Urgency">
              {URGENCIES.map((u) => {
                const selected = urgency === u.value;
                const isSos = u.value === 'CRITICAL';
                return (
                  <button
                    key={u.value}
                    type="button"
                    onClick={() => setUrgency(u.value)}
                    aria-pressed={selected}
                    className={`min-h-tap p-3 rounded-2xl border-2 text-left transition-all ${
                      selected
                        ? isSos
                          ? 'border-rose-600 bg-rose-50 text-rose-900'
                          : 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="text-xs font-extrabold">{u.label}</div>
                    <div className="text-[10px] font-mono opacity-75">{isSos ? '15-Min Guaranteed SLA' : 'Scheduled Dispatch'}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plant / Breakdown Location */}
          <div className="pt-3 border-t border-slate-100 space-y-4">
            <h2 className="text-base font-display font-black text-slate-900">2. Plant / Breakdown Location</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Plant Bay / Address (optional)" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} />
              <TextField label="City / Industrial Cluster" autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" onClick={useMyLocation}>
                <i className="fa-solid fa-location-crosshairs text-blue-600"></i>
                Use GPS Location
              </Button>
              {coords && (
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 font-mono text-[11px] font-bold text-emerald-700">
                  ✓ {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </span>
              )}
            </div>
            {locNote && <p className="text-xs font-medium text-slate-600">{locNote}</p>}
          </div>
        </section>

        {/* Right 5 Cols: Gemini AI First Look + Resolution Path & Submit */}
        <aside className="lg:col-span-5 space-y-5">
          {/* Gemini AI Multimodal Triage Card */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900 text-white p-6 shadow-xl space-y-4" aria-labelledby="ai-h">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white text-sm">
                  <i className="fa-solid fa-brain"></i>
                </span>
                <div>
                  <h2 id="ai-h" className="text-sm font-display font-extrabold">
                    Gemini 2.5 AI First Look
                  </h2>
                  <div className="text-[10px] font-mono text-purple-300">MULTIMODAL FAULT TRIAGE</div>
                </div>
              </div>
              {diagnosis?.fallbackUsed && <SampleBadge />}
            </div>

            {!diagnosis && (
              <p className="text-xs text-slate-300 leading-relaxed">
                Run instant AI diagnostics to identify root cause probability, 415V safety advisories, and transparent ₹ repair cost bounds before booking.
              </p>
            )}
            {diagnose.isError && <Notice tone="danger">{errorMessage(diagnose.error)}</Notice>}

            {diagnosis && (
              <div className="space-y-3 rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    {Math.round(diagnosis.confidenceScore)}% CONFIDENCE
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold uppercase">
                    {String(diagnosis.severity)}
                  </span>
                </div>
                <p className="font-bold text-white text-sm leading-snug">{diagnosis.predictedCause}</p>
                {diagnosis.estimatedCostMax > 0 && (
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between font-mono">
                    <span className="text-slate-400">Est. Repair Cost</span>
                    <span className="font-black text-[#00D4AA]">
                      {formatINR(diagnosis.estimatedCostMin)} – {formatINR(diagnosis.estimatedCostMax)}
                    </span>
                  </div>
                )}
                {diagnosis.safetyWarnings?.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 space-y-1">
                    <div className="font-mono text-[10px] font-bold uppercase text-amber-300">
                      <i className="fa-solid fa-triangle-exclamation mr-1"></i>LOTO Safety Advisory
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                      {diagnosis.safetyWarnings.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={onFirstLook}
              disabled={diagnose.isPending}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-60"
            >
              {diagnose.isPending ? 'Analyzing Telemetry...' : diagnosis ? 'Re-Run Gemini AI Triage' : 'Run Gemini AI First Look'}
            </button>
          </section>

          {/* Resolution Path & Dispatch CTA */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4" aria-labelledby="how-h">
            <h2 id="how-h" className="text-base font-display font-black text-slate-900">
              3. Resolution Path
            </h2>
            <div className="space-y-2.5">
              {RESOLUTION_PATHS.map((p) => (
                <label
                  key={p.value}
                  className={`flex min-h-tap cursor-pointer items-start gap-3 rounded-2xl border-2 p-3.5 transition-all ${
                    path === p.value ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                  } ${p.available ? '' : 'cursor-not-allowed opacity-55'}`}
                >
                  <input type="radio" name="path" className="mt-1" checked={path === p.value} disabled={!p.available} onChange={() => setPath(p.value)} />
                  <span>
                    <span className="block text-xs font-extrabold text-slate-900">{p.label}</span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      {p.value === 'DIRECT_BOOKING' && 'A verified L2/L3 specialist dispatches to your plant with 100% escrow protection.'}
                      {p.value === 'AI_COPILOT' && 'Step-by-step guided self-repair protocol powered by Gemini RAG.'}
                      {p.value === 'VIDEO_CONSULT' && 'Remote AR video tele-repair (Wave 3).'}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={submit.isPending}
              className="w-full min-h-tap py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-display font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              <i className="fa-solid fa-paper-plane"></i>
              <span>{submit.isPending ? 'Dispatching...' : path === 'AI_COPILOT' ? 'Start AI Guided Copilot' : 'Dispatch Verified Specialist Now'}</span>
            </button>
          </section>
        </aside>
      </div>
    </form>
  );
}
