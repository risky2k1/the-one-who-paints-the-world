'use client';

import { useState } from 'react';
import type { Child } from '@/shared/api/kids/kids.types';
import { ChildEditorModal } from '../components/ChildEditorModal';
import { ParentChildCard } from '../components/ParentChildCard';
import { useChildrenManager } from '../hooks/useChildrenManager';

export function KidsParentChildrenView() {
  const { children, loading, error, loadChildren, handleDeleteChild } = useChildrenManager();
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const handleOpenAdd = () => {
    setSelectedChild(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (child: Child) => {
    setSelectedChild(child);
    setEditorOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950">
            Quản lý hồ sơ các con
          </h2>
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-600 mt-1">
            Cấu hình lớp học, bộ sách và phân quyền học tập cho từng bé
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="neo-btn bg-[#FF90E8] text-black font-black uppercase text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>+</span>
          <span>Thêm hồ sơ bé</span>
        </button>
      </div>

      {error && (
        <div className="neo-box-sm bg-[#FF90E8] text-black font-bold text-xs uppercase p-4 rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm font-black uppercase tracking-wide text-neutral-950 animate-pulse">
          Đang nạp danh sách bé...
        </div>
      ) : children.length === 0 ? (
        <div className="neo-card bg-white rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">👶</div>
          <h3 className="text-lg font-black uppercase tracking-tight text-neutral-950 mb-1">
            Chưa có hồ sơ bé nào
          </h3>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-600 max-w-sm mx-auto mb-6">
            Bố mẹ hãy thêm hồ sơ của các con để bắt đầu giao bài tập và đồng hành cùng con nhé!
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="neo-btn bg-[#FFE600] text-black font-black uppercase text-xs sm:text-sm px-5 py-2.5 rounded-xl"
          >
            + Thêm bé đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {children.map((child) => (
            <ParentChildCard
              key={child.id}
              child={child}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteChild}
            />
          ))}
        </div>
      )}

      <ChildEditorModal
        isOpen={editorOpen}
        child={selectedChild}
        onClose={() => setEditorOpen(false)}
        onSaved={loadChildren}
      />
    </div>
  );
}
