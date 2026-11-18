import { Button, errorMessage, INDUSTRIES, Notice, techApi, TextField, type Technician, type TechnicianSkill } from '@uptime/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { http } from '../lib/api';

const LEVELS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'EXPERT', label: 'Expert' },
];

function ProfileForm({ t }: { t: Technician }) {
  const qc = useQueryClient();
  const [bio, setBio] = useState(t.bio ?? '');
  const [years, setYears] = useState(t.experienceYears != null ? String(t.experienceYears) : '');
  const [radius, setRadius] = useState(t.serviceRadiusKm != null ? String(t.serviceRadiusKm) : '');
  const [upi, setUpi] = useState(t.upiId ?? '');
  const [err, setErr] = useState<string | null>(null);
  const save = useMutation({
    mutationFn: () =>
      techApi.updateProfile(http, {
        bio: bio.trim(),
        ...(years ? { experienceYears: Number(years) } : {}),
        ...(radius ? { serviceRadiusKm: Number(radius) } : {}),
        ...(upi.trim() ? { upiId: upi.trim() } : {}),
      }),
    onSuccess: (n) => qc.setQueryData(['tech', 'me'], n),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (years && (!Number.isFinite(Number(years)) || Number(years) < 0 || Number(years) > 60)) return setErr('Experience should be between 0 and 60 years.');
    if (radius && (!Number.isFinite(Number(radius)) || Number(radius) < 1 || Number(radius) > 200)) return setErr('Service distance should be between 1 and 200 km.');
    setErr(null);
    save.mutate();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5" noValidate>
      <h2 className="text-base font-semibold">About you</h2>
      {err && <Notice tone="danger">{err}</Notice>}
      {save.isError && <Notice tone="danger">{errorMessage(save.error)}</Notice>}
      {save.isSuccess && <Notice tone="success">Saved.</Notice>}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bio" className="text-sm font-medium text-fg-2">
          Short bio
        </label>
        <textarea id="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="rounded-lg border border-line-strong bg-surface px-3 py-2 text-base text-fg" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Years of experience" inputMode="numeric" value={years} onChange={(e) => setYears(e.target.value.replace(/\D/g, ''))} />
        <TextField label="How far will you travel (km)" inputMode="numeric" value={radius} onChange={(e) => setRadius(e.target.value.replace(/\D/g, ''))} />
      </div>
      <TextField label="UPI ID for payouts" placeholder="name@bank" value={upi} onChange={(e) => setUpi(e.target.value)} />
      <Button type="submit" loading={save.isPending} className="self-start">
        Save profile
      </Button>
    </form>
  );
}

function Skills() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['tech', 'skills'], queryFn: () => techApi.skills(http) });
  const [industry, setIndustry] = useState<string>('AUTOMOTIVE');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [level, setLevel] = useState('INTERMEDIATE');
  const [certified, setCertified] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const add = useMutation({
    mutationFn: () => techApi.addSkill(http, { industry, category: category.trim().toUpperCase() || 'GENERAL', skillName: name.trim(), proficiency: level, isCertified: certified }),
    onSuccess: () => {
      setName('');
      setCategory('');
      setCertified(false);
      void qc.invalidateQueries({ queryKey: ['tech', 'skills'] });
    },
  });
  const remove = useMutation({
    mutationFn: (id: number) => techApi.deleteSkill(http, id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['tech', 'skills'] }),
  });

  function onAdd(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setErr('Type the skill name, for example "Engine diagnostics".');
    setErr(null);
    add.mutate();
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5" aria-labelledby="skills-h">
      <h2 id="skills-h" className="text-base font-semibold">
        Your skills
      </h2>
      <p className="text-sm text-fg-2">Jobs are matched on your industry and skills. Add the work you do best.</p>
      {q.isError && <Notice tone="danger">{errorMessage(q.error)}</Notice>}
      {remove.isError && <Notice tone="danger">{errorMessage(remove.error)}</Notice>}
      {q.isSuccess && q.data.length === 0 && <p className="text-sm text-fg-muted">No skills added yet.</p>}
      {q.isSuccess && q.data.length > 0 && (
        <ul className="flex flex-col gap-2">
          {q.data.map((s: TechnicianSkill) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line p-3 text-sm">
              <span>
                <strong>{s.skillName}</strong> <span className="text-fg-muted">&middot; {INDUSTRIES.find((i) => i.value === s.industry)?.label ?? s.industry} &middot; {s.proficiency.toLowerCase()}</span>
                {s.isCertified && <span className="ml-2 rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">Certified</span>}
              </span>
              <Button variant="ghost" onClick={() => remove.mutate(s.id)} disabled={remove.isPending}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={onAdd} className="flex flex-col gap-3 border-t border-line pt-4" noValidate>
        {err && <Notice tone="danger">{err}</Notice>}
        {add.isError && <Notice tone="danger">{errorMessage(add.error)}</Notice>}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sk-ind" className="text-sm font-medium text-fg-2">
              Industry
            </label>
            <select id="sk-ind" value={industry} onChange={(e) => setIndustry(e.target.value)} className="min-h-tap rounded-lg border border-line-strong bg-surface px-3">
              {INDUSTRIES.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sk-lvl" className="text-sm font-medium text-fg-2">
              How good are you?
            </label>
            <select id="sk-lvl" value={level} onChange={(e) => setLevel(e.target.value)} className="min-h-tap rounded-lg border border-line-strong bg-surface px-3">
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <TextField label="Skill" placeholder="Engine diagnostics" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Category (optional)" placeholder="ENGINE" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <label className="flex min-h-tap items-center gap-2 text-sm">
          <input type="checkbox" checked={certified} onChange={(e) => setCertified(e.target.checked)} />I hold a certificate for this skill
        </label>
        <Button type="submit" variant="secondary" loading={add.isPending} className="self-start">
          Add skill
        </Button>
      </form>
    </section>
  );
}

/** Profile details and skills. */
export default function ProfilePage() {
  const me = useQuery({ queryKey: ['tech', 'me'], queryFn: () => techApi.me(http) });
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Profile and skills</h1>
      {me.isPending && <p className="text-fg-2" role="status">Loading...</p>}
      {me.isError && <Notice tone="danger">{errorMessage(me.error)}</Notice>}
      {me.isSuccess && <ProfileForm t={me.data} />}
      <Skills />
    </div>
  );
}
