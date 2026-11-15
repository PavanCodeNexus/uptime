import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

/** Small building blocks shared by every screen, styled with the design tokens. */

export function Button({
  variant = 'primary',
  loading,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; loading?: boolean }) {
  const look =
    variant === 'primary'
      ? 'bg-brand text-on-brand'
      : variant === 'secondary'
        ? 'border border-line-strong bg-surface text-fg'
        : 'text-brand-ink hover:bg-surface-2';
  return (
    <button
      type="button"
      {...rest}
      disabled={disabled || loading}
      className={`min-h-tap rounded-lg px-4 text-sm font-semibold disabled:opacity-60 ${look} ${className}`}
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
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string | null }) {
  const inputId = id ?? `f-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-fg-2">
        {label}
      </label>
      <input
        id={inputId}
        {...rest}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
        className={`min-h-tap rounded-lg border bg-surface px-3 text-base text-fg placeholder:text-fg-muted ${error ? 'border-danger' : 'border-line-strong'}`}
      />
      {error ? (
        <p id={`${inputId}-err`} className="text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-fg-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'warning' | 'danger' | 'success'; children: ReactNode }) {
  const look = {
    info: 'bg-surface-2 text-fg-2',
    warning: 'bg-warning-soft text-warning',
    danger: 'bg-danger-soft text-danger',
    success: 'bg-success-soft text-success',
  }[tone];
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={`rounded-lg px-3 py-2 text-sm ${look}`}>
      {children}
    </div>
  );
}

export function BrandMark({ appName }: { appName: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-lg font-bold text-accent" aria-hidden="true">
        &uarr;
      </span>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-ink">UPTIME</p>
        <p className="text-xs text-fg-muted">{appName}</p>
      </div>
    </div>
  );
}
