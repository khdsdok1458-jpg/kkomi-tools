/**
 * 택배 박스 고르기.
 *
 * 흔한 계산기들이 세 변의 합만 보고 호수를 정하는데 그건 틀렸습니다.
 * 물건이 30 × 5 × 5면 세 변 합은 40이지만 1호 박스(22 × 19 × 9)에는
 * 안 들어갑니다. 가로가 30이니까요.
 *
 * 박스에 들어가려면 각 변이 따로 맞아야 합니다. 게다가 물건을 돌려 넣을 수
 * 있으니 여섯 가지 방향을 다 따져봐야 해요.
 *
 * 규격은 우체국 박스 기준입니다. 판매처에 따라 내경과 외경 표기가 달라
 * 1cm 안팎의 차이가 있을 수 있습니다.
 */

export interface Box {
  id: string;
  name: string;
  /** 가로, 세로, 높이 (cm) */
  dims: [number, number, number];
  /** 주로 뭘 담는지 */
  use: string;
}

export const BOXES: Box[] = [
  { id: '1', name: '1호', dims: [22, 19, 9], use: '액세서리, 화장품, 작은 소품' },
  { id: '2', name: '2호', dims: [27, 18, 15], use: '잡화, 작은 의류. 가장 많이 씁니다' },
  { id: '2-1', name: '2-1호', dims: [35, 25, 10], use: '얇고 넓은 것. 책, 액자, 셔츠' },
  { id: '3', name: '3호', dims: [34, 25, 21], use: '의류, 중형 잡화. 두 번째로 많이 씁니다' },
  { id: '4', name: '4호', dims: [41, 31, 28], use: '전자제품, 여러 개 묶어 보낼 때' },
  { id: '5', name: '5호', dims: [48, 38, 34], use: '부피 큰 물건, 이불' },
];

/** 접수 규격. 우체국 기준입니다. */
export const LIMIT = {
  /** 세 변 합이 이보다 작으면 접수가 안 됩니다. */
  minSum: 35,
  /** 세 변 합 상한 */
  maxSum: 160,
  /** 한 변 상한 */
  maxSide: 100,
  /** 무게 상한 (kg) */
  maxWeight: 30,
};

export interface Tier {
  id: string;
  name: string;
  /** 세 변 합 상한 */
  upTo: number;
}

/** 택배 요금은 세 변의 합으로 구간이 나뉩니다. */
export const TIERS: Tier[] = [
  { id: 'xs', name: '극소형', upTo: 60 },
  { id: 's', name: '소형', upTo: 80 },
  { id: 'm', name: '중형', upTo: 100 },
  { id: 'l', name: '대형', upTo: 120 },
  { id: 'xl', name: '특대형', upTo: 160 },
];

/** 물건을 돌려 넣는 여섯 가지 방향 */
function orientations(d: [number, number, number]): [number, number, number][] {
  const [a, b, c] = d;
  return [
    [a, b, c], [a, c, b], [b, a, c],
    [b, c, a], [c, a, b], [c, b, a],
  ];
}

/**
 * 물건이 박스에 들어가는지.
 * 완충재 여유를 각 변에 더해서 따집니다.
 */
export function fits(
  item: [number, number, number],
  box: Box,
  padding: number
): boolean {
  const need = item.map((v) => v + padding) as [number, number, number];
  return orientations(need).some(
    ([x, y, z]) =>
      x <= box.dims[0] && y <= box.dims[1] && z <= box.dims[2]
  );
}

export function sumOf(d: number[]): number {
  return d.reduce((a, b) => a + b, 0);
}

export function tierOf(sum: number): Tier | null {
  return TIERS.find((t) => sum <= t.upTo) ?? null;
}

export type Verdict = 'ok' | 'toosmall' | 'toobig' | 'none';

export interface Result {
  verdict: Verdict;
  /** 들어가는 가장 작은 박스 */
  box: Box | null;
  headline: string;
  /** 박스 기준 세 변 합 */
  boxSum: number;
  tier: Tier | null;
  reasons: string[];
  todo: string[];
}

/** 완충재 여유 선택지 */
export const PADS: { value: number; label: string; hint: string }[] = [
  { value: 0, label: '딱 맞게', hint: '단단한 물건' },
  { value: 4, label: '조금 여유', hint: '뽁뽁이 한 겹' },
  { value: 8, label: '넉넉하게', hint: '깨지는 물건' },
];

