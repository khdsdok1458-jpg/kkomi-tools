import { useEffect, useMemo, useState } from 'react';
import type { Cut, Thickness } from '../data/cuts';
import {
  CUTS, FLIP_EVERY, THICKNESS, clock, flipCount, totalSeconds, untilFlip,
} from '../data/cuts';
import { useElapsed } from '../lib/timer';
import { preloadInterstitial, showInterstitial } from '../lib/ads';
import type { Route } from '../lib/navigation';
import AdBanner from '../components/AdBanner';

interface Props {
  go: (route: Route) => void;
}

export default function Pick({ go }: Props) {
  const [cut, setCut] = useState<Cut | null>(null);
  const [thick, setThick] = useState<Thickness>('thin');
  const [running, setRunning] = useState(false);
  const { elapsed, reset } = useElapsed(running);

  useEffect(() => preloadInterstitial(), []);

  const total = cut ? totalSeconds(cut, thick) : 0;
  const cooking = cut ? Math.min(elapsed, total) : 0;
  const restLeft = cut ? cut.rest - Math.max(elapsed - total, 0) : 0;
  const phase: 'idle' | 'cook' | 'rest' | 'done' = !cut
    ? 'idle'
    : elapsed < total
      ? 'cook'
      : restLeft > 0
        ? 'rest'
        : 'done';

  const flipIn = useMemo(() => untilFlip(cooking), [cooking]);

  function start(c: Cut) {
    setCut(c);
    reset();
    setRunning(true);
  }

  if (!cut) {
    return (
      <div className="screen">
        <h2 className="tool-h">고기 언제 뒤집지</h2>
        <p className="lead">30초마다 뒤집을 때를 알려드려요.</p>

        <h2>두께</h2>
        <div className="chips">
          {THICKNESS.map((t) => (
            <button
              key={t.id}
              className="chip"
              aria-pressed={thick === t.id}
              onClick={() => setThick(t.id)}
            >
              <span className="chip__label">{t.label}</span>
              <span className="chip__sub">{t.sub}</span>
            </button>
          ))}
        </div>

        <h2>부위</h2>
        {CUTS.map((c) => (
          <button key={c.id} className="cut" onClick={() => start(c)}>
            <span className="cut__name">{c.name}</span>
            <span className="cut__hint">{c.hint}</span>
          </button>
        ))}

        <p className="note">
          불 세기와 팬에 따라 시간은 크게 달라져요. 여기 시간은 기준일 뿐이고
          눈으로 보고 판단하세요.
        </p>

        <div className="stack">
          <button className="btn" onClick={() => go({ name: 'myth' })}>
            잘못 알려진 것들
          </button>
        </div>

        <AdBanner />
      </div>
    );
  }

  const isFlip = phase === 'cook' && flipIn <= 3;
  const cls =
    phase === 'done'
      ? 'timer timer--done'
      : phase === 'rest'
        ? 'timer timer--rest'
        : isFlip
          ? 'timer timer--flip'
          : 'timer';

  return (
    <div className="screen">
      <div className={cls} role="status">
        {phase === 'cook' && (
          <>
            <div className="timer__state">
              {isFlip ? '지금 뒤집으세요' : '다음 뒤집기까지'}
            </div>
            <div className="timer__big num">{Math.ceil(flipIn)}</div>
            <div className="timer__sub num">
              전체 {clock(total - cooking)} 남음
            </div>
          </>
        )}
        {phase === 'rest' && (
          <>
            <div className="timer__state">불에서 내리고 쉬게 두세요</div>
            <div className="timer__big num">{clock(restLeft)}</div>
            <div className="timer__sub">지금 자르면 육즙이 흘러나와요</div>
          </>
        )}
        {phase === 'done' && (
          <>
            <div className="timer__state">다 됐어요</div>
            <div className="timer__big">맛있게</div>
            <div className="timer__sub">{cut.name} 드세요</div>
          </>
        )}
      </div>

      {phase === 'cook' && (
        <div className="bar" role="img" aria-label={`${Math.round((cooking / total) * 100)}퍼센트 진행`}>
          <span
            className="bar__fill"
            style={{ width: `${(cooking / total) * 100}%` }}
          />
        </div>
      )}

      <p className="tip">{cut.tip}</p>

      <div className="stack">
        {phase !== 'done' && (
          <button className="btn" onClick={() => setRunning(!running)}>
            {running ? '잠깐 멈추기' : '다시 시작'}
          </button>
        )}
        <button
          className="btn btn--main"
          onClick={() => {
            setCut(null);
            setRunning(false);
            reset();
          }}
        >
          다른 부위 굽기
        </button>
        <button
          className="btn"
          onClick={() => {
            showInterstitial();
            go({ name: 'myth' });
          }}
        >
          잘못 알려진 것들 보기
        </button>
      </div>

      <p className="note num">
        {cut.name} {thick === 'thin' ? '얇게' : '두껍게'} · 전체 {clock(total)} ·
        {FLIP_EVERY}초마다 {flipCount(cut, thick)}번 뒤집기
      </p>

      <AdBanner />
    </div>
  );
}
