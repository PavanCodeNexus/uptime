import { Button, errorMessage, INDUSTRIES, Notice, techApi, TextField, useAuth, type Technician, type TechnicianSkill } from '@uptime/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../lib/api';

const LEVELS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'EXPERT', label: 'Expert' },
];

const DEMO_PROFILE: Technician = {
  id: 8841,
  userId: 8841,
  fullName: 'Raju Kumar Sharma',
  phone: '9876543210',
  industryType: 'INDUSTRIAL',
  kycStatus: 'VERIFIED',
  bio: 'Senior 415V Siemens Sinumerik 828D & Fanuc CNC Spindle Specialist serving Peenya & Bommasandra industrial estates.',
  experienceYears: 9,
  serviceRadiusKm: 15,
  upiId: 'raju.cnc@okhdfcbank',
  verificationLevel: 2,
  verificationStatus: 'VERIFIED',
  isProvisional: false,
  provisionalCompletedJobs: 5,
  isOnline: true,
  isAvailable: true,
  isOnJob: false,
  fatigueScore: 18,
  consecutiveJobsCount: 2,
  hoursWorkedToday: 5.5,
  isFatigueRestricted: false,
  ratingAvg: 4.9,
  ratingCount: 142,
  jobsCompleted: 142,
  walletBalance: 12450,
  totalEarned: 284500,
};

const DEMO_SKILLS: TechnicianSkill[] = [
  { id: 1, technicianId: 8841, industry: 'INDUSTRIAL', category: 'CNC', skillName: 'Siemens Sinumerik 828D / 840D Spindle', proficiency: 'EXPERT', isCertified: true },
  { id: 2, technicianId: 8841, industry: 'INDUSTRIAL', category: 'ELECTRICAL', skillName: '415V 3-Phase Drive Diagnostics & LOTO', proficiency: 'EXPERT', isCertified: true },
  { id: 3, technicianId: 8841, industry: 'AUTOMOTIVE', category: 'FLEET', skillName: 'Bosch OBD-II Commercial BS-VI Injection', proficiency: 'INTERMEDIATE', isCertified: false },
];

