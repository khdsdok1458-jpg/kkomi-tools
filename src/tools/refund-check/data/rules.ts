/**
 * 환불 판정.
 *
 * 근거는 전자상거래 등에서의 소비자보호에 관한 법률입니다.
 *
 * 제17조 제1항: 물건 받은 날부터 7일 이내에는 단순 변심으로도 청약철회가 됩니다.
 * 제17조 제2항: 예외가 다섯 가지 있습니다. 훼손, 사용으로 인한 가치 감소,
 *   시간 경과로 재판매 곤란, 복제 가능한 재화의 포장 훼손, 주문제작.
 * 제17조 제3항: 표시광고와 다르거나 계약과 다르게 이행된 경우에는
 *   공급받은 날부터 3개월, 안 날부터 30일 이내입니다.
 * 제17조 제6항: 판매자가 철회 불가 사실을 명확히 표시하거나 시험 사용 상품을
 *   제공하지 않으면, 2호부터 5호까지의 예외를 주장할 수 없습니다.
 *
 * 마지막 조항이 핵심입니다. 주문제작이든 디지털이든 고지가 없었으면 됩니다.
 */

export type Where = 'online' | 'c2c' | 'offline';
export type Reason = 'change' | 'different' | 'defect';
export type Kind = 'normal' | 'custom' | 'fresh' | 'digital' | 'sealed';
export type State = 'unopened' | 'checked' | 'used';
export type Notice = 'yes' | 'no' | 'unknown';

export interface Answers {
  where?: Where;
  reason?: Reason;
  within7?: boolean;
  kind?: Kind;
  state?: State;
  notice?: Notice;
}

export type Verdict = 'yes' | 'maybe' | 'hard' | 'outside';

export interface Result {
  verdict: Verdict;
  /** 화면 맨 위에 크게 뜨는 한 줄 */
  headline: string;
  /** 왜 그런지 */
  reasons: string[];
  /** 그래서 뭘 하면 되는지 */
  todo: string[];
}

export interface Question {
  id: keyof Answers;
  title: string;
  hint?: string;
  options: { value: string; label: string; sub?: string }[];
}

const Q_WHERE: Question = {
  id: 'where',
  title: '어디서 사셨어요?',
  options: [
    { value: 'online', label: '온라인 쇼핑몰', sub: '쿠팡, 네이버, 자사몰 등' },
    { value: 'c2c', label: '개인 간 중고거래', sub: '당근, 번개장터 등' },
    { value: 'offline', label: '오프라인 매장' },
  ],
};

const Q_REASON: Question = {
  id: 'reason',
  title: '왜 반품하시려고요?',
  options: [
    { value: 'change', label: '그냥 마음이 바뀌어서' },
    { value: 'different', label: '설명이랑 달라서' },
    { value: 'defect', label: '불량이거나 망가져서' },
  ],
};

const Q_WITHIN: Question = {
  id: 'within7',
  title: '받은 지 얼마나 됐어요?',
  hint: '주문한 날이 아니라 물건을 받은 날부터 셉니다.',
  options: [
    { value: 'true', label: '7일 안 지났어요' },
    { value: 'false', label: '7일 넘었어요' },
  ],
};

const Q_KIND: Question = {
  id: 'kind',
  title: '어떤 물건이에요?',
  options: [
    { value: 'normal', label: '일반 상품', sub: '옷, 전자제품, 생활용품 등' },
    { value: 'custom', label: '주문제작', sub: '각인, 맞춤 사이즈 등' },
    { value: 'fresh', label: '신선식품', sub: '금방 상하는 것' },
    { value: 'digital', label: '디지털 콘텐츠', sub: '이북, 강의, 음원' },
    { value: 'sealed', label: '밀봉된 복제 가능 상품', sub: 'CD, 소프트웨어' },
  ],
};

const Q_STATE: Question = {
  id: 'state',
  title: '지금 상태가 어때요?',
  options: [
    { value: 'unopened', label: '아예 안 뜯었어요' },
    { value: 'checked', label: '확인하려고 열어만 봤어요' },
    { value: 'used', label: '써봤어요', sub: '입거나 먹거나 사용함' },
  ],
};

