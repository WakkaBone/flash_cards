import { getApiBaseUrl } from "./env-util";

export const buildUrl = (
  path: string,
  params?: Record<string, string | number>
) => {
  const safeParams = params
    ? Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      )
    : {};
  const url = new URL(getApiBaseUrl() + path);
  const urlParams = new URLSearchParams(safeParams);
  url.search = urlParams.toString();
  return url.toString();
};
