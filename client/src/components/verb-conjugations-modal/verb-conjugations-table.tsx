import { Box, Typography } from "@mui/material";
import { Tenses, VerbConjugations } from "../../models/verb";
import { useTTS } from "../../hooks";
import { VerbFormsTable } from "../verb-forms-table/verb-forms-table";

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

  const { infinitive } = verbConjugations;

  return (
    <Box>
      <Typography
        textAlign={"center"}
        variant="h4"
        onClick={() => !isUttering && tts(infinitive)}
      >
        {infinitive}
      </Typography>
      {[Tenses.Present, Tenses.Past, Tenses.Future].map((tense) => (
        <VerbFormsTable
          key={tense}
          tense={tense}
          forms={verbConjugations[tense]}
        />
      ))}
    </Box>
  );
};
