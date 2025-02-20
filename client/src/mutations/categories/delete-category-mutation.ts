import { UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { CategoriesService } from "../../services/categories-service";

type ArgsType = {
  categoryId: string;
};
export const deleteCategoryMutation: UseMutationOptions<
  ApiResponse,
  Error,
  ArgsType
> = {
  mutationFn: async ({ categoryId }) =>
    await CategoriesService.deleteCategory(categoryId),
};
