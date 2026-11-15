import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ApiError } from './errors';
import { createHttpClient } from './http';
import { createTokenStore, type StorageLike } from './tokens';

function memStorage(): StorageLike & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}

const ok = (data: unknown) =>
  new Response(JSON.stringify({ success: true, data, message: 'OK' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
const fail = (status: number, code?: string, message = 'nope') =>
  new Response(code ? JSON.stringify({ success: false, error: { code, message } }) : '', { status });

type Call = { url: string; method: string; auth: string | undefined; body?: string };

/** A fake backend: `handler` decides each reply, and every call is recorded. */
function setup(handler: (c: Call) => Response | Promise<Response>, opts: { refreshPath?: string | null; mode?: 'persistent' | 'session' } = {}) {
  const local = memStorage();
  const session = memStorage();
  const tokens = createTokenStore({ namespace: 't', mode: opts.mode ?? 'persistent', storage: { local, session } });
  const calls: Call[] = [];
  let expired = 0;
  const http = createHttpClient({
    baseUrl: 'http://api.test/',
    tokens,
    refreshPath: opts.refreshPath === undefined ? '/api/v1/auth/refresh-token' : opts.refreshPath,
    onSessionExpired: () => void expired++,
    fetchImpl: async (input, init) => {
      const headers = (init?.headers ?? {}) as Record<string, string>;
      const call: Call = { url: String(input), method: init?.method ?? 'GET', auth: headers.Authorization, body: init?.body as string | undefined };
      calls.push(call);
      return handler(call);
    },
  });
  return { http, tokens, calls, local, session, expired: () => expired };
}

test('unwraps the envelope and sends the bearer token', async () => {
  const s = setup(() => ok({ hello: 'world' }));
  s.tokens.set({ accessToken: 'A1', refreshToken: 'R1' });
  const data = await s.http.get<{ hello: string }>('/api/v1/users/me');
  assert.deepEqual(data, { hello: 'world' });
  assert.equal(s.calls[0]?.url, 'http://api.test/api/v1/users/me');
  assert.equal(s.calls[0]?.auth, 'Bearer A1');
});

test('public calls (auth: false) never send a token', async () => {
  const s = setup(() => ok({}));
  s.tokens.set({ accessToken: 'A1', refreshToken: 'R1' });
  await s.http.post('/api/v1/auth/send-otp', { phone: '9876543210' }, { auth: false });
  assert.equal(s.calls[0]?.auth, undefined);
  assert.equal(s.calls[0]?.body, JSON.stringify({ phone: '9876543210' }));
});

test('a backend error becomes an ApiError with a friendly message', async () => {
  const s = setup(() => fail(401, 'AUTH_001', 'Invalid OTP code'));
  await assert.rejects(
    () => s.http.post('/api/v1/auth/verify-otp', {}, { auth: false }),
    (e: unknown) => e instanceof ApiError && e.code === 'AUTH_001' && e.status === 401 && e.message.startsWith('That code is not correct'),
  );
  assert.equal(s.calls.length, 1, 'a wrong OTP must not trigger a refresh');
});

test('an unknown error code falls back to the backend message', async () => {
  const s = setup(() => fail(400, 'WEIRD_999', 'Something specific'));
  await assert.rejects(() => s.http.get('/x'), (e: unknown) => e instanceof ApiError && e.message === 'Something specific');
});

test('expired token (empty 403): refreshes once, retries with the new token', async () => {
  const s = setup((c) => {
    if (c.url.endsWith('/auth/refresh-token')) return ok({ accessToken: 'A2', refreshToken: 'R2' });
    return c.auth === 'Bearer A2' ? ok({ jobs: [] }) : fail(403);
  });
  s.tokens.set({ accessToken: 'A1', refreshToken: 'R1' });
  const data = await s.http.get('/api/v1/jobs');
  assert.deepEqual(data, { jobs: [] });
  assert.deepEqual(s.calls.map((c) => c.url.replace('http://api.test', '')), ['/api/v1/jobs', '/api/v1/auth/refresh-token', '/api/v1/jobs']);
  assert.equal(s.tokens.getAccess(), 'A2');
  assert.equal(s.tokens.getRefresh(), 'R2', 'the rotated refresh token must be saved');
});

test('after a page reload (no access token, refresh token saved) the first call recovers', async () => {
  const s = setup((c) => {
    if (c.url.endsWith('/auth/refresh-token')) return ok({ accessToken: 'A9', refreshToken: 'R9' });
    return c.auth === 'Bearer A9' ? ok('fine') : fail(403);
  });
  s.local.setItem('t.refresh', 'R-old');
  assert.equal(await s.http.get('/api/v1/auth/me'), 'fine');
});

test('simultaneous expired requests share ONE refresh (refresh tokens work once)', async () => {
  let refreshCalls = 0;
  const s = setup(async (c) => {
    if (c.url.endsWith('/auth/refresh-token')) {
      refreshCalls++;
      await new Promise((r) => setTimeout(r, 10));
      return ok({ accessToken: 'A2', refreshToken: 'R2' });
    }
    return c.auth === 'Bearer A2' ? ok('done') : fail(401);
  });
  s.tokens.set({ accessToken: 'A1', refreshToken: 'R1' });
  const results = await Promise.all([s.http.get('/a'), s.http.get('/b'), s.http.get('/c')]);
  assert.deepEqual(results, ['done', 'done', 'done']);
  assert.equal(refreshCalls, 1);
});

test('refresh fails: tokens cleared, session-expired callback runs, AUTH_005 thrown', async () => {
  const s = setup((c) => (c.url.endsWith('/auth/refresh-token') ? fail(401, 'AUTH_004') : fail(401)));
  s.tokens.set({ accessToken: 'A1', refreshToken: 'R1' });
  await assert.rejects(() => s.http.get('/api/v1/jobs'), (e: unknown) => e instanceof ApiError && e.code === 'AUTH_005');
  assert.equal(s.tokens.getAccess(), null);
  assert.equal(s.tokens.getRefresh(), null);
  assert.equal(s.expired(), 1);
});

test('a 403 that carries a real code (AUTH_006) is a permission problem: no refresh', async () => {
  const s = setup(() => fail(403, 'AUTH_006', 'forbidden'));
  s.tokens.set({ accessToken: 'A1', refreshToken: 'R1' });
  await assert.rejects(() => s.http.get('/api/v1/admin/dashboard'), (e: unknown) => e instanceof ApiError && e.code === 'AUTH_006');
  assert.equal(s.calls.length, 1);
  assert.equal(s.tokens.getAccess(), 'A1', 'the session is still valid');
});

test('admin client (no refresh endpoint): expiry ends the session straight away', async () => {
  const s = setup(() => fail(401), { refreshPath: null, mode: 'session' });
  s.tokens.set({ accessToken: 'ADMIN' });
  assert.equal(s.session.data.get('t.access'), 'ADMIN', 'admin token lives in sessionStorage');
  await assert.rejects(() => s.http.get('/api/v1/admin/dashboard'), (e: unknown) => e instanceof ApiError && e.code === 'AUTH_005');
  assert.equal(s.tokens.getAccess(), null);
  assert.equal(s.expired(), 1);
});

test('network failure becomes a NETWORK error', async () => {
  const s = setup(() => {
    throw new TypeError('fetch failed');
  });
  await assert.rejects(() => s.http.get('/x', { auth: false }), (e: unknown) => e instanceof ApiError && e.code === 'NETWORK' && /Cannot reach the server/.test(e.message));
});

test('HTTP 429 without a body maps to RATE_001', async () => {
  const s = setup(() => fail(429));
  await assert.rejects(() => s.http.get('/x', { auth: false }), (e: unknown) => e instanceof ApiError && e.code === 'RATE_001');
});

test('owner/tech mode keeps the access token out of storage', () => {
  const s = setup(() => ok({}));
  s.tokens.set({ accessToken: 'A1', refreshToken: 'R1' });
  assert.equal(s.local.data.get('t.refresh'), 'R1');
  assert.equal(s.local.data.has('t.access'), false);
  assert.equal(s.session.data.size, 0);
});
