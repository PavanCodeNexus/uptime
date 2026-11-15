import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ApiError } from '../lib/errors';
import type { HttpClient } from '../lib/http';
import { createTokenStore, type StorageLike } from '../lib/tokens';
import { createAuthSession } from './session';

function mem(): StorageLike {
  const d = new Map<string, string>();
  return { getItem: (k) => d.get(k) ?? null, setItem: (k, v) => void d.set(k, v), removeItem: (k) => void d.delete(k) };
}
type Handler = (method: string, path: string, body: unknown) => unknown;
function fakeHttp(h: Handler): HttpClient & { log: string[] } {
  const log: string[] = [];
  const run = async (method: string, path: string, body?: unknown) => {
    log.push(`${method} ${path}`);
    return h(method, path, body);
  };
  return {
    baseUrl: 'http://x',
    log,
    request: (async (p: string) => run('GET', p)) as HttpClient['request'],
    get: ((p: string) => run('GET', p)) as HttpClient['get'],
    post: ((p: string, b?: unknown) => run('POST', p, b)) as HttpClient['post'],
    put: ((p: string, b?: unknown) => run('PUT', p, b)) as HttpClient['put'],
    del: ((p: string) => run('DELETE', p)) as HttpClient['del'],
  };
}
const user = (name: string) => ({ id: 1, fullName: name, phone: '9876543210', userType: 'OWNER' });
const mk = (h: Handler, kind: 'OWNER' | 'TECHNICIAN' | 'ADMIN' = 'OWNER', mode: 'persistent' | 'session' = 'persistent') => {
  const tokens = createTokenStore({ namespace: 't', mode, storage: { local: mem(), session: mem() } });
  const http = fakeHttp(h);
  return { tokens, http, auth: createAuthSession({ http, tokens, kind }) };
};

test('no saved tokens: restore leaves the user signed out and makes no request', async () => {
  const { auth, http } = mk(() => ({}));
  await auth.restore();
  assert.equal(auth.getState().status, 'anonymous');
  assert.deepEqual(http.log, []);
});

test('saved refresh token: restore asks /auth/me and signs in', async () => {
  const { auth, tokens } = mk((_m, p) => (p === '/api/v1/auth/me' ? user('Asha') : {}));
  tokens.set({ accessToken: '', refreshToken: 'r1' });
  await auth.restore();
  assert.equal(auth.getState().status, 'authenticated');
  assert.equal(auth.getState().user?.fullName, 'Asha');
});

test('restore failure clears tokens and signs out', async () => {
  const { auth, tokens } = mk(() => {
    throw new ApiError('AUTH_005', 401, 'expired');
  });
  tokens.set({ accessToken: 'a', refreshToken: 'r' });
  await auth.restore();
  assert.equal(auth.getState().status, 'anonymous');
  assert.equal(tokens.getRefresh(), null);
});

test('verifyOtp stores both tokens; a new account (newUser) needs a profile', async () => {
  const { auth, tokens, http } = mk(() => ({ accessToken: 'A', refreshToken: 'R', tokenType: 'Bearer', expiresIn: 1, newUser: true, user: user('New User') }));
  await auth.verifyOtp('9876543210', '123456');
  assert.equal(tokens.getAccess(), 'A');
  assert.equal(tokens.getRefresh(), 'R');
  assert.equal(auth.getState().needsProfile, true);
  assert.deepEqual(http.log, ['POST /api/v1/auth/verify-otp']);
});

test('the other spelling isNewUser works, and a returning user with a real name skips the profile step', async () => {
  const a = mk(() => ({ accessToken: 'A', refreshToken: 'R', user: user('Real Name'), isNewUser: true }));
  await a.auth.verifyOtp('9876543210', '123456');
  assert.equal(a.auth.getState().needsProfile, true);
  const b = mk(() => ({ accessToken: 'A', refreshToken: 'R', user: user('Real Name'), newUser: false }));
  await b.auth.verifyOtp('9876543210', '123456');
  assert.equal(b.auth.getState().needsProfile, false);
});

