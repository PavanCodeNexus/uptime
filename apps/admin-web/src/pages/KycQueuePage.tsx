import { adminApi, docTypeLabel, errorMessage, formatDateTime, useAuth, type TechnicianDocument } from '@uptime/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../lib/api';
import { useAdminStore } from '../store/adminStore';

function KycCard({
  doc,
  isDemo,
  onApproveLocal,
  onRejectLocal,
}: {
  doc: TechnicianDocument;
  isDemo: boolean;
  onApproveLocal: (id: number) => void;
  onRejectLocal: (id: number, reason: string) => void;
}) {
  const qc = useQueryClient();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [err, setErr] = useState<string | null>(null);

  const review = useMutation({
    mutationFn: async (v: { status: 'VERIFIED' | 'REJECTED'; reason?: string }) => {
      if (isDemo) {
        if (v.status === 'VERIFIED') onApproveLocal(doc.id);
        else onRejectLocal(doc.id, v.reason ?? 'Rejected by reviewer');
        return;
      }
      return adminApi.reviewDocument(http, doc.technicianId, doc.id, v.status, v.reason);
    },
    onSuccess: () => {
      if (!isDemo) {
        void qc.invalidateQueries({ queryKey: ['admin', 'pending'] });
        void qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      }
    },
  });

  function submitReject() {
    if (reason.trim().length < 3) {
      setErr('Provide a brief rejection reason for the technician.');
      return;
    }
    setErr(null);
    review.mutate({ status: 'REJECTED', reason: reason.trim() });
  }

  return (
    <li className="admin-card admin-card-interactive p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-[#F3F5EE] px-2 py-0.5 font-mono text-[11px] font-bold text-[#5B6443]">
              #{doc.id}
            </span>
            <h3 className="font-display text-base font-bold text-[#050506]">{docTypeLabel(doc.docType)}</h3>
            <span className="rounded-full bg-[#FBF6EA] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#9B711C]">
              48h SLA
            </span>
          </div>
          <p className="font-mono text-xs text-[#64675F]">
            Technician #{doc.technicianId}
            {doc.docNumberMasked ? ` • ${doc.docNumberMasked}` : ''}
            {doc.issuerName ? ` • ${doc.issuerName}` : ''}
          </p>
          {doc.createdAt && <p className="text-[11px] text-[#8B8E85]">Submitted {formatDateTime(doc.createdAt)}</p>}
        </div>

        {!rejecting && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={review.isPending}
              onClick={() => review.mutate({ status: 'VERIFIED' })}
              className="cursor-pointer rounded-xl bg-[#7D885E] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#5B6443] disabled:opacity-60"
            >
              {review.isPending ? 'Saving...' : 'Approve'}
            </button>
            <button
              type="button"
              disabled={review.isPending}
              onClick={() => setRejecting(true)}
              className="cursor-pointer rounded-xl border border-[#E8E8E2] bg-white px-4 py-2 text-xs font-semibold text-[#050506] transition-colors hover:border-[#050506]"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {rejecting && (
        <div className="mt-4 space-y-3 border-t border-[#E8E8E2] pt-4">
          {err && <p className="text-xs font-medium text-red-600">{err}</p>}
          <div>
            <label htmlFor={`reject-${doc.id}`} className="mb-1 block text-xs font-semibold text-[#050506]">
              Rejection Reason (Recorded in Audit Log)
            </label>
            <input
              id={`reject-${doc.id}`}
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Certificate image blurred or permit expired"
              className="w-full rounded-xl border border-[#E8E8E2] bg-[#FAFAF8] px-3.5 py-2 text-xs text-[#050506] outline-none focus:border-[#050506] focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={review.isPending}
              onClick={submitReject}
              className="cursor-pointer rounded-xl bg-[#050506] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E1F1D]"
            >
              Confirm Rejection
            </button>
            <button
              type="button"
              onClick={() => {
                setRejecting(false);
                setErr(null);
              }}
              className="cursor-pointer rounded-xl border border-[#E8E8E2] px-4 py-2 text-xs font-semibold text-[#64675F] hover:text-[#050506]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {review.isError && <p className="mt-3 text-xs font-medium text-red-600">{errorMessage(review.error)}</p>}
    </li>
  );
}

export default function KycQueuePage() {
  const { isDemo } = useAuth();
  const { kycQueue, approveKycDoc, rejectKycDoc } = useAdminStore();
  const q = useQuery({
    queryKey: ['admin', 'pending'],
    queryFn: () => adminApi.pendingDocuments(http),
    enabled: !isDemo,
    refetchInterval: 20000,
  });

  const docs = isDemo ? kycQueue : (q.data ?? []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E8E2] bg-white px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5B6443]">
            Credential Compliance
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold text-[#050506] sm:text-3xl">
            Technician KYC Verification Queue
          </h1>
          <p className="mt-1 text-xs text-[#64675F] sm:text-sm">
            Review Aadhaar, PAN, CEA electrical permits, and safety certificates in oldest-first SLA order.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="rounded-xl border border-[#E8E8E2] bg-white px-3.5 py-2 font-mono text-xs font-bold text-[#050506]">
            {docs.length} Pending
          </span>
          <Link
            to="/technicians"
            className="rounded-xl bg-[#050506] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E1F1D]"
          >
            Technician Roster →
          </Link>
        </div>
      </div>

      {!isDemo && q.isPending && (
        <p className="font-mono text-xs text-[#64675F]" role="status">
          Loading pending KYC documents...
        </p>
      )}
      {!isDemo && q.isError && (
        <div className="admin-card p-5">
          <p className="text-xs font-medium text-red-600">{errorMessage(q.error)}</p>
          <button
            type="button"
            onClick={() => void q.refetch()}
            className="mt-3 cursor-pointer rounded-xl border border-[#E8E8E2] px-3.5 py-1.5 text-xs font-semibold text-[#050506]"
          >
            Retry
          </button>
        </div>
      )}

      {docs.length === 0 && (isDemo || q.isSuccess) && (
        <div className="admin-card p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3F5EE] text-xl font-bold text-[#5B6443]">
            ✓
          </div>
          <h2 className="mt-3 font-display text-lg font-bold text-[#050506]">Verification Queue Clear</h2>
          <p className="mt-1 text-xs text-[#64675F]">
            All submitted KYC credentials have been reviewed and logged to the audit ledger.
          </p>
        </div>
      )}

      {docs.length > 0 && (
        <ul className="space-y-3">
          {docs.map((doc) => (
            <KycCard
              key={doc.id}
              doc={doc}
              isDemo={Boolean(isDemo)}
              onApproveLocal={approveKycDoc}
              onRejectLocal={rejectKycDoc}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
