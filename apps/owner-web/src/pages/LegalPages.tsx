import { Link } from 'react-router-dom';
import { PublicFooter, PublicHeader } from '../components/PublicHeaderFooter';
import { useOwnerStore } from '../store/ownerStore';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <PublicHeader />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 py-10">
        <article className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="font-mono text-xs font-bold text-blue-700 uppercase">Legal &amp; SLA Charter</span>
            <h1 className="text-3xl font-display font-black text-slate-900 mt-1">Terms of Service &amp; Escrow Charter</h1>
            <p className="text-xs text-slate-500 mt-1">Effective November 2026 • UPTIME Industrial Technologies Pvt. Ltd.</p>
          </div>
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-1.5">
              <h2 className="text-base font-display font-extrabold text-slate-900">1. 15-Minute Emergency Dispatch SLA</h2>
              <p>For active Pro Pass and Factory Pro/Enterprise AMC facilities within supported industrial corridors (Peenya, Whitefield, Bommasandra, Electronic City, Sriperumbudur), UPTIME guarantees priority specialist dispatch matching within 15 minutes.</p>
            </section>
            <section className="space-y-1.5">
              <h2 className="text-base font-display font-extrabold text-slate-900">2. 100% Escrow Payment Protection</h2>
              <p>All service payments are held securely in Razorpay escrow until repair work is verified and handed over. Platform facilitation fee is strictly capped at 10%, with 18% GST Input Tax Credit (CGST/SGST or IGST) invoices issued directly to your registered GSTIN.</p>
            </section>
            <section className="space-y-1.5">
              <h2 className="text-base font-display font-extrabold text-slate-900">3. 30-Day Repair Warranty &amp; LOTO Safety</h2>
              <p>Every completed repair includes a 30-day warranty covering identical recurring failure modes at zero revisit dispatch cost. Both factory owners and UPTIME specialists must adhere strictly to OSHA / CEA 415V Lockout-Tagout electrical isolation protocols.</p>
            </section>
          </div>
        </article>
      </main>
      <PublicFooter />
    </div>
  );
}

export function PrivacyPage() {
  const { setCookieModalOpen } = useOwnerStore();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <PublicHeader />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 py-10">
        <article className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="font-mono text-xs font-bold text-emerald-700 uppercase">DPDP Act 2023 Compliant</span>
            <h1 className="text-3xl font-display font-black text-slate-900 mt-1">Privacy &amp; Cookie Policy</h1>
            <p className="text-xs text-slate-500 mt-1">Digital Personal Data Protection Act 2023 • Data Principal Rights</p>
          </div>
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-1.5">
              <h2 className="text-base font-display font-extrabold text-slate-900">1. Data Minimization &amp; Masking</h2>
              <p>UPTIME never stores full 12-digit Aadhaar numbers. Acoustic diagnostic recordings used for Gemini AI fault triage are purged automatically after FFT signature extraction.</p>
            </section>
            <section className="space-y-1.5">
              <h2 className="text-base font-display font-extrabold text-slate-900">2. Browser Cookies Used on UPTIME</h2>
              <p>We use essential cookies for secure authentication sessions, and optional functional cookies (`uptime_plant_id`, `uptime_sector`, `uptime_lang`, `uptime_cart_count`) only with your consent to remember your active factory facility, preferred language, and spare parts cart.</p>
              <button
                type="button"
                onClick={() => setCookieModalOpen(true)}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
              >
                Update Cookie Preferences
              </button>
            </section>
          </div>
        </article>
      </main>
      <PublicFooter />
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <PublicHeader />
      <main className="flex-1 mx-auto max-w-lg px-4 py-20 text-center space-y-4 flex flex-col items-center justify-center">
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold">404 • PAGE NOT FOUND</span>
        <h1 className="text-3xl font-display font-black text-slate-900">We couldn&apos;t find that page</h1>
        <p className="text-sm text-slate-600">The link may have moved or expired. Return to UPTIME Home or report a machine breakdown immediately.</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link to="/" className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold">
            Go to Home
          </Link>
          <Link to="/report" className="px-5 py-3 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold">
            Book Emergency Repair
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
