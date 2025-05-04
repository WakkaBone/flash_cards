import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { importCsvMutation } from "../../mutations/cards";
import { toast } from "react-toastify";
import { MutateOptionsEnhanced } from "../../models/mutate-options-enhanced";
import { toastError } from "../../utils/error-handler";

export const useImportCsv = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation(importCsvMutation);
  const importCsv = (
    formData: FormData,
    options?: MutateOptionsEnhanced<ApiResponse, unknown, FormData>
  ) =>
    mutate(formData, {
      onSuccess: (...args) => {
        if (!args[0].isSuccess) return;
        toast("CSV successfully imported", {
          type: "success",
        });

        queryClient.invalidateQueries({ queryKey: ["cards"] });
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

  return { importCsv, isPending };
};
