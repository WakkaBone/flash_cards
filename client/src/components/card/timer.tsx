import React, { useEffect, useState } from "react";
import {
  Checkbox,
  TextField,
  Button,
  FormControlLabel,
  Stack,
  Typography,
  ButtonOwnProps,
} from "@mui/material";
import { Timer as TimerIcon } from "@mui/icons-material";
import { useScreenSize } from "../../hooks";

export type TimerPropsType = {
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
  const { isMobile } = useScreenSize();
  const [isTimerEnabled, setIsTimerEnabled] = useState(!!props.isRunning);

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

  const buttonSharedStyles: ButtonOwnProps = {
    sx: buttonStyles,
    size: "small",
    variant: "contained",
  };

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        mb: 1,
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
          <Typography>
            <TimerIcon sx={{ verticalAlign: "middle" }} fontSize="small" />{" "}
            {isMobile ? "" : "Timer"}
          </Typography>
        }
      />

      <Stack
        direction="row"
        ml={1}
        gap={1}
        sx={{
          alignItems: "center",
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
            {...buttonSharedStyles}
            color="warning"
            disabled={!isRunning || invalidTimerDurationValue}
            onClick={handleStopTimer}
          >
            Stop
          </Button>
        ) : (
          <Button
            {...buttonSharedStyles}
            color="primary"
            disabled={isRunning || invalidTimerDurationValue || !timerDuration}
            onClick={handleStartTimer}
          >
            Start
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
