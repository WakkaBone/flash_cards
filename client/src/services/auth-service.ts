import { AxiosError, AxiosPromise } from "axios";
import httpClient from "../http-client";
import { ApiResponse, AuthUserModel, LoginPayload } from "../models/api";
import { handleError } from "../utils/error-handler";

const apiPostfix = "/auth";

export const AuthService = {
  async login(credentials: LoginPayload) {
    const response = await httpClient.post<
      ApiResponse,
      AxiosPromise<ApiResponse>,
      LoginPayload
    >(`${apiPostfix}/login`, credentials);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async logout() {
    const response = await httpClient.post<ApiResponse>(`${apiPostfix}/logout`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async checkAuth() {
    const response = await httpClient.post<ApiResponse<AuthUserModel>>(
      `${apiPostfix}/check-auth`
    );
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },
};
