import { useMemo } from 'react';
import type { AppData } from '../lib/storage';
import { addDays, dateLabel, kstToday, monthOf, WEEKDAY_LABEL, weekdayOf, dayOf } from '../lib/calendar';
import { monthCounts, nextOff, shiftOn } from '../lib/schedule';
import type { Route } from '../lib/navigation';
import AdBanner from '../components/AdBanner';

interface Props {
  data: AppData;
  go: (route: Route) => void;
}

export default function Today({ data, go }: Props) {
  const today = kstToday();
  const shift = shiftOn(data, today);
  const off = useMemo(() => nextOff(data, today), [data, today]);
  const counts = useMemo(() => monthCounts(data, monthOf(today)), [data, today]);

  // 이번 주. 일요일부터 토요일까지.
  const week = useMemo(() => {
    const start = addDays(today, -weekdayOf(today));
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [today]);

  const filled = Object.keys(data.schedule).length > 0;

  return (
    <div className="screen">
      <p className="today__date">{dateLabel(today)}</p>

      {shift ? (
        <div className="today__card" style={{ background: shift.color }}>
          <div className="today__label">{shift.label}</div>
          {shift.start && shift.end && (
            <div className="today__time num">
              {shift.start} ~ {shift.end}
            </div>
          )}
        </div>
      ) : (
        <div className="today__empty">
          {filled ? (
            <>
              오늘은 근무가 안 적혀 있어요.
              <br />
              달력에서 채워주세요.
            </>
          ) : (
            <>
              아직 근무표가 비어 있어요.
              <br />
              먼저 근무를 채워주세요.
            </>
          )}
        </div>
      )}

      {off && (
        <div className="off">
          <div className="off__big">
            {off.inDays === 0 ? '오늘 쉬어요' : `쉬는 날까지 ${off.inDays}일`}
          </div>
          <p className="off__sub">
            {off.inDays === 0
              ? '푹 쉬세요'
              : `${dateLabel(off.date)}에 쉬어요`}
          </p>
        </div>
      )}

      <h2>이번 주</h2>
      <div className="week">
        {week.map((d) => {
          const s = shiftOn(data, d);
          return (
            <div
              key={d}
              className={`week__cell${d === today ? ' week__cell--today' : ''}`}
            >
              <div className="week__wd">{WEEKDAY_LABEL[weekdayOf(d)]}</div>
              <div
                className="week__code"
                style={{ color: s ? s.color : 'var(--ink3)' }}
              >
                {s ? s.code : dayOf(d)}
              </div>
            </div>
          );
        })}
      </div>

      {counts.length > 0 && (
        <>
          <h2>이번 달</h2>
          <div className="rows">
            {counts.map(({ shift: s, count }) => (
              <div className="row" key={s.id}>
                <span className="row__dot" style={{ background: s.color }}>
                  {s.code}
                </span>
                <span className="row__body">
                  <span className="row__name">{s.label}</span>
                </span>
                <span className="row__count num">{count}번</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="stack">
        <button className="btn btn--main" onClick={() => go({ name: 'calendar' })}>
          {filled ? '근무표 보기' : '근무표 채우기'}
        </button>
        <button className="btn" onClick={() => go({ name: 'setup' })}>
          근무 종류 설정
        </button>
      </div>

      <AdBanner />
    </div>
  );
}
