export const PARENT_TOKEN_KEY = 'kids.parent_token';
export const DEVICE_KEY = 'kids.device_token';

function getSession(): Storage | null {
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
}

function getLocal(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function getParentToken(): string | null {
  return getSession()?.getItem(PARENT_TOKEN_KEY) ?? null;
}

export function setParentToken(token: string): void {
  try {
    getSession()?.setItem(PARENT_TOKEN_KEY, token);
  } catch {
    /* ignore if full or blocked */
  }
}

export function clearParentToken(): void {
  try {
    getSession()?.removeItem(PARENT_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function hasParentToken(): boolean {
  return Boolean(getParentToken());
}

export function getDeviceToken(): string | null {
  return getLocal()?.getItem(DEVICE_KEY) ?? null;
}
