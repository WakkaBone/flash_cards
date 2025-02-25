import { Box } from "@mui/material";
import { CardsTable } from "../components/cards-table/cards-table";
import { PageTitle } from "../components/layout/page-title";

export const CardsPage = () => (
  <Box>
    <PageTitle>Cards</PageTitle>
    <CardsTable />
  </Box>
);
