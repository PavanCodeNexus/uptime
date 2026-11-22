import { Button, isValidIndianMobile, normalizeIndianMobile, Notice, TextField, UptimeEmblem } from '@uptime/shared';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PLANTS, useOwnerStore, type SectorKind } from '../store/ownerStore';

export default function SignupPage() {
  const navigate = useNavigate();
  const { updateProfile, setActivePlantId, setActiveSector } = useOwnerStore();

  const [company, setCompany] = useState('');
  const [gstin, setGstin] = useState('');
  const [coordinator, setCoordinator] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [clusterId, setClusterId] = useState(PLANTS[0].id);
  const [sector, setSector] = useState<SectorKind>('INDUSTRIAL');
  const [err, setErr] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (company.trim().length < 2) return setErr('Please enter your company or plant name.');
    if (!isValidIndianMobile(phone)) return setErr('Enter a valid 10-digit Indian mobile number.');
    if (gstin.trim() && !/^[0-9A-Z]{15}$/i.test(gstin.trim())) {
      return setErr('GSTIN must be 15 alphanumeric characters (or leave blank to add later).');
    }
    setErr(null);
    const cleanPhone = normalizeIndianMobile(phone);
    updateProfile({
      companyName: company.trim(),
      gstin: gstin.trim().toUpperCase() || '29AAACA1234A1Z5',
      coordinatorName: coordinator.trim() || company.trim(),
      emergencyPhone: `+91 ${cleanPhone}`,
      ...(email.trim() ? { email: email.trim() } : {}),
    });
    setActivePlantId(clusterId);
    setActiveSector(sector);
    navigate('/login', {
      state: {
        from: '/dashboard',
        prefillPhone: cleanPhone,
        prefillCompany: company.trim(),
        reason: `Almost done! Verify +91 ${cleanPhone} with a 6-digit OTP to activate ${company.trim()}.`,
      },
    });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 flex flex-col justify-center">
      <div className="mx-auto w-full max-w-3xl space-y-5">
        <div className="flex items-center justify-between text-xs">
          <Link to="/" className="font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
            <i className="fa-solid fa-arrow-left text-[10px]" aria-hidden="true"></i>
            <span>Back to Home</span>
          </Link>
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Already registered? Sign In
          </Link>
        </div>

        <form onSubmit={onSubmit} className="rounded-3xl bg-white border border-slate-200 p-7 sm:p-9 shadow-xl space-y-6" noValidate>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <UptimeEmblem size="md" accent="teal" />
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-black text-slate-900">Register Your Factory or Fleet</h1>
                <p className="text-xs text-slate-500">Unlock 18% GST Input Tax Credit invoices, 15-min emergency SLAs, and 30-day free Pro Pass trial.</p>
              </div>
            </div>
          </div>

          {err && <Notice tone="danger">{err}</Notice>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Company / Plant Name" placeholder="e.g. Apex Precision Tools Pvt Ltd" value={company} onChange={(e) => setCompany(e.target.value)} autoFocus />
            <TextField label="GSTIN (Optional — 18% ITC)" placeholder="29AAACA1234A1Z5" maxLength={15} value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase())} />
            <TextField label="Plant Coordinator Name" placeholder="e.g. Pavan B C" value={coordinator} onChange={(e) => setCoordinator(e.target.value)} />
            <TextField label="Emergency Mobile Number" type="tel" inputMode="numeric" placeholder="98450 88210" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <TextField label="Official Email (Optional)" type="email" placeholder="ops@company.in" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-cluster" className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Primary Industrial Cluster
              </label>
              <select
                id="signup-cluster"
                value={clusterId}
                onChange={(e) => setClusterId(e.target.value)}
                className="min-h-tap rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              >
                {PLANTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">Primary Equipment Sector</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(
                [
                  { id: 'INDUSTRIAL', label: 'Industrial Machinery & CNC', icon: 'fa-industry' },
                  { id: 'AUTOMOTIVE', label: 'Commercial & EV Fleets', icon: 'fa-truck-moving' },
                  { id: 'ELECTRONICS', label: 'Cleanroom & Power UPS', icon: 'fa-microchip' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSector(s.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
                    sector === s.id ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <i className={`fa-solid ${s.icon} text-blue-600`} aria-hidden="true"></i>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold">
              <i className="fa-solid fa-gift text-emerald-600 mr-2" aria-hidden="true"></i>
              Includes 30-Day Free UPTIME Pro Pass Trial (₹999 value • ₹0 emergency booking fees)
            </span>
            <span className="font-mono font-bold text-emerald-700">INCLUDED</span>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <Link to="/login" className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700">
              Back to Sign In
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Verify Phone &amp; Activate Account →
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
