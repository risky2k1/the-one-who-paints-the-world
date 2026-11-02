'use client';

import Link from 'next/link';
import { kidsPath } from '../lib/config';
import type { PlaySource } from '../lib/play';
import type { SessionSummary } from '@/shared/api/kids';
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
    <div className="mx-auto max-w-lg w-full neo-card bg-white rounded-2xl p-6 sm:p-8 text-center">
      <div className="text-4xl sm:text-5xl mb-3" aria-hidden="true">
        🏆
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 mb-2">
        Hoàn thành bài tập!
      </h2>
      <p className="text-neutral-700 mb-6 text-lg font-medium">Con đã làm rất tốt hôm nay!</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="neo-box bg-[#B8FF9F] rounded-xl p-4">
          <div className="text-sm font-bold text-neutral-950 mb-1">Đúng lần đầu</div>
          <div className="text-3xl font-black text-neutral-950">
            {summary.first_try_correct}/{summary.total}
          </div>
        </div>

        <div className="neo-box bg-[#A6FAFF] rounded-xl p-4">
          <div className="text-sm font-bold text-neutral-950 mb-1">Thời gian</div>
          <div className="text-2xl font-black text-neutral-950">{timeFormatted}</div>
        </div>
      </div>

      {summary.streak_current > 0 && (
        <div className="inline-flex items-center gap-2 px-4 py-2 neo-badge bg-[#FFB86B] text-neutral-950 rounded-xl font-black mb-6 text-base">
          <span>🔥</span>
          <span>Chuỗi {summary.streak_current} ngày học chăm chỉ!</span>
        </div>
      )}

      <div className="p-4 rounded-xl neo-box bg-[#FFE600] mb-8">
        {summary.reward ? (
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-neutral-950 font-black">Con nhận được:</div>
            <StickerBadge stickerKey={summary.reward.sticker_key} size="lg" />
            <Link
              href={kidsPath('/rewards')}
              className="mt-2 inline-block px-4 py-1.5 rounded-lg neo-btn bg-white text-black text-xs font-black"
            >
              Xem phòng trưng bày ➔
            </Link>
          </div>
        ) : (
          <div className="text-neutral-950 font-bold">
            Cố lên, lần sau sẽ có quà nhé! 💪
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {isTopic && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="min-h-[56px] px-6 py-3 rounded-xl neo-btn bg-[#FFE600] text-black text-lg font-black"
          >
            Luyện tiếp
          </button>
        )}
        <Link
          href={kidsPath('/home')}
          className="min-h-[56px] flex items-center justify-center px-6 py-3 rounded-xl neo-btn bg-white text-black text-lg font-black"
        >
          Về trang chính
        </Link>
      </div>
    </div>
  );
}
