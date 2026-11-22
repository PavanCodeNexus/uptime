import {
  Button,
  containsFullAadhaarNumber,
  DOC_TYPES,
  errorMessage,
  fileToBase64,
  Notice,
  techApi,
  TextField,
  useAuth,
} from '@uptime/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState, type FormEvent } from 'react';
import { http } from '../lib/api';

const LEVEL_TEXT = [
  'Level 0: Registered — submit KYC documents to unlock dispatch eligibility.',
  'Level 1: Identity verified — upload trade/statutory license to reach L2.',
  'Level 2: Documents approved — eligible for live industrial & fleet dispatches.',
  'Level 3: Master Certified Specialist — priority SOS & 415V high-voltage jobs.',
];
const MAX_FILE = 5 * 1024 * 1024;

function UploadForm({ isDemo }: { isDemo?: boolean }) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState<string>('ITI_NCVT_CERT');
  const [number, setNumber] = useState('');
  const [issuer, setIssuer] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [demoDone, setDemoDone] = useState(false);

  const upload = useMutation({
    mutationFn: async () => {
      if (isDemo) {
        setDemoDone(true);
        return;
      }
      const fileBase64 = file ? await fileToBase64(file) : undefined;
      return techApi.uploadDocument(http, {
        docType,
        ...(number.trim() ? { docNumberMasked: number.trim() } : {}),
        ...(issuer.trim() ? { issuerName: issuer.trim() } : {}),
        ...(fileBase64 ? { fileBase64 } : {}),
      });
    },
    onSuccess: () => {
      setNumber('');
      setIssuer('');
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      if (!isDemo) void qc.invalidateQueries({ queryKey: ['tech', 'verification'] });
    },
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (containsFullAadhaarNumber(number)) return setErr('DPDP Act 2023 Rule: Enter ONLY the last 4 digits of your Aadhaar.');
    if (file && file.size > MAX_FILE) return setErr('File exceeds 5 MB limit.');
    if (file && !/^(image\/(jpeg|png)|application\/pdf)$/.test(file.type)) return setErr('Please choose a JPEG, PNG, or PDF file.');
    setErr(null);
    upload.mutate();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4" noValidate aria-labelledby="up-h">
      <h2 id="up-h" className="text-base font-display font-black text-slate-900">
        Upload Compliance Document
      </h2>
      {err && <Notice tone="danger">{err}</Notice>}
      {upload.isError && <Notice tone="danger">{errorMessage(upload.error)}</Notice>}
      {(upload.isSuccess || demoDone) && <Notice tone="success">Document queued for Admin 3-Pane Signed KYC Workstation review (&lt;48h SLA).</Notice>}
      <div className="space-y-1.5">
        <label htmlFor="doc-type" className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
          Document Type
        </label>
        <select
          id="doc-type"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="w-full min-h-tap rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-900"
        >
          {DOC_TYPES.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>
      <TextField label="Masked Document Number (optional)" hint="For Aadhaar, enter ONLY the last 4 digits (e.g. 4829)." value={number} onChange={(e) => setNumber(e.target.value)} />
      <TextField label="Issuing Authority (optional)" placeholder="e.g. ITI Peenya / CEA Karnataka" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
      <div className="space-y-1.5">
        <label htmlFor="doc-file" className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
          Scan / Photo (JPEG, PNG or PDF &lt; 5 MB)
        </label>
        <input id="doc-file" ref={fileRef} type="file" accept="image/jpeg,image/png,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-xs text-slate-600" />
      </div>
      <Button type="submit" loading={upload.isPending} className="bg-orange-500 hover:bg-orange-600">
        Upload to Encrypted Vault
      </Button>
    </form>
  );
}

function PennyDrop({ isDemo }: { isDemo?: boolean }) {
  const [upi, setUpi] = useState(isDemo ? 'raju.cnc@okhdfcbank' : '');
  const [err, setErr] = useState<string | null>(null);
  const [demoOk, setDemoOk] = useState(false);
  const drop = useMutation({
    mutationFn: async () => {
      if (isDemo) {
        setDemoOk(true);
        return { status: 'VERIFIED' };
      }
      return techApi.upiPennyDrop(http, upi.trim());
    },
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[\w.-]{2,}@[\w.-]{2,}$/.test(upi.trim())) return setErr('Enter a valid UPI ID, like name@bank.');
    setErr(null);
    drop.mutate();
  }
  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4" noValidate aria-labelledby="upi-h">
      <div className="flex items-center justify-between">
        <h2 id="upi-h" className="text-base font-display font-black text-slate-900">
          NPCI ₹1 UPI Penny-Drop Verification
        </h2>
        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">T+1 IMPS</span>
      </div>
      <p className="text-xs text-slate-600">We deposit ₹1 to confirm bank ownership before enabling instant escrow withdrawals.</p>
      {err && <Notice tone="danger">{err}</Notice>}
      {drop.isError && <Notice tone="danger">{errorMessage(drop.error)}</Notice>}
      {(drop.isSuccess || demoOk) && (
        <Notice tone="success">UPI penny-drop verified{drop.data?.status ? `: ${String(drop.data.status).toLowerCase().replace(/_/g, ' ')}` : ''}.</Notice>
      )}
      <TextField label="UPI Handle" placeholder="name@bank" value={upi} onChange={(e) => setUpi(e.target.value)} />
      <Button type="submit" variant="secondary" loading={drop.isPending}>
        Verify UPI via NPCI ₹1 Drop
      </Button>
    </form>
  );
}

