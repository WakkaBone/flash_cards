import { UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse, UpdateCategoryPayload } from "../../models/api";
import { CategoriesService } from "../../services/categories-service";

export const updateCategoryMutation: UseMutationOptions<
  ApiResponse,
  Error,
  UpdateCategoryPayload
> = {
  mutationFn: async (category) =>
    await CategoriesService.updateCategory(category),
};
