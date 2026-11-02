'use client';

import { Countdown } from './Countdown';
import type { PracticeSession } from '@/shared/api/kids';

export interface PlayProgressHeaderProps {
  session: PracticeSession;
  index: number;
  onPause: () => void;
  onTimeUp: () => void;
}

export function PlayProgressHeader({
  session,
  index,
  onPause,
  onTimeUp,
}: PlayProgressHeaderProps) {
  const currentQuestion = session.questions[index];
  const total = session.questions.length;
  const position = currentQuestion ? currentQuestion.position : index + 1;

  return (
    <header className="flex items-center justify-between gap-4 mb-4 neo-box bg-white p-4 rounded-2xl">
      <button
        type="button"
        onClick={onPause}
        className="min-h-[44px] px-3.5 py-2 rounded-xl neo-btn bg-[#FAF7F2] text-black font-bold text-xs"
      >
        ⏸️ Tạm dừng
      </button>

      <div className="flex flex-col items-center gap-1.5">
        <span className="text-sm font-bold text-neutral-950">
          Câu {position} / {total}
        </span>
        <div className="flex items-center gap-1.5">
          {session.questions.map((q, idx) => {
            let dotClass = 'bg-white';
            if (q.state === 'correct' && q.attempts === 1) {
              dotClass = 'bg-[#B8FF9F]';
            } else if (q.state === 'correct' || q.state === 'revealed') {
              dotClass = 'bg-[#FFE600]';
            }
            const isCurrent = idx === index;

            return (
              <span
                key={q.id}
                className={`w-3.5 h-3.5 rounded-full border-2 border-black transition-all ${dotClass} ${
                  isCurrent ? 'scale-125 border-3 ring-2 ring-black' : ''
                }`}
                aria-label={`Câu ${q.position}: ${q.state}`}
              />
            );
          })}
        </div>
      </div>

      <div>
        {session.expires_at ? (
          <Countdown expiresAt={session.expires_at} onTimeUp={onTimeUp} />
        ) : (
          <div className="w-16" />
        )}
      </div>
    </header>
  );
}
