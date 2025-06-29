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

export const WordCard = () => {
  const { isMobile } = useScreenSize();

  const {
    loadersState: { isFetchingCard, isLoadingCard },
    cardState: { card },
    modalsState: { editModal, verbFormsModal },
  } = usePracticeContext();

  if (card === undefined || isLoadingCard) return <CenteredLoader />;

  if (card === null)
    return (
      <Typography mt={3} variant="h3">
        No cards were found
      </Typography>
    );

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
        ) : (
          <>
            <CardHeader />
            <CardBody />
            <CardFooter />
          </>
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
