// Mirrors contracts/openapi/kids.v1.yaml (components.schemas).

export interface ChildCard {
  id: number;
  name: string;
  avatar: string;
}

export interface Child extends ChildCard {
  grade: number;
  textbook: 'ket_noi' | 'chan_troi' | 'canh_dieu';
  disabled_topic_ids: number[];
  assigned_first: boolean;
  streak_current: number;
  streak_best: number;
}

export interface Topic {
  id: number;
  grade: number;
  code: string;
  name: string;
  parent_id: number | null;
  is_leaf: boolean;
  level?: number | null;
}

export interface AssignmentCard {
  id: number;
  title: string;
  question_count: number;
  due_at: string | null;
  is_new: boolean;
}

export interface KidHome {
  child: Child;
  pending_assignments: AssignmentCard[];
  streak_current: number;
  practice_locked: boolean;
}

export interface ArithmeticPrompt {
  type: 'arithmetic';
  text: string;
  input: 'number' | 'decimal' | 'fraction';
}

export interface ComparisonPrompt {
  type: 'comparison';
  left: string;
  right: string;
  choices: string[];
}

export interface WordProblemPrompt {
  type: 'word_problem';
  text: string;
  unit: string;
  input: 'number';
}

export interface CubeCountPrompt {
  type: 'cube_count';
  heights: number[][];
}

export type Prompt = ArithmeticPrompt | ComparisonPrompt | WordProblemPrompt | CubeCountPrompt;

export type QuestionState = 'open' | 'correct' | 'revealed';

export interface QuestionView {
  id: number;
  position: number;
  topic_id: number;
  prompt: Prompt;
  attempts: number;
  state: QuestionState;
}

export interface PracticeSession {
  id: number;
  assignment_id: number | null;
  expires_at: string | null;
  questions: QuestionView[];
}

export interface RevealedAnswer {
  answer: string;
  solution: string[];
}

export interface AnswerResult {
  correct: boolean;
  attempts: number;
  state: QuestionState;
  hint: string[] | null;
  revealed: RevealedAnswer | null;
}

export interface Reward {
  id: number;
  sticker_key: string;
  earned_at: string;
}

export interface SessionSummary {
  session_id: number;
  first_try_correct: number;
  total: number;
  duration_seconds: number;
  reward: Reward | null;
  streak_current: number;
}

export interface Parent {
  id: number;
  name: string;
  username: string;
  has_pin: boolean;
}

// Envelope `data` payloads (kidsRequest unwraps the envelope).
export interface LoginResponse {
  parent_token: string;
  device_token: string;
  parent: Parent;
}

export interface StartKidSessionResponse {
  kid_token: string;
  child: ChildCard;
}
