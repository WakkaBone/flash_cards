import { Stack, TextField } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { Roles } from "../../models/user";
import { RoleSelect } from "../role-select/role-select";
import { useEffect } from "react";
import { useScreenSize } from "../../hooks";

const USERNAME_RULES = /^[A-Za-z0-9]+$/;
const PASSWORD_RULES =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~\-]{8,}$/;

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
            pattern: {
              value: USERNAME_RULES,
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
          name="password"
          rules={{
            required: "Password is required",
            pattern: {
              value: PASSWORD_RULES,
              message:
                "Password must be no less than 8 characters and contain both letters and numbers",
            },
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
