'use client';

import type { SessionReviewQuestion } from '@/shared/api/kids/kids.types';

function renderPromptText(prompt: SessionReviewQuestion['prompt']) {
  if (prompt.type === 'arithmetic') return prompt.text;
  if (prompt.type === 'comparison') return `${prompt.left} ... ${prompt.right}`;
  if (prompt.type === 'word_problem') return prompt.text;
  if (prompt.type === 'cube_count') return 'Đếm số lượng khối lập phương trong hình 3D';
  return 'Câu hỏi';
}

export interface ReviewQuestionItemProps {
  question: SessionReviewQuestion;
  index: number;
  onReport: (id: number) => void;
}

export function ReviewQuestionItem({ question, index, onReport }: ReviewQuestionItemProps) {
  const isFirstTryCorrect = question.first_try_correct === true;
  const isSecondTryCorrect = !isFirstTryCorrect && question.state === 'correct';
  const isCorrect = isFirstTryCorrect || isSecondTryCorrect;

  return (
    <div
      className={`p-4 rounded-xl neo-box-sm space-y-2 text-xs ${
        isCorrect ? 'bg-[#FAF7F2]' : 'bg-[#FFE600]/30'
      }`}
    >
      <div className="flex items-start justify-between gap-2 border-b-2 border-black pb-2">
        <div className="font-black text-neutral-950 text-sm uppercase">
          Câu {index + 1}: {renderPromptText(question.prompt)}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isFirstTryCorrect ? (
            <span className="neo-badge bg-[#B8FF9F] text-black font-black text-[10px] uppercase px-2 py-0.5 rounded">
              ✓ Đúng lần đầu
            </span>
          ) : isSecondTryCorrect ? (
            <span className="neo-badge bg-[#FFE600] text-black font-black text-[10px] uppercase px-2 py-0.5 rounded">
              ~ Đúng lần 2
            </span>
          ) : (
            <span className="neo-badge bg-[#FF90E8] text-black font-black text-[10px] uppercase px-2 py-0.5 rounded">
              ✗ Chưa đúng
            </span>
          )}

          <button
            type="button"
            onClick={() => onReport(question.id)}
            className="neo-btn bg-white text-black p-1 rounded-md text-xs"
            title="Báo câu hỏi có vấn đề"
          >
            🚩
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-bold text-neutral-800">
        <div>
          <span className="text-neutral-500 uppercase">Bé đã trả lời: </span>
          <strong className="text-neutral-950 font-black">
            {question.given_answers?.length ? question.given_answers.join(' ➔ ') : '(Bỏ trống)'}
          </strong>
        </div>
        <div>
          <span className="text-neutral-500 uppercase">Đáp án chính xác: </span>
          <strong className="text-neutral-950 font-black">{question.answer}</strong>
        </div>
      </div>

      {question.solution && question.solution.length > 0 && (
        <div className="mt-2 pt-2 border-t-2 border-neutral-200">
          <span className="font-black text-neutral-900 block mb-1 uppercase text-[11px]">
            Hướng dẫn giải từng bước:
          </span>
          <ul className="list-disc list-inside space-y-0.5 text-neutral-800 font-medium">
            {question.solution.map((step, sIdx) => (
              <li key={sIdx}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
