import { beforeEach, describe, expect, it } from 'vitest';
import { KidsApiError } from '../../src/lib/kids/api';
import { setupDevice } from '../../src/lib/kids/setupDevice';
import { getDeviceToken } from '../../src/lib/kids/storage';
import { installStorages, mockFetch } from './helpers';

const login = {
  status: 200,
  body: { error: false, data: { parent_token: 'PTOKEN', device_token: 'D', parent: { id: 1 } }, message: '' },
};
let st: ReturnType<typeof installStorages>;
beforeEach(() => {
  st = installStorages();
});

const allValues = () =>
  [st.local, st.session].flatMap((s) => Array.from({ length: s.length }, (_, i) => s.getItem(s.key(i)!)));

describe('setupDevice', () => {
  it('stores only the device token', async () => {
    const f = mockFetch([login, { status: 200, body: { error: false, data: null, message: '' } }]);
    await setupDevice('u', 'p');
    expect(getDeviceToken()).toBe('D');
    expect(allValues().some((v) => v?.includes('PTOKEN'))).toBe(false);
    const [url, init] = f.mock.calls[1];
    expect(url).toBe('/api/v1/kids/auth/logout');
    expect(init?.method).toBe('POST');
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer PTOKEN');
  });

  it('logout failure is ignored', async () => {
    mockFetch([login, { status: 500, body: { error: true, data: null, message: 'x' } }]);
    await expect(setupDevice('u', 'p')).resolves.toBeUndefined();
    expect(getDeviceToken()).toBe('D');
  });

  it('bad credentials rejects', async () => {
    mockFetch([{ status: 401, body: { error: true, data: null, message: 'no' } }]);
    await expect(setupDevice('u', 'p')).rejects.toMatchObject({ status: 401 });
    await expect(setupDevice('u', 'p')).rejects.toBeInstanceOf(KidsApiError);
    expect(st.local.length + st.session.length).toBe(0);
  });
});
