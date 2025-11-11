import { useEffect, type ReactNode } from "react";
import { useAuthContext } from "../contexts/AuthContext/AuthContextHook";
import { useNavigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isFetchingUser, user } = useAuthContext();
  const nav = useNavigate();

  // Si pas d'utilisateur -> redirect login + garde l'URL actuelle
  useEffect(() => {
    if (!isFetchingUser && !user) {
      nav("/login");
    }
  }, [isFetchingUser, user]);

  return <>{children}</>;
};
