import { Typography } from "@mui/material";
import { PropsWithChildren } from "react";

export const PageTitle = ({ children }: PropsWithChildren) => (
  <Typography variant="h3" sx={{ mb: 2 }}>
    {children}
  </Typography>
);
