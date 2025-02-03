import { Box, Container, CssBaseline, Drawer } from "@mui/material";
import { Outlet } from "react-router-dom";
import { NavMenu } from "./nav-menu";
import { VersionsInfo } from "./versions-info";

export const Layout = () => (
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
