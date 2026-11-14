import { TIPS } from '../data/table';
import AdBanner from '../components/AdBanner';

export default function Tips() {
  return (
    <div className="screen">
      <h2 className="tool-h">헷갈리는 것들</h2>
      <p className="lead">상 앞에 서면 진짜로 막히는 것들이에요.</p>

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
