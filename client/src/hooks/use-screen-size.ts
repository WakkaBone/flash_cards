import { useTheme, useMediaQuery } from "@mui/material";

const useScreenSize = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isPortrait = useMediaQuery("(orientation: portrait)");
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const burgerBreakpoint = useMediaQuery("(max-width: 1500px)");
  return { isMobile, isTablet, isPortrait, isLandscape, burgerBreakpoint };
};

export { useScreenSize };
