import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import { priorityMapper } from "../../utils/mappers";
import { Priorities } from "../../models/card";

export const PrioritySelect = (props: SelectProps) => {
  const priorities = Object.values(Priorities).filter(
    (key) => !isNaN(Number(key))
  ) as Priorities[];

  return (
    <FormControl fullWidth>
      <InputLabel id="priority-select-label">Priority</InputLabel>
      <Select labelId="priority-select-label" id="priority-select" {...props}>
        {priorities.map((priority) => (
          <MenuItem key={priority} value={priority}>
            {priorityMapper[priority]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
