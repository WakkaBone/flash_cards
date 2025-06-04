import { AxiosError, AxiosPromise } from "axios";
import httpClient from "../http-client";
import { ApiResponse } from "../models/api";
import { getAppVersion } from "../utils/version";
import { handleError } from "../utils/error-handler";
import { APIS } from "../constants";

export class VersionsService {
  private static apiPostfix = APIS.version;

  static getClientAppVersion() {
    return getAppVersion();
  }
  static async getServerAppVersion() {
    const response = await httpClient.get<
      ApiResponse<string>,
      AxiosPromise<ApiResponse<string>>
    >(this.apiPostfix);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }
}
