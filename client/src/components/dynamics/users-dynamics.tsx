import { Box } from "@mui/material";
import { useState } from "react";
import { useDynamicsCharts } from "../../hooks";
import { Line } from "react-chartjs-2";
import { UsersDynamicsFilters } from "./users-dynamics-filters";
import { getOneWeekTimeRange } from "../../utils/date-time";
import { GetUserDynamicsFilters } from "../../models/filters";
import { AllOptionString } from "../../models/shared";

export const getUsersDynamicChartDefaultFilters =
  (): GetUserDynamicsFilters => ({
    ...getOneWeekTimeRange(),
    role: AllOptionString.All,
  });

export const UsersDynamics = () => {
  const [filters, setFilters] = useState<GetUserDynamicsFilters>(
    getUsersDynamicChartDefaultFilters()
  );

  const {
    usersDynamics: { chartData, chartOptions, chartStyles, plugins },
  } = useDynamicsCharts({ usersDynamicsFilters: filters });

  return (
    <Box>
      <UsersDynamicsFilters filters={filters} onChange={setFilters} />
      <Line
        data={chartData}
        options={chartOptions}
        style={chartStyles}
        plugins={plugins}
      />
    </Box>
  );
};
