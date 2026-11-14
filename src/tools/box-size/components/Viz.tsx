import type { Box } from '../data/boxes';

/**
 * 박스와 물건을 겹쳐 그립니다.
 *
 * 숫자만 보면 여유가 얼마나 되는지 감이 안 옵니다.
 * 위에서 내려다본 모양으로 그려서 남는 공간을 눈으로 보게 합니다.
 */
export default function Viz({
  box,
  item,
  padding,
}: {
  box: Box;
  item: [number, number, number];
  padding: number;
}) {
  const W = 100;
  const H = 62;

  // 물건을 박스에 들어가는 방향으로 돌려놓습니다.
  const need = item.map((v) => v + padding).sort((a, b) => b - a);
  const bd = [...box.dims].sort((a, b) => b - a);

  // 박스 긴 변을 화면 폭에 맞춥니다.
  const scale = Math.min((W - 18) / bd[0], (H - 18) / bd[1]);
  const bw = bd[0] * scale;
  const bh = bd[1] * scale;
  const iw = Math.min(need[0], bd[0]) * scale;
  const ih = Math.min(need[1], bd[1]) * scale;

  const bx = (W - bw) / 2;
  const by = (H - bh) / 2;

  return (
    <div className="viz">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="viz__svg"
        role="img"
        aria-label={`${box.name} 박스에 물건을 넣었을 때 남는 공간`}
        focusable="false"
      >
        <rect x={bx} y={by} width={bw} height={bh} rx="2" className="viz__box" />
        <rect
          x={bx + (bw - iw) / 2}
          y={by + (bh - ih) / 2}
          width={iw}
          height={ih}
          rx="1.5"
          className="viz__item"
        />
        <text x={W / 2} y={by - 3} textAnchor="middle" className="viz__cap">
          {bd[0]} × {bd[1]} cm
        </text>
      </svg>
      <div className="legend">
        <span>
          <span className="legend__key legend__key--box" aria-hidden="true" />
          {box.name} 박스
        </span>
        <span>
          <span className="legend__key legend__key--item" aria-hidden="true" />
          보낼 물건
        </span>
      </div>
    </div>
  );
}
