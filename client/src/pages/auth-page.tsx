import { Box, Container, Paper, Typography } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { AuthForm } from "../components/auth-form/auth-form";
import { VersionsInfo } from "../components/layout/versions-info";
import { ROUTES } from "../constants";

export const AuthPage = () => (
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
      <AuthForm mode="login" />
      <Box mt={3} />
      <Typography
        variant="subtitle2"
        sx={{
          textAlign: "center",
          "& .link": {
            textDecoration: "none",
            color: "primary.main",
            fontWeight: "bold",
            "&:hover": {
              textDecoration: "underline",
            },
          },
        }}
      >
        Do not have an account?{" "}
        <Link to={ROUTES.signup} className="link">
          Sign up
        </Link>
      </Typography>
      <Box mt={3} />
      <VersionsInfo />
    </Paper>
    <ToastContainer />
  </Container>
);
