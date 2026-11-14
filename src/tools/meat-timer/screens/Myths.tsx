import { MYTHS } from '../data/cuts';
import AdBanner from '../components/AdBanner';

export default function Myths() {
  return (
    <div className="screen">
      <h2 className="tool-h">잘못 알려진 것들</h2>
      <p className="lead">다들 믿고 있지만 사실이 아닌 것들이에요.</p>

      {MYTHS.map((m) => (
        <div className="myth" key={m.id}>
          <div className="myth__title">{m.title}</div>
          <p className="myth__body">{m.body}</p>
        </div>
      ))}

      <AdBanner />
    </div>
  );
}
