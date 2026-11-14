import type { AppData } from './storage';
import type { Shift } from '../data/shifts';
import { addDays, daysBetween, monthOf } from './calendar';
import { findShift } from '../data/shifts';

/** 그날 근무 */
export function shiftOn(data: AppData, date: string): Shift | undefined {
  return findShift(data.shifts, data.schedule[date]);
}

/**
 * 다음 쉬는 날까지 며칠 남았는지.
 *
 * 이 앱을 매일 여는 이유가 이겁니다. 근무표 자체보다 "언제 쉬냐"가
 * 사람들이 실제로 궁금해하는 것입니다.
 *
 * 오늘이 쉬는 날이면 0을 돌려줍니다. 앞으로 60일 안에 없으면 null입니다.
 */
export function nextOff(
  data: AppData,
  today: string
): { date: string; inDays: number } | null {
  for (let i = 0; i < 60; i++) {
    const d = addDays(today, i);
    const s = shiftOn(data, d);
    if (s?.isOff) return { date: d, inDays: i };
  }
  return null;
}

/** 이번 달 근무 종류별 개수. 나이트가 몇 번인지가 수당과 직결됩니다. */
export function monthCounts(
  data: AppData,
  month: string
): { shift: Shift; count: number }[] {
  const counts = new Map<string, number>();
  for (const [date, id] of Object.entries(data.schedule)) {
    if (monthOf(date) !== month) continue;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return data.shifts
    .map((shift) => ({ shift, count: counts.get(shift.id) ?? 0 }))
    .filter((r) => r.count > 0);
}

/**
 * 패턴을 반복해서 앞으로의 날짜를 채웁니다.
 *
 * 4조3교대처럼 정해진 주기로 도는 근무에 씁니다. 간호사는 매달 근무표를
 * 받아서 옮겨 적기 때문에 이 기능을 쓰지 않습니다.
 *
 * 이미 채워진 날은 건드리지 않습니다. 손으로 고친 걸 덮어쓰면
 * 사용자가 앱을 못 믿게 됩니다.
 */
export function fillPattern(
  schedule: Record<string, string>,
  pattern: string[],
  startDate: string,
  days: number,
  overwrite: boolean
): Record<string, string> {
  if (pattern.length === 0 || days <= 0) return schedule;
  const next = { ...schedule };
  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i);
    if (!overwrite && next[date]) continue;
    next[date] = pattern[i % pattern.length];
  }
  return next;
}

/** 시작일이 과거여도 오늘 기준으로 패턴이 어디쯤인지 맞습니다. */
export function patternIndexAt(
  startDate: string,
  date: string,
  patternLength: number
): number {
  if (patternLength <= 0) return 0;
  const diff = daysBetween(startDate, date);
  return ((diff % patternLength) + patternLength) % patternLength;
}
