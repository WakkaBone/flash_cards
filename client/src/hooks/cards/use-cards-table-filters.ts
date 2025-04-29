import { useEffect, useState } from "react";
import { useDebounce } from "../use-debounce";
import { GetCardsFilters, PrioritiesExtended } from "../../models/api";
import { CategoryOptionType } from "../../components/category-select/category-select";
import { SelectChangeEvent } from "@mui/material";
import { AllOptionInt } from "../../models/shared";
import { FilterTypes } from "../../components/cards-filters/cards-filters";

export const defaultFilters: Partial<GetCardsFilters> = {
  includeLearned: false,
  priority: AllOptionInt.All,
};

export const useCardsTableFilters = (
  initialFilters: GetCardsFilters,
  enabledFilters = [
    FilterTypes.Search,
    FilterTypes.DateRange,
    FilterTypes.Category,
    FilterTypes.IncludeLearned,
    FilterTypes.MistakesThreshold,
    FilterTypes.Priority,
  ]
) => {
  const [filters, setFilters] = useState<GetCardsFilters>(initialFilters);
  const [search, setSearch] = useState<string>(initialFilters.search || "");
  const [mistakesThreshold, setMistakesThreshold] = useState<
    string | undefined
  >(initialFilters.mistakesThreshold);

  const debouncedSearch = useDebounce(search, 500);
  const debouncedMistakesThreshold = useDebounce(mistakesThreshold, 500);

  useEffect(() => {
    if (!enabledFilters?.includes(FilterTypes.Search)) return;
    setFilters((prevFilters) => ({
      ...prevFilters,
      search: debouncedSearch,
    }));
  }, [debouncedSearch, enabledFilters]);

  useEffect(() => {
    if (!enabledFilters?.includes(FilterTypes.MistakesThreshold)) return;
    setFilters((prevFilters) => ({
      ...prevFilters,
      mistakesThreshold: debouncedMistakesThreshold,
    }));
  }, [debouncedMistakesThreshold, enabledFilters]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(event.target.value);

  const handleCategory = (
    _: React.SyntheticEvent,
    value: CategoryOptionType | null
  ) => setFilters({ ...filters, category: !value ? null : value });

  const handleIncludeLearned = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFilters({ ...filters, includeLearned: event.target.checked });

  const handleDateRange = (type: "from" | "to", value: Date | null) =>
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));

  const handlePriority = (e: SelectChangeEvent<PrioritiesExtended>) =>
    setFilters((prevFilters) => ({
      ...prevFilters,
      priority: e.target.value as PrioritiesExtended,
    }));

  const handleMistakesThreshold = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setMistakesThreshold(event.target.value);

  const handleReset = () => {
    setSearch("");
    setMistakesThreshold("");
    setFilters(defaultFilters);
  };

  return {
    filters,
    search,
    mistakesThreshold,
    handleSearch,
    handleCategory,
    handleIncludeLearned,
    handleDateRange,
    handleMistakesThreshold,
    handlePriority,
    handleReset,
  };
};
