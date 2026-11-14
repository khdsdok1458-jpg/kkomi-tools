import { useResumeToHome, useRouter } from './lib/navigation';
import Symbols from './screens/Symbols';
import Tips from './screens/Tips';

export default function App() {
  const { route, go, reset } = useRouter();

  // 찾아보고 끝나는 앱이라 저장할 게 없습니다.
  useResumeToHome(reset, true);

  return (
    <>
      {route.name === 'symbols' && <Symbols go={go} />}
      {route.name === 'tips' && <Tips />}
    </>
  );
}
