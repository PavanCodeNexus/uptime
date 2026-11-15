import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatDate, formatDateTime, formatINR, formatPhone, isValidIndianMobile, isValidPincode, normalizeIndianMobile } from './format';

test('formatINR uses Indian digit grouping', () => {
  assert.equal(formatINR(1234567).replace(/ /g, ' '), '₹12,34,567');
  assert.equal(formatINR(500).replace(/ /g, ' '), '₹500');
  assert.equal(formatINR(1180, { paise: true }).replace(/ /g, ' '), '₹1,180.00');
  assert.equal(formatINR('2500').replace(/ /g, ' '), '₹2,500');
  assert.equal(formatINR(null), '—');
  assert.equal(formatINR(undefined), '—');
  assert.equal(formatINR('abc'), '—');
});

test('formatDate is DD/MM/YYYY in India time', () => {
  assert.equal(formatDate('2026-11-04T18:30:00Z'), '05/11/2026', '18:30 UTC is already the 5th in India');
  assert.equal(formatDate('2026-11-04T05:00:00Z'), '04/11/2026');
  assert.equal(formatDate('not a date'), '—');
  assert.equal(formatDate(null), '—');
});

test('formatDateTime shows date and a 12-hour time', () => {
  assert.match(formatDateTime('2026-11-04T13:21:00Z'), /^04\/11\/2026, 6:51\s?pm$/i);
});

test('phone helpers accept what people really type', () => {
  assert.equal(normalizeIndianMobile('+91 98765 43210'), '9876543210');
  assert.equal(normalizeIndianMobile('09876543210'), '9876543210');
  assert.equal(normalizeIndianMobile('98765-43210'), '9876543210');
  assert.equal(isValidIndianMobile('9876543210'), true);
  assert.equal(isValidIndianMobile('+919876543210'), true);
  assert.equal(isValidIndianMobile('5876543210'), false, 'must start with 6-9');
  assert.equal(isValidIndianMobile('98765'), false);
  assert.equal(formatPhone('9876543210'), '98765 43210');
  assert.equal(formatPhone('12345'), '12345');
  assert.equal(formatPhone(undefined), '');
});

test('pincode is 6 digits and does not start with 0', () => {
  assert.equal(isValidPincode('560078'), true);
  assert.equal(isValidPincode('060078'), false);
  assert.equal(isValidPincode('56007'), false);
});
