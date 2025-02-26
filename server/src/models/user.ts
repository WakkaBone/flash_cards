import { FieldValue, Timestamp } from "firebase/firestore";
import { STATISTICS_ACTIONS } from "../constants";

export type TimelinePoint = {
  dateTime: Timestamp;
  cardId: string;
  action: STATISTICS_ACTIONS;
};

export type TimelinePointDto = Omit<TimelinePoint, "dateTime"> & {
  dateTime: string;
};

export enum Roles {
  user = "user",
  admin = "admin",
}

export type UserModel = {
  username: string;
  password: string;
  lastPractice: FieldValue;
  currentStreak: number;
  longestStreak: number;
  practiceTimeline: TimelinePoint[];
  role: Roles;
  createdAt: FieldValue;
};

export type UserModelDto = Omit<
  UserModel,
  "password" | "practiceTimeline" | "lastPractice" | "createdAt"
> & {
  id: string;
  numberOfCards: number;
  lastPractice: string;
  createdAt: string;
};
