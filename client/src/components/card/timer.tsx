import React, { useEffect, useState } from "react";
import {
  Checkbox,
  TextField,
  Button,
  FormControlLabel,
  Stack,
  Tooltip,
} from "@mui/material";
import { Timer as TimerIcon } from "@mui/icons-material";

type TimerPropsType = {
  isRunning: boolean;
  handleIsEnabled: (state: boolean) => void;
  timerDuration: string;
  handleTimerDurationChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  displayedCountdown?: string;
  handleStartTimer: () => void;
  handleStopTimer: () => void;
  timerSessionActive: boolean;
};

const MIN_SECONDS = 5;
const MAX_SECONDS = 60;

export const Timer = (props: TimerPropsType) => {
  const [isTimerEnabled, setIsTimerEnabled] = useState(false);

  const {
    isRunning,
    timerDuration,
    handleTimerDurationChange,
    displayedCountdown,
    handleStartTimer,
    handleStopTimer,
    timerSessionActive,
    handleIsEnabled,
  } = props;

  useEffect(
    () => handleIsEnabled(isTimerEnabled),
    [isTimerEnabled, handleIsEnabled]
  );

  const invalidTimerDurationValue = !!(
    timerDuration &&
    (parseInt(timerDuration) < MIN_SECONDS ||
      parseInt(timerDuration) > MAX_SECONDS)
  );

  const buttonStyles = { marginLeft: "5px" };

  const handleTimerEnabledCheckbox = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsTimerEnabled(e.target.checked);

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "start",
        mb: 1,
        width: "100%",
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={isTimerEnabled}
            disabled={isRunning}
            onChange={handleTimerEnabledCheckbox}
          />
        }
        label={
          <Tooltip title="Timer">
            <TimerIcon />
          </Tooltip>
        }
      />

      <Stack
        direction="row"
        gap={1}
        sx={{
          alignItems: "start",
          visibility: isTimerEnabled ? "visible" : "hidden",
        }}
      >
        <TextField
          label="Enter Seconds"
          type="number"
          disabled={timerSessionActive}
          value={timerSessionActive ? displayedCountdown : timerDuration}
          onChange={handleTimerDurationChange}
          fullWidth
          size="small"
          variant="standard"
          margin="none"
          error={!isRunning && invalidTimerDurationValue}
          helperText={invalidTimerDurationValue ? "5-60 seconds" : ""}
        />
        {timerSessionActive ? (
          <Button
            variant="contained"
            color="warning"
            disabled={!isRunning || invalidTimerDurationValue}
            onClick={handleStopTimer}
            sx={buttonStyles}
          >
            Stop
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            disabled={isRunning || invalidTimerDurationValue || !timerDuration}
            onClick={handleStartTimer}
            sx={buttonStyles}
          >
            Start
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
