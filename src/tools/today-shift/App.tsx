import { useCallback, useEffect, useState } from 'react';
import type { AppData } from './lib/storage';
import { emptyData, loadData, saveData } from './lib/storage';
import type { Shift } from './data/shifts';
import { useResumeToHome, useRouter } from './lib/navigation';
import Today from './screens/Today';
import Calendar from './screens/Calendar';
import Setup from './screens/Setup';

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

  // 오래 나갔다 돌아오면 오늘 화면부터 다시 봅니다.
  useResumeToHome(reset, true);

  /** 저장은 상태 갱신 함수 바깥에서 합니다. */
  const persist = useCallback(async (next: AppData) => {
    setData(next);
    await saveData(next);
  }, []);

  const setDay = useCallback(
    (date: string, shiftId: string | null) => {
      const schedule = { ...data.schedule };
      if (shiftId === null) delete schedule[date];
      else schedule[date] = shiftId;
      void persist({ ...data, schedule });
    },
    [data, persist]
  );

  const setShifts = useCallback(
    (shifts: Shift[]) => {
      void persist({ ...data, shifts });
    },
    [data, persist]
  );

  const setSchedule = useCallback(
    (schedule: Record<string, string>) => {
      void persist({ ...data, schedule });
    },
    [data, persist]
  );

  if (!ready) return <div className="screen" aria-busy="true" />;

  return (
    <>
      {route.name === 'today' && <Today data={data} go={go} />}
      {route.name === 'calendar' && (
        <Calendar data={data} onSet={setDay} go={go} />
      )}
      {route.name === 'setup' && (
        <Setup
          data={data}
          onShifts={setShifts}
          onSchedule={setSchedule}
          onDone={reset}
        />
      )}
    </>
  );
}
