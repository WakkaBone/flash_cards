import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  PastTenseConjugations,
  PresentTenseConjugations,
  VerbConjugations,
} from "../../models/verb";
import { useScreenSize, useTTS } from "../../hooks";
import { MouseEvent, useCallback } from "react";

type PresentTenseTablePropsType = { forms: PresentTenseConjugations };
const PresentTenseTable = ({ forms }: PresentTenseTablePropsType) => {
  const { tts, isUttering } = useTTS();

  const voiceCellContent = useCallback(
    (e: MouseEvent<HTMLTableCellElement>) => {
      const cellText = e.currentTarget.textContent;
      if (cellText && !isUttering) tts(cellText);
    },
    [tts, isUttering]
  );

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 600, margin: "auto", mt: 4 }}
    >
      <Typography variant="h6" align="center" sx={{ mt: 2 }}>
        Present Tense (הווה)
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <strong>Masculine</strong>
            </TableCell>
            <TableCell>
              <strong>Feminine</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Singular</TableCell>
            <TableCell onClick={voiceCellContent}>
              <strong>{forms.singular.male}</strong>
            </TableCell>
            <TableCell onClick={voiceCellContent}>
              <strong>{forms.singular.female}</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Plural</TableCell>
            <TableCell onClick={voiceCellContent}>
              <strong>{forms.plural.male}</strong>
            </TableCell>
            <TableCell onClick={voiceCellContent}>
              <strong>{forms.plural.female}</strong>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

type PastTenseTablePropsType = { forms: PastTenseConjugations };
const PastTenseTable = ({ forms }: PastTenseTablePropsType) => {
  const { isMobile } = useScreenSize();
  const { tts, isUttering } = useTTS();

  const voiceCellContent = useCallback(
    (e: MouseEvent<HTMLTableCellElement>) => {
      const cellText = e.currentTarget.textContent;
      if (cellText && !isUttering) tts(cellText);
    },
    [tts, isUttering]
  );

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 700, margin: "auto", mt: 4 }}
    >
      <Typography variant="h6" align="center" sx={{ mt: 2 }}>
        Past Tense (עבר)
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <strong>Masculine</strong>
            </TableCell>
            <TableCell>
              <strong>Feminine</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>1st {isMobile ? "Sg." : "Singular"}</TableCell>
            <TableCell colSpan={2} onClick={voiceCellContent}>
              <strong>{forms[1].singular}</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2nd {isMobile ? "Sg." : "Singular"}</TableCell>
            <TableCell onClick={voiceCellContent}>
              <strong>{forms[2].singular.male}</strong>
            </TableCell>
            <TableCell onClick={voiceCellContent}>
              <strong>{forms[2].singular.female}</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3rd {isMobile ? "Sg." : "Singular"}</TableCell>
            <TableCell onClick={voiceCellContent}>
              <strong>{forms[3].singular.male}</strong>
            </TableCell>
            <TableCell onClick={voiceCellContent}>
              <strong>{forms[3].singular.female}</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>1st {isMobile ? "Pl." : "Plural"}</TableCell>
            <TableCell colSpan={2} onClick={voiceCellContent}>
              <strong>{forms[1].plural}</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2nd {isMobile ? "Pl." : "Plural"}</TableCell>
            <TableCell onClick={voiceCellContent}>
              <strong>{forms[2].plural.male}</strong>
            </TableCell>
            <TableCell onClick={voiceCellContent}>
              <strong>{forms[2].plural.female}</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3rd {isMobile ? "Pl." : "Plural"}</TableCell>
            <TableCell colSpan={2} onClick={voiceCellContent}>
              <strong>{forms[3].plural}</strong>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

type VerbConjugationsTablePropsType = {
  verbConjugations?: VerbConjugations | null;
};
export const VerbConjugationsTable = ({
  verbConjugations,
}: VerbConjugationsTablePropsType) => {
  if (verbConjugations === null)
    return <Typography>Verb forms were not found</Typography>;

  if (verbConjugations === undefined)
    return <Typography>Loading...</Typography>;

  const { infinitive, present, past } = verbConjugations;

  return (
    <Box>
      <Typography textAlign={"center"} variant="h4">
        {infinitive}
      </Typography>
      <PresentTenseTable forms={present} />
      <PastTenseTable forms={past} />
    </Box>
  );
};
