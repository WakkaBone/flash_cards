import { FieldValue, Timestamp } from "firebase/firestore";
import { STATISTICS_ACTIONS } from "../constants";

export type TimelinePoint = {
  dateTime: Timestamp;
  cardId: string;
  action: STATISTICS_ACTIONS;
};

export type UserModel = {
  id: string;
  username: string;
  password: string;
  lastPractice: FieldValue;
  currentStreak: number;
  longestStreak: number;
  practiceTimeline: TimelinePoint[];
};
