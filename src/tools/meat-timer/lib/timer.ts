import { useEffect, useRef, useState } from 'react';

/**
 * 흐른 초를 세는 타이머.
 *
 * setInterval로 1씩 더하면 안 됩니다. 화면이 가려지면 브라우저가 타이머를
 * 늦추거나 멈춰서 실제 시간과 어긋납니다. 고기가 타는 앱에서는 치명적입니다.
 * 시작 시각을 기억해두고 매번 현재 시각과의 차이를 씁니다.
 */
export function useElapsed(running: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);
  const carried = useRef(0);

  useEffect(() => {
    if (!running) {
      if (startedAt.current !== null) {
        carried.current += (Date.now() - startedAt.current) / 1000;
        startedAt.current = null;
      }
      return;
    }
    startedAt.current = Date.now();
    const tick = () => {
      const base = startedAt.current === null ? 0 : (Date.now() - startedAt.current) / 1000;
      setElapsed(carried.current + base);
    };
    tick();
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, [running]);

  function reset() {
    startedAt.current = null;
    carried.current = 0;
    setElapsed(0);
  }

  return { elapsed, reset };
}
