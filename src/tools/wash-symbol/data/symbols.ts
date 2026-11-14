/**
 * 세탁 취급 표시 기호.
 *
 * 국제표준화기구(ISO) 기준을 따릅니다. 도형이 다섯 가지로 정해져 있어서
 * 도형만 알면 절반은 읽힙니다.
 *
 *   대야 모양 = 물세탁
 *   삼각형   = 표백
 *   사각형   = 건조
 *   다리미   = 다림질
 *   원       = 드라이클리닝
 *
 * 여기에 X가 그어지면 금지, 아래 줄이 늘어나면 더 약하게 다루라는 뜻입니다.
 * 이 규칙만 알아도 처음 보는 기호를 짐작할 수 있습니다.
 */

export type Group = 'wash' | 'bleach' | 'dry' | 'iron' | 'clean';
export type Base = 'tub' | 'triangle' | 'square' | 'iron' | 'circle';
export type Inner =
  | { kind: 'none' }
  | { kind: 'text'; text: string }
  | { kind: 'hand' }
  | { kind: 'circle' }
  | { kind: 'dots'; count: 1 | 2 | 3 }
  | { kind: 'vline' }
  | { kind: 'hline' }
  | { kind: 'diag' };

export interface Symbol {
  id: string;
  group: Group;
  base: Base;
  inner: Inner;
  /** 도형 아래 가로줄 개수. 많을수록 약하게 다루라는 뜻입니다. */
  bars: 0 | 1 | 2;
  /** X가 그어졌는지 */
  crossed: boolean;
  name: string;
  meaning: string;
  /** 실수하기 쉬운 것 */
  note?: string;
}

export const GROUPS: { id: Group; label: string; hint: string }[] = [
  { id: 'wash', label: '물세탁', hint: '대야 모양' },
  { id: 'bleach', label: '표백', hint: '삼각형' },
  { id: 'dry', label: '건조', hint: '사각형' },
  { id: 'iron', label: '다림질', hint: '다리미 모양' },
  { id: 'clean', label: '드라이', hint: '동그라미' },
];

