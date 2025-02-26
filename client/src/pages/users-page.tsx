import { Box } from "@mui/material";
import { PageTitle } from "../components/layout/page-title";
import { UsersTable } from "../components/users-table/users-table";

export const UsersPage = () => {
  return (
    <Box>
      <PageTitle>Users</PageTitle>
      {/* TODO: add button to add user */}
      <UsersTable />
    </Box>
  );
};
