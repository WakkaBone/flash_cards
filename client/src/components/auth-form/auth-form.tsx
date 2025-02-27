import { Box, Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useAuthContext } from "../../context/auth-context";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

type AuthFormType = {
  username: string;
  password: string;
};

type AuthFormPropsType = {
  mode: "login" | "register";
};
export const AuthForm = ({ mode }: AuthFormPropsType) => {
  const { login, signup, isLoading } = useAuthContext();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<AuthFormType>();

  const isLogin = mode === "login";

  const onSubmit = (data: AuthFormType) =>
    isLogin ? login(data) : signup(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ marginBottom: 2 }}>
        <Controller
          name="username"
          rules={{ required: "Username is required" }}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Username"
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          )}
        />
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Controller
          name="password"
          rules={{
            required: "Password is required",
            pattern: {
              value: PASSWORD_REGEX,
              message:
                "Password must be at least 8 characters long, include at least one uppercase letter and one special character.",
            },
          }}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              type="password"
              placeholder="Password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          loading={isLoading}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          {isLogin ? "Log In" : "Sign Up"}
        </Button>
      </Box>
    </form>
  );
};
