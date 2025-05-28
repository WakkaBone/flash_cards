import { TextField, Tooltip } from "@mui/material";
import { useScreenSize } from "../../hooks";

const MIN_VALUE = 1;
const MAX_VALUE = 10;

type PracticeIntervalInputPropsType = {
  interval: number;
  setInterval: (interval: number) => void;
};
export const PracticeIntervalInput = ({
  interval,
  setInterval,
}: PracticeIntervalInputPropsType) => {
  const { isMobile } = useScreenSize();

  return (
    <Tooltip title="Number of seconds between correct answer and next card">
      <TextField
        label="Interval (seconds)"
        value={interval}
        type="number"
        size={isMobile ? "small" : "medium"}
        sx={{ width: "100%" }}
        onChange={(e) => {
          const newVal = Number(e.target.value);
          if (newVal < MIN_VALUE) return setInterval(MIN_VALUE);
          if (newVal > MAX_VALUE) return setInterval(MAX_VALUE);
          setInterval(Number(e.target.value));
        }}
        placeholder="Interval (sec)"
        inputProps={{ step: 1, min: MIN_VALUE, max: MAX_VALUE }}
      />
    </Tooltip>
  );
};
