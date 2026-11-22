import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOwnerStore } from '../store/ownerStore';

export default function NotificationsPage() {
  const { notifications, unreadNotifications, markNotificationRead, markAllNotificationsRead } = useOwnerStore();
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');

  const filtered = notifications.filter((n) => filter === 'ALL' || n.severity === filter);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-black tracking-tight text-slate-900">Notifications &amp; Alert Inbox</h1>
          <p className="text-xs text-slate-500 mt-0.5">{unreadNotifications} unread dispatch, telemetry, and billing alerts.</p>
        </div>
        {unreadNotifications > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 cursor-pointer"
          >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
              filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f === 'ALL' ? 'All Alerts' : f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((n) => {
          const pill =
            n.severity === 'CRITICAL'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : n.severity === 'WARNING'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-blue-50 text-blue-700 border-blue-200';
          return (
            <div
              key={n.id}
              className={`rounded-2xl border p-5 flex flex-wrap items-start justify-between gap-4 transition-colors ${
                n.read ? 'bg-white border-slate-200' : 'bg-blue-50/30 border-blue-200 shadow-xs'
              }`}
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full border font-mono text-[10px] font-bold ${pill}`}>{n.severity}</span>
                  <span className="font-mono text-[11px] text-slate-400">{n.createdAt}</span>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600" aria-label="Unread"></span>}
                </div>
                <h2 className="text-sm font-display font-extrabold text-slate-900">{n.title}</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{n.body}</p>
              </div>
              <div className="flex items-center gap-2">
                {n.link && (
                  <Link
                    to={n.link}
                    onClick={() => markNotificationRead(n.id)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold"
                  >
                    Open →
                  </Link>
                )}
                {!n.read && (
                  <button
                    type="button"
                    onClick={() => markNotificationRead(n.id)}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
