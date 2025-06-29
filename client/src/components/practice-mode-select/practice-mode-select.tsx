import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
} from "@mui/material";
import { PracticeModes } from "../../models/practice-mode";
import { practiceModeMapper } from "../../utils/mappers";
import { useTimerContext } from "../../context/timer-context";

export const PracticeModeSelect = (props: SelectProps) => {
  const modes = Object.values(PracticeModes).filter(
    (key) => !isNaN(Number(key))
  ) as PracticeModes[];

  const { handleStopTimer } = useTimerContext();

  const handleChangePracticeMode = (
    e: SelectChangeEvent<unknown>,
    child: React.ReactNode
  ) => {
    props?.onChange?.(e, child);
    handleStopTimer();
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="mode-select-label">Modes</InputLabel>
      <Select
        labelId="mode-select-label"
        id="mode-select"
        {...props}
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
