/**
 * Where the login tokens live. Your backend returns tokens in the JSON body (not cookies), so the
 * browser has to keep them somewhere. The choices:
 *
 *  'persistent' (owner and technician apps)
 *     access token  -> memory only (gone on reload)
 *     refresh token -> localStorage (so a reload can sign you back in)
 *
 *  'session' (admin app)
 *     access token  -> sessionStorage (cleared when the tab closes)
 *     no refresh token (the admin login has no refresh endpoint)
 *
 * Every storage call is wrapped in try/catch because private windows and blocked site data can throw.
 */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface TokenPair {
  accessToken: string;
  refreshToken?: string | null;
}

export interface TokenStore {
  getAccess(): string | null;
  getRefresh(): string | null;
  set(tokens: TokenPair): void;
  clear(): void;
  /** Runs `listener` whenever tokens are set or cleared. Returns an unsubscribe function. */
  subscribe(listener: () => void): () => void;
}

export interface TokenStoreOptions {
  /** Keeps apps apart in storage, for example "uptime.owner". */
  namespace: string;
  mode: 'persistent' | 'session';
  /** Only for tests. */
  storage?: { local?: StorageLike; session?: StorageLike };
}

function browserStorage(kind: 'localStorage' | 'sessionStorage'): StorageLike | undefined {
  try {
    const s = (globalThis as Record<string, unknown>)[kind] as StorageLike | undefined;
    return s ?? undefined;
  } catch {
    return undefined;
  }
}

function safeGet(s: StorageLike | undefined, key: string): string | null {
  try {
    return s ? s.getItem(key) : null;
  } catch {
    return null;
  }
}
function safeSet(s: StorageLike | undefined, key: string, value: string): void {
  try {
    s?.setItem(key, value);
  } catch {
    /* storage unavailable: the app still works for this tab */
  }
}
function safeRemove(s: StorageLike | undefined, key: string): void {
  try {
    s?.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function createTokenStore(opts: TokenStoreOptions): TokenStore {
  const local = opts.storage?.local ?? browserStorage('localStorage');
  const session = opts.storage?.session ?? browserStorage('sessionStorage');
  const refreshKey = `${opts.namespace}.refresh`;
  const accessKey = `${opts.namespace}.access`;

  let memoryAccess: string | null = null;
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((l) => l());

  return {
    getAccess() {
      return opts.mode === 'session' ? safeGet(session, accessKey) : memoryAccess;
    },
    getRefresh() {
      return opts.mode === 'persistent' ? safeGet(local, refreshKey) : null;
    },
    set(tokens) {
      if (opts.mode === 'session') {
        safeSet(session, accessKey, tokens.accessToken);
      } else {
        memoryAccess = tokens.accessToken;
        if (tokens.refreshToken) safeSet(local, refreshKey, tokens.refreshToken);
      }
      notify();
    },
    clear() {
      memoryAccess = null;
      safeRemove(session, accessKey);
      safeRemove(local, refreshKey);
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
