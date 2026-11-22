import { useState, type FormEvent } from 'react';
import { useTechStore } from '../store/techStore';

export default function VerificationPage() {
  const { documents, profile, uploadDocument } = useTechStore();
  const [docType, setDocType] = useState('CEA 415V Safety Permit');
  const [docNumber, setDocNumber] = useState('');
  const [issuer, setIssuer] = useState('');
  const [uploadedMsg, setUploadedMsg] = useState(false);

  function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!docNumber.trim() || !issuer.trim()) return;
    uploadDocument(docType, docNumber.trim(), issuer.trim());
    setDocNumber('');
    setIssuer('');
    setUploadedMsg(true);
    window.setTimeout(() => setUploadedMsg(false), 3000);
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex rounded-full border border-[#E2EAE7] bg-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0F4C4C]">
          Trust &amp; Licensing
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold text-[#102020] sm:text-3xl">KYC &amp; Electrical Permits</h1>
      </div>

      {/* Tier & Soulbound Credential Banner */}
      <section className="rounded-2xl bg-[#0F4C4C] p-6 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#10B981]">
            VERIFIED SPECIALIST CREDENTIAL
          </p>
          <h2 className="mt-1 font-display text-xl font-bold">{profile.tier}</h2>
          <p className="mt-1 text-xs text-[#CBE0DD]">
            Polygon Soulbound Credential: <span className="font-mono text-white">{profile.nftHash}</span>
          </p>
        </div>
        <span className="rounded-full bg-[#10B981] px-3.5 py-1.5 font-mono text-xs font-bold text-[#052E24]">
          DISPATCH ELIGIBLE
        </span>
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Existing Documents */}
        <section className="tech-card p-6 space-y-3 lg:col-span-7">
          <h2 className="font-display text-lg font-bold text-[#102020]">Submitted Credentials ({documents.length})</h2>
          <ul className="space-y-3">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2EAE7] bg-[#F4F7F6] p-4"
              >
                <div>
                  <p className="text-xs font-bold text-[#102020]">{doc.docType}</p>
                  <p className="font-mono text-[11px] text-[#556868]">
                    {doc.docNumber} • {doc.issuer}
                  </p>
                  <p className="text-[10px] text-[#6E8282]">Uploaded {doc.uploadedAt}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-bold ${
                    doc.status === 'VERIFIED'
                      ? 'bg-[#ECFDF5] text-[#065F46]'
                      : 'bg-[#FDF2EA] text-[#D96B27]'
                  }`}
                >
                  {doc.status.replace('_', ' ')}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Upload New Credential */}
        <section className="tech-card p-6 space-y-4 lg:col-span-5">
          <div>
            <h2 className="font-display text-lg font-bold text-[#102020]">Submit Additional Permit</h2>
            <p className="text-xs text-[#556868]">Unlock Level 3 Master 415V SOS dispatches with higher payouts.</p>
          </div>

          {uploadedMsg && (
            <div className="rounded-xl border border-[#10B981]/40 bg-[#ECFDF5] px-3.5 py-2.5 text-xs font-semibold text-[#065F46]">
              Document uploaded and queued for 48h Admin KYC review.
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-3">
            <div>
              <label htmlFor="doc-type" className="mb-1 block text-xs font-semibold text-[#102020]">
                Document Type
              </label>
              <select
                id="doc-type"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full rounded-xl border border-[#E2EAE7] bg-[#F4F7F6] px-3 py-2.5 text-xs font-semibold text-[#102020]"
              >
                <option>CEA 415V Safety Permit</option>
                <option>OEM CNC Certification (Siemens/Fanuc)</option>
                <option>EV High-Voltage BMS License</option>
                <option>DGFASLI Industrial LOTO Certificate</option>
              </select>
            </div>
            <div>
              <label htmlFor="doc-num" className="mb-1 block text-xs font-semibold text-[#102020]">
                Certificate / Permit Number
              </label>
              <input
                id="doc-num"
                type="text"
                required
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="e.g. LOTO-KA-2026-4410"
                className="w-full rounded-xl border border-[#E2EAE7] bg-[#F4F7F6] px-3.5 py-2.5 font-mono text-xs text-[#102020] outline-none focus:border-[#0F4C4C] focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor="doc-issuer" className="mb-1 block text-xs font-semibold text-[#102020]">
                Issuing Authority
              </label>
              <input
                id="doc-issuer"
                type="text"
                required
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="e.g. Siemens India Training Centre"
                className="w-full rounded-xl border border-[#E2EAE7] bg-[#F4F7F6] px-3.5 py-2.5 text-xs text-[#102020] outline-none focus:border-[#0F4C4C] focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer rounded-xl bg-[#0F4C4C] py-2.5 text-xs font-bold text-white hover:bg-[#0A3535]"
            >
              Upload for KYC Verification
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
