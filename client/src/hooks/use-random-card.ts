import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, STATISTICS_ACTIONS } from "../models/api";
import { CardModel } from "../models/card";
import { getRandomCardQuery } from "../queries/cards";
import { useEffect, useState } from "react";
import { updateCardStatsMutation } from "../mutations/cards";
import { toast } from "react-toastify";
import deepEqual from "deep-equal";
import { MutateOptionsEnhanced } from "../models/mutate-options-enhanced";

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
    if (deepEqual(filters, defaultFilters)) return;
    getAnotherCard();
  }, [filters, getAnotherCard]);

  useEffect(() => {
    if (!cardData) return;
    setCardId(cardData.id);
  }, [cardData]);

  const { mutate: mutateCardStats, ...updateStatsRest } = useMutation(
    updateCardStatsMutation
  );
  const updateCardStats = (
    outcome: STATISTICS_ACTIONS,
    options?: MutateOptionsEnhanced<
      ApiResponse,
      unknown,
      { cardId: string; outcome: STATISTICS_ACTIONS }
    >
  ) =>
    mutateCardStats(
      { cardId, outcome },
      {
        onSuccess: (data, variables, context) => {
          const isCorrect = variables.outcome === STATISTICS_ACTIONS.Correct;
          !options?.hideToast &&
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
        onSettled(data, error, variables, context) {
          if (!data?.isSuccess)
            toast("Something went wrong", { type: "error" });
          options?.onSettled?.(data, error, variables, context);
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
    updateStatsRest,
  };
};
