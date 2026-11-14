import { useCallback, useEffect, useState } from 'react';
import type { AppData } from './lib/storage';
import { emptyData, loadData, saveData } from './lib/storage';
import type { Style } from './data/table';
import { useResumeToHome, useRouter } from './lib/navigation';
import Table from './screens/Table';
import Buy from './screens/Buy';
import Tips from './screens/Tips';

export default function App() {
  const { route, go, reset } = useRouter();
  const [data, setData] = useState<AppData>(emptyData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    loadData().then((d) => {
      if (!alive) return;
      setData(d);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  useResumeToHome(reset, true);

  /** 저장은 상태 갱신 함수 바깥에서 합니다. */
  const persist = useCallback((next: AppData) => {
    setData(next);
    saveData(next).catch(() => {});
  }, []);

  const setStyle = useCallback(
    (style: Style) => persist({ ...data, style }),
    [data, persist]
  );

  const toggle = useCallback(
    (id: string) => {
      const bought = data.bought.includes(id)
        ? data.bought.filter((x) => x !== id)
        : [...data.bought, id];
      persist({ ...data, bought });
    },
    [data, persist]
  );

  const resetBought = useCallback(
    () => persist({ ...data, bought: [] }),
    [data, persist]
  );

  if (!ready) return <div className="screen" aria-busy="true" />;

  return (
    <>
      {route.name === 'table' && (
        <Table data={data} onStyle={setStyle} go={go} />
      )}
      {route.name === 'buy' && (
        <Buy data={data} onToggle={toggle} onReset={resetBought} />
      )}
      {route.name === 'tips' && <Tips />}
    </>
  );
}
