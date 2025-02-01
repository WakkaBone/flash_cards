import httpClient from "../http-client";
import { ApiResponse, LoginPayload } from "../models/api";

const apiPostfix = "/auth";

export const AuthService = {
  async login(credentials: LoginPayload) {
    const { data: response } = await httpClient.post<
      ApiResponse,
      ApiResponse,
      LoginPayload
    >(`${apiPostfix}/login`, credentials, { withCredentials: true });
    return response;
  },

  async logout() {
    const { data: response } = await httpClient.post<ApiResponse, ApiResponse>(
      `${apiPostfix}/logout`,
      undefined,
      { withCredentials: true }
    );
    return response;
  },
};
