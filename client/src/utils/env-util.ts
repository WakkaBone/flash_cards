import { API_BASE_URL_DEV, API_BASE_URL_PROD } from "../constants";

export const getApiBaseUrl = () =>
  process.env.NODE_ENV === "production" ? API_BASE_URL_PROD : API_BASE_URL_DEV;
