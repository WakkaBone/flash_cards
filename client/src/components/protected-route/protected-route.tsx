import { PropsWithChildren } from "react";
import { useAuth } from "../../context/auth-context";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const authContext = useAuth();
  if (!authContext) return null;

  const { isAuthenticated } = authContext;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
};
