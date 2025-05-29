import { Settings } from "@mui/icons-material";
import {
  PracticeModes,
  PracticeSettingsType,
} from "../../models/practice-mode";
import { CollapsibleSection } from "../collapsible/collapsible-section";
import { PracticeIntervalInput } from "./practice-interval-input";
import { Box, Stack } from "@mui/material";
import { useScreenSize, useTTS } from "../../hooks";
import { PracticeVoiceEnabledToggle } from "./practice-voice-enabled-toggle";
import { Timer, TimerPropsType } from "../card/timer";

type PracticeSettingsPropsType = {
  settings: PracticeSettingsType;
  setSettings: (settings: PracticeSettingsType) => void;
  timerProps: TimerPropsType;
  practiceMode: PracticeModes;
};

export const PracticeSettings = ({
  settings,
  setSettings,
  practiceMode,
  timerProps,
}: PracticeSettingsPropsType) => {
  const { isMobile } = useScreenSize();
  const { supportsHebrew } = useTTS();

  const setInterval = (interval: number) =>
    setSettings({ ...settings, interval: interval });
  const setVoiceEnabled = (voiceEnabled: boolean) =>
    setSettings({ ...settings, voiceEnabled: voiceEnabled });
  const setVoiceWithTranslation = (voiceWithTranslation: boolean) =>
    setSettings({ ...settings, voiceWithTranslation: voiceWithTranslation });

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
          <Timer {...timerProps} />
        </Box>
      </Stack>
    </CollapsibleSection>
  );
};