export const SYMBOLS: Symbol[] = [
  // ---------- 물세탁 ----------
  {
    id: 'wash30', group: 'wash', base: 'tub', inner: { kind: 'text', text: '30' },
    bars: 0, crossed: false,
    name: '30도 물세탁',
    meaning: '30도 이하의 물로 세탁기에 돌려도 됩니다.',
  },
  {
    id: 'wash40', group: 'wash', base: 'tub', inner: { kind: 'text', text: '40' },
    bars: 0, crossed: false,
    name: '40도 물세탁',
    meaning: '40도 이하의 물로 세탁기에 돌려도 됩니다.',
  },
  {
    id: 'wash40bar', group: 'wash', base: 'tub', inner: { kind: 'text', text: '40' },
    bars: 1, crossed: false,
    name: '40도, 약하게',
    meaning: '40도 이하에서 섬세 코스로 돌리세요.',
    note: '아래 줄 하나는 약하게라는 뜻입니다. 일반 코스로 돌리면 옷이 상합니다.',
  },
  {
    id: 'wash30bars', group: 'wash', base: 'tub', inner: { kind: 'text', text: '30' },
    bars: 2, crossed: false,
    name: '30도, 아주 약하게',
    meaning: '30도 이하에서 울 코스처럼 가장 약한 코스로 돌리세요.',
    note: '줄이 두 개면 사실상 손세탁에 가깝게 다루라는 뜻입니다.',
  },
  {
    id: 'washhand', group: 'wash', base: 'tub', inner: { kind: 'hand' },
    bars: 0, crossed: false,
    name: '손세탁만',
    meaning: '세탁기에 넣지 말고 손으로 빠세요. 보통 30도 이하 미지근한 물입니다.',
    note: '비틀어 짜지 마세요. 눌러서 물기를 빼야 합니다.',
  },
  {
    id: 'washno', group: 'wash', base: 'tub', inner: { kind: 'none' },
    bars: 0, crossed: true,
    name: '물세탁 금지',
    meaning: '물에 넣으면 안 됩니다. 드라이클리닝을 맡기세요.',
    note: '집에서 물티슈로 문지르는 것도 위험합니다.',
  },

  // ---------- 표백 ----------
  {
    id: 'bleachany', group: 'bleach', base: 'triangle', inner: { kind: 'none' },
    bars: 0, crossed: false,
    name: '표백 가능',
    meaning: '염소계와 산소계 모두 쓸 수 있습니다.',
  },
  {
    id: 'bleachoxy', group: 'bleach', base: 'triangle', inner: { kind: 'diag' },
    bars: 0, crossed: false,
    name: '산소계만',
    meaning: '산소계 표백제만 쓸 수 있습니다. 락스 같은 염소계는 안 됩니다.',
    note: '색깔 옷에 염소계를 쓰면 얼룩이 집니다.',
  },
  {
    id: 'bleachno', group: 'bleach', base: 'triangle', inner: { kind: 'none' },
    bars: 0, crossed: true,
    name: '표백 금지',
    meaning: '어떤 표백제도 쓰면 안 됩니다.',
    note: '표백 성분이 든 세제도 피하세요.',
  },

  // ---------- 건조 ----------
  {
    id: 'tumblelow', group: 'dry', base: 'square', inner: { kind: 'dots', count: 1 },
    bars: 0, crossed: false,
    name: '건조기 저온',
    meaning: '건조기를 써도 되지만 저온으로 돌리세요.',
  },
  {
    id: 'tumblemid', group: 'dry', base: 'square', inner: { kind: 'dots', count: 2 },
    bars: 0, crossed: false,
    name: '건조기 일반',
    meaning: '건조기를 일반 온도로 써도 됩니다.',
  },
  {
    id: 'tumbleno', group: 'dry', base: 'square', inner: { kind: 'circle' },
    bars: 0, crossed: true,
    name: '건조기 금지',
    meaning: '기계 건조를 하면 안 됩니다. 줄어들거나 변형됩니다.',
    note: '면과 울은 건조기에서 크게 줄어듭니다.',
  },
  {
    id: 'hangdry', group: 'dry', base: 'square', inner: { kind: 'vline' },
    bars: 0, crossed: false,
    name: '걸어서 말리기',
    meaning: '옷걸이에 걸어 자연 건조하세요.',
  },
  {
    id: 'flatdry', group: 'dry', base: 'square', inner: { kind: 'hline' },
    bars: 0, crossed: false,
    name: '뉘어서 말리기',
    meaning: '평평한 곳에 눕혀서 말리세요.',
    note: '니트나 스웨터를 걸어 말리면 어깨가 늘어납니다. 이 표시가 있으면 꼭 눕히세요.',
  },

  // ---------- 다림질 ----------
  {
    id: 'iron1', group: 'iron', base: 'iron', inner: { kind: 'dots', count: 1 },
    bars: 0, crossed: false,
    name: '저온 다림질',
    meaning: '110도 이하입니다. 폴리에스터 같은 합성섬유용입니다.',
  },
  {
    id: 'iron2', group: 'iron', base: 'iron', inner: { kind: 'dots', count: 2 },
    bars: 0, crossed: false,
    name: '중온 다림질',
    meaning: '150도 이하입니다. 울과 실크에 씁니다.',
  },
  {
    id: 'iron3', group: 'iron', base: 'iron', inner: { kind: 'dots', count: 3 },
    bars: 0, crossed: false,
    name: '고온 다림질',
    meaning: '200도 이하입니다. 면과 린넨에 씁니다.',
  },
  {
    id: 'ironno', group: 'iron', base: 'iron', inner: { kind: 'none' },
    bars: 0, crossed: true,
    name: '다림질 금지',
    meaning: '다리미를 대면 안 됩니다. 녹거나 자국이 남습니다.',
    note: '스팀으로 주름만 펴는 것도 위험할 수 있습니다.',
  },

  // ---------- 드라이클리닝 ----------
  {
    id: 'cleanP', group: 'clean', base: 'circle', inner: { kind: 'text', text: 'P' },
    bars: 0, crossed: false,
    name: '드라이클리닝 가능',
    meaning: '퍼클로로에틸렌 계열 용제로 드라이클리닝할 수 있습니다.',
    note: '세탁소에 맡기면 알아서 합니다. 원 안 글자는 용제 종류입니다.',
  },
  {
    id: 'cleanF', group: 'clean', base: 'circle', inner: { kind: 'text', text: 'F' },
    bars: 0, crossed: false,
    name: '석유계만',
    meaning: '석유계 용제로만 드라이클리닝할 수 있습니다.',
    note: '세탁소에 맡길 때 이 표시를 보여주세요.',
  },
  {
    id: 'cleanA', group: 'clean', base: 'circle', inner: { kind: 'text', text: 'A' },
    bars: 0, crossed: false,
    name: '모든 용제 가능',
    meaning: '어떤 용제로도 드라이클리닝할 수 있습니다. 미국과 유럽 표기입니다.',
  },
  {
    id: 'cleanno', group: 'clean', base: 'circle', inner: { kind: 'none' },
    bars: 0, crossed: true,
    name: '드라이클리닝 금지',
    meaning: '드라이클리닝을 하면 안 됩니다.',
    note: '물세탁도 금지인데 드라이도 금지면 전문 세탁을 문의하세요.',
  },
];

