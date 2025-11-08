import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext/AuthContextHook";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isFetchingUser, user } = useAuthContext();
  const location = useLocation();

  // Si pas d'utilisateur -> redirect login + garde l'URL actuelle
  if (!isFetchingUser && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
