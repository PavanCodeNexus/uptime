import { useQuery } from '@tanstack/react-query';
import type { HttpClient } from '../lib/http';
import { trackingApi } from '../api/jobflow';

interface Props {
  http: HttpClient;
  jobId: number;
  /** Where the owner is. Used as the destination. */
  destLat: number;
  destLng: number;
  /** Optional Google Maps key. Without one we show a plain location card. */
  mapsKey?: string;
  /** Only poll while the technician is on the way. */
  active: boolean;
}

/**
 * Shows where the technician is. With a Google Maps key it embeds a directions map; without one it shows
 * the PostGIS radar telemetry card and a link that opens Google Maps in a new tab.
 */
export function TrackingCard({ http, jobId, destLat, destLng, mapsKey, active }: Props) {
  const q = useQuery({
    queryKey: ['tracking', jobId],
    queryFn: () => trackingApi.get(http, jobId),
    refetchInterval: active ? 4000 : false,
    retry: false,
  });
  const p = q.data;
  const link = p ? `https://www.google.com/maps/dir/?api=1&origin=${p.lat},${p.lng}&destination=${destLat},${destLng}` : undefined;
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 text-white shadow-xl" aria-labelledby="trk-h">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 pulse-live" aria-hidden="true"></span>
          <h2 id="trk-h" className="font-display text-base font-extrabold">
            Live PostGIS Technician Radar
          </h2>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
          500M GEOFENCE ACTIVE
        </span>
      </div>
      {q.isPending && <p className="mt-3 text-xs font-mono text-slate-400">Acquiring technician GPS telemetry...</p>}
      {q.isError && <p className="mt-3 text-xs text-slate-300">Location is not available right now. Live coordinates appear as soon as the technician starts traveling.</p>}
      {p && (
        <div className="mt-4 space-y-3">
          {mapsKey ? (
            <iframe
              title="Route map"
              className="h-64 w-full rounded-2xl border border-slate-700"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/directions?key=${encodeURIComponent(mapsKey)}&origin=${p.lat},${p.lng}&destination=${destLat},${destLng}`}
            />
          ) : (
            <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/90 p-4 sm:grid-cols-2">
              <div>
                <div className="font-mono text-[10px] uppercase text-slate-400">Live Coordinates</div>
                <div className="mt-1 font-mono text-sm font-bold text-sky-300">
                  {Number(p.lat).toFixed(4)}, {Number(p.lng).toFixed(4)}
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase text-slate-400">Estimated Arrival</div>
                <div className="mt-1 font-display text-xl font-black text-emerald-400">{p.etaMinutes} mins</div>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-300">
              ETA <strong className="text-white">{p.etaMinutes} min</strong> • Updates every 4s
            </span>
            <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 font-bold text-white hover:bg-blue-700">
              <i className="fa-solid fa-map-location-dot" aria-hidden="true"></i>
              Open in Google Maps
            </a>
          </div>
          <p className="font-mono text-[10px] text-slate-500">Until the technician&apos;s device streams live GPS, the backend provides a cluster reference point.</p>
        </div>
      )}
    </section>
  );
}
