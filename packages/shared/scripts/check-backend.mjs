#!/usr/bin/env node
/**
 * Contract check: asks your RUNNING backend a few questions and prints the answers.
 * It settles the details that can only be confirmed by running the code:
 *   - what the "new user" flag in the login reply is really called
 *   - whether a bad or expired token gets 401 or 403
 *   - the exact field names of a job and of an AI copilot step
 *   - whether the browser (ports 3000, 3001, 3002) is allowed to call the backend
 *
 * Run it from the repo root while the backend is running:   npm run check:backend
 * Optional settings:  API_BASE_URL=http://localhost:8080  TEST_PHONE=9876543210  TEST_OTP=123456
 *
 * It creates one test account and one test job in the DEV database (in memory, wiped on restart).
 * It sends nothing anywhere except your own backend.
 */
const BASE = (process.env.API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');
const PHONE = process.env.TEST_PHONE || '9876543210';
const OTP = process.env.TEST_OTP || '123456';

const lines = [];
let problems = 0;
const say = (s = '') => {
  lines.push(s);
  console.log(s);
};
const ok = (s) => say(`  OK   ${s}`);
const info = (s) => say(`  ..   ${s}`);
const bad = (s) => {
  problems++;
  say(`  !!   ${s}`);
};

async function call(method, path, { token, body, headers } = {}) {
  const h = { Accept: 'application/json', ...headers };
  if (body !== undefined) h['Content-Type'] = 'application/json';
  if (token) h.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(BASE + path, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
    const text = await res.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      /* not JSON */
    }
    return { status: res.status, ok: res.ok, json, text, headers: res.headers };
  } catch (e) {
    return { status: 0, ok: false, json: null, text: String(e && e.message ? e.message : e), headers: new Headers() };
  }
}

const keys = (o) => (o && typeof o === 'object' ? Object.keys(o).sort() : []);

say(`UPTIME backend contract check  (${new Date().toISOString()})`);
say(`Backend: ${BASE}`);
say();

// 1. Health
say('1. Is the backend up?');
const health = await call('GET', '/api/v1/health');
if (health.status === 0) {
  bad(`Cannot reach ${BASE}. Start the backend first, then run this again. (${health.text})`);
  process.exit(1);
}
health.ok ? ok(`GET /api/v1/health -> ${health.status}`) : bad(`GET /api/v1/health -> ${health.status}`);
info(`reply: ${health.text.slice(0, 200)}`);

// 2. Login
say();
say('2. Login with a phone code');
const sent = await call('POST', '/api/v1/auth/send-otp', { body: { phone: PHONE, purpose: 'LOGIN' } });
sent.ok ? ok(`send-otp -> ${sent.status}`) : bad(`send-otp -> ${sent.status} ${sent.text.slice(0, 160)}`);
const verified = await call('POST', '/api/v1/auth/verify-otp', { body: { phone: PHONE, otp: OTP, purpose: 'LOGIN', userType: 'OWNER' } });
let token = null;
let refresh = null;
if (!verified.ok) {
  bad(`verify-otp -> ${verified.status} ${verified.text.slice(0, 200)}  (is the backend in the dev profile? the code is 123456)`);
} else {
  const d = verified.json?.data ?? {};
  token = d.accessToken ?? null;
  refresh = d.refreshToken ?? null;
  ok(`verify-otp -> ${verified.status}`);
  info(`reply data keys: ${keys(d).join(', ')}`);
  const flag = 'newUser' in d ? 'newUser' : 'isNewUser' in d ? 'isNewUser' : null;
  flag ? ok(`FINDING 1: the new-user flag is called "${flag}" (value ${d[flag]})`) : bad('FINDING 1: no new-user flag found in the login reply');
  info(`user keys: ${keys(d.user).join(', ')}`);
  info(`userType: ${d.user?.userType}`);
}

// 3. Tokens
say();
say('3. What happens with a bad or missing token?');
const noToken = await call('GET', '/api/v1/jobs');
const badToken = await call('GET', '/api/v1/jobs', { token: 'not.a.real.token' });
info(`no token        -> HTTP ${noToken.status}  body: ${noToken.text ? noToken.text.slice(0, 100) : '(empty)'}`);
info(`garbage token   -> HTTP ${badToken.status}  body: ${badToken.text ? badToken.text.slice(0, 100) : '(empty)'}`);
ok(`FINDING 2: a bad or expired token gets HTTP ${badToken.status}. The app refreshes on 401 and on an empty 403.`);

