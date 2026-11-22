import { adminApi, Button, docTypeLabel, errorMessage, formatDateTime, Notice, TextField, useAuth, type TechnicianDocument } from '@uptime/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../lib/api';

const DEMO_DOCS: TechnicianDocument[] = [
  { id: 8841, technicianId: 401, docType: 'AADHAAR', docNumberMasked: 'XXXX-XXXX-4829', issuerName: 'UIDAI e-KYC • Track B Ustad L2-P', verificationStatus: 'PENDING', createdAt: '2026-11-22T08:12:00Z' },
  { id: 8842, technicianId: 405, docType: 'ITI_NCVT_CERT', docNumberMasked: 'CEA-KA-2024-9182', issuerName: 'CEA Karnataka Electrical Board • Track A', verificationStatus: 'PENDING', createdAt: '2026-11-22T09:05:00Z' },
  { id: 8843, technicianId: 412, docType: 'PAN', docNumberMasked: 'ABCDE1234F', issuerName: 'Income Tax Dept • Sec 194C TDS', verificationStatus: 'PENDING', createdAt: '2026-11-22T09:45:00Z' },
];

function DocRow({ doc, isDemo, onDemoResolve }: { doc: TechnicianDocument; isDemo?: boolean; onDemoResolve: (id: number) => void }) {
  const qc = useQueryClient();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const review = useMutation({
    mutationFn: async (v: { status: 'VERIFIED' | 'REJECTED'; reason?: string }) => {
      if (isDemo) {
        onDemoResolve(doc.id);
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

  function reject() {
    if (reason.trim().length < 3) return setErr('Enter a short rejection reason so the technician knows what to correct.');
    setErr(null);
    review.mutate({ status: 'REJECTED', reason: reason.trim() });
  }

  return (
    <li className="console-card rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold">#{doc.id}</span>
            <p className="font-display font-extrabold text-sm text-slate-900">{docTypeLabel(doc.docType)}</p>
          </div>
          <p className="text-xs text-slate-600 font-mono">
            Technician #{doc.technicianId}
            {doc.docNumberMasked ? ` • ${doc.docNumberMasked}` : ''}
            {doc.issuerName ? ` • ${doc.issuerName}` : ''}
          </p>
          {doc.createdAt && <p className="text-[11px] text-slate-400">Uploaded {formatDateTime(doc.createdAt)}</p>}
        </div>
        {!rejecting && (
          <div className="flex items-center gap-2">
            <Button onClick={() => review.mutate({ status: 'VERIFIED' })} loading={review.isPending} className="bg-emerald-600 hover:bg-emerald-700 !min-h-[38px]">
              ✓ Approve
            </Button>
            <Button variant="secondary" onClick={() => setRejecting(true)} disabled={review.isPending} className="!min-h-[38px]">
              Reject
            </Button>
          </div>
        )}
      </div>

      {rejecting && (
        <div className="space-y-3 border-t border-slate-100 pt-3">
          {err && <Notice tone="danger">{err}</Notice>}
          <TextField label="Rejection Reason (Logged to Immutable KYC Audit)" placeholder="e.g. Document image blurred or expired" value={reason} onChange={(e) => setReason(e.target.value)} />
          <div className="flex gap-2">
            <Button variant="danger" onClick={reject} loading={review.isPending}>
              Confirm Reject
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

/** Figma A07 & A08: 7-Step Technician KYC & Signed Document Review Queue — live adminApi wired. */
export default function KycQueuePage() {
  const { isDemo } = useAuth();
  const [demoDocs, setDemoDocs] = useState<TechnicianDocument[]>(DEMO_DOCS);
  const q = useQuery({ queryKey: ['admin', 'pending'], queryFn: () => adminApi.pendingDocuments(http), enabled: !isDemo, refetchInterval: 20000 });

  const docs = isDemo ? demoDocs : (q.data ?? []);

  return (
    <div className="space-y-6">
      {/* Header Bar (Figma A07) */}
      <div className="console-card rounded-3xl bg-white border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-mono text-xs font-extrabold">{docs.length} IN QUEUE</span>
          <div>
            <h1 className="text-lg font-display font-black text-slate-900">A07 • Technician KYC &amp; Skill Proof Verification Queue</h1>
            <p className="text-xs text-slate-500">Oldest-first 48h SLA compliance queue • Approving writes directly to immutable technician_kyc_audit_log.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/kyc/workstation" className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5">
            <i className="fa-solid fa-id-card-clip text-emerald-400"></i>
            <span>Open 3-Pane Signed Workstation (A08)</span>
          </Link>
          <Link to="/technicians" className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800">
            Set Technician Level (A10) →
          </Link>
        </div>
      </div>

      {!isDemo && q.isPending && <p className="font-mono text-xs text-slate-500" role="status">Loading pending KYC queue...</p>}
      {!isDemo && q.isError && (
        <div className="space-y-3">
          <Notice tone="danger">{errorMessage(q.error)}</Notice>
          <Button variant="secondary" onClick={() => void q.refetch()}>
            Try again
          </Button>
        </div>
      )}

      {docs.length === 0 && (isDemo || q.isSuccess) && (
        <div className="console-card rounded-3xl border border-slate-200 bg-white p-10 text-center space-y-2 shadow-sm">
          <i className="fa-solid fa-circle-check text-3xl text-emerald-500"></i>
          <p className="text-base font-display font-extrabold text-slate-900">KYC Queue Clear — All Documents Reviewed</p>
          <p className="text-xs text-slate-500">Proceed to Technician Directory (A10) to promote verified technicians to L2/L3.</p>
        </div>
      )}

      {docs.length > 0 && (
        <ul className="space-y-3">
          {docs.map((d) => (
            <DocRow
              key={d.id}
              doc={d}
              isDemo={isDemo}
              onDemoResolve={(id) => setDemoDocs((list) => list.filter((x) => x.id !== id))}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
