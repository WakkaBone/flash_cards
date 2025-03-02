import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import { statisticsActionMapper } from "../../utils/mappers";
import { StatisticsActionTypeExtended } from "../../hooks/use-practice-timeline-filters";
import { STATISTICS_ACTIONS } from "../../models/api";
import { AllOptionString } from "../../models/shared";

export const StatisticsActionsSelect = (
  props: SelectProps<StatisticsActionTypeExtended>
) => {
  const actions = Object.values(STATISTICS_ACTIONS) as STATISTICS_ACTIONS[];

  return (
    <FormControl fullWidth>
      <InputLabel id="statistics-actions-select-label">Action</InputLabel>
      <Select
        labelId="statistics-actions-select-label"
        id="statistics-actions-select"
        {...props}
      >
        <MenuItem key={"all"} value={AllOptionString.All}>
          All
        </MenuItem>
        {actions.map((action) => (
          <MenuItem key={action} value={action}>
            {statisticsActionMapper[action as STATISTICS_ACTIONS]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
