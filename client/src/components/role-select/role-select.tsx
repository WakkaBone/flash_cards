import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import { userRoleMapper } from "../../utils/mappers";
import { RolesExtended } from "../../models/api";
import { Roles } from "../../models/user";

export const RoleSelect = (
  props: SelectProps<RolesExtended> & { showAll?: boolean }
) => {
  const roles = Object.values(Roles) as Roles[];

  return (
    <FormControl fullWidth>
      <InputLabel id="role-select-label">Role</InputLabel>
      <Select<RolesExtended>
        labelId="role-select-label"
        id="role-select"
        {...props}
      >
        {!!props.showAll && <MenuItem value={0}>All</MenuItem>}
        {roles.map((role) => (
          <MenuItem key={role} value={role}>
            {userRoleMapper[role]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
