import { Stack, TextField } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { Roles } from "../../models/user";
import { RoleSelect } from "../role-select/role-select";
import { useEffect } from "react";
import { useScreenSize } from "../../hooks";
import { passwordValidator, usernameValidator } from "../../utils/validators";

export type AddUserFormType = {
  username: string;
  password: string;
  role: Roles;
};

type AddUserFormPropsType = {
  formProps: UseFormReturn<AddUserFormType>;
};
export const AddUserForm = ({ formProps }: AddUserFormPropsType) => {
  const { isMobile } = useScreenSize();
  const {
    control,
    formState: { errors },
    reset,
  } = formProps;

  useEffect(() => {
    return () => reset();
  }, [reset]);

  return (
    <Stack spacing={2} mb={2} direction={isMobile ? "column" : "row"}>
      <Stack direction="row" spacing={2} flex={isMobile ? 1 : 2}>
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
          name="password"
          rules={{
            required: "Password is required",
            ...passwordValidator,
          }}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              required
              label="Password"
              placeholder="Password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />
      </Stack>
      <Stack direction="row" spacing={2} flex={1}>
        <Controller
          name="role"
          rules={{
            required: "Role is required",
          }}
          control={control}
          render={({ field }) => (
            <RoleSelect {...field} fullWidth required error={!!errors.role} />
          )}
        />
      </Stack>
    </Stack>
  );
};
