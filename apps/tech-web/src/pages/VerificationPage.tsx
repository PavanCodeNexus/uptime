import {
  Button,
  containsFullAadhaarNumber,
  DOC_TYPES,
  errorMessage,
  fileToBase64,
  Notice,
  techApi,
  TextField,
} from '@uptime/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState, type FormEvent } from 'react';
import { http } from '../lib/api';

const LEVEL_TEXT = [
  'Level 0: just signed up.',
  'Level 1: identity checked.',
  'Level 2: documents approved. You can take jobs.',
  'Level 3: top verified technician.',
];
const MAX_FILE = 5 * 1024 * 1024;

function UploadForm() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState<string>('ITI_NCVT_CERT');
  const [number, setNumber] = useState('');
  const [issuer, setIssuer] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const upload = useMutation({
    mutationFn: async () => {
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
      void qc.invalidateQueries({ queryKey: ['tech', 'verification'] });
    },
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (containsFullAadhaarNumber(number)) return setErr('Please enter only the last 4 digits of your Aadhaar. Full numbers are not allowed.');
    if (file && file.size > MAX_FILE) return setErr('That file is too big. Please use a file under 5 MB.');
    if (file && !/^(image\/(jpeg|png)|application\/pdf)$/.test(file.type)) return setErr('Please choose a JPEG, PNG or PDF file.');
    setErr(null);
    upload.mutate();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5" noValidate aria-labelledby="up-h">
      <h2 id="up-h" className="text-base font-semibold">
        Upload a document
      </h2>
      {err && <Notice tone="danger">{err}</Notice>}
      {upload.isError && <Notice tone="danger">{errorMessage(upload.error)}</Notice>}
      {upload.isSuccess && <Notice tone="success">Uploaded. An admin will review it.</Notice>}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="doc-type" className="text-sm font-medium text-fg-2">
          Document
        </label>
        <select id="doc-type" value={docType} onChange={(e) => setDocType(e.target.value)} className="min-h-tap rounded-lg border border-line-strong bg-surface px-3">
          {DOC_TYPES.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>
      <TextField label="Document number (optional)" hint="For Aadhaar, type only the last 4 digits." value={number} onChange={(e) => setNumber(e.target.value)} />
      <TextField label="Issued by (optional)" placeholder="e.g. ITI Peenya" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="doc-file" className="text-sm font-medium text-fg-2">
          File (JPEG, PNG or PDF, under 5 MB)
        </label>
        <input id="doc-file" ref={fileRef} type="file" accept="image/jpeg,image/png,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
        {!file && <p className="text-xs text-fg-muted">No file chosen. The dev backend accepts an entry without a file so you can test.</p>}
      </div>
      <Button type="submit" loading={upload.isPending} className="self-start">
        Upload
      </Button>
    </form>
  );
}

function PennyDrop() {
  const [upi, setUpi] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const drop = useMutation({ mutationFn: () => techApi.upiPennyDrop(http, upi.trim()) });
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[\w.-]{2,}@[\w.-]{2,}$/.test(upi.trim())) return setErr('Enter a valid UPI ID, like name@bank.');
    setErr(null);
    drop.mutate();
  }
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5" noValidate aria-labelledby="upi-h">
      <h2 id="upi-h" className="text-base font-semibold">
        Check your UPI ID
      </h2>
      <p className="text-sm text-fg-2">We send Rs 1 to your UPI ID to confirm it is yours. This is where your earnings will be paid.</p>
      {err && <Notice tone="danger">{err}</Notice>}
      {drop.isError && <Notice tone="danger">{errorMessage(drop.error)}</Notice>}
      {drop.isSuccess && <Notice tone="success">UPI check done{drop.data?.status ? `: ${String(drop.data.status).toLowerCase().replace(/_/g, ' ')}` : ''}.</Notice>}
      <TextField label="UPI ID" placeholder="name@bank" value={upi} onChange={(e) => setUpi(e.target.value)} />
      <Button type="submit" variant="secondary" loading={drop.isPending} className="self-start">
        Verify UPI
      </Button>
    </form>
  );
}

/** Where the technician stands, plus the document upload and UPI check. */
export default function VerificationPage() {
  const q = useQuery({ queryKey: ['tech', 'verification'], queryFn: () => techApi.verificationStatus(http), refetchInterval: 20000 });
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Verification</h1>
        <p className="mt-1 text-fg-2">Upload your documents. An admin reviews them, then you can take jobs.</p>
      </div>

      {q.isPending && <p className="text-fg-2" role="status">Loading...</p>}
      {q.isError && (
        <div className="flex flex-col items-start gap-3">
          <Notice tone="danger">{errorMessage(q.error)}</Notice>
          <Button variant="secondary" onClick={() => void q.refetch()}>
            Try again
          </Button>
        </div>
      )}
      {q.isSuccess && (
        <section className="rounded-xl border border-line bg-surface p-5" aria-labelledby="st-h">
          <h2 id="st-h" className="text-base font-semibold">
            Your status
          </h2>
          <p className="mt-2 text-2xl font-bold">
            L{q.data.verificationLevel}
            {q.data.isProvisional ? '-P' : ''}{' '}
            <span className="text-base font-medium text-fg-2">{String(q.data.verificationStatus).toLowerCase().replace(/_/g, ' ')}</span>
          </p>
          <p className="mt-1 text-sm text-fg-2">{LEVEL_TEXT[Math.min(q.data.verificationLevel, 3)]}</p>
          <p className="mt-2 text-sm text-fg-muted">
            Documents uploaded: {q.data.documentsCount}. Identity check: {String(q.data.identityVerification?.status ?? 'NOT_STARTED').toLowerCase().replace(/_/g, ' ')}.
          </p>
          {q.data.isProvisional && (
            <p className="mt-2 text-sm text-fg-2">Provisional (L2-P): jobs up to Rs 3,000, not emergencies, until you finish 5 jobs rated 4.2 or more.</p>
          )}
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <UploadForm />
        <PennyDrop />
      </div>
      <p className="text-xs text-fg-muted">Face check, trade skill test and references arrive in a later phase.</p>
    </div>
  );
}
