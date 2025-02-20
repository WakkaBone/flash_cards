import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, UpdateCategoryPayload } from "../models/api";
import { toast } from "react-toastify";
import { MutateOptionsEnhanced } from "../models/mutate-options-enhanced";
import { toastError } from "../utils/error-handler";
import { updateCategoryMutation } from "../mutations/categories";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation(updateCategoryMutation);

  const updateCategory = (
    category: UpdateCategoryPayload,
    options?: MutateOptionsEnhanced<ApiResponse, unknown, UpdateCategoryPayload>
  ) =>
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
  return { updateCategory, ...rest };
};
