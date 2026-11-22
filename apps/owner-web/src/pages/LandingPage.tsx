import { useAuth } from '@uptime/shared';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicFooter, PublicHeader } from '../components/PublicHeaderFooter';
import type { SectorKind } from '../store/ownerStore';

const INDUSTRIES_DATA: Record<
  SectorKind,
  {
    label: string;
    icon: string;
    headline: string;
    desc: string;
    mttr: string;
    examples: string[];
    badgeColor: string;
  }
> = {
  INDUSTRIAL: {
    label: 'Industrial CNC & Machinery',
    icon: 'fa-industry',
    headline: 'Keep 415V CNC Spindles, Lathes & Presses Running 24/7',
    desc: 'Certified L2/L3 industrial specialists equipped with Fluke 87V CAT IV multimeters, OSHA 415V LOTO safety kits, and genuine SKF/Siemens spares.',
    mttr: '47 min avg MTTR',
    examples: ['Siemens Sinumerik 828D / 840D', 'Fanuc & Haas CNC Mills', 'Hydraulic Presses & Boilers', '3-Phase Servo & VFD Drives'],
    badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
  },
  AUTOMOTIVE: {
    label: 'Commercial Auto & EV Fleets',
    icon: 'fa-truck-moving',
    headline: 'Highway SOS & Depot Diagnostics for Diesel & EV Fleets',
    desc: 'Instant OBD-II fault scanning, BS-VI DEF injector service, battery thermal management, and roadside recovery across major freight corridors.',
    mttr: '38 min avg MTTR',
    examples: ['Tata Prima & Ashok Leyland BS-VI', 'BharatBenz Heavy Commercial', 'Commercial EV Delivery Vans', 'Electric Warehouse Forklifts'],
    badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  ELECTRONICS: {
    label: 'Cleanroom & Power Electronics',
    icon: 'fa-microchip',
    headline: 'Precision Power Protection for Server Rooms & SMT Lines',
    desc: 'Zero-downtime servicing for online UPS arrays, 3-phase transformers, harmonic filters, and automated cleanroom manufacturing equipment.',
    mttr: '44 min avg MTTR',
    examples: ['APC & Eaton 40–250kVA UPS', '3-Phase Power Transformers', 'SMT Pick-and-Place Lines', 'Power Factor Capacitor Banks'],
    badgeColor: 'text-cyan-700 bg-cyan-50 border-cyan-200',
  },
};

const TESTIMONIALS = [
  {
    quote: 'Our Siemens 828D spindle tripped mid-shift. UPTIME AI pinpointed the bearing seizure in 20 seconds and an L2 specialist arrived at Peenya Bay 2 in 11 minutes.',
    author: 'Rajeshwar Rao',
    role: 'Plant Director, Apex Precision Tools (Peenya)',
    metric: 'Saved ₹2.4L in shift downtime',
  },
  {
    quote: 'With 54 BS-VI trucks running daily, transparent escrow billing and 18% GST ITC invoices completely eliminated roadside repair fraud for our fleet.',
    author: 'Meenakshi Sundaram',
    role: 'VP Operations, Karnataka Logistics Hub',
    metric: '98.9% fleet uptime',
  },
  {
    quote: 'Digital Twin acoustic monitoring caught a capacitor bank drift 48 hours before our cleanroom UPS could fail. Preventive dispatch paid for our AMC ten times over.',
    author: 'Karthik Subramanian',
    role: 'Facilities Lead, Vidyut Cleanroom Systems',
    metric: 'Zero power outages in 14 months',
  },
];

export default function LandingPage() {
  const { status } = useAuth();
  const navigate = useNavigate();
  const signedIn = status === 'authenticated';

  const [heroSector, setHeroSector] = useState<SectorKind>('INDUSTRIAL');
  const [heroEquipment, setHeroEquipment] = useState('');
  const [heroProblem, setHeroProblem] = useState('');
  const [activeTab, setActiveTab] = useState<SectorKind>('INDUSTRIAL');
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  function goToProtectedFlow(
    targetPath: '/report' | '/ai-triage' | '/dashboard' | '/digital-twin' | '/protection' | '/wallet',
    reason: string,
  ) {
    const draft =
      heroEquipment.trim() || heroProblem.trim()
        ? { industry: heroSector, equipment: heroEquipment.trim(), description: heroProblem.trim() }
        : undefined;

    if (signedIn) {
      navigate(targetPath, { state: draft ? { draft } : undefined });
    } else {
      navigate('/login', { state: { from: targetPath, reason, draft } });
    }
  }

  function handleHeroSubmit(e: FormEvent) {
    e.preventDefault();
    goToProtectedFlow('/report', 'Sign in with your mobile number to book a verified technician for your equipment.');
  }

  const sectorInfo = INDUSTRIES_DATA[activeTab];
  const currentTestimonial = TESTIMONIALS[testimonialIdx];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* 1. HERO + QUICK INTERACTIVE BOOKING & AI TRIAGE WIDGET */}
        <section className="bg-slate-950 text-white border-b border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-live" aria-hidden="true"></span>
                15-MINUTE EMERGENCY DISPATCH SLA • BENGALURU &amp; CHENNAI CLUSTERS
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-display font-black tracking-tight leading-[1.08] text-white">
                Zero Unplanned Downtime.{' '}
                <span className="text-[#00D4AA]">Verified Engineers</span> on Site in Minutes.
              </h1>

              <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                Report a breakdown, run instant Gemini AI fault triage with 415V safety advisories, dispatch L0–L3 certified technicians, track live GPS arrival, and pay with 100% escrow protection &amp; 18% GST ITC invoices.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => goToProtectedFlow('/report', 'Sign in to report a breakdown and dispatch a verified specialist.')}
                  className="min-h-tap px-6 py-3.5 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-sm font-bold shadow-lg transition-colors cursor-pointer flex items-center gap-2"
                >
                  <i className="fa-solid fa-bolt" aria-hidden="true"></i>
                  <span>Book Emergency Technician</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToProtectedFlow('/ai-triage', 'Sign in to run Gemini 2.5 AI multimodal fault diagnostics on your asset.')}
                  className="min-h-tap px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-bold transition-colors cursor-pointer flex items-center gap-2"
                >
                  <i className="fa-solid fa-brain text-[#00D4AA]" aria-hidden="true"></i>
                  <span>Try AI Fault Triage</span>
                </button>
              </div>

              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80">
                <div>
                  <div className="text-2xl font-display font-black text-[#00D4AA]">11.4 min</div>
                  <div className="text-xs text-slate-400">Median arrival time</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-black text-white">98.4%</div>
                  <div className="text-xs text-slate-400">On-time SLA rate</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-black text-sky-400">2,840+</div>
                  <div className="text-xs text-slate-400">Certified engineers</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-black text-amber-400">100%</div>
                  <div className="text-xs text-slate-400">Escrow protected</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleHeroSubmit} className="rounded-3xl bg-white text-slate-900 p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-display font-black text-slate-900">Instant Breakdown Triage</h2>
                    <p className="text-xs text-slate-500">Describe what stopped working — get AI diagnosis or dispatch now.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold shrink-0">
                    LIVE 24/7
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">Select Sector</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'INDUSTRIAL', label: 'Industrial', icon: 'fa-industry' },
                        { id: 'AUTOMOTIVE', label: 'Fleet / Auto', icon: 'fa-truck-moving' },
                        { id: 'ELECTRONICS', label: 'Power / UPS', icon: 'fa-microchip' },
                      ] as const
                    ).map((sec) => (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => setHeroSector(sec.id)}
                        className={`py-2.5 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                          heroSector === sec.id
                            ? 'border-blue-600 bg-blue-50 text-blue-800'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <i className={`fa-solid ${sec.icon}`} aria-hidden="true"></i>
                        <span>{sec.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="hero-equip" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    Machine, Vehicle or Device
                  </label>
                  <input
                    id="hero-equip"
                    type="text"
                    value={heroEquipment}
                    onChange={(e) => setHeroEquipment(e.target.value)}
                    placeholder="e.g. Siemens 828D CNC, Tata Prima BS-VI, 40kVA UPS"
                    className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="hero-desc" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    Symptom or Error Code
                  </label>
                  <textarea
                    id="hero-desc"
                    rows={3}
                    value={heroProblem}
                    onChange={(e) => setHeroProblem(e.target.value)}
                    placeholder="e.g. Spindle vibration alarm F30002 above 4000 RPM..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => goToProtectedFlow('/ai-triage', 'Sign in to run Gemini AI Fault Triage and view repair cost estimates.')}
                    className="min-h-tap py-3 px-4 rounded-xl border border-slate-900 bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles text-[#00D4AA]" aria-hidden="true"></i>
                    <span>Run AI Triage</span>
                  </button>
                  <button
                    type="submit"
                    className="min-h-tap py-3 px-4 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-user-gear" aria-hidden="true"></i>
                    <span>Book Technician</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 text-center">
                  {signedIn
                    ? 'Signed in — your request dispatches directly from your plant account.'
                    : 'No upfront fee. You will sign in with OTP before confirming dispatch.'}
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* 2. HOW IT WORKS */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-4 sm:px-6 py-16 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-700">How UPTIME Works</span>
            <h2 className="text-3xl font-display font-black tracking-tight text-slate-900">From Breakdown to Running Again in 3 Steps</h2>
            <p className="text-sm text-slate-600">Built for factory floors, highway logistics, and critical server infrastructure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-mono font-black text-sm">
                01
              </div>
              <h3 className="text-base font-display font-extrabold text-slate-900">AI Multimodal Diagnosis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Describe the symptom, record machine noise, or enter the controller error code. Gemini AI delivers root-cause probability, 415V LOTO warnings, and cost bounds instantly.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#EA580C] border border-orange-200 flex items-center justify-center font-mono font-black text-sm">
                02
              </div>
              <h3 className="text-base font-display font-extrabold text-slate-900">40/60 Verified Specialist Match</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our PostGIS dispatch engine ranks KYC-verified L2/L3 engineers using 40% proximity + 60% OEM trade skill — excluding fatigued technicians automatically (ISO 45001).
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-mono font-black text-sm">
                03
              </div>
              <h3 className="text-base font-display font-extrabold text-slate-900">500m OTP Handover &amp; Escrow</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track arrival live on GPS, verify the 6-digit arrival code at your plant gate, pay via 100% protected Razorpay escrow, and receive a 30-day warranty + 18% GST ITC invoice.
              </p>
            </div>
          </div>
        </section>

        {/* 3. CORE PLATFORM FEATURES */}
        <section id="features" className="bg-white border-y border-slate-200 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl space-y-2">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-700">Complete Maintenance Operating System</span>
                <h2 className="text-3xl font-display font-black tracking-tight text-slate-900">Everything Your Plant &amp; Fleet Needs in One Portal</h2>
              </div>
              <button
                type="button"
                onClick={() => goToProtectedFlow('/dashboard', 'Sign in to access your plant operations dashboard.')}
                className="text-sm font-bold text-blue-700 hover:text-blue-900 cursor-pointer flex items-center gap-1.5"
              >
                <span>Open Operations Dashboard</span>
                <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: 'fa-brain text-purple-600 bg-purple-50',
                  title: 'Gemini AI Fault Triage & Copilot',
                  desc: 'Instant root-cause detection, step-by-step guided self-repair copilot, mandatory 415V electrical safety alerts, and upfront ₹ cost range.',
                  cta: 'Start AI Triage',
                  onClick: () => goToProtectedFlow('/ai-triage', 'Sign in to run Gemini AI Fault Triage on your equipment.'),
                },
                {
                  icon: 'fa-map-location-dot text-blue-600 bg-blue-50',
                  title: 'Live PostGIS GPS Tracking & OTP',
                  desc: 'Watch your assigned specialist approach in real time with ETA updates, 500m geofence arrival lock, and tamper-proof before/after handover evidence.',
                  cta: 'Book Technician',
                  onClick: () => goToProtectedFlow('/report', 'Sign in to book and track a verified field specialist.'),
                },
                {
                  icon: 'fa-wave-square text-emerald-600 bg-emerald-50',
                  title: 'Digital Twin & Acoustic FFT',
                  desc: 'Monitor spindle vibration spectrograms, subsystem health scores, and remaining useful life (RUL) to fix bearings before catastrophic failure.',
                  cta: 'View Digital Twin',
                  onClick: () => goToProtectedFlow('/digital-twin', 'Sign in to view your plant Digital Twin acoustic telemetry.'),
                },
                {
                  icon: 'fa-boxes-stacked text-orange-600 bg-orange-50',
                  title: 'OEM Spare Parts Store (60-Min)',
                  desc: 'Order QR-authenticated SKF bearings, Siemens 415V contactors, Bosch DEF injectors, and ABB VFDs with 60-minute cluster runner delivery.',
                  cta: 'Browse Spare Parts',
                  onClick: () => navigate('/marketplace'),
                },
                {
                  icon: 'fa-shield-halved text-indigo-600 bg-indigo-50',
                  title: '30-Day Warranty, Insurance & AMC',
                  desc: 'Every repair includes a 30-day warranty with zero-fee revisit claims, optional ₹15 micro-insurance (₹1L cover), and multi-plant AMC contracts.',
                  cta: 'View Protection Plans',
                  onClick: () => goToProtectedFlow('/protection', 'Sign in to view your warranties, claims, and AMC plans.'),
                },
                {
                  icon: 'fa-book-open text-cyan-600 bg-cyan-50',
                  title: '415V Repair Wiki & GST Escrow Wallet',
                  desc: 'Search verified Siemens/Fanuc wiring pinouts, pre-fund your corporate wallet for 1-click SOS dispatch, and download 18% GST ITC invoices.',
                  cta: 'Explore Repair Wiki',
                  onClick: () => navigate('/wiki'),
                },
              ].map((feat) => (
                <article key={feat.title} className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 flex flex-col justify-between gap-4 hover:border-blue-300 transition-colors">
                  <div className="space-y-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${feat.icon}`} aria-hidden="true">
                      <i className={`fa-solid ${feat.icon.split(' ')[0]}`}></i>
                    </div>
                    <h3 className="text-base font-display font-extrabold text-slate-900">{feat.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={feat.onClick}
                    className="self-start text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{feat.cta}</span>
                    <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true"></i>
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. INDUSTRIES TABS */}
        <section id="industries" className="mx-auto max-w-7xl px-4 sm:px-6 py-16 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-700">Specialized Verticals</span>
            <h2 className="text-3xl font-display font-black tracking-tight text-slate-900">Dedicated Specialists for Every Asset Class</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Industries">
            {(Object.keys(INDUSTRIES_DATA) as SectorKind[]).map((key) => {
              const item = INDUSTRIES_DATA[key];
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(key)}
                  className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                    active ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <i className={`fa-solid ${item.icon}`} aria-hidden="true"></i>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 p-7 sm:p-9 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm">
            <div className="lg:col-span-7 space-y-4">
              <span className={`inline-block px-3 py-1 rounded-full border font-mono text-xs font-bold ${sectorInfo.badgeColor}`}>
                {sectorInfo.mttr}
              </span>
              <h3 className="text-2xl font-display font-black text-slate-900">{sectorInfo.headline}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{sectorInfo.desc}</p>
              <button
                type="button"
                onClick={() => {
                  setHeroSector(activeTab);
                  goToProtectedFlow('/report', `Sign in to dispatch a certified ${sectorInfo.label} specialist.`);
                }}
                className="min-h-tap px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold cursor-pointer inline-flex items-center gap-2"
              >
                <span>Request {sectorInfo.label} Engineer</span>
                <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>
              </button>
            </div>
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sectorInfo.examples.map((ex) => (
                <div key={ex} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <i className="fa-solid fa-circle-check text-emerald-600 shrink-0" aria-hidden="true"></i>
                  <span>{ex}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. PRICING */}
        <section id="pricing" className="bg-white border-y border-slate-200 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-700">Transparent Pricing</span>
              <h2 className="text-3xl font-display font-black tracking-tight text-slate-900">Start Free or Lock Guaranteed 15-Minute SLAs</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-7 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="font-mono text-xs font-bold text-slate-500 uppercase">Pay-Per-Repair</div>
                  <div className="text-3xl font-display font-black text-slate-900">
                    ₹0 <span className="text-sm font-normal text-slate-500">/ month</span>
                  </div>
                  <p className="text-xs text-slate-600">Ideal for single-machine workshops and individual vehicle owners.</p>
                  <ul className="space-y-2 pt-3 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600" aria-hidden="true"></i>Free Gemini AI Fault Triage &amp; Copilot</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600" aria-hidden="true"></i>100% Escrow payment protection</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600" aria-hidden="true"></i>30-Day Repair Warranty on every job</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600" aria-hidden="true"></i>18% GST ITC invoices</li>
                  </ul>
                </div>
                <Link to="/signup" className="w-full py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-center text-xs font-bold text-slate-900">
                  Create Free Account
                </Link>
              </div>

              <div className="rounded-3xl border-2 border-blue-600 bg-slate-900 text-white p-7 flex flex-col justify-between space-y-6 shadow-xl">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#00D4AA] uppercase">UPTIME Pro Pass</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-mono text-[10px] font-bold">MOST POPULAR</span>
                  </div>
                  <div className="text-3xl font-display font-black">
                    ₹999 <span className="text-sm font-normal text-slate-400">/ month</span>
                  </div>
                  <p className="text-xs text-slate-300">Built for MSME factories and active commercial fleets.</p>
                  <ul className="space-y-2 pt-3 text-xs text-slate-200">
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#00D4AA]" aria-hidden="true"></i>₹0 Platform booking &amp; express runner fees</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#00D4AA]" aria-hidden="true"></i>Priority 15-Minute Emergency SOS SLA</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#00D4AA]" aria-hidden="true"></i>5 Free Digital Twin Acoustic FFT slots</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#00D4AA]" aria-hidden="true"></i>Pre-funded Corporate Wallet + 1-click dispatch</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => goToProtectedFlow('/wallet', 'Sign in to activate your 30-day free UPTIME Pro Pass trial.')}
                  className="w-full py-3 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold cursor-pointer"
                >
                  Start 30-Day Free Trial
                </button>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-7 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="font-mono text-xs font-bold text-slate-500 uppercase">Enterprise Multi-Plant AMC</div>
                  <div className="text-3xl font-display font-black text-slate-900">
                    Custom <span className="text-sm font-normal text-slate-500">/ plant</span>
                  </div>
                  <p className="text-xs text-slate-600">For multi-facility industrial estates and 50+ vehicle fleets.</p>
                  <ul className="space-y-2 pt-3 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600" aria-hidden="true"></i>Dedicated L3 cluster lead engineer</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600" aria-hidden="true"></i>Quarterly thermography &amp; acoustic audits</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600" aria-hidden="true"></i>Pre-stocked critical OEM spares at cluster depot</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600" aria-hidden="true"></i>PO-based Net-30 corporate billing</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => goToProtectedFlow('/protection', 'Sign in to configure multi-plant Annual Maintenance Contracts.')}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
                >
                  Configure AMC Plan
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. TESTIMONIALS */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-700">Verified Plant Outcomes</span>
                <h2 className="text-2xl font-display font-black text-slate-900 mt-1">Trusted Across Peenya, Whitefield &amp; E-City</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous testimonial"
                  onClick={() => setTestimonialIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                  className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer"
                >
                  <i className="fa-solid fa-chevron-left text-xs" aria-hidden="true"></i>
                </button>
                <span className="font-mono text-xs text-slate-500 px-1">
                  {testimonialIdx + 1} / {TESTIMONIALS.length}
                </span>
                <button
                  type="button"
                  aria-label="Next testimonial"
                  onClick={() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length)}
                  className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer"
                >
                  <i className="fa-solid fa-chevron-right text-xs" aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <blockquote className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed max-w-4xl">
              &ldquo;{currentTestimonial.quote}&rdquo;
            </blockquote>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div>
                <div className="text-sm font-display font-extrabold text-slate-900">{currentTestimonial.author}</div>
                <div className="text-xs text-slate-500">{currentTestimonial.role}</div>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold">
                {currentTestimonial.metric}
              </span>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
