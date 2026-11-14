import { useEffect, useState } from 'react';
import { BOXES, PADS, judge } from '../data/boxes';
import { preloadInterstitial, showInterstitial } from '../lib/ads';
import type { Route } from '../lib/navigation';
import Viz from '../components/Viz';
import AdBanner from '../components/AdBanner';

interface Props {
  go: (route: Route) => void;
}

const LABELS = ['가로', '세로', '높이'];

export default function Calc({ go }: Props) {
  const [vals, setVals] = useState<string[]>(['', '', '']);
  const [pad, setPad] = useState(4);

  useEffect(() => preloadInterstitial(), []);

  const nums = vals.map((v) => Number(v));
  const ready = nums.every((v) => Number.isFinite(v) && v > 0);
  const item = ready ? (nums as [number, number, number]) : null;
  const result = judge(item, pad);

  function set(i: number, v: string) {
    // 숫자와 소수점만 받습니다. 길이도 막아서 이상한 값이 안 들어오게 합니다.
    const clean = v.replace(/[^0-9.]/g, '').slice(0, 5);
    setVals(vals.map((x, k) => (k === i ? clean : x)));
  }

  return (
    <div className="screen">
      <h2 className="tool-h">택배 박스 몇 호</h2>
      <p className="lead">보낼 물건 크기를 넣으면 맞는 박스를 찾아드려요.</p>

      <div className="dims">
        {LABELS.map((lab, i) => (
          <div className="dim" key={lab}>
            <label className="dim__label" htmlFor={`d${i}`}>
              {lab} (cm)
            </label>
            <input
              id={`d${i}`}
              className="dim__input num"
              inputMode="decimal"
              value={vals[i]}
              onChange={(e) => set(i, e.target.value)}
              placeholder="0"
              autoComplete="off"
            />
          </div>
        ))}
      </div>

      <h2>완충재 여유</h2>
      <div className="pads">
        {PADS.map((p) => (
          <button
            key={p.value}
            className="pad"
            aria-pressed={pad === p.value}
            onClick={() => setPad(p.value)}
          >
            <span className="pad__label">{p.label}</span>
            <span className="pad__hint">{p.hint}</span>
          </button>
        ))}
      </div>

      {result && (
        <>
          <div className={`result result--${result.verdict}`} role="status">
            <div className="result__head">{result.headline}</div>
            {result.box && (
              <div className="result__sub num">
                {result.box.dims.join(' × ')} cm · 세 변 합 {result.boxSum}cm
                {result.tier ? ` · ${result.tier.name}` : ''}
              </div>
            )}
          </div>

          {result.box && item && (
            <Viz box={result.box} item={item} padding={pad} />
          )}

          <div className="block">
            <div className="block__title">왜 그런가요</div>
            {result.reasons.map((r) => (
              <div className="line" key={r}>
                <span className="line__dot" aria-hidden="true" />
                <span>{r}</span>
              </div>
            ))}
          </div>

          <div className="block">
            <div className="block__title">이렇게 하세요</div>
            {result.todo.map((t) => (
              <div className="line line--todo" key={t}>
                <span className="line__dot" aria-hidden="true" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <h2>박스 규격</h2>
      <div className="rows">
        {BOXES.map((b) => (
          <div
            className={`spec${result?.box?.id === b.id ? ' spec--on' : ''}`}
            key={b.id}
          >
            <span className="spec__name">{b.name}</span>
            <span className="spec__dims num">{b.dims.join(' × ')}</span>
            <span className="spec__use">{b.use}</span>
          </div>
        ))}
      </div>

      <div className="stack">
        <button
          className="btn btn--main"
          onClick={() => {
            showInterstitial();
            go({ name: 'know' });
          }}
        >
          알아두면 좋은 것 보기
        </button>
      </div>

      <p className="note">
        우체국 박스 기준이에요. 판매처에 따라 내경과 외경 표기가 달라 1cm 정도
        차이가 날 수 있습니다.
      </p>

      <AdBanner />
    </div>
  );
}
