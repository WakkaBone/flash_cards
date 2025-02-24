export const calculateDaysDiff = (date1: Date, date2: Date) => {
  [date1, date2].forEach((date) => date.setHours(0, 0, 0, 0));
  return (date1.getTime() - date2.getTime()) / (1000 * 3600 * 24);
};
