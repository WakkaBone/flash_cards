import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const MIN_VALUE = 1;
const MAX_VALUE = 200;

type PracticeLastCardsControlPropsType = {
  lastCards: number | undefined;
  setLastCards: (lastCards: number | undefined) => void;
};
export const PracticeLastCardsControl = ({
  lastCards,
  setLastCards,
}: PracticeLastCardsControlPropsType) => {
  const [lastCardsEnabled, setLastCardsEnabled] = useState(!!lastCards);

  useEffect(() => {
    if (!lastCardsEnabled) setLastCards(undefined);
  }, [lastCardsEnabled, setLastCards]);

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={lastCardsEnabled}
          onChange={() => setLastCardsEnabled(!lastCardsEnabled)}
          name="lastCardsEnable"
          color="primary"
        />
      }
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: lastCardsEnabled ? "black" : "grey",
          }}
        >
          Practice Last
          <TextField
            type="number"
            disabled={!lastCardsEnabled}
            variant="standard"
            sx={{ p: 0, m: 0, ml: 1, mr: 1 }}
            size="small"
            value={lastCards || ""}
            onChange={(e) => {
              const newVal = Number(e.target.value);
              if (newVal < MIN_VALUE) return setLastCards(MIN_VALUE);
              if (newVal > MAX_VALUE) return setLastCards(MAX_VALUE);
              setLastCards(newVal);
            }}
            inputProps={{ step: 1, min: MIN_VALUE, max: MAX_VALUE }}
          />
          Cards
        </Box>
      }
    />
  );
};
