import { kidsRequest } from './kidsApi';
import type {
  Assignment,
  AssignmentInput,
  AssignmentInputPartial,
  AssignmentResult,
  Child,
  ChildInput,
  ChildInputPartial,
  SessionReview,
  Topic,
  UnlockResponseData,
  WeakSkill,
} from './kids.types';

export async function unlockDevice(
  deviceToken: string,
  creds: { pin?: string; password?: string },
): Promise<UnlockResponseData> {
  return kidsRequest<UnlockResponseData>('/device/unlock', {
    method: 'POST',
    token: deviceToken,
    body: creds,
  });
}

export async function setParentPin(
  parentToken: string,
  creds: { pin: string; password: string },
): Promise<void> {
  return kidsRequest<void>('/parent/pin', {
    method: 'PUT',
    token: parentToken,
    body: creds,
  });
}

export async function listParentChildren(parentToken: string): Promise<Child[]> {
  return kidsRequest<Child[]>('/parent/children', {
    token: parentToken,
  });
}

export async function createParentChild(parentToken: string, data: ChildInput): Promise<Child> {
  return kidsRequest<Child>('/parent/children', {
    method: 'POST',
    token: parentToken,
    body: data,
  });
}

export async function updateParentChild(
  parentToken: string,
  childId: number,
  data: ChildInputPartial,
): Promise<Child> {
  return kidsRequest<Child>(`/parent/children/${childId}`, {
    method: 'PATCH',
    token: parentToken,
    body: data,
  });
}

export async function deleteParentChild(parentToken: string, childId: number): Promise<void> {
  return kidsRequest<void>(`/parent/children/${childId}`, {
    method: 'DELETE',
    token: parentToken,
  });
}

export async function listParentTopics(parentToken: string, grade?: number): Promise<Topic[]> {
  const query = grade ? `?grade=${grade}` : '';
  return kidsRequest<Topic[]>(`/parent/topics${query}`, {
    token: parentToken,
  });
}

export async function listParentAssignments(
  parentToken: string,
  childId?: number,
): Promise<Assignment[]> {
  const query = childId ? `?child_id=${childId}` : '';
  return kidsRequest<Assignment[]>(`/parent/assignments${query}`, {
    token: parentToken,
  });
}

export async function createParentAssignment(
  parentToken: string,
  data: AssignmentInput,
): Promise<Assignment> {
  return kidsRequest<Assignment>('/parent/assignments', {
    method: 'POST',
    token: parentToken,
    body: data,
  });
}

export async function updateParentAssignment(
  parentToken: string,
  assignmentId: number,
  data: AssignmentInputPartial,
): Promise<Assignment> {
  return kidsRequest<Assignment>(`/parent/assignments/${assignmentId}`, {
    method: 'PATCH',
    token: parentToken,
    body: data,
  });
}

export async function deleteParentAssignment(
  parentToken: string,
  assignmentId: number,
): Promise<void> {
  return kidsRequest<void>(`/parent/assignments/${assignmentId}`, {
    method: 'DELETE',
    token: parentToken,
  });
}

export async function getChildResults(
  parentToken: string,
  childId: number,
  assignmentId?: number,
): Promise<AssignmentResult[]> {
  const query = assignmentId ? `?assignment_id=${assignmentId}` : '';
  return kidsRequest<AssignmentResult[]>(`/parent/children/${childId}/results${query}`, {
    token: parentToken,
  });
}

export async function getChildWeakSkills(
  parentToken: string,
  childId: number,
): Promise<WeakSkill[]> {
  return kidsRequest<WeakSkill[]>(`/parent/children/${childId}/weak-skills`, {
    token: parentToken,
  });
}

export async function getParentSessionReview(
  parentToken: string,
  sessionId: number,
): Promise<SessionReview> {
  return kidsRequest<SessionReview>(`/parent/sessions/${sessionId}`, {
    token: parentToken,
  });
}

export async function reportQuestion(
  parentToken: string,
  questionId: number,
  note: string,
): Promise<void> {
  return kidsRequest<void>(`/parent/questions/${questionId}/report`, {
    method: 'POST',
    token: parentToken,
    body: { note },
  });
}
