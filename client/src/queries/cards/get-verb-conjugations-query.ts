import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { CardsService } from "../../services";
import { QUERY_KEYS } from "../../constants";
import { VerbConjugations } from "../../models/verb";

export const getVerbConjugationsQuery = (
  infinitive: string,
  enabled: boolean
): DefinedInitialDataOptions<ApiResponse<VerbConjugations | null>> => ({
  initialData: { isSuccess: false },
  queryKey: [QUERY_KEYS.verbConjugations, infinitive],
  enabled,
  queryFn: async () => await CardsService.getVerbConjugations(infinitive),
});
