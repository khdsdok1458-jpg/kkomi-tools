/**
 * 고기 굽기 기준.
 *
 * 먼저 짚어야 할 게 있습니다. 전문가들은 공통으로 "몇 분"보다
 * 고기 상태를 보라고 합니다. 불 세기와 팬 종류에 따라 크게 달라지니까요.
 *
 * 그래서 이 앱은 시간을 절대 기준으로 내세우지 않습니다.
 * 뒤집을 때를 놓치지 않게 알려주는 도구로 씁니다.
 *
 * 뒤집는 간격을 30초로 잡은 근거는 이렇습니다. 한 번만 뒤집어야 육즙이
 * 안 빠진다는 건 사실이 아닙니다. 자주 뒤집어도 육즙은 계속 빠지고,
 * 오히려 골고루 익습니다. 승우아빠 채널도 30초 간격을 권합니다.
 */

export interface Cut {
  id: string;
  name: string;
  hint: string;
  /** 두께별 총 굽는 시간 (초) */
  seconds: { thin: number; thick: number };
  /** 다 굽고 쉬게 두는 시간 (초). 0이면 바로 먹습니다. */
  rest: number;
  /** 이 부위에서 특히 주의할 것 */
  tip: string;
}

export type Thickness = 'thin' | 'thick';

export const THICKNESS: { id: Thickness; label: string; sub: string }[] = [
  { id: 'thin', label: '얇게', sub: '1cm 아래. 대패나 일반 마트 두께' },
  { id: 'thick', label: '두껍게', sub: '1.5cm 이상. 두툼한 통삼겹' },
];

export const CUTS: Cut[] = [
  {
    id: 'samgyeop',
    name: '삼겹살',
    hint: '기름이 많아 자기 기름에 튀기듯 구워집니다',
    seconds: { thin: 240, thick: 420 },
    rest: 0,
    tip: '기름이 고이면 한 번 덜어내세요. 너무 고이면 튀김이 됩니다. 다 익으면 바로 드셔도 됩니다.',
  },
  {
    id: 'moksal',
    name: '목살',
    hint: '삼겹살보다 기름이 적어 불 조절이 중요합니다',
    seconds: { thin: 270, thick: 480 },
    rest: 120,
    tip: '지방이 적어서 센 불에 오래 두면 퍽퍽해집니다. 중강불을 유지하세요.',
  },
  {
    id: 'hangjeong',
    name: '항정살',
    hint: '지방과 근육이 층을 이뤄 식감이 중요합니다',
    seconds: { thin: 210, thick: 330 },
    rest: 90,
    tip: '센 불에 오래 두면 겉만 타고 속이 질겨집니다. 중강불에서 짧게 구우세요.',
  },
  {
    id: 'galmaegi',
    name: '갈매기살',
    hint: '기름이 적고 얇아 금방 익습니다',
    seconds: { thin: 180, thick: 300 },
    rest: 60,
    tip: '얇아서 순식간에 탑니다. 눈을 떼지 마세요.',
  },
  {
    id: 'deungsim',
    name: '소 등심',
    hint: '겉을 먼저 지지고 속은 원하는 만큼',
    seconds: { thin: 180, thick: 300 },
    rest: 180,
    tip: '구운 뒤 반드시 쉬게 두세요. 바로 자르면 육즙이 다 흘러나옵니다.',
  },
  {
    id: 'chicken',
    name: '닭다리살',
    hint: '속까지 완전히 익혀야 합니다',
    seconds: { thin: 420, thick: 600 },
    rest: 60,
    tip: '닭은 덜 익으면 위험합니다. 가장 두꺼운 곳을 갈라서 속이 흰지 꼭 확인하세요.',
  },
];

/** 뒤집는 간격 (초) */
export const FLIP_EVERY = 30;

export function cutById(id: string): Cut | undefined {
  return CUTS.find((c) => c.id === id);
}

export function totalSeconds(cut: Cut, t: Thickness): number {
  return cut.seconds[t];
}

/** 몇 번 뒤집게 되는지 */
export function flipCount(cut: Cut, t: Thickness): number {
  return Math.max(Math.floor(totalSeconds(cut, t) / FLIP_EVERY) - 1, 0);
}

/** 남은 초를 분:초로 */
export function clock(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

/** 다음 뒤집기까지 남은 초 */
export function untilFlip(elapsed: number): number {
  return FLIP_EVERY - (elapsed % FLIP_EVERY);
}

export interface Myth {
  id: string;
  title: string;
  body: string;
}

/** 널리 퍼졌지만 사실이 아닌 것들 */
export const MYTHS: Myth[] = [
  {
    id: 'once',
    title: '한 번만 뒤집어야 육즙이 안 빠진다',
    body:
      '사실이 아닙니다. 고기는 구우면 육즙이 계속 빠집니다. 뒤집는 횟수와는 상관이 없어요. ' +
      '오히려 자주 뒤집으면 양쪽이 골고루 익어서 겉만 타는 일이 줄어듭니다. ' +
      '이 앱이 30초마다 알려주는 이유입니다.',
  },
  {
    id: 'sear',
    title: '센 불로 겉을 지지면 육즙이 갇힌다',
    body:
      '이것도 사실이 아닙니다. 겉을 지지는 건 마이야르 반응으로 풍미를 내기 위한 것이지 ' +
      '육즙을 가두는 게 아닙니다. 오래 믿어온 얘기지만 근거가 없습니다.',
  },
  {
    id: 'preheat',
    title: '팬은 충분히 예열해야 합니다',
    body:
      '이건 사실입니다. 마이야르 반응은 177도부터 시작하고, 불판 온도는 200도에서 220도 정도가 적당합니다. ' +
      '차가운 팬에 올리면 고기가 눌어붙고 물이 생깁니다.',
  },
  {
    id: 'room',
    title: '실온에 잠깐 두면 좋습니다',
    body:
      '냉장고에서 막 꺼낸 고기는 속이 차가워서 겉만 익기 쉽습니다. ' +
      '굽기 전에 잠깐 실온에 두면 속까지 고르게 익습니다.',
  },
  {
    id: 'rest',
    title: '두꺼운 고기는 쉬게 둬야 합니다',
    body:
      '특히 소고기는 굽자마자 자르면 육즙이 도마로 다 흘러나옵니다. ' +
      '불에서 내린 뒤 잠깐 두면 육즙이 고기 안으로 돌아갑니다. 이 앱이 마지막에 알려드려요.',
  },
  {
    id: 'time',
    title: '시간보다 상태가 먼저입니다',
    body:
      '불 세기와 팬 종류에 따라 굽는 시간은 크게 달라집니다. ' +
      '이 앱의 시간은 기준일 뿐이고, 눈으로 보고 판단하세요. ' +
      '타이머는 뒤집을 때를 놓치지 않게 도와주는 역할입니다.',
  },
];
