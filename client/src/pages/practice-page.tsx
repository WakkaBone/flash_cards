import { useState } from "react";
import { WordCard } from "../components/card/card";
import { PageTitle } from "../components/layout/page-title";
import { PracticeFilters } from "../components/practice-filters/practice-filters";
import { GetCardsFilters } from "../models/api";

export enum PracticeModes {
  eth,
  hte,
  browse,
}

export type PracticeFilersType = Omit<GetCardsFilters, "search">;

const defaultFilters = {
  includeLearned: false,
};

export const PracticePage = () => {
  const [practiceMode, setPracticeMode] = useState(PracticeModes.browse);

  const [filters, setFilters] = useState<PracticeFilersType>(defaultFilters);
  const resetFilters = () => setFilters(defaultFilters);

  return (
    <>
      <PageTitle>Practice</PageTitle>
      <PracticeFilters
        initialFilters={filters}
        resetFilters={resetFilters}
        onChange={setFilters}
        practiceMode={practiceMode}
        setPracticeMode={setPracticeMode}
      />
      <WordCard mode={practiceMode} filters={filters} />
    </>
  );
};
