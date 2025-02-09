import { AxiosError } from "axios";
import { ApiError, ApiResponse } from "../models/api";
import { toast, ToastOptions } from "react-toastify";

const GENERIC_ERROR = {
  isSuccess: false,
  error: { message: "Something went wrong" },
};

export enum ErrorCodes {
  ValidationError = "ValidationError",
  SimilarWordExists = "SimilarWordExists",
}

export const handleError = (error: AxiosError<ApiResponse>): ApiResponse => {
  const errorFromServer = error.response?.data;
  if (!errorFromServer) return GENERIC_ERROR;

  const customError = errorFromServer.error;
  if (!customError) return GENERIC_ERROR;

  const isValidationError = customError.code === ErrorCodes.ValidationError;
  if (!isValidationError) return errorFromServer;
  const firstValidationError = customError.data[0];

  return {
    isSuccess: false,
    error: {
      code: ErrorCodes.ValidationError,
      message: firstValidationError.msg,
    },
  };
};

export const toastError = (error?: ApiError, options?: ToastOptions) =>
  toast(error?.message || GENERIC_ERROR.error.message, {
    type: "error",
    ...options,
  });
