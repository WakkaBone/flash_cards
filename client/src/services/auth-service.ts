import { AxiosPromise } from "axios";
import httpClient from "../http-client";
import { ApiResponse, LoginPayload } from "../models/api";

const apiPostfix = "/auth";

export const AuthService = {
  async login(credentials: LoginPayload) {
    const { data: response } = await httpClient.post<
      ApiResponse,
      AxiosPromise<ApiResponse>,
      LoginPayload
    >(`${apiPostfix}/login`, credentials);
    return response;
  },

  async logout() {
    const { data: response } = await httpClient.post<ApiResponse>(
      `${apiPostfix}/logout`
    );
    return response;
  },

  async checkAuth() {
    const { data: response } = await httpClient.post<ApiResponse>(
      `${apiPostfix}/check-auth`
    );
    return response;
  },
};
