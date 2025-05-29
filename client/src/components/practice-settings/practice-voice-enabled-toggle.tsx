import { FormControlLabel, Switch, Tooltip } from "@mui/material";
import { useEffect } from "react";

type VoiceEnabledTogglePropsType = {
  voiceEnabled: boolean;
  setVoiceEnabled: (voiceEnabled: boolean) => void;
  voiceWithTranslation: boolean;
  setVoiceWithTranslation: (voiceWithTranslation: boolean) => void;
};
export const PracticeVoiceEnabledToggle = ({
  voiceEnabled,
  setVoiceEnabled,
  voiceWithTranslation,
  setVoiceWithTranslation,
}: VoiceEnabledTogglePropsType) => {
  useEffect(() => {
    if (voiceEnabled) return;
    setVoiceWithTranslation(false);
  }, [voiceEnabled, setVoiceWithTranslation]);

  return (
    <>
      <Tooltip title="Enable voicing of cards on transition">
        <FormControlLabel
          control={
            <Switch
              checked={voiceEnabled}
              onChange={(_, checked) => setVoiceEnabled(checked)}
              color="primary"
            />
          }
          label="Voice on transition"
        />
      </Tooltip>
      <FormControlLabel
        control={
          <Switch
            checked={voiceWithTranslation}
            onChange={(_, checked) => setVoiceWithTranslation(checked)}
            color="primary"
            disabled={!voiceEnabled}
          />
        }
        label="Voice with translation"
      />
    </>
  );
};