const Q_NOTICE: Question = {
  id: 'notice',
  title: '반품이 안 된다고 미리 알려줬나요?',
  hint: '상품 페이지나 포장에 명확히 적혀 있었는지 떠올려보세요.',
  options: [
    { value: 'yes', label: '적혀 있었어요' },
    { value: 'no', label: '못 봤어요' },
    { value: 'unknown', label: '기억이 안 나요' },
  ],
};

/** 지금까지의 답에 따라 다음에 물어볼 것을 정합니다. */
export function nextQuestion(a: Answers): Question | null {
  if (!a.where) return Q_WHERE;
  // 전자상거래법이 적용되는 건 통신판매뿐입니다.
  if (a.where !== 'online') return null;
  if (!a.reason) return Q_REASON;
  // 설명과 다르거나 불량이면 3개월까지 되니 7일을 물을 필요가 없습니다.
  if (a.reason !== 'change') return null;
  if (a.within7 === undefined) return Q_WITHIN;
  if (!a.within7) return null;
  if (!a.kind) return Q_KIND;
  if (!a.state) return Q_STATE;
  // 예외 품목이면 고지 여부가 결과를 뒤집습니다.
  if (a.kind !== 'normal' && a.state !== 'used' && !a.notice) return Q_NOTICE;
  return null;
}

const KIND_LABEL: Record<Kind, string> = {
  normal: '일반 상품',
  custom: '주문제작 상품',
  fresh: '신선식품',
  digital: '디지털 콘텐츠',
  sealed: '밀봉 상품',
};

