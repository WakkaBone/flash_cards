import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ApiResponse,
  GetRandomCardResponse,
  STATISTICS_ACTIONS,
} from "../../models/api";
import { getRandomCardQuery } from "../../queries/cards";
import { useCallback, useEffect, useState } from "react";
import { updateCardStatsMutation } from "../../mutations/cards";
import { toast } from "react-toastify";
import { MutateOptionsEnhanced } from "../../models/mutate-options-enhanced";
import { PracticeFilersType } from "../../pages/practice-page";
import { toastError } from "../../utils/error-handler";
import { QUERY_KEYS, TOAST_CONTAINERS_IDS } from "../../constants";
import { PracticeModes } from "../../models/practice-mode";

export const useRandomCard = (
  filters: PracticeFilersType,
  mode: PracticeModes
) => {
  const queryClient = useQueryClient();
  const [cardId, setCardId] = useState<string>("");
  const { data, isLoading, isFetching } = useQuery<GetRandomCardResponse>(
    getRandomCardQuery(filters, mode)
  );

  const cardData = data?.data?.card;
  const options = data?.data?.options || [];

  useEffect(() => {
    cardData && setCardId(cardData.id);
  }, [cardData]);

  const { mutate: mutateCardStats, ...updateStatsRest } = useMutation(
    updateCardStatsMutation
  );
  const updateCardStats = useCallback(
    (
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
                containerId: TOAST_CONTAINERS_IDS.card,
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
      ),
    [cardId, mutateCardStats]
  );

  const getAnotherCard = useCallback(
    () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.randomCard] }),
    [queryClient]
  );

  return {
    cardData,
    options,
    isLoading,
    isFetching,
    getAnotherCard,
    updateCardStats,
    updateStatsRest,
  };
};
