export enum PracticeModes {
  ethInput,
  hteInput,
  ethSelect,
  hteSelect,
  browse,
  verbForms,
}

export type PracticeSettingsType = {
  interval: number;
  voiceEnabled: boolean;
  voiceWithTranslation?: boolean;
  lastCards?: number;
};
