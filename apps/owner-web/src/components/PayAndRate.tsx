import { Button, errorMessage, formatDate, formatINR, Notice, paymentsApi, ratingsApi, type Job } from '@uptime/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { http } from '../lib/api';

/** Figma W32 Escrow Payment & W13 CORE-07 Double-Blind Mutual Rating cards. */
export function PayCard({ job }: { job: Job }) {
  const pay = useMutation({
    mutationFn: async () => {
      const order = await paymentsApi.createOrder(http, job.id, job.totalAmount);
      if (!order.razorpayOrderId) throw new Error('The payment order has no id. Please try again.');
      return paymentsApi.verify(http, order.razorpayOrderId);
    },
  });
  const invoice = useQuery({ queryKey: ['invoice', job.id], queryFn: () => paymentsApi.invoice(http, job.id), enabled: pay.isSuccess, retry: false });
  const done = pay.isSuccess;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4" aria-labelledby="pay-h">
      <div className="flex items-center justify-between">
        <h2 id="pay-h" className="text-base font-display font-black text-slate-900">
          100% Escrow Settlement (Razorpay)
        </h2>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
          ESCROW PROTECTED
        </span>
      </div>
      <p className="text-xs text-slate-600">
        Work completed: <strong className="text-slate-900">{job.workDoneSummary ?? '-'}</strong>. Total{' '}
        <strong className="font-mono text-blue-700">{formatINR(job.totalAmount)}</strong> (incl. 18% GST).
      </p>
      {pay.isError && <Notice tone="danger">{errorMessage(pay.error)}</Notice>}
      {done ? (
        <Notice tone="success">Payment received and secured in UPTIME Escrow until handover verification completes.</Notice>
      ) : (
        <div className="space-y-2">
          <Button onClick={() => pay.mutate()} loading={pay.isPending} className="bg-blue-600 hover:bg-blue-700">
            <i className="fa-solid fa-lock"></i>
            Pay {formatINR(job.totalAmount)} via Escrow
          </Button>
          <p className="text-[11px] font-mono text-slate-400">Razorpay test mode enabled until production settlement keys are configured.</p>
        </div>
      )}
      {invoice.isSuccess && (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs space-y-1 font-mono">
          <p className="font-bold text-slate-900">GST Tax Invoice {invoice.data.invoiceNumber}</p>
          <p className="text-slate-700">
            Subtotal {formatINR(invoice.data.subtotal)} + GST {formatINR(invoice.data.totalGst)} = <strong>{formatINR(invoice.data.grandTotal)}</strong>
          </p>
          {invoice.data.issuedAt && <p className="text-slate-500">Issued {formatDate(invoice.data.issuedAt)}</p>}
        </div>
      )}
    </section>
  );
}

export function RateCard({ jobId }: { jobId: number }) {
  const [stars, setStars] = useState(0);
  const submit = useMutation({ mutationFn: () => ratingsApi.submit(http, jobId, 'OWNER', stars) });
  const sent = submit.isSuccess;
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4" aria-labelledby="rate-h">
      <div className="flex items-center justify-between">
        <h2 id="rate-h" className="text-base font-display font-black text-slate-900">
          Double-Blind Mutual Rating (CORE-07)
        </h2>
        <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-mono text-[10px] font-bold">
          48H SEALED VAULT
        </span>
      </div>
      {sent ? (
        <Notice tone="success">Rating sealed in the CORE-07 double-blind vault. It unlocks automatically once both parties submit or after 48 hours.</Notice>
      ) : (
        <>
          <div role="radiogroup" aria-label="Stars" className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={stars === n}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                onClick={() => setStars(n)}
                className={`min-h-tap min-w-tap rounded-xl border-2 text-xl transition-all ${
                  n <= stars ? 'border-amber-400 bg-amber-50 text-amber-500 shadow-xs' : 'border-slate-200 text-slate-400 hover:border-slate-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          {submit.isError && <Notice tone="danger">{errorMessage(submit.error)}</Notice>}
          <Button onClick={() => submit.mutate()} disabled={stars === 0} loading={submit.isPending}>
            Seal &amp; Submit Rating
          </Button>
        </>
      )}
    </section>
  );
}