export function judge(a: Answers): Result | null {
  if (nextQuestion(a)) return null;

  if (a.where === 'c2c') {
    return {
      verdict: 'outside',
      headline: '법으로 보장되지는 않아요',
      reasons: [
        '개인 간 중고거래는 전자상거래법이 적용되지 않습니다. 사업자가 아니라서요.',
        '7일 이내 단순 변심 반품은 법적 권리가 아니라 상대방과의 합의 문제입니다.',
      ],
      todo: [
        '상대에게 사정을 설명하고 합의해보세요.',
        '물건이 설명과 완전히 달랐다면 사기로 볼 여지가 있습니다. 거래 화면과 대화를 저장해두세요.',
        '플랫폼에 신고 기능이 있으면 그쪽으로 접수하세요.',
      ],
    };
  }

  if (a.where === 'offline') {
    return {
      verdict: 'outside',
      headline: '매장 정책에 달렸어요',
      reasons: [
        '직접 보고 산 오프라인 구매는 청약철회 대상이 아닙니다.',
        '많은 매장이 영수증을 가져오면 교환이나 환불을 해주지만, 그건 법이 아니라 매장 방침입니다.',
      ],
      todo: [
        '영수증을 챙겨서 매장에 문의하세요.',
        '물건에 하자가 있다면 얘기가 다릅니다. 제조사나 판매처에 수리나 교환을 요구할 수 있습니다.',
      ],
    };
  }

  if (a.reason !== 'change') {
    const what = a.reason === 'different' ? '설명과 다른' : '하자가 있는';
    return {
      verdict: 'yes',
      headline: '됩니다. 기간도 훨씬 깁니다',
      reasons: [
        `${what} 물건은 7일이 아니라 받은 날부터 3개월, 그 사실을 안 날부터 30일 이내에 반품할 수 있습니다.`,
        '이 경우 반품 배송비는 판매자가 부담합니다. 단순 변심일 때만 소비자가 냅니다.',
      ],
      todo: [
        '상품 페이지와 실제 물건이 다른 점을 사진으로 남기세요.',
        '판매자에게 반품 의사를 문자나 채팅으로 남기세요. 기록이 남아야 합니다.',
        '거부당하면 국번없이 1372 소비자상담센터에 상담하세요.',
      ],
    };
  }

  if (!a.within7) {
    return {
      verdict: 'hard',
      headline: '단순 변심이면 어렵습니다',
      reasons: [
        '단순 변심 반품은 물건을 받은 날부터 7일 이내입니다.',
        '다만 판매자가 주소를 적지 않았거나 반품을 방해했다면 기간이 다시 시작됩니다.',
      ],
      todo: [
        '판매자가 자체적으로 더 긴 기간을 약속했는지 상품 페이지를 확인해보세요.',
        '물건이 설명과 달랐다면 3개월 기준이 적용됩니다. 처음부터 다시 따져보세요.',
      ],
    };
  }

  if (a.state === 'used') {
    return {
      verdict: 'hard',
      headline: '사용하셨으면 어렵습니다',
      reasons: [
        '사용하거나 일부 소비해서 가치가 크게 떨어진 경우는 청약철회 예외입니다.',
        '입어보거나 세탁했거나 먹어본 경우가 여기 해당합니다.',
      ],
      todo: [
        '다만 확인하려고 열어본 정도는 예외가 아닙니다. 사용 흔적이 없다면 다시 따져보세요.',
        '물건 자체에 하자가 있었다면 사용 여부와 상관없이 반품할 수 있습니다.',
      ],
    };
  }

  if (a.kind === 'normal') {
    return {
      verdict: 'yes',
      headline: '됩니다',
      reasons: [
        '받은 날부터 7일 이내라면 이유를 대지 않아도 반품할 수 있습니다. 법이 보장한 권리입니다.',
        a.state === 'checked'
          ? '내용을 확인하려고 포장을 뜯은 것은 반품을 막는 사유가 아닙니다.'
          : '미개봉이면 더 말할 것도 없습니다.',
        '단순 변심이라 반품 배송비는 소비자가 부담합니다.',
      ],
      todo: [
        '판매자에게 반품 의사를 문자나 채팅으로 남기세요.',
        '"단순변심 반품 불가" 같은 문구는 법보다 좁은 내용이라 효력이 없습니다.',
        '거부당하면 국번없이 1372 소비자상담센터에 상담하세요.',
      ],
    };
  }

  // 예외 품목. 고지 여부가 결과를 뒤집습니다.
  if (a.notice === 'no') {
    return {
      verdict: 'yes',
      headline: '고지가 없었다면 됩니다',
      reasons: [
        `${KIND_LABEL[a.kind!]}은 원래 반품이 제한될 수 있는 품목입니다.`,
        '그런데 판매자가 반품이 안 된다는 사실을 포장이나 상품 페이지에 명확히 표시하지 않았다면, 그 제한을 주장할 수 없습니다.',
        '법에 그렇게 정해져 있습니다. 표시하거나 시험 사용 상품을 제공하는 등의 조치를 해야 예외가 인정됩니다.',
      ],
      todo: [
        '주문했을 때 상품 페이지를 캡처해두세요. 지금이라도 남아 있으면 저장하세요.',
        '판매자에게 반품 불가 고지가 어디에 있었는지 물어보세요.',
        '거부당하면 국번없이 1372 소비자상담센터에 상담하세요.',
      ],
    };
  }

  if (a.notice === 'unknown') {
    return {
      verdict: 'maybe',
      headline: '따져볼 만합니다',
      reasons: [
        `${KIND_LABEL[a.kind!]}은 반품이 제한될 수 있는 품목입니다.`,
        '다만 판매자가 반품 불가를 명확히 고지하지 않았다면 제한을 주장할 수 없습니다. 이게 결과를 가릅니다.',
        a.kind === 'custom'
          ? '주문제작은 조건이 더 까다롭습니다. 개별 생산이고, 반품하면 판매자에게 회복할 수 없는 피해가 생기고, 미리 별도로 알리고 동의를 받았어야 합니다. 셋 중 하나라도 빠지면 반품됩니다.'
          : '상품 페이지에 안내가 있었는지 확인해보세요.',
      ],
      todo: [
        '주문 내역과 상품 페이지를 먼저 확인하세요.',
        '고지가 없었다면 반품을 요구할 수 있습니다.',
        '애매하면 국번없이 1372 소비자상담센터에 상담하세요. 무료입니다.',
      ],
    };
  }

  return {
    verdict: 'hard',
    headline: '고지가 있었다면 어렵습니다',
    reasons: [
      `${KIND_LABEL[a.kind!]}은 반품이 제한되는 품목이고, 판매자가 미리 알렸다면 예외가 인정됩니다.`,
      a.kind === 'custom'
        ? '다만 주문제작은 개별 생산이어야 하고, 반품 시 판매자에게 회복할 수 없는 피해가 생겨야 하며, 별도 고지와 동의가 있어야 합니다. 셋을 다 갖춰야 거부가 유효합니다.'
        : '다만 고지가 상품 페이지 구석에 작게 있었다면 명확한 표시로 보기 어려울 수 있습니다.',
    ],
    todo: [
      '고지가 정말 명확했는지 다시 보세요. "명확하게 표시"가 법의 요건입니다.',
      '물건에 하자가 있었다면 예외와 상관없이 반품됩니다.',
      '애매하면 국번없이 1372 소비자상담센터에 상담하세요.',
    ],
  };
}

