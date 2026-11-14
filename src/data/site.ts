export const SITE_NAME = '꼬미 생활도구';
export const SITE_DESC =
  '세탁 기호, 상온 음식, 택배 박스, 환불 가능 여부처럼 생활하다 막히는 것들을 바로 확인하는 무료 도구 모음입니다.';

export interface ToolMeta {
  slug: string;
  name: string;
  title: string;
  description: string;
  summary: string;
}

export const TOOLS: ToolMeta[] = [
  {
    slug: 'refund-check',
    name: '환불 될까',
    title: '온라인 쇼핑 환불 가능 여부 확인, 청약철회 7일 판정',
    description:
      '단순 변심, 주문제작, 개봉한 상품도 환불이 되는지 몇 가지 질문으로 판정합니다. 전자상거래법 제17조 기준.',
    summary: '질문 몇 개로 환불 가능 여부를 판정합니다.',
  },
  {
    slug: 'shoe-size',
    name: '신발 사이즈 변환',
    title: '신발 사이즈 변환표, 한국 mm를 미국 US, 영국 UK, 유럽 EU로',
    description:
      '평소 신는 한국 신발 사이즈(mm)를 고르면 미국 남성, 미국 여성, 영국, 유럽 사이즈로 바꿔줍니다. 해외직구 전에 220mm부터 300mm까지 변환표로 확인하세요.',
    summary: '한국 mm 사이즈를 US, UK, EU로 바꿉니다.',
  },
  {
    slug: 'clothing-size',
    name: '옷 사이즈 변환',
    title: '옷 사이즈 변환표, 한국 55 66 95 100을 미국, 유럽 사이즈로',
    description:
      '여성 44, 55, 66과 남성 90, 95, 100 같은 한국 옷 사이즈를 미국, 유럽, 영국, 국제 표기로 바꿔줍니다. 해외직구 전에 확인하세요.',
    summary: '한국 옷 사이즈를 미국, 유럽 표기로 바꿉니다.',
  },
  {
    slug: 'ring-size',
    name: '반지 호수 변환',
    title: '반지 호수표, 손가락 둘레로 반지 사이즈 찾기 (한국 호수, 미국 US, 유럽 EU)',
    description:
      '손가락 둘레나 반지 안지름을 넣으면 한국 반지 호수와 미국 US, 유럽 EU 사이즈를 바로 알려줍니다. 1호부터 30호까지 호수표와 재는 법을 정리했습니다.',
    summary: '손가락 둘레로 한국 호수와 해외 사이즈를 찾습니다.',
  },
  {
    slug: 'parcel-box-size',
    name: '택배 박스 사이즈 계산기',
    title: '택배 박스 사이즈 계산기, 물건 크기로 우체국 박스 호수 찾기',
    description:
      '물건의 가로, 세로, 높이를 넣으면 들어가는 우체국 박스 호수와 택배 크기 구간을 알려줍니다. 돌려 넣는 방향까지 계산합니다.',
    summary: '물건 크기로 맞는 박스 호수를 찾습니다.',
  },
  {
    slug: 'laundry-symbols',
    name: '세탁 기호 찾기',
    title: '세탁 기호 뜻 총정리, 옷 라벨 세탁 표시 그림으로 찾기',
    description:
      '옷 라벨의 세탁 기호를 그림으로 찾아 뜻을 바로 확인하세요. 물세탁, 표백, 건조, 다림질, 드라이클리닝 기호를 한눈에 정리했습니다.',
    summary: '옷 라벨 기호를 그림으로 찾아 뜻을 확인합니다.',
  },
  {
    slug: 'food-room-temp',
    name: '상온 음식 먹어도 될까',
    title: '상온에 둔 음식 먹어도 될까? 실온 방치 시간 판정',
    description:
      '치킨, 밥, 국처럼 실온에 둔 음식을 먹어도 되는지 음식 종류, 방 온도, 지난 시간으로 판정합니다. 식약처 권고 기준.',
    summary: '실온에 둔 음식을 먹어도 되는지 판정합니다.',
  },
  {
    slug: 'charye-table',
    name: '차례상 차리기',
    title: '차례상 차리는 법, 차례상 배치도와 장보기 체크리스트',
    description:
      '차례상 음식 위치를 줄별 배치도로 보여주고, 왜 그 자리에 놓는지와 장보기 체크리스트까지 정리했습니다. 간소화 상차림도 지원합니다.',
    summary: '차례상 배치도와 장보기 목록을 봅니다.',
  },
  {
    slug: 'meat-grill-timer',
    name: '고기 굽기 타이머',
    title: '고기 굽는 시간 타이머, 부위별 뒤집는 타이밍 알림',
    description:
      '삼겹살, 목살, 소고기 부위별 굽는 시간과 뒤집는 타이밍을 알려주는 타이머입니다. 두께별 시간과 레스팅까지 안내합니다.',
    summary: '부위별 굽는 시간과 뒤집을 때를 알려줍니다.',
  },
  {
    slug: 'shift-calendar',
    name: '교대근무 달력',
    title: '교대근무 달력, 3교대 근무표 만들기와 오늘 근무 확인',
    description:
      '간호사 3교대, 주야비, 당비번 근무 패턴을 넣으면 달력이 자동으로 채워집니다. 오늘 근무와 다음 쉬는 날을 바로 확인하세요.',
    summary: '근무 패턴으로 달력을 채우고 오늘 근무를 봅니다.',
  }
];

export function toolBySlug(slug: string): ToolMeta {
  const t = TOOLS.find((x) => x.slug === slug);
  if (!t) throw new Error(`unknown tool ${slug}`);
  return t;
}

/** 문의 받을 이메일. 공개해도 되는 주소로 넣어야 합니다. */
export const CONTACT_EMAIL = '';
