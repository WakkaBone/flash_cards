import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { useGetVerbConjugations, useScreenSize } from "../../hooks";
import { CenteredLoader } from "../loader/loader";
import { VerbConjugationsTable } from "./verb-conjugations-table";

type VerbConjugationsModalPropsType = {
  infinitive: string;
  open: boolean;
  onClose: () => void;
};
export const VerbConjugationsModal = ({
  infinitive,
  onClose,
  open,
}: VerbConjugationsModalPropsType) => {
  const { isMobile } = useScreenSize();
  const { data, isFetching, isPending } = useGetVerbConjugations(
    infinitive,
    open
  );

  const verbConjugations = data.data;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: isMobile ? "90vw" : "70vw" } }}
    >
      <DialogContent>
        {isFetching || isPending ? (
          <CenteredLoader />
        ) : (
          <VerbConjugationsTable verbConjugations={verbConjugations} />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
