import { Button, errorMessage, formatDate, formatINR, Notice, paymentsApi, ratingsApi, type Job } from '@uptime/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { http } from '../lib/api';

/** After the work: pay, see the invoice, then rate the technician. */
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
    <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5" aria-labelledby="pay-h">
      <h2 id="pay-h" className="text-base font-semibold">
        Payment
      </h2>
      <p className="text-sm text-fg-2">
        Work done: {job.workDoneSummary ?? '-'}. Total <strong>{formatINR(job.totalAmount)}</strong> including GST.
      </p>
      {pay.isError && <Notice tone="danger">{errorMessage(pay.error)}</Notice>}
      {done ? (
        <Notice tone="success">Payment received and held safely until you are happy with the work.</Notice>
      ) : (
        <>
          <Button onClick={() => pay.mutate()} loading={pay.isPending} className="self-start">
            Pay {formatINR(job.totalAmount)}
          </Button>
          <p className="text-xs text-fg-muted">Test mode: no real money moves until live Razorpay keys are added to the backend.</p>
        </>
      )}
      {invoice.isSuccess && (
        <div className="rounded-lg bg-surface-2 p-3 text-sm">
          <p className="font-semibold">Invoice {invoice.data.invoiceNumber}</p>
          <p>Subtotal {formatINR(invoice.data.subtotal)} + GST {formatINR(invoice.data.totalGst)} = {formatINR(invoice.data.grandTotal)}</p>
          {invoice.data.issuedAt && <p className="text-fg-muted">Issued {formatDate(invoice.data.issuedAt)}</p>}
          <p className="mt-1 text-xs text-fg-muted">The invoice amount comes from the backend and may differ from the job total while that part is still a sample.</p>
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
    <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5" aria-labelledby="rate-h">
      <h2 id="rate-h" className="text-base font-semibold">
        Rate your technician
      </h2>
      {sent ? (
        <Notice tone="success">Thanks. Your rating is sealed and will be shown when the technician rates you too.</Notice>
      ) : (
        <>
          <div role="radiogroup" aria-label="Stars" className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={stars === n}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                onClick={() => setStars(n)}
                className={`min-h-tap min-w-tap rounded-lg border text-xl ${n <= stars ? 'border-brand bg-brand text-on-brand' : 'border-line-strong text-fg-2'}`}
              >
                ★
              </button>
            ))}
          </div>
          {submit.isError && <Notice tone="danger">{errorMessage(submit.error)}</Notice>}
          <Button onClick={() => submit.mutate()} disabled={stars === 0} loading={submit.isPending} className="self-start">
            Send rating
          </Button>
        </>
      )}
    </section>
  );
}
