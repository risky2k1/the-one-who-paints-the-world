import { loginParent, logoutParent } from './api';
import { setDeviceToken } from './storage';

// The parent token lives only in this function's scope; it is never persisted.
export async function setupDevice(username: string, password: string): Promise<void> {
  const { parent_token, device_token } = await loginParent(username, password, 'kids-web');
  setDeviceToken(device_token);
  await logoutParent(parent_token).catch(() => undefined);
}
