import { useCallback, useMemo } from "react";
import { BooleanifiedVerbConjugations } from "../../hooks/cards/use-card-translation";
import {
  Genders,
  Quantities,
  Tenses,
  VerbConjugations,
  VerbTenses,
} from "../../models/verb";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useScreenSize } from "../../hooks";
import { deepCopy } from "../../utils/object-util";
import { TableCellWithVoiceover } from "./table-cell-with-voiceover";
import { VerbFormInput } from "./verb-form-input";
import { VoiceoverWrapper } from "./voiceover-wrapper";

export interface VerbTenseTablePropsType<Tense extends keyof VerbTenses> {
  forms?: VerbConjugations[Tense];
  isPractice?: boolean;
  practiceProps?: {
    input: VerbConjugations[Tense];
    onInput?: (input: VerbConjugations[Tense]) => void;
    results?: BooleanifiedVerbConjugations[Tense];
    showTranslation?: boolean;
    verbFormsSubmitted: boolean;
  };
}

const getValue = (
  obj: any,
  person: 1 | 2 | 3 | undefined,
  quantity: Quantities,
  gender?: Genders
) => {
  const val = person ? obj?.[person]?.[quantity] : obj?.[quantity];
  if (gender && typeof val === "object") return val[gender] ?? "";
  if (!gender && typeof val === "string") return val;
  return "";
};

type TableRowData = {
  label: string;
  cells: JSX.Element[];
};

type useVerbFormsTableProps<T extends keyof VerbTenses> =
  VerbTenseTablePropsType<T> & {
    tense: Tenses;
  };
