import { AxiosError, AxiosPromise } from "axios";
import httpClient from "../http-client";
import {
  ApiResponse,
  AuthUserModel,
  LoginPayload,
  PatchAccountPayload,
  SignupPayload,
} from "../models/api";
import { handleError } from "../utils/error-handler";

const apiPostfix = "/auth";

export const AuthService = {
  async login(credentials: LoginPayload) {
    const response = await httpClient.post<
      ApiResponse<AuthUserModel>,
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

  async signup(credentials: SignupPayload) {
    const response = await httpClient.post<
      ApiResponse,
      AxiosPromise<ApiResponse>,
      SignupPayload
    >(`${apiPostfix}/signup`, credentials);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async patchAccount(patchData: PatchAccountPayload) {
    const response = await httpClient.patch<
      ApiResponse,
      AxiosPromise<ApiResponse>,
      PatchAccountPayload
    >(`${apiPostfix}/account`, patchData);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },
};
