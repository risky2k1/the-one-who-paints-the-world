'use client';

import type { RevealedAnswer } from '@/shared/api/kids';
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
          className="min-h-[56px] px-8 py-3 rounded-xl neo-btn bg-[#B8FF9F] text-black text-xl font-black"
        >
          Câu tiếp ➔
        </button>
      </div>
    );
  }

  if (feedback.kind === 'hint') {
    return (
      <div className="w-full max-w-md mx-auto my-4 p-4 rounded-xl neo-box-sm bg-[#FFE600] text-neutral-950">
        <div className="flex items-center gap-2 font-black text-lg mb-1">
          <span aria-hidden="true">💡</span>
          <span>Gần đúng rồi, con thử lại nhé!</span>
        </div>
        {feedback.hint && feedback.hint.length > 0 && (
          <ul className="mt-2 space-y-1 text-base text-neutral-900 list-disc list-inside">
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
      <div className="w-full max-w-md mx-auto my-4 p-5 rounded-xl neo-box-sm bg-[#A6FAFF] text-neutral-950 flex flex-col gap-3">
        <div className="flex items-center gap-2 font-black text-lg text-neutral-950">
          <span aria-hidden="true">📖</span>
          <span>Cùng xem cách làm nhé:</span>
        </div>

        {feedback.revealed?.solution && feedback.revealed.solution.length > 0 && (
          <div className="space-y-1 text-base text-neutral-900">
            {feedback.revealed.solution.map((step, i) => (
              <p key={i}>{step}</p>
            ))}
          </div>
        )}

        {feedback.revealed?.answer && (
          <div className="text-lg font-black text-neutral-950">
            Đáp án: <span className="underline decoration-2">{feedback.revealed.answer}</span>
          </div>
        )}

        <button
          type="button"
          onClick={onNext}
          className="min-h-[56px] mt-2 w-full rounded-xl neo-btn bg-[#FFE600] text-black text-xl font-black"
        >
          Câu tiếp ➔
        </button>
      </div>
    );
  }

  return null;
}
