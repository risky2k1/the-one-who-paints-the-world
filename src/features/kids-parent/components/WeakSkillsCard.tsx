'use client';

import type { WeakSkill } from '@/shared/api/kids/kids.types';
import { formatAccuracy, getAccuracyLevel } from '../lib/resultsView';

export interface WeakSkillsCardProps {
  skills: WeakSkill[];
  loading?: boolean;
}

export function WeakSkillsCard({ skills, loading = false }: WeakSkillsCardProps) {
  if (loading) {
    return (
      <div className="neo-card bg-white rounded-2xl p-6 animate-pulse">
        <div className="h-5 bg-neutral-200 rounded-sm w-48 mb-4" />
        <div className="space-y-3">
          <div className="h-12 bg-neutral-100 rounded-xl" />
          <div className="h-12 bg-neutral-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="neo-card bg-white rounded-2xl overflow-hidden">
      <div className="bg-[#FF90E8] border-b-2 border-black p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <div>
            <h3 className="font-black text-neutral-950 text-sm sm:text-base uppercase tracking-tight">
              Chẩn đoán kỹ năng cần cải thiện
            </h3>
            <p className="text-[11px] font-bold text-neutral-800 uppercase">
              Tỷ lệ đúng lần đầu dưới 70% (tối thiểu 5 lần làm)
            </p>
          </div>
        </div>
        <span className="neo-badge bg-black text-white text-[11px] font-black uppercase px-2.5 py-1 rounded">
          {skills.length} KỸ NĂNG
        </span>
      </div>

      <div className="p-5 sm:p-6">
        {skills.length === 0 ? (
          <div className="py-6 text-center text-neutral-600 text-xs sm:text-sm font-bold uppercase">
            🎉 Bé làm rất tốt! Chưa phát hiện kỹ năng nào có tỷ lệ sai nhiều.
          </div>
        ) : (
          <div className="space-y-3">
            {skills.map((skill) => {
              const severity = getAccuracyLevel(skill.first_try_accuracy);
              const isCritical = severity === 'critical';

              return (
                <div
                  key={skill.topic_id}
                  className="p-3.5 rounded-xl neo-box-sm bg-[#FAF7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="font-black text-neutral-950 text-sm uppercase truncate">
                        {skill.name}
                      </h4>
                      <span className="neo-badge bg-white text-black text-[10px] font-black uppercase px-1.5 py-0.5 rounded">
                        Bậc {skill.level}/5
                      </span>
                      <span
                        className={`neo-badge text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          isCritical ? 'bg-[#FF90E8] text-black' : 'bg-[#FFE600] text-black'
                        }`}
                      >
                        {isCritical ? 'Cần ôn gấp' : 'Cần luyện thêm'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white border-2 border-black rounded-md h-3 overflow-hidden">
                        <div
                          className={`h-full border-r-2 border-black ${
                            isCritical ? 'bg-[#FF90E8]' : 'bg-[#FFE600]'
                          }`}
                          style={{ width: `${Math.round(skill.first_try_accuracy * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-neutral-950 shrink-0">
                        {formatAccuracy(skill.first_try_accuracy)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-neutral-600 uppercase">
                      Đã làm: <strong className="text-black font-black">{skill.answered}</strong> câu
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
