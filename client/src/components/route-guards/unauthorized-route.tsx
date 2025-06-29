import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth-context";
import { FullScreenLoader } from "../loader/full-screen-loader";
import { PropsWithChildren } from "react";

export const UnauthorizedRoute = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated === undefined) return <FullScreenLoader />;

  if (isAuthenticated) return <Navigate to="/" />;

  return <>{children}</>;
};
