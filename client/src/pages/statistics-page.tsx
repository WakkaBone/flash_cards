import { Box } from "@mui/material";
import { PageTitle } from "../components/layout/page-title";
import { StatisticsSection } from "../components/statistics-section/statistics-section";

export const StatisticsPage = () => {
  return (
    <Box>
      <PageTitle>Statistics</PageTitle>
      <StatisticsSection />
      {/* 
      TODO: graphs: 
      -added words by days graph (aggregate via createdAt)
      -practice timeline 
      */}
    </Box>
  );
};
