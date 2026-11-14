import { Storage } from '@apps-in-toss/web-framework';
import type { Style } from '../data/table';

/**
 * 브라우저 localStorage를 쓰지 않습니다.
 * QR 테스트 환경과 출시 환경의 Origin이 달라서 데이터가 공유되지 않습니다.
 */
const KEY = 'charye:v1';

export interface AppData {
  style: Style;
  /** 장 본 것 체크. 음식 id 목록 */
  bought: string[];
}

const fallback = new Map<string, string>();

export function emptyData(): AppData {
  return { style: 'full', bought: [] };
}

export async function loadData(): Promise<AppData> {
  let raw: string | null;
  try {
    raw = await Storage.getItem(KEY);
  } catch {
    raw = fallback.get(KEY) ?? null;
  }
  if (!raw) return emptyData();
  try {
    const p = JSON.parse(raw) as Partial<AppData>;
    return {
      style: p.style === 'simple' ? 'simple' : 'full',
      bought: Array.isArray(p.bought) ? p.bought.filter((x) => typeof x === 'string') : [],
    };
  } catch {
    // 값이 깨져도 앱은 열려야 합니다.
    return emptyData();
  }
}

export async function saveData(data: AppData): Promise<void> {
  const raw = JSON.stringify(data);
  try {
    await Storage.setItem(KEY, raw);
  } catch {
    fallback.set(KEY, raw);
  }
}
