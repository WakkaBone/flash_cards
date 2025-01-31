import { useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";
import { GetCardsFilters } from "../models/api";
import { SelectChangeEvent } from "@mui/material";

export const useCardsTableFilters = (initialFilters: GetCardsFilters) => {
  const [filters, setFilters] = useState<GetCardsFilters>(initialFilters);
  const [search, setSearch] = useState<string>(initialFilters.search || "");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(
    () =>
      setFilters((prevFilters) => ({
        ...prevFilters,
        search: debouncedSearch,
      })),
    [debouncedSearch]
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(event.target.value);

  const handleCategory = (event: SelectChangeEvent<unknown>) =>
    setFilters({ ...filters, category: Number(event.target.value) });

  const handleReset = () => setFilters({});

  return {
    filters,
    search,
    handleSearch,
    handleCategory,
    handleReset,
  };
};
