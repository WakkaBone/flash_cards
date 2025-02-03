import { Box } from "@mui/material";
import { CardsTable } from "../components/cards-table/cards-table";
import { PageTitle } from "../components/layout/page-title";
import { StatisticsSection } from "../components/statistics-section/statistics-section";

export const CardsPage = () => (
  <Box>
    <PageTitle>Cards</PageTitle>
    <StatisticsSection />
    <CardsTable />
  </Box>
);
