import { Button } from "@mui/material";
import { useGetVerbConjugations, useScreenSize } from "../../hooks";
import { CenteredLoader } from "../loader/loader";
import { VerbConjugationsTable } from "./verb-conjugations-table";
import { Modal } from "../modal/modal";

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
    <Modal
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: isMobile ? "90vw" : "70vw" } }}
      actions={<Button onClick={onClose}>Close</Button>}
    >
      {isFetching || isPending ? (
        <CenteredLoader />
      ) : (
        <VerbConjugationsTable verbConjugations={verbConjugations} />
      )}
    </Modal>
  );
};
