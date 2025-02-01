import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../constants";
import { UserModel } from "../models/user";

export const AuthService = {
  getUserByUsername: async (username: string) => {
    let queryRef = query(collection(db, COLLECTIONS.users));
    queryRef = query(queryRef, where("username", "==", username));

    const { docs } = await getDocs(queryRef);
    return docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as UserModel),
    }))[0];
  },
};
