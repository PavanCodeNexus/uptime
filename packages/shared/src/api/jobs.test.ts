import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { HttpClient } from '../lib/http';
import { aiApi, jobsApi, matchingApi, pathFromRecommendation, stripSecrets } from './jobs';

type Call = { method: string; path: string; body?: unknown };
function fake(reply: (c: Call) => unknown) {
  const calls: Call[] = [];
  const run = async (method: string, path: string, body?: unknown) => {
    const c = { method, path, body };
    calls.push(c);
    return reply(c);
  };
  const http = {
    baseUrl: 'x',
    request: async () => undefined,
    get: (p: string) => run('GET', p),
    post: (p: string, b?: unknown) => run('POST', p, b),
    put: (p: string, b?: unknown) => run('PUT', p, b),
    del: (p: string) => run('DELETE', p),
  } as unknown as HttpClient;
  return { http, calls };
}
const job = { id: 7, jobNumber: 'JOB-1', arrivalOtp: '$2a$10$hash', status: 'CREATED' };

test('stripSecrets removes the arrival code hash and keeps everything else', () => {
  const clean = stripSecrets(job);
  assert.equal('arrivalOtp' in clean, false);
  assert.equal(clean.jobNumber, 'JOB-1');
});

test('the hash never leaves the API layer: list, get, create, choosePath and escalate', async () => {
  const { http } = fake((c) => {
    if (c.path === '/api/v1/jobs' && c.method === 'GET') return [job];
    if (c.path === '/api/v1/jobs' && c.method === 'POST') return { job, arrivalOtpPlaintextForOwner: '482916' };
    return job;
  });
  assert.equal('arrivalOtp' in (await jobsApi.list(http))[0], false);
  assert.equal('arrivalOtp' in (await jobsApi.get(http, 7)), false);
  const created = await jobsApi.create(http, { industry: 'AUTOMOTIVE', equipmentSummary: 'x', problemDescription: 'y', ownerLat: 1, ownerLng: 2 });
  assert.equal('arrivalOtp' in created.job, false);
  assert.equal(created.arrivalOtpPlaintextForOwner, '482916');
  assert.equal('arrivalOtp' in (await jobsApi.choosePath(http, 7, 'DIRECT_BOOKING')), false);
  assert.equal('arrivalOtp' in (await jobsApi.escalate(http, 7, 'DIRECT_BOOKING', 'r')), false);
});

test('request shapes match the backend controllers', async () => {
  const { http, calls } = fake(() => ({}));
  await jobsApi.choosePath(http, 7, 'AI_COPILOT').catch(() => {});
  await jobsApi.escalate(http, 7, 'DIRECT_BOOKING', 'Copilot did not fix it').catch(() => {});
  await aiApi.diagnose(http, 'AUTOMOTIVE', 'will not start');
  await aiApi.copilotStart(http, 7);
  await aiApi.copilotNext(http, 7, 3);
  await matchingApi.candidates(http, 7);
  assert.deepEqual(calls.map((c) => `${c.method} ${c.path}`), [
    'POST /api/v1/jobs/7/choose-path',
    'POST /api/v1/jobs/7/escalate',
    'POST /api/v1/ai/diagnose',
    'POST /api/v1/ai/copilot/7',
    'POST /api/v1/ai/copilot/7/next',
    'GET /api/v1/matching/jobs/7/candidates',
  ]);
  assert.deepEqual(calls[0].body, { resolutionPath: 'AI_COPILOT' });
  assert.deepEqual(calls[1].body, { targetPath: 'DIRECT_BOOKING', reason: 'Copilot did not fix it' });
  assert.deepEqual(calls[2].body, { industry: 'AUTOMOTIVE', description: 'will not start' });
  assert.deepEqual(calls[4].body, { stepNumber: 3 });
});

test('the diagnosis wording FIELD_TECH becomes the job path DIRECT_BOOKING', () => {
  assert.equal(pathFromRecommendation('FIELD_TECH'), 'DIRECT_BOOKING');
  assert.equal(pathFromRecommendation('ai_copilot'), 'AI_COPILOT');
  assert.equal(pathFromRecommendation('VIDEO_CONSULT'), 'VIDEO_CONSULT');
  assert.equal(pathFromRecommendation('something else'), undefined);
  assert.equal(pathFromRecommendation(undefined), undefined);
});
