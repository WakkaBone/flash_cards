import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
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
import { MouseEvent, PropsWithChildren, useCallback } from "react";

const TableCellWithVoiceover = ({
  children,
  ...props
}: PropsWithChildren<TableCellProps>) => {
  const { tts, isUttering } = useTTS();

  const voiceCellContent = useCallback(
    (e: MouseEvent<HTMLTableCellElement>) => {
      const cellText = e.currentTarget.textContent;
      if (cellText && !isUttering) tts(cellText);
    },
    [tts, isUttering]
  );

  return (
    <TableCell {...props} onClick={voiceCellContent}>
      {children}
    </TableCell>
  );
};

type PresentTenseTablePropsType = { forms: PresentTenseConjugations };
const PresentTenseTable = ({ forms }: PresentTenseTablePropsType) => (
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
          <TableCellWithVoiceover>
            <strong>{forms.singular.male}</strong>
          </TableCellWithVoiceover>
          <TableCellWithVoiceover>
            <strong>{forms.singular.female}</strong>
          </TableCellWithVoiceover>
        </TableRow>
        <TableRow>
          <TableCell>Plural</TableCell>
          <TableCellWithVoiceover>
            <strong>{forms.plural.male}</strong>
          </TableCellWithVoiceover>
          <TableCellWithVoiceover>
            <strong>{forms.plural.female}</strong>
          </TableCellWithVoiceover>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

type PastTenseTablePropsType = { forms: PastTenseConjugations };
const PastTenseTable = ({ forms }: PastTenseTablePropsType) => {
  const { isMobile } = useScreenSize();

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
            <TableCellWithVoiceover colSpan={2}>
              <strong>{forms[1].singular}</strong>
            </TableCellWithVoiceover>
          </TableRow>
          <TableRow>
            <TableCell>2nd {isMobile ? "Sg." : "Singular"}</TableCell>
            <TableCellWithVoiceover>
              <strong>{forms[2].singular.male}</strong>
            </TableCellWithVoiceover>
            <TableCellWithVoiceover>
              <strong>{forms[2].singular.female}</strong>
            </TableCellWithVoiceover>
          </TableRow>
          <TableRow>
            <TableCell>3rd {isMobile ? "Sg." : "Singular"}</TableCell>
            <TableCellWithVoiceover>
              <strong>{forms[3].singular.male}</strong>
            </TableCellWithVoiceover>
            <TableCellWithVoiceover>
              <strong>{forms[3].singular.female}</strong>
            </TableCellWithVoiceover>
          </TableRow>
          <TableRow>
            <TableCell>1st {isMobile ? "Pl." : "Plural"}</TableCell>
            <TableCellWithVoiceover colSpan={2}>
              <strong>{forms[1].plural}</strong>
            </TableCellWithVoiceover>
          </TableRow>
          <TableRow>
            <TableCell>2nd {isMobile ? "Pl." : "Plural"}</TableCell>
            <TableCellWithVoiceover>
              <strong>{forms[2].plural.male}</strong>
            </TableCellWithVoiceover>
            <TableCellWithVoiceover>
              <strong>{forms[2].plural.female}</strong>
            </TableCellWithVoiceover>
          </TableRow>
          <TableRow>
            <TableCell>3rd {isMobile ? "Pl." : "Plural"}</TableCell>
            <TableCellWithVoiceover colSpan={2}>
              <strong>{forms[3].plural}</strong>
            </TableCellWithVoiceover>
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