function ProfileForm({ t, isDemo }: { t: Technician; isDemo?: boolean }) {
  const qc = useQueryClient();
  const [bio, setBio] = useState(t.bio ?? '');
  const [years, setYears] = useState(t.experienceYears != null ? String(t.experienceYears) : '');
  const [radius, setRadius] = useState(t.serviceRadiusKm != null ? String(t.serviceRadiusKm) : '');
  const [upi, setUpi] = useState(t.upiId ?? '');
  const [err, setErr] = useState<string | null>(null);
  const [demoSaved, setDemoSaved] = useState(false);

  const save = useMutation({
    mutationFn: async () => {
      if (isDemo) {
        setDemoSaved(true);
        return t;
      }
      return techApi.updateProfile(http, {
        bio: bio.trim(),
        ...(years ? { experienceYears: Number(years) } : {}),
        ...(radius ? { serviceRadiusKm: Number(radius) } : {}),
        ...(upi.trim() ? { upiId: upi.trim() } : {}),
      });
    },
    onSuccess: (n) => {
      if (!isDemo) qc.setQueryData(['tech', 'me'], n);
    },
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (years && (!Number.isFinite(Number(years)) || Number(years) < 0 || Number(years) > 60)) return setErr('Experience should be between 0 and 60 years.');
    if (radius && (!Number.isFinite(Number(radius)) || Number(radius) < 1 || Number(radius) > 200)) return setErr('Service radius should be between 1 and 200 km.');
    setErr(null);
    save.mutate();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4" noValidate>
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-base font-display font-black text-slate-900">TW13 • Master Specialist Profile</h2>
        <Link to="/badges" className="text-xs font-bold text-orange-600 hover:underline">
          View Polygon NFT Badges (TW12) →
        </Link>
      </div>
      {err && <Notice tone="danger">{err}</Notice>}
      {save.isError && <Notice tone="danger">{errorMessage(save.error)}</Notice>}
      {(save.isSuccess || demoSaved) && <Notice tone="success">Specialist profile updated.</Notice>}
      <div className="space-y-1.5">
        <label htmlFor="bio" className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
          Engineering Bio &amp; OEM Experience
        </label>
        <textarea
          id="bio"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-orange-500"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Years of Experience" inputMode="numeric" value={years} onChange={(e) => setYears(e.target.value.replace(/\D/g, ''))} />
        <TextField label="Service Radius (km)" inputMode="numeric" value={radius} onChange={(e) => setRadius(e.target.value.replace(/\D/g, ''))} />
      </div>
      <TextField label="Verified UPI ID for Instant Payouts" placeholder="name@bank" value={upi} onChange={(e) => setUpi(e.target.value)} />
      <Button type="submit" loading={save.isPending} className="bg-orange-500 hover:bg-orange-600">
        Save Specialist Profile
      </Button>
    </form>
  );
}

function Skills({ isDemo }: { isDemo?: boolean }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['tech', 'skills'], queryFn: () => techApi.skills(http), enabled: !isDemo });
  const [demoList, setDemoList] = useState<TechnicianSkill[]>(DEMO_SKILLS);
  const [industry, setIndustry] = useState<string>('INDUSTRIAL');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [level, setLevel] = useState('EXPERT');
  const [certified, setCertified] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const add = useMutation({
    mutationFn: async () => {
      if (isDemo) {
        const next: TechnicianSkill = {
          id: Date.now(),
          technicianId: 8841,
          industry,
          category: category.trim().toUpperCase() || 'GENERAL',
          skillName: name.trim(),
          proficiency: level,
          isCertified: certified,
        };
        setDemoList((l) => [...l, next]);
        return next;
      }
      return techApi.addSkill(http, { industry, category: category.trim().toUpperCase() || 'GENERAL', skillName: name.trim(), proficiency: level, isCertified: certified });
    },
    onSuccess: () => {
      setName('');
      setCategory('');
      setCertified(false);
      if (!isDemo) void qc.invalidateQueries({ queryKey: ['tech', 'skills'] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      if (isDemo) {
        setDemoList((l) => l.filter((x) => x.id !== id));
        return;
      }
      return techApi.deleteSkill(http, id);
    },
    onSuccess: () => {
      if (!isDemo) void qc.invalidateQueries({ queryKey: ['tech', 'skills'] });
    },
  });

  function onAdd(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setErr('Type a skill name, e.g. "Fanuc CNC Spindle Alignment".');
    setErr(null);
    add.mutate();
  }

  const list = isDemo ? demoList : (q.data ?? []);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4" aria-labelledby="skills-h">
      <div>
        <h2 id="skills-h" className="text-base font-display font-black text-slate-900">
          TW14 • Trade Skills &amp; OEM Competency Matrix
        </h2>
        <p className="text-xs text-slate-500">Directly feeds the 60% Skill weighting of UPTIME&apos;s 40/60 dispatch scoring engine.</p>
      </div>
      {!isDemo && q.isError && <Notice tone="danger">{errorMessage(q.error)}</Notice>}
      {remove.isError && <Notice tone="danger">{errorMessage(remove.error)}</Notice>}

      {list.length === 0 ? (
        <p className="text-xs text-slate-500">No trade skills added yet.</p>
      ) : (
        <ul className="space-y-2">
          {list.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-slate-900">{s.skillName}</strong>
                  {s.isCertified && (
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 font-mono text-[10px] font-bold">CERTIFIED</span>
                  )}
                </div>
                <div className="font-mono text-[10px] text-slate-500">
                  {INDUSTRIES.find((i) => i.value === s.industry)?.label ?? s.industry} • {s.proficiency}
                </div>
              </div>
              <Button variant="ghost" onClick={() => remove.mutate(s.id)} disabled={remove.isPending} className="!min-h-[34px] !text-xs text-rose-600">
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={onAdd} className="space-y-4 border-t border-slate-100 pt-4" noValidate>
        {err && <Notice tone="danger">{err}</Notice>}
        {add.isError && <Notice tone="danger">{errorMessage(add.error)}</Notice>}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="sk-ind" className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Sector
            </label>
            <select
              id="sk-ind"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full min-h-tap rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-900"
            >
              {INDUSTRIES.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="sk-lvl" className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Proficiency Tier
            </label>
            <select
              id="sk-lvl"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full min-h-tap rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-900"
            >
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <TextField label="Skill / OEM Controller" placeholder="e.g. Fanuc 0i-MF CNC Maintenance" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Category (optional)" placeholder="CNC / ELECTRICAL" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
          <input type="checkbox" checked={certified} onChange={(e) => setCertified(e.target.checked)} />I hold an ITI / OEM certificate for this skill
        </label>
        <Button type="submit" variant="secondary" loading={add.isPending}>
          + Add Trade Skill
        </Button>
      </form>
    </section>
  );
}

/** Figma TW13 & TW14: Specialist Master Profile & Trade Skills Competency Matrix. */
export default function ProfilePage() {
  const { isDemo } = useAuth();
  const me = useQuery({ queryKey: ['tech', 'me'], queryFn: () => techApi.me(http), enabled: !isDemo });
  const tech = isDemo ? DEMO_PROFILE : me.data;

  return (
    <div className="space-y-6">
      {!isDemo && me.isPending && <p className="font-mono text-xs text-slate-500" role="status">Loading profile...</p>}
      {!isDemo && me.isError && <Notice tone="danger">{errorMessage(me.error)}</Notice>}
      {tech && <ProfileForm t={tech} isDemo={isDemo} />}
      <Skills isDemo={isDemo} />
    </div>
  );
}
