import {
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PracticeModes } from "../../models/practice-mode";
import { usePracticeContext } from "../../context/practice-context";
import { useScreenSize } from "../../hooks";
import { UtterButton } from "./utter-button";

const selectedOptionStyles = {
  backgroundColor: "primary.main",
  color: "white",
};
type OptionsPropsType = {
  options: string[];
  onSelect: (option: string) => void;
  selected: string;
  isLoading: boolean;
  eth: boolean;
};
const Options = ({
  options,
  onSelect,
  selected,
  isLoading,
  eth,
}: OptionsPropsType) => {
  const { isMobile } = useScreenSize();

  return (
    <Stack
      sx={{
        width: isMobile ? "100%" : "unset",
        gap: 1,
        flexDirection: isMobile ? "column" : "row",
        flexWrap: "wrap",
      }}
    >
      {options.map((option) => {
        const isSelected = option === selected;
        const cardStyles = {
          cursor: "pointer",
          width: isMobile ? "80%" : "unset",
          p: 1,
          opacity: isLoading ? 0.5 : 1,
          pointerEvents: isLoading ? "none" : "auto",
        };

        if (isSelected) {
          Object.assign(cardStyles, selectedOptionStyles);
        }

        return (
          <Box
            sx={
              isMobile
                ? { display: "flex", justifyContent: "center" }
                : { width: "40%" }
            }
          >
            <Card onClick={() => onSelect(option)} sx={cardStyles}>
              <CardContent
                sx={{
                  p: 0,
                  pb: "0 !important",
                  height: "100%",
                  display: "flex",
                  justifyContent: isMobile ? "center" : "start",
                  alignItems: "center",
                }}
              >
                <Typography>
                  {option} {eth && <UtterButton text={option} />}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        );
      })}
    </Stack>
  );
};

export const CardBody = () => {
  const {
    practiceMode: mode,
    eth,
    cardState: { card, options },
    loadersState: { isLoading },
    translationState: {
      translation,
      showTranslation,
      setTranslation,
      handleSelectOption,
    },
    inputRef,
  } = usePracticeContext();

  if (!card) return null;

  switch (mode) {
    case PracticeModes.ethInput:
    case PracticeModes.hteInput:
      return (
        <TextField
          value={
            showTranslation
              ? card[PracticeModes.ethInput === mode ? "hebrew" : "english"]
              : translation
          }
          disabled={showTranslation}
          placeholder="Enter translation"
          onChange={(e) => setTranslation(e.target.value)}
          inputRef={inputRef}
        />
      );
    case PracticeModes.ethSelect:
    case PracticeModes.hteSelect: {
      return (
        <Options
          options={options}
          onSelect={handleSelectOption}
          selected={translation}
          isLoading={isLoading}
          eth={eth}
        />
      );
    }
    case PracticeModes.browse:
      return <TextField value={card.english} sx={{ pointerEvents: "none" }} />;
    default:
      return <></>;
  }
};
