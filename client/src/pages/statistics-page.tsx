import { Box } from "@mui/material";
import { PageTitle } from "../components/layout/page-title";
import { StatisticsSection } from "../components/statistics-section/statistics-section";
import { PracticeTimeline } from "../components/practice-timeline/practice-timeline";

export const StatisticsPage = () => {
  return (
    <Box>
      <PageTitle>Statistics</PageTitle>
      <StatisticsSection />
      <PracticeTimeline />
      {/* TODO: graph: added words by days graph (aggregate via createdAt) */}
    </Box>
  );
};
