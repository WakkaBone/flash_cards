import { Box, Container, CssBaseline, Drawer } from "@mui/material";
import { Outlet } from "react-router-dom";
import { NavMenu } from "./nav-menu";
import { VersionsInfo } from "./versions-info";
import { useAuthContext } from "../../context/auth-context";
import { FullScreenLoader } from "../loader/full-screen-loader";

export const Layout = () => {
  const authContext = useAuthContext();
  if (!authContext) return null;

  if (authContext.isAuthenticated === undefined) return <FullScreenLoader />;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer sx={{ width: "10vw" }} variant="permanent" anchor="left">
        <NavMenu />
      </Drawer>
      <Box
        component="main"
        sx={{
          width: "90vw",
          minHeight: "100vh",
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Container>
          <Outlet />
        </Container>
        <Box
          sx={{
            position: "fixed",
            top: "3px",
            right: "10px",
            background: "white",
            pointerEvents: "none",
          }}
        >
          <VersionsInfo />
        </Box>
      </Box>
    </Box>
  );
};
