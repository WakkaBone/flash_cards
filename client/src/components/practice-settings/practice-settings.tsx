import { Settings } from "@mui/icons-material";
import {
  PracticeModes,
  PracticeSettingsType,
} from "../../models/practice-mode";
import { CollapsibleSection } from "../collapsible/collapsible-section";
import { PracticeIntervalInput } from "./practice-interval-input";
import { Box, Stack } from "@mui/material";
import { useDebounce, useScreenSize, useTTS } from "../../hooks";
import { PracticeVoiceEnabledToggle } from "./practice-voice-enabled-toggle";
import { Timer } from "../card/timer";
import { PracticeLastCardsControl } from "./practice-last-cards-control";
import { useEffect, useState } from "react";
import { useTimerContext } from "../../context/timer-context";

export const PracticeSettings = ({
  settings,
  setSettings,
  practiceMode,
}: {
  settings: PracticeSettingsType;
  setSettings: React.Dispatch<React.SetStateAction<PracticeSettingsType>>;
  practiceMode: PracticeModes;
}) => {
  const { isMobile } = useScreenSize();

  const { supportsHebrew } = useTTS();

  const setInterval = (interval: number) =>
    setSettings((prev) => ({ ...prev, interval }));

  const setVoiceEnabled = (voiceEnabled: boolean) =>
    setSettings((prev) => ({ ...prev, voiceEnabled }));

  const setVoiceWithTranslation = (voiceWithTranslation: boolean) =>
    setSettings((prev) => ({
      ...prev,
      voiceWithTranslation,
    }));

  const [lastCardsNoDebounce, setLastCardsNoDebounce] = useState<
    number | undefined
  >(settings.lastCards);
  const debouncedLastCards = useDebounce(lastCardsNoDebounce);

  useEffect(() => {
    setSettings((prev) => ({ ...prev, lastCards: debouncedLastCards }));
  }, [debouncedLastCards, setSettings]);

  const timerProps = useTimerContext();
  useEffect(() => {
    debouncedLastCards && timerProps.sessionActive && timerProps.handleStop();
  }, [debouncedLastCards, timerProps]);

  return (
    <CollapsibleSection
      buttonText="Settings"
      buttonProps={{ startIcon: <Settings /> }}
    >
      <Stack
        mt={3}
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 2 : 3}
        alignItems={"center"}
      >
        {practiceMode !== PracticeModes.browse && (
          <Box sx={{ width: "100%" }}>
            <PracticeIntervalInput
              interval={settings.interval}
              setInterval={setInterval}
            />
          </Box>
        )}

        {supportsHebrew && (
          <Box sx={{ width: "100%" }}>
            <PracticeVoiceEnabledToggle
              voiceEnabled={settings.voiceEnabled}
              setVoiceEnabled={setVoiceEnabled}
              voiceWithTranslation={!!settings.voiceWithTranslation}
              setVoiceWithTranslation={setVoiceWithTranslation}
            />
          </Box>
        )}

        <Box sx={{ width: "100%" }}>
          <PracticeLastCardsControl
            lastCards={lastCardsNoDebounce}
            setLastCards={setLastCardsNoDebounce}
          />
        </Box>
        <Box sx={{ width: "100%" }}>
          <Timer />
        </Box>
      </Stack>
    </CollapsibleSection>
  );
};
