import { Button, canAcceptJobs, errorMessage, formatINR, Notice, techApi, useAuth, type Technician } from '@uptime/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../lib/api';

const DEMO_TECH: Technician = {
  id: 8841,
  userId: 8841,
  fullName: 'Raju Kumar Sharma',
  phone: '9876543210',
  industryType: 'INDUSTRIAL',
  kycStatus: 'VERIFIED',
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
  currentLat: 13.0285,
  currentLng: 77.5197,
  ratingAvg: 4.9,
  ratingCount: 142,
  jobsCompleted: 142,
  walletBalance: 12450,
  totalEarned: 284500,
  serviceRadiusKm: 15,
  experienceYears: 9,
  upiId: 'raju.cnc@okhdfcbank',
};

const WEEKLY_BARS = [
  { day: 'Mon', pct: 60, active: false },
  { day: 'Tue', pct: 75, active: false },
  { day: 'Wed', pct: 50, active: false },
  { day: 'Thu', pct: 90, active: true },
  { day: 'Fri', pct: 95, active: true },
  { day: 'Sat', pct: 30, active: false },
  { day: 'Sun', pct: 12, active: false },
];

/** Figma TW05: Field Specialist Command Cockpit — live techApi wired with seamless Demo mode fallback. */
export default function HomePage() {
  const { isDemo } = useAuth();
  const qc = useQueryClient();
  const me = useQuery({ queryKey: ['tech', 'me'], queryFn: () => techApi.me(http), enabled: !isDemo });
  const [demoTech, setDemoTech] = useState<Technician>(DEMO_TECH);
  const [locNote, setLocNote] = useState<string | null>(null);

  const setOnline = useMutation({
    mutationFn: async (on: boolean) => {
      if (isDemo) {
        const updated = { ...demoTech, isOnline: on, isAvailable: on };
        setDemoTech(updated);
        return updated;
      }
      return techApi.setAvailability(http, on, on);
    },
    onSuccess: (t) => {
      if (!isDemo) qc.setQueryData(['tech', 'me'], t);
    },
  });

  const setLoc = useMutation({
    mutationFn: async ({ lat, lng }: { lat: number; lng: number }) => {
      if (isDemo) {
        const updated = { ...demoTech, currentLat: lat, currentLng: lng };
        setDemoTech(updated);
        return updated;
      }
      return techApi.setLocation(http, lat, lng);
    },
    onSuccess: (t) => {
      if (!isDemo) qc.setQueryData(['tech', 'me'], t);
      setLocNote('GPS coordinates synced to PostGIS dispatch radar.');
    },
  });

  function shareLocation() {
    setLocNote(null);
    if (!('geolocation' in navigator)) return setLocNote('This browser cannot share GPS location.');
    navigator.geolocation.getCurrentPosition(
      (p) => setLoc.mutate({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setLocNote('Location permission denied. Enable browser location to match nearby emergency dispatches.'),
      { timeout: 10000 },
    );
  }

  if (!isDemo && me.isPending) return <p className="font-mono text-xs text-slate-500" role="status">Loading specialist cockpit...</p>;
  if (!isDemo && me.isError) {
    return (
      <div className="space-y-3">
        <Notice tone="danger">{errorMessage(me.error)}</Notice>
        <Button variant="secondary" onClick={() => void me.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const t = isDemo ? demoTech : (me.data ?? DEMO_TECH);
  const eligible = canAcceptJobs(t);
  const hasLocation = t.currentLat != null && t.currentLng != null;
  const initials = (t.fullName || 'RK')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Top Specialist Dark Status Strip (Exact Figma TW05) */}
      <section className="rounded-3xl bg-slate-900 text-white p-6 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-display font-black text-xl shadow-lg">
              {initials}
            </div>
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                t.isOnline ? 'bg-emerald-500 pulse-live' : 'bg-slate-500'
              }`}
            ></span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-display font-black">{t.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-mono font-bold">
                L{t.verificationLevel}
                {t.isProvisional ? '-P' : ''} SPECIALIST
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Industrial CNC &amp; Spindle Drives • {hasLocation ? `GPS ${Number(t.currentLat).toFixed(4)}, ${Number(t.currentLng).toFixed(4)}` : 'GPS not set'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setOnline.mutate(!t.isOnline)}
            disabled={setOnline.isPending}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              t.isOnline
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${t.isOnline ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
            <span>{setOnline.isPending ? 'UPDATING...' : t.isOnline ? 'DISPATCH READY (ONLINE)' : 'OFFLINE — GO ONLINE'}</span>
          </button>

          <button
            type="button"
            onClick={shareLocation}
            disabled={setLoc.isPending}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
          >
            <i className="fa-solid fa-location-crosshairs text-sky-400"></i>
            <span>Sync GPS</span>
          </button>

          <Link
            to="/dispatch"
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 animate-pulse"
          >
            <i className="fa-solid fa-bell"></i>
            <span>Incoming 60s Job</span>
          </Link>
        </div>
      </section>

      {locNote && <Notice tone="info">{locNote}</Notice>}
      {setOnline.isError && <Notice tone="danger">{errorMessage(setOnline.error)}</Notice>}
      {setLoc.isError && <Notice tone="danger">{errorMessage(setLoc.error)}</Notice>}

      {!eligible && (
        <Notice tone="warning">
          {t.isFatigueRestricted
            ? 'RULE SB-00 Mandatory Rest Period active (ISO 45001). You cannot accept new dispatches until your rest lock clears.'
            : 'Level 2 verification is required to accept emergency dispatches. '}
          {!t.isFatigueRestricted && (
            <Link to="/verification" className="font-bold underline">
              Complete KYC Document Vault →
            </Link>
          )}
        </Notice>
      )}

      {/* 4 KPI Cards Row (Exact Figma TW05) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/earnings" className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-orange-400 shadow-sm space-y-1 transition-all">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Wallet Balance</div>
          <div className="text-2xl font-display font-black text-slate-900">{formatINR(t.walletBalance)}</div>
          <div className="text-[11px] text-emerald-600 font-bold">Instant IMPS ready →</div>
        </Link>

        <Link to="/jobs" className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 shadow-sm space-y-1 transition-all">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Jobs Completed</div>
          <div className="text-2xl font-display font-black text-slate-900">{t.jobsCompleted}</div>
          <div className="text-[11px] text-blue-600 font-bold">Avg repair: 42 mins</div>
        </Link>

        <Link to="/analytics" className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 shadow-sm space-y-1 transition-all">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Specialist Rating</div>
          <div className="text-2xl font-display font-black text-slate-900 flex items-center gap-1">
            {t.ratingCount > 0 ? Number(t.ratingAvg).toFixed(1) : 'New'} <span className="text-amber-500 text-base">★</span>
          </div>
          <div className="text-[11px] text-slate-500">{t.ratingCount} verified reviews</div>
        </Link>

        <Link to="/verification" className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-purple-400 shadow-sm space-y-1 transition-all">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Verification Tier</div>
          <div className="text-2xl font-display font-black text-slate-900">
            L{t.verificationLevel}
            {t.isProvisional ? '-P' : ''}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold">96.4% Acceptance Rate</div>
        </Link>
      </div>

      {/* Active Job Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border border-blue-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/30 font-mono text-[10px] font-bold">
              ACTIVE JOB IN PROGRESS
            </span>
            <span className="text-xs font-mono text-slate-300">#JOB-9821 • EMERGENCY CNC SPINDLE</span>
          </div>
          <h2 className="text-lg font-display font-black">Apex Precision Tools • Peenya Plant #1 (Bay 2)</h2>
          <p className="text-xs text-slate-300">Issue: High-vibration spindle bearing seizure (415V). Client waiting on-site.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-300 uppercase">Arrival OTP</div>
            <div className="text-xl font-mono font-black text-amber-400">8841</div>
          </div>
          <Link to="/active-job" className="px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg flex items-center gap-2">
            <span>Open LOTO Console</span>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>

      {/* 2-Column Dashboard Grid: Weekly Earnings Bar Chart + Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-display font-black text-slate-900">Weekly Earnings Performance</h3>
              <p className="text-xs text-slate-500">Gross vs Net Payouts for Current Week (₹38,450 Gross • 90% Take-Home)</p>
            </div>
            <Link to="/earnings" className="text-xs font-bold text-blue-600 hover:underline">
              Full Financials →
            </Link>
          </div>
          <div className="h-48 pt-6 flex items-end justify-between gap-3 px-2 border-b border-slate-100">
            {WEEKLY_BARS.map((b) => (
              <div key={b.day} className="flex-1 h-full flex flex-col justify-end items-center gap-2">
                <div
                  className={`w-full rounded-t-xl transition-all ${b.active ? 'bg-orange-500 shadow-md' : b.pct < 35 ? 'bg-slate-200' : 'bg-orange-400'}`}
                  style={{ height: `${b.pct}%` }}
                ></div>
                <span className={`text-[10px] font-mono ${b.active ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>{b.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-display font-black text-slate-900">Today&apos;s Schedule</h3>
            <Link to="/availability" className="text-[10px] font-mono font-bold text-orange-600 hover:underline">
              Calendar →
            </Link>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-blue-900">
                <span>Apex Tools • Bay 2</span>
                <span className="text-[10px] font-mono text-orange-600">IN PROGRESS</span>
              </div>
              <p className="text-[11px] text-slate-600">11:30 AM • 415V Spindle Bearing</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 opacity-75">
              <div className="flex items-center justify-between font-bold text-slate-700">
                <span>Bharat Forge • Unit 3</span>
                <span className="text-[10px] font-mono text-emerald-600">COMPLETED</span>
              </div>
              <p className="text-[11px] text-slate-500">09:15 AM • Hydraulic Pressure Valve</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-700">
                <span>Kirloskar Motors • Bay 1</span>
                <span className="text-[10px] font-mono text-slate-400">SCHEDULED</span>
              </div>
              <p className="text-[11px] text-slate-500">03:30 PM • 3-Phase Servo Motor Audit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
