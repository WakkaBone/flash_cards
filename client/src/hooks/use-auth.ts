import { useMutation } from "@tanstack/react-query";
import {
  checkAuthMutation,
  loginMutation,
  logoutMutation,
} from "../mutations/auth";
import { ApiResponse, LoginPayload } from "../models/api";
import { toast } from "react-toastify";
import { MutateOptionsEnhanced } from "../models/mutate-options-enhanced";

const useAuth = () => {
  const { mutate: loginMutate, ...loginRest } = useMutation(loginMutation);
  const { mutate: logoutMutate, ...logoutRest } = useMutation(logoutMutation);
  const { mutate: checkAuthMutate, ...checkAuthRest } =
    useMutation(checkAuthMutation);

  const login = (
    credentials: LoginPayload,
    options?: MutateOptionsEnhanced<ApiResponse, Error, LoginPayload>
  ) => {
    loginMutate(credentials, {
      ...options,
      onError: (...args) => {
        toast("Failed to log in", { type: "error" });
        options?.onError?.(...args);
      },
    });
  };

  const logout = (options?: MutateOptionsEnhanced<ApiResponse, Error>) => {
    logoutMutate(undefined, {
      ...options,
      onError: (...args) => {
        toast("Failed to log out", { type: "error" });
        options?.onError?.(...args);
      },
    });
  };

  const checkAuth = (options?: MutateOptionsEnhanced<ApiResponse>) =>
    checkAuthMutate(undefined, { ...options });

  return {
    login,
    logout,
    checkAuth,
    loginMutation: { ...loginRest },
    logoutMutation: { ...logoutRest },
    checkAuthMutation: { ...checkAuthRest },
  };
};

export { useAuth };
