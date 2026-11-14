import './sizes.css';
import { useState } from 'react';
import { MEN, WOMEN } from './data';

export default function Cloth() {
  const [who, setWho] = useState<'w' | 'm'>('w');
  const rows = who === 'w' ? WOMEN : MEN;
  const [i, setI] = useState(1);
  const r = rows[Math.min(i, rows.length - 1)];
  return (
    <div className="sz">
      <div className="sz-tabs">
        <button className="sz-tab" aria-pressed={who === 'w'} onClick={() => { setWho('w'); setI(1); }}>여성 상의</button>
        <button className="sz-tab" aria-pressed={who === 'm'} onClick={() => { setWho('m'); setI(2); }}>남성 상의</button>
      </div>
      <label className="sz-field">
        <span>한국 사이즈</span>
        <select value={i} onChange={(e) => setI(Number(e.target.value))}>
          {rows.map((x, k) => <option key={x.kr} value={k}>{x.kr}</option>)}
        </select>
      </label>
      <div className="sz-result" role="status">
        <dl>
          <div><dt>국제 표기</dt><dd>{r.intl}</dd></div>
          <div><dt>미국 (US)</dt><dd>{r.us}</dd></div>
          <div><dt>유럽 (EU)</dt><dd>{r.eu}</dd></div>
          {r.uk && <div><dt>영국 (UK)</dt><dd>{r.uk}</dd></div>}
        </dl>
        <p className="sz-note">옷은 브랜드와 핏에 따라 차이가 커요. 상세페이지의 가슴단면, 총장 실측을 내 옷과 비교하는 게 가장 정확합니다.</p>
      </div>
    </div>
  );
}
