import { useEffect, useState } from 'react';
import type { AppData } from '../lib/storage';
import { PRESETS } from '../data/shifts';
import type { Shift } from '../data/shifts';
import { kstToday, addDays, dateLabel } from '../lib/calendar';
import { fillPattern } from '../lib/schedule';
import AdBanner from '../components/AdBanner';
import { preloadInterstitial, showInterstitial } from '../lib/ads';

interface Props {
  data: AppData;
  onShifts: (shifts: Shift[]) => void;
  onSchedule: (schedule: Record<string, string>) => void;
  onDone: () => void;
}

const SPANS = [
  { days: 30, label: '한 달' },
  { days: 60, label: '두 달' },
  { days: 90, label: '석 달' },
];

export default function Setup({ data, onShifts, onSchedule, onDone }: Props) {
  const today = kstToday();
  const [pattern, setPattern] = useState<string[]>([]);
  const [start, setStart] = useState(today);
  const [span, setSpan] = useState(60);
  const [overwrite, setOverwrite] = useState(false);
  const [done, setDone] = useState(false);
  const [missing, setMissing] = useState(false);
  const [confirmPreset, setConfirmPreset] = useState<string | null>(null);

  const currentPreset = PRESETS.find(
    (p) => p.shifts.map((s) => s.id).join() === data.shifts.map((s) => s.id).join()
  );

  const hasRecords = Object.keys(data.schedule).length > 0;

  
  useEffect(() => preloadInterstitial(), []);

  function apply() {
    // 버튼을 잠가두면 왜 안 눌리는지 알 수 없습니다. 빠진 걸 짚어줍니다.
    if (pattern.length === 0) {
      setMissing(true);
      document
        .getElementById('pattern')
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    onSchedule(fillPattern(data.schedule, pattern, start, span, overwrite));
    showInterstitial();
    setDone(true);
  }

  /**
   * 근무 종류를 바꾸면 기존 기록의 코드가 안 맞아서 달력이 비어 보입니다.
   * 데이터는 남아 있지만 사용자는 다 날아간 줄 압니다. 미리 알려줍니다.
   */
  function pickPreset(id: string) {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    if (hasRecords && currentPreset?.id !== id && confirmPreset !== id) {
      setConfirmPreset(id);
      return;
    }
    onShifts(preset.shifts);
    setPattern([]);
    setMissing(false);
    setConfirmPreset(null);
  }

  return (
    <div className="screen">
      <h2 className="tool-h">근무 종류</h2>
      <p className="lead">쓰는 말이 직군마다 달라서 골라 쓰시면 돼요.</p>

      <div className="rows">
        {PRESETS.map((p) => (
          <div key={p.id}>
            <button className="row" onClick={() => pickPreset(p.id)}>
              <span className="row__body">
                <span className="row__name">{p.name}</span>
                <span className="row__meta">{p.hint}</span>
              </span>
              <span className="row__count" style={{ fontSize: 15 }}>
                {currentPreset?.id === p.id ? '쓰는 중' : '바꾸기'}
              </span>
            </button>
            {confirmPreset === p.id && (
              <div className="note" role="alert">
                이미 적어둔 근무표가 있어요. 종류를 바꾸면 달력이 비어 보여요.
                기록이 지워지는 건 아니고, 원래 종류로 되돌리면 다시 나타나요.
                <div className="stack" style={{ marginTop: 12 }}>
                  <button className="btn" onClick={() => pickPreset(p.id)}>
                    그래도 바꾸기
                  </button>
                  <button
                    className="btn"
                    onClick={() => setConfirmPreset(null)}
                  >
                    그만두기
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="note">
        근무표를 병원에서 받아 오신다면 여기까지만 하고 달력에서 직접 채우세요.
        정해진 주기로 도는 근무라면 아래에서 패턴을 넣으면 앞으로가 자동으로
        채워져요.
      </div>

      <h2 className="tool-h" style={{ marginTop: 36 }}>패턴 반복</h2>
      <p className="lead">
        도는 순서대로 눌러주세요. 예를 들어 주주야야비비면 주간, 주간, 야간,
        야간, 비번, 비번 순으로 누르시면 돼요.
      </p>

      <div className="field" id="pattern">
        <span className="field__label">
          순서 {pattern.length > 0 && `(${pattern.length}일 주기)`}
          {pattern.length === 0 && <span className="dot" aria-hidden="true" />}
        </span>
        <p className="req" role="alert">
          {missing ? '도는 순서를 먼저 눌러주세요.' : ''}
        </p>
        <div className="chips">
          {data.shifts.map((s) => (
            <button
              key={s.id}
              className="chip"
              onClick={() => {
                setPattern([...pattern, s.id]);
                setMissing(false);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div
          className="note"
          style={{ marginTop: 12, color: 'var(--ink)', fontWeight: 600 }}
        >
          {pattern.length === 0
            ? '아직 아무것도 안 넣었어요.'
            : pattern
                .map((id) => data.shifts.find((s) => s.id === id)?.code ?? '?')
                .join(' ')}
        </div>

        {pattern.length > 0 && (
          <div className="stack" style={{ marginTop: 10 }}>
            <button className="btn" onClick={() => setPattern([])}>
              순서 지우기
            </button>
          </div>
        )}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="start">
          이 날부터 시작
        </label>
        <input
          id="start"
          className="input"
          type="date"
          value={start}
          max={addDays(today, 365)}
          onChange={(e) => setStart(e.target.value || today)}
        />
      </div>

      <div className="field">
        <span className="field__label">얼마나 채울까요</span>
        <div className="chips">
          {SPANS.map((s) => (
            <button
              key={s.days}
              className="chip"
              aria-pressed={span === s.days}
              onClick={() => setSpan(s.days)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field__label">이미 채운 날은</span>
        <div className="chips">
          <button
            className="chip"
            aria-pressed={!overwrite}
            onClick={() => setOverwrite(false)}
          >
            그대로 두기
          </button>
          <button
            className="chip"
            aria-pressed={overwrite}
            onClick={() => setOverwrite(true)}
          >
            덮어쓰기
          </button>
        </div>
      </div>

      <div className="stack">
        <button
          className="btn btn--main"
          onClick={apply}
          aria-disabled={pattern.length === 0}
        >
          채우기
        </button>
        {done && (
          <>
            <p className="note" role="status">
              {dateLabel(start)}부터 {span}일치를 채웠어요.
            </p>
            <button className="btn" onClick={onDone}>
              오늘 근무 보기
            </button>
          </>
        )}
      </div>

      <AdBanner />
    </div>
  );
}
