import { Card, CardContent, Typography } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { useScreenSize } from "../../hooks";
import { EditCardModal } from "../edit-card-modal/edit-card-modal";
import { CardSkeletonLoader } from "./card-skeleton-loader";
import { CenteredLoader } from "../loader/loader";
import { TOAST_CONTAINERS_IDS } from "../../constants";
import { VerbConjugationsModal } from "../verb-conjugations-modal/verb-conjugations-modal";
import { CardHeader } from "./card-header";
import { CardBody } from "./card-body";
import { CardActions } from "./card-actions";
import { CardFooter } from "./card-footer";
import { usePracticeContext } from "../../context/practice-context";
import { PracticeModes } from "../../models/practice-mode";
import { VerbFormsPractice } from "../verb-forms-practice/verb-forms-practice";

export const WordCard = () => {
  const { isMobile } = useScreenSize();

  const {
    practiceMode,
    loadersState: { isFetchingCard, isLoadingCard },
    cardState: { card, verbForms },
    modalsState: { editModal, verbFormsModal },
  } = usePracticeContext();

  if (card === undefined || isLoadingCard) return <CenteredLoader />;

  if (card === null)
    return (
      <Typography mt={3} variant="h3">
        No cards were found
      </Typography>
    );

  const isCardLayout = practiceMode !== PracticeModes.verbForms;

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignContent: "space-between",
        position: "relative",
      }}
    >
      <ToastContainer containerId={TOAST_CONTAINERS_IDS.card} />
      <CardContent
        sx={
          isMobile
            ? {
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }
            : {}
        }
      >
        {isFetchingCard ? (
          <CardSkeletonLoader />
        ) : isCardLayout ? (
          <>
            <CardHeader />
            <CardBody />
            <CardFooter />
          </>
        ) : (
          <VerbFormsPractice verbForms={verbForms} card={card} />
        )}
      </CardContent>
      <CardActions />
      <EditCardModal {...editModal} card={card} />
      <VerbConjugationsModal
        {...verbFormsModal}
        infinitive={card.hebrew || ""}
      />
    </Card>
  );
};
