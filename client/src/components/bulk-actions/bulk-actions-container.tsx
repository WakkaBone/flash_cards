import { Box, Stack } from "@mui/material";
import { PropsWithChildren } from "react";

type BulkActionsContainerPropsType = {
  numberOfItems: number;
};
export const BulkActionsContainer = ({
  children,
  numberOfItems,
}: PropsWithChildren<BulkActionsContainerPropsType>) => (
  <Stack
    direction={"row"}
    justifyContent={"space-between"}
    alignItems={"center"}
    sx={{ m: "15px 10px 5px 10px" }}
  >
    <Box>
      {numberOfItems} item{numberOfItems > 1 ? "s" : ""} selected
    </Box>
    <Stack direction={"row"} spacing={2}>
      {children}
    </Stack>
  </Stack>
);
