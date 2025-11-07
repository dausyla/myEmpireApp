import { createContext, useContext } from "react";
import type { AuthContextType } from "./AuthContextTypes";

export const AuthContext = createContext<AuthContextType>({
  login: () => {},
  signup: () => {},
  google: () => {},
  logout: () => {},
});

export function useAuthContext() {
  return useContext(AuthContext);
}
