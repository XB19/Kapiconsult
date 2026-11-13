import { createContext, useContext, useState, useCallback } from 'react';

const AuthCtx = createContext(null);
const KEY = 'kapi_auth';

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; }
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(load);
  const login = useCallback((data) => {
    setAuth(data);
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* stockage indisponible */ }
  }, []);
  const logout = useCallback(() => {
    setAuth(null);
    try { localStorage.removeItem(KEY); } catch { /* stockage indisponible */ }
  }, []);
  return <AuthCtx.Provider value={{ user: auth?.user, token: auth?.token, login, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
