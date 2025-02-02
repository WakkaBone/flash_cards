import { PropsWithChildren } from "react";
import { useAuthContext } from "../../context/auth-context";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../../constants";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const authContext = useAuthContext();
  if (!authContext) return null;

  const { isAuthenticated } = authContext;

  if (isAuthenticated !== undefined && !isAuthenticated)
    return <Navigate to={ROUTES.login} />;

  return <>{children}</>;
};
