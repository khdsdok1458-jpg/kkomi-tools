import './sizes.css';
import { useState } from 'react';
import { fmt, SHOE_SIZES, shoeRow } from './data';

export default function Shoe() {
  const [kr, setKr] = useState(250);
  const r = shoeRow(kr);
  return (
    <div className="sz">
      <label className="sz-field">
        <span>평소 신는 한국 사이즈 (mm)</span>
        <select value={kr} onChange={(e) => setKr(Number(e.target.value))}>
          {SHOE_SIZES.map((s) => <option key={s} value={s}>{s}mm</option>)}
        </select>
      </label>
      <div className="sz-result" role="status">
        <dl>
          <div><dt>미국 남성 (US M)</dt><dd>{fmt(r.usM)}</dd></div>
          <div><dt>미국 여성 (US W)</dt><dd>{fmt(r.usW)}</dd></div>
          <div><dt>영국 (UK)</dt><dd>{fmt(r.uk)}</dd></div>
          <div><dt>유럽 (EU)</dt><dd>{r.eu}</dd></div>
        </dl>
        <p className="sz-note">브랜드마다 0.5 정도 차이가 날 수 있어요. 결제 전에 해당 브랜드 사이즈표를 한 번 더 확인하세요.</p>
      </div>
    </div>
  );
}
