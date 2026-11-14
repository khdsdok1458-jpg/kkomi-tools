import { FACTS } from '../data/boxes';
import AdBanner from '../components/AdBanner';

export default function Know() {
  return (
    <div className="screen">
      <h2 className="tool-h">알아두면 좋은 것</h2>
      <p className="lead">몰라서 돈 더 내거나 반송되는 것들이에요.</p>

      {FACTS.map((f) => (
        <div className="fact" key={f.id}>
          <div className="fact__title">{f.title}</div>
          <p className="fact__body">{f.body}</p>
        </div>
      ))}

      <AdBanner />
    </div>
  );
}
