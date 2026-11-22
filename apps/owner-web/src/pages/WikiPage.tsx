import { useAuth } from '@uptime/shared';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface WikiArticle {
  id: string;
  code: string;
  title: string;
  oem: string;
  voltage: string;
  upvotes: number;
  summary: string;
  lotoSteps: string[];
  pinouts: { terminal: string; signal: string; expected: string }[];
  remedy: string;
}

const ARTICLES: WikiArticle[] = [
  {
    id: 'siemens-828d',
    code: 'F30002',
    title: 'Siemens Sinumerik 828D Spindle Drive 415V Overvoltage & Bearing Check',
    oem: 'Siemens',
    voltage: '415V 3-Phase',
    upvotes: 64,
    summary: 'Diagnostic pinout, DC link discharge procedure, and bearing thermal signature checklist for SINAMICS S120 spindle modules.',
    lotoSteps: [
      'Turn main 415V rotary isolator OFF and apply red personal padlock + danger tag.',
      'Wait minimum 5 minutes for DC link capacitor bleed-down.',
      'Measure L1-L2, L2-L3, L3-L1 and DC+ to DC− with CAT IV 600V multimeter to verify 0V.',
    ],
    pinouts: [
      { terminal: 'U2 / V2 / W2', signal: '3-Phase Spindle Motor Output', expected: 'Balanced 0.8 Ω phase-to-phase' },
      { terminal: 'X21.1 – X21.2', signal: 'PTC Spindle Thermal Sensor', expected: '< 100 Ω cold / > 1.6 kΩ trip' },
      { terminal: 'DC+ / DC−', signal: '600V DC Link Bus', expected: '560–620 VDC nominal running' },
    ],
    remedy: 'If phase resistance is balanced but acoustic FFT spikes above 78 dB at 4 kHz, replace SKF 7210 ACD angular-contact bearings before drive IGBT damage occurs.',
  },
  {
    id: 'tata-bs6-def',
    code: 'DTC P20EE',
    title: 'Tata Prima / BharatBenz BS-VI SCR NOx & DEF Dosing Injector Troubleshooting',
    oem: 'Tata / Bosch',
    voltage: '24V Commercial DC',
    upvotes: 49,
    summary: 'Step-by-step AdBlue urea crystallization flush and dosing nozzle impedance check for highway limp-mode recovery.',
    lotoSteps: [
      'Park vehicle on level ground, apply wheel chocks, and isolate 24V master battery disconnect.',
      'Confirm exhaust SCR catalyst skin temperature is below 50°C.',
    ],
    pinouts: [
      { terminal: 'Pin 1 / Pin 2', signal: 'Bosch DEF Dosing Solenoid', expected: '11.5–13.5 Ω at 25°C' },
      { terminal: 'CAN-H / CAN-L', signal: 'Downstream NOx Sensor Bus', expected: '60 Ω termination across bus' },
    ],
    remedy: 'Inspect dosing nozzle tip for white urea crystal deposits. Flush with deionized warm water or swap OEM Bosch 0444021024 injector and run OBD-II forced regeneration.',
  },
  {
    id: 'apc-ups-cap',
    code: 'UPS-DC-RIPPLE',
    title: 'APC Symmetra PX 40kVA Cleanroom UPS DC Bus Ripple & Capacitor Inspection',
    oem: 'Schneider / APC',
    voltage: '415V In / 230V Out',
    upvotes: 37,
    summary: 'Safe Maintenance Bypass transfer sequence and ESR measurement thresholds for 440V power factor & DC bus capacitors.',
    lotoSteps: [
      'Confirm cleanroom server load is transferred cleanly to External Maintenance Bypass (Q3 closed).',
      'Open UPS input (Q1), output (Q2), and DC battery breaker strings; verify 0V DC.',
    ],
    pinouts: [
      { terminal: 'Bus + / N', signal: 'Rectifier DC Bus Ripple', expected: '< 2.0% RMS ripple voltage' },
      { terminal: 'THD-V Out', signal: 'Cleanroom Output Distortion', expected: '< 3.0% total harmonic distortion' },
    ],
    remedy: 'Replace swollen or high-ESR EPCOS capacitors in matched phase banks and run 80% load-bank validation before returning from bypass.',
  },
];

