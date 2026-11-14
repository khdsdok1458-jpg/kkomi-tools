import { useRouter } from './lib/navigation';
import Pick from './screens/Pick';
import Myths from './screens/Myths';

export default function App() {
  const { route, go } = useRouter();

  // 굽는 중에 화면이 초기화되면 안 되므로 재진입 리셋을 쓰지 않습니다.
  return (
    <>
      {route.name === 'pick' && <Pick go={go} />}
      {route.name === 'myth' && <Myths />}
    </>
  );
}
