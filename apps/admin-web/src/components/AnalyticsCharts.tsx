import { useState } from 'react';

/** Compact animated SVG sparkline for KPI cards. */
export function Sparkline({
  data,
  color = '#7D885E',
  height = 36,
  width = 110,
}: {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 3;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return [x, y] as const;
  });
  const linePath = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${pts[pts.length - 1][0].toFixed(1)} ${height} L ${pts[0][0].toFixed(1)} ${height} Z`;
  const gradId = `spark-${color.replace('#', '')}-${data.length}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw-line"
      />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.8" fill={color} />
    </svg>
  );
}

export interface RevenuePoint {
  label: string;
  gmvLakhs: number;
  dispatches: number;
  slaPct: number;
}

/** Interactive dual-series cubic Bezier Area & Line Chart (Olive GMV + Brass Dispatches). */
export function RevenueAreaChart({ data }: { data: RevenuePoint[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const W = 680;
  const H = 250;
  const padL = 44;
  const padR = 20;
  const padT = 18;
  const padB = 34;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const maxGmv = Math.max(...data.map((d) => d.gmvLakhs), 1) * 1.15;
  const maxDisp = Math.max(...data.map((d) => d.dispatches), 1) * 1.15;

  const gmvPts = data.map((d, i) => ({
    x: padL + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padT + chartH - (d.gmvLakhs / maxGmv) * chartH,
  }));

  const dispPts = data.map((d, i) => ({
    x: padL + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padT + chartH - (d.dispatches / maxDisp) * chartH,
  }));

  function smoothPath(pts: { x: number; y: number }[]) {
    if (pts.length === 0) return '';
    return pts.reduce((acc, p, i, arr) => {
      if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      const prev = arr[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `${acc} C ${cx.toFixed(1)} ${prev.y.toFixed(1)}, ${cx.toFixed(1)} ${p.y.toFixed(1)}, ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }, '');
  }

  const gmvLine = smoothPath(gmvPts);
  const gmvArea = `${gmvLine} L ${gmvPts[gmvPts.length - 1]?.x.toFixed(1) ?? padL} ${(padT + chartH).toFixed(1)} L ${gmvPts[0]?.x.toFixed(1) ?? padL} ${(padT + chartH).toFixed(1)} Z`;
  const dispLine = smoothPath(dispPts);

  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const activeIdx = hovered ?? data.length - 1;
  const activeItem = data[activeIdx];
  const activePt = gmvPts[activeIdx];

  return (
    <div className="relative w-full">
      {/* Live interactive readout strip */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-medium text-[#050506]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#7D885E]" />
            GMV Revenue (₹ Lakhs)
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-[#64675F]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D9A53A]" />
            Completed Dispatches
          </span>
        </div>
        {activeItem && (
          <div className="inline-flex items-center gap-3 rounded-full border border-[#E8E8E2] bg-[#FAFAF8] px-3 py-1 font-mono text-[11px] text-[#050506]">
            <span className="font-semibold text-[#64675F]">{activeItem.label}</span>
            <span className="font-bold text-[#5B6443]">₹{activeItem.gmvLakhs.toFixed(1)}L</span>
            <span className="text-[#E8E8E2]">|</span>
            <span className="font-bold text-[#9B711C]">{activeItem.dispatches} jobs</span>
            <span className="text-[#E8E8E2]">|</span>
            <span className="font-semibold text-[#050506]">{activeItem.slaPct.toFixed(1)}% SLA</span>
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full select-none overflow-visible"
        role="img"
        aria-label="Revenue and Dispatch Velocity Chart"
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="oliveAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7D885E" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#7D885E" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Horizontal architectural grid */}
        {yTicks.map((t) => {
          const y = padT + chartH - t * chartH;
          const val = (t * maxGmv).toFixed(0);
          return (
            <g key={t}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#ECECE6" strokeDasharray="3 4" />
              <text x={padL - 10} y={y + 3.5} textAnchor="end" className="fill-[#7B7E76] font-mono text-[10px]">
                ₹{val}L
              </text>
            </g>
          );
        })}

        {/* Olive GMV area + stroke */}
        <path d={gmvArea} fill="url(#oliveAreaGrad)" />
        <path
          d={gmvLine}
          fill="none"
          stroke="#7D885E"
          strokeWidth="2.6"
          strokeLinecap="round"
          className="animate-draw-line"
        />

        {/* Brass dispatches overlay stroke */}
        <path
          d={dispLine}
          fill="none"
          stroke="#D9A53A"
          strokeWidth="2.2"
          strokeDasharray="6 4"
          strokeLinecap="round"
          className="animate-draw-line"
        />

        {/* Hover vertical crosshair */}
        {activePt && (
          <line
            x1={activePt.x}
            y1={padT}
            x2={activePt.x}
            y2={padT + chartH}
            stroke="#050506"
            strokeOpacity="0.14"
            strokeDasharray="3 3"
          />
        )}

        {/* Interactive columns & points */}
        {data.map((d, i) => {
          const pG = gmvPts[i];
          const pD = dispPts[i];
          const isActive = activeIdx === i;
          const colW = chartW / Math.max(data.length - 1, 1);
          return (
            <g key={d.label}>
              <rect
                x={pG.x - colW / 2}
                y={padT}
                width={colW}
                height={chartH + padB}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHovered(i)}
              />
              <circle
                cx={pG.x}
                cy={pG.y}
                r={isActive ? 5.5 : 3}
                fill={isActive ? '#050506' : '#7D885E'}
                stroke="#FFFFFF"
                strokeWidth="2"
                className="transition-all duration-200"
              />
              <circle
                cx={pD.x}
                cy={pD.y}
                r={isActive ? 4.5 : 2.5}
                fill="#D9A53A"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className="transition-all duration-200"
              />
              <text
                x={pG.x}
                y={H - 8}
                textAnchor="middle"
                className={`font-mono text-[10px] transition-colors ${isActive ? 'fill-[#050506] font-bold' : 'fill-[#7B7E76]'}`}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export interface PieSlice {
  label: string;
  value: number;
  color: string;
  detail?: string;
}

/** Animated Interactive SVG Donut / Pie Chart with center readout and clickable/hoverable legend. */
export function DonutPieChart({
  slices,
  centerLabel,
  centerValue,
  size = 196,
  thickness = 28,
}: {
  slices: PieSlice[];
  centerLabel: string;
  centerValue: string;
  size?: number;
  thickness?: number;
}) {
  const [active, setActive] = useState<number | null>(null);
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  const r = (size - thickness) / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = slices.map((s) => {
    const pct = s.value / total;
    const len = pct * circumference;
    const seg = { ...s, pct, len, dashOffset: -offset };
    offset += len;
    return seg;
  });

  const activeSlice = active !== null ? segments[active] : null;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="animate-donut -rotate-90"
          role="img"
          aria-label={centerLabel}
        >
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F3EE" strokeWidth={thickness} />
          {segments.map((seg, idx) => {
            const isActive = active === idx;
            return (
              <circle
                key={seg.label}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={isActive ? thickness + 5 : thickness}
                strokeDasharray={`${Math.max(seg.len - 2.5, 1)} ${circumference}`}
                strokeDashoffset={seg.dashOffset}
                strokeLinecap="butt"
                className="cursor-pointer transition-all duration-300"
                style={{ opacity: active === null || isActive ? 1 : 0.45 }}
                onMouseEnter={() => setActive(idx)}
                onMouseLeave={() => setActive(null)}
              />
            );
          })}
        </svg>

        {/* Center live readout */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-xl font-bold text-[#050506] transition-all">
            {activeSlice ? `${Math.round(activeSlice.pct * 100)}%` : centerValue}
          </span>
          <span className="max-w-[100px] truncate text-[11px] font-medium text-[#64675F]">
            {activeSlice ? activeSlice.label : centerLabel}
          </span>
        </div>
      </div>

      {/* Interactive Legend */}
      <div className="w-full space-y-2">
        {segments.map((seg, idx) => {
          const isActive = active === idx;
          return (
            <button
              key={seg.label}
              type="button"
              onMouseEnter={() => setActive(idx)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(isActive ? null : idx)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-left transition-all duration-200 ${
                isActive
                  ? 'border-[#050506] bg-[#FAFAF8] shadow-xs'
                  : 'border-transparent bg-transparent hover:border-[#E8E8E2] hover:bg-[#FAFAF8]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: seg.color }} />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[#050506]">{seg.label}</p>
                  {seg.detail && <p className="truncate text-[11px] text-[#64675F]">{seg.detail}</p>}
                </div>
              </div>
              <div className="ml-2 text-right font-mono">
                <p className="text-xs font-bold text-[#050506]">{Math.round(seg.pct * 100)}%</p>
                <p className="text-[10px] text-[#64675F]">{seg.value.toLocaleString('en-IN')}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface BarGroup {
  label: string;
  primary: number;
  secondary: number;
  primaryLabel?: string;
  secondaryLabel?: string;
}

/** Animated Grouped Bar Graph (Olive + Brass / Black) with interactive hover values. */
export function GroupedBarChart({
  data,
  primaryName,
  secondaryName,
  primaryColor = '#7D885E',
  secondaryColor = '#D9A53A',
  unitPrefix = '',
  unitSuffix = '',
}: {
  data: BarGroup[];
  primaryName: string;
  secondaryName: string;
  primaryColor?: string;
  secondaryColor?: string;
  unitPrefix?: string;
  unitSuffix?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxVal = Math.max(...data.flatMap((d) => [d.primary, d.secondary]), 1) * 1.12;
  const active = hovered !== null ? data[hovered] : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-medium text-[#050506]">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: primaryColor }} />
            {primaryName}
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-[#64675F]">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: secondaryColor }} />
            {secondaryName}
          </span>
        </div>
        {active ? (
          <span className="rounded-full bg-[#050506] px-3 py-1 font-mono text-[11px] font-medium text-white">
            {active.label}: {unitPrefix}
            {active.primary}
            {unitSuffix} / {unitPrefix}
            {active.secondary}
            {unitSuffix}
          </span>
        ) : (
          <span className="font-mono text-[11px] text-[#7B7E76]">Hover any bar for exact metrics</span>
        )}
      </div>

      <div className="grid h-48 items-end gap-3 border-b border-[#E8E8E2] pb-2 pt-4" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
        {data.map((d, idx) => {
          const pH = Math.max(8, (d.primary / maxVal) * 100);
          const sH = Math.max(8, (d.secondary / maxVal) * 100);
          const isHover = hovered === idx;
          return (
            <div
              key={d.label}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              className="group flex h-full cursor-pointer flex-col items-center justify-end gap-2"
            >
              <div className="flex h-full w-full items-end justify-center gap-1.5 px-1">
                <div
                  className="animate-bar-rise w-full max-w-[22px] rounded-t-md transition-opacity duration-200"
                  style={{
                    height: `${pH}%`,
                    backgroundColor: primaryColor,
                    opacity: hovered === null || isHover ? 1 : 0.45,
                    animationDelay: `${idx * 65}ms`,
                  }}
                />
                <div
                  className="animate-bar-rise w-full max-w-[22px] rounded-t-md transition-opacity duration-200"
                  style={{
                    height: `${sH}%`,
                    backgroundColor: secondaryColor,
                    opacity: hovered === null || isHover ? 1 : 0.45,
                    animationDelay: `${idx * 65 + 90}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 text-center" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
        {data.map((d, idx) => (
          <span
            key={d.label}
            className={`truncate font-mono text-[11px] transition-colors ${hovered === idx ? 'font-bold text-[#050506]' : 'text-[#64675F]'}`}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