export function symbolsIn(group: Group): Symbol[] {
  return SYMBOLS.filter((s) => s.group === group);
}

export function symbolById(id: string): Symbol | undefined {
  return SYMBOLS.find((s) => s.id === id);
}

export interface Tip {
  id: string;
  title: string;
  body: string;
}

/** 기호를 몰라서 옷을 버리는 흔한 경우들 */
export const TIPS: Tip[] = [
  {
    id: 'shape',
    title: '도형만 알아도 절반은 읽힙니다',
    body:
      '대야 모양은 물세탁, 삼각형은 표백, 사각형은 건조, 다리미는 다림질, ' +
      '동그라미는 드라이클리닝입니다. 이 다섯 개만 외우면 나머지는 짐작이 됩니다.',
  },
  {
    id: 'cross',
    title: 'X가 그어지면 무조건 금지',
    body:
      '어떤 도형이든 X가 그어져 있으면 하지 말라는 뜻입니다. ' +
      '기호를 몰라도 X만 보이면 일단 멈추세요.',
  },
  {
    id: 'bars',
    title: '아래 줄은 약하게 하라는 뜻',
    body:
      '도형 아래 가로줄이 하나면 약하게, 둘이면 아주 약하게 다루라는 뜻입니다. ' +
      '줄이 있는데 일반 코스로 돌리면 옷이 상합니다.',
  },
  {
    id: 'knit',
    title: '니트를 걸어 말리면 늘어납니다',
    body:
      '사각형 안에 가로줄이 있으면 눕혀서 말리라는 뜻입니다. ' +
      '이걸 무시하고 옷걸이에 걸면 젖은 무게 때문에 어깨가 늘어나 못 입게 됩니다.',
  },
  {
    id: 'oversea',
    title: '해외 옷은 표기가 다릅니다',
    body:
      '한국과 일본은 대야에 세탁기 모양이 있는지로 기계세탁과 손세탁을 나눕니다. ' +
      '미국과 유럽은 대야 안에 손 모양이 있으면 손세탁입니다. 직구한 옷은 한 번 더 보세요.',
  },
  {
    id: 'bleachcolor',
    title: '색깔 옷에 염소계 표백은 위험',
    body:
      '삼각형 안에 사선 두 줄이 있으면 산소계 표백제만 쓰라는 뜻입니다. ' +
      '락스 같은 염소계를 쓰면 색이 빠지고 얼룩이 집니다.',
  },
];
