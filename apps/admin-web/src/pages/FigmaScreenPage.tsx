import { useState, type FormEvent, type MouseEvent } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import type { AdminOutletContext } from '../components/AdminLayout';
import { ADMIN_SCREENS, ADMIN_SCREEN_BY_CODE, renderAdminScreenHtml } from '../screens/adminFigmaScreens';

/** Native React renderer for all 24 Figma Admin NOC screens (A01-A24) with interactive tabs, sliders & routing. */
export default function FigmaScreenPage({ code }: { code: string }) {
  const navigate = useNavigate();
  const outletCtx = useOutletContext<AdminOutletContext | undefined>();
  const [kycDocTab, setKycDocTab] = useState<'aadhaar' | 'pan' | 'ustad'>('aadhaar');
  const [distWeight, setDistWeight] = useState<number>(40);
  const [bhashiniLang, setBhashiniLang] = useState<string>('kn');
  const [toast, setToast] = useState<string | null>(null);

  const screen = ADMIN_SCREEN_BY_CODE[code] ?? ADMIN_SCREENS[0];
  const idx = ADMIN_SCREENS.findIndex((s) => s.code === screen.code);
  const prev = ADMIN_SCREENS[(idx - 1 + ADMIN_SCREENS.length) % ADMIN_SCREENS.length];
  const next = ADMIN_SCREENS[(idx + 1) % ADMIN_SCREENS.length];

  const html = renderAdminScreenHtml(screen.code, {
    clusterName: outletCtx?.clusterName ?? 'All India NOC • Bengaluru Peenya Cluster #4',
    kycDocTab,
    distWeight,
    bhashiniLang,
  });

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement | null;
    const navEl = target?.closest<HTMLElement>('[data-nav-screen]');
    if (navEl) {
      const targetCode = navEl.getAttribute('data-nav-screen');
      if (targetCode && ADMIN_SCREEN_BY_CODE[targetCode]) {
        e.preventDefault();
        navigate(ADMIN_SCREEN_BY_CODE[targetCode].appPath);
        return;
      }
    }
    const tabEl = target?.closest<HTMLElement>('[data-kyc-tab]');
    if (tabEl) {
      const tab = tabEl.getAttribute('data-kyc-tab') as 'aadhaar' | 'pan' | 'ustad' | null;
      if (tab) {
        setKycDocTab(tab);
        return;
      }
    }
    const langEl = target?.closest<HTMLElement>('[data-bhashini-lang]');
    if (langEl) {
      const lang = langEl.getAttribute('data-bhashini-lang');
      if (lang) {
        setBhashiniLang(lang);
        return;
      }
    }
    const btn = target?.closest('button');
    if (btn) {
      const label = btn.textContent?.trim();
      if (label) {
        setToast(`NOC Command Executed: ${label}`);
        window.setTimeout(() => setToast(null), 2600);
      }
    }
  }

  function handleInput(e: FormEvent<HTMLDivElement>) {
    const target = e.target as HTMLInputElement | null;
    if (target?.getAttribute('data-weight-slider') === '1') {
      const val = Number(target.value);
      if (Number.isFinite(val)) setDistWeight(val);
    }
  }

  return (
    <div className="space-y-5">
      <div className="console-card rounded-3xl bg-white border border-slate-200 px-5 py-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white font-mono text-xs font-extrabold">{screen.code}</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono text-[10px] font-bold uppercase">
              {screen.module} • {screen.moduleLabel}
            </span>
            <span className="font-mono text-[11px] text-emerald-600 font-bold hidden md:inline">{screen.endpoint}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-display font-black tracking-tight text-slate-900">{screen.title}</h1>
          <p className="text-xs text-slate-500">{screen.desc}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={prev.appPath} className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5">
            <i className="fa-solid fa-chevron-left text-[10px]"></i>
            <span className="font-mono">{prev.code}</span>
          </Link>
          <Link to="/gallery" className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5">
            <i className="fa-solid fa-table-cells-large text-indigo-400"></i>
            <span className="hidden sm:inline">All 24</span>
          </Link>
          <Link to={next.appPath} className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5">
            <span className="font-mono">{next.code}</span>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
          </Link>
        </div>
      </div>

      {toast && (
        <div role="status" className="rounded-2xl bg-slate-900 text-white px-4 py-3 text-xs font-mono flex items-center justify-between shadow-lg">
          <span>
            <i className="fa-solid fa-shield-check text-emerald-400 mr-2"></i>
            {toast}
          </span>
          <button type="button" onClick={() => setToast(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      <div onClick={handleClick} onInput={handleInput} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
