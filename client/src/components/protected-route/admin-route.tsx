import { PropsWithChildren } from "react";
import { useAuthContext } from "../../context/auth-context";
import { Navigate } from "react-router-dom";

export const AdminRoute = ({ children }: PropsWithChildren) => {
  const { isAdmin } = useAuthContext();

  if (!isAdmin) return <Navigate to={"/"} />;

  return <>{children}</>;
};
