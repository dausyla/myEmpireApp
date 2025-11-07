import { useEffect, useState, type ReactNode } from "react";
import type { User } from "../../types/AuthTypes";
import { AuthContext } from "./AuthContextHook";
import { ENDPOINTS } from "../../utilies/api/endpoints";
import { api } from "../../utilies/api/api";
import { useNavigate } from "react-router-dom";

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionnel : valider le token via /me
      fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then(setUser);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await api<{ token: string; user: User }>(
        ENDPOINTS.AUTH.LOGIN,
        { method: "POST", body: JSON.stringify({ email, password }) },
      );

      localStorage.setItem("token", data.token);
      setUser(data.user as User);
      navigate("/app");
    } catch (e) {
      console.log(e);
    }
  };
  const signup = async (email: string, password: string, username: string) => {
    try {
      const data = await api<{ token: string; user: User }>(
        ENDPOINTS.AUTH.SIGNUP,
        { body: JSON.stringify({ email, password, username }) },
      );

      localStorage.setItem("token", data.token);
      setUser(data.user as User);
      navigate("/app");
    } catch (e) {
      console.log(e);
    }
  };

  const google = () => {};

  const logout = async (email: string, password: string) => {
    try {
      const data = await api<{ token: string; user: User }>(
        ENDPOINTS.AUTH.LOGOUT,
        { body: JSON.stringify({ email, password }) },
      );

      localStorage.setItem("token", data.token);
      setUser(data.user as User);
      navigate("/app");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        signup,
        google,
        logout,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
