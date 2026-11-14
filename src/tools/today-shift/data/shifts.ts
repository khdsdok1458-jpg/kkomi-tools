/** 근무 한 종류. 코드는 달력 칸에 찍히는 글자입니다. */
export interface Shift {
  /** 저장에 쓰는 고유값. 바뀌지 않습니다. */
  id: string;
  /** 달력에 보이는 짧은 글자 (한두 자) */
  code: string;
  /** 목록과 설정에 보이는 이름 */
  label: string;
  /** 화면에 쓰는 색 */
  color: string;
  /** 쉬는 날인지. 다음 쉬는 날까지 며칠 남았는지 셀 때 씁니다. */
  isOff: boolean;
  /** 출근 시각 (HH:MM). 없으면 표시하지 않습니다. */
  start?: string;
  /** 퇴근 시각 */
  end?: string;
}

export interface Preset {
  id: string;
  name: string;
  hint: string;
  shifts: Shift[];
}

/**
 * 직군마다 부르는 말이 다릅니다.
 *
 * 간호사는 데이, 이브닝, 나이트, 오프라고 하고 근무표를 수간호사가 짜서
 * 나눠줍니다. 그래서 본인이 패턴을 정하는 게 아니라 받은 표를 옮겨 적습니다.
 * 반면 생산직이나 소방은 정해진 주기로 돌기 때문에 패턴을 넣으면
 * 앞으로가 자동으로 채워집니다.
 *
 * 두 방식을 다 지원해야 합니다.
 */
export const PRESETS: Preset[] = [
  {
    id: 'nurse',
    name: '간호사 3교대',
    hint: '데이, 이브닝, 나이트, 오프',
    shifts: [
      { id: 'D', code: 'D', label: '데이', color: '#f5a524', isOff: false, start: '07:00', end: '15:00' },
      { id: 'E', code: 'E', label: '이브닝', color: '#e0644a', isOff: false, start: '15:00', end: '23:00' },
      { id: 'N', code: 'N', label: '나이트', color: '#4a5eda', isOff: false, start: '23:00', end: '07:00' },
      { id: 'O', code: 'O', label: '오프', color: '#98a0ad', isOff: true },
    ],
  },
  {
    id: 'three',
    name: '주간 야간 비번',
    hint: '생산직, 경비, 시설',
    shifts: [
      { id: 'A', code: '주', label: '주간', color: '#f5a524', isOff: false, start: '08:00', end: '20:00' },
      { id: 'B', code: '야', label: '야간', color: '#4a5eda', isOff: false, start: '20:00', end: '08:00' },
      { id: 'C', code: '비', label: '비번', color: '#5aa86b', isOff: true },
      { id: 'O', code: '휴', label: '휴무', color: '#98a0ad', isOff: true },
    ],
  },
  {
    id: 'fire',
    name: '당번 비번',
    hint: '소방, 당직',
    shifts: [
      { id: 'A', code: '당', label: '당번', color: '#e0644a', isOff: false, start: '09:00', end: '09:00' },
      { id: 'C', code: '비', label: '비번', color: '#5aa86b', isOff: true },
      { id: 'O', code: '휴', label: '휴무', color: '#98a0ad', isOff: true },
    ],
  },
];

export const DEFAULT_PRESET = PRESETS[0];

export function findShift(shifts: Shift[], id: string | undefined) {
  if (!id) return undefined;
  return shifts.find((s) => s.id === id);
}
