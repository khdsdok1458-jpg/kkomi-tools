import { Storage } from '@apps-in-toss/web-framework';
import type { Shift } from '../data/shifts';
import { DEFAULT_PRESET } from '../data/shifts';

/**
 * 브라우저 localStorage를 쓰지 않습니다.
 * QR 테스트 환경과 출시 환경은 Origin이 달라서 데이터가 공유되지 않습니다.
 * SDK가 주는 Storage만 그 영향을 받지 않습니다.
 */
const KEY = 'shift:data:v1';

export interface AppData {
  /** 내가 쓰는 근무 종류들 */
  shifts: Shift[];
  /** 'YYYY-MM-DD' -> 근무 id */
  schedule: Record<string, string>;
}

const fallback = new Map<string, string>();

async function readRaw(): Promise<string | null> {
  try {
    return await Storage.getItem(KEY);
  } catch {
    return fallback.get(KEY) ?? null;
  }
}

async function writeRaw(value: string): Promise<void> {
  try {
    await Storage.setItem(KEY, value);
  } catch {
    fallback.set(KEY, value);
  }
}

export function emptyData(): AppData {
  return { shifts: DEFAULT_PRESET.shifts, schedule: {} };
}

export async function loadData(): Promise<AppData> {
  const raw = await readRaw();
  if (!raw) return emptyData();
  try {
    const parsed = JSON.parse(raw) as Partial<AppData>;
    // 값이 깨져 있어도 앱은 열려야 합니다.
    const shifts =
      Array.isArray(parsed.shifts) && parsed.shifts.length > 0
        ? parsed.shifts
        : DEFAULT_PRESET.shifts;
    const schedule =
      parsed.schedule && typeof parsed.schedule === 'object'
        ? parsed.schedule
        : {};
    return { shifts, schedule };
  } catch {
    return emptyData();
  }
}

export async function saveData(data: AppData): Promise<void> {
  await writeRaw(JSON.stringify(data));
}
