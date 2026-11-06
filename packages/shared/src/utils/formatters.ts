export function formatCurrencyInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function containsFullAadhaarNumber(input?: string | null): boolean {
  if (!input) return false;
  const cleaned = input.replace(/[\s-]/g, '');
  return /(?<!\d)\d{12}(?!\d)/.test(cleaned);
}
