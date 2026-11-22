import { useState, type FormEvent } from 'react';
import { useTechStore } from '../store/techStore';

const ALL_SKILLS = [
  'Siemens CNC',
  'Fanuc Drives',
  '415V Panels',
  'APC UPS',
  'Hydraulics',
  'EV BMS & Chargers',
  'ABB Robotics',
  'PLC & SCADA',
];

export default function ProfilePage() {
  const { profile, updateProfile, toggleSkill } = useTechStore();
  const [name, setName] = useState(profile.fullName);
  const [cluster, setCluster] = useState(profile.cluster);
  const [upiId, setUpiId] = useState(profile.upiId);
  const [saved, setSaved] = useState(false);

  function handleSave(e: FormEvent) {
    e.preventDefault();
    updateProfile({ fullName: name.trim() || profile.fullName, cluster: cluster.trim() || profile.cluster, upiId: upiId.trim() || profile.upiId });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex rounded-full border border-[#E2EAE7] bg-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0F4C4C]">
          Specialist Settings
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold text-[#102020] sm:text-3xl">Skills, Radius &amp; Payout Profile</h1>
      </div>

      {saved && (
        <div className="rounded-xl border border-[#10B981]/40 bg-[#ECFDF5] px-4 py-2.5 text-xs font-semibold text-[#065F46]">
          Specialist profile updated cleanly.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        <form onSubmit={handleSave} className="tech-card p-6 space-y-4 lg:col-span-6">
          <h2 className="font-display text-lg font-bold text-[#102020]">Identity &amp; Payout Account</h2>

          <div>
            <label htmlFor="prof-name" className="mb-1 block text-xs font-semibold text-[#102020]">
              Full Name
            </label>
            <input
              id="prof-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#E2EAE7] bg-[#F4F7F6] px-3.5 py-2.5 text-xs font-semibold text-[#102020] outline-none focus:border-[#0F4C4C] focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="prof-cluster" className="mb-1 block text-xs font-semibold text-[#102020]">
              Primary Industrial Cluster
            </label>
            <input
              id="prof-cluster"
              type="text"
              value={cluster}
              onChange={(e) => setCluster(e.target.value)}
              className="w-full rounded-xl border border-[#E2EAE7] bg-[#F4F7F6] px-3.5 py-2.5 text-xs font-semibold text-[#102020] outline-none focus:border-[#0F4C4C] focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="prof-upi" className="mb-1 block text-xs font-semibold text-[#102020]">
              Instant IMPS / UPI ID
            </label>
            <input
              id="prof-upi"
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full rounded-xl border border-[#E2EAE7] bg-[#F4F7F6] px-3.5 py-2.5 font-mono text-xs font-semibold text-[#102020] outline-none focus:border-[#0F4C4C] focus:bg-white"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-semibold text-[#102020]">
              <label htmlFor="prof-radius">Dispatch Service Radius</label>
              <span className="font-mono text-[#0F4C4C]">{profile.serviceRadiusKm} km</span>
            </div>
            <input
              id="prof-radius"
              type="range"
              min={5}
              max={35}
              value={profile.serviceRadiusKm}
              onChange={(e) => updateProfile({ serviceRadiusKm: Number(e.target.value) })}
              className="w-full accent-[#0F4C4C]"
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer rounded-xl bg-[#0F4C4C] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0A3535]"
          >
            Save Profile
          </button>
        </form>

        <section className="tech-card p-6 space-y-4 lg:col-span-6">
          <div>
            <h2 className="font-display text-lg font-bold text-[#102020]">Certified Skill Specializations</h2>
            <p className="text-xs text-[#556868]">Toggle equipment families to match relevant SOS dispatch alerts.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_SKILLS.map((skill) => {
              const active = profile.skills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`cursor-pointer rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#0F4C4C] text-white shadow-xs'
                      : 'border border-[#E2EAE7] bg-[#F4F7F6] text-[#556868] hover:border-[#0F4C4C] hover:text-[#0F4C4C]'
                  }`}
                >
                  {active ? '✓ ' : '+ '}
                  {skill}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
