import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCategoryMutation } from "../mutations/categories/add-category-mutation";
import { AddCategoryPayload, ApiResponse } from "../models/api";
import { MutateOptionsEnhanced } from "../models/mutate-options-enhanced";
import { toast } from "react-toastify";
import { toastError } from "../utils/error-handler";

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation(addCategoryMutation);

  const addCategory = (
    category: AddCategoryPayload,
    options?: MutateOptionsEnhanced<ApiResponse, unknown, AddCategoryPayload>
  ) =>
    mutate(category, {
      onSuccess: (...args) => {
        args[0].isSuccess &&
          toast("Category added successfully", { type: "success" });
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

  return { addCategory, ...rest };
};
