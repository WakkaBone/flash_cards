import { SelectChangeEvent, Stack } from "@mui/material";
import { PageTitle } from "../components/layout/page-title";
import { PracticeModeSelect } from "../components/practice-mode-select/practice-mode-select";
import {
  CardsFilters,
  FilterTypes,
} from "../components/cards-filters/cards-filters";
import { PracticeSettings } from "../components/practice-settings/practice-settings";
import { GetCardsFilters } from "../models/filters";
import { useCallback, useState } from "react";
import { PracticeModes, PracticeSettingsType } from "../models/practice-mode";
import { CardWrapper } from "../components/card/card-wrapper";
import { TimerContextProvider } from "../context/timer-context";

export type PracticeFilersType = Omit<GetCardsFilters, "search">;

const defaultFilters = {
  includeLearned: false,
};

const DEFAULT_INTERVAL = 3;

const defaultSettings = {
  interval: DEFAULT_INTERVAL,
  voiceEnabled: true,
};

export const PracticePage = () => {
  const [practiceMode, setPracticeMode] = useState(PracticeModes.browse);
  const handleChangePracticeMode = useCallback(
    (e: SelectChangeEvent<unknown>) => {
      setPracticeMode(e.target.value as PracticeModes);
    },
    []
  );

  const [settings, setSettings] =
    useState<PracticeSettingsType>(defaultSettings);
  const [filters, setFilters] = useState<PracticeFilersType>(defaultFilters);

  const appliedFilters: PracticeFilersType = {
    ...filters,
    lastCards: settings.lastCards,
  };

  return (
    <TimerContextProvider>
      <PageTitle>Practice</PageTitle>
      <Stack mb={2}>
        <PracticeModeSelect
          value={practiceMode}
          onChange={handleChangePracticeMode}
        />
      </Stack>
      <PracticeSettings
        practiceMode={practiceMode}
        setSettings={setSettings}
        settings={settings}
      />
      <CardsFilters
        filters={filters}
        onChange={setFilters}
        enabledFilters={[
          FilterTypes.DateRange,
          FilterTypes.Category,
          FilterTypes.IncludeLearned,
          FilterTypes.MistakesThreshold,
          FilterTypes.Priority,
        ]}
      />
      <CardWrapper
        filters={appliedFilters}
        settings={settings}
        practiceMode={practiceMode}
      />
    </TimerContextProvider>
  );
};
