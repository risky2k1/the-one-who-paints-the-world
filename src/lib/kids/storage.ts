import type { ChildCard } from './types';

type Store = 'session' | 'local';

const DEVICE_KEY = 'kids.device';
const KID_KEY = 'kids.kid';
const PLAY_KEY = 'kids.play';

function store(kind: Store): Storage | null {
  try {
    return (kind === 'local' ? globalThis.localStorage : globalThis.sessionStorage) ?? null;
  } catch {
    return null;
  }
}

export function readJson<T>(key: string, kind: Store): T | null {
  try {
    const raw = store(kind)?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJson(key: string, value: unknown, kind: Store): void {
  try {
    store(kind)?.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable or full: behave as empty */
  }
}

export function removeKey(key: string, kind: Store): void {
  try {
    store(kind)?.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const getDeviceToken = (): string | null => readJson<string>(DEVICE_KEY, 'local');
export const setDeviceToken = (t: string): void => writeJson(DEVICE_KEY, t, 'local');
export const clearDeviceToken = (): void => removeKey(DEVICE_KEY, 'local');

export type KidSession = { token: string; child: ChildCard };
export const getKidSession = (): KidSession | null => readJson<KidSession>(KID_KEY, 'session');
export const setKidSession = (s: KidSession): void => writeJson(KID_KEY, s, 'session');
export function clearKidSession(): void {
  removeKey(KID_KEY, 'session');
  removeKey(PLAY_KEY, 'session');
}
