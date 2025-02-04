import { useState } from "react";
import { WordCard } from "../components/card/card";
import { PageTitle } from "../components/layout/page-title";
import { PracticeFilters } from "../components/practice-filters/practice-filters";

export enum PracticeModes {
  eth,
  hte,
  browse,
}

export type PracticeFilersType = {
  includeLearned: boolean;
  category?: number;
  from?: Date | null;
  to?: Date | null;
};

const defaultFilters = {
  category: 0,
  includeLearned: false,
  from: null,
  to: null,
};

export const PracticePage = () => {
  const [practiceMode, setPracticeMode] = useState(PracticeModes.browse);

  const [filters, setFilters] = useState<PracticeFilersType>(defaultFilters);
  const resetFilters = () => setFilters(defaultFilters);

  return (
    <>
      <PageTitle>Practice</PageTitle>
      <PracticeFilters
        filters={filters}
        resetFilters={resetFilters}
        setFilters={setFilters}
        practiceMode={practiceMode}
        setPracticeMode={setPracticeMode}
      />
      <WordCard mode={practiceMode} filters={filters} />
    </>
  );
};
