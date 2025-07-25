import { Box } from "@mui/material";
import { useState } from "react";
import { GetCardDynamicsFilters } from "../../models/filters";
import { useDynamicsCharts } from "../../hooks";
import { Line } from "react-chartjs-2";
import { CardsDynamicsFilters } from "./cards-dynamics-filters";
import { AllOptionInt } from "../../models/shared";
import { getOneWeekTimeRange } from "../../utils/date-time";

export const getCardsDynamicChartDefaultFilters =
  (): GetCardDynamicsFilters => ({
    ...getOneWeekTimeRange(),
    priority: AllOptionInt.All,
  });

export const CardsDynamics = () => {
  const [filters, setFilters] = useState<GetCardDynamicsFilters>(
    getCardsDynamicChartDefaultFilters()
  );

  const {
    cardsDynamics: { chartData, chartOptions, chartStyles, plugins },
  } = useDynamicsCharts({ cardsDynamicsFilters: filters });

  return (
    <Box>
      <CardsDynamicsFilters filters={filters} onChange={setFilters} />
      <Line
        data={chartData}
        options={chartOptions}
        style={chartStyles}
        plugins={plugins}
      />
    </Box>
  );
};
