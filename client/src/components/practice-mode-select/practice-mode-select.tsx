import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import { PracticeModes } from "../../models/practice-mode";
import { practiceModeMapper } from "../../utils/mappers";
import { usePracticeContext } from "../../context/practice-context";

export const PracticeModeSelect = (props: SelectProps) => {
  const {
    practiceModeState: { practiceMode, handleChangePracticeMode },
  } = usePracticeContext();

  const modes = Object.values(PracticeModes).filter(
    (key) => !isNaN(Number(key))
  ) as PracticeModes[];

  return (
    <FormControl fullWidth>
      <InputLabel id="mode-select-label">Modes</InputLabel>
      <Select
        labelId="mode-select-label"
        id="mode-select"
        {...props}
        value={practiceMode}
        onChange={handleChangePracticeMode}
      >
        {modes.map((mode) => (
          <MenuItem key={mode} value={mode}>
            {practiceModeMapper[mode]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
