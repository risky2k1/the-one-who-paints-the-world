import { KIDS_API } from './config';
import type {
  AnswerResult,
  ChildCard,
  KidHome,
  LoginResponse,
  PracticeSession,
  Reward,
  SessionSummary,
  StartKidSessionResponse,
  Topic,
} from './types';

export class KidsApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'KidsApiError';
  }
}

export const DEFAULT_ERROR: Record<number, string> = {
  401: 'Hết phiên, chọn lại bạn nhé',
  409: 'Bài này đã khoá',
  423: 'Làm bài bố mẹ giao trước nhé',
  429: 'Thử lại sau ít phút nhé',
};
const FALLBACK_ERROR = 'Có lỗi, con thử lại nhé';

export type PlaySource = { topic_id: number } | { assignment_id: number };

export async function kidsRequest<T>(
  path: string,
  opts: { method?: 'GET' | 'POST'; token?: string; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';

  let res: Response;
  try {
    res = await fetch(`${KIDS_API}${path}`, {
      method: opts.method ?? 'GET',
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new KidsApiError(0, 'Mất kết nối mạng, con thử lại nhé');
  }

  const env = await res.json().catch(() => null);
  if (!res.ok || env?.error) {
    throw new KidsApiError(res.status, env?.message || DEFAULT_ERROR[res.status] || FALLBACK_ERROR);
  }
  return env?.data as T;
}

export const loginParent = (username: string, password: string, deviceName: string) =>
  kidsRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { username, password, device_name: deviceName },
  });

export const logoutParent = (parentToken: string) =>
  kidsRequest<null>('/auth/logout', { method: 'POST', token: parentToken });

export const listDeviceChildren = (deviceToken: string) =>
  kidsRequest<ChildCard[]>('/device/children', { token: deviceToken });

export const startKidSession = (deviceToken: string, childId: number) =>
  kidsRequest<StartKidSessionResponse>(`/device/children/${childId}/session`, {
    method: 'POST',
    token: deviceToken,
  });

export const getKidHome = (kidToken: string) => kidsRequest<KidHome>('/me', { token: kidToken });

export const listKidTopics = (kidToken: string) =>
  kidsRequest<Topic[]>('/me/topics', { token: kidToken });

export const listKidRewards = (kidToken: string) =>
  kidsRequest<Reward[]>('/me/rewards', { token: kidToken });

export const startPracticeSession = (kidToken: string, source: PlaySource) =>
  kidsRequest<PracticeSession>('/me/sessions', { method: 'POST', token: kidToken, body: source });

export const submitAnswer = (kidToken: string, sessionId: number, questionId: number, value: string) =>
  kidsRequest<AnswerResult>(`/me/sessions/${sessionId}/questions/${questionId}/answer`, {
    method: 'POST',
    token: kidToken,
    body: { value },
  });

export const completePracticeSession = (kidToken: string, sessionId: number) =>
  kidsRequest<SessionSummary>(`/me/sessions/${sessionId}/complete`, { method: 'POST', token: kidToken });
