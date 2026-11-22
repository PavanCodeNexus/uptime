import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

/** Small building blocks shared by every screen, styled with the UPTIME Figma design tokens. */

export function UptimeEmblem({
  size = 'md',
  accent = 'teal',
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  accent?: 'teal' | 'orange';
}) {
  const dims = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-24 h-24 rounded-3xl',
  }[size];
  const svgDims = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
  }[size];
  const arrowColor = accent === 'orange' ? '#F97316' : '#00D4AA';
  const ringColor = accent === 'orange' ? '#00D4AA' : '#38BDF8';

  return (
    <div className={`${dims} bg-black flex items-center justify-center text-white shadow-lg border border-slate-800 shrink-0`} aria-hidden="true">
      <svg className={svgDims} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#000000" />
        <path d="M22 24 V 55 C 22 74, 78 74, 78 55 V 24" stroke="#FFFFFF" strokeWidth="13" strokeLinecap="round" fill="none" />
        <path d="M64 38 L78 20 L90 38" stroke={arrowColor} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="50" cy="46" r="11" stroke={ringColor} strokeWidth="6" fill="none" strokeDasharray="7 5" />
      </svg>
    </div>
  );
}

export function Button({
  variant = 'primary',
  loading,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
}) {
  const look =
    variant === 'primary'
      ? 'bg-slate-900 hover:bg-black text-white shadow-sm'
      : variant === 'danger'
        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
        : variant === 'secondary'
          ? 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-xs'
          : 'text-slate-700 hover:bg-slate-100';
  return (
    <button
      type="button"
      {...rest}
      disabled={disabled || loading}
      className={`min-h-tap inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all disabled:opacity-60 ${look} ${className}`}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
}

export function TextField({
  label,
  hint,
  error,
  id,
  className = '',
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string | null }) {
  const inputId = id ?? `f-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <input
        id={inputId}
        {...rest}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
        className={`min-h-tap rounded-xl border bg-slate-50 px-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 ${
          error ? 'border-rose-500 bg-rose-50/40' : 'border-slate-200'
        } ${className}`}
      />
      {error ? (
        <p id={`${inputId}-err`} className="text-xs font-semibold text-rose-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-[11px] text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'warning' | 'danger' | 'success'; children: ReactNode }) {
  const look = {
    info: 'bg-blue-50 text-blue-900 border-blue-200',
    warning: 'bg-amber-50 text-amber-900 border-amber-200',
    danger: 'bg-rose-50 text-rose-900 border-rose-200',
    success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  }[tone];
  const icon = {
    info: 'fa-circle-info text-blue-600',
    warning: 'fa-triangle-exclamation text-amber-600',
    danger: 'fa-circle-exclamation text-rose-600',
    success: 'fa-circle-check text-emerald-600',
  }[tone];
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={`flex items-start gap-2.5 rounded-2xl border px-3.5 py-2.5 text-xs sm:text-sm font-medium ${look}`}>
      <i className={`fa-solid ${icon} mt-0.5 shrink-0`} aria-hidden="true"></i>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function BrandMark({ appName, accent = 'teal' }: { appName: string; accent?: 'teal' | 'orange' }) {
  return (
    <div className="flex items-center gap-3">
      <UptimeEmblem size="md" accent={accent} />
      <div>
        <p className="text-sm font-display font-black uppercase tracking-tight text-slate-900">UPTIME</p>
        <p className="text-[11px] font-mono font-semibold text-slate-500">{appName}</p>
      </div>
    </div>
  );
}
