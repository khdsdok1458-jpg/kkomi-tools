/**
 * 날짜 계산은 전부 한국 시간 기준입니다.
 *
 * 기기 시간대를 따라가면 해외에 있거나 설정이 다를 때 "오늘"이 어긋납니다.
 * 근무표에서 오늘이 하루 밀리면 앱이 아무 쓸모가 없습니다.
 */
const KST_OFFSET = 9 * 3_600_000;

/** 주어진 시각의 한국 날짜를 YYYY-MM-DD로 */
export function kstToday(now: Date = new Date()): string {
  return new Date(now.getTime() + KST_OFFSET).toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  const t = Date.parse(`${date}T00:00:00Z`) + days * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string): number {
  return Math.round(
    (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000
  );
}

/** 'YYYY-MM' */
export function monthOf(date: string): string {
  return date.slice(0, 7);
}

export function addMonths(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number);
  const total = y * 12 + (m - 1) + delta;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return `${ny}-${String(nm).padStart(2, '0')}`;
}

export function daysInMonth(month: string): number {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** 그 달 1일이 무슨 요일인지 (0=일요일) */
export function firstWeekday(month: string): number {
  return new Date(`${month}-01T00:00:00Z`).getUTCDay();
}

export function weekdayOf(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

export const WEEKDAY_LABEL = ['일', '월', '화', '수', '목', '금', '토'];

/** 달력에 그릴 날짜들. 앞은 빈칸으로 채웁니다. */
export function monthGrid(month: string): (string | null)[] {
  const cells: (string | null)[] = [];
  for (let i = 0; i < firstWeekday(month); i++) cells.push(null);
  const total = daysInMonth(month);
  for (let d = 1; d <= total; d++) {
    cells.push(`${month}-${String(d).padStart(2, '0')}`);
  }
  return cells;
}

export function dayOf(date: string): number {
  return Number(date.slice(8, 10));
}

/** '2026년 9월' */
export function monthLabel(month: string): string {
  const [y, m] = month.split('-');
  return `${y}년 ${Number(m)}월`;
}

/** '9월 12일 (토)' */
export function dateLabel(date: string): string {
  const m = Number(date.slice(5, 7));
  const d = Number(date.slice(8, 10));
  return `${m}월 ${d}일 (${WEEKDAY_LABEL[weekdayOf(date)]})`;
}
