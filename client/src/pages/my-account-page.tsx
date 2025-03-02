import { Box } from "@mui/material";
import { PageTitle } from "../components/layout/page-title";
import { MyAccountCard } from "../components/my-account/my-account-card";

export const MyAccountPage = () => (
  <Box>
    <PageTitle>My Account</PageTitle>
    <MyAccountCard />
  </Box>
);
