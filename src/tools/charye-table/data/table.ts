/**
 * 차례상 데이터.
 *
 * 자료마다 표현이 조금씩 다릅니다. 예를 들어 포와 식혜 자리를 어떤 곳은
 * 좌포우혜(포는 왼쪽, 식혜는 오른쪽)로, 어떤 곳은 서포동혜(포는 서쪽,
 * 식혜는 동쪽)로 씁니다. 상 앞에서 보면 왼쪽이 서쪽이라 같은 말입니다.
 *
 * 여기서는 화면에 보이는 대로 왼쪽을 서쪽, 오른쪽을 동쪽으로 놓습니다.
 */

export type Style = 'full' | 'simple';

export interface Dish {
  id: string;
  name: string;
  /** 1열이 신위와 가장 가까운 줄입니다. */
  row: number;
  /** 줄 안에서의 자리. 0이 서쪽 끝, 1이 동쪽 끝입니다. */
  pos: number;
  /** 왜 이 자리에 놓는지 */
  why: string;
  /** 관련된 사자성어 */
  rule?: string;
  /** 어떤 상차림에 들어가는지 */
  styles: Style[];
  /** 장 볼 때 목록에 넣을지 */
  buy?: boolean;
}

export const DISHES: Dish[] = [
  // 1열 신위와 가장 가까운 줄
  { id: 'me', name: '메(밥)', row: 1, pos: 0.2, rule: '반서갱동',
    why: '밥은 서쪽입니다. 상 앞에서 보면 왼쪽이에요.', styles: ['full', 'simple'] },
  { id: 'sijeop', name: '시접', row: 1, pos: 0.5,
    why: '수저를 담는 그릇입니다. 가운데에 놓아요.', styles: ['full', 'simple'] },
  { id: 'gaeng', name: '갱(국)', row: 1, pos: 0.8, rule: '반서갱동',
    why: '국은 동쪽입니다. 상 앞에서 보면 오른쪽이에요.', styles: ['full', 'simple'] },
  { id: 'songpyeon', name: '송편', row: 1, pos: 0.95,
    why: '추석에는 밥 대신 송편을 올리기도 합니다.', styles: ['full', 'simple'], buy: true },

  // 2열 고기와 생선
  { id: 'yukjeok', name: '육적(고기)', row: 2, pos: 0.15, rule: '어동육서',
    why: '고기는 서쪽입니다.', styles: ['full', 'simple'], buy: true },
  { id: 'sojeok', name: '소적(두부)', row: 2, pos: 0.4, rule: '적전중앙',
    why: '두부나 채소 적은 가운데에 놓아요.', styles: ['full'], buy: true },
  { id: 'jeon', name: '전', row: 2, pos: 0.6, rule: '적전중앙',
    why: '전은 가운데입니다.', styles: ['full', 'simple'], buy: true },
  { id: 'eojeok', name: '어적(생선)', row: 2, pos: 0.85, rule: '어동육서, 두동미서',
    why: '생선은 동쪽이고, 머리가 동쪽을 보게 놓습니다. 갈치나 꽁치처럼 치자로 끝나는 생선은 안 올려요.',
    styles: ['full', 'simple'], buy: true },

  // 3열 탕
  { id: 'yuktang', name: '육탕', row: 3, pos: 0.2,
    why: '고기 탕입니다. 요즘은 탕 줄을 아예 빼는 집도 많아요.', styles: ['full'], buy: true },
  { id: 'sotang', name: '소탕', row: 3, pos: 0.5,
    why: '두부나 채소 탕입니다.', styles: ['full'], buy: true },
  { id: 'eotang', name: '어탕', row: 3, pos: 0.8,
    why: '생선 탕입니다.', styles: ['full'], buy: true },

  // 4열 밑반찬
  { id: 'po', name: '포', row: 4, pos: 0.1, rule: '좌포우혜',
    why: '북어포나 명태포는 서쪽입니다. 왼쪽이에요.', styles: ['full', 'simple'], buy: true },
  { id: 'namul', name: '삼색나물', row: 4, pos: 0.35,
    why: '시금치, 도라지, 고사리를 씁니다. 포와 식혜 사이에 놓아요.',
    styles: ['full', 'simple'], buy: true },
  { id: 'kimchi', name: '김치', row: 4, pos: 0.6,
    why: '고춧가루를 쓰지 않은 흰 김치를 올립니다.', styles: ['full', 'simple'], buy: true },
  { id: 'sikhye', name: '식혜', row: 4, pos: 0.9, rule: '좌포우혜',
    why: '식혜는 동쪽입니다. 오른쪽이에요.', styles: ['full', 'simple'], buy: true },

  // 5열 과일과 한과
  { id: 'daechu', name: '대추', row: 5, pos: 0.08, rule: '조율이시',
    why: '서쪽부터 대추, 밤, 배, 감 순서입니다.', styles: ['full', 'simple'], buy: true },
  { id: 'bam', name: '밤', row: 5, pos: 0.26, rule: '조율이시',
    why: '대추 다음입니다.', styles: ['full', 'simple'], buy: true },
  { id: 'bae', name: '배', row: 5, pos: 0.44, rule: '조율이시',
    why: '밤 다음입니다.', styles: ['full', 'simple'], buy: true },
  { id: 'gam', name: '감(곶감)', row: 5, pos: 0.62, rule: '조율이시',
    why: '배 다음입니다.', styles: ['full', 'simple'], buy: true },
  { id: 'sagwa', name: '사과', row: 5, pos: 0.78, rule: '홍동백서',
    why: '붉은 과일이라 동쪽에 놓습니다.', styles: ['full', 'simple'], buy: true },
  { id: 'hangwa', name: '한과', row: 5, pos: 0.93,
    why: '과일 다음에 약과나 다식 같은 과자를 놓아요.', styles: ['full'], buy: true },
];

