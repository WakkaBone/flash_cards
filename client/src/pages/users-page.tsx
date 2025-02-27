import { Box } from "@mui/material";
import { PageTitle } from "../components/layout/page-title";
import { UsersTable } from "../components/users-table/users-table";
import { UsersHeader } from "../components/users-header/users-header";

export const UsersPage = () => {
  return (
    <Box>
      <PageTitle>Users</PageTitle>
      <UsersHeader />
      <UsersTable />
    </Box>
  );
};
