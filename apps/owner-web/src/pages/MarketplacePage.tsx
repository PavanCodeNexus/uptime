import { formatINR } from '@uptime/shared';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SPARE_PARTS_CATALOG, useOwnerStore } from '../store/ownerStore';

const CATEGORIES = ['All', 'Bearings', 'Electrical', 'Fleet & DEF', 'Drives & VFD', 'Power & UPS'] as const;

export default function MarketplacePage() {
  const { assets, cart, cartCount, orders, addToCart } = useOwnerStore();
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('All');
  const [search, setSearch] = useState('');
  const [fitmentAsset, setFitmentAsset] = useState<string>('ALL');
  const [addedId, setAddedId] = useState<string | null>(null);

  const filtered = SPARE_PARTS_CATALOG.filter((p) => {
    const matchCat = cat === 'All' || p.category === cat;
    const q = search.trim().toLowerCase();
    const matchText = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    const matchFit = fitmentAsset === 'ALL' || p.compatibleWith.some((c) => fitmentAsset.toLowerCase().includes(c.split(' ')[0].toLowerCase()));
    return matchCat && matchText && matchFit;
  });

  function handleAdd(partId: string) {
    addToCart(partId);
    setAddedId(partId);
    window.setTimeout(() => setAddedId(null), 1500);
  }

  const content = (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black tracking-tight text-slate-900">OEM Spare Parts Marketplace</h1>
          <p className="text-xs text-slate-500 mt-0.5">QR-verified genuine industrial &amp; fleet spares with 18% GST ITC invoices and 60-minute cluster delivery.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU, bearing, contactor..."
            className="min-h-[40px] px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-blue-600"
          />
          <Link
            to="/cart"
            className="min-h-[40px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2"
          >
            <i className="fa-solid fa-cart-shopping" aria-hidden="true"></i>
            <span>Cart ({cartCount})</span>
          </Link>
        </div>
      </div>

      {/* Filters + Machine Fitment Check */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                cat === c ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="fitment-sel" className="font-mono text-[11px] font-bold text-slate-500">
            Fitment Check:
          </label>
          <select
            id="fitment-sel"
            value={fitmentAsset}
            onChange={(e) => setFitmentAsset(e.target.value)}
            className="min-h-[38px] rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800"
          >
            <option value="ALL">All Equipment</option>
            {assets.map((a) => (
              <option key={a.id} value={a.name}>
                Fits: {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Parts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((part) => {
          const inCart = cart.find((c) => c.partId === part.id)?.qty ?? 0;
          return (
            <article key={part.id} className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between gap-4 hover:border-blue-300 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400">{part.sku}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
                    {part.grade}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-700">{part.brand}</div>
                  <h2 className="text-base font-display font-extrabold text-slate-900 mt-0.5">{part.name}</h2>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{part.summary}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {part.compatibleWith.map((m) => (
                    <span key={m} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-mono text-[10px]">
                      ✓ {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xl font-display font-black text-slate-900">{formatINR(part.price)}</div>
                  <div className="text-[10px] font-mono text-emerald-700 font-bold">{part.eta} • {part.stock} in stock</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAdd(part.id)}
                  className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    addedId === part.id ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-black text-white'
                  }`}
                >
                  {addedId === part.id ? '✓ Added' : inCart > 0 ? `Add More (${inCart})` : 'Add to Cart'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-3">
          <h2 className="text-base font-display font-black text-slate-900">Recent Spare Parts Orders</h2>
          <div className="space-y-2.5">
            {orders.map((o) => (
              <div key={o.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-mono font-extrabold text-slate-900">
                    {o.id} • PO {o.poNumber}
                  </div>
                  <div className="text-slate-600">
                    {o.items.map((i) => `${i.qty}× ${i.name}`).join(', ')} → {o.gate}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-black text-blue-700">{formatINR(o.total)}</div>
                  <span className="text-[10px] text-emerald-700 font-bold">{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  return content;
}
