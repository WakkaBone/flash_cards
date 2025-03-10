import { Timestamp } from "firebase/firestore";

export const calculateDaysDiff = (date1: Date, date2: Date) => {
  const dateCopies = [new Date(date1), new Date(date2)];
  dateCopies.forEach((date) => date.setHours(0, 0, 0, 0));
  return (
    (dateCopies[0].getTime() - dateCopies[1].getTime()) / (1000 * 3600 * 24)
  );
};

export function getNextReviewDate(lastReviewDate: Timestamp, interval: number) {
  const nextReviewDate = lastReviewDate.toDate();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  return Timestamp.fromDate(nextReviewDate);
}
