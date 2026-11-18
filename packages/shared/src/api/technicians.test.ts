import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { HttpClient } from '../lib/http';
import { adminApi, canAcceptJobs, cleanDocument, docTypeLabel, techApi } from './technicians';

type Call = { method: string; path: string; body?: unknown };
function fake(reply: (c: Call) => unknown = () => ({})) {
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

test('technician calls use the backend paths and bodies', async () => {
  const { http, calls } = fake(() => ({ id: 1 }));
  await techApi.setAvailability(http, true, true);
  await techApi.setLocation(http, 12.97, 77.59);
  await techApi.updateProfile(http, { bio: 'x', experienceYears: 5 });
  await techApi.addSkill(http, { industry: 'AUTOMOTIVE', category: 'ENGINE', skillName: 'Diagnostics', proficiency: 'EXPERT', isCertified: true });
  await techApi.deleteSkill(http, 9);
  await techApi.upiPennyDrop(http, 'ravi@upi');
  assert.deepEqual(calls.map((c) => `${c.method} ${c.path}`), [
    'PUT /api/v1/technicians/me/availability',
    'PUT /api/v1/technicians/me/location',
    'PUT /api/v1/technicians/me',
    'POST /api/v1/technicians/me/skills',
    'DELETE /api/v1/technicians/me/skills/9',
    'POST /api/v1/technicians/me/kyc/upi-penny-drop',
  ]);
  assert.deepEqual(calls[0].body, { isOnline: true, isAvailable: true });
  assert.deepEqual(calls[1].body, { lat: 12.97, lng: 77.59 });
  assert.deepEqual(calls[5].body, { upiId: 'ravi@upi' });
});

test('admin calls use the backend paths and bodies', async () => {
  const { http, calls } = fake(() => ({ id: 1 }));
  await adminApi.reviewDocument(http, 4, 11, 'REJECTED', 'Blurry photo');
  await adminApi.reviewDocument(http, 4, 12, 'VERIFIED');
  await adminApi.verifyTechnician(http, 4, 2, 'VERIFIED', 'Documents checked');
  await adminApi.technician(http, 4);
  assert.deepEqual(calls.map((c) => `${c.method} ${c.path}`), [
    'PUT /api/v1/admin/technicians/4/documents/11/review',
    'PUT /api/v1/admin/technicians/4/documents/12/review',
    'PUT /api/v1/admin/technicians/4/verify',
    'GET /api/v1/technicians/4/public',
  ]);
  assert.deepEqual(calls[0].body, { status: 'REJECTED', rejectionReason: 'Blurry photo' });
  assert.deepEqual(calls[1].body, { status: 'VERIFIED' });
  assert.deepEqual(calls[2].body, { verificationLevel: 2, verificationStatus: 'VERIFIED', reason: 'Documents checked' });
});

test('private storage paths never reach a screen', async () => {
  const doc = { id: 1, technicianId: 4, docType: 'PAN', verificationStatus: 'PENDING', docUrl: 'private://kyc-vault/4/x.pdf', storageRef: 'private://kyc-vault/4/x.pdf' };
  const clean = cleanDocument(doc);
  assert.equal('docUrl' in clean, false);
  assert.equal('storageRef' in clean, false);
  const { http } = fake(() => [doc]);
  const list = await adminApi.pendingDocuments(http);
  assert.equal('docUrl' in list[0], false);
  const up = await techApi.uploadDocument(fake(() => doc).http, { docType: 'PAN' });
  assert.equal('storageRef' in up, false);
});

test('only level 2 or more, and not fatigue-restricted, can accept jobs', () => {
  assert.equal(canAcceptJobs({ verificationLevel: 2, isFatigueRestricted: false }), true);
  assert.equal(canAcceptJobs({ verificationLevel: 1, isFatigueRestricted: false }), false);
  assert.equal(canAcceptJobs({ verificationLevel: 3, isFatigueRestricted: true }), false);
});

test('document type labels are plain words', () => {
  assert.equal(docTypeLabel('AADHAAR'), 'Aadhaar');
  assert.equal(docTypeLabel('ITI_NCVT_CERT'), 'ITI / NCVT certificate');
  assert.equal(docTypeLabel('SOME_NEW_TYPE'), 'some new type');
});
