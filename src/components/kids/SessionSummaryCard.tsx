'use client';

import Link from 'next/link';
import { kidsPath } from '@/lib/kids/config';
import type { PlaySource } from '@/lib/kids/play';
import type { SessionSummary } from '@/lib/kids/types';
import { StickerBadge } from './StickerBadge';

interface SessionSummaryCardProps {
  summary: SessionSummary;
  source: PlaySource;
  onRetry?(): void;
}

export function SessionSummaryCard({ summary, source, onRetry }: SessionSummaryCardProps) {
  const minutes = Math.floor(summary.duration_seconds / 60);
  const seconds = summary.duration_seconds % 60;
  const timeFormatted = `${minutes > 0 ? `${minutes} phút ` : ''}${seconds} giây`;

  const isTopic = 'topic_id' in source;

  return (
    <div className="mx-auto max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-200 text-center">
      <div className="text-4xl sm:text-5xl mb-3" aria-hidden="true">
        🏆
      </div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
        Hoàn thành bài tập!
      </h2>
      <p className="text-slate-600 mb-6 text-lg">Con đã làm rất tốt hôm nay!</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <div className="text-sm font-medium text-emerald-800 mb-1">Đúng lần đầu</div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {summary.first_try_correct}/{summary.total}
          </div>
        </div>

        <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100">
          <div className="text-sm font-medium text-sky-800 mb-1">Thời gian</div>
          <div className="text-2xl font-bold text-sky-700">{timeFormatted}</div>
        </div>
      </div>

      {summary.streak_current > 0 && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-900 rounded-full font-bold mb-6 text-base">
          <span>🔥</span>
          <span>Chuỗi {summary.streak_current} ngày học chăm chỉ!</span>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-300 mb-8">
        {summary.reward ? (
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-amber-800 font-bold">Con nhận được:</div>
            <StickerBadge stickerKey={summary.reward.sticker_key} size="lg" />
            <Link
              href={kidsPath('/rewards')}
              className="mt-1 inline-block text-sm font-bold text-amber-700 hover:text-amber-800 underline"
            >
              Xem phòng trưng bày ➔
            </Link>
          </div>
        ) : (
          <div className="text-slate-600 font-medium">
            Cố lên, lần sau sẽ có quà nhé! 💪
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {isTopic && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="min-h-[56px] px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white text-lg font-bold shadow-md transition-all"
          >
            Luyện tiếp
          </button>
        )}
        <Link
          href={kidsPath('/home')}
          className="min-h-[56px] flex items-center justify-center px-6 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-800 text-lg font-bold shadow-md transition-all"
        >
          Về trang chính
        </Link>
      </div>
    </div>
  );
}
