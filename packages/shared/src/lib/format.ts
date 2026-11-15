/** India-first formatting, per docs/DESIGN.md: ₹1,00,000 not 100,000; DD/MM/YYYY; 10-digit phones. */

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const inrWithPaise = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** formatINR(1234567) -> "₹12,34,567". Pass { paise: true } for bills: "₹1,180.00". */
export function formatINR(amount: number | string | null | undefined, opts: { paise?: boolean } = {}): string {
  const n = typeof amount === 'string' ? Number(amount) : amount;
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return (opts.paise ? inrWithPaise : inr).format(n);
}

function toDate(value: string | number | Date | null | undefined): Date | null {
  if (value === null || value === undefined || value === '') return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "04/11/2026" in the Indian time zone. */
export function formatDate(value: string | number | Date | null | undefined): string {
  const d = toDate(value);
  if (!d) return '—';
  return d.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' });
}

/** "04/11/2026, 6:51 pm" in the Indian time zone. */
export function formatDateTime(value: string | number | Date | null | undefined): string {
  const d = toDate(value);
  if (!d) return '—';
  const date = d.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' });
  const time = d.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true });
  return `${date}, ${time}`;
}

/** Keeps the last 10 digits, dropping +91, 91 or a leading 0 that people type or paste. */
export function normalizeIndianMobile(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.length > 10) return digits.slice(-10);
  return digits;
}

/** Indian mobile numbers are 10 digits and start with 6, 7, 8 or 9. */
export function isValidIndianMobile(input: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizeIndianMobile(input));
}

/** "9876543210" -> "98765 43210". Anything that is not 10 digits is returned as typed. */
export function formatPhone(input: string | null | undefined): string {
  if (!input) return '';
  const d = normalizeIndianMobile(input);
  return d.length === 10 ? `${d.slice(0, 5)} ${d.slice(5)}` : input;
}

export function isValidPincode(input: string): boolean {
  return /^[1-9]\d{5}$/.test(input.trim());
}
