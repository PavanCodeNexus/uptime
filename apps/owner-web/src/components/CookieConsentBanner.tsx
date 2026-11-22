import { useEffect, useState } from 'react';
import { useOwnerStore } from '../store/ownerStore';

/**
 * Accessible DPDP Act 2023 Cookie Consent Banner + Customizable Preferences Modal.
 * Saves real browser cookies (`uptime_cookie_consent`, `uptime_plant_id`, `uptime_sector`, `uptime_lang`).
 */
export function CookieConsentBanner() {
  const { cookieConsent, cookieModalOpen, setCookieModalOpen, updateCookieConsent } = useOwnerStore();
  const [functional, setFunctional] = useState(cookieConsent?.functional ?? true);
  const [analytics, setAnalytics] = useState(cookieConsent?.analytics ?? true);

  useEffect(() => {
    if (cookieConsent) {
      setFunctional(cookieConsent.functional);
      setAnalytics(cookieConsent.analytics);
    }
  }, [cookieConsent]);

  useEffect(() => {
    if (!cookieModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCookieModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cookieModalOpen, setCookieModalOpen]);

  return (
    <>
      {/* First-visit Floating Banner */}
      {!cookieConsent && !cookieModalOpen && (
        <aside
          role="region"
          aria-label="Cookie consent"
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-5 shadow-2xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3.5 max-w-2xl">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-[#00D4AA] flex items-center justify-center shrink-0" aria-hidden="true">
                <i className="fa-solid fa-cookie-bite text-base"></i>
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-display font-extrabold text-slate-900">We use cookies to power fast dispatch &amp; plant preferences</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Essential cookies keep your login and escrow session secure. Optional cookies remember your active factory plant, preferred language, and spare parts cart under DPDP Act 2023.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setCookieModalOpen(true)}
                className="min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                Customize
              </button>
              <button
                type="button"
                onClick={() => updateCookieConsent({ functional: false, analytics: false })}
                className="min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={() => updateCookieConsent({ functional: true, analytics: true })}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                Accept All Cookies
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Cookie Preferences Modal */}
      {cookieModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="cookie-modal-title" className="text-lg font-display font-black text-slate-900">
                  Cookie &amp; Privacy Preferences
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage how UPTIME uses browser cookies under the DPDP Act 2023.</p>
              </div>
              <button
                type="button"
                onClick={() => setCookieModalOpen(false)}
                aria-label="Close cookie preferences"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Strictly Necessary Cookies</div>
                  <p className="text-[11px] text-slate-600 mt-0.5">Required for authentication tokens, CSRF/escrow security, and arrival OTP protection.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold shrink-0">Always On</span>
              </div>

              <label className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-4 cursor-pointer hover:border-blue-300">
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Functional Preferences</div>
                  <p className="text-[11px] text-slate-600 mt-0.5">Remembers your selected factory plant, preferred language, theme, and spare parts cart across visits.</p>
                </div>
                <input
                  type="checkbox"
                  checked={functional}
                  onChange={(e) => setFunctional(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded accent-blue-600 cursor-pointer"
                />
              </label>

              <label className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-4 cursor-pointer hover:border-blue-300">
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Dispatch Performance &amp; Diagnostics</div>
                  <p className="text-[11px] text-slate-600 mt-0.5">Helps us optimize emergency SLA routing and measure page responsiveness anonymously.</p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded accent-blue-600 cursor-pointer"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  updateCookieConsent({ functional: false, analytics: false });
                  setCookieModalOpen(false);
                }}
                className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Reject Optional
              </button>
              <button
                type="button"
                onClick={() => {
                  updateCookieConsent({ functional, analytics });
                  setCookieModalOpen(false);
                }}
                className="min-h-[40px] px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
