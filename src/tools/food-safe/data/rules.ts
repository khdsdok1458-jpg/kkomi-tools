/**
 * 상온에 둔 음식이 먹어도 되는지 판정합니다.
 *
 * 근거는 식품의약품안전처와 세계보건기구 권고입니다.
 * 조리한 음식은 실온에서 최대 2시간, 폭염일 때는 1시간까지입니다.
 * 위험 온도 구간은 4도에서 60도 사이이고, 세균은 여기서 20분마다 두 배가 됩니다.
 * 식중독균은 32도에서 43도 사이에서 가장 활발합니다.
 *
 * 가장 중요한 건 시간을 세는 기준입니다. 상온 방치 시간은 조리가 끝난 순간부터
 * 셉니다. 배달에 40분 걸렸으면 받은 순간 이미 40분이 지난 겁니다.
 * 사람들이 받은 순간부터 세기 때문에 실제보다 안전하다고 착각합니다.
 *
 * 이 앱은 병원이나 전문가의 판단을 대신하지 않습니다.
 * 애매하면 버리는 쪽이 맞습니다.
 */

export interface Food {
  id: string;
  name: string;
  examples: string;
  /** 보통 실온에서 버틸 수 있는 시간 (시간 단위) */
  hours: number;
  /** 이 음식에 특히 해당하는 것 */
  note?: string;
}

export const FOODS: Food[] = [
  {
    id: 'raw',
    name: '날것',
    examples: '회, 초밥, 육회, 생굴',
    hours: 1,
    note: '날생선과 날고기는 가장 빨리 상합니다. 받는 즉시 먹는 게 원칙이에요.',
  },
  {
    id: 'gimbap',
    name: '김밥, 샌드위치',
    examples: '김밥, 샌드위치, 유부초밥',
    hours: 1.5,
    note:
      '손으로 많이 만지는 음식이라 황색포도상구균이 잘 생깁니다. ' +
      '이 균의 독소는 끓여도 안 없어져요.',
  },
  {
    id: 'soup',
    name: '국, 찌개',
    examples: '국, 찌개, 탕, 전골',
    hours: 2,
    note:
      '큰 냄비는 가운데가 천천히 식어서 위험 온도에 오래 머뭅니다. ' +
      '작은 그릇에 나눠 담아 빨리 식히세요.',
  },
  {
    id: 'rice',
    name: '밥, 면',
    examples: '밥, 볶음밥, 파스타, 국수',
    hours: 2,
    note:
      '밥에는 바실러스 세레우스가 잘 생깁니다. 이 독소도 가열로 안 없어져요.',
  },
  {
    id: 'meat',
    name: '고기, 수육',
    examples: '보쌈, 족발, 수육, 불고기',
    hours: 2,
  },
  {
    id: 'fried',
    name: '튀김, 피자',
    examples: '치킨, 돈가스, 피자, 탕수육',
    hours: 2,
    note:
      '기름지고 건조해서 비교적 오래 버티지만, 소스가 뿌려져 있으면 더 짧게 봐야 합니다.',
  },
  {
    id: 'cream',
    name: '크림, 유제품',
    examples: '생크림 케이크, 샐러드, 요거트',
    hours: 1.5,
    note: '유제품과 드레싱은 상온에서 빨리 상합니다.',
  },
  {
    id: 'pickle',
    name: '절임, 장류',
    examples: '김치, 장아찌, 잼, 젓갈',
    hours: 12,
    note:
      '소금이나 산이 많아서 상온에서도 잘 안 상합니다. 그래도 냉장이 낫습니다.',
  },
];

export interface Temp {
  id: 'hot' | 'normal' | 'cool';
  label: string;
  hint: string;
  /** 버틸 수 있는 시간에 곱하는 값 */
  factor: number;
}

export const TEMPS: Temp[] = [
  {
    id: 'hot',
    label: '더워요',
    hint: '한여름, 난방 센 방',
    factor: 0.5,
  },
  {
    id: 'normal',
    label: '보통이에요',
    hint: '실내 20도에서 28도쯤',
    factor: 1,
  },
  {
    id: 'cool',
    label: '서늘해요',
    hint: '겨울, 난방 안 한 방',
    factor: 1.5,
  },
];

export const ELAPSED: { hours: number; label: string }[] = [
  { hours: 0.5, label: '30분쯤' },
  { hours: 1, label: '1시간' },
  { hours: 2, label: '2시간' },
  { hours: 3, label: '3시간' },
  { hours: 5, label: '5시간' },
  { hours: 9, label: '하룻밤 넘게' },
];

export type Verdict = 'ok' | 'reheat' | 'toss';

export interface Result {
  verdict: Verdict;
  headline: string;
  reasons: string[];
  todo: string[];
  /** 이 조건에서 버틸 수 있는 시간 */
  limit: number;
}

function fmt(h: number): string {
  if (h < 1) return `${Math.round(h * 60)}분`;
  if (Number.isInteger(h)) return `${h}시간`;
  return `${Math.floor(h)}시간 ${Math.round((h % 1) * 60)}분`;
}

