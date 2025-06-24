import { subDays, format } from "date-fns";

export const DATE_TIME_FORMAT = "dd/MM/yyyy HH:mm";

export const addSeconds = (seconds: string | number) => {
  const secondsInt = typeof seconds === "string" ? parseInt(seconds) : seconds;
  return new Date(new Date().setSeconds(new Date().getSeconds() + secondsInt));
};

export const isValidDate = (dateString: string) =>
  !isNaN(Date.parse(dateString));

export const formatDateForChart = (date: Date) =>
  date.toISOString().split("T")[0];

export const getOneWeekTimeRange = () => {
  const now = new Date();
  const oneWeekAgo = subDays(now, 7);

  return { from: oneWeekAgo, to: now };
};

export const formatDateTime = (
  string?: string | number | Date,
  desiredFormat = DATE_TIME_FORMAT,
  fallbackValue = ""
) => (string ? format(new Date(string), desiredFormat) : fallbackValue);
