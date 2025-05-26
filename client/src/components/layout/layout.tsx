import { Box, CssBaseline, Drawer } from "@mui/material";
import { Outlet } from "react-router-dom";
import { BurgerMenu } from "./nav-menu";
import { VersionsInfo } from "./versions-info";
import { useAuthContext } from "../../context/auth-context";
import { FullScreenLoader } from "../loader/full-screen-loader";
import { useScreenSize } from "../../hooks";

export const Layout = () => {
  const { isMobile } = useScreenSize();
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated === undefined) return <FullScreenLoader />;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" anchor="left" sx={{ width: "5vw" }}>
        <BurgerMenu />
      </Drawer>
      <Box
        component="main"
        sx={{
          width: "90vw",
          minHeight: "100vh",
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          pt: isMobile ? 1.5 : 3,
          ml: 2,
        }}
      >
        <Box>
          <Outlet />
        </Box>
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
