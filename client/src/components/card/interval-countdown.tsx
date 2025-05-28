import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

export const IntervalCountdown = ({ seconds }: { seconds: number }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        const next = prev - 1;
        return next > 0 ? next : 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Typography variant="caption">
      <span style={{ fontWeight: "bold" }}>{secondsRemaining}</span> until next
      card
    </Typography>
  );
};
