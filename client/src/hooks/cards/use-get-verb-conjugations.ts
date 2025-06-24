import { useQuery } from "@tanstack/react-query";
import { getVerbConjugationsQuery } from "../../queries/cards";
import { ApiResponse } from "../../models/api";
import { VerbConjugations } from "../../models/verb";

export const useGetVerbConjugations = (
  infinitive: string,
  enabled: boolean
) => {
  const getVerbConjugations = useQuery<ApiResponse<VerbConjugations | null>>(
    getVerbConjugationsQuery(infinitive, enabled)
  );
  return getVerbConjugations;
};
