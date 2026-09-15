/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";
import * as api from "../services/api.routes";
import { setAuthToken } from "../lib/apiClient";
import type { User } from "../types/types";

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
}

interface AuthContextValue {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (payload: Record<string, string>) => Promise<AuthResponse>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("phonebook-token"),
  );
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      api
        .me()
        .then((res) => setUser(res as unknown as User)) // ✅ cast through unknown
        .catch(() => setUser(null));
    } else {
      setAuthToken(undefined);
      setUser(null);
    }
  }, [token]);

  const login = async (
    email: string,
    password: string,
  ): Promise<LoginResponse> => {
    const data = (await api.login({
      email,
      password,
    })) as unknown as LoginResponse; // ✅ cast through unknown
    if (data.success && data.token) {
      setToken(data.token);
      localStorage.setItem("phonebook-token", data.token);
      setAuthToken(data.token);
      setUser(data.user ?? null);
    }
    return data;
  };

  const register = async (
    payload: Record<string, string>,
  ): Promise<AuthResponse> => {
    return (await api.register(payload)) as unknown as AuthResponse; // ✅ cast through unknown
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
