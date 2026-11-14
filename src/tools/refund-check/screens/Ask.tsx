import { useEffect, useState } from 'react';
import type { Answers } from '../data/rules';
import { QUESTION_COUNT, answeredCount, judge, nextQuestion } from '../data/rules';
import { preloadInterstitial, showInterstitial } from '../lib/ads';
import type { Route } from '../lib/navigation';
import AdBanner from '../components/AdBanner';

interface Props {
  go: (route: Route) => void;
}

export default function Ask({ go }: Props) {
  const [a, setA] = useState<Answers>({});

  useEffect(() => preloadInterstitial(), []);

  const q = nextQuestion(a);
  const result = judge(a);

  function pick(id: keyof Answers, value: string) {
    // within7만 불리언이고 나머지는 문자열입니다.
    const v = id === 'within7' ? value === 'true' : value;
    setA({ ...a, [id]: v });
  }

  if (q) {
    const done = answeredCount(a);
    return (
      <div className="screen">
        <div
          className="progress"
          role="img"
          aria-label={`${QUESTION_COUNT}개 중 ${done + 1}번째 질문`}
        >
          {Array.from({ length: QUESTION_COUNT }, (_, i) => (
            <span
              key={i}
              className={`progress__bit${i <= done ? ' progress__bit--on' : ''}`}
            />
          ))}
        </div>

        <h2 className="tool-h q">{q.title}</h2>
        {q.hint && <p className="q__hint">{q.hint}</p>}

        {q.options.map((o) => (
          <button
            key={o.value}
            className="opt"
            onClick={() => pick(q.id, o.value)}
          >
            <span className="opt__label">{o.label}</span>
            {o.sub && <span className="opt__sub">{o.sub}</span>}
          </button>
        ))}

        {done === 0 && (
          <p className="note">
            전자상거래법을 기준으로 안내합니다. 실제 판단은 구체적인 사정에 따라
            다를 수 있어요.
          </p>
        )}

        <AdBanner />
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="screen">
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
        <button className="btn" onClick={() => setA({})}>
          처음부터 다시
        </button>
      </div>

      <p className="note">
        전자상거래법을 기준으로 한 안내입니다. 실제 판단은 구체적인 사정에 따라
        다를 수 있어요. 다투게 되면 국번없이 1372 소비자상담센터에 상담하세요.
      </p>

      <AdBanner />
    </div>
  );
}
