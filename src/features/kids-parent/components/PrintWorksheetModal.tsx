'use client';

import type { PrintableWorksheet } from '../lib/printableWorksheet';

export interface PrintWorksheetModalProps {
  isOpen: boolean;
  worksheet: PrintableWorksheet | null;
  onClose: () => void;
}

function StudentInfoGrid({ worksheet }: { worksheet: PrintableWorksheet }) {
  return (
    <div className="mt-4 pt-3 border-t-2 border-black grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-left">
      <div>
        Họ và tên: <strong className="underline">{worksheet.childName || '................................'}</strong>
      </div>
      <div>Lớp: <strong className="underline">{worksheet.grade ? `${worksheet.grade}` : '......'}</strong></div>
      <div>Ngày: <strong className="underline">{worksheet.dateStr}</strong></div>
      <div>Điểm: <strong className="underline">........./10</strong></div>
    </div>
  );
}

function WorksheetQuestionsList({ questions }: { questions: PrintableWorksheet['questions'] }) {
  return (
    <div className="space-y-6">
      {questions.map((q) => (
        <div key={q.number} className="text-sm leading-relaxed">
          <div className="font-black text-neutral-950 mb-1.5">
            Câu {q.number}: {q.promptText}
          </div>

          {q.isoFaces && q.isoFaces.length > 0 && (
            <div className="my-3 flex justify-center">
              <svg viewBox="-120 -100 240 180" className="w-44 h-32 border-2 border-black rounded-lg bg-white">
                {q.isoFaces.map((face, fIdx) => (
                  <polygon
                    key={fIdx}
                    points={face.points}
                    fill={face.face === 'top' ? '#ffffff' : face.face === 'left' ? '#e5e5e5' : '#cccccc'}
                    stroke="#000000"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                ))}
              </svg>
            </div>
          )}

          <div className="pt-2 pb-3 border-b-2 border-dashed border-neutral-300 text-xs text-neutral-500 font-medium">
            Bài làm: ......................................................................................................................................................................................................................
          </div>
        </div>
      ))}
    </div>
  );
}

function WorksheetSolutionsList({
  title,
  questions,
}: {
  title: string;
  questions: PrintableWorksheet['questions'];
}) {
  return (
    <div className="mt-8 pt-8 border-t-4 border-black print:mt-0 print:pt-0 print:border-none page-break">
      <div className="p-6 sm:p-8 neo-box-sm rounded-2xl print:border-none print:p-0 print:rounded-none bg-[#FAF7F2] print:bg-white">
        <div className="text-center mb-6 border-b-2 border-black pb-3">
          <h3 className="text-lg font-black uppercase text-neutral-950">
            ĐÁP ÁN &amp; HƯỚNG DẪN CHẤM BÀI
          </h3>
          <p className="text-xs text-neutral-700 font-bold uppercase mt-1">
            {title} — Dành cho Bố Mẹ chấm điểm
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {questions.map((q) => (
            <div key={q.number} className="p-3 bg-white border-2 border-black rounded-xl">
              <div className="flex items-start justify-between gap-2">
                <span className="font-black text-neutral-950 uppercase">
                  Câu {q.number}:
                </span>
                <span className="font-black text-neutral-950 text-sm">
                  Đáp án: {q.answer}
                </span>
              </div>

              {q.solutionSteps.length > 0 && (
                <div className="mt-1 pt-1 border-t-2 border-neutral-100 text-neutral-800 font-medium">
                  <span className="font-bold text-neutral-600">Hướng dẫn giải: </span>
                  {q.solutionSteps.join(' ➔ ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PrintWorksheetModal({ isOpen, worksheet, onClose }: PrintWorksheetModalProps) {
  if (!isOpen || !worksheet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white rounded-2xl neo-box-lg max-w-4xl w-full p-4 sm:p-8 my-6 max-h-[92vh] flex flex-col print:max-w-none print:w-full print:m-0 print:p-0 print:border-none print:shadow-none print:max-h-none print:rounded-none">
        <div className="flex items-center justify-between pb-4 border-b-2 border-black print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🖨️</span>
            <div>
              <h2 className="text-base font-black uppercase tracking-tight text-neutral-950">
                Xem trước &amp; In phiếu bài tập A4
              </h2>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                Đề bài và đáp án sẽ ngắt trang riêng biệt khi in ra giấy hoặc lưu PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="neo-btn bg-[#FFE600] text-black font-black uppercase text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
            >
              <span>🖨️</span>
              <span>In phiếu / Lưu PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="neo-btn bg-white text-black font-bold uppercase text-xs px-3 py-2 rounded-xl"
            >
              Đóng
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 print:overflow-visible print:py-0 text-neutral-950 font-sans">
          <div className="p-6 sm:p-8 neo-box-sm rounded-2xl print:border-none print:p-0 print:rounded-none bg-white">
            <div className="text-center mb-6 border-b-2 border-black pb-4">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950 mb-1">
                PHIẾU BÀI TẬP TOÁN {worksheet.grade ? `LỚP ${worksheet.grade}` : ''}
              </h1>
              <h2 className="text-sm font-black uppercase text-neutral-800">{worksheet.title}</h2>
              <StudentInfoGrid worksheet={worksheet} />
            </div>

            <WorksheetQuestionsList questions={worksheet.questions} />
          </div>

          <WorksheetSolutionsList title={worksheet.title} questions={worksheet.questions} />
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          body {
            background: white !important;
            color: black !important;
          }
          header, nav, footer, button {
            display: none !important;
          }
          .page-break {
            page-break-before: always !important;
            break-before: page !important;
          }
        }
      `}</style>
    </div>
  );
}
