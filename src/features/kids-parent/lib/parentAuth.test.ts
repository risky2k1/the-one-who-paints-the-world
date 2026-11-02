import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as parentApi from '@/shared/api/kids/parentApi';
import { installStorages } from '@/test/helpers';
import {
  clearParentToken,
  getParentToken,
  hasParentToken,
  setParentToken,
} from './parentStorage';
import { isParentUnlocked, logoutParent, unlockParentSession } from './parentAuth';

let s: ReturnType<typeof installStorages>;

describe('parentStorage', () => {
  beforeEach(() => {
    s = installStorages();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('stores and retrieves parent token from sessionStorage only', () => {
    expect(getParentToken()).toBeNull();
    expect(hasParentToken()).toBe(false);

    setParentToken('test-token-123');
    expect(getParentToken()).toBe('test-token-123');
    expect(hasParentToken()).toBe(true);
    expect(s.session.getItem('kids.parent_token')).toBe('test-token-123');

    clearParentToken();
    expect(getParentToken()).toBeNull();
    expect(hasParentToken()).toBe(false);
  });
});

describe('parentAuth', () => {
  beforeEach(() => {
    s = installStorages();
    vi.restoreAllMocks();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('unlocks parent session with PIN and saves parent token', async () => {
    vi.spyOn(parentApi, 'unlockDevice').mockResolvedValueOnce({
      parent_token: 'parent-token-abc',
    });

    const token = await unlockParentSession('device-token-xyz', { pin: '1234' });
    expect(token).toBe('parent-token-abc');
    expect(getParentToken()).toBe('parent-token-abc');
    expect(isParentUnlocked()).toBe(true);
    expect(parentApi.unlockDevice).toHaveBeenCalledWith('device-token-xyz', { pin: '1234' });
  });

  it('unlocks parent session with password and saves parent token', async () => {
    vi.spyOn(parentApi, 'unlockDevice').mockResolvedValueOnce({
      parent_token: 'parent-token-pwd',
    });

    const token = await unlockParentSession('device-token-xyz', { password: 'secretpassword' });
    expect(token).toBe('parent-token-pwd');
    expect(getParentToken()).toBe('parent-token-pwd');
    expect(isParentUnlocked()).toBe(true);
  });

  it('clears token on logout', () => {
    setParentToken('existing-token');
    expect(isParentUnlocked()).toBe(true);

    logoutParent();
    expect(isParentUnlocked()).toBe(false);
    expect(getParentToken()).toBeNull();
  });
});