test('a returning user still holding the placeholder name is asked for a profile', async () => {
  const { auth } = mk(() => ({ accessToken: 'A', refreshToken: 'R', user: user('User 1234'), newUser: false }));
  await auth.verifyOtp('9876543210', '123456');
  assert.equal(auth.getState().needsProfile, true);
});

test('saveProfile updates the user and ends the profile step', async () => {
  const { auth } = mk((m) => (m === 'PUT' ? user('Asha K') : { accessToken: 'A', refreshToken: 'R', user: user('New User'), newUser: true }));
  await auth.verifyOtp('9876543210', '123456');
  await auth.saveProfile({ fullName: 'Asha K' });
  assert.equal(auth.getState().user?.fullName, 'Asha K');
  assert.equal(auth.getState().needsProfile, false);
});

test('wrong code: the error reaches the screen and the user stays signed out', async () => {
  const { auth } = mk(() => {
    throw new ApiError('AUTH_001', 400, 'Invalid OTP');
  });
  await auth.restore();
  await assert.rejects(auth.verifyOtp('9876543210', '000000'), (e: unknown) => e instanceof ApiError && e.code === 'AUTH_001');
  assert.equal(auth.getState().status, 'anonymous');
});

test('logout clears tokens even when the server is unreachable', async () => {
  let calls = 0;
  const { auth, tokens } = mk((_m, p) => {
    calls++;
    if (p.endsWith('/logout')) throw new ApiError('NETWORK', 0, 'offline');
    return { accessToken: 'A', refreshToken: 'R', user: user('Asha'), newUser: false };
  });
  await auth.verifyOtp('9876543210', '123456');
  await auth.logout();
  assert.equal(tokens.getAccess(), null);
  assert.equal(tokens.getRefresh(), null);
  assert.equal(auth.getState().status, 'anonymous');
  assert.equal(calls, 2);
});

test('admin: password step keeps the temp token, code step signs in with no refresh token', async () => {
  const { auth, tokens } = mk(
    (_m, p, body) => {
      if (p.endsWith('/admin/auth/login')) return { temp2faToken: 'T', expiresInSeconds: 300, requires2fa: true };
      assert.deepEqual(body, { temp2faToken: 'T', totpCode: '123456' });
      return { accessToken: 'ADM', expiresInSeconds: 1800, admin: { id: 1, email: 'admin@uptime.in', fullName: 'Admin', role: 'SUPER_ADMIN' } };
    },
    'ADMIN',
    'session',
  );
  await auth.adminLogin(' admin@uptime.in ', 'pw');
  assert.equal(auth.getState().temp2faToken, 'T');
  await auth.adminVerify('123456');
  assert.equal(auth.getState().status, 'authenticated');
  assert.equal(auth.getState().admin?.role, 'SUPER_ADMIN');
  assert.equal(tokens.getAccess(), 'ADM');
  assert.equal(tokens.getRefresh(), null);
  assert.equal(auth.getState().temp2faToken, null);
});

test('admin: code step without the password step is refused, and an expired saved token signs out', async () => {
  const { auth, tokens } = mk(() => ({}), 'ADMIN', 'session');
  await assert.rejects(auth.adminVerify('123456'));
  const payload = Buffer.from(JSON.stringify({ exp: 1 })).toString('base64url');
  tokens.set({ accessToken: `h.${payload}.s` });
  await auth.restore();
  assert.equal(auth.getState().status, 'anonymous');
  assert.equal(tokens.getAccess(), null);
});

test('subscribers are told about every change and can unsubscribe', async () => {
  const { auth } = mk(() => ({ accessToken: 'A', refreshToken: 'R', user: user('Asha'), newUser: false }));
  let n = 0;
  const off = auth.subscribe(() => n++);
  await auth.verifyOtp('9876543210', '123456');
  assert.equal(n, 1);
  off();
  auth.skipProfile();
  assert.equal(n, 1);
});
