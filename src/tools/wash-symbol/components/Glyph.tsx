import type { Symbol } from '../data/symbols';

/**
 * 세탁 기호를 그립니다.
 *
 * 글로 "삼각형 안에 사선"이라고 써봐야 라벨의 그림과 맞춰볼 수 없습니다.
 * 그래서 도형을 직접 그립니다. 이게 이 앱의 전부입니다.
 */
export default function Glyph({ symbol, size = 64 }: { symbol: Symbol; size?: number }) {
  const S = 100;
  const stroke = 6;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${S} ${S}`}
      role="img"
      aria-label={symbol.name}
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {base(symbol.base)}
        {inner(symbol)}
        {bars(symbol.bars)}
        {symbol.crossed && cross(symbol.base)}
      </g>
    </svg>
  );
}

/**
 * 금지 표시 X.
 * 도형보다 크게 그으면 원래 모양을 덮어서 무슨 기호인지 알 수 없게 됩니다.
 * 도형 안쪽에 맞춰 그립니다.
 */
function cross(kind: Symbol['base']) {
  const box: Record<Symbol['base'], [number, number, number, number]> = {
    tub: [20, 30, 80, 74],
    triangle: [26, 26, 74, 74],
    square: [20, 24, 80, 72],
    iron: [22, 32, 80, 66],
    circle: [26, 24, 74, 72],
  };
  const [x1, y1, x2, y2] = box[kind];
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <line x1={x2} y1={y1} x2={x1} y2={y2} />
    </>
  );
}

function base(kind: Symbol['base']) {
  switch (kind) {
    case 'tub':
      // 대야. 위가 물결이고 아래가 좁아지는 사다리꼴입니다.
      return (
        <path d="M10 26 Q22 18 34 26 T58 26 T90 26 L82 72 Q80 78 74 78 L26 78 Q20 78 18 72 Z" />
      );
    case 'triangle':
      return <path d="M50 14 L88 78 L12 78 Z" />;
    case 'square':
      return <rect x="14" y="18" width="72" height="60" rx="4" />;
    case 'iron':
      // 다리미. 바닥이 평평하고 위가 둥근 모양입니다.
      return <path d="M14 70 L20 36 Q24 26 40 26 L74 26 Q88 26 88 40 L88 70 Z" />;
    case 'circle':
      return <circle cx="50" cy="48" r="34" />;
  }
}

function inner(s: Symbol) {
  const i = s.inner;
  // X가 그어진 기호는 안쪽 내용을 비워 읽기 쉽게 합니다.
  if (s.crossed && i.kind !== 'circle') return null;

  switch (i.kind) {
    case 'none':
      return null;
    case 'text':
      return (
        <text
          x="50"
          y={s.base === 'tub' ? 62 : 58}
          textAnchor="middle"
          fontSize="30"
          fontWeight="700"
          fill="currentColor"
          stroke="none"
        >
          {i.text}
        </text>
      );
    case 'hand':
      // 손. 손가락 네 개가 보여야 손으로 읽힙니다.
      return (
        <g strokeWidth="5">
          <line x1="38" y1="44" x2="38" y2="60" />
          <line x1="46" y1="38" x2="46" y2="60" />
          <line x1="54" y1="38" x2="54" y2="60" />
          <line x1="62" y1="42" x2="62" y2="60" />
          <path d="M34 58 L34 68 Q34 72 40 72 L60 72 Q66 72 66 68 L66 58" />
        </g>
      );
    case 'circle':
      return <circle cx="50" cy="48" r="20" />;
    case 'dots':
      return (
        <>
          {Array.from({ length: i.count }, (_, k) => {
            const gap = 16;
            const x = 50 + (k - (i.count - 1) / 2) * gap;
            return (
              <circle key={k} cx={x} cy={48} r="4" fill="currentColor" stroke="none" />
            );
          })}
        </>
      );
    case 'vline':
      return <line x1="50" y1="26" x2="50" y2="70" />;
    case 'hline':
      return <line x1="26" y1="48" x2="74" y2="48" />;
    case 'diag':
      // 산소계만. 삼각형 안에 사선 두 줄입니다.
      return (
        <>
          <line x1="36" y1="70" x2="58" y2="34" />
          <line x1="48" y1="70" x2="70" y2="34" />
        </>
      );
  }
}

function bars(n: 0 | 1 | 2) {
  if (n === 0) return null;
  return (
    <>
      {Array.from({ length: n }, (_, k) => (
        <line key={k} x1="30" y1={86 + k * 9} x2="70" y2={86 + k * 9} />
      ))}
    </>
  );
}
