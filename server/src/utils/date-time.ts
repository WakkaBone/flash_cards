import { Timestamp } from "firebase/firestore";
import { CounterByDate } from "../models/shared";

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

export const getCountByDate = <T extends { [key: string]: any }>(
  entities: T[],
  field: keyof T,
  range?: { from: Date; to: Date }
): CounterByDate =>
  entities.reduce((acc, entity) => {
    const fieldExists = !!entity[field];
    const isDate = fieldExists && !isNaN(Date.parse(entity[field]));
    const dateString = isDate && entity[field].split("T")[0];
    const isInRange = !range
      ? true
      : dateString &&
        range &&
        range.from <= new Date(dateString) &&
        new Date(dateString) <= range.to;
    dateString && isInRange && (acc[dateString] = (acc[dateString] || 0) + 1);
    return acc;
  }, {} as CounterByDate);
