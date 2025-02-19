import { Box } from "@mui/material";
import { PageTitle } from "../components/layout/page-title";
import { CategoriesTable } from "../components/categories-table/categories-table";
import { CategoriesHeader } from "../components/categories-header/categories-header";

export const CategoriesPage = () => {
  return (
    <Box>
      <PageTitle>Categories</PageTitle>
      <CategoriesHeader />
      <CategoriesTable />
    </Box>
  );
};
