import { useConfig } from '../context/ConfigContext';
import ComingSoonPage from '../pages/ComingSoonPage';

export default function PageGuard({ configKey, children }) {
  const config = useConfig();
  const val = config[configKey];
  const visible = val !== false && val !== 'false';

  if (!visible) return <ComingSoonPage />;
  return children;
}
