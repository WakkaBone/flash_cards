import { SelectChangeEvent, Stack } from "@mui/material";
import { PageTitle } from "../components/layout/page-title";
import { PracticeModeSelect } from "../components/practice-mode-select/practice-mode-select";
import {
  CardsFilters,
  FilterTypes,
} from "../components/cards-filters/cards-filters";
import { PracticeSettings } from "../components/practice-settings/practice-settings";
import { GetCardsFilters } from "../models/filters";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PracticeModes, PracticeSettingsType } from "../models/practice-mode";
import { CardWrapper } from "../components/card/card-wrapper";
import { TimerContextProvider } from "../context/timer-context";
import { MAIN_CATEGORIES } from "../constants";
import { VERBS_CATEGORY } from "../components/category-select/category-autocomplete";

export type PracticeFilersType = Omit<GetCardsFilters, "search">;

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

  const defaultFilters: PracticeFilersType = useMemo(() => {
    const filters: PracticeFilersType = {
      includeLearned: false,
    };
    if (practiceMode === PracticeModes.verbForms) {
      filters.category = VERBS_CATEGORY;
    }
    return filters;
  }, [practiceMode]);

  const [filters, setFilters] = useState<PracticeFilersType>(defaultFilters);

  const appliedFilters: PracticeFilersType = {
    ...filters,
    lastCards: settings.lastCards,
  };

  useEffect(() => {
    if (practiceMode === PracticeModes.verbForms) {
      //TODO: fix 2nd request sent when manually changing filters
      setFilters((prev) => ({
        ...prev,
        category: VERBS_CATEGORY,
      }));
    }
  }, [practiceMode]);

  const onChangeFilters = useCallback(
    (newFilters: GetCardsFilters) => {
      if (
        practiceMode === PracticeModes.verbForms &&
        newFilters.category?.id !== MAIN_CATEGORIES.verb
      ) {
        newFilters.category = VERBS_CATEGORY;
      }
      setFilters(newFilters);
    },
    [setFilters, practiceMode]
  );

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
        filters={{ ...filters }}
        onChange={onChangeFilters}
        enabledFilters={[
          FilterTypes.DateRange,
          FilterTypes.Category,
          FilterTypes.IncludeLearned,
          FilterTypes.MistakesThreshold,
          FilterTypes.Priority,
          FilterTypes.NegativeBalance,
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
