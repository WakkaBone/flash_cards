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
  getDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { ACCESS_TOKEN_KEY, COLLECTIONS } from "../constants";
import { TimelinePoint, TimelinePointDto, UserModel } from "../models/user";
import { Request } from "express";
import { decodeToken, JwtPayload } from "../utils/jwt-util";
import { calculateDaysDiff } from "../utils/date-time";
import { GetPracticeTimelineFilters } from "./cards-service";

export const UsersService = {
  getUserById: async (id: string) => {
    const userRef = doc(db, COLLECTIONS.users, id);
    const user = await getDoc(userRef);
    return user.data() as UserModel;
  },

  getUserByUsername: async (username: string) => {
    let queryRef = query(collection(db, COLLECTIONS.users));
    queryRef = query(queryRef, where("username", "==", username));

    const { docs } = await getDocs(queryRef);
    return docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as UserModel),
    }))[0];
  },

  updateLastPractice: async function (userId: string) {
    const user: UserModel = await this.getUserById(userId);
    const userRef = doc(db, COLLECTIONS.users, userId);

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

  updateUser: async function (userId: string, data: Partial<UserModel>) {
    const userRef = doc(db, COLLECTIONS.users, userId);
    await updateDoc(userRef, data);
  },

  addTimelinePoint: async function (userId: string, newPoint: TimelinePoint) {
    const userRef = doc(db, COLLECTIONS.users, userId);
    await updateDoc(userRef, { practiceTimeline: arrayUnion(newPoint) });
  },

  getUserFromToken: (req: Request) => {
    const token = req.cookies[ACCESS_TOKEN_KEY];
    if (!token) throw new Error("Token is missing");

    const decoded = decodeToken(token);
    if (!token) throw new Error("Failed to parse the token");

    return decoded as JwtPayload;
  },

  getStreakData: async function (userId: string) {
    const user: UserModel = await this.getUserById(userId);
    const lastPractice = (user.lastPractice as Timestamp).toDate();
    const daysSinceLastPractice = calculateDaysDiff(new Date(), lastPractice);

    const streakExpired = daysSinceLastPractice > 1;
    if (streakExpired) await this.updateUser(userId, { streak: 0 });

    return {
      longestStreak: user.longestStreak,
      currentStreak: streakExpired ? 0 : user.currentStreak,
      lastPractice: lastPractice,
    };
  },

  getPracticeTimeline: async function (
    userId: string,
    filters?: GetPracticeTimelineFilters
  ): Promise<TimelinePointDto[]> {
    let practiceTimeline: TimelinePoint[] = (await this.getUserById(userId))
      .practiceTimeline;

    if (filters.action) {
      practiceTimeline = practiceTimeline.filter(
        ({ action }) => action === filters.action
      );
    }

    if (filters.from) {
      practiceTimeline = practiceTimeline.filter(
        ({ dateTime }) => dateTime.toDate() >= filters.from
      );
    }
    if (filters.to) {
      practiceTimeline = practiceTimeline.filter(
        ({ dateTime }) => dateTime.toDate() <= filters.to
      );
    }

    return practiceTimeline.map((point) => ({
      ...point,
      dateTime: point.dateTime.toDate().toISOString(),
    }));
  },
};
