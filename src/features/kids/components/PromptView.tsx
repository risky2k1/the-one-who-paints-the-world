'use client';

import type { ComparisonPrompt, Prompt } from '@/shared/api/kids';
import { CubePrompt } from './CubePrompt';

export interface PromptViewProps {
  prompt: Prompt;
  draft: string;
  disabled?: boolean;
  onChoice(value: string): void;
}

function InputBox({ draft, unit }: { draft: string; unit?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-label={draft ? `Đáp án đã nhập: ${draft}` : 'Ô nhập đáp án'}
        className="inline-flex items-center justify-center min-w-[70px] min-h-[56px] px-4 py-2 border-3 border-black bg-[#FFE600] rounded-xl text-2xl sm:text-3xl font-mono font-black text-black shadow-[3px_3px_0px_0px_#000]"
      >
        {draft || <span className="text-neutral-600 font-normal">?</span>}
      </span>
      {unit && <span className="text-xl sm:text-2xl font-black text-neutral-900">{unit}</span>}
    </span>
  );
}

function ComparisonView({
  prompt,
  draft,
  disabled,
  onChoice,
}: {
  prompt: ComparisonPrompt;
  draft: string;
  disabled: boolean;
  onChoice: (v: string) => void;
}) {
  const choices = prompt.choices && prompt.choices.length > 0 ? prompt.choices : ['<', '=', '>'];

  return (
    <div className="flex flex-col items-center justify-center gap-6 my-6">
      <div className="flex items-center justify-center gap-4 text-3xl sm:text-4xl font-black text-neutral-950 select-none">
        <span className="px-4 py-2 bg-white rounded-xl neo-box text-black">{prompt.left}</span>
        <span className="inline-flex items-center justify-center min-w-[56px] min-h-[56px] rounded-xl border-3 border-dashed border-black bg-[#FFE600] font-mono text-black font-black text-2xl">
          {draft || '?'}
        </span>
        <span className="px-4 py-2 bg-white rounded-xl neo-box text-black">{prompt.right}</span>
      </div>

      <div className="flex items-center justify-center gap-4 mt-2">
        {choices.map((choice) => (
          <button
            key={choice}
            type="button"
            disabled={disabled}
            onClick={() => onChoice(choice)}
            className="min-h-[56px] min-w-[56px] w-16 h-16 rounded-xl neo-btn bg-white text-black text-3xl font-black disabled:opacity-50 flex items-center justify-center"
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PromptView({ prompt, draft, disabled = false, onChoice }: PromptViewProps) {
  switch (prompt.type) {
    case 'arithmetic': {
      if (prompt.text.includes('?')) {
        const parts = prompt.text.split('?');
        return (
          <div className="flex flex-wrap items-center justify-center gap-3 text-3xl sm:text-4xl font-black text-neutral-950 my-6 select-none">
            <span>{parts[0]}</span>
            <InputBox draft={draft} />
            {parts[1] && <span>{parts[1]}</span>}
          </div>
        );
      }

      return (
        <div className="flex flex-wrap items-center justify-center gap-3 text-3xl sm:text-4xl font-black text-neutral-950 my-6 select-none">
          <span>{prompt.text}</span>
          <span>=</span>
          <InputBox draft={draft} />
        </div>
      );
    }

    case 'word_problem': {
      return (
        <div className="flex flex-col items-center justify-center gap-6 my-6 text-center max-w-xl mx-auto">
          <p className="text-[28px] font-bold text-neutral-950 leading-relaxed bg-white p-5 rounded-2xl neo-card">
            {prompt.text}
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl font-black text-neutral-900">Đáp số:</span>
            <InputBox draft={draft} unit={prompt.unit} />
          </div>
        </div>
      );
    }

    case 'comparison':
      return <ComparisonView prompt={prompt} draft={draft} disabled={disabled} onChoice={onChoice} />;

    case 'cube_count': {
      return (
        <div className="flex flex-col items-center justify-center gap-4 my-4 text-center">
          <CubePrompt heights={prompt.heights} />
          <p className="text-xl sm:text-2xl font-black text-neutral-950">
            Có tất cả bao nhiêu khối lập phương?
          </p>
          <div className="mt-1">
            <InputBox draft={draft} />
          </div>
        </div>
      );
    }
  }
}
