import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const KEY = "addis.session";

// Demo sign-in: a name + valid Ethiopian phone number is enough.
// In a real app this would call an auth API and store a token.
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
  });

  useEffect(() => {
    try {
      user ? localStorage.setItem(KEY, JSON.stringify(user)) : localStorage.removeItem(KEY);
    } catch { /* ignore */ }
  }, [user]);

  const signIn = (name) => setUser({ name, signedInAt: new Date().toISOString() });
  const signOut = () => setUser(null);

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}