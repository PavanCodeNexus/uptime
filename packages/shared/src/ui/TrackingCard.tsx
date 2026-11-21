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
 * the numbers and a link that opens Google Maps in a new tab.
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
    <section className="rounded-xl border border-line bg-surface p-5" aria-labelledby="trk-h">
      <div className="flex items-center justify-between gap-2">
        <h2 id="trk-h" className="text-base font-semibold">
          Technician location
        </h2>
      </div>
      {q.isPending && <p className="mt-2 text-sm text-fg-2">Looking for the technician...</p>}
      {q.isError && <p className="mt-2 text-sm text-fg-2">Location is not available right now. It will appear when the technician is on the way.</p>}
      {p && (
        <>
          {mapsKey ? (
            <iframe
              title="Route map"
              className="mt-3 h-64 w-full rounded-lg border border-line"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/directions?key=${encodeURIComponent(mapsKey)}&origin=${p.lat},${p.lng}&destination=${destLat},${destLng}`}
            />
          ) : (
            <div className="mt-3 rounded-lg bg-surface-2 p-4 text-sm">
              <p>
                Technician at <strong>{Number(p.lat).toFixed(4)}, {Number(p.lng).toFixed(4)}</strong>
              </p>
              <p className="mt-1 text-fg-2">Arriving in about {p.etaMinutes} minutes.</p>
            </div>
          )}
          <p className="mt-2 text-sm">
            About <strong>{p.etaMinutes} min</strong> away.{' '}
            <a href={link} target="_blank" rel="noreferrer" className="font-semibold text-brand-ink underline">
              Open in Google Maps
            </a>
          </p>
          <p className="mt-1 text-xs text-fg-muted">Until the technician's phone sends a live position, the backend shows a sample point.</p>
        </>
      )}
    </section>
  );
}
