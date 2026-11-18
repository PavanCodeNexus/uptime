import type { StorageLike } from './tokens';

/**
 * The arrival code is shown by the backend only once, when the job is created. The owner needs it later to
 * hand to the technician, so we keep it on this device, per job. It is not a login secret: it only proves
 * "I am the person who booked this job" when the technician arrives.
 */
const key = (jobId: number | string) => `uptime.owner.arrival.${jobId}`;

function browserStorage(): StorageLike | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export function saveArrivalCode(jobId: number | string, code: string, storage: StorageLike | null = browserStorage()): void {
  try {
    storage?.setItem(key(jobId), code);
  } catch {
    // Private mode or full storage: the screen then says the code is not on this device.
  }
}

export function getArrivalCode(jobId: number | string, storage: StorageLike | null = browserStorage()): string | null {
  try {
    return storage?.getItem(key(jobId)) ?? null;
  } catch {
    return null;
  }
}

export function removeArrivalCode(jobId: number | string, storage: StorageLike | null = browserStorage()): void {
  try {
    storage?.removeItem(key(jobId));
  } catch {
    // Nothing to do.
  }
}

/** 482916 -> "4 8 2 9 1 6" for easy reading aloud. */
export function spacedCode(code: string): string {
  return code.split('').join(' ');
}
