import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, UpdateCategoryPayload } from "../models/api";
import { toast } from "react-toastify";
import { MutateOptionsEnhanced } from "../models/mutate-options-enhanced";
import { toastError } from "../utils/error-handler";
import { updateCategoryMutation } from "../mutations/categories";
import { MAIN_CATEGORIES } from "../constants";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation(updateCategoryMutation);

  const updateCategory = (
    category: UpdateCategoryPayload,
    options?: MutateOptionsEnhanced<ApiResponse, unknown, UpdateCategoryPayload>
  ) => {
    const forbiddenIds = Object.values(MAIN_CATEGORIES);
    const canDelete = !forbiddenIds.includes(category.id);
    if (!canDelete) {
      toastError({ message: "You cannot edit one of the main categories" });
      return;
    }

    mutate(category, {
      onSuccess: (...args) => {
        args[0].isSuccess &&
          toast("Category updated successfully", { type: "success" });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        options?.onSuccess?.(...args);
      },
      onError: (...args) => {
        toastError(args[0]);
        options?.onError?.(...args);
      },
      onSettled(data, error, variables, context) {
        if (!data?.isSuccess) toastError(data?.error);
        options?.onSettled?.(data, error, variables, context);
      },
    });
  };

  return { updateCategory, ...rest };
};
