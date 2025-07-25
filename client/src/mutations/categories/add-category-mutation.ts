import { UseMutationOptions } from "@tanstack/react-query";
import { AddCategoryPayload, ApiResponse } from "../../models/api";
import { CategoriesService } from "../../services";

export const addCategoryMutation: UseMutationOptions<
  ApiResponse,
  Error,
  AddCategoryPayload
> = {
  mutationFn: async (category) => await CategoriesService.addCategory(category),
};
