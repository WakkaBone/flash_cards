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
import { APIS } from "../constants";

export class AuthService {
  private static apiPostfix = APIS.auth;

  static async login(credentials: LoginPayload) {
    const response = await httpClient.post<
      ApiResponse<AuthUserModel>,
      AxiosPromise<ApiResponse>,
      LoginPayload
    >(`${this.apiPostfix}/login`, credentials);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async logout() {
    const response = await httpClient.post<ApiResponse>(
      `${this.apiPostfix}/logout`
    );
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async checkAuth() {
    const response = await httpClient.post<ApiResponse<AuthUserModel>>(
      `${this.apiPostfix}/check-auth`
    );
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async signup(credentials: SignupPayload) {
    const response = await httpClient.post<
      ApiResponse,
      AxiosPromise<ApiResponse>,
      SignupPayload
    >(`${this.apiPostfix}/signup`, credentials);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async patchAccount(patchData: PatchAccountPayload) {
    const response = await httpClient.patch<
      ApiResponse,
      AxiosPromise<ApiResponse>,
      PatchAccountPayload
    >(`${this.apiPostfix}/account`, patchData);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }
}
