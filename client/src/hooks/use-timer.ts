import { useEffect, useState } from "react";
import { useTimer as useTimerHook } from "react-timer-hook";
import { addSeconds } from "../utils/date-time";

export const useTimer = ({
  onExpire,
  expiryTimestamp = new Date(),
}: {
  onExpire: () => void;
  expiryTimestamp?: Date;
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState("");
  const [displayedCountdown, setDisplayedCountdown] = useState<
    string | undefined
  >();
  const [timerSessionActive, setTimerSessionActive] = useState(false);

  const {
    isRunning,
    pause,
    resume,
    seconds: secondsLeft,
    minutes: minutesLeft,
    restart,
  } = useTimerHook({
    autoStart: false,
    expiryTimestamp,
    onExpire,
  });

  const handleIsEnabled = (state: boolean) => {
    setIsEnabled(state);
    if (!state) {
      setTimerDuration("");
      setDisplayedCountdown("");
      pause();
    }
  };

  const handleTimerDurationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setTimerDuration(event.target.value);

  const timeLeft = minutesLeft * 60 + secondsLeft;

  useEffect(() => {
    setDisplayedCountdown(timeLeft === 0 ? undefined : timeLeft.toString());
  }, [timeLeft]);

  const restartTimer = () => {
    if (!isEnabled) return;
    const newExpiryStamp = addSeconds(timerDuration);
    restart(newExpiryStamp);
  };

  const handleStartTimer = () => {
    if (!isEnabled) return;
    setTimerSessionActive(true);
    restartTimer();
  };

  const handleStopTimer = () => {
    if (!isEnabled) return;
    setTimerSessionActive(false);
    pause();
  };

  return {
    handleIsEnabled,
    isRunning,
    timerDuration,
    displayedCountdown,
    handleTimerDurationChange,
    restart: restartTimer,
    timerSessionActive,
    handleStartTimer,
    handleStopTimer,
    resume,
    pause,
  };
};
