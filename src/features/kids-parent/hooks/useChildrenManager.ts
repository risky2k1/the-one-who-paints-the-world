'use client';

import { useEffect, useState } from 'react';
import { deleteParentChild, listParentChildren } from '@/shared/api/kids/parentApi';
import type { Child } from '@/shared/api/kids/kids.types';
import { getParentToken } from '../lib/parentStorage';

export function useChildrenManager() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChildren = () => {
    const token = getParentToken();
    if (!token) return;

    setLoading(true);
    listParentChildren(token)
      .then((kids) => setChildren(kids))
      .catch((err) => setError(err instanceof Error ? err.message : 'Có lỗi tải danh sách con'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const handleDeleteChild = async (child: Child) => {
    if (!window.confirm(`Bố mẹ có chắc chắn muốn xóa hồ sơ bé ${child.name}? Mọi kết quả bài làm sẽ bị xóa.`)) {
      return;
    }

    const token = getParentToken();
    if (!token) return;

    try {
      await deleteParentChild(token, child.id);
      loadChildren();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Không thể xóa hồ sơ bé');
    }
  };

  return { children, loading, error, loadChildren, handleDeleteChild };
}
