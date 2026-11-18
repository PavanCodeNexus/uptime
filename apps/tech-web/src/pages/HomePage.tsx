import { Button, canAcceptJobs, errorMessage, formatINR, Notice, techApi } from '@uptime/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../lib/api';

/** Technician home: verification level, the online switch, and where the technician is. */
export default function HomePage() {
  const qc = useQueryClient();
  const me = useQuery({ queryKey: ['tech', 'me'], queryFn: () => techApi.me(http) });
  const [locNote, setLocNote] = useState<string | null>(null);

  const setOnline = useMutation({
    mutationFn: (on: boolean) => techApi.setAvailability(http, on, on),
    onSuccess: (t) => qc.setQueryData(['tech', 'me'], t),
  });
  const setLoc = useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) => techApi.setLocation(http, lat, lng),
    onSuccess: (t) => {
      qc.setQueryData(['tech', 'me'], t);
      setLocNote('Location saved.');
    },
  });

  function shareLocation() {
    setLocNote(null);
    if (!('geolocation' in navigator)) return setLocNote('This browser cannot share a location.');
    navigator.geolocation.getCurrentPosition(
      (p) => setLoc.mutate({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setLocNote('Location was not shared. Allow location in the browser to be matched with nearby jobs.'),
      { timeout: 10000 },
    );
  }

  if (me.isPending) return <p className="text-fg-2" role="status">Loading your profile...</p>;
  if (me.isError) {
    return (
      <div className="flex flex-col items-start gap-3">
        <Notice tone="danger">{errorMessage(me.error)}</Notice>
        <Button variant="secondary" onClick={() => void me.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const t = me.data;
  const eligible = canAcceptJobs(t);
  const hasLocation = t.currentLat != null && t.currentLng != null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hello, {t.fullName}</h1>
        <p className="mt-1 text-fg-2">Go online to be matched with jobs near you.</p>
      </div>

      {!eligible && (
        <Notice tone="warning">
          {t.isFatigueRestricted ? 'You are on a mandatory rest period and cannot take jobs yet.' : 'You need verification level 2 before you can take jobs. '}
          {!t.isFatigueRestricted && (
            <Link to="/verification" className="font-semibold underline">
              Check your verification
            </Link>
          )}
        </Notice>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5" aria-labelledby="online-h">
          <h2 id="online-h" className="text-base font-semibold">
            Availability
          </h2>
          <p className="text-sm text-fg-2">
            You are <strong>{t.isOnline ? 'online' : 'offline'}</strong>
            {t.isOnJob ? ' and on a job.' : '.'}
          </p>
          {setOnline.isError && <Notice tone="danger">{errorMessage(setOnline.error)}</Notice>}
          <Button onClick={() => setOnline.mutate(!t.isOnline)} loading={setOnline.isPending} variant={t.isOnline ? 'secondary' : 'primary'} className="self-start">
            {t.isOnline ? 'Go offline' : 'Go online'}
          </Button>
          {t.isOnline && !eligible && <p className="text-xs text-fg-muted">You will not receive jobs until your verification level is 2 or more.</p>}
        </section>

        <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5" aria-labelledby="loc-h">
          <h2 id="loc-h" className="text-base font-semibold">
            Your location
          </h2>
          <p className="text-sm text-fg-2">
            {hasLocation ? `Saved at ${Number(t.currentLat).toFixed(4)}, ${Number(t.currentLng).toFixed(4)}.` : 'No location saved yet.'}
          </p>
          {setLoc.isError && <Notice tone="danger">{errorMessage(setLoc.error)}</Notice>}
          {locNote && <p className="text-sm text-fg-2">{locNote}</p>}
          <Button variant="secondary" onClick={shareLocation} loading={setLoc.isPending} className="self-start">
            Use my location
          </Button>
        </section>

        <section className="rounded-xl border border-line bg-surface p-5 md:col-span-2" aria-labelledby="stats-h">
          <h2 id="stats-h" className="text-base font-semibold">
            Your numbers
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-fg-muted">Verification level</dt>
              <dd className="text-lg font-bold">
                L{t.verificationLevel}
                {t.isProvisional ? '-P' : ''}
              </dd>
            </div>
            <div>
              <dt className="text-fg-muted">Rating</dt>
              <dd className="text-lg font-bold">{t.ratingCount > 0 ? Number(t.ratingAvg).toFixed(1) : 'New'}</dd>
            </div>
            <div>
              <dt className="text-fg-muted">Jobs done</dt>
              <dd className="text-lg font-bold">{t.jobsCompleted}</dd>
            </div>
            <div>
              <dt className="text-fg-muted">Wallet</dt>
              <dd className="text-lg font-bold">{formatINR(t.walletBalance)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