export interface Fact {
  id: string;
  title: string;
  body: string;
}

/** 알아두면 손해 안 보는 것들. 전부 법에 근거가 있습니다. */
export const FACTS: Fact[] = [
  {
    id: 'void',
    title: '"단순변심 반품 불가"는 효력이 없습니다',
    body:
      '법이 정한 것보다 소비자 권리를 좁히는 문구는 그 범위에서 무효입니다. ' +
      '"수령 후 3일 이내만 가능"처럼 7일보다 짧게 정한 것도 마찬가지예요.',
  },
  {
    id: 'open',
    title: '확인하려고 뜯은 건 괜찮습니다',
    body:
      '"박스를 개봉하면 어떤 경우에도 환불되지 않습니다"라는 문구를 흔히 보지만, ' +
      '내용을 확인하기 위한 개봉은 반품을 막는 사유가 아닙니다. ' +
      '입어보거나 사용해서 가치가 떨어진 경우와는 다릅니다.',
  },
  {
    id: 'notice',
    title: '반품 불가는 미리 알려야 합니다',
    body:
      '주문제작, 신선식품, 디지털 콘텐츠처럼 반품이 제한되는 품목이라도 ' +
      '판매자가 그 사실을 포장이나 상품 페이지에 명확히 표시하지 않았다면 제한을 주장할 수 없습니다. ' +
      '이걸 아는 소비자가 드뭅니다.',
  },
  {
    id: 'custom',
    title: '주문제작이라고 다 안 되는 건 아닙니다',
    body:
      '세 가지를 다 갖춰야 반품 거부가 유효합니다. 소비자 주문에 따라 개별 생산했고, ' +
      '반품하면 판매자에게 회복할 수 없는 중대한 피해가 생기고, ' +
      '미리 별도로 알리고 동의를 받았어야 합니다. 하나라도 빠지면 반품됩니다.',
  },
  {
    id: 'different',
    title: '설명과 다르면 3개월입니다',
    body:
      '표시나 광고와 다르거나 계약과 다르게 이행된 경우에는 받은 날부터 3개월, ' +
      '그 사실을 안 날부터 30일 이내에 반품할 수 있습니다. 7일이 지났어도 가능해요.',
  },
  {
    id: 'ship',
    title: '반품 배송비는 이유에 따라 다릅니다',
    body:
      '단순 변심이면 소비자가 냅니다. 하지만 물건이 설명과 다르거나 하자가 있었다면 ' +
      '판매자가 부담합니다. 이 경우 배송비를 요구받았다면 거절할 수 있습니다.',
  },
  {
    id: 'help',
    title: '막히면 1372로 전화하세요',
    body:
      '국번없이 1372, 소비자상담센터입니다. 무료이고 전국 어디서나 연결됩니다. ' +
      '상담 후 필요하면 한국소비자원 피해구제나 분쟁조정으로 이어집니다.',
  },
];

export const QUESTION_COUNT = 6;

/** 몇 번째 질문까지 왔는지. 진행 막대에 씁니다. */
export function answeredCount(a: Answers): number {
  return Object.values(a).filter((v) => v !== undefined).length;
}
