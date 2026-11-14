import './sizes.css';
import { useState } from 'react';
import { circumferenceFromKr, circumferenceFromUs, fmt, ringFromCircumference } from './data';

type Mode = 'mm' | 'dia' | 'kr' | 'us';

export default function Ring() {
  const [mode, setMode] = useState<Mode>('mm');
  const [value, setValue] = useState('');
  const n = parseFloat(value);
  let circ: number | null = null;
  if (!Number.isNaN(n) && n > 0) {
    if (mode === 'mm') circ = n;
    if (mode === 'dia') circ = n * Math.PI;
    if (mode === 'kr') circ = circumferenceFromKr(n);
    if (mode === 'us') circ = circumferenceFromUs(n);
  }
  const r = circ ? ringFromCircumference(circ) : null;
  const outOfRange = r && (r.kr < 1 || r.kr > 30);

  return (
    <div className="sz">
      <div className="sz-tabs" role="tablist">
        {([
          ['mm', '손가락 둘레'],
          ['dia', '반지 안지름'],
          ['kr', '한국 호수'],
          ['us', '미국 사이즈'],
        ] as [Mode, string][]).map(([m, label]) => (
          <button key={m} className="sz-tab" aria-pressed={mode === m} onClick={() => { setMode(m); setValue(''); }}>
            {label}
          </button>
        ))}
      </div>
      <label className="sz-field">
        <span>{mode === 'mm' ? '둘레 (mm)' : mode === 'dia' ? '안지름 (mm)' : mode === 'kr' ? '호수' : 'US 사이즈'}</span>
        <input inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder={mode === 'mm' ? '예: 52' : mode === 'dia' ? '예: 16.5' : mode === 'kr' ? '예: 9' : '예: 6'} />
      </label>
      {r && (
        <div className="sz-result" role="status">
          {outOfRange && <p className="sz-warn">국내 호수 범위(1~30호)를 벗어났어요. 입력값을 다시 확인해 주세요.</p>}
          <dl>
            <div><dt>한국 호수</dt><dd>{r.kr}호</dd></div>
            <div><dt>미국 (US)</dt><dd>{fmt(r.us)}</dd></div>
            <div><dt>유럽 (EU)</dt><dd>{r.eu}</dd></div>
            <div><dt>둘레 / 안지름</dt><dd>{fmt(Math.round(circ! * 10) / 10)}mm / {fmt(Math.round(r.diameter * 10) / 10)}mm</dd></div>
          </dl>
        </div>
      )}
    </div>
  );
}
