import { useState, useEffect } from 'react';
import ComingSoonPage from '../pages/ComingSoonPage';

export default function PageGuard({ configKey, children }) {
  const [visible, setVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.ok ? r.json() : {})
      .then(config => {
        const val = config[configKey];
        setVisible(val !== false && val !== 'false');
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [configKey]);

  if (!loaded) return null;
  if (!visible) return <ComingSoonPage />;
  return children;
}
