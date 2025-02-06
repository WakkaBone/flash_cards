import { useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";
import { GetCardsFilters } from "../models/api";
import { SelectChangeEvent } from "@mui/material";

export const defaultFilters = { includeLearned: false };

export const useCardsTableFilters = (initialFilters: GetCardsFilters) => {
  const [filters, setFilters] = useState<GetCardsFilters>(initialFilters);
  const [search, setSearch] = useState<string>(initialFilters.search || "");
  const [mistakesThreshold, setMistakesThreshold] = useState<
    number | undefined
  >(initialFilters.mistakesThreshold);

  const debouncedSearch = useDebounce(search, 500);
  const debouncedMistakesThreshold = useDebounce(mistakesThreshold, 500);

  useEffect(() => {
    debouncedSearch &&
      setFilters((prevFilters) => ({
        ...prevFilters,
        search: debouncedSearch,
      }));
  }, [debouncedSearch]);

  useEffect(() => {
    debouncedMistakesThreshold &&
      setFilters((prevFilters) => ({
        ...prevFilters,
        mistakesThreshold: debouncedMistakesThreshold,
      }));
  }, [debouncedMistakesThreshold]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(event.target.value);

  const handleCategory = (event: SelectChangeEvent<unknown>) =>
    setFilters({ ...filters, category: Number(event.target.value) });

  const handleIncludeLearned = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFilters({ ...filters, includeLearned: event.target.checked });

  const handleDateRange = (type: "from" | "to", value: Date | null) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
  };

  const handleMistakesThreshold = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setMistakesThreshold(Number(event.target.value));

  const handleReset = () => {
    setSearch("");
    setMistakesThreshold(0);
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
    handleReset,
  };
};
