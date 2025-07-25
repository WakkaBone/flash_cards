import {
  getDocs,
  collection,
  query,
  where,
  Timestamp,
  doc,
  serverTimestamp,
  updateDoc,
  getDoc,
  limit,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { ACCESS_TOKEN_KEY, COLLECTIONS, REFRESH_TOKEN_KEY } from "../constants";
import { UserModel, UserModelDto } from "../models/user";
import { Request } from "express";
import { decodeToken, JwtPayload } from "../utils/jwt-util";
import { calculateDaysDiff } from "../utils/date-time";
import { searchFilterCallback } from "../utils/search-util";
import { mapUserToUserDto } from "../utils/mappers-util";
import { GetUsersFilters } from "../models/filters";

export class UsersService {
  static async getUsers(filters: GetUsersFilters): Promise<UserModelDto[]> {
    let queryRef = query(collection(db, COLLECTIONS.users));
    const queries = [];

    if (filters.searchExact) {
      queries.push(where("username", "==", filters.searchExact));
    }

    if (filters.from) {
      queries.push(where("updatedAt", ">", Timestamp.fromDate(filters.from)));
    }
    if (filters.to) {
      queries.push(where("updatedAt", "<", Timestamp.fromDate(filters.to)));
    }

    if (filters.currentStreak) {
      queries.push(where("currentStreak", ">=", filters.currentStreak));
    }
    if (filters.longestStreak) {
      queries.push(where("longestStreak", ">=", filters.longestStreak));
    }

    if (filters.role) {
      queries.push(where("role", "==", filters.role));
    }

    //TODO: pagination
    if (filters.page && filters.pageSize) {
      queries.push(limit(filters.pageSize));
    }

    const { docs } = await getDocs(query(queryRef, ...queries));

    let users = await Promise.all(
      docs.map(async (doc) => await mapUserToUserDto(doc))
    );

    if (filters.numberOfCards) {
      users = users.filter(
        ({ numberOfCards }) => numberOfCards >= filters.numberOfCards
      );
    }

    if (filters.search) {
      const searchableFields = ["username"];
      return users.filter((user) =>
        searchFilterCallback(filters.search, user, searchableFields)
      );
    }

    return users;
  }

  static async addUser(user: UserModel): Promise<void> {
    await addDoc(collection(db, COLLECTIONS.users), user);
  }

  static async deleteUser(id: string): Promise<void> {
    const userRef = doc(db, COLLECTIONS.users, id);
    await deleteDoc(userRef);
  }

  static async getUserById(id: string): Promise<UserModel> {
    const userRef = doc(db, COLLECTIONS.users, id);
    const user = await getDoc(userRef);
    return user.data() as UserModel;
  }

  static async getUserByUsername(username: string) {
    let queryRef = query(collection(db, COLLECTIONS.users));
    queryRef = query(queryRef, where("username", "==", username));

    const { docs } = await getDocs(queryRef);
    return docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as UserModel),
    }))[0];
  }

  static async updateLastPractice(userId: string): Promise<void> {
    const user = await this.getUserById(userId);
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
  }

  static async updateUser(userId: string, data: Partial<UserModel>) {
    const userRef = doc(db, COLLECTIONS.users, userId);
    await updateDoc(userRef, data);
  }

  static getUserFromToken(req: Request): JwtPayload {
    let token = req.cookies[ACCESS_TOKEN_KEY] || req.cookies[REFRESH_TOKEN_KEY];
    if (!token) throw new Error("Token is missing");

    const decoded = decodeToken(token);
    if (!token) throw new Error("Failed to parse the token");

    return decoded as JwtPayload;
  }
}
