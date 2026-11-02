'use client';

import { useState } from 'react';
import type { Assignment, Child } from '@/shared/api/kids/kids.types';
import { AssignmentTable } from '../components/AssignmentTable';
import { CreateAssignmentModal } from '../components/CreateAssignmentModal';
import { PrintWorksheetModal } from '../components/PrintWorksheetModal';
import { buildWorksheetData, type PrintableWorksheet } from '../lib/printableWorksheet';
import { useParentAssignments } from '../hooks/useParentAssignments';

interface HeaderProps {
  childrenList: Child[];
  selectedChildFilter: number | 'all';
  assignments: Assignment[];
  onFilterChange: (val: number | 'all') => void;
  onOpenCreate: () => void;
}

function AssignmentsHeader({
  childrenList,
  selectedChildFilter,
  assignments,
  onFilterChange,
  onOpenCreate,
}: HeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950">
          Quản lý bài tập đã giao
        </h2>
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-600 mt-1">
          Theo dõi, phân công chủ đề ôn luyện và thời hạn cho các con
        </p>
      </div>

      <div className="flex items-center gap-3">
        {childrenList.length > 0 && (
          <select
            value={selectedChildFilter}
            onChange={(e) =>
              onFilterChange(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="neo-box-sm bg-white rounded-xl px-3 py-2 text-xs font-black uppercase text-black focus-visible:outline-[3px] focus-visible:outline-black"
          >
            <option value="all">Tất cả các con ({assignments.length})</option>
            {childrenList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({assignments.filter((a) => a.child_id === c.id).length} bài)
              </option>
            ))}
          </select>
        )}

        <button
          type="button"
          disabled={childrenList.length === 0}
          onClick={onOpenCreate}
          className="neo-btn bg-[#A6FAFF] text-black font-black uppercase text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 disabled:opacity-50"
        >
          <span>+</span>
          <span>Giao bài mới</span>
        </button>
      </div>
    </div>
  );
}

function prepareSampleQuestions(assignment: Assignment) {
  const count = assignment.question_count || 10;
  return Array.from({ length: count }).map((_, idx) => ({
    id: idx + 1,
    prompt: {
      type: 'arithmetic' as const,
      text: `Câu hỏi số ${idx + 1} (${assignment.title})`,
      input: 'number' as const,
    },
    answer: 'Đáp án theo đề thi thực tế',
    solution: ['Học sinh tự trình bày các bước giải ra phiếu'],
  }));
}

export function KidsParentAssignmentsView() {
  const { children, assignments, loading, error, loadData, handleDelete } = useParentAssignments();
  const [selectedChildFilter, setSelectedChildFilter] = useState<number | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [printableWorksheet, setPrintableWorksheet] = useState<PrintableWorksheet | null>(null);

  const handlePrintAssignment = (assignment: Assignment) => {
    const child = children.find((c) => c.id === assignment.child_id);
    const questions = prepareSampleQuestions(assignment);
    const ws = buildWorksheetData({
      title: assignment.title,
      childName: child?.name,
      grade: child?.grade || 2,
      questions,
    });
    setPrintableWorksheet(ws);
  };

  const filteredAssignments =
    selectedChildFilter === 'all'
      ? assignments
      : assignments.filter((a) => a.child_id === selectedChildFilter);

  return (
    <div className="space-y-6">
      <AssignmentsHeader
        childrenList={children}
        selectedChildFilter={selectedChildFilter}
        assignments={assignments}
        onFilterChange={setSelectedChildFilter}
        onOpenCreate={() => setModalOpen(true)}
      />

      {error && (
        <div className="neo-box-sm bg-[#FF90E8] text-black font-bold text-xs uppercase p-4 rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm font-black uppercase tracking-wide text-neutral-950 animate-pulse">
          Đang nạp danh sách bài tập...
        </div>
      ) : children.length === 0 ? (
        <div className="neo-card bg-white rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">👶</div>
          <h3 className="text-base font-black uppercase tracking-tight text-neutral-950 mb-1">
            Chưa có hồ sơ bé nào
          </h3>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-600 max-w-sm mx-auto mb-4">
            Bố mẹ hãy thêm hồ sơ của bé trước khi giao bài tập nhé.
          </p>
        </div>
      ) : (
        <AssignmentTable
          assignments={filteredAssignments}
          childrenList={children}
          onDelete={handleDelete}
          onPrint={handlePrintAssignment}
        />
      )}

      <CreateAssignmentModal
        isOpen={modalOpen}
        childrenList={children}
        preselectedChildId={selectedChildFilter === 'all' ? null : selectedChildFilter}
        onClose={() => setModalOpen(false)}
        onCreated={() => loadData()}
      />

      <PrintWorksheetModal
        isOpen={Boolean(printableWorksheet)}
        worksheet={printableWorksheet}
        onClose={() => setPrintableWorksheet(null)}
      />
    </div>
  );
}
