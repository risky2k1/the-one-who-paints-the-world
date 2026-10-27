import { afterEach, describe, expect, it, vi } from 'vitest';
import { KidsApiError, kidsRequest, submitAnswer } from '@/lib/kids/api';
import { mockFetch } from './helpers';

afterEach(() => vi.unstubAllGlobals());

describe('kidsRequest', () => {
  it('unwraps envelope data', async () => {
    const f = mockFetch([{ status: 200, body: { error: false, data: { id: 1 }, message: null } }]);
    await expect(kidsRequest('/me', { token: 'k' })).resolves.toEqual({ id: 1 });
    const [url, init] = f.mock.calls[0];
    expect(url).toBe('/api/v1/kids/me');
    expect((init!.headers as Record<string, string>).Authorization).toBe('Bearer k');
  });

  it('maps http errors', async () => {
    mockFetch([
      { status: 423, body: { error: true, data: null, message: null } },
      { status: 422, body: { error: true, data: null, message: 'The value field is required.' } },
    ]);
    await expect(kidsRequest('/x', {})).rejects.toMatchObject({
      status: 423,
      message: 'Làm bài bố mẹ giao trước nhé',
    });
    const e = await kidsRequest('/x', {}).catch((err) => err);
    expect(e).toBeInstanceOf(KidsApiError);
    expect(e).toMatchObject({ status: 422, message: 'The value field is required.' });
  });

  it('maps network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('boom')));
    await expect(kidsRequest('/x', {})).rejects.toMatchObject({ status: 0 });
  });

  it('submitAnswer posts value', async () => {
    const f = mockFetch([{ status: 200, body: { error: false, data: {}, message: null } }]);
    await submitAnswer('k', 10, 42, '2,5');
    const [url, init] = f.mock.calls[0];
    expect(url).toBe('/api/v1/kids/me/sessions/10/questions/42/answer');
    expect(init!.method).toBe('POST');
    expect(JSON.parse(init!.body as string)).toEqual({ value: '2,5' });
  });
});