export interface Tip {
  id: string;
  title: string;
  body: string;
}

/**
 * 상 앞에 서면 진짜로 막히는 것들입니다.
 * 검색하면 사자성어만 줄줄이 나오는데, 정작 이걸 안 알려줍니다.
 */
export const TIPS: Tip[] = [
  {
    id: 'direction',
    title: '동쪽이 어디예요?',
    body:
      '나침반 방향이 아니에요. 사진이나 지방을 모신 쪽을 북쪽으로 칩니다. ' +
      '상 앞에 서서 신위를 바라볼 때 오른손 쪽이 동쪽, 왼손 쪽이 서쪽이에요. ' +
      '아파트 거실에서 상을 어느 방향으로 놓았든 상관없습니다. ' +
      '이 기준 하나만 잡으면 어동육서도 좌포우혜도 안 헷갈려요.',
  },
  {
    id: 'conflict',
    title: '홍동백서랑 조율이시가 서로 안 맞아요',
    body:
      '맞아요. 두 규칙은 부딪힙니다. 조율이시대로면 대추가 맨 서쪽 끝인데, ' +
      '홍동백서대로면 붉은 대추는 동쪽에 가야 하죠. ' +
      '어느 쪽을 따를지는 집안마다 다릅니다. 이 앱은 조율이시를 기준으로 놓고 ' +
      '사과 같은 나머지 과일에 홍동백서를 적용했어요. 집안 방식이 있으면 그쪽을 따르세요.',
  },
  {
    id: 'avoid',
    title: '안 올리는 것',
    body:
      '갈치, 꽁치, 삼치처럼 치자로 끝나는 생선은 안 올려요. 대신 조기나 북어처럼 ' +
      '기자나 어자로 끝나는 걸 씁니다. 복숭아도 안 올립니다. ' +
      '고춧가루와 마늘 양념은 쓰지 않고, 붉은 팥 대신 흰 고물을 씁니다.',
  },
  {
    id: 'simple',
    title: '이걸 다 해야 하나요?',
    body:
      '아니요. 요즘은 탕 줄을 아예 빼고 네 줄로 차리는 집이 흔합니다. ' +
      '지역과 집안, 종교에 따라 크게 다르고 간소화하거나 생략하기도 해요. ' +
      '위에서 간소하게를 고르면 줄어든 상차림을 볼 수 있어요.',
  },
  {
    id: 'fish',
    title: '생선 머리는 어느 쪽으로?',
    body:
      '두동미서라고 해서 머리가 동쪽, 꼬리가 서쪽을 향하게 놓습니다. ' +
      '닭구이나 생선포는 등이 위로 오게 놓아요. 이걸 배복방향이라고 합니다.',
  },
];

export const ROW_LABEL: Record<number, string> = {
  1: '1열 · 밥과 국',
  2: '2열 · 고기와 생선',
  3: '3열 · 탕',
  4: '4열 · 밑반찬',
  5: '5열 · 과일과 한과',
};

export function dishesFor(style: Style): Dish[] {
  return DISHES.filter((d) => d.styles.includes(style));
}

export function rowsFor(style: Style): number[] {
  const rows = new Set(dishesFor(style).map((d) => d.row));
  return [...rows].sort((a, b) => a - b);
}
