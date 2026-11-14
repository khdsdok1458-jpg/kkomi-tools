/** 2026년 추석 당일 */
export const CHUSEOK = '2026-09-25';

const KST = 9 * 3_600_000;

/** 한국 날짜 기준 오늘 */
export function kstToday(now: Date = new Date()): string {
  return new Date(now.getTime() + KST).toISOString().slice(0, 10);
}

/**
 * 추석까지 며칠 남았는지. 지났으면 음수입니다.
 * 기기 시간대를 쓰면 해외에서 하루가 어긋납니다.
 */
export function daysToChuseok(now: Date = new Date()): number {
  const today = Date.parse(`${kstToday(now)}T00:00:00Z`);
  const target = Date.parse(`${CHUSEOK}T00:00:00Z`);
  return Math.round((target - today) / 86_400_000);
}

export function ddayLabel(now: Date = new Date()): string {
  const d = daysToChuseok(now);
  if (d > 0) return `추석까지 ${d}일`;
  if (d === 0) return '오늘이 추석이에요';
  return '추석 잘 보내셨나요';
}
