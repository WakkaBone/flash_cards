import { Box } from "@mui/material";
import { PageTitle } from "../components/layout/page-title";
import { StatisticsSection } from "../components/statistics-section/statistics-section";
import { PracticeTimeline } from "../components/practice-timeline/practice-timeline";
import { useAuthContext } from "../context/auth-context";
import { AdminStatisticsSection } from "../components/statistics-section/admin-statistics-section";
import { Dynamics } from "../components/dynamics/dynamics";

export const StatisticsPage = () => {
  const { isAdmin } = useAuthContext();

  return (
    <Box>
      <PageTitle>Statistics</PageTitle>
      <StatisticsSection />
      <PracticeTimeline />
      {!isAdmin ? null : (
        <>
          <Box mb={5} />
          <AdminStatisticsSection />
          <Dynamics />
        </>
      )}
    </Box>
  );
};
