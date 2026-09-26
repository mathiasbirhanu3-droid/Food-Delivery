import { createContext, useContext, useEffect, useState } from "react";

const AdminAuthContext = createContext(null);
const KEY = "addis.admin.session";

// Demo credentials — in production this would call a real auth API.
const ADMIN_CREDENTIALS = { username: "admin", password: "addis123" };

// Feature 2 — session management via context + sessionStorage
// (survives a refresh in the same tab; ends when the tab closes).
export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(KEY)); } catch { return null; }
  });

  useEffect(() => {
    try {
      admin ? sessionStorage.setItem(KEY, JSON.stringify(admin)) : sessionStorage.removeItem(KEY);
    } catch { /* private mode */ }
  }, [admin]);

  // Feature 1 — username/password gate
  const login = (username, password) => {
    if (
      username.trim().toLowerCase() === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setAdmin({ username: ADMIN_CREDENTIALS.username, loggedInAt: new Date().toISOString() });
      return true;
    }
    return false;
  };

  // Feature 17 — end the session and return to /admin/login
  const logout = () => setAdmin(null);

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within <AdminAuthProvider>");
  return ctx;
}