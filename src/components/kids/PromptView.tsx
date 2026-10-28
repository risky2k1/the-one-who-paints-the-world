'use client';

import type { Prompt } from '@/lib/kids/types';
import { CubePrompt } from './CubePrompt';

export interface PromptViewProps {
  prompt: Prompt;
  draft: string;
  disabled?: boolean;
  onChoice(value: string): void;
}

export function PromptView({
  prompt,
  draft,
  disabled = false,
  onChoice,
}: PromptViewProps) {
  const renderInputBox = (unit?: string) => (
    <span className="inline-flex items-center gap-2">
      <span
        aria-label={draft ? `Đáp án đã nhập: ${draft}` : 'Ô nhập đáp án'}
        className="inline-flex items-center justify-center min-w-[70px] min-h-[56px] px-4 py-2 border-3 border-indigo-400 bg-white rounded-2xl text-2xl sm:text-3xl font-mono font-extrabold text-indigo-700 shadow-inner"
      >
        {draft || <span className="text-slate-300 font-normal">?</span>}
      </span>
      {unit && <span className="text-xl sm:text-2xl font-bold text-slate-700">{unit}</span>}
    </span>
  );

  switch (prompt.type) {
    case 'arithmetic': {
      // If the text contains '?', replace it with the box
      if (prompt.text.includes('?')) {
        const parts = prompt.text.split('?');
        return (
          <div className="flex flex-wrap items-center justify-center gap-3 text-3xl sm:text-4xl font-extrabold text-slate-800 my-6 select-none">
            <span>{parts[0]}</span>
            {renderInputBox()}
            {parts[1] && <span>{parts[1]}</span>}
          </div>
        );
      }

      return (
        <div className="flex flex-wrap items-center justify-center gap-3 text-3xl sm:text-4xl font-extrabold text-slate-800 my-6 select-none">
          <span>{prompt.text}</span>
          <span>=</span>
          {renderInputBox()}
        </div>
      );
    }

    case 'word_problem': {
      return (
        <div className="flex flex-col items-center justify-center gap-6 my-6 text-center max-w-xl mx-auto">
          <p className="text-xl sm:text-2xl font-medium text-slate-800 leading-relaxed bg-white/70 p-5 rounded-2xl border border-amber-100 shadow-sm">
            {prompt.text}
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-lg font-bold text-slate-600">Đáp số:</span>
            {renderInputBox(prompt.unit)}
          </div>
        </div>
      );
    }

    case 'comparison': {
      const choices = prompt.choices && prompt.choices.length > 0 ? prompt.choices : ['<', '=', '>'];

      return (
        <div className="flex flex-col items-center justify-center gap-6 my-6">
          <div className="flex items-center justify-center gap-4 text-3xl sm:text-4xl font-extrabold text-slate-800 select-none">
            <span className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-200">
              {prompt.left}
            </span>
            <span className="inline-flex items-center justify-center min-w-[56px] min-h-[56px] rounded-2xl border-2 border-dashed border-indigo-400 bg-white font-mono text-indigo-700">
              {draft || '?'}
            </span>
            <span className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-200">
              {prompt.right}
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 mt-2">
            {choices.map((choice) => (
              <button
                key={choice}
                type="button"
                disabled={disabled}
                onClick={() => onChoice(choice)}
                className="min-h-[56px] min-w-[56px] w-16 h-16 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 disabled:opacity-50 text-white text-3xl font-black shadow-lg transition-all flex items-center justify-center"
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      );
    }

    case 'cube_count': {
      return (
        <div className="flex flex-col items-center justify-center gap-4 my-4 text-center">
          <CubePrompt heights={prompt.heights} />
          <p className="text-lg sm:text-xl font-extrabold text-slate-800">
            Có tất cả bao nhiêu khối lập phương?
          </p>
          <div className="mt-1">{renderInputBox()}</div>
        </div>
      );
    }
  }
}
