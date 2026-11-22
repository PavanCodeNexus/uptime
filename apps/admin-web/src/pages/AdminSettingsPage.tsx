import { useState } from 'react';
import { useAdminStore } from '../store/adminStore';

export default function AdminSettingsPage() {
  const { settings, updateSettings, auditLog } = useAdminStore();
  const [savedBanner, setSavedBanner] = useState(false);

  function savePatch(patch: Parameters<typeof updateSettings>[0]) {
    updateSettings(patch);
    setSavedBanner(true);
    window.setTimeout(() => setSavedBanner(false), 2400);
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E8E2] bg-white px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5B6443]">
          Governance &amp; Compliance
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold text-[#050506] sm:text-3xl">
          Operational Policies &amp; Audit Log
        </h1>
        <p className="mt-1 text-xs text-[#64675F] sm:text-sm">
          Configure platform-wide dispatch SLAs, safety locks, escrow rules, and inspect every administrative change.
        </p>
      </div>

      {savedBanner && (
        <div className="animate-fade-up rounded-xl border border-[#7D885E]/40 bg-[#F3F5EE] px-4 py-2.5 text-xs font-semibold text-[#5B6443]">
          Operational policy updated and recorded in the immutable audit log.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Policy Controls */}
        <section className="admin-card space-y-5 p-6 lg:col-span-6">
          <h2 className="font-display text-lg font-bold text-[#050506]">SLA &amp; Safety Thresholds</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sla-mins" className="mb-1.5 block text-xs font-semibold text-[#050506]">
                Dispatch SLA Target (Minutes)
              </label>
              <input
                id="sla-mins"
                type="number"
                min={5}
                max={60}
                value={settings.slaTargetMins}
                onChange={(e) => savePatch({ slaTargetMins: Number(e.target.value) || 15 })}
                className="w-full rounded-xl border border-[#E8E8E2] bg-[#FAFAF8] px-3.5 py-2.5 font-mono text-sm font-semibold text-[#050506] outline-none focus:border-[#050506] focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="fatigue-hrs" className="mb-1.5 block text-xs font-semibold text-[#050506]">
                Max Shift Fatigue Cap (Hours)
              </label>
              <input
                id="fatigue-hrs"
                type="number"
                min={8}
                max={16}
                value={settings.fatigueCapHours}
                onChange={(e) => savePatch({ fatigueCapHours: Number(e.target.value) || 12 })}
                className="w-full rounded-xl border border-[#E8E8E2] bg-[#FAFAF8] px-3.5 py-2.5 font-mono text-sm font-semibold text-[#050506] outline-none focus:border-[#050506] focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="escrow-hrs" className="mb-1.5 block text-xs font-semibold text-[#050506]">
                Escrow Settlement Window (Hours)
              </label>
              <input
                id="escrow-hrs"
                type="number"
                min={1}
                max={72}
                value={settings.escrowHoldHours}
                onChange={(e) => savePatch({ escrowHoldHours: Number(e.target.value) || 24 })}
                className="w-full rounded-xl border border-[#E8E8E2] bg-[#FAFAF8] px-3.5 py-2.5 font-mono text-sm font-semibold text-[#050506] outline-none focus:border-[#050506] focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="fee-pct" className="mb-1.5 block text-xs font-semibold text-[#050506]">
                Platform Commission (%)
              </label>
              <input
                id="fee-pct"
                type="number"
                min={5}
                max={25}
                value={settings.platformFeePct}
                onChange={(e) => savePatch({ platformFeePct: Number(e.target.value) || 12 })}
                className="w-full rounded-xl border border-[#E8E8E2] bg-[#FAFAF8] px-3.5 py-2.5 font-mono text-sm font-semibold text-[#050506] outline-none focus:border-[#050506] focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-3 border-t border-[#E8E8E2] pt-4">
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[#F0F0EA] bg-[#FAFAF8] p-3.5">
              <div>
                <p className="text-xs font-semibold text-[#050506]">Auto-Escalate SLA Breach Risk</p>
                <p className="text-[11px] text-[#64675F]">Alert dispatch desk when ETA exceeds 85% of target SLA.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoEscalateBreach}
                onChange={(e) => savePatch({ autoEscalateBreach: e.target.checked })}
                className="h-4 w-4 accent-[#7D885E]"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[#F0F0EA] bg-[#FAFAF8] p-3.5">
              <div>
                <p className="text-xs font-semibold text-[#050506]">Strict 415V LOTO Proof Requirement</p>
                <p className="text-[11px] text-[#64675F]">Require lockout-tagout photo before unlocking job start.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.strictLotoCheck}
                onChange={(e) => savePatch({ strictLotoCheck: e.target.checked })}
                className="h-4 w-4 accent-[#7D885E]"
              />
            </label>
          </div>
        </section>

        {/* Full Audit Stream */}
        <section className="admin-card p-6 lg:col-span-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#050506]">Immutable Admin Audit Log</h2>
            <span className="font-mono text-[11px] text-[#64675F]">{auditLog.length} entries</span>
          </div>
          <ul className="max-h-[420px] space-y-2.5 overflow-y-auto pr-1">
            {auditLog.map((entry) => (
              <li
                key={entry.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-[#F0F0EA] bg-[#FAFAF8] p-3.5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#5B6443]">{entry.id}</span>
                    <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#9B711C] border border-[#E8E8E2]">
                      {entry.category}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-[#050506]">{entry.action}</p>
                </div>
                <span className="flex-shrink-0 font-mono text-[10px] text-[#8B8E85]">{entry.timestamp}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
