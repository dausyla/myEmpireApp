import type { User } from "../../types/AuthTypes";

export type AuthContextType = {
  login: (email: string, password: string) => void;
  signup: (email: string, password: string, username: string) => void;
  google: () => void;
  logout: () => void;
  isFetchingUser: boolean;
  user?: User; // undefined <=> not logged in
};
