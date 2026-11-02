import { unlockDevice } from '@/shared/api/kids/parentApi';
import { clearParentToken, hasParentToken, setParentToken } from './parentStorage';

export async function unlockParentSession(
  deviceToken: string,
  creds: { pin?: string; password?: string },
): Promise<string> {
  const res = await unlockDevice(deviceToken, creds);
  setParentToken(res.parent_token);
  return res.parent_token;
}

export function logoutParent(): void {
  clearParentToken();
}

export function isParentUnlocked(): boolean {
  return hasParentToken();
}
