import { useEffect, useState } from "react";
import { useDebounce } from "../use-debounce";
import { GetCategoriesFilters } from "../../models/api";

export const defaultFilters = {};

export const useCategoriesTableFilters = (
  initialFilters: GetCategoriesFilters
) => {
  const [filters, setFilters] = useState<GetCategoriesFilters>(initialFilters);
  const [search, setSearch] = useState<string>(initialFilters.search || "");
  const [numberOfCards, setNumberOfCards] = useState<string | undefined>(
    initialFilters.numberOfCards
  );

  const debouncedSearch = useDebounce(search, 500);
  const debouncedNumberOfCards = useDebounce(numberOfCards, 500);

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      search: debouncedSearch,
    }));
  }, [debouncedSearch]);

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      numberOfCards: debouncedNumberOfCards,
    }));
  }, [debouncedNumberOfCards]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(event.target.value);

  const handleDateRange = (type: "from" | "to", value: Date | null) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
  };

  const handleNumberOfCards = (event: React.ChangeEvent<HTMLInputElement>) =>
    setNumberOfCards(event.target.value);

  const handleReset = () => {
    setSearch("");
    setNumberOfCards("");
    setFilters(defaultFilters);
  };

  return {
    filters,
    search,
    numberOfCards,
    handleSearch,
    handleDateRange,
    handleNumberOfCards,
    handleReset,
  };
};
