import { TIPS } from '../data/symbols';
import AdBanner from '../components/AdBanner';

export default function Tips() {
  return (
    <div className="screen">
      <h2 className="tool-h">옷 버리지 않는 법</h2>
      <p className="lead">기호를 몰라서 옷을 망치는 흔한 경우들이에요.</p>

      {TIPS.map((t) => (
        <div className="tip" key={t.id}>
          <div className="tip__title">{t.title}</div>
          <p className="tip__body">{t.body}</p>
        </div>
      ))}

      <AdBanner />
    </div>
  );
}
