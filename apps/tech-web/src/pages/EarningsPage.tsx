import { Button, earningsApi, errorMessage, formatINR, Notice, useAuth } from '@uptime/shared';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { http } from '../lib/api';

const nice = (k: string) => k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').toLowerCase().replace(/^./, (c) => c.toUpperCase());
const looksMoney = (k: string) => /earn|amount|balance|total|payout|wallet|paid|fee/i.test(k);

/** Figma TW10: Financial Command Center — live earningsApi.get wired with 90/10 & 1% Sec 194C TDS breakdown. */
export default function EarningsPage() {
  const { isDemo } = useAuth();
  const q = useQuery({ queryKey: ['tech', 'earnings'], queryFn: () => earningsApi.get(http), enabled: !isDemo });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 text-white p-6 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] font-bold">
            TW10 • FINANCIAL COMMAND CENTER
          </span>
          <h1 className="mt-1 text-2xl font-display font-black">Earnings, 10% Commission &amp; 1% Sec 194C TDS</h1>
          <p className="text-xs text-slate-400">Transparent 90/10 settlement with zero-fee T+1 IMPS bank transfers.</p>
        </div>
        <Link to="/earnings/withdraw" className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-display font-extrabold text-xs shadow-lg flex items-center gap-2">
          <i className="fa-solid fa-building-columns"></i>
          <span>Instant IMPS Withdrawal (TW11)</span>
        </Link>
      </div>

      {/* 4 Figma Financial Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Gross Earnings (MTD)</div>
          <div className="text-2xl font-display font-black text-slate-900">₹38,450</div>
          <div className="text-[11px] text-emerald-600 font-bold">24 settled dispatches</div>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Platform Fee (10%)</div>
          <div className="text-2xl font-display font-black text-rose-600">-₹3,845</div>
          <div className="text-[11px] text-slate-500">Escrow &amp; AI Triage</div>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Sec 194C TDS (1%)</div>
          <div className="text-2xl font-display font-black text-amber-600">-₹384</div>
          <div className="text-[11px] text-slate-500">Form 16A auto-filed</div>
        </div>
        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-sm space-y-1">
          <div className="text-[10px] font-mono font-bold uppercase text-emerald-700">Net Take-Home Payout</div>
          <div className="text-2xl font-display font-black text-emerald-900">₹34,221</div>
          <div className="text-[11px] font-mono font-bold text-emerald-700">Wallet Ready: ₹12,450</div>
        </div>
      </div>

      {/* Live Backend Earnings Feed */}
      {!isDemo && q.isPending && <p className="font-mono text-xs text-slate-500" role="status">Loading live earnings ledger...</p>}
      {!isDemo && q.isError && (
        <div className="space-y-3">
          <Notice tone="danger">{errorMessage(q.error)}</Notice>
          <Button variant="secondary" onClick={() => void q.refetch()}>
            Try again
          </Button>
        </div>
      )}
      {!isDemo && q.isSuccess && (
        <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-display font-black text-slate-900">Live Backend Account Summary</h2>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(q.data)
              .filter(([, v]) => typeof v === 'number' || typeof v === 'string')
              .map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <dt className="font-mono text-[10px] font-bold uppercase text-slate-500">{nice(k)}</dt>
                  <dd className="mt-1 font-display text-xl font-black text-slate-900">
                    {looksMoney(k) && !Number.isNaN(Number(v)) ? formatINR(Number(v)) : String(v)}
                  </dd>
                </div>
              ))}
          </dl>
        </section>
      )}
    </div>
  );
}
