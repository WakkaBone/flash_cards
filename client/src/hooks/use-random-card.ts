import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, STATISTICS_ACTIONS } from "../models/api";
import { CardModel } from "../models/card";
import { getRandomCardQuery } from "../queries/cards";
import { useEffect, useState } from "react";
import { updateCardStatsMutation } from "../mutations/cards";
import { toast } from "react-toastify";
import { MutateOptionsEnhanced } from "../models/mutate-options-enhanced";
import { PracticeFilersType } from "../pages/practice-page";
import { toastError } from "../utils/error-handler";

export const useRandomCard = (filters: PracticeFilersType) => {
  const queryClient = useQueryClient();
  const [cardId, setCardId] = useState<string>("");
  const { data, isLoading, isFetching } = useQuery<
    ApiResponse<CardModel | null>
  >(getRandomCardQuery(filters));

  const cardData = data?.data;

  useEffect(() => {
    cardData && setCardId(cardData.id);
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
          toastError(args[0]);
          options?.onError?.(...args);
        },
        onSettled(data, error, variables, context) {
          if (!data?.isSuccess) toastError(data?.error);
          options?.onSettled?.(data, error, variables, context);
        },
      }
    );

  return {
    cardData,
    isLoading,
    isFetching,
    getAnotherCard: () =>
      queryClient.invalidateQueries({ queryKey: ["random-card"] }),
    updateCardStats,
    updateStatsRest,
  };
};
