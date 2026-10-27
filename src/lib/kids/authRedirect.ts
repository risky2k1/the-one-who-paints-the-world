import { KidsApiError } from './api';
import { kidsPath } from './config';
import { clearDeviceToken, clearKidSession } from './storage';

export function authRedirectFor(err: unknown, scope: 'kid' | 'device'): string | null {
  if (!(err instanceof KidsApiError) || err.status !== 401) return null;
  clearKidSession();
  if (scope === 'device') {
    clearDeviceToken();
    return kidsPath('/setup');
  }
  return kidsPath();
}