export function judge(
  item: [number, number, number] | null,
  padding: number
): Result | null {
  if (!item || item.some((v) => v <= 0)) return null;

  const itemSum = sumOf(item);
  const box = BOXES.find((b) => fits(item, b, padding)) ?? null;

  if (!box) {
    const longest = Math.max(...item);
    return {
      verdict: 'toobig',
      box: null,
      headline: '박스보다 큽니다',
      boxSum: 0,
      tier: null,
      reasons: [
        `가장 긴 변이 ${longest}cm인데 5호 박스(48 × 38 × 34)에도 안 들어갑니다.`,
        padding > 0
          ? `완충재 여유 ${padding}cm를 뺀 크기로도 다시 계산해봤어요.`
          : '완충재 없이 딱 맞게 넣어도 안 들어갑니다.',
      ],
      todo: [
        '더 큰 박스를 따로 구하시거나, 나눠서 보내세요.',
        `한 변이 ${LIMIT.maxSide}cm를 넘거나 세 변 합이 ${LIMIT.maxSum}cm를 넘으면 일반 택배로는 못 보냅니다.`,
        '가구나 가전이라면 화물이나 용달을 알아보세요.',
      ],
    };
  }

  const boxSum = sumOf(box.dims);
  const tier = tierOf(boxSum);

  // 너무 작아도 접수가 안 됩니다. 이걸 모르는 사람이 많습니다.
  if (boxSum < LIMIT.minSum) {
    return {
      verdict: 'toosmall',
      box,
      headline: '박스가 너무 작습니다',
      boxSum,
      tier,
      reasons: [
        `${box.name}는 세 변 합이 ${boxSum}cm인데, 택배는 ${LIMIT.minSum}cm 이상이어야 접수됩니다.`,
        '너무 작으면 분류 기계에서 빠지거나 분실 위험이 있어서입니다.',
      ],
      todo: [
        '한 치수 큰 박스를 쓰세요. 요금은 같은 구간이라 차이가 없습니다.',
        '작은 물건이라면 우편이나 등기를 알아보는 것도 방법입니다.',
      ],
    };
  }

  const reasons = [
    `${box.name}는 ${box.dims.join(' × ')}cm입니다. 물건 ${item.join(' × ')}cm가 ${
      padding > 0 ? `완충재 ${padding}cm를 넣고도 ` : ''
    }들어갑니다.`,
    `세 변의 합이 ${boxSum}cm라 ${tier ? tier.name : '특대형'} 구간입니다. 택배 요금은 이 합으로 정해져요.`,
  ];

  const smaller = BOXES[BOXES.indexOf(box) - 1];
  if (smaller) {
    reasons.push(
      `${smaller.name}(${smaller.dims.join(' × ')}cm)에는 안 들어갑니다. 각 변을 따로 맞춰봐야 해서 세 변 합만으로는 알 수 없어요.`
    );
  }

  const slack = box.dims.map((v, i) => v - (item[i] + padding));
  const tight = Math.min(...slack);

  return {
    verdict: 'ok',
    box,
    headline: `${box.name}면 됩니다`,
    boxSum,
    tier,
    reasons,
    todo: [
      tight < 1
        ? '여유가 거의 없어요. 완충재를 더 넣으려면 한 치수 큰 걸로 가세요.'
        : '남는 공간에는 신문지나 뽁뽁이를 채워 흔들리지 않게 하세요.',
      `무게가 ${LIMIT.maxWeight}kg를 넘으면 접수가 안 됩니다.`,
      `물건 자체 세 변 합은 ${itemSum}cm입니다. 요금은 박스 기준으로 매겨져요.`,
    ],
  };
}

export interface Fact {
  id: string;
  title: string;
  body: string;
}

/** 몰라서 손해 보는 것들 */
export const FACTS: Fact[] = [
  {
    id: 'sum',
    title: '세 변 합만 보면 틀립니다',
    body:
      '흔한 계산기들이 세 변의 합으로만 호수를 정하는데 그러면 안 됩니다. ' +
      '30 × 5 × 5 물건은 세 변 합이 40밖에 안 되지만 1호 박스(22 × 19 × 9)에는 ' +
      '가로가 길어서 안 들어가요. 각 변을 따로 맞춰봐야 합니다.',
  },
  {
    id: 'min',
    title: '너무 작아도 접수가 안 됩니다',
    body:
      '세 변의 합이 35cm 미만이면 택배로 못 보냅니다. 분류 기계에서 빠지거나 ' +
      '분실될 수 있어서예요. 작은 물건은 오히려 한 치수 큰 박스에 넣어야 합니다.',
  },
  {
    id: 'fee',
    title: '요금은 무게가 아니라 부피로 정해집니다',
    body:
      '가벼워도 박스가 크면 요금이 올라갑니다. 무게가 아니라 부피로 값을 매기기 때문이에요. ' +
      '세 변의 합으로 극소형, 소형, 중형, 대형, 특대형 구간이 나뉘고, ' +
      '박스를 한 치수만 키워도 구간이 바뀔 수 있습니다.',
  },
  {
    id: 'max',
    title: '한 변이 100cm를 넘으면 못 보냅니다',
    body:
      '세 변의 합 160cm 이하, 한 변 100cm 이내, 무게 30kg 이하가 기준입니다. ' +
      '넘으면 접수가 거부되거나 화물로 넘어갑니다.',
  },
  {
    id: 'pad',
    title: '완충재 자리를 미리 빼두세요',
    body:
      '물건 크기에 딱 맞는 박스를 사면 뽁뽁이 넣을 자리가 없습니다. ' +
      '깨지는 물건이라면 각 변에 4cm 정도는 여유를 두는 게 안전해요.',
  },
  {
    id: 'wrong',
    title: '박스만 키운다고 안전해지지 않습니다',
    body:
      '너무 큰 박스에 작은 물건을 넣으면 안에서 굴러다녀 더 위험합니다. ' +
      '남는 공간은 반드시 신문지나 완충재로 채우세요.',
  },
  {
    id: 'size',
    title: '판매처마다 1cm 정도 차이가 납니다',
    body:
      '같은 호수라도 내경과 외경 표기가 다르고 골지 두께도 달라요. ' +
      '딱 맞게 계산됐다면 한 치수 큰 걸 고르는 게 안전합니다.',
  },
];

export function boxById(id: string): Box | undefined {
  return BOXES.find((b) => b.id === id);
}
