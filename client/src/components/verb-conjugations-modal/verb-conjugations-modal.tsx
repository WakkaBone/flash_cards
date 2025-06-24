import { Dialog, DialogContent } from "@mui/material";
import { useGetVerbConjugations } from "../../hooks";
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
  const { data, isFetching, isPending } = useGetVerbConjugations(
    infinitive,
    open
  );

  const verbConjugations = data.data;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        {isFetching || isPending ? (
          <CenteredLoader />
        ) : (
          <VerbConjugationsTable verbConjugations={verbConjugations} />
        )}
      </DialogContent>
    </Dialog>
  );
};
