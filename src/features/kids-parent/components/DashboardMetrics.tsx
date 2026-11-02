'use client';

import type { Assignment, Child } from '@/shared/api/kids/kids.types';

export interface DashboardMetricsProps {
  childrenList: Child[];
  assignments: Assignment[];
}

export function DashboardMetrics({ childrenList, assignments }: DashboardMetricsProps) {
  const maxStreak = Math.max(0, ...childrenList.map((c) => c.streak_current || 0));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="neo-card bg-white rounded-2xl overflow-hidden">
        <div className="bg-[#A6FAFF] border-b-2 border-black p-3 flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-black">CÁC BÉ</span>
          <span className="text-lg">👶</span>
        </div>
        <div className="p-5">
          <div className="text-3xl sm:text-4xl font-black text-neutral-950">{childrenList.length}</div>
          <p className="text-xs font-bold text-neutral-600 mt-1 uppercase">Hồ sơ bé đã kích hoạt</p>
        </div>
      </div>

      <div className="neo-card bg-white rounded-2xl overflow-hidden">
        <div className="bg-[#FF90E8] border-b-2 border-black p-3 flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-black">BÀI ĐÃ GIAO</span>
          <span className="text-lg">📝</span>
        </div>
        <div className="p-5">
          <div className="text-3xl sm:text-4xl font-black text-neutral-950">{assignments.length}</div>
          <p className="text-xs font-bold text-neutral-600 mt-1 uppercase">Tổng số nhiệm vụ học tập</p>
        </div>
      </div>

      <div className="neo-card bg-white rounded-2xl overflow-hidden">
        <div className="bg-[#B8FF9F] border-b-2 border-black p-3 flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-black">CHUỖI NGÀY HỌC</span>
          <span className="text-lg">🔥</span>
        </div>
        <div className="p-5">
          <div className="text-3xl sm:text-4xl font-black text-neutral-950">
            {maxStreak} <span className="text-sm font-bold text-neutral-600 uppercase">ngày</span>
          </div>
          <p className="text-xs font-bold text-neutral-600 mt-1 uppercase">Kỷ lục streak của các con</p>
        </div>
      </div>
    </div>
  );
}