export function VerbFormsTable<T extends keyof VerbTenses>(
  props: useVerbFormsTableProps<T>
) {
  const { isMobile } = useScreenSize();

  const { tense, practiceProps, forms, isPractice } = props;

  const shouldShowFeedback =
    !!practiceProps?.verbFormsSubmitted && !practiceProps?.showTranslation;

  const handleInputChange = useCallback(
    (
      person: 1 | 2 | 3 | undefined,
      quantity: Quantities,
      gender: Genders | null,
      value: string
    ) => {
      if (!practiceProps?.input) return;

      const updated = deepCopy(practiceProps.input);

      switch (tense) {
        case Tenses.Present: {
          if (!gender) return;

          const updatedTyped =
            updated as unknown as VerbConjugations[Tenses.Present];
          updatedTyped[quantity][gender] = value;
          break;
        }

        case Tenses.Past:
        case Tenses.Future: {
          if (!person) return;

          const updatedTyped =
            updated as unknown as VerbConjugations[Tenses.Future]; //or PastTenseConjugations, doesnt matter here because the models are the same
          const currentVal = updatedTyped[person][quantity];

          if (gender) {
            const existing =
              typeof currentVal === "object" && currentVal !== null
                ? currentVal
                : { [Genders.Male]: "", [Genders.Female]: "" };
            updatedTyped[person][quantity] = {
              ...existing,
              [gender]: value,
            };
          } else {
            updatedTyped[person][quantity] = value;
          }
          break;
        }
      }

      practiceProps.onInput?.(updated);
    },
    [practiceProps, tense]
  );

  const isCorrect = useCallback(
    (
      person: 1 | 2 | 3 | undefined,
      quantity: Quantities,
      gender?: Genders
    ): boolean => {
      const results = practiceProps?.results;

      switch (tense) {
        case Tenses.Present: {
          if (!gender) return false;

          const resultsTyped =
            results as BooleanifiedVerbConjugations[Tenses.Present];
          return resultsTyped?.[quantity]?.[gender] === true;
        }

        case Tenses.Past:
        case Tenses.Future: {
          if (!person) return false;

          const resultsTyped =
            results as BooleanifiedVerbConjugations[Tenses.Future];
          const val = resultsTyped?.[person]?.[quantity];

          if (gender && typeof val === "object" && val !== null)
            return val[gender] === true;

          return !gender && val === true;
        }
        default:
          return false;
      }
    },
    [practiceProps?.results, tense]
  );

  const renderCell = useCallback(
    (person: 1 | 2 | 3 | undefined, quantity: Quantities, gender?: Genders) => {
      const value = getValue(
        isPractice ? practiceProps?.input : forms,
        person,
        quantity,
        gender
      );
      const colSpan = gender ? 1 : 2;

      if (!isPractice) {
        return (
          <TableCellWithVoiceover colSpan={colSpan}>
            <Typography align="center" sx={{ display: "block", p: 0, m: 0 }}>
              <strong>{value}</strong>
            </Typography>
          </TableCellWithVoiceover>
        );
      }

      return (
        <TableCell colSpan={colSpan}>
          <VoiceoverWrapper
            shouldPlay={!!practiceProps?.showTranslation}
            value={value}
          >
            <VerbFormInput
              value={value}
              disabled={!!practiceProps?.showTranslation}
              onChange={(e) =>
                handleInputChange(
                  person,
                  quantity,
                  gender ?? null,
                  e.target.value
                )
              }
              isCorrect={isCorrect(person, quantity, gender)}
              shouldShowFeedback={shouldShowFeedback}
            />
          </VoiceoverWrapper>
        </TableCell>
      );
    },
    [
      isPractice,
      practiceProps,
      forms,
      handleInputChange,
      isCorrect,
      shouldShowFeedback,
    ]
  );

  const buildRow = useCallback(
    (
      label: string,
      person: 1 | 2 | 3,
      quantity: Quantities,
      genders?: Genders[]
    ): TableRowData => ({
      label,
      cells: genders
        ? genders.map((g) => renderCell(person, quantity, g))
        : [renderCell(person, quantity)],
    }),
    [renderCell]
  );

  const tableRows = useMemo(() => {
    const sgPostfix = isMobile ? "Sg." : " Singular";
    const plPostfix = isMobile ? "Pl." : " Plural";
    let rows: { label: string; cells: JSX.Element[] }[] = [];

    switch (tense) {
      case Tenses.Present: {
        rows = [Quantities.Singular, Quantities.Plural].map((quantity) => ({
          label: quantity[0].toUpperCase() + quantity.slice(1),
          cells: [
            renderCell(undefined, quantity, Genders.Male),
            renderCell(undefined, quantity, Genders.Female),
          ],
        }));
        break;
      }

      case Tenses.Past: {
        rows = [
          buildRow(`1st ${sgPostfix}`, 1, Quantities.Singular),
          buildRow(`2nd ${sgPostfix}`, 2, Quantities.Singular, [
            Genders.Male,
            Genders.Female,
          ]),
          buildRow(`3rd ${sgPostfix}`, 3, Quantities.Singular, [
            Genders.Male,
            Genders.Female,
          ]),
          buildRow(`1st ${plPostfix}`, 1, Quantities.Plural),
          buildRow(`2nd ${plPostfix}`, 2, Quantities.Plural, [
            Genders.Male,
            Genders.Female,
          ]),
          buildRow(`3rd ${plPostfix}`, 3, Quantities.Plural),
        ];
        break;
      }

      case Tenses.Future: {
        rows = [
          buildRow("1st Singular", 1, Quantities.Singular),
          buildRow("2nd Singular", 2, Quantities.Singular, [
            Genders.Male,
            Genders.Female,
          ]),
          buildRow("3rd Singular", 3, Quantities.Singular, [
            Genders.Male,
            Genders.Female,
          ]),
          buildRow("1st Plural", 1, Quantities.Plural),
          buildRow("2nd Plural", 2, Quantities.Plural, [
            Genders.Male,
            Genders.Female,
          ]),
          buildRow("3rd Plural", 3, Quantities.Plural, [
            Genders.Male,
            Genders.Female,
          ]),
        ];
        break;
      }
    }

    return rows.map(({ label, cells }, index) => (
      <TableRow key={index}>
        <TableCell>{label}</TableCell>
        {cells}
      </TableRow>
    ));
  }, [tense, isMobile, renderCell, buildRow]);

  const tableTitle = useMemo(() => {
    switch (tense) {
      case Tenses.Present:
        return "Present Tense (הווה)";
      case Tenses.Past:
        return "Past Tense (עבר)";
      case Tenses.Future:
        return "Future Tense (עתיד)";
    }
  }, [tense]);

  return (
    <TableContainer component={Paper} sx={{ margin: "auto", mt: 2 }}>
      <Typography variant="h6" align="center" sx={{ mt: 2 }}>
        {tableTitle}
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
        <TableBody>{tableRows}</TableBody>
      </Table>
    </TableContainer>
  );
}