export function judge(
  food: Food | null,
  elapsed: number | null,
  temp: Temp | null
): Result | null {
  if (!food || elapsed === null || !temp) return null;

  const limit = food.hours * temp.factor;
  const reasons: string[] = [];
  const todo: string[] = [];

  if (elapsed > limit) {
    reasons.push(
      `${food.name}은 이 온도에서 ${fmt(limit)} 정도가 한계인데 그걸 넘겼습니다.`
    );
    reasons.push(
      '위험 온도 구간인 4도에서 60도 사이에서는 세균이 20분마다 두 배로 늘어납니다.'
    );
    reasons.push(
      '끓여도 소용없는 경우가 있습니다. 황색포도상구균이나 바실러스 세레우스가 만든 독소는 100도에서도 안 없어집니다.'
    );
    todo.push('아깝지만 버리세요. 배탈 한 번이 더 비쌉니다.');
    todo.push('멀쩡해 보여도 마찬가지입니다. 독소는 냄새도 맛도 없습니다.');
    if (food.note) todo.push(food.note);
    return {
      verdict: 'toss',
      headline: '버리세요',
      reasons,
      todo,
      limit,
    };
  }

  if (elapsed > limit / 2) {
    reasons.push(
      `${food.name}은 이 온도에서 ${fmt(limit)} 정도까지입니다. 아직 안에 있지만 여유가 많지는 않아요.`
    );
    reasons.push(
      '상온 방치 시간은 조리가 끝난 순간부터 셉니다. 배달 시간도 여기 들어갑니다.'
    );
    todo.push('속까지 뜨겁게 데워서 지금 드세요. 김이 펄펄 날 정도여야 합니다.');
    todo.push('바로 안 드실 거면 지금 냉장고에 넣으세요. 조금 따뜻해도 괜찮습니다.');
    if (food.note) todo.push(food.note);
    return {
      verdict: 'reheat',
      headline: '데워서 지금 드세요',
      reasons,
      todo,
      limit,
    };
  }

  reasons.push(
    `${food.name}은 이 온도에서 ${fmt(limit)} 정도까지 괜찮습니다. 아직 여유가 있어요.`
  );
  reasons.push(
    '다만 상온 방치 시간은 조리가 끝난 순간부터 셉니다. 배달 시간도 포함이에요.'
  );
  todo.push('지금 드셔도 됩니다.');
  todo.push('남길 거면 지금 냉장고에 넣으세요. 상온에서 식히지 마세요.');
  if (food.note) todo.push(food.note);
  return { verdict: 'ok', headline: '드셔도 됩니다', reasons, todo, limit };
}

export interface Fact {
  id: string;
  title: string;
  body: string;
}

/** 잘못 알고 있으면 탈이 나는 것들 */
export const FACTS: Fact[] = [
  {
    id: 'boil',
    title: '끓이면 괜찮다는 건 틀렸습니다',
    body:
      '세균은 죽지만 이미 만들어진 독소는 안 없어집니다. ' +
      '황색포도상구균과 바실러스 세레우스가 만든 독소는 100도에서도 파괴되지 않아요. ' +
      '퍼프린젠스균은 포자로 변해 끓는 물에서도 살아남습니다.',
  },
  {
    id: 'smell',
    title: '냄새로 판단하면 안 됩니다',
    body:
      '독소형 식중독은 음식이 멀쩡해 보여도 생깁니다. ' +
      '판단 기준은 "상해 보이는지"가 아니라 "얼마나 뒀는지"예요.',
  },
  {
    id: 'delivery',
    title: '배달 시간도 방치 시간입니다',
    body:
      '상온 방치 시간은 조리가 끝난 순간부터 셉니다. 배달에 40분 걸렸으면 ' +
      '받은 순간 이미 40분이 지난 거예요. 여름철 배달 가방 안은 실온보다 더 따뜻할 때도 있습니다.',
  },
  {
    id: 'cool',
    title: '식혀서 넣지 말고 빨리 넣으세요',
    body:
      '완전히 식혀야 냉장고에 넣을 수 있다고 알고 계신 분이 많은데, ' +
      '조금 따뜻해도 빨리 넣는 게 상온에 오래 두는 것보다 안전합니다. ' +
      '작은 그릇에 나눠 담으면 더 빨리 식습니다.',
  },
  {
    id: 'reheat',
    title: '데울 거면 속까지 뜨겁게',
    body:
      '70도에서 3분 이상, 김이 펄펄 날 정도로 데우세요. ' +
      '겉만 미지근하게 데우면 안쪽 세균이 살아남습니다. ' +
      '데운 뒤에는 바로 드시고, 다시 식혀 두지 마세요.',
  },
  {
    id: 'repeat',
    title: '데웠다 식혔다 반복하지 마세요',
    body:
      '한 번 데웠다 식힐 때마다 위험 온도 구간을 또 지나갑니다. ' +
      '국이나 찌개를 여러 번 나눠 드실 거면 먹을 만큼만 덜어서 데우세요.',
  },
  {
    id: 'fridge',
    title: '냉장고 온도도 확인하세요',
    body:
      '냉장은 5도 이하, 냉동은 영하 18도 이하여야 합니다. ' +
      '냉장 보관해도 2일에서 3일 안에는 드시는 게 좋습니다. ' +
      '문 쪽은 온도가 자주 바뀌니 금방 먹을 것만 두세요.',
  },
  {
    id: 'thaw',
    title: '상온 해동은 하지 마세요',
    body:
      '실온에 꺼내두면 겉이 위험 온도에 오래 머뭅니다. ' +
      '냉장실이나 찬물에서 녹이시고, 급하면 전자레인지를 쓰세요.',
  },
];
