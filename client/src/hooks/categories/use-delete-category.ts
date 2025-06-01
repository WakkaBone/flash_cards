import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { toast } from "react-toastify";
import { MutateOptionsEnhanced } from "../../models/mutate-options-enhanced";
import { toastError } from "../../utils/error-handler";
import {
  bulkDeleteCategoriesMutation,
  deleteCategoryMutation,
} from "../../mutations/categories";
import { MAIN_CATEGORIES, QUERY_KEYS } from "../../constants";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const { mutate: mutateDeleteCategory, ...deleteCategoryRest } = useMutation(
    deleteCategoryMutation
  );

  const deleteCategory = (
    categoryId: string,
    options?: MutateOptionsEnhanced<
      ApiResponse,
      unknown,
      { categoryId: string }
    >
  ) => {
    const forbiddenIds = Object.values(MAIN_CATEGORIES);
    const canDelete = !forbiddenIds.includes(categoryId);
    if (!canDelete) {
      toastError({ message: "You cannot remove one of the main categories" });
      return;
    }

    mutateDeleteCategory(
      { categoryId },
      {
        onSuccess: (...args) => {
          toast("Category deleted", { type: "success" });
          const queriesToInvalidate = [QUERY_KEYS.categories, QUERY_KEYS.cards];
          queriesToInvalidate.forEach((queryKey) => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
          });
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
  };

  const { mutate: mutateBulkDeleteCategories, ...bulkDeleteCategoriesRest } =
    useMutation(bulkDeleteCategoriesMutation);

  const bulkDeleteCategories = (
    ids: string[],
    options?: MutateOptionsEnhanced<ApiResponse, unknown, { ids: string[] }>
  ) => {
    const forbiddenIds = Object.values(MAIN_CATEGORIES);
    const canDelete = ids.every((id) => !forbiddenIds.includes(id as string));
    if (!canDelete) {
      toastError({ message: "You cannot remove one of the main categories" });
      return;
    }

    mutateBulkDeleteCategories(
      { ids },
      {
        onSuccess: (...args) => {
          toast("Categories deleted", { type: "success" });
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.categories] });
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
  };

  return {
    deleteCategory,
    deleteCategoryRest,
    bulkDeleteCategories,
    bulkDeleteCategoriesRest,
  };
};
