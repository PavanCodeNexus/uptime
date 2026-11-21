import assert from 'node:assert/strict';
import { test } from 'node:test';
import { distanceMeters, nextWorkStep } from './jobflow';

test('nextWorkStep follows the job status', () => {
  assert.equal(nextWorkStep('ACCEPTED'), 'ENROUTE');
  assert.equal(nextWorkStep('EN_ROUTE'), 'ARRIVE');
  assert.equal(nextWorkStep('ARRIVED'), 'OTP');
  assert.equal(nextWorkStep('IN_PROGRESS'), 'COMPLETE');
  assert.equal(nextWorkStep('COMPLETED'), 'DONE');
  assert.equal(nextWorkStep('MATCHING'), 'NONE');
  assert.equal(nextWorkStep(undefined), 'NONE');
});

test('distanceMeters is 0 for the same point and about 111 km per degree of latitude', () => {
  assert.equal(Math.round(distanceMeters(17.385, 78.4867, 17.385, 78.4867)), 0);
  const d = distanceMeters(17, 78, 18, 78);
  assert.ok(d > 110000 && d < 112500);
});
