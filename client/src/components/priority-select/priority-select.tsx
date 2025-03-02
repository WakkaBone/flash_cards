import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import { priorityMapper } from "../../utils/mappers";
import { Priorities } from "../../models/card";
import { PrioritiesExtended } from "../../models/api";
import { AllOptionInt } from "../../models/shared";

export const PrioritySelect = (
  props: SelectProps<PrioritiesExtended> & { showAll?: boolean }
) => {
  const priorities = Object.values(Priorities).filter(
    (key) => !isNaN(Number(key))
  ) as Priorities[];

  return (
    <FormControl fullWidth>
      <InputLabel id="priority-select-label">Priority</InputLabel>
      <Select<PrioritiesExtended>
        labelId="priority-select-label"
        id="priority-select"
        {...props}
      >
        {!!props.showAll && <MenuItem value={AllOptionInt.All}>All</MenuItem>}
        {priorities.map((priority) => (
          <MenuItem key={priority} value={priority}>
            {priorityMapper[priority]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
