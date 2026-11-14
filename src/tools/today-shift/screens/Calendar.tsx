import { useState } from 'react';
import type { AppData } from '../lib/storage';
import {
  addMonths, dayOf, kstToday, monthGrid, monthLabel, monthOf, WEEKDAY_LABEL,
} from '../lib/calendar';
import { shiftOn } from '../lib/schedule';
import type { Route } from '../lib/navigation';
import AdBanner from '../components/AdBanner';

interface Props {
  data: AppData;
  onSet: (date: string, shiftId: string | null) => void;
  go: (route: Route) => void;
}

/**
 * 달력에서 바로 칠합니다.
 *
 * 간호사는 매달 받은 근무표를 옮겨 적어야 해서 30번을 눌러야 합니다.
 * 그래서 붓을 하나 골라두고 날짜를 연달아 누르는 방식으로 만들었습니다.
 * 날짜마다 종류를 고르게 하면 60번을 눌러야 합니다.
 */
export default function Calendar({ data, onSet, go }: Props) {
  const today = kstToday();
  const [month, setMonth] = useState(monthOf(today));
  const [brush, setBrush] = useState<string | null>(data.shifts[0]?.id ?? null);

  const cells = monthGrid(month);

  function paint(date: string) {
    const current = data.schedule[date];
    // 같은 걸 또 누르면 지웁니다. 잘못 칠했을 때 되돌리는 길입니다.
    if (brush && current === brush) onSet(date, null);
    else onSet(date, brush);
  }

  return (
    <div className="screen">
      <div className="mon">
        <button
          className="mon__nav"
          onClick={() => setMonth(addMonths(month, -1))}
          aria-label="이전 달"
        >
          ‹
        </button>
        <div className="mon__title">{monthLabel(month)}</div>
        <button
          className="mon__nav"
          onClick={() => setMonth(addMonths(month, 1))}
          aria-label="다음 달"
        >
          ›
        </button>
      </div>

      <div className="cal">
        {WEEKDAY_LABEL.map((w, i) => (
          <div
            key={w}
            className={`cal__wd${i === 0 ? ' cal__wd--sun' : ''}${i === 6 ? ' cal__wd--sat' : ''}`}
          >
            {w}
          </div>
        ))}

        {cells.map((date, i) =>
          date === null ? (
            <div key={`b${i}`} className="cal__cell cal__cell--blank" />
          ) : (
            <button
              key={date}
              className={`cal__cell${date === today ? ' cal__cell--today' : ''}`}
              onClick={() => paint(date)}
              aria-label={`${dayOf(date)}일 ${shiftOn(data, date)?.label ?? '비어 있음'}`}
            >
              <span className="cal__day">{dayOf(date)}</span>
              <span
                className="cal__code"
                style={{ color: shiftOn(data, date)?.color ?? 'transparent' }}
              >
                {shiftOn(data, date)?.code ?? '·'}
              </span>
            </button>
          )
        )}
      </div>

      <div className="stack">
        <button className="btn" onClick={() => go({ name: 'setup' })}>
          같은 패턴 반복해서 채우기
        </button>
      </div>

      <AdBanner />

      <div className="brush">
        <p className="brush__hint">
          칠할 근무를 고르고 날짜를 누르세요. 같은 걸 또 누르면 지워져요.
        </p>
        <div className="brush__row">
          {data.shifts.map((s) => (
            <button
              key={s.id}
              className="brush__btn"
              aria-pressed={brush === s.id}
              onClick={() => setBrush(s.id)}
              style={brush === s.id ? { color: s.color } : undefined}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
