import { Box, Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useAuthContext } from "../../context/auth-context";

type AuthFormType = {
  username: string;
  password: string;
};

export const AuthForm = () => {
  const authContext = useAuthContext();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<AuthFormType>();

  if (!authContext) return null;

  const { login } = authContext;

  const onSubmit = (data: AuthFormType) => login(data);

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
          rules={{ required: "Password is required" }}
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Log In
        </Button>
      </Box>
    </form>
  );
};
