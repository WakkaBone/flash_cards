export const buildUrl = (
  path: string,
  params?: Record<string, string | number | boolean | Date>
) => {
  const safeParams = params
    ? Object.fromEntries(
        Object.entries(params).map(([key, value]) => [
          key,
          String(value).trim(),
        ])
      )
    : {};
  const url = new URL(
    (process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api") + path
  );
  const urlParams = new URLSearchParams(safeParams);
  url.search = urlParams.toString();
  return url.toString();
};
