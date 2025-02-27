import { Stack, TextField } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { Roles } from "../../models/user";
import { RoleSelect } from "../role-select/role-select";

const USERNAME_PATTERN = /^[A-Za-z0-9]+$/;

export type EditUserFormType = {
  username: string;
  role: Roles;
};

type EditUserFormPropsType = {
  formProps: UseFormReturn<EditUserFormType>;
};
export const EditUserForm = ({ formProps }: EditUserFormPropsType) => {
  const {
    control,
    formState: { errors },
  } = formProps;

  return (
    <Stack spacing={2} mb={2} direction={"row"} alignItems={"start"}>
      <Controller
        name="username"
        rules={{
          required: "Username is required",
          pattern: {
            value: USERNAME_PATTERN,
            message: "Username cannot contain special characters",
          },
        }}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            required
            label="Username"
            placeholder="Username"
            error={!!errors.username}
            helperText={errors.username?.message}
          />
        )}
      />
      <Controller
        name="role"
        rules={{
          required: "Role is required",
        }}
        control={control}
        render={({ field }) => <RoleSelect {...field} error={!!errors.role} />}
      />
    </Stack>
  );
};
