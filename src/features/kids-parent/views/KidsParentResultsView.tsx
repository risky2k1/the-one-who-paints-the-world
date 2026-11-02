'use client';

import type { Child } from '@/shared/api/kids/kids.types';
import { SessionReviewModal } from '../components/SessionReviewModal';
import { WeakSkillsCard } from '../components/WeakSkillsCard';
import { AVATAR_EMOJIS } from '../lib/childrenManager';
import { useParentResults } from '../hooks/useParentResults';
import { ChildHeaderPill, ResultRow } from '../components/ParentResultComponents';

function ResultsHeader({
  kidsList,
  selectedChildId,
  onSelectChild,
}: {
  kidsList: Child[];
  selectedChildId: number | null;
  onSelectChild: (id: number) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950">
          Kết quả &amp; Chẩn đoán học tập
        </h2>
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-600 mt-1">
          Theo dõi điểm số, số lần làm lại và các kỹ năng cần củng cố của con
        </p>
      </div>

      {kidsList.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase text-neutral-700">Xem kết quả của:</span>
          <select
            value={selectedChildId || ''}
            onChange={(e) => onSelectChild(Number(e.target.value))}
            className="neo-box-sm bg-white rounded-xl px-3 py-2 text-xs font-black uppercase text-black focus-visible:outline-[3px] focus-visible:outline-black"
          >
            {kidsList.map((c) => (
              <option key={c.id} value={c.id}>
                {AVATAR_EMOJIS[c.avatar]} {c.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export function KidsParentResultsView() {
  const {
    children,
    selectedChildId,
    setSelectedChildId,
    selectedChild,
    weakSkills,
    results,
    loading,
    loadingChildData,
    error,
    viewingSessionId,
    setViewingSessionId,
  } = useParentResults();

  return (
    <div className="space-y-6">
      <ResultsHeader
        kidsList={children}
        selectedChildId={selectedChildId}
        onSelectChild={setSelectedChildId}
      />

      {error && (
        <div className="neo-box-sm bg-[#FF90E8] text-black font-bold text-xs uppercase p-4 rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm font-black uppercase tracking-wide text-neutral-950 animate-pulse">
          Đang nạp dữ liệu kết quả...
        </div>
      ) : children.length === 0 ? (
        <div className="neo-card bg-white rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">👶</div>
          <h3 className="text-base font-black uppercase tracking-tight text-neutral-950 mb-1">
            Chưa có hồ sơ bé nào
          </h3>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-600 max-w-sm mx-auto">
            Bố mẹ hãy thêm hồ sơ của bé để bắt đầu theo dõi kết quả làm bài nhé.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {selectedChild && <ChildHeaderPill child={selectedChild} />}
          <WeakSkillsCard skills={weakSkills} loading={loadingChildData} />

          <div className="neo-card bg-white rounded-2xl overflow-hidden">
            <div className="bg-[#B8FF9F] border-b-2 border-black p-4 flex items-center justify-between">
              <h3 className="font-black text-neutral-950 text-sm sm:text-base uppercase tracking-tight">
                Lịch sử làm bài tập của {selectedChild?.name}
              </h3>
            </div>

            <div className="p-5 sm:p-6">
              {loadingChildData ? (
                <div className="py-8 text-center text-xs font-black uppercase tracking-wide text-neutral-950 animate-pulse">
                  Đang tải điểm số...
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-8 text-neutral-600 text-xs font-bold uppercase">
                  Bé chưa hoàn thành bài tập nào. Khi bé làm xong, kết quả sẽ hiện tại đây!
                </div>
              ) : (
                <div className="divide-y-2 divide-black">
                  {results.map((item) => (
                    <ResultRow
                      key={item.assignment_id}
                      item={item}
                      onViewDetails={setViewingSessionId}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <SessionReviewModal
        isOpen={Boolean(viewingSessionId)}
        sessionId={viewingSessionId}
        onClose={() => setViewingSessionId(null)}
      />
    </div>
  );
}