if (token) {
  const me = await call('GET', '/api/v1/auth/me', { token });
  me.ok ? ok(`GET /auth/me with the token -> ${me.status}`) : bad(`GET /auth/me -> ${me.status}`);

  say();
  say('4. Refresh token (should work once only)');
  if (refresh) {
    const r1 = await call('POST', '/api/v1/auth/refresh-token', { body: { refreshToken: refresh } });
    r1.ok ? ok(`first use -> ${r1.status}, new keys: ${keys(r1.json?.data).join(', ')}`) : bad(`first use -> ${r1.status} ${r1.text.slice(0, 160)}`);
    const r2 = await call('POST', '/api/v1/auth/refresh-token', { body: { refreshToken: refresh } });
    !r2.ok ? ok(`second use of the same token is refused (${r2.status}), as expected`) : bad('the same refresh token worked twice');
    if (r1.ok && r1.json?.data?.accessToken) token = r1.json.data.accessToken;
  }

  say();
  say('5. A job: exact field names');
  const created = await call('POST', '/api/v1/jobs', {
    token,
    body: {
      industry: 'AUTOMOTIVE',
      equipmentSummary: 'Contract check test job',
      problemDescription: 'Created by npm run check:backend. Safe to ignore.',
      urgency: 'NORMAL',
      resolutionPath: 'DIRECT_BOOKING',
      ownerLat: 12.9716,
      ownerLng: 77.5946,
      ownerAddress: 'Test address',
      ownerCity: 'Bengaluru',
    },
  });
  if (!created.ok) {
    bad(`POST /jobs -> ${created.status} ${created.text.slice(0, 200)}`);
  } else {
    const d = created.json?.data ?? {};
    const job = d.job ?? {};
    ok(`POST /jobs -> ${created.status}`);
    info(`reply keys: ${keys(d).join(', ')}`);
    info(`job.status right after creation: "${job.status}"`);
    d.arrivalOtpPlaintextForOwner ? ok('arrival code is returned once as arrivalOtpPlaintextForOwner') : bad('arrivalOtpPlaintextForOwner missing');
    'arrivalOtp' in job ? info('job JSON includes "arrivalOtp" (a hash). The app never reads or shows it.') : info('job JSON has no arrivalOtp field');
    const expected = ['id', 'jobNumber', 'ownerId', 'industry', 'equipmentSummary', 'problemDescription', 'urgency', 'status', 'resolutionPath', 'ownerLat', 'ownerLng', 'laborCharge', 'partsCharge', 'discountAmount', 'gstAmount', 'totalAmount', 'isLocked', 'otpVerified', 'createdAt'];
    const missing = expected.filter((k) => !(k in job));
    missing.length ? bad(`job is missing fields the app expects: ${missing.join(', ')}`) : ok('all job fields the app expects are present');
    info(`all job keys: ${keys(job).join(', ')}`);
  }

  say();
  say('6. AI copilot step: exact field names');
  const cop = await call('POST', '/api/v1/ai/copilot/1', { token });
  cop.ok ? ok(`POST /ai/copilot/1 -> ${cop.status}, keys: ${keys(cop.json?.data).join(', ')}`) : bad(`copilot -> ${cop.status} ${cop.text.slice(0, 160)}`);
  const diag = await call('POST', '/api/v1/ai/diagnose', { token, body: { industry: 'AUTOMOTIVE', description: 'Engine will not start' } });
  diag.ok ? ok(`POST /ai/diagnose -> ${diag.status}, keys: ${keys(diag.json?.data).join(', ')}, fallbackUsed=${diag.json?.data?.fallbackUsed}`) : bad(`diagnose -> ${diag.status} ${diag.text.slice(0, 160)}`);
}

// 7. CORS
say();
say('7. May the three apps call the backend from the browser?');
for (const origin of ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002']) {
  const pre = await call('OPTIONS', '/api/v1/jobs', {
    headers: { Origin: origin, 'Access-Control-Request-Method': 'GET', 'Access-Control-Request-Headers': 'authorization,content-type' },
  });
  const allow = pre.headers.get('access-control-allow-origin');
  pre.ok && allow === origin ? ok(`${origin} is allowed`) : bad(`${origin} is NOT allowed (HTTP ${pre.status}, allow-origin: ${allow})`);
}

say();
say(problems === 0 ? 'Result: all checks passed.' : `Result: ${problems} item(s) marked !! above need a look.`);
say('Copy everything above into the chat so the findings can be recorded.');
process.exit(problems === 0 ? 0 : 1);
