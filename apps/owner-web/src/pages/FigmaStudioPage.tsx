import { useState } from 'react';

export default function FigmaStudioPage() {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Studio Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm shadow">
            <i className="fa-brands fa-figma text-emerald-400"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-display font-black text-slate-900">UPTIME Owner Web — Figma Design System (44 Screens: W01–W44)</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">NODE 75:3</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Full interactive desktop workstation with Single-Screen & 44-Screen Grid Artboard modes</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://www.figma.com/design/5AxPVHdFwjsLBwMFu83gdl?node-id=75-3"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <i className="fa-solid fa-arrow-up-right-from-square text-[11px] text-emerald-400"></i>
            <span>Open in Figma</span>
          </a>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <i className={`fa-solid ${fullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
            <span>{fullscreen ? 'Normal View' : 'Full Window'}</span>
          </button>
        </div>
      </div>

      {/* Studio Iframe Canvas */}
      <div className={`rounded-3xl border border-slate-200 overflow-hidden shadow-xl bg-slate-50 transition-all ${fullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'h-[920px] w-full'}`}>
        <iframe
          src="/owner-studio.html"
          title="Owner Web Figma Studio"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
