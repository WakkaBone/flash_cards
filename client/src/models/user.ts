export enum Roles {
  user = "user",
  admin = "admin",
}

export type UserModel = {
  id: string;
  username: string;
  lastPractice: string;
  numberOfCards: number;
  currentStreak: number;
  longestStreak: number;
  role: Roles;
};
