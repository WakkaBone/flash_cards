import { useEffect, useState } from "react";
import { useDebounce } from "../use-debounce";
import { GetUsersFilters, RolesExtended } from "../../models/api";
import { SelectChangeEvent } from "@mui/material";
import { Roles } from "../../models/user";
import { AllOptionString } from "../../models/shared";
import { FilterTypes } from "../../components/users-table/users-filters";

export const defaultFilters = { role: AllOptionString.All };

export const useUsersTableFilters = (
  initialFilters: GetUsersFilters,
  enabledFilters = [
    FilterTypes.Search,
    FilterTypes.DateRange,
    FilterTypes.CurrentStreak,
    FilterTypes.LongestSteak,
    FilterTypes.NumberOfCards,
    FilterTypes.Role,
  ]
) => {
  const [filters, setFilters] = useState<GetUsersFilters>(initialFilters);
  const [search, setSearch] = useState<string>(initialFilters.search || "");
  const [currentStreak, setCurrentStreak] = useState<string | undefined>(
    initialFilters.currentStreak
  );
  const [longestStreak, setLongestStreak] = useState<string | undefined>(
    initialFilters.longestStreak
  );
  const [numberOfCards, setNumberOfCards] = useState<string | undefined>(
    initialFilters.numberOfCards
  );

  const debouncedSearch = useDebounce(search, 500);
  const debouncedNumberOfCards = useDebounce(numberOfCards, 500);
  const debouncedLongestStreak = useDebounce(longestStreak, 500);
  const debouncedCurrentStreak = useDebounce(currentStreak, 500);

  useEffect(() => {
    if (!enabledFilters?.includes(FilterTypes.Search)) return;
    setFilters((prevFilters) => ({
      ...prevFilters,
      search: debouncedSearch,
    }));
  }, [debouncedSearch, enabledFilters]);

  useEffect(() => {
    if (!enabledFilters?.includes(FilterTypes.NumberOfCards)) return;
    setFilters((prevFilters) => ({
      ...prevFilters,
      numberOfCards: debouncedNumberOfCards,
    }));
  }, [debouncedNumberOfCards, enabledFilters]);

  useEffect(() => {
    if (!enabledFilters?.includes(FilterTypes.CurrentStreak)) return;
    setFilters((prevFilters) => ({
      ...prevFilters,
      currentStreak: debouncedCurrentStreak,
    }));
  }, [debouncedCurrentStreak, enabledFilters]);

  useEffect(() => {
    if (!enabledFilters?.includes(FilterTypes.LongestSteak)) return;
    setFilters((prevFilters) => ({
      ...prevFilters,
      longestStreak: debouncedLongestStreak,
    }));
  }, [debouncedLongestStreak, enabledFilters]);

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

  const handleCurrentStreak = (event: React.ChangeEvent<HTMLInputElement>) =>
    setCurrentStreak(event.target.value);

  const handleLongestStreak = (event: React.ChangeEvent<HTMLInputElement>) =>
    setLongestStreak(event.target.value);

  const handleRole = (e: SelectChangeEvent<RolesExtended>) =>
    setFilters((prevFilters) => ({
      ...prevFilters,
      role: e.target.value as Roles,
    }));

  const handleReset = () => {
    setSearch("");
    setNumberOfCards("");
    setCurrentStreak("");
    setLongestStreak("");
    setFilters(defaultFilters);
  };

  return {
    filters,
    search,
    numberOfCards,
    currentStreak,
    longestStreak,
    handleSearch,
    handleDateRange,
    handleNumberOfCards,
    handleCurrentStreak,
    handleLongestStreak,
    handleRole,
    handleReset,
  };
};
