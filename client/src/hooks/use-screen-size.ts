import { useTheme, useMediaQuery } from "@mui/material";

const useScreenSize = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isPortrait = useMediaQuery("(orientation: portrait)");
  const isLandscape = useMediaQuery("(orientation: landscape)");

  return { isMobile, isTablet, isPortrait, isLandscape };
};

export { useScreenSize };
