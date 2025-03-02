import { Box } from "@mui/material";
import { CardsTable } from "../components/cards-table/cards-table";
import { PageTitle } from "../components/layout/page-title";
import { CardsHeader } from "../components/cards-header/cards-header";

export const CardsPage = () => (
  <Box>
    <PageTitle>Cards</PageTitle>
    <CardsHeader />
    <CardsTable />
  </Box>
);
