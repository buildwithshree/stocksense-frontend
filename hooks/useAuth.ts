"use client";
import { useState, useEffect, createContext, useContext, ReactNode, createElement } from "react";
import { User } from "@/types";
import { getStoredUser, saveUser, authApi } from "@/lib/auth";
import { getAccessToken } from "@/lib/api";

interface AuthCtx {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    const token  = getAccessToken();
    if (stored && token) setUser(stored);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    saveUser(res.user);
    setUser(res.user);
  };

  const register = async (fullName: string, email: string, password: string) => {
    const res = await authApi.register(fullName, email, password);
    saveUser(res.user);
    setUser(res.user);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return createElement(AuthContext.Provider, { value: { user, isLoading, login, register, logout } }, children);
}

export const useAuth = (): AuthCtx => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
