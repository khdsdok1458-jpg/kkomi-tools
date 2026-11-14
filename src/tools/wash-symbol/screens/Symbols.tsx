import { useEffect, useState } from 'react';
import type { Group, Symbol } from '../data/symbols';
import { GROUPS, symbolsIn } from '../data/symbols';
import { preloadInterstitial, showInterstitial } from '../lib/ads';
import type { Route } from '../lib/navigation';
import Glyph from '../components/Glyph';
import AdBanner from '../components/AdBanner';

interface Props {
  go: (route: Route) => void;
}

export default function Symbols({ go }: Props) {
  const [group, setGroup] = useState<Group>('wash');
  const [picked, setPicked] = useState<Symbol | null>(null);

  useEffect(() => preloadInterstitial(), []);

  const list = symbolsIn(group);

  return (
    <div className="screen">
      <h2 className="tool-h">이 빨래 어떻게</h2>
      <p className="lead">옷 라벨에서 본 기호를 찾아 눌러보세요.</p>

      <div className="tabs">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            className="tab"
            aria-pressed={group === g.id}
            onClick={() => {
              setGroup(g.id);
              setPicked(null);
            }}
          >
            {g.label}
            <span className="tab__hint">{g.hint}</span>
          </button>
        ))}
      </div>

      <div className="grid">
        {list.map((s) => (
          <button
            key={s.id}
            className="cell"
            aria-pressed={picked?.id === s.id}
            onClick={() => setPicked(picked?.id === s.id ? null : s)}
          >
            <Glyph symbol={s} size={56} />
            <span className="cell__name">{s.name}</span>
          </button>
        ))}
      </div>

      {picked && (
        <div className="detail" role="status">
          <span className="detail__glyph">
            <Glyph symbol={picked} size={60} />
          </span>
          <span className="detail__body">
            <span className="detail__name">{picked.name}</span>
            <p className="detail__meaning">{picked.meaning}</p>
            {picked.note && <p className="detail__note">{picked.note}</p>}
          </span>
        </div>
      )}

      <div className="stack">
        <button
          className="btn btn--main"
          onClick={() => {
            showInterstitial();
            go({ name: 'tips' });
          }}
        >
          옷 버리지 않는 법 보기
        </button>
      </div>

      <p className="note">
        나라마다 표기가 조금씩 달라요. 해외에서 산 옷은 손 모양이 있으면
        손세탁이라는 뜻입니다.
      </p>

      <AdBanner />
    </div>
  );
}
