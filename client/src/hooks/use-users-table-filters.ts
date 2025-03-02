import { useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";
import { GetUsersFilters, RolesExtended } from "../models/api";
import { SelectChangeEvent } from "@mui/material";
import { Roles } from "../models/user";
import { AllOptionString } from "../models/shared";

export const defaultFilters = { role: AllOptionString.All };

export const useUsersTableFilters = (initialFilters: GetUsersFilters) => {
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

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      currentStreak: debouncedCurrentStreak,
    }));
  }, [debouncedCurrentStreak]);

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      longestStreak: debouncedLongestStreak,
    }));
  }, [debouncedLongestStreak]);

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
