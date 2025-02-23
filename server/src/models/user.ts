import { FieldValue } from "firebase/firestore";

export type UserModel = {
  id: string;
  username: string;
  password: string;
  lastPractice: FieldValue;
  currentStreak: number;
  longestStreak: number;
};
