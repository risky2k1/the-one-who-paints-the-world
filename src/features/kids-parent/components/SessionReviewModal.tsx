'use client';

import { useEffect, useState } from 'react';
import { getParentSessionReview } from '@/shared/api/kids/parentApi';
import type { SessionReview } from '@/shared/api/kids/kids.types';
import { buildWorksheetData, type PrintableWorksheet } from '../lib/printableWorksheet';
import { getParentToken } from '../lib/parentStorage';
import { ReportQuestionModal } from './ReportQuestionModal';
import { PrintWorksheetModal } from './PrintWorksheetModal';
import { ParentModal } from './ParentModal';
import { ReviewQuestionItem } from './ReviewQuestionItem';

export interface SessionReviewModalProps {
  isOpen: boolean;
  sessionId: number | null;
  onClose: () => void;
}

function useSessionReviewData(sessionId: number | null, isOpen: boolean) {
  const [review, setReview] = useState<SessionReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !sessionId) return;
    const token = getParentToken();
    if (!token) return;

    setLoading(true);
    setError(null);
    getParentSessionReview(token, sessionId)
      .then((data) => setReview(data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Có lỗi tải chi tiết bài làm'))
      .finally(() => setLoading(false));
  }, [isOpen, sessionId]);

  return { review, loading, error };
}

export function SessionReviewModal({ isOpen, sessionId, onClose }: SessionReviewModalProps) {
  const { review, loading, error } = useSessionReviewData(sessionId, isOpen);
  const [reportingQuestionId, setReportingQuestionId] = useState<number | null>(null);
  const [printWorksheet, setPrintWorksheet] = useState<PrintableWorksheet | null>(null);

  const handlePrint = () => {
    if (!review) return;
    const ws = buildWorksheetData({
      title: `Bài tập #${review.id}`,
      questions: review.questions,
    });
    setPrintWorksheet(ws);
  };

  return (
    <ParentModal
      isOpen={isOpen && Boolean(sessionId)}
      onClose={onClose}
      title={`Chi tiết bài làm #${sessionId}`}
      icon="📊"
      headerColor="bg-[#B8FF9F]"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {loading && (
          <div className="py-12 text-center text-sm font-black uppercase tracking-wide text-neutral-950 animate-pulse">
            Đang tải nội dung bài làm...
          </div>
        )}

        {error && (
          <div className="neo-box-sm bg-[#FF90E8] text-black font-bold text-xs uppercase p-4 rounded-xl">
            {error}
          </div>
        )}

        {review && (
          <>
            <div className="neo-box-sm bg-[#B8FF9F] p-4 rounded-xl flex items-center justify-between text-xs font-black uppercase text-black">
              <div>
                Điểm lần đầu:{' '}
                <span className="text-sm font-black">
                  {review.first_try_correct}/{review.total}
                </span>{' '}
                câu đúng
              </div>
              <span className="neo-badge bg-black text-white px-2 py-0.5 rounded">
                ĐẠT {Math.round((review.first_try_correct / review.total) * 100)}%
              </span>
            </div>

            <div className="space-y-3">
              {review.questions.map((q, idx) => (
                <ReviewQuestionItem
                  key={q.id}
                  question={q}
                  index={idx}
                  onReport={setReportingQuestionId}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="pt-4 mt-4 border-t-2 border-black flex items-center justify-between">
        <button
          type="button"
          disabled={!review}
          onClick={handlePrint}
          className="neo-btn bg-[#A6FAFF] text-black font-black uppercase text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 disabled:opacity-50"
        >
          <span>🖨️</span>
          <span>In phiếu bài làm</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="neo-btn bg-white text-black font-bold uppercase text-xs px-5 py-2 rounded-xl"
        >
          Đóng
        </button>
      </div>

      <ReportQuestionModal
        isOpen={Boolean(reportingQuestionId)}
        questionId={reportingQuestionId}
        onClose={() => setReportingQuestionId(null)}
      />

      <PrintWorksheetModal
        isOpen={Boolean(printWorksheet)}
        worksheet={printWorksheet}
        onClose={() => setPrintWorksheet(null)}
      />
    </ParentModal>
  );
}
