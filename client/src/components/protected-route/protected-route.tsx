import { PropsWithChildren } from "react";
import { useAuthContext } from "../../context/auth-context";
import { ROUTES } from "../../constants";
import { FullScreenLoader } from "../loader/full-screen-loader";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const authContext = useAuthContext();
  if (!authContext) return null;

  const { isAuthenticated } = authContext;

  if (isAuthenticated !== undefined && !isAuthenticated) {
    window.location.href = ROUTES.login;
    return <FullScreenLoader />;
  }

  return <>{children}</>;
};
