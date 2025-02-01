import { PropsWithChildren } from "react";
import { useAuthContext } from "../../context/auth-context";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const authContext = useAuthContext();
  if (!authContext) return null;

  const { isAuthenticated } = authContext;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
};
