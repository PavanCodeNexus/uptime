import { adminApi, Button, docTypeLabel, errorMessage, formatDateTime, Notice, TextField, type TechnicianDocument } from '@uptime/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { http } from '../lib/api';

function DocRow({ doc }: { doc: TechnicianDocument }) {
  const qc = useQueryClient();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const review = useMutation({
    mutationFn: (v: { status: 'VERIFIED' | 'REJECTED'; reason?: string }) => adminApi.reviewDocument(http, doc.technicianId, doc.id, v.status, v.reason),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'pending'] });
      void qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
  function reject() {
    if (reason.trim().length < 3) return setErr('Please write a short reason so the technician knows what to fix.');
    setErr(null);
    review.mutate({ status: 'REJECTED', reason: reason.trim() });
  }
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{docTypeLabel(doc.docType)}</p>
          <p className="text-sm text-fg-2">
            Technician #{doc.technicianId}
            {doc.docNumberMasked ? ` · ${doc.docNumberMasked}` : ''}
            {doc.issuerName ? ` · ${doc.issuerName}` : ''}
          </p>
          {doc.createdAt && <p className="text-xs text-fg-muted">Uploaded {formatDateTime(doc.createdAt)}</p>}
        </div>
        {!rejecting && (
          <div className="flex gap-2">
            <Button onClick={() => review.mutate({ status: 'VERIFIED' })} loading={review.isPending}>
              Approve
            </Button>
            <Button variant="secondary" onClick={() => setRejecting(true)} disabled={review.isPending}>
              Reject
            </Button>
          </div>
        )}
      </div>
      {rejecting && (
        <div className="flex flex-col gap-3 border-t border-line pt-3">
          {err && <Notice tone="danger">{err}</Notice>}
          <TextField label="Reason for rejecting" placeholder="e.g. Photo is blurry" value={reason} onChange={(e) => setReason(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={reject} loading={review.isPending}>
              Confirm reject
            </Button>
            <Button variant="ghost" onClick={() => setRejecting(false)} disabled={review.isPending}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      {review.isError && <Notice tone="danger">{errorMessage(review.error)}</Notice>}
    </li>
  );
}

/** Documents waiting for a decision. */
export default function KycQueuePage() {
  const q = useQuery({ queryKey: ['admin', 'pending'], queryFn: () => adminApi.pendingDocuments(http), refetchInterval: 20000 });
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Document review</h1>
        <p className="mt-1 text-fg-2">Approve or reject each document. After approving, set the technician's level on the "Set level" page.</p>
      </div>
      <Notice tone="info">The file preview is not available yet because the backend does not store uploaded files. Check the number and issuer instead.</Notice>
      {q.isPending && <p className="text-fg-2" role="status">Loading...</p>}
      {q.isError && (
        <div className="flex flex-col items-start gap-3">
          <Notice tone="danger">{errorMessage(q.error)}</Notice>
          <Button variant="secondary" onClick={() => void q.refetch()}>
            Try again
          </Button>
        </div>
      )}
      {q.isSuccess && q.data.length === 0 && <p className="rounded-xl border border-line bg-surface p-5 text-fg-2">Nothing waiting. All documents are reviewed.</p>}
      {q.isSuccess && q.data.length > 0 && (
        <ul className="flex flex-col gap-3">
          {q.data.map((d) => (
            <DocRow key={d.id} doc={d} />
          ))}
        </ul>
      )}
    </div>
  );
}
