import { Button, Notice, TextField } from '@uptime/shared';
import { useState, type FormEvent } from 'react';
import { LANGUAGES, useOwnerStore } from '../store/ownerStore';

export default function SettingsPage() {
  const { profile, language, cookieConsent, setLanguage, updateProfile, setCookieModalOpen } = useOwnerStore();

  const [companyName, setCompanyName] = useState(profile.companyName);
  const [gstin, setGstin] = useState(profile.gstin);
  const [udyam, setUdyam] = useState(profile.udyamNumber);
  const [coordinator, setCoordinator] = useState(profile.coordinatorName);
  const [phone, setPhone] = useState(profile.emergencyPhone);
  const [email, setEmail] = useState(profile.email);
  const [saved, setSaved] = useState(false);

  function handleSave(e: FormEvent) {
    e.preventDefault();
    updateProfile({
      companyName: companyName.trim(),
      gstin: gstin.trim().toUpperCase(),
      udyamNumber: udyam.trim().toUpperCase(),
      coordinatorName: coordinator.trim(),
      emergencyPhone: phone.trim(),
      email: email.trim(),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black tracking-tight text-slate-900">Plant Profile, Language &amp; Privacy Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage corporate GSTIN billing, 9-language preferences, alert channels, and browser cookies.</p>
      </div>

      {saved && <Notice tone="success">Plant profile and billing details saved.</Notice>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form onSubmit={handleSave} className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-display font-black text-slate-900 border-b border-slate-100 pb-3">Corporate Identity &amp; GSTIN</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Company / Plant Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            <TextField label="GSTIN (18% ITC Billing)" value={gstin} onChange={(e) => setGstin(e.target.value)} maxLength={15} />
            <TextField label="MSME Udyam Number" value={udyam} onChange={(e) => setUdyam(e.target.value)} />
            <TextField label="Primary Plant Coordinator" value={coordinator} onChange={(e) => setCoordinator(e.target.value)} />
            <TextField label="Emergency Dispatch Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <TextField label="Billing &amp; Invoice Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Corporate Profile</Button>
        </form>

        <div className="lg:col-span-5 space-y-5">
          {/* 9 Indian Languages Switcher (stored in cookie!) */}
          <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-3">
            <h2 className="text-base font-display font-black text-slate-900">Language (9 Indian Languages)</h2>
            <p className="text-xs text-slate-500">Powered by Bhashini AI for alerts, dispatch SMS, and voice fault dictation.</p>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                    language === l.code ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                  }`}
                >
                  {l.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </section>

          {/* Alert Channels */}
          <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-3">
            <h2 className="text-base font-display font-black text-slate-900">Alert Routing Channels</h2>
            <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer py-1">
              <span>SMS Arrival OTP &amp; Dispatch Alerts</span>
              <input
                type="checkbox"
                checked={profile.smsAlerts}
                onChange={(e) => updateProfile({ smsAlerts: e.target.checked })}
                className="accent-blue-600 h-4 w-4"
              />
            </label>
            <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer py-1">
              <span>WhatsApp Live Technician ETA &amp; Invoices</span>
              <input
                type="checkbox"
                checked={profile.whatsappAlerts}
                onChange={(e) => updateProfile({ whatsappAlerts: e.target.checked })}
                className="accent-blue-600 h-4 w-4"
              />
            </label>
            <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer py-1">
              <span>Email Monthly GST ITC Statements</span>
              <input
                type="checkbox"
                checked={profile.emailAlerts}
                onChange={(e) => updateProfile({ emailAlerts: e.target.checked })}
                className="accent-blue-600 h-4 w-4"
              />
            </label>
          </section>

          {/* Cookie Management */}
          <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-3">
            <h2 className="text-base font-display font-black text-slate-900">Cookies &amp; DPDP Act 2023</h2>
            <p className="text-xs text-slate-600">
              Current consent:{' '}
              <strong className="font-mono text-slate-900">
                {cookieConsent
                  ? `Essential: On • Functional: ${cookieConsent.functional ? 'On' : 'Off'} • Analytics: ${cookieConsent.analytics ? 'On' : 'Off'}`
                  : 'Not set yet'}
              </strong>
            </p>
            <Button variant="secondary" onClick={() => setCookieModalOpen(true)}>
              <i className="fa-solid fa-cookie-bite text-blue-600" aria-hidden="true"></i>
              Manage Cookie Preferences
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
