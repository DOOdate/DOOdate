import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState({ message: '', severity: 'info', open: false });

  const showFlash = (message, severity = 'info', ms = 4000) => {
    setFlash({ message, severity, open: true });
    if (ms > 0) setTimeout(() => setFlash((f) => ({ ...f, open: false })), ms);
  };

  return (
    <UIContext.Provider value={{ loading, setLoading, flash, setFlash, showFlash }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within a UIProvider');
  return ctx;
}

export default UIContext;
