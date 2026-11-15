import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { createStore, useStore, type StoreApi } from 'zustand';
import type { AuthSession, AuthState } from './session';

interface Ctx {
  session: AuthSession;
  store: StoreApi<AuthState>;
}
const AuthContext = createContext<Ctx | null>(null);

/** Puts the sign-in state in a Zustand store so any screen can read it. Restores the session once on start. */
export function AuthProvider({ session, children }: { session: AuthSession; children: ReactNode }) {
  const value = useMemo<Ctx>(() => {
    const store = createStore<AuthState>(() => session.getState());
    session.subscribe(() => store.setState(session.getState(), true));
    return { session, store };
  }, [session]);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return; // React StrictMode runs effects twice in dev
    started.current = true;
    void session.restore();
  }, [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** The current sign-in state plus the actions (sendOtp, verifyOtp, logout...). */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>.');
  const state = useStore(ctx.store);
  return { ...state, session: ctx.session };
}

/** Wrap protected screens. Sends signed-out people to /login and remembers where they were going. */
export function RequireAuth({ children, loginPath = '/login' }: { children: ReactNode; loginPath?: string }) {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'loading') {
    return (
      <div className="grid min-h-screen place-items-center text-fg-2" role="status">
        Loading...
      </div>
    );
  }
  if (status === 'anonymous') return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}
