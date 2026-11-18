import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getArrivalCode, removeArrivalCode, saveArrivalCode, spacedCode } from './arrivalCode';
import type { StorageLike } from './tokens';

function mem(): StorageLike {
  const d = new Map<string, string>();
  return { getItem: (k) => d.get(k) ?? null, setItem: (k, v) => void d.set(k, v), removeItem: (k) => void d.delete(k) };
}

test('the arrival code is kept per job and can be removed', () => {
  const s = mem();
  saveArrivalCode(5, '482916', s);
  saveArrivalCode(6, '111222', s);
  assert.equal(getArrivalCode(5, s), '482916');
  assert.equal(getArrivalCode(6, s), '111222');
  assert.equal(getArrivalCode(7, s), null);
  removeArrivalCode(5, s);
  assert.equal(getArrivalCode(5, s), null);
});

test('storage that throws (private mode) never crashes a screen', () => {
  const broken: StorageLike = {
    getItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('blocked');
    },
    removeItem() {
      throw new Error('blocked');
    },
  };
  assert.doesNotThrow(() => saveArrivalCode(1, '123456', broken));
  assert.equal(getArrivalCode(1, broken), null);
  assert.doesNotThrow(() => removeArrivalCode(1, broken));
  assert.equal(getArrivalCode(1, null), null);
});

test('spacedCode splits digits for reading aloud', () => {
  assert.equal(spacedCode('482916'), '4 8 2 9 1 6');
});
