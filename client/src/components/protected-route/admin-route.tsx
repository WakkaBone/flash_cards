import { PropsWithChildren } from "react";
import { useAuthContext } from "../../context/auth-context";
import { Roles } from "../../models/user";
import { Navigate } from "react-router-dom";

export const AdminRoute = ({ children }: PropsWithChildren) => {
  const { user } = useAuthContext();

  if (!user || user.role !== Roles.admin) return <Navigate to={"/"} />;

  return <>{children}</>;
};
