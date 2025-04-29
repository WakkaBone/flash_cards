import { Button, Stack, TextField } from "@mui/material";
import { Controller, UseFormReturn, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { useScreenSize } from "../../hooks";
import { passwordValidator, usernameValidator } from "../../utils/validators";

export type MyAccountFormType = {
  username: string;
  oldPassword: string;
  confirmPassword: string;
  newPassword: string;
};

type AuthFormPropsType = {
  isEdit: boolean;
  form: UseFormReturn<MyAccountFormType>;
  isLoading: boolean;
  changePassword: boolean;
  setChangePassword: (val: boolean) => void;
};
export const MyAccountForm = ({
  isEdit,
  form,
  isLoading,
  changePassword,
  setChangePassword,
}: AuthFormPropsType) => {
  const { isMobile } = useScreenSize();

  const {
    control,
    setValue,
    formState: { errors },
  } = form;

  const newPassword = useWatch<MyAccountFormType>({ control }).newPassword;

  useEffect(() => {
    if (changePassword) return;
    setValue("newPassword", "");
    setValue("confirmPassword", "");
    setValue("oldPassword", "");
  }, [changePassword, setValue]);

  return (
    <form>
      <Stack direction={isMobile ? "column" : "row"} spacing={2} mb={2}>
        <Controller
          name="username"
          rules={{ required: "Username is required", ...usernameValidator }}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Username"
              placeholder="Username"
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          )}
        />
        <TextField
          disabled
          type="password"
          label="Password"
          value={[...Array(8)]
            .map(() =>
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
                Math.floor(Math.random() * 62)
              )
            )
            .join("")}
        />
      </Stack>
      {changePassword && (
        <Stack direction={isMobile ? "column" : "row"} spacing={1} mt={4}>
          <Controller
            name="oldPassword"
            control={control}
            rules={{
              required: "Old password is required",
              ...passwordValidator,
            }}
            render={({ field }) => (
              <TextField
                {...field}
                disabled={!changePassword || !isEdit}
                type="password"
                label="Old password"
                placeholder="Enter your old password"
                error={!!errors.oldPassword}
                helperText={errors.oldPassword?.message}
              />
            )}
          />
          <Controller
            name="newPassword"
            control={control}
            rules={{
              required: "New password is required",
              ...passwordValidator,
            }}
            render={({ field }) => (
              <TextField
                {...field}
                disabled={!changePassword || !isEdit}
                type="password"
                label="New password"
                placeholder="Enter your new password"
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Confirmation is required",
              ...passwordValidator,
              validate: (value) =>
                changePassword
                  ? value === newPassword || "Passwords do not match"
                  : true,
            }}
            render={({ field }) => (
              <TextField
                {...field}
                disabled={!changePassword || !isEdit}
                type="password"
                label="Confirm the new password"
                placeholder="Confirm the new password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            )}
          />
        </Stack>
      )}
      <Button
        sx={{ marginTop: 2 }}
        variant="contained"
        loading={isLoading}
        disabled={!isEdit || isLoading}
        color={changePassword ? "error" : "primary"}
        onClick={() => setChangePassword(!changePassword)}
      >
        {changePassword ? "Cancel" : "Change Password"}
      </Button>
    </form>
  );
};
