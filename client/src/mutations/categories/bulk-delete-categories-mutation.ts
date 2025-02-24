import { UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { CategoriesService } from "../../services/categories-service";

type ArgsType = {
  ids: string[];
};
export const bulkDeleteCategoriesMutation: UseMutationOptions<
  ApiResponse,
  Error,
  ArgsType
> = {
  mutationFn: async ({ ids }) =>
    await CategoriesService.bulkDeleteCategories(ids),
};
