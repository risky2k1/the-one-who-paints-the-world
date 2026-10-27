import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearKidSession,
  getDeviceToken,
  getKidSession,
  setDeviceToken,
  setKidSession,
  writeJson,
  readJson,
} from '@/lib/kids/storage';
import { installStorages } from './helpers';

let s: ReturnType<typeof installStorages>;
beforeEach(() => {
  s = installStorages();
});
afterEach(() => vi.unstubAllGlobals());

describe('kids storage', () => {
  it('device token roundtrip', () => {
    setDeviceToken('d1');
    expect(getDeviceToken()).toBe('d1');
    expect(s.local.getItem('kids.device_token')).toBe('d1');
  });

  it('kid session roundtrip', () => {
    const k = { token: 't', child: { id: 1, name: 'Bo', avatar: 'fox' } };
    setKidSession(k);
    expect(getKidSession()).toEqual(k);
  });

  it('clearKidSession also clears play', () => {
    setKidSession({ token: 't', child: { id: 1, name: 'Bo', avatar: 'fox' } });
    writeJson('kids.play', { a: 1 }, 'session');
    clearKidSession();
    expect(getKidSession()).toBeNull();
    expect(readJson('kids.play', 'session')).toBeNull();
  });

  it('corrupt json returns null', () => {
    s.session.setItem('kids.kid', '{oops');
    expect(getKidSession()).toBeNull();
  });

  it('storage unavailable', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('denied');
      },
    });
    expect(getDeviceToken()).toBeNull();
    expect(() => setDeviceToken('x')).not.toThrow();
  });
});
