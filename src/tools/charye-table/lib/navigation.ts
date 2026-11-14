import { useCallback, useEffect, useRef, useState } from 'react';

export type Route =
  | { name: 'table' }
  | { name: 'buy' }
  | { name: 'tips' };

const HOME: Route = { name: 'table' };

interface HistoryState {
  route: Route;
  depth: number;
}

/**
 * 화면 이동을 history에 쌓습니다.
 *
 * 토스 내비게이션 바의 뒤로가기와 안드로이드 시스템 백버튼이 우리 화면 스택을
 * 그대로 따라옵니다. 자체 뒤로가기 버튼을 따로 만들지 않으니 "토스 뒤로가기와
 * 자체 뒤로가기가 동시에 보이면 안 된다"는 검수 항목에 걸리지 않고,
 * 홈에서 한 번 더 뒤로가면 미니앱이 종료됩니다.
 */
export function useRouter() {
  const [route, setRoute] = useState<Route>(HOME);
  const depth = useRef(0);

  useEffect(() => {
    const initial: HistoryState = { route: HOME, depth: 0 };
    window.history.replaceState(initial, '');

    const onPop = (e: PopStateEvent) => {
      const state = e.state as HistoryState | null;
      depth.current = state?.depth ?? 0;
      setRoute(state?.route ?? HOME);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const go = useCallback((next: Route) => {
    depth.current += 1;
    const state: HistoryState = { route: next, depth: depth.current };
    window.history.pushState(state, '');
    setRoute(next);
    window.scrollTo(0, 0);
  }, []);

  /**
   * 저장을 마치고 홈으로 갈 때 씁니다.
   *
   * replaceState만 쓰면 쌓인 항목이 그대로 남아서, 홈에서 뒤로가기를 눌렀을 때
   * 방금 저장한 입력 화면이 다시 뜹니다. 쌓은 만큼 되감아야 합니다.
   */
  const reset = useCallback(() => {
    if (depth.current > 0) {
      // popstate가 뒤이어 발생하면서 화면과 depth가 함께 홈으로 돌아옵니다.
      window.history.go(-depth.current);
      return;
    }
    setRoute(HOME);
    window.scrollTo(0, 0);
  }, []);

  return { route, go, reset };
}

/**
 * 토스는 미니앱을 닫아도 웹뷰를 메모리에 살려둡니다. X를 눌러 나갔다가 며칠 뒤
 * 다시 열면 마지막에 보던 화면이 그대로 뜹니다.
 *
 * 화면이 가려져 있던 시간을 재서 오래 떠나 있었으면 홈으로 되돌립니다.
 * 타이머가 도는 게 아니라, 돌아온 순간에 한 번 계산합니다. 앱을 켜둔 채로
 * 가만히 있는 동안에는 아무 일도 일어나지 않습니다.
 *
 * enabled가 false면 되돌리지 않습니다. 입력하던 내용이 날아가면 안 되는
 * 화면에서 끕니다.
 */
export function useResumeToHome(
  onResume: () => void,
  enabled: boolean,
  idleMs = 60_000
) {
  const hiddenAt = useRef<number | null>(null);
  const handler = useRef(onResume);
  const on = useRef(enabled);
  handler.current = onResume;
  on.current = enabled;

  useEffect(() => {
    const onChange = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAt.current = Date.now();
        return;
      }
      const since = hiddenAt.current;
      hiddenAt.current = null;
      if (!on.current) return;
      if (since !== null && Date.now() - since > idleMs) {
        handler.current();
      }
    };

    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, [idleMs]);
}
