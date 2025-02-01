import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import { PracticeModes } from "../../pages/practice-page";
import { practiceModeMapper } from "../../utils/mappers";

export const PracticeModeSelect = (props: SelectProps) => {
  const modes = Object.values(PracticeModes).filter(
    (key) => !isNaN(Number(key))
  ) as PracticeModes[];

  return (
    <FormControl fullWidth>
      <InputLabel id="mode-select-label">Modes</InputLabel>
      <Select labelId="mode-select-label" id="mode-select" {...props}>
        {modes.map((mode) => (
          <MenuItem key={mode} value={mode}>
            {practiceModeMapper[mode]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
