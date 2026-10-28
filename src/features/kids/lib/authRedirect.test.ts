import { beforeEach, describe, expect, it } from 'vitest';
import { KidsApiError } from '@/shared/api/kids';
import { authRedirectFor } from './authRedirect';
import { getDeviceToken, getKidSession, setDeviceToken, setKidSession } from './storage';
import { installStorages } from '@/test/helpers';

beforeEach(() => {
  installStorages();
  setDeviceToken('D');
  setKidSession({ token: 'K', child: { id: 1, name: 'A', avatar: 'fox' } });
});

describe('authRedirectFor', () => {
  it('401 kid clears kid session only', () => {
    expect(authRedirectFor(new KidsApiError(401, 'x'), 'kid')).toBe('/kids');
    expect(getKidSession()).toBeNull();
    expect(getDeviceToken()).toBe('D');
  });
  it('401 device clears both', () => {
    expect(authRedirectFor(new KidsApiError(401, 'x'), 'device')).toBe('/kids/setup');
    expect(getKidSession()).toBeNull();
    expect(getDeviceToken()).toBeNull();
  });
  it('other errors do nothing', () => {
    expect(authRedirectFor(new KidsApiError(500, 'x'), 'device')).toBeNull();
    expect(authRedirectFor(new Error('x'), 'kid')).toBeNull();
    expect(getKidSession()).not.toBeNull();
    expect(getDeviceToken()).toBe('D');
  });
});
