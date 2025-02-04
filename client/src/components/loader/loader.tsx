import { Box, CircularProgress } from "@mui/material";

export const CenteredLoader = () => (
  <Box width={"100%"} mt={3} mb={3} sx={{ textAlign: "center" }}>
    <CircularProgress />
  </Box>
);
