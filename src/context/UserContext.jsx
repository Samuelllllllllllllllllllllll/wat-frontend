//src/context/UserContext.jsx

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch, setUnauthorizedHandler } from "../lib/api";

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  // `loading` is true until we know whether a valid session cookie exists
  const [loading, setLoading] = useState(true);

  // Restore the session on page load / refresh (cookie is httpOnly, so ask the API)
  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/user")
      .then((u) => !cancelled && setUser(u))
      .catch(() => !cancelled && setUser(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // Any 401 from the API means the session is gone -> show the login page
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = useCallback(async (identifier, password) => {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: { identifier, password },
    });
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, isTeacher: user?.role === "Teacher", isStudent: user?.role === "Student" }),
    [user, loading, login, logout],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
