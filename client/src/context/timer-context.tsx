import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { useTimer } from "react-timer-hook";
import { addSeconds } from "../utils/date-time";

interface TimerContextType {
  handleIsEnabled: (state: boolean) => void;
  isRunning: boolean;
  timerDuration: string;
  displayedCountdown: string | undefined;
  restart: (duration?: string) => void;
  timerSessionActive: boolean;
  handleStartTimer: (timerDuration: string) => void;
  handleStopTimer: () => void;
  resume: () => void;
  pause: () => void;
  isExpired: boolean;
}

const TimerContext = createContext<TimerContextType>({
  displayedCountdown: undefined,
  handleIsEnabled: () => {},
  isRunning: false,
  timerDuration: "",
  restart: () => {},
  timerSessionActive: false,
  handleStartTimer: () => {},
  handleStopTimer: () => {},
  resume: () => {},
  pause: () => {},
  isExpired: false,
});

export const TimerContextProvider = ({ children }: PropsWithChildren) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState("");
  const [timerSessionActive, setTimerSessionActive] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const {
    isRunning,
    pause,
    resume,
    seconds: secondsLeft,
    minutes: minutesLeft,
    restart,
  } = useTimer({
    autoStart: false,
    expiryTimestamp: new Date(),
    onExpire: () => setIsExpired(true),
  });

  const handleIsEnabled = (state: boolean) => {
    setIsEnabled(state);
    if (!state) {
      setTimerDuration("");
      setTimerSessionActive(false);
      pause();
    }
  };

  const restartTimer = useCallback(
    (firstLaunchDuration?: string) => {
      if (!isEnabled) return;
      setIsExpired(false);
      const newExpiryStamp = addSeconds(firstLaunchDuration || timerDuration);
      restart(newExpiryStamp);
    },
    [isEnabled, timerDuration, restart]
  );

  const handleStartTimer = useCallback(
    (timerDuration: string) => {
      if (!isEnabled) return;
      setTimerDuration(timerDuration);
      setTimerSessionActive(true);
      restartTimer(timerDuration);
    },
    [isEnabled, restartTimer]
  );

  const handleStopTimer = useCallback(() => {
    if (!isEnabled) return;
    setTimerSessionActive(false);
    pause();
  }, [isEnabled, pause]);

  return (
    <TimerContext.Provider
      value={{
        handleIsEnabled,
        isRunning,
        timerDuration,
        displayedCountdown: (minutesLeft * 60 + secondsLeft).toString(),
        restart: restartTimer,
        timerSessionActive,
        handleStartTimer,
        handleStopTimer,
        resume,
        pause,
        isExpired,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => useContext(TimerContext);
