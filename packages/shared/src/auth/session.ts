import { authApi, type AccountKind } from '../api/auth';
import { errorMessage } from '../lib/errors';
import type { HttpClient } from '../lib/http';
import type { TokenStore } from '../lib/tokens';
import { isNewUser, type UserDTO } from '../types/models';

export type AuthStatus = 'loading' | 'anonymous' | 'authenticated';

export interface AuthState {
  status: AuthStatus;
  user: UserDTO | null;
  /** True right after a phone number created a brand new account (ask for name and details). */
  needsProfile: boolean;
  /** Admin app only: the 5-minute token that links step 1 (password) to step 2 (code). */
  temp2faToken: string | null;
  /** The signed-in admin, since the admin reply has no UserDTO. */
  admin: { id: number; email: string; fullName: string; role: string } | null;
}

export interface AuthSessionOptions {
  http: HttpClient;
  tokens: TokenStore;
  /** Which account type this app signs in as. Admin app passes 'ADMIN'. */
  kind: AccountKind | 'ADMIN';
}

/** A signed-in name still holding the placeholder the backend gives new accounts. */
function looksLikePlaceholderName(u: UserDTO): boolean {
  const n = (u.fullName ?? '').trim().toLowerCase();
  return n === '' || n === 'new user' || n === 'user' || n.startsWith('user ') || /^user[\s_-]?\d+$/.test(n);
}

/**
 * Sign-in logic that does not depend on React. A thin store (Zustand) wraps this in each app.
 * Every method either resolves, or throws an ApiError whose `message` is safe to show on screen.
 */
export function createAuthSession({ http, tokens, kind }: AuthSessionOptions) {
  let state: AuthState = { status: 'loading', user: null, needsProfile: false, temp2faToken: null, admin: null };
  const listeners = new Set<() => void>();
  const set = (patch: Partial<AuthState>) => {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  };
  const anonymous = (extra: Partial<AuthState> = {}) =>
    set({ status: 'anonymous', user: null, needsProfile: false, temp2faToken: null, admin: null, ...extra });

  return {
    getState: () => state,
    subscribe(l: () => void) {
      listeners.add(l);
      return () => listeners.delete(l);
    },

    /**
     * Called once when the app opens. Owner/technician: a saved refresh token is traded for a new session
     * by the http client when /auth/me answers 401. Admin: the token lives in sessionStorage; no refresh exists.
     */
    async restore(): Promise<void> {
      if (kind === 'ADMIN') {
        const token = tokens.getAccess();
        if (!token) return anonymous();
        try {
          const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number };
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            tokens.clear();
            return anonymous();
          }
        } catch {
          // Unreadable token: let the first admin call decide.
        }
        return set({ status: 'authenticated' });
      }
      if (!tokens.getAccess() && !tokens.getRefresh()) return anonymous();
      try {
        const user = await authApi.me(http);
        set({ status: 'authenticated', user, needsProfile: false });
      } catch {
        tokens.clear();
        anonymous();
      }
    },

    async sendOtp(phone: string): Promise<void> {
      await authApi.sendOtp(http, phone);
    },

    async verifyOtp(phone: string, otp: string): Promise<void> {
      if (kind === 'ADMIN') throw new Error('Use adminLogin for the admin app.');
      const res = await authApi.verifyOtp(http, phone, otp, kind);
      tokens.set({ accessToken: res.accessToken, refreshToken: res.refreshToken });
      set({
        status: 'authenticated',
        user: res.user,
        needsProfile: isNewUser(res) || looksLikePlaceholderName(res.user),
      });
    },

    async saveProfile(body: Parameters<typeof authApi.updateProfile>[1]): Promise<void> {
      const user = await authApi.updateProfile(http, body);
      set({ user, needsProfile: false });
    },

    skipProfile() {
      set({ needsProfile: false });
    },

    async adminLogin(email: string, password: string): Promise<void> {
      const step = await authApi.adminLogin(http, email.trim(), password);
      set({ temp2faToken: step.temp2faToken });
    },

    async adminVerify(totpCode: string): Promise<void> {
      const t = state.temp2faToken;
      if (!t) throw new Error('Sign in with your password first.');
      const res = await authApi.adminVerify2fa(http, t, totpCode);
      tokens.set({ accessToken: res.accessToken });
      set({ status: 'authenticated', temp2faToken: null, admin: res.admin });
    },

    /** Go back from the code step to the password step (the 5-minute token expired or was mistyped). */
    adminBack() {
      set({ temp2faToken: null });
    },

    async logout(): Promise<void> {
      const refresh = tokens.getRefresh();
      try {
        if (kind !== 'ADMIN' && tokens.getAccess()) await authApi.logout(http, refresh);
      } catch {
        // Signing out must always work locally, even if the server is unreachable.
      }
      tokens.clear();
      anonymous();
    },

    /** Called by the http client when a refresh fails. */
    expire() {
      tokens.clear();
      anonymous();
    },

    errorMessage,
  };
}

export type AuthSession = ReturnType<typeof createAuthSession>;