/** Figma TW15: KYC Document Vault & Compliance Status — live techApi wired with Demo fallback. */
export default function VerificationPage() {
  const { isDemo } = useAuth();
  const q = useQuery({ queryKey: ['tech', 'verification'], queryFn: () => techApi.verificationStatus(http), enabled: !isDemo, refetchInterval: 20000 });

  const level = isDemo ? 2 : (q.data?.verificationLevel ?? 0);
  const provisional = isDemo ? false : (q.data?.isProvisional ?? false);
  const statusLabel = isDemo ? 'VERIFIED' : String(q.data?.verificationStatus ?? 'PENDING');
  const docsCount = isDemo ? 4 : (q.data?.documentsCount ?? 0);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 text-white p-6 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-[10px] font-bold">
            TW15 • KYC COMPLIANCE VAULT
          </span>
          <h1 className="mt-1 text-2xl font-display font-black">Specialist Verification &amp; DPDP Document Locker</h1>
          <p className="text-xs text-slate-300">{LEVEL_TEXT[Math.min(level, 3)]}</p>
        </div>
        <div className="px-4 py-2.5 rounded-2xl bg-black/50 border border-slate-700 text-right font-mono">
          <div className="text-[10px] text-slate-400">ACTIVE TIER</div>
          <div className="text-xl font-black text-emerald-400">
            L{level}
            {provisional ? '-P' : ''} • {statusLabel}
          </div>
          <div className="text-[10px] text-slate-400">{docsCount} docs on file</div>
        </div>
      </div>

      {!isDemo && q.isPending && <p className="font-mono text-xs text-slate-500" role="status">Loading verification vault...</p>}
      {!isDemo && q.isError && (
        <div className="space-y-3">
          <Notice tone="danger">{errorMessage(q.error)}</Notice>
          <Button variant="secondary" onClick={() => void q.refetch()}>
            Try again
          </Button>
        </div>
      )}

      {/* Figma Vault Status Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900">Aadhaar (DPDP Masked)</div>
            <div className="font-mono text-[10px] text-slate-500">XXXX-XXXX-4829</div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">VERIFIED</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900">PAN Card (TDS 194C)</div>
            <div className="font-mono text-[10px] text-slate-500">ABCDE1234F</div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">VERIFIED</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900">Police Clearance (PCC)</div>
            <div className="font-mono text-[10px] text-slate-500">Bengaluru City Police</div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">CLEARED</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <UploadForm isDemo={isDemo} />
        <PennyDrop isDemo={isDemo} />
      </div>
    </div>
  );
}
