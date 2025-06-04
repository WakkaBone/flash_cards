import { UseMutationOptions } from "@tanstack/react-query";
import { CardsService } from "../../services";
import { ApiResponse } from "../../models/api";

export const importCsvMutation: UseMutationOptions<
  ApiResponse,
  Error,
  FormData
> = {
  mutationFn: async (formData) => await CardsService.importCsv(formData),
};
