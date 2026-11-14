import { useResumeToHome, useRouter } from './lib/navigation';
import Calc from './screens/Calc';
import Know from './screens/Know';

export default function App() {
  const { route, go, reset } = useRouter();

  // 그때그때 계산하고 끝나는 앱이라 저장할 게 없습니다.
  useResumeToHome(reset, true);

  return (
    <>
      {route.name === 'calc' && <Calc go={go} />}
      {route.name === 'know' && <Know />}
    </>
  );
}
