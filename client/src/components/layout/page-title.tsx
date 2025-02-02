import { Typography } from "@mui/material";
import { PropsWithChildren } from "react";
import { useScreenSize } from "../../hooks";

export const PageTitle = ({ children }: PropsWithChildren) => {
  const { isMobile } = useScreenSize();
  return (
    <Typography variant={isMobile ? "h4" : "h3"} sx={{ mb: 3 }}>
      {children}
    </Typography>
  );
};
