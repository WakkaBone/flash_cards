import { Box, Typography } from "@mui/material";
import { VerbConjugations } from "../../models/verb";
import { useTTS } from "../../hooks";
import { FutureTenseTable } from "../verb-conjugations-tables/future-tense-table";
import { PresentTenseTable } from "../verb-conjugations-tables/present-tense-table";
import { PastTenseTable } from "../verb-conjugations-tables/past-tense-table";

type VerbConjugationsTablePropsType = {
  verbConjugations?: VerbConjugations | null;
};
export const VerbConjugationsTable = ({
  verbConjugations,
}: VerbConjugationsTablePropsType) => {
  const { tts, isUttering } = useTTS();

  if (verbConjugations === null)
    return <Typography>Verb forms were not found</Typography>;

  if (verbConjugations === undefined)
    return <Typography>Loading...</Typography>;

  const { infinitive, present, past, future } = verbConjugations;

  return (
    <Box>
      <Typography
        textAlign={"center"}
        variant="h4"
        onClick={() => !isUttering && tts(infinitive)}
      >
        {infinitive}
      </Typography>
      <PresentTenseTable forms={present} />
      <PastTenseTable forms={past} />
      <FutureTenseTable forms={future} />
    </Box>
  );
};
