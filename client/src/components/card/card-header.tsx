import { Typography } from "@mui/material";
import { PracticeModes } from "../../models/practice-mode";
import { UtterButton } from "./utter-button";
import { SeeVerbFormsButton } from "../buttons/see-verb-forms-btn";
import { usePracticeContext } from "../../context/practice-context";

export const CardHeader = () => {
  const {
    cardState: { card, cardIsVerb },
    loadersState: { isLoading },
    practiceModeState: { practiceMode: mode, eth },
    modalsState: {
      verbFormsModal: { onOpen: onOpenVerbFormsModal },
    },
  } = usePracticeContext();

  if (!card) return null;

  return (
    <>
      <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
        Word
      </Typography>
      <Typography variant="h5" component="div">
        {eth ? card.english : card.hebrew}{" "}
        {[
          PracticeModes.browse,
          PracticeModes.hteInput,
          PracticeModes.hteSelect,
        ].includes(mode) && <UtterButton text={card.hebrew || ""} />}
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
        {card.category.label}{" "}
        {cardIsVerb && (
          <SeeVerbFormsButton
            disabled={isLoading}
            onClick={onOpenVerbFormsModal}
          />
        )}
      </Typography>
    </>
  );
};
