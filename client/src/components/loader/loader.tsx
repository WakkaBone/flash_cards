import { Box, CircularProgress } from "@mui/material";

export const CenteredLoader = () => (
  <Box width={"100%"} m={3} sx={{ textAlign: "center" }}>
    <CircularProgress />
  </Box>
);
