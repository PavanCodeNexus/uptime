import { Button, Notice, TextField } from '@uptime/shared';
import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useOwnerStore, type ManagedAsset } from '../store/ownerStore';

type AssetTab = 'ALL' | 'MACHINE' | 'VEHICLE' | 'DEVICE';

export default function AssetsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { assets, activePlant, addAsset } = useOwnerStore();

  const initialTab = (searchParams.get('tab') as AssetTab | null) ?? 'ALL';
  const [tab, setTab] = useState<AssetTab>(['ALL', 'MACHINE', 'VEHICLE', 'DEVICE'].includes(initialTab) ? initialTab : 'ALL');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  // Add form state
  const [newCat, setNewCat] = useState<'MACHINE' | 'VEHICLE' | 'DEVICE'>('MACHINE');
  const [newName, setNewName] = useState('');
  const [newOem, setNewOem] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newSerial, setNewSerial] = useState('');
  const [newSpecs, setNewSpecs] = useState('');
  const [formErr, setFormErr] = useState<string | null>(null);

  const filtered = assets.filter((a) => {
    const matchTab = tab === 'ALL' || a.category === tab;
    const q = search.trim().toLowerCase();
    const matchText = !q || a.name.toLowerCase().includes(q) || a.oem.toLowerCase().includes(q) || a.serial.toLowerCase().includes(q);
    return matchTab && matchText;
  });

  const selected = assets.find((a) => a.id === selectedId) ?? filtered[0] ?? null;

  function onTabChange(next: AssetTab) {
    setTab(next);
    if (next === 'ALL') setSearchParams({});
    else setSearchParams({ tab: next });
  }

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (newName.trim().length < 2) return setFormErr('Enter an asset name (e.g. Fanuc Robodrill α-D21MiB5).');
    if (newOem.trim().length < 2) return setFormErr('Enter the OEM / Manufacturer name.');
    setFormErr(null);
    const created = addAsset({
      category: newCat,
      name: newName.trim(),
      oem: newOem.trim(),
      model: newModel.trim() || 'Standard Series',
      serial: newSerial.trim() || `SN-${Date.now().toString().slice(-6)}`,
      location: `${activePlant.name.split('•')[0].trim()} • Bay 1`,
      healthScore: 98,
      status: 'NOMINAL',
      specs: newSpecs.trim() || (newCat === 'MACHINE' ? '415V 3-Phase Industrial' : newCat === 'VEHICLE' ? 'BS-VI / OBD-II Connected' : '415V/230V Monitored'),
      lastService: 'Today',
      acousticDb: 60.5,
      rulHours: 1200,
    });
    setSelectedId(created.id);
    setShowAdd(false);
    setNewName('');
    setNewOem('');
    setNewModel('');
    setNewSerial('');
    setNewSpecs('');
  }

  function reportForAsset(asset: ManagedAsset) {
    const industry = asset.category === 'MACHINE' ? 'INDUSTRIAL' : asset.category === 'VEHICLE' ? 'AUTOMOTIVE' : 'ELECTRONICS';
    navigate('/report', {
      state: {
        draft: {
          industry,
          equipment: `${asset.name} (${asset.serial})`,
          description: `Inspection / fault reported on ${asset.name} located at ${asset.location}. Specs: ${asset.specs}.`,
        },
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black tracking-tight text-slate-900">Plant, Fleet &amp; Power Asset Inventory</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage industrial CNC machinery, commercial fleet vehicles, and cleanroom UPS systems.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search OEM, serial, model..."
            className="min-h-[40px] px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-blue-600"
          />
          <button
            type="button"
            onClick={() => setShowAdd((s) => !s)}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <i className={`fa-solid ${showAdd ? 'fa-xmark' : 'fa-plus'}`} aria-hidden="true"></i>
            <span>{showAdd ? 'Cancel' : 'Add Asset'}</span>
          </button>
        </div>
      </div>

      {/* Add Asset Form Drawer */}
      {showAdd && (
        <form onSubmit={handleAdd} className="rounded-3xl bg-white border-2 border-blue-200 p-6 shadow-md space-y-4" noValidate>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-display font-black text-slate-900">Register New Equipment / Vehicle / Device</h2>
            <span className="font-mono text-[10px] font-bold text-blue-700">AUTO QR TAG ASSIGNED</span>
          </div>
          {formErr && <Notice tone="danger">{formErr}</Notice>}
          <div className="grid grid-cols-3 gap-2 max-w-md">
            {(
              [
                { id: 'MACHINE', label: 'Industrial Machine' },
                { id: 'VEHICLE', label: 'Fleet Vehicle' },
                { id: 'DEVICE', label: 'Power / UPS' },
              ] as const
            ).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setNewCat(c.id)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer ${
                  newCat === c.id ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 text-slate-600'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <TextField label="Asset Name" placeholder="e.g. Fanuc Robodrill CNC" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <TextField label="OEM / Brand" placeholder="e.g. Fanuc / Tata / APC" value={newOem} onChange={(e) => setNewOem(e.target.value)} />
            <TextField label="Model" placeholder="e.g. α-D21MiB5" value={newModel} onChange={(e) => setNewModel(e.target.value)} />
            <TextField label="Serial / VIN / Asset Code" placeholder="e.g. FAN-2026-991" value={newSerial} onChange={(e) => setNewSerial(e.target.value)} />
            <div className="sm:col-span-2">
              <TextField label="Technical Specifications" placeholder="e.g. 415V 3-Phase • 10,000 RPM • 15 kW" value={newSpecs} onChange={(e) => setNewSpecs(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Asset to Plant Registry</Button>
          </div>
        </form>
      )}

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Asset categories">
        {(
          [
            { id: 'ALL', label: `All Assets (${assets.length})` },
            { id: 'MACHINE', label: `Machines (${assets.filter((a) => a.category === 'MACHINE').length})` },
            { id: 'VEHICLE', label: `Fleet Vehicles (${assets.filter((a) => a.category === 'VEHICLE').length})` },
            { id: 'DEVICE', label: `Power & UPS (${assets.filter((a) => a.category === 'DEVICE').length})` },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => onTabChange(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              tab === t.id ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Master-Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((a) => {
            const active = selected?.id === a.id;
            const badgeStyle =
              a.status === 'NOMINAL'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : a.status === 'WARNING'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200';
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedId(a.id)}
                className={`p-5 rounded-2xl border-2 text-left space-y-3 transition-all cursor-pointer ${
                  active ? 'border-blue-600 bg-white shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400">{a.id} • {a.oem}</span>
                  <span className={`px-2 py-0.5 rounded-full border font-mono text-[10px] font-bold ${badgeStyle}`}>
                    {a.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-display font-extrabold text-slate-900">{a.name}</div>
                  <div className="text-[11px] text-slate-500">{a.location}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Health Index</span>
                    <span className="font-bold text-slate-900">{a.healthScore}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${a.healthScore >= 90 ? 'bg-emerald-500' : a.healthScore >= 80 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${a.healthScore}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Asset Dossier */}
        {selected && (
          <aside className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-5 sticky top-24">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="font-mono text-[10px] font-bold text-blue-700 uppercase">{selected.category} • {selected.id}</span>
                <h2 className="text-lg font-display font-black text-slate-900 mt-0.5">{selected.name}</h2>
                <p className="text-xs text-slate-500">{selected.oem} • {selected.model}</p>
              </div>
              <div className="text-right font-mono">
                <div className="text-2xl font-black text-slate-900">{selected.healthScore}%</div>
                <div className="text-[10px] text-slate-400">HEALTH</div>
              </div>
            </div>

            <dl className="space-y-2.5 text-xs">
              <div className="flex justify-between gap-2 py-1.5 border-b border-slate-100">
                <dt className="font-mono text-slate-500">Serial / VIN</dt>
                <dd className="font-mono font-bold text-slate-900">{selected.serial}</dd>
              </div>
              <div className="flex justify-between gap-2 py-1.5 border-b border-slate-100">
                <dt className="font-mono text-slate-500">Location</dt>
                <dd className="font-semibold text-slate-900">{selected.location}</dd>
              </div>
              <div className="flex justify-between gap-2 py-1.5 border-b border-slate-100">
                <dt className="font-mono text-slate-500">Specs</dt>
                <dd className="font-semibold text-slate-900 text-right">{selected.specs}</dd>
              </div>
              <div className="flex justify-between gap-2 py-1.5 border-b border-slate-100">
                <dt className="font-mono text-slate-500">Acoustic Baseline</dt>
                <dd className="font-mono font-bold text-slate-900">{selected.acousticDb ?? 62} dB</dd>
              </div>
              <div className="flex justify-between gap-2 py-1.5">
                <dt className="font-mono text-slate-500">Last Serviced</dt>
                <dd className="font-semibold text-slate-900">{selected.lastService}</dd>
              </div>
            </dl>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => reportForAsset(selected)}
                className="w-full min-h-tap py-3 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-bolt" aria-hidden="true"></i>
                <span>Report Breakdown for This Asset</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/digital-twin')}
                className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold cursor-pointer"
              >
                Inspect Acoustic Digital Twin →
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
