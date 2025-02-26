import { Roles } from "../models/user";
import { JwtPayload } from "./jwt-util";

export const isAdmin = (user: JwtPayload) => user.role === Roles.admin;

export const getOwnershipFilter = (user: JwtPayload) =>
  isAdmin(user) ? undefined : user.id;
