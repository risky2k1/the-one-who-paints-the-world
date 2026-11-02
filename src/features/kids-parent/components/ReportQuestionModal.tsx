'use client';

import { useState } from 'react';
import { reportQuestion } from '@/shared/api/kids/parentApi';
import { getParentToken } from '../lib/parentStorage';
import { ParentModal } from './ParentModal';

export interface ReportQuestionModalProps {
  isOpen: boolean;
  questionId: number | null;
  onClose: () => void;
  onReported?: () => void;
}

function useReportQuestion(
  questionId: number | null,
  onClose: () => void,
  onReported?: () => void,
) {
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionId) return;
    if (!note.trim()) {
      setError('Vui lòng nhập mô tả vấn đề');
      return;
    }
    const token = getParentToken();
    if (!token) {
      setError('Phiên làm việc hết hạn, vui lòng đăng nhập lại');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await reportQuestion(token, questionId, note.trim());
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setNote('');
        if (onReported) onReported();
        onClose();
      }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi khi gửi báo cáo');
    } finally {
      setSubmitting(false);
    }
  };

  return { note, setNote, submitting, error, success, handleSubmit };
}

export function ReportQuestionModal({
  isOpen,
  questionId,
  onClose,
  onReported,
}: ReportQuestionModalProps) {
  const { note, setNote, submitting, error, success, handleSubmit } = useReportQuestion(
    questionId,
    onClose,
    onReported,
  );

  return (
    <ParentModal
      isOpen={isOpen && Boolean(questionId)}
      onClose={onClose}
      title="Báo câu hỏi có vấn đề"
      icon="🚩"
      headerColor="bg-[#FF90E8]"
      maxWidth="max-w-md"
    >
      <p className="text-xs font-bold text-neutral-600 uppercase mb-4">
        Báo cáo này sẽ được gửi trực tiếp đến quản trị viên kèm toàn bộ tham số sinh đề để kiểm tra và sửa lỗi.
      </p>

      {success ? (
        <div className="neo-box-sm bg-[#B8FF9F] text-black font-black text-xs text-center p-4 rounded-xl">
          ✓ Đã ghi nhận phản ánh của bố mẹ. Xin cảm ơn!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="neo-box-sm bg-[#FF90E8] text-black font-bold text-xs uppercase p-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase text-neutral-900 mb-1">
              Mô tả vấn đề của câu hỏi *
            </label>
            <textarea
              required
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Đề bài thiếu dữ kiện, gợi ý bước 2 tính sai phép cộng..."
              className="neo-box-sm bg-white w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-black focus-visible:outline-[3px] focus-visible:outline-black"
            />
          </div>

          <div className="flex gap-2 pt-1 border-t-2 border-black">
            <button
              type="button"
              onClick={onClose}
              className="neo-btn bg-white text-black font-bold uppercase text-xs flex-1 py-2 rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="neo-btn bg-[#FFE600] text-black font-black uppercase text-xs flex-1 py-2 rounded-xl disabled:opacity-50"
            >
              {submitting ? 'Đang gửi...' : 'Gửi báo cáo'}
            </button>
          </div>
        </form>
      )}
    </ParentModal>
  );
}
