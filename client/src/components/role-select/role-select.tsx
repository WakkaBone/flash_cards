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
import { AllOptionString } from "../../models/shared";

export const RoleSelect = ({
  showAll,
  required,
  ...props
}: SelectProps<RolesExtended> & { showAll?: boolean; required?: boolean }) => {
  const roles = Object.values(Roles) as Roles[];

  return (
    <FormControl fullWidth>
      <InputLabel id="role-select-label">Role</InputLabel>
      <Select<RolesExtended>
        labelId="role-select-label"
        id="role-select"
        required={!!required}
        {...props}
      >
        {!!showAll && <MenuItem value={AllOptionString.All}>All</MenuItem>}
        {roles.map((role) => (
          <MenuItem key={role} value={role}>
            {userRoleMapper[role]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
