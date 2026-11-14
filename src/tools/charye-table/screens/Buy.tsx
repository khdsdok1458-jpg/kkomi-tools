import type { AppData } from '../lib/storage';
import { ROW_LABEL, dishesFor } from '../data/table';
import AdBanner from '../components/AdBanner';

interface Props {
  data: AppData;
  onToggle: (id: string) => void;
  onReset: () => void;
}

export default function Buy({ data, onToggle, onReset }: Props) {
  const items = dishesFor(data.style).filter((d) => d.buy);
  const done = items.filter((d) => data.bought.includes(d.id)).length;

  return (
    <div className="screen">
      <h2 className="tool-h">장보기 목록</h2>
      <p className="lead">
        {done === items.length
          ? '다 담으셨어요.'
          : `${items.length}개 중 ${done}개 담았어요.`}
      </p>

      <div className="rows">
        {items.map((d) => {
          const isDone = data.bought.includes(d.id);
          return (
            <button
              key={d.id}
              className={`item${isDone ? ' item--done' : ''}`}
              onClick={() => onToggle(d.id)}
              aria-pressed={isDone}
            >
              <span className="item__box" aria-hidden="true">
                ✓
              </span>
              <span className="item__name">{d.name}</span>
              <span className="item__row">{ROW_LABEL[d.row].split(' · ')[1]}</span>
            </button>
          );
        })}
      </div>

      <div className="stack">
        <button className="btn" onClick={onReset}>
          체크 전부 지우기
        </button>
      </div>

      <p className="note">
        상차림을 간소하게로 바꾸면 목록도 함께 줄어들어요.
      </p>

      <AdBanner />
    </div>
  );
}
