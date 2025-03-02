import { Box, Container, Paper, Typography } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { AuthForm } from "../components/auth-form/auth-form";
import { VersionsInfo } from "../components/layout/versions-info";

export const SignupPage = () => (
  <Container component="main" maxWidth="xs" sx={{ marginTop: 8 }}>
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography
        variant="h5"
        component="h1"
        align="center"
        sx={{ marginBottom: 2 }}
      >
        Sign up
      </Typography>
      <AuthForm mode="register" />
      <Box mt={3} />
      <VersionsInfo />
    </Paper>
    <ToastContainer />
  </Container>
);
