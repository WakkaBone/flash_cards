import { Box } from "@mui/material";
import { CenteredLoader } from "./loader";

export const FullScreenLoader = () => (
  <Box
    alignContent="center"
    justifyContent="center"
    sx={{
      width: "100wv",
      height: "100vh",
    }}
  >
    <CenteredLoader />
  </Box>
);
