import { Button, formatINR, Notice } from '@uptime/shared';
import { useState, type FormEvent } from 'react';
import { useOwnerStore } from '../store/ownerStore';

const TOPUP_PRESETS = [5000, 15000, 25000, 50000];

export default function WalletPage() {
  const { walletBalance, autoRefill, proPassActive, txns, addWalletFunds, toggleAutoRefill, toggleProPass } = useOwnerStore();
  const [amount, setAmount] = useState('15000');
  const [notice, setNotice] = useState<string | null>(null);

  function handleTopUp(e: FormEvent) {
    e.preventDefault();
    const num = Number(amount);
    if (!Number.isFinite(num) || num < 500) {
      setNotice('Minimum corporate wallet top-up is ₹500.');
      return;
    }
    addWalletFunds(num);
    setNotice(`Added ${formatINR(num)} to your UPTIME Corporate Wallet.`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-black tracking-tight text-slate-900">Corporate Wallet &amp; Pro Pass</h1>
          <p className="text-xs text-slate-500 mt-0.5">Pre-fund your plant wallet for 1-click SOS emergency dispatch and OEM spare parts checkout.</p>
        </div>
      </div>

      {notice && <Notice tone="success">{notice}</Notice>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Wallet Balance + Top-Up */}
        <section className="lg:col-span-7 space-y-5">
          <div className="rounded-3xl bg-slate-900 text-white p-7 border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-mono text-xs text-[#00D4AA] font-bold uppercase">Available Escrow Wallet Balance</div>
                <div className="text-4xl font-display font-black mt-1">{formatINR(walletBalance)}</div>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700">
                <input type="checkbox" checked={autoRefill} onChange={toggleAutoRefill} className="accent-[#00D4AA]" />
                <span>Auto-refill below ₹10,000</span>
              </label>
            </div>

            <form onSubmit={handleTopUp} className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex flex-wrap gap-2">
                {TOPUP_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(String(p))}
                    className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold cursor-pointer ${
                      Number(amount) === p ? 'bg-[#00D4AA] text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    +{formatINR(p)}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="number"
                  min={500}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  aria-label="Top-up amount in rupees"
                  className="flex-1 min-h-[44px] rounded-xl bg-slate-950 border border-slate-700 px-3.5 font-mono text-sm font-bold text-white outline-none focus:border-[#00D4AA]"
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Funds via UPI / NEFT
                </Button>
              </div>
            </form>
          </div>

          {/* Transaction Ledger */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-3">
            <h2 className="text-base font-display font-black text-slate-900">Transaction Ledger</h2>
            <div className="divide-y divide-slate-100">
              {txns.map((t) => (
                <div key={t.id} className="py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{t.title}</div>
                    <div className="font-mono text-[11px] text-slate-500">
                      {t.date} • Ref {t.ref}
                    </div>
                  </div>
                  <span className={`font-mono text-sm font-extrabold ${t.type === 'CREDIT' ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {t.type === 'CREDIT' ? '+' : '−'}
                    {formatINR(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* UPTIME Pro Pass Card */}
        <aside className="lg:col-span-5 rounded-3xl bg-white border-2 border-blue-600 p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-bold">UPTIME PRO PASS</span>
            <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${proPassActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
              {proPassActive ? 'ACTIVE' : 'PAUSED'}
            </span>
          </div>
          <div>
            <div className="text-3xl font-display font-black text-slate-900">
              ₹999 <span className="text-sm font-normal text-slate-500">/ month</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Unlimited zero-fee SOS dispatches and 5 complimentary Digital Twin telemetry slots.</p>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600" aria-hidden="true"></i>₹0 emergency booking &amp; express runner fees</li>
            <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600" aria-hidden="true"></i>Guaranteed 15-minute SLA across Peenya &amp; Whitefield</li>
            <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600" aria-hidden="true"></i>5 Free Digital Twin Acoustic FFT sensors</li>
            <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600" aria-hidden="true"></i>Priority L3 Master Engineer assignment</li>
          </ul>
          <button
            type="button"
            onClick={toggleProPass}
            className={`w-full min-h-tap py-3 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              proPassActive ? 'border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {proPassActive ? 'Pause Pro Pass Renewal' : 'Activate Pro Pass (₹999/mo)'}
          </button>
        </aside>
      </div>
    </div>
  );
}
