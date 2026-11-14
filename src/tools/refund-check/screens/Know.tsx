import { FACTS } from '../data/rules';
import AdBanner from '../components/AdBanner';

export default function Know() {
  return (
    <div className="screen">
      <h2 className="tool-h">알아두면 좋은 것</h2>
      <p className="lead">
        판매자가 안 된다고 해도 법이 그렇지 않은 경우가 많습니다.
      </p>

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
