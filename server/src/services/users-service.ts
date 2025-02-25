import {
  getDocs,
  collection,
  query,
  where,
  Timestamp,
  doc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { ACCESS_TOKEN_KEY, COLLECTIONS } from "../constants";
import { TimelinePoint, UserModel } from "../models/user";
import { Request } from "express";
import { decodeToken, JwtPayload } from "../utils/jwt-util";
import { calculateDaysDiff } from "../utils/date-time";

export const UsersService = {
  getUserByUsername: async (username: string) => {
    let queryRef = query(collection(db, COLLECTIONS.users));
    queryRef = query(queryRef, where("username", "==", username));

    const { docs } = await getDocs(queryRef);
    return docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as UserModel),
    }))[0];
  },

  updateLastPractice: async function (username: string) {
    const user: UserModel = await this.getUserByUsername(username);
    const userRef = doc(db, COLLECTIONS.users, user.id);

    const currentStreak = user.currentStreak;
    const updates: Partial<UserModel> = { lastPractice: serverTimestamp() };

    const lastPractice = user.lastPractice
      ? (user.lastPractice as Timestamp).toDate()
      : null;

    //handle the scenario when user hasnt practiced before
    if (!lastPractice) {
      updates.currentStreak = 1;
      updates.longestStreak = 1;
      await updateDoc(userRef, updates);
      return;
    }

    const daysSinceLastPractice = calculateDaysDiff(new Date(), lastPractice);

    let newStreakValue = currentStreak;
    //reset streak if last practice was more than a day ago
    if (daysSinceLastPractice > 1) newStreakValue = 1;
    //increment streak if last practice was 1 day ago
    if (daysSinceLastPractice === 1) newStreakValue = currentStreak + 1;

    updates.currentStreak = newStreakValue;

    //update longestStreak if new value is greater
    if (newStreakValue > user.longestStreak)
      updates.longestStreak = newStreakValue;

    await updateDoc(userRef, updates);
  },

  updateUser: async function (username: string, data: Partial<UserModel>) {
    const user: UserModel = await this.getUserByUsername(username);
    const userRef = doc(db, COLLECTIONS.users, user.id);
    await updateDoc(userRef, data);
  },

  addTimelinePoint: async function (username: string, newPoint: TimelinePoint) {
    const user: UserModel = await this.getUserByUsername(username);
    const userRef = doc(db, COLLECTIONS.users, user.id);
    await updateDoc(userRef, { practiceTimeline: arrayUnion(newPoint) });
  },

  getCurrentUser: (req: Request) => {
    const token = req.cookies[ACCESS_TOKEN_KEY];
    if (!token) throw new Error("Token is missing");

    const decoded = decodeToken(token);
    if (!token) throw new Error("Failed to parse the token");

    return (decoded as JwtPayload).username;
  },

  getStreakData: async function (username: string) {
    const user: UserModel = await this.getUserByUsername(username);
    const lastPractice = (user.lastPractice as Timestamp).toDate();
    const daysSinceLastPractice = calculateDaysDiff(new Date(), lastPractice);

    const streakExpired = daysSinceLastPractice > 1;
    if (streakExpired) await this.updateUser(username, { streak: 0 });

    return {
      longestStreak: user.longestStreak,
      currentStreak: streakExpired ? 0 : user.currentStreak,
      lastPractice: lastPractice,
    };
  },
};
