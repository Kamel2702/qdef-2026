import { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext({});

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState({});

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.ok ? r.json() : {})
      .then(setConfig)
      .catch(() => {});
  }, []);

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}
