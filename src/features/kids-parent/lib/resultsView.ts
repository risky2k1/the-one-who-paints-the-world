export function formatAccuracy(accuracy: number): string {
  const pct = Math.round(accuracy * 100);
  return `${pct}%`;
}

export function getAccuracyLevel(accuracy: number): 'critical' | 'warning' | 'good' {
  if (accuracy < 0.5) return 'critical';
  if (accuracy < 0.7) return 'warning';
  return 'good';
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0 giây';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s} giây`;
  if (s === 0) return `${m} phút`;
  return `${m} phút ${s} giây`;
}
