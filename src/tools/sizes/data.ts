/**
 * 사이즈 변환 기준.
 *
 * 반지: 국내 호수는 손가락 둘레(mm)에서 43을 뺀 값입니다(1호 = 44mm).
 *   미국 사이즈는 둘레 = 36.5 + 2.55 × US 로 계산합니다(US 6 = 51.8mm).
 *   유럽(EU, ISO 8653)은 안쪽 둘레 mm를 그대로 씁니다.
 * 신발: 국내 mm 기준 미국 남성 = (mm - 180) / 10, 여성은 남성보다 1.5 큽니다.
 *   영국은 미국 남성보다 0.5 작습니다. 유럽은 브랜드 편차가 커서 범위로 보여줍니다.
 * 옷: 나라별 표기는 브랜드마다 달라 범위로만 보여줍니다.
 */

export const RING_MIN = 1;
export const RING_MAX = 30;

export function ringFromCircumference(mm: number) {
  const kr = Math.round(mm - 43);
  const usRaw = (mm - 36.5) / 2.55;
  const us = Math.round(usRaw * 2) / 2;
  return { kr, us, eu: Math.round(mm), diameter: mm / Math.PI };
}

export function circumferenceFromKr(kr: number) {
  return kr + 43;
}

export function circumferenceFromUs(us: number) {
  return 36.5 + 2.55 * us;
}

export interface ShoeRow {
  kr: number;
  usM: number;
  usW: number;
  uk: number;
  eu: string;
}

const EU: Record<number, string> = {
  220: '35~35.5', 225: '35.5~36', 230: '36~36.5', 235: '37~37.5', 240: '38',
  245: '38.5~39', 250: '39~40', 255: '40~40.5', 260: '40.5~41', 265: '41.5~42',
  270: '42~42.5', 275: '43', 280: '43.5~44', 285: '44~44.5', 290: '45', 295: '45.5~46', 300: '46~46.5',
};

export function shoeRow(kr: number): ShoeRow {
  const usM = (kr - 180) / 10;
  return { kr, usM, usW: usM + 1.5, uk: usM - 0.5, eu: EU[kr] ?? '-' };
}

export const SHOE_SIZES = Object.keys(EU).map(Number);

export interface ClothRow {
  kr: string;
  intl: string;
  us: string;
  eu: string;
  uk?: string;
}

export const WOMEN: ClothRow[] = [
  { kr: '44 (85)', intl: 'XXS~XS', us: '00~0', eu: '32', uk: '4' },
  { kr: '55 (90)', intl: 'S', us: '2~4', eu: '34~36', uk: '6~8' },
  { kr: '66 (95)', intl: 'M', us: '6~8', eu: '38~40', uk: '10~12' },
  { kr: '77 (100)', intl: 'L', us: '10~12', eu: '42~44', uk: '14~16' },
  { kr: '88 (105)', intl: 'XL', us: '14~16', eu: '46', uk: '18~20' },
];

export const MEN: ClothRow[] = [
  { kr: '85', intl: 'XS', us: 'XS', eu: '44' },
  { kr: '90', intl: 'S', us: 'S', eu: '46' },
  { kr: '95', intl: 'M', us: 'S~M', eu: '48' },
  { kr: '100', intl: 'L', us: 'M~L', eu: '50' },
  { kr: '105', intl: 'XL', us: 'L~XL', eu: '52' },
  { kr: '110', intl: 'XXL', us: 'XL~XXL', eu: '54' },
];

export function fmt(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
