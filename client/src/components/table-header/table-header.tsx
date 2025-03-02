import { Stack } from "@mui/material";
import { PropsWithChildren } from "react";

export const TableHeader = ({ children }: PropsWithChildren) => (
  <Stack
    direction="row"
    gap={1}
    sx={{ mb: 1, height: "2.5em", justifyContent: "flex-end" }}
  >
    {children}
  </Stack>
);
