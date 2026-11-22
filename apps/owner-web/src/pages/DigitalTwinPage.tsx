import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOwnerStore } from '../store/ownerStore';

const FFT_PROFILES: Record<string, { bars: number[]; peakHz: string; tempC: number; subsystems: { name: string; health: number; note: string }[] }> = {
  'M-101': {
    bars: [22, 30, 44, 58, 86, 94, 72, 60, 48, 82, 64, 38, 28, 20, 16, 14],
    peakHz: '4.2 kHz (Bearing Outer Race)',
    tempC: 79,
    subsystems: [
      { name: 'Main Spindle Bearing', health: 54, note: 'High harmonic spike — replace within 18h' },
      { name: '415V Spindle Drive', health: 81, note: 'Elevated draw (+11% nominal)' },
      { name: 'Hydraulic Chuck Pump', health: 94, note: 'Pressure nominal (62 bar)' },
      { name: 'Z-Axis Servo Motor', health: 96, note: 'Zero encoder drift' },
    ],
  },
  'M-102': {
    bars: [18, 25, 36, 48, 66, 74, 52, 42, 34, 48, 36, 26, 20, 16, 14, 12],
    peakHz: '2.8 kHz (Mild Belt Resonance)',
    tempC: 64,
    subsystems: [
      { name: 'Main Spindle Bearing', health: 78, note: 'Early wear detected — schedule PM' },
      { name: 'Vector Drive Module', health: 92, note: 'Cooling fan clean' },
      { name: 'Coolant Pump', health: 89, note: 'Flow steady' },
      { name: 'Tool Changer Arm', health: 95, note: 'Cycle time nominal' },
    ],
  },
  default: {
    bars: [16, 22, 28, 32, 36, 34, 28, 24, 20, 18, 16, 14, 12, 12, 10, 10],
    peakHz: '1.1 kHz (Nominal Operating Band)',
    tempC: 48,
    subsystems: [
      { name: 'Primary Drive / Rotor', health: 96, note: 'Smooth harmonic signature' },
      { name: 'Power Electronics Stage', health: 98, note: 'Voltage ripple < 1.9%' },
      { name: 'Thermal Management', health: 95, note: 'Operating temperature nominal' },
      { name: 'Safety Interlocks', health: 100, note: 'LOTO & sensors verified' },
    ],
  },
};

export default function DigitalTwinPage() {
  const navigate = useNavigate();
  const { assets } = useOwnerStore();
  const [activeId, setActiveId] = useState(assets[0]?.id ?? 'M-101');
  const asset = assets.find((a) => a.id === activeId) ?? assets[0];
  const profile = FFT_PROFILES[asset?.id ?? 'default'] ?? FFT_PROFILES.default;

  function schedulePreventive() {
    if (!asset) return;
    navigate('/report', {
      state: {
        draft: {
          industry: asset.category === 'VEHICLE' ? 'AUTOMOTIVE' : asset.category === 'DEVICE' ? 'ELECTRONICS' : 'INDUSTRIAL',
          equipment: `${asset.name} (${asset.serial})`,
          description: `Preventive dispatch triggered from Digital Twin FFT: acoustic level ${asset.acousticDb ?? 62} dB, peak at ${profile.peakHz}, estimated RUL ${asset.rulHours ?? 48} hrs.`,
        },
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 text-white p-6 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-mono text-[11px] font-bold text-[#00D4AA] uppercase">Physics-Informed Acoustic Diagnostics</div>
          <h1 className="text-2xl font-display font-black tracking-tight">Digital Twin &amp; Live Vibration FFT</h1>
          <p className="text-xs text-slate-300">Detect bearing wear, misalignment, and electrical harmonics before unplanned breakdowns occur.</p>
        </div>
        <button
          type="button"
          onClick={schedulePreventive}
          className="px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold cursor-pointer"
        >
          Schedule Preventive Repair →
        </button>
      </div>

      {/* Machine Switcher */}
      <div className="flex flex-wrap gap-2">
        {assets.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setActiveId(a.id)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
              a.id === asset?.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {a.name} ({a.healthScore}%)
          </button>
        ))}
      </div>

      {asset && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* FFT Spectrogram Visualizer */}
          <section className="lg:col-span-7 rounded-3xl bg-slate-950 text-white border border-slate-800 p-6 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-mono text-[10px] text-slate-400 uppercase">Live Acoustic Frequency Spectrum</div>
                <h2 className="text-lg font-display font-black">{asset.name}</h2>
              </div>
              <span
                className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
                  (asset.acousticDb ?? 60) > 75
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : (asset.acousticDb ?? 60) > 70
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {asset.acousticDb ?? 61.0} dB RMS
              </span>
            </div>

            {/* Interactive SVG Bar Spectrogram */}
            <div className="h-56 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex items-end gap-2">
              {profile.bars.map((val, idx) => {
                const high = val >= 75;
                const med = val >= 50 && val < 75;
                return (
                  <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center gap-1.5">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        high ? 'bg-rose-500' : med ? 'bg-amber-400' : 'bg-[#00D4AA]'
                      }`}
                      style={{ height: `${val}%` }}
                      title={`${(idx + 1) * 0.5} kHz: ${val} dB`}
                    ></div>
                    <span className="font-mono text-[9px] text-slate-500">{(idx + 1) * 0.5}k</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">DOMINANT PEAK</div>
                <div className="font-bold text-white mt-0.5">{profile.peakHz}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">CORE TEMP</div>
                <div className="font-bold text-amber-400 mt-0.5">{profile.tempC}°C</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">ESTIMATED RUL</div>
                <div className="font-bold text-[#00D4AA] mt-0.5">{asset.rulHours ?? 480} hrs</div>
              </div>
            </div>
          </section>

          {/* 4-Subsystem Health Matrix */}
          <section className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-display font-black text-slate-900">Subsystem Health Matrix</h2>
            <div className="space-y-4">
              {profile.subsystems.map((sub) => (
                <div key={sub.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-900">{sub.name}</span>
                    <span className="font-mono text-slate-700">{sub.health}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${sub.health >= 85 ? 'bg-emerald-500' : sub.health >= 70 ? 'bg-amber-500' : 'bg-rose-600'}`}
                      style={{ width: `${sub.health}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-500">{sub.note}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={schedulePreventive}
              className="w-full min-h-tap mt-2 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
            >
              Book Preventive Specialist for {asset.name}
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
