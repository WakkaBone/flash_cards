import { Chip } from "@mui/material";
import { Roles } from "../../models/user";
import { userRoleMapper } from "../../utils/mappers";

type RoleCellPropsType = {
  role: Roles;
};
export const RoleCell = ({ role }: RoleCellPropsType) => (
  <Chip
    style={{ width: "100%" }}
    component={"span"}
    label={userRoleMapper[role] || "N/A"}
  />
);
