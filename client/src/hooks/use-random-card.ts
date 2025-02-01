import { MutateOptions, useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, STATISTICS_ACTIONS } from "../models/api";
import { CardModel } from "../models/card";
import { getRandomCardQuery } from "../queries/get-random-card-query";
import { useEffect, useState } from "react";
import { updateCardStatsMutation } from "../mutations/update-card-stats-mutation";
import { toast } from "react-toastify";

const defaultFilters = { category: 0, includeLearned: false };

export const useRandomCard = () => {
  const [cardId, setCardId] = useState<string>("");
  const [filters, setFilters] = useState<{
    includeLearned: boolean;
    category?: number;
  }>(defaultFilters);
  const {
    data,
    isLoading,
    refetch: getAnotherCard,
  } = useQuery<ApiResponse<CardModel>>(getRandomCardQuery(filters));
  const cardData = data?.data;

  const resetFilters = () => setFilters(defaultFilters);

  useEffect(() => {
    getAnotherCard();
  }, [filters.category, filters.includeLearned, getAnotherCard]);

  useEffect(() => {
    if (!cardData) return;
    setCardId(cardData.id);
  }, [cardData]);

  const { mutate: mutateCardStats } = useMutation(updateCardStatsMutation);
  const updateCardStats = (
    outcome: STATISTICS_ACTIONS,
    options?: MutateOptions<
      ApiResponse,
      unknown,
      { cardId: string; outcome: STATISTICS_ACTIONS },
      unknown
    >
  ) =>
    mutateCardStats(
      { cardId, outcome },
      {
        onSuccess: (data, variables, context) => {
          const isCorrect = variables.outcome === STATISTICS_ACTIONS.Correct;
          toast(isCorrect ? "Correct!" : "Wrong!", {
            type: isCorrect ? "success" : "error",
            autoClose: 500,
          });
          options?.onSuccess?.(data, variables, context);
        },
        onError: (...args) => {
          toast("Something went wrong", { type: "error" });
          options?.onError?.(...args);
        },
      }
    );

  return {
    cardData,
    isLoading,
    getAnotherCard,
    filters,
    setFilters,
    resetFilters,
    updateCardStats,
  };
};
