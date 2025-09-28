import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './auth';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let mounted = true;
    auth.me()
      .then(res => mounted && setUser(res.data))
      .catch(() => {}) // not logged in is fine
      .finally(() => mounted && setBooting(false));
    return () => { mounted = false; };
  }, []);

  const value = { user, setUser, booting };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