export default function WikiPage() {
  const { status } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(ARTICLES[0].id);

  const signedIn = status === 'authenticated';
  const filtered = ARTICLES.filter((a) => {
    const q = search.trim().toLowerCase();
    return !q || a.title.toLowerCase().includes(q) || a.code.toLowerCase().includes(q) || a.oem.toLowerCase().includes(q);
  });
  const active = ARTICLES.find((a) => a.id === selectedId) ?? filtered[0] ?? ARTICLES[0];

  function requestSpecialist() {
    const draft = {
      industry: active.oem.includes('Tata') ? 'AUTOMOTIVE' : active.oem.includes('APC') ? 'ELECTRONICS' : 'INDUSTRIAL',
      equipment: active.title,
      description: `Error code ${active.code} referenced from UPTIME Repair Wiki. Need certified specialist verification.`,
    };
    if (signedIn) {
      navigate('/report', { state: { draft } });
    } else {
      navigate('/login', { state: { from: '/report', reason: `Sign in to dispatch a certified specialist for ${active.code}.`, draft } });
    }
  }

  const content = (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black tracking-tight text-slate-900">Field Repair Wiki &amp; 415V Schematics</h1>
          <p className="text-xs text-slate-500 mt-0.5">Peer-reviewed by L3 Master Engineers • Error code solvers, terminal pinouts, and OSHA LOTO safety guides.</p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search error code (e.g. F30002, P20EE)..."
          className="min-h-[42px] w-full sm:w-72 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-2.5">
          {filtered.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelectedId(a.id)}
              className={`w-full p-4 rounded-2xl border-2 text-left space-y-1.5 cursor-pointer transition-colors ${
                active.id === a.id ? 'border-blue-600 bg-white shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-[#00D4AA] font-bold">{a.code}</span>
                <span className="text-slate-500">{a.oem}</span>
              </div>
              <div className="text-xs font-display font-extrabold text-slate-900">{a.title}</div>
              <div className="text-[11px] text-slate-500">{a.voltage} • +{a.upvotes} L3 Verified</div>
            </button>
          ))}
        </div>

        <article className="lg:col-span-8 rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="px-2.5 py-0.5 rounded bg-slate-900 text-[#00D4AA] font-bold">{active.code}</span>
                <span className="text-slate-500">{active.voltage}</span>
              </div>
              <h2 className="text-xl font-display font-black text-slate-900">{active.title}</h2>
              <p className="text-xs text-slate-600">{active.summary}</p>
            </div>
            <button
              type="button"
              onClick={requestSpecialist}
              className="px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold cursor-pointer shrink-0"
            >
              Book Specialist for {active.code}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="font-mono text-[11px] font-bold uppercase text-amber-900">
              <i className="fa-solid fa-lock mr-1.5" aria-hidden="true"></i>Mandatory Lockout-Tagout (LOTO) Steps
            </div>
            <ol className="list-decimal pl-5 text-xs text-amber-950 space-y-1">
              {active.lotoSteps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-display font-black text-slate-900">Terminal Pinout &amp; Test Thresholds</h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-200 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Terminal</th>
                    <th className="p-3">Circuit / Signal</th>
                    <th className="p-3">Expected Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {active.pinouts.map((p) => (
                    <tr key={p.terminal}>
                      <td className="p-3 font-mono font-bold text-blue-700">{p.terminal}</td>
                      <td className="p-3 font-semibold text-slate-900">{p.signal}</td>
                      <td className="p-3 font-mono text-emerald-700">{p.expected}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <strong className="text-slate-900">Recommended Engineering Remedy:</strong> {active.remedy}
          </div>
        </article>
      </div>
    </div>
  );

  return content;
}
