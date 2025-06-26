import { Box, Typography } from "@mui/material";
import { usePracticeContext } from "../../context/practice-context";
import { PracticeModes } from "../../models/practice-mode";
import { useEffect, useState } from "react";

type CardDetailsPropsType = {
  showDetails: boolean;
  details?: string;
};
const CardDetails = ({ showDetails, details }: CardDetailsPropsType) =>
  showDetails ? (
    <Typography
      variant="body2"
      gutterBottom
      sx={{ display: "block", whiteSpace: "pre-wrap" }}
      mt={2}
    >
      {details}
    </Typography>
  ) : (
    <></>
  );

const IntervalCountdown = ({ seconds }: { seconds: number }) => {
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

export const CardFooter = () => {
  const {
    loadersState: { inTransition },
    translationState: { showTranslation },
    practiceModeState: { practiceMode: mode },
    cardState: { card },
    settingsState: {
      settings: { interval },
    },
  } = usePracticeContext();

  if (!card) return null;

  return (
    <>
      <CardDetails
        showDetails={
          (mode === PracticeModes.browse || showTranslation) && !!card.details
        }
        details={card.details}
      />
      {inTransition && mode !== PracticeModes.browse && (
        <Box mt={2}>
          <IntervalCountdown seconds={interval} />
        </Box>
      )}
    </>
  );
};
