import { useMutation } from "@tanstack/react-query";
import { loginMutation, logoutMutation } from "../mutations/auth";
import { ApiResponse, AuthUserModel, LoginPayload } from "../models/api";
import { toastError } from "../utils/error-handler";
import { MutateOptionsEnhanced } from "../models/mutate-options-enhanced";

const useAuth = () => {
  const { mutate: loginMutate, ...loginRest } = useMutation(loginMutation);
  const { mutate: logoutMutate, ...logoutRest } = useMutation(logoutMutation);

  const login = (
    credentials: LoginPayload,
    options?: MutateOptionsEnhanced<
      ApiResponse<AuthUserModel>,
      Error,
      LoginPayload
    >
  ) => {
    loginMutate(credentials, {
      ...options,
      onError: (...args) => {
        toastError(args[0]);
        options?.onError?.(...args);
      },
    });
  };

  const logout = (options?: MutateOptionsEnhanced<ApiResponse, Error>) => {
    logoutMutate(undefined, {
      ...options,
      onError: (...args) => {
        toastError(args[0]);
        options?.onError?.(...args);
      },
    });
  };

  return {
    login,
    logout,
    loginMutation: { ...loginRest },
    logoutMutation: { ...logoutRest },
  };
};

export { useAuth };
