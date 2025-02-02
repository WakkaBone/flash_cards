import { Box, Container, CssBaseline, Drawer } from "@mui/material";
import { Outlet } from "react-router-dom";
import { NavMenu } from "./nav-menu";

export const Layout = () => (
  <Box sx={{ display: "flex" }}>
    <CssBaseline />
    <Drawer
      sx={{
        width: "10vw",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          position: "fixed",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <NavMenu />
    </Drawer>
    <Box
      component="main"
      sx={{
        width: "90vw",
        flexGrow: 1,
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Container>
        <Outlet />
      </Container>
    </Box>
  </Box>
);
