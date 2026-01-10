import { useEffect, useState, type ReactNode } from "react";
import type { User } from "../../types/AuthTypes";
import { AuthContext } from "./AuthContextHook";
import { ENDPOINTS } from "../../utilies/api/endpoints";
import { api } from "../../utilies/api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isFetchingUser, setFetchingUser] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    api<User>(ENDPOINTS.AUTH.ME, "GET")
      .then(setUser)
      .catch((e) => {
        toast.error(e);
        navigate("/login");
      })
      .finally(() => setFetchingUser(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await api<{ token: string; user: User }>(
        ENDPOINTS.AUTH.LOGIN,
        "POST",
        { email, password },
      );

      localStorage.setItem("token", data.token);
      setUser(data.user as User);
      navigate("/select-wallet");
    } catch (e) {
      console.log(e);
    }
  };
  const signup = async (email: string, password: string, username: string) => {
    try {
      const data = await api<{ token: string; user: User }>(
        ENDPOINTS.AUTH.SIGNUP,
        "POST",
        { email, password, username },
      );

      localStorage.setItem("token", data.token);
      setUser(data.user as User);
      navigate("/select-wallet");
    } catch (e) {
      console.log(e);
    }
  };

  const google = () => {};

  const logout = async () => {
    try {
      await api(ENDPOINTS.AUTH.LOGOUT, "POST");
      localStorage.removeItem("token");
      setUser(undefined);
      navigate("/login");
    } catch (e) {
      console.log(e);
      // Even if API fails, we should probably clear local state
      localStorage.removeItem("token");
      setUser(undefined);
      navigate("/login");
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
        isFetchingUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
