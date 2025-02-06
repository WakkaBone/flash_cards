import { AxiosError, AxiosPromise } from "axios";
import httpClient from "../http-client";
import { ApiResponse } from "../models/api";
import { getAppVersion } from "../utils/version";
import { handleError } from "../utils/error-handler";

const apiPostfix = "/version";

export const VersionsService = {
  getClientAppVersion() {
    return getAppVersion();
  },
  async getServerAppVersion() {
    const response = await httpClient.get<
      ApiResponse<string>,
      AxiosPromise<ApiResponse<string>>
    >(`${apiPostfix}`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },
};
