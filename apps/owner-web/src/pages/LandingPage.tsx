import { UptimeEmblem, useAuth } from '@uptime/shared';
import { Link, useNavigate } from 'react-router-dom';

/** Figma W01: Public Enterprise Landing & Hero Portal (directly accessible at /). */
export default function LandingPage() {
  const { status, session } = useAuth();
  const navigate = useNavigate();

  function openWorkspace(target: string) {
    if (status !== 'authenticated') {
      session.enterDemo();
    }
    navigate(target);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Public Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 shadow-sm">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <UptimeEmblem size="md" accent="teal" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-display font-black tracking-tight text-slate-900">UPTIME</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-extrabold">
                  OWNER WEB • 44 SCREENS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Enterprise Factory, Fleet &amp; Power Electronics Maintenance OS
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openWorkspace('/gallery')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <i className="fa-solid fa-table-cells-large text-blue-600"></i>
              <span>Browse All 44 Screens</span>
            </button>
            <Link
              to="/login"
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold transition-all"
            >
              Sign In (W02)
            </Link>
            <Link
              to="/signup"
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              Register Plant (W03)
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        {/* Figma W01 Hero Banner */}
        <section className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          <div className="flex flex-wrap items-center justify-between gap-2 z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-live"></span>
              15-MINUTE EMERGENCY SLA GUARANTEED
            </span>
            <span className="text-xs font-mono text-slate-400">ISO 9001:2015 CERTIFIED DISPATCH</span>
          </div>

          <div className="my-auto py-8 max-w-3xl space-y-4 z-10">
            <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white leading-tight">
              Downtime Ends Here. <span className="text-[#00D4AA]">Predict. Repair. Perform.</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              India&apos;s first specialized on-demand engineering network for Industrial CNC Machinery, Commercial Fleets, and Power Electronics.
              2,840 certified specialists available 24/7 with Gemini AI multimodal triage, Digital Twin FFT telemetry, and 100% escrow protection.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => openWorkspace('/report')}
                className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all"
              >
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>Report Machine Breakdown (SOS)</span>
              </button>
              <button
                type="button"
                onClick={() => openWorkspace('/dashboard')}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-2 transition-all"
              >
                <i className="fa-solid fa-gauge-high text-[#00D4AA]"></i>
                <span>Open Factory Dashboard (W06)</span>
              </button>
              <button
                type="button"
                onClick={() => openWorkspace('/digital-twin')}
                className="px-5 py-3.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 font-bold text-xs sm:text-sm border border-purple-400/30 flex items-center gap-2 transition-all"
              >
                <i className="fa-solid fa-satellite-dish"></i>
                <span>Digital Twin FFT (W23)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-slate-800 z-10 font-mono text-xs">
            <div>
              <div className="text-2xl font-black text-emerald-400">11.4 Mins</div>
              <div className="text-[11px] text-slate-400">Median Arrival Time</div>
            </div>
            <div>
              <div className="text-2xl font-black text-indigo-400">98.4%</div>
              <div className="text-[11px] text-slate-400">On-Time SLA Rate</div>
            </div>
            <div>
              <div className="text-2xl font-black text-sky-400">2,840</div>
              <div className="text-[11px] text-slate-400">Certified L0–L3 Techs</div>
            </div>
            <div>
              <div className="text-2xl font-black text-purple-400">42.8 Tons</div>
              <div className="text-[11px] text-slate-400">CO2 Saved (ESG)</div>
            </div>
          </div>
        </section>

        {/* 3 Sector Showcase Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <button
            type="button"
            onClick={() => openWorkspace('/machines')}
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-purple-500 hover:shadow-xl text-left space-y-3 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
              <i className="fa-solid fa-industry"></i>
            </div>
            <h2 className="text-base font-display font-extrabold text-slate-900">Industrial Machinery &amp; CNC</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Siemens, Fanuc, Haas, Mazak 415V CNCs, Hydraulic presses, Boilers, and Spindle Drives with acoustic FFT diagnostics.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600">
              Explore CNC Inventory (W14) <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </span>
          </button>

          <button
            type="button"
            onClick={() => openWorkspace('/vehicles')}
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-xl text-left space-y-3 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
              <i className="fa-solid fa-truck-moving"></i>
            </div>
            <h2 className="text-base font-display font-extrabold text-slate-900">Commercial Auto &amp; EV Fleets</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tata, Ashok Leyland, BharatBenz BS-VI diesel &amp; EV delivery fleets with OBD-II fault logs and highway roadside SOS.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600">
              Explore Fleet Console (W17) <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </span>
          </button>

          <button
            type="button"
            onClick={() => openWorkspace('/devices')}
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-cyan-500 hover:shadow-xl text-left space-y-3 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl">
              <i className="fa-solid fa-microchip"></i>
            </div>
            <h2 className="text-base font-display font-extrabold text-slate-900">Cleanroom &amp; Power Electronics</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Server room UPS, 3-Phase transformers, SMT placement lines, harmonic filters, and capacitor banks monitored 24/7.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600">
              Explore Power Systems (W20) <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </span>
          </button>
        </section>

        {/* Quick Module Strip */}
        <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">Complete Owner Web Ecosystem</div>
            <h3 className="text-base font-display font-black text-slate-900">All 44 Figma Screens Native in React (W01–W44)</h3>
            <p className="text-xs text-slate-500">
              Includes Gemini AI Triage, Live PostGIS Radar, Digital Twin FFT, 30-Day Warranty, OEM Spares Marketplace, Escrow Wallet &amp; 415V Wiki.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openWorkspace('/marketplace')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
            >
              OEM Spares (W28)
            </button>
            <button
              type="button"
              onClick={() => openWorkspace('/insurance')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
            >
              Warranty &amp; AMC (W24)
            </button>
            <button
              type="button"
              onClick={() => openWorkspace('/wiki')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
            >
              415V Wiki (W36)
            </button>
            <button
              type="button"
              onClick={() => openWorkspace('/dashboard')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold"
            >
              Enter Dashboard →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
