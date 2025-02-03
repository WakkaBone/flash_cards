import { Box, Container, Paper, Typography } from "@mui/material";
import { useAuthContext } from "../context/auth-context";
import { ToastContainer } from "react-toastify";
import { Navigate } from "react-router-dom";
import { AuthForm } from "../components/auth-form/auth-form";
import { VersionsInfo } from "../components/layout/versions-info";

export const AuthPage = () => {
  const authContext = useAuthContext();
  if (!authContext) return null;

  const { isAuthenticated } = authContext;
  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 8 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography
          variant="h5"
          component="h1"
          align="center"
          sx={{ marginBottom: 2 }}
        >
          Login
        </Typography>
        <AuthForm />
        <Box mt={3} />
        <VersionsInfo />
      </Paper>
      <ToastContainer />
    </Container>
  );
};
