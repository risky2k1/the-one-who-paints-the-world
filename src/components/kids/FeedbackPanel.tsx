'use client';

import type { RevealedAnswer } from '@/lib/kids/types';
import { Celebration } from './Celebration';

export interface FeedbackPanelProps {
  feedback: {
    kind: 'correct' | 'hint' | 'revealed';
    hint?: string[];
    revealed?: RevealedAnswer;
  } | null;
  onNext(): void;
}

export function FeedbackPanel({ feedback, onNext }: FeedbackPanelProps) {
  if (!feedback) return null;

  if (feedback.kind === 'correct') {
    return (
      <div className="w-full max-w-md mx-auto my-4 flex flex-col items-center gap-3">
        <Celebration message="Giỏi quá! 🎉" />
        <button
          type="button"
          onClick={onNext}
          className="min-h-[56px] px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xl font-extrabold shadow-lg transition-all"
        >
          Câu tiếp ➔
        </button>
      </div>
    );
  }

  if (feedback.kind === 'hint') {
    return (
      <div className="w-full max-w-md mx-auto my-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 shadow-sm animate-fade-in">
        <div className="flex items-center gap-2 font-bold text-lg mb-1">
          <span aria-hidden="true">💡</span>
          <span>Gần đúng rồi, con thử lại nhé!</span>
        </div>
        {feedback.hint && feedback.hint.length > 0 && (
          <ul className="mt-2 space-y-1 text-base text-amber-800 list-disc list-inside">
            {feedback.hint.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (feedback.kind === 'revealed') {
    return (
      <div className="w-full max-w-md mx-auto my-4 p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 text-blue-950 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2 font-bold text-lg text-blue-900">
          <span aria-hidden="true">📖</span>
          <span>Cùng xem cách làm nhé:</span>
        </div>

        {feedback.revealed?.solution && feedback.revealed.solution.length > 0 && (
          <div className="space-y-1 text-base text-blue-900">
            {feedback.revealed.solution.map((step, i) => (
              <p key={i}>{step}</p>
            ))}
          </div>
        )}

        {feedback.revealed?.answer && (
          <div className="text-lg font-extrabold text-blue-900">
            Đáp án: <span className="text-emerald-700 underline">{feedback.revealed.answer}</span>
          </div>
        )}

        <button
          type="button"
          onClick={onNext}
          className="min-h-[56px] mt-2 w-full rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white text-xl font-extrabold shadow-md transition-all"
        >
          Câu tiếp ➔
        </button>
      </div>
    );
  }

  return null;
}
