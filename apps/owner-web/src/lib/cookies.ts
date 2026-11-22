/**
 * Real browser HTTP cookie helpers for UPTIME Owner Web (DPDP Act 2023 compliant).
 * Essential cookies store authentication/security state; functional & analytics cookies
 * are only written after explicit user consent via CookieConsentBanner.
 */

export interface CookieConsent {
  essential: true;
  functional: boolean;
  analytics: boolean;
  updatedAt: string;
}

export const CONSENT_COOKIE = 'uptime_cookie_consent';
export const PLANT_COOKIE = 'uptime_plant_id';
export const SECTOR_COOKIE = 'uptime_sector';
export const LANG_COOKIE = 'uptime_lang';
export const CART_COOKIE = 'uptime_cart_count';

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const encodedName = `${encodeURIComponent(name)}=`;
  const parts = document.cookie.split(';');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(encodedName)) {
      try {
        return decodeURIComponent(trimmed.slice(encodedName.length));
      } catch {
        return trimmed.slice(encodedName.length);
      }
    }
  }
  return null;
}

export function setCookie(name: string, value: string, maxAgeDays = 180): void {
  if (typeof document === 'undefined') return;
  const maxAge = Math.max(0, Math.floor(maxAgeDays * 86400));
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; SameSite=Lax; max-age=${maxAge}`;
}

export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${encodeURIComponent(name)}=; Path=/; SameSite=Lax; max-age=0`;
}

export function readCookieConsent(): CookieConsent | null {
  const raw = getCookie(CONSENT_COOKIE);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    return {
      essential: true,
      functional: Boolean(parsed.functional),
      analytics: Boolean(parsed.analytics),
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveCookieConsent(consent: Omit<CookieConsent, 'essential' | 'updatedAt'>): CookieConsent {
  const full: CookieConsent = {
    essential: true,
    functional: consent.functional,
    analytics: consent.analytics,
    updatedAt: new Date().toISOString(),
  };
  setCookie(CONSENT_COOKIE, JSON.stringify(full), 180);
  if (!full.functional) {
    deleteCookie(PLANT_COOKIE);
    deleteCookie(SECTOR_COOKIE);
    deleteCookie(LANG_COOKIE);
    deleteCookie(CART_COOKIE);
  }
  return full;
}

export function setFunctionalCookie(name: string, value: string, maxAgeDays = 90): void {
  const consent = readCookieConsent();
  if (consent?.functional) {
    setCookie(name, value, maxAgeDays);
  }
}
