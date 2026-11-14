import { useEffect, useState } from 'react';
import type { AppData } from '../lib/storage';
import type { Dish, Style } from '../data/table';
import { ROW_LABEL, dishesFor, rowsFor } from '../data/table';
import { ddayLabel } from '../lib/dday';
import type { Route } from '../lib/navigation';
import AdBanner from '../components/AdBanner';
import { preloadInterstitial, showInterstitial } from '../lib/ads';

interface Props {
  data: AppData;
  onStyle: (style: Style) => void;
  go: (route: Route) => void;
}

export default function Table({ data, onStyle, go }: Props) {
  const [picked, setPicked] = useState<Dish | null>(null);
  const dishes = dishesFor(data.style);

  // 보여줄 때 바로 뜨도록 미리 받아둡니다.
  useEffect(() => preloadInterstitial(), []);
  const rows = rowsFor(data.style);

  return (
    <div className="screen">
      <span className="dday">{ddayLabel()}</span>
      <h2 className="tool-h" style={{ marginTop: 14 }}>차례상 어디놔</h2>
      <p className="lead">음식을 누르면 왜 그 자리인지 알려드려요.</p>

      <div className="chips">
        <button
          className="chip"
          aria-pressed={data.style === 'full'}
          onClick={() => {
            onStyle('full');
            setPicked(null);
          }}
        >
          전통 5열
        </button>
        <button
          className="chip"
          aria-pressed={data.style === 'simple'}
          onClick={() => {
            onStyle('simple');
            setPicked(null);
          }}
        >
          간소하게
        </button>
      </div>

      <div className="table">
        {/* 방향 기준을 화면에 박아둡니다. 여기서 다들 헷갈립니다. */}
        <p className="table__north">↑ 신위 (이쪽이 북쪽)</p>
        <div className="table__axis">
          <span>← 서쪽</span>
          <span>동쪽 →</span>
        </div>

        {rows.map((row) => (
          <div className="row" key={row}>
            <p className="row__tag">{ROW_LABEL[row]}</p>
            {/*
              좌표로 놓으면 이름이 긴 음식이 옆 칸을 침범합니다.
              규칙이 말하는 건 정확한 위치가 아니라 서쪽에서 동쪽으로 가는
              순서라서, 순서대로 나란히 놓는 게 맞고 겹칠 일도 없습니다.
            */}
            <div className="row__strip">
              {dishes
                .filter((d) => d.row === row)
                .sort((a, b) => a.pos - b.pos)
                .map((d) => (
                  <button
                    key={d.id}
                    className={
                      'dish' +
                      (picked?.id === d.id ? ' dish--on' : '') +
                      (data.bought.includes(d.id) ? ' dish--bought' : '')
                    }
                    onClick={() => setPicked(picked?.id === d.id ? null : d)}
                    aria-label={`${d.name}, ${ROW_LABEL[row]}`}
                  >
                    {d.name}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {picked && (
        <div className="detail" role="status">
          <div className="detail__name">{picked.name}</div>
          {picked.rule && <span className="detail__rule">{picked.rule}</span>}
          <p className="detail__why">{picked.why}</p>
        </div>
      )}

      <p className="note">
        지역과 집안, 종교에 따라 차림이 크게 다릅니다. 여기 있는 건 가장 널리
        쓰이는 방식이고, 집안 방식이 있으면 그쪽을 따르세요.
      </p>

      <div className="stack">
        <button className="btn btn--main" onClick={() => go({ name: 'buy' })}>
          장보기 목록
        </button>
        <button
          className="btn"
          onClick={() => {
            showInterstitial();
            go({ name: 'tips' });
          }}
        >
          헷갈리는 것들 보기
        </button>
      </div>

      <AdBanner />
    </div>
  );
}
