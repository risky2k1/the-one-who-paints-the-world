'use client';

import Link from 'next/link';
import type { Child } from '@/shared/api/kids/kids.types';
import { PATHS } from '@/shared/config/paths';
import { useParentDashboard } from '../hooks/useParentDashboard';
import { DashboardMetrics } from '../components/DashboardMetrics';

function DashboardBanner() {
  return (
    <div className="neo-box-lg bg-[#FFE600] rounded-2xl p-6 sm:p-8 text-black">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="neo-badge bg-black text-white text-[11px] font-black uppercase rounded mb-2">
            BẢNG ĐIỀU KHIỂN
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
            Xin chào Bố Mẹ! 👋
          </h2>
          <p className="text-neutral-800 text-xs sm:text-sm font-bold mt-1">
            Đồng hành cùng các con trong hành trình học Toán mỗi ngày
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={PATHS.kids.parentAssignments}
            className="neo-btn bg-black text-white font-black uppercase text-xs sm:text-sm px-4 py-2.5 rounded-xl"
          >
            + Giao bài mới
          </Link>
          <Link
            href={PATHS.kids.parentChildren}
            className="neo-btn bg-white text-black font-black uppercase text-xs sm:text-sm px-4 py-2.5 rounded-xl"
          >
            + Thêm bé
          </Link>
        </div>
      </div>
    </div>
  );
}

function avatarIcon(key: string) {
  if (key === 'fox') return '🦊';
  if (key === 'cat') return '🐱';
  if (key === 'panda') return '🐼';
  return '🐰';
}

function ChildCardItem({ child }: { child: Child }) {
  return (
    <div className="p-4 rounded-xl neo-box-sm bg-[#FAF7F2] flex items-center gap-3.5">
      <div className="w-12 h-12 rounded-xl neo-box-sm bg-[#FFE600] text-2xl flex items-center justify-center shrink-0">
        {avatarIcon(child.avatar)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-sm uppercase text-neutral-950 truncate">{child.name}</h4>
        <p className="text-xs font-bold text-neutral-600">
          Lớp {child.grade} • 🔥 {child.streak_current} ngày
        </p>
      </div>
      <Link
        href={`${PATHS.kids.parentResults}?child_id=${child.id}`}
        className="neo-btn bg-white text-black font-black uppercase text-xs px-2.5 py-1.5 rounded-lg shrink-0"
      >
        Kết quả
      </Link>
    </div>
  );
}

export function KidsParentDashboardView() {
  const { children, assignments, loading, error } = useParentDashboard();

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="text-sm font-black uppercase tracking-wide text-neutral-950 animate-pulse">
          Đang tải bảng điều khiển...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardBanner />
      {error && (
        <div className="neo-box-sm bg-[#FF90E8] text-black font-bold text-xs uppercase p-4 rounded-xl">
          {error}
        </div>
      )}
      <DashboardMetrics childrenList={children} assignments={assignments} />

      <div className="neo-card bg-white rounded-2xl overflow-hidden">
        <div className="bg-[#FF90E8] border-b-2 border-black p-4 flex items-center justify-between">
          <h3 className="font-black uppercase text-sm sm:text-base text-neutral-950">
            Danh sách các con
          </h3>
          <Link
            href={PATHS.kids.parentChildren}
            className="neo-btn bg-white text-black font-extrabold uppercase text-xs px-3 py-1 rounded-lg"
          >
            Quản lý chi tiết →
          </Link>
        </div>

        <div className="p-5 sm:p-6">
          {children.length === 0 ? (
            <div className="text-center py-8 text-neutral-600 text-xs sm:text-sm font-bold uppercase">
              Bố mẹ chưa thêm bé nào.{' '}
              <Link href={PATHS.kids.parentChildren} className="text-black underline font-black">
                Thêm bé ngay
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map((child) => (
                <ChildCardItem key={child.id} child={child} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="neo-card bg-white rounded-2xl overflow-hidden">
        <div className="bg-[#A6FAFF] border-b-2 border-black p-4 flex items-center justify-between">
          <h3 className="font-black uppercase text-sm sm:text-base text-neutral-950">
            Bài tập đã giao gần đây
          </h3>
          <Link
            href={PATHS.kids.parentAssignments}
            className="neo-btn bg-white text-black font-extrabold uppercase text-xs px-3 py-1 rounded-lg"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="p-5 sm:p-6">
          {assignments.length === 0 ? (
            <div className="text-center py-8 text-neutral-600 text-xs sm:text-sm font-bold uppercase">
              Chưa có bài tập nào được giao.{' '}
              <Link href={PATHS.kids.parentAssignments} className="text-black underline font-black">
                Giao bài đầu tiên cho con
              </Link>
            </div>
          ) : (
            <div className="divide-y-2 divide-black">
              {assignments.slice(0, 5).map((a) => {
                const targetChild = children.find((c) => c.id === a.child_id);
                return (
                  <div key={a.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-black text-neutral-950 text-sm uppercase">{a.title}</h4>
                      <p className="text-xs font-bold text-neutral-600 mt-0.5">
                        Giao cho: <span className="font-black text-neutral-900">{targetChild?.name || `Bé #${a.child_id}`}</span> • {a.question_count} câu • Độ khó: {a.difficulty}
                      </p>
                    </div>
                    <span className="neo-badge bg-[#FAF7F2] text-black font-extrabold text-[11px] uppercase px-2.5 py-1 rounded-md shrink-0">
                      {a.due_at ? `Hạn: ${new Date(a.due_at).toLocaleDateString('vi-VN')}` : 'Không giới hạn'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
