import { api, setTokens, clearTokens } from "./api";
import { AuthResponse, User } from "@/types";

export const authApi = {
  register: async (fullName: string, email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/api/auth/register", { fullName, email, password });
    setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/api/auth/login", { email, password });
    setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  logout: async (): Promise<void> => {
    try { await api.post("/api/auth/logout"); } catch {}
    clearTokens();
    if (typeof window !== "undefined") {
      localStorage.removeItem("ss_user");
      window.location.href = "/auth/login";
    }
  },
};

export const saveUser = (user: User) => {
  if (typeof window !== "undefined") localStorage.setItem("ss_user", JSON.stringify(user));
};

export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem("ss_user") ?? "null"); } catch { return null; }
};
