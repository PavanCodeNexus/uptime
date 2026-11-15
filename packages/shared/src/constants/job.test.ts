import assert from 'node:assert/strict';
import { test } from 'node:test';
import { friendlyMessage, ERROR_MESSAGES } from './errors';
import { INDUSTRIES, jobStatusInfo, normalizeIndustry, trackerIndex, TRACKER_STEPS } from './job';

test('both spellings of "just created" show the same label', () => {
  assert.equal(jobStatusInfo('CREATED').label, 'Posted');
  assert.equal(jobStatusInfo('POSTED').label, 'Posted');
  assert.equal(jobStatusInfo('en_route').label, 'On the way', 'case-insensitive');
});

test('an unknown status shows its own text instead of crashing', () => {
  assert.equal(jobStatusInfo('SOMETHING_NEW').label, 'SOMETHING_NEW');
  assert.equal(jobStatusInfo(undefined).label, 'Unknown');
});

test('every status the backend can write has a label (JobStatus.java + JobService strings)', () => {
  for (const s of ['POSTED', 'AI_ANALYZED', 'MATCHING', 'ACCEPTED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED', 'CREATED', 'COPILOT_ACTIVE', 'VIDEO_ACTIVE']) {
    assert.notEqual(jobStatusInfo(s).label, s, `${s} is missing from JOB_STATUS`);
  }
});

test('tracker position follows the job life', () => {
  assert.deepEqual(
    ['CREATED', 'MATCHING', 'ACCEPTED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'].map(trackerIndex),
    [0, 1, 2, 3, 4, 5, 6],
  );
  assert.equal(trackerIndex('POSTED'), 0);
  assert.equal(trackerIndex('COPILOT_ACTIVE'), 0);
  assert.equal(trackerIndex('CANCELLED'), -1);
  assert.equal(TRACKER_STEPS.length, 7);
});

test('industry: AUTOMOBILE and AUTOMOTIVE are the same thing; we send AUTOMOTIVE', () => {
  assert.equal(normalizeIndustry('AUTOMOBILE'), 'AUTOMOTIVE');
  assert.equal(normalizeIndustry('automotive'), 'AUTOMOTIVE');
  assert.equal(normalizeIndustry('INDUSTRIAL'), 'INDUSTRIAL');
  assert.equal(normalizeIndustry('BOATS'), undefined);
  assert.equal(INDUSTRIES.find((i) => i.label === 'Automobile')?.value, 'AUTOMOTIVE');
});

test('error codes: known codes use our wording, unknown fall back', () => {
  assert.match(friendlyMessage('JOB_006'), /500 metres/);
  assert.equal(friendlyMessage('NOPE', 'From server'), 'From server');
  assert.equal(friendlyMessage('NOPE'), ERROR_MESSAGES.UNKNOWN);
  assert.equal(friendlyMessage(undefined, '   '), ERROR_MESSAGES.UNKNOWN);
});

test('every backend error code (ErrorCodes.java) has a message', () => {
  const codes = ['AUTH_001', 'AUTH_002', 'AUTH_003', 'AUTH_004', 'AUTH_005', 'AUTH_006', 'AUTH_010', 'TECH_001', 'TECH_002', 'JOB_001', 'JOB_004', 'JOB_005', 'JOB_006', 'JOB_007',
    'KYC_001', 'KYC_002', 'KYC_003', 'KYC_004', 'KYC_005', 'KYC_006', 'KYC_007', 'KYC_008', 'VAL_001', 'FILE_001', 'RES_001', 'AI_001', 'VID_001', 'PAY_001', 'SERVER_001', 'RATE_001'];
  for (const c of codes) assert.ok(ERROR_MESSAGES[c], `${c} has no message`);
});
