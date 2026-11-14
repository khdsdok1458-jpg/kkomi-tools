import { useResumeToHome, useRouter } from './lib/navigation';
import Ask from './screens/Ask';
import Know from './screens/Know';

export default function App() {
  const { route, go, reset } = useRouter();

  // 답을 저장하지 않습니다. 매번 새 상황이라 남겨둘 이유가 없습니다.
  useResumeToHome(reset, true);

  return (
    <>
      {route.name === 'ask' && <Ask go={go} />}
      {route.name === 'know' && <Know />}
    </>
  );
}
