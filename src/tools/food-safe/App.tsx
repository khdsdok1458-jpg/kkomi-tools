import { useResumeToHome, useRouter } from './lib/navigation';
import Check from './screens/Check';
import Know from './screens/Know';

export default function App() {
  const { route, go, reset } = useRouter();

  // 그때그때 확인하고 끝나는 앱이라 저장할 게 없습니다.
  useResumeToHome(reset, true);

  return (
    <>
      {route.name === 'check' && <Check go={go} />}
      {route.name === 'know' && <Know />}
    </>
  );
}
