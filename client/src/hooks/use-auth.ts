import { MutateOptions, useMutation } from "@tanstack/react-query";
import { loginMutation } from "../mutations/auth";
import { ApiResponse, LoginPayload } from "../models/api";
import { logoutMutation } from "../mutations/auth";
import { useState } from "react";
import { toast } from "react-toastify";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { mutate: loginMutate, ...loginRest } = useMutation(loginMutation);
  const { mutate: logoutMutate, ...logoutRest } = useMutation(logoutMutation);

  const login = (
    credentials: LoginPayload,
    options?: MutateOptions<ApiResponse, Error, LoginPayload>
  ) => {
    loginMutate(credentials, {
      ...options,
      onError: (...args) => {
        toast("Failed to log in", { type: "error" });
        options?.onError?.(...args);
      },
    });
  };

  const logout = (options?: MutateOptions<ApiResponse, Error>) => {
    logoutMutate(undefined, {
      ...options,
      onError: (...args) => {
        toast("Failed to log out", { type: "error" });
        options?.onError?.(...args);
      },
    });
    setIsAuthenticated(false);
  };

  return {
    login,
    logout,
    loginMutation: { ...loginRest },
    logoutMutation: { ...logoutRest },
    isAuthenticated,
  };
};

export { useAuth };
