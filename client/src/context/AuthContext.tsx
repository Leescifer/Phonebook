/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect } from "react";
import * as api from "../services/api.routes";
import { setAuthToken } from "../lib/apiClient";

interface AuthContextValue {
  token: string | null;
  user: any | null;
  login: (email: string, password: string) => Promise<any>;
  register: (payload: any) => Promise<any>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("phonebook-token"),
  );
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      api
        .me()
        .then((res: any) => setUser(res.data.data))
        .catch(() => {
          setUser(null);
        });
    } else {
      setAuthToken(undefined);
      setUser(null);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    const data = res.data;
    if (data.success && data.token) {
      setToken(data.token);
      localStorage.setItem("phonebook-token", data.token);
      setAuthToken(data.token);
      setUser(data.user ?? null);
    }
    return data;
  };

  const register = async (payload: any) => {
    const res = await api.register(payload);
    return res.data;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("phonebook-token");
    setAuthToken(undefined);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
