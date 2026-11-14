import { useEffect, useState } from 'react';
import type { Food, Temp } from '../data/rules';
import { ELAPSED, FOODS, TEMPS, judge } from '../data/rules';
import { preloadInterstitial, showInterstitial } from '../lib/ads';
import type { Route } from '../lib/navigation';
import AdBanner from '../components/AdBanner';

interface Props {
  go: (route: Route) => void;
}

export default function Check({ go }: Props) {
  const [food, setFood] = useState<Food | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [temp, setTemp] = useState<Temp | null>(null);

  useEffect(() => preloadInterstitial(), []);

  const result = judge(food, elapsed, temp);

  return (
    <div className="screen">
      <h2 className="tool-h">이거 먹어도 되나</h2>
      <p className="lead">상온에 둔 음식, 먹어도 될지 알려드려요.</p>

      <h2>뭘 드시려고요?</h2>
      <div className="opts opts--two">
        {FOODS.map((f) => (
          <button
            key={f.id}
            className="opt"
            aria-pressed={food?.id === f.id}
            onClick={() => setFood(f)}
          >
            <span className="opt__label">{f.name}</span>
            <span className="opt__sub">{f.examples}</span>
          </button>
        ))}
      </div>

      <h2>만들어진 지 얼마나 됐어요?</h2>
      <p className="lead" style={{ marginTop: -6, marginBottom: 12, fontSize: 13 }}>
        받은 때가 아니라 조리가 끝난 때부터 세세요. 배달 시간도 들어갑니다.
      </p>
      <div className="opts opts--three">
        {ELAPSED.map((e) => (
          <button
            key={e.hours}
            className="opt opt--center"
            aria-pressed={elapsed === e.hours}
            onClick={() => setElapsed(e.hours)}
          >
            <span className="opt__label">{e.label}</span>
          </button>
        ))}
      </div>

      <h2>그동안 얼마나 더웠어요?</h2>
      <div className="opts opts--three">
        {TEMPS.map((t) => (
          <button
            key={t.id}
            className="opt opt--center"
            aria-pressed={temp?.id === t.id}
            onClick={() => setTemp(t)}
          >
            <span className="opt__label">{t.label}</span>
            <span className="opt__sub">{t.hint}</span>
          </button>
        ))}
      </div>

      {result && (
        <>
          <div className={`verdict verdict--${result.verdict}`} role="status">
            <div className="verdict__head">{result.headline}</div>
          </div>

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
        식품의약품안전처 권고를 기준으로 한 안내예요. 음식과 보관 상태에 따라
        다를 수 있으니 애매하면 버리는 쪽이 맞습니다.
      </p>

      <AdBanner />
    </div>
  );
}
