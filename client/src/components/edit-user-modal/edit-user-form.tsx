import { Stack, TextField } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { Roles } from "../../models/user";
import { RoleSelect } from "../role-select/role-select";
import { useEffect } from "react";
import { usernameValidator } from "../../utils/validators";

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
    reset,
  } = formProps;

  useEffect(() => {
    return () => reset();
  }, [reset]);

  return (
    <Stack spacing={2} mb={2} direction={"row"} alignItems={"start"}>
      <Controller
        name="username"
        rules={{
          required: "Username is required",
          ...usernameValidator,
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
        render={({ field }) => (
          <RoleSelect {...field} required error={!!errors.role} />
        )}
      />
    </Stack>
  );
};
