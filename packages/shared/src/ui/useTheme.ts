import { useCallback, useEffect, useState } from 'react';

export type ThemeChoice = 'system' | 'light' | 'dark';
const KEY = 'uptime.theme';

function read(): ThemeChoice {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}

function apply(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', choice);
}

/** Light, dark or follow-the-system. The choice is remembered on this device. */
export function useTheme(): { theme: ThemeChoice; cycle: () => void } {
  const [theme, setTheme] = useState<ThemeChoice>(read);

  useEffect(() => {
    apply(theme);
  }, [theme]);

  const cycle = useCallback(() => {
    setTheme((t) => {
      const next: ThemeChoice = t === 'system' ? 'light' : t === 'light' ? 'dark' : 'system';
      try {
        if (next === 'system') localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, next);
      } catch {
        /* storage blocked: the choice lasts until reload */
      }
      return next;
    });
  }, []);

  return { theme, cycle };
}
