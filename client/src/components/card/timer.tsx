import React from "react";
import {
  Checkbox,
  TextField,
  Button,
  FormControlLabel,
  Stack,
} from "@mui/material";
import { Timer as TimerIcon } from "@mui/icons-material";

type TimerPropsType = {
  isEnabled: boolean;
  isGoing: boolean;
  handleToggleTimer: (event: React.ChangeEvent<HTMLInputElement>) => void;
  seconds: string;
  handleSecondsChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  startTimer: () => void;
  timeLeft: number | null;
  stopTimer: () => void;
};

const MIN_SECONDS = 5;
const MAX_SECONDS = 60;

export const Timer = (props: TimerPropsType) => {
  const {
    isEnabled,
    isGoing,
    handleToggleTimer,
    seconds,
    handleSecondsChange,
    startTimer,
    timeLeft,
    stopTimer,
  } = props;

  const invalidTimeValue = !!(
    seconds &&
    (parseInt(seconds) < MIN_SECONDS || parseInt(seconds) > MAX_SECONDS)
  );

  const buttonStyles = { marginLeft: "5px" };

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "start",
        mb: 1,
      }}
    >
      <FormControlLabel
        control={<Checkbox checked={isEnabled} onChange={handleToggleTimer} />}
        label={<TimerIcon />}
      />

      <Stack
        direction="row"
        gap={1}
        sx={{
          alignItems: "start",
          visibility: isEnabled ? "visible" : "hidden",
        }}
      >
        <TextField
          label="Enter Seconds"
          type="number"
          disabled={isGoing}
          value={isGoing ? timeLeft : seconds}
          onChange={handleSecondsChange}
          fullWidth
          size="small"
          variant="standard"
          margin="none"
          error={!isGoing && invalidTimeValue}
          helperText={invalidTimeValue ? "5-60 seconds" : ""}
        />
        {isGoing ? (
          <Button
            variant="contained"
            color="warning"
            disabled={!isGoing || invalidTimeValue}
            onClick={stopTimer}
            sx={buttonStyles}
          >
            Stop
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            disabled={isGoing || invalidTimeValue || !seconds}
            onClick={startTimer}
            sx={buttonStyles}
          >
            Start
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
