import { useState, type FormEvent } from 'react';
import { useTechStore } from '../store/techStore';

export default function EarningsPage() {
  const { availableBalanceInr, transactions, profile, withdrawFunds } = useTechStore();
  const [amount, setAmount] = useState('2500');
  const [message, setMessage] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);

  const totalEarned = transactions.filter((t) => t.type === 'CREDIT').reduce((s, t) => s + t.amountInr, 0);
  const totalWithdrawn = transactions.filter((t) => t.type === 'WITHDRAWAL').reduce((s, t) => s + t.amountInr, 0);

  function handleWithdraw(e: FormEvent) {
    e.preventDefault();
    const num = Number(amount);
    if (!Number.isFinite(num) || num < 500) {
      setMessage({ tone: 'err', text: 'Minimum instant IMPS withdrawal is ₹500.' });
      return;
    }
    if (num > availableBalanceInr) {
      setMessage({ tone: 'err', text: 'Withdrawal amount exceeds your available balance.' });
      return;
    }
    const ok = withdrawFunds(num);
    if (ok) {
      setMessage({
        tone: 'ok',
        text: `₹${num.toLocaleString('en-IN')} transferred instantly to ${profile.upiId} via IMPS.`,
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex rounded-full border border-[#E2EAE7] bg-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0F4C4C]">
          Escrow &amp; Instant IMPS
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold text-[#102020] sm:text-3xl">Earnings &amp; Payouts</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="tech-card p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#556868]">Available Balance</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0F4C4C]">₹{availableBalanceInr.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-[#10B981] font-semibold">Ready for instant IMPS</p>
        </div>
        <div className="tech-card p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#556868]">Total Credited</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#102020]">₹{totalEarned.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-[#556868]">88% net technician share</p>
        </div>
        <div className="tech-card p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#556868]">Total Withdrawn</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#D96B27]">₹{totalWithdrawn.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-[#556868]">UPI: {profile.upiId}</p>
        </div>
      </div>

      {/* Withdraw Card */}
      <section className="tech-card p-6 space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-[#102020]">Instant IMPS / UPI Withdrawal</h2>
          <p className="text-xs text-[#556868]">Zero payout fee for verified L2/L3 specialists. Credits in under 15 seconds.</p>
        </div>

        {message && (
          <div
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold ${
              message.tone === 'ok'
                ? 'border border-[#10B981]/40 bg-[#ECFDF5] text-[#065F46]'
                : 'border border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleWithdraw} className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="withdraw-amt" className="mb-1 block text-xs font-semibold text-[#102020]">
              Amount (INR)
            </label>
            <input
              id="withdraw-amt"
              type="number"
              min={500}
              max={availableBalanceInr}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-48 rounded-xl border border-[#E2EAE7] bg-[#F4F7F6] px-3.5 py-2.5 font-mono text-sm font-bold text-[#102020] outline-none focus:border-[#0F4C4C] focus:bg-white"
            />
          </div>
          <div className="flex gap-2">
            {[2000, 5000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(String(Math.min(preset, availableBalanceInr)))}
                className="cursor-pointer rounded-xl border border-[#E2EAE7] px-3 py-2.5 font-mono text-xs font-semibold text-[#0F4C4C] hover:border-[#0F4C4C]"
              >
                ₹{preset.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="cursor-pointer rounded-xl bg-[#D96B27] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95"
          >
            Withdraw to Bank
          </button>
        </form>
      </section>

      {/* Ledger */}
      <section className="tech-card overflow-hidden">
        <div className="border-b border-[#E2EAE7] px-5 py-4">
          <h2 className="font-display text-base font-bold text-[#102020]">Payout &amp; Escrow Ledger</h2>
        </div>
        <ul className="divide-y divide-[#EEF3F1]">
          {transactions.map((tx) => (
            <li key={tx.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="text-xs font-bold text-[#102020]">{tx.title}</p>
                <p className="font-mono text-[11px] text-[#556868]">
                  {tx.id} {tx.jobId ? `• ${tx.jobId}` : ''} • {tx.date}
                </p>
              </div>
              <span
                className={`font-mono text-sm font-bold ${
                  tx.type === 'CREDIT' ? 'text-[#065F46]' : 'text-[#D96B27]'
                }`}
              >
                {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amountInr.toLocaleString('en-IN')}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
