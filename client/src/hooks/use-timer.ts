import { useEffect, useState } from "react";

export const useTimer = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const handleToggleTimer = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnabled(event.target.checked);
    if (!event.target.checked) resetTimer();
  };

  const handleSecondsChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSeconds(event.target.value);

  const startTimer = () => {
    const parsedSeconds = parseInt(seconds, 10);
    if (isNaN(parsedSeconds) || parsedSeconds <= 0) return;
    setTimeLeft(parsedSeconds);
    const id = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime && prevTime <= 1) {
          clearInterval(id);
          return 0;
        }
        return prevTime ? prevTime - 1 : 0;
      });
    }, 1000);
    setIntervalId(id);
  };

  const resetTimer = () => {
    if (intervalId) clearInterval(intervalId);
    setTimeLeft(null);
  };

  const restartTimer = () => {
    resetTimer();
    startTimer();
  };

  const stopTimer = () => {
    resetTimer();
    setSeconds("");
  };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return {
    isEnabled,
    isGoing: isEnabled && !!timeLeft,
    seconds,
    timeLeft,
    handleSecondsChange,
    handleToggleTimer,
    startTimer,
    resetTimer,
    stopTimer,
    restartTimer,
  };
};
