import { useState, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OWNER_SCREENS, OWNER_SCREEN_BY_CODE, OWNER_SCREEN_HTML } from '../screens/ownerFigmaScreens';

/** Native React renderer for any bespoke Figma Owner Web screen (W01-W44), with React Router navigation. */
export default function FigmaScreenPage({ code }: { code: string }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);
  const screen = OWNER_SCREEN_BY_CODE[code] ?? OWNER_SCREENS[0];
  const idx = OWNER_SCREENS.findIndex((s) => s.code === screen.code);
  const prev = OWNER_SCREENS[(idx - 1 + OWNER_SCREENS.length) % OWNER_SCREENS.length];
  const next = OWNER_SCREENS[(idx + 1) % OWNER_SCREENS.length];
  const html = OWNER_SCREEN_HTML[screen.code] ?? '';

  function handleCanvasClick(e: MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement | null;
    const navEl = target?.closest<HTMLElement>('[data-nav-screen]');
    if (navEl) {
      const targetCode = navEl.getAttribute('data-nav-screen');
      if (targetCode && OWNER_SCREEN_BY_CODE[targetCode]) {
        e.preventDefault();
        navigate(OWNER_SCREEN_BY_CODE[targetCode].appPath);
        return;
      }
    }
    const btn = target?.closest('button');
    if (btn && !btn.getAttribute('data-nav-screen')) {
      const label = btn.textContent?.trim();
      if (label) {
        setToast(`Action triggered: ${label}`);
        window.setTimeout(() => setToast(null), 2600);
      }
    }
  }

  return (
    <div className="space-y-5">
      {/* Screen Breadcrumb & Navigation Bar */}
      <div className="rounded-3xl bg-white border border-slate-200 px-5 py-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-mono text-xs font-extrabold">{screen.code}</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px] font-bold uppercase">
              {screen.module} • {screen.moduleLabel}
            </span>
            <span className="font-mono text-[11px] text-slate-400 hidden sm:inline">{screen.component}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-display font-black tracking-tight text-slate-900">{screen.title}</h1>
          <p className="text-xs text-slate-500">{screen.desc}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={prev.appPath}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            title={`Previous: ${prev.code} ${prev.title}`}
          >
            <i className="fa-solid fa-chevron-left text-[10px]"></i>
            <span className="font-mono">{prev.code}</span>
          </Link>
          <Link
            to="/gallery"
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5"
          >
            <i className="fa-solid fa-table-cells-large text-emerald-400"></i>
            <span className="hidden sm:inline">All 44</span>
          </Link>
          <Link
            to={next.appPath}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            title={`Next: ${next.code} ${next.title}`}
          >
            <span className="font-mono">{next.code}</span>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
          </Link>
        </div>
      </div>

      {toast && (
        <div role="status" className="rounded-2xl bg-slate-900 text-white px-4 py-3 text-xs font-mono flex items-center justify-between shadow-lg">
          <span>
            <i className="fa-solid fa-circle-check text-emerald-400 mr-2"></i>
            {toast}
          </span>
          <button type="button" onClick={() => setToast(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Native Tailwind Figma Screen Surface */}
      <div onClick={handleCanvasClick} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
