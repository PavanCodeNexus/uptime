import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TECH_MODULES, TECH_SCREENS } from '../screens/techFigmaScreens';

/** Native 28-Screen Figma Artboard Gallery — click any card to jump directly to that live React route. */
export default function FigmaStudioPage() {
  const [moduleFilter, setModuleFilter] = useState<string>('ALL');
  const [query, setQuery] = useState('');

  const filtered = TECH_SCREENS.filter((s) => {
    const matchMod = moduleFilter === 'ALL' || s.module === moduleFilter;
    const q = query.trim().toLowerCase();
    const matchText = !q || s.code.toLowerCase().includes(q) || s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q);
    return matchMod && matchText;
  });

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-mono text-[10px] font-bold">
              FIGMA NODE 79:3 • NATIVE REACT
            </span>
            <span className="font-mono text-xs text-slate-400">{filtered.length} / 28 screens</span>
          </div>
          <h1 className="text-xl font-display font-black text-slate-900">All 28 Technician Web Screens (TW01–TW28)</h1>
          <p className="text-xs text-slate-500">Every specialist screen below is a native React route inside Technician Web. Click any card to open it.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search TW01–TW28..."
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:bg-white focus:border-orange-500"
          />
          <a
            href="https://www.figma.com/design/5AxPVHdFwjsLBwMFu83gdl?node-id=79-3"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5"
          >
            <i className="fa-brands fa-figma text-orange-400"></i>
            <span>Open in Figma</span>
          </a>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {TECH_MODULES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setModuleFilter(m.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              moduleFilter === m.id ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{m.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <Link
            key={s.code}
            to={s.appPath}
            className="group rounded-3xl bg-white border border-slate-200 hover:border-orange-500 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
          >
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-0.5 rounded bg-orange-600 font-mono text-xs font-extrabold shrink-0">{s.code}</span>
                <span className="text-xs font-bold truncate">{s.title}</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 shrink-0">{s.component}</span>
            </div>
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              <div className="space-y-1 pt-2 border-t border-slate-100">
                {s.bullets.map((b) => (
                  <div key={b} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                    <i className="fa-solid fa-check text-orange-500 text-[10px] shrink-0"></i>
                    <span className="truncate">{b}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform">
                <span className="font-mono text-[11px] text-slate-400">{s.appPath}</span>
                <span>Open Screen →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
