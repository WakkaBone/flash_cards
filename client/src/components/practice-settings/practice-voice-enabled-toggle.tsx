import { FormControlLabel, Switch, Tooltip } from "@mui/material";

type VoiceEnabledTogglePropsType = {
  voiceEnabled: boolean;
  setVoiceEnabled: (voiceEnabled: boolean) => void;
};
export const PracticeVoiceEnabledToggle = ({
  voiceEnabled,
  setVoiceEnabled,
}: VoiceEnabledTogglePropsType) => (
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
);
