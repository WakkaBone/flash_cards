import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "../models/api";
import { toast } from "react-toastify";
import { MutateOptionsEnhanced } from "../models/mutate-options-enhanced";
import { toastError } from "../utils/error-handler";
import { deleteCategoryMutation } from "../mutations/categories";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const { mutate: mutateDeleteCategory, isPending } = useMutation(
    deleteCategoryMutation
  );
  const deleteCategory = (
    categoryId: string,
    options?: MutateOptionsEnhanced<
      ApiResponse,
      unknown,
      { categoryId: string }
    >
  ) =>
    mutateDeleteCategory(
      { categoryId },
      {
        onSuccess: (...args) => {
          toast("Category deleted", { type: "success" });
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
      }
    );

  return { deleteCategory, isPending };
};
