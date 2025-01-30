import {
  getDocs,
  addDoc,
  collection,
  query,
  where,
  doc,
  updateDoc,
  increment,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { CardModel } from "../models/card";
import { COLLECTIONS, STATISTICS_ACTIONS } from "../constants";

type GetCardsFilters = {
  category?: number;
  search?: string;
};
export const CardsService = {
  getCards: async (filters?: GetCardsFilters) => {
    let queryRef = query(collection(db, COLLECTIONS.cards));
    if (filters?.category) {
      queryRef = query(queryRef, where("category", "==", filters.category));
    }
    if (filters?.search) {
      queryRef = query(queryRef, where("english", "==", filters.search));
    }

    const { docs } = await getDocs(queryRef);
    return docs.map((doc) => ({ id: doc.id, ...(doc.data() as CardModel) }));
  },

  addCard: async (card: CardModel) => {
    const response = await addDoc(collection(db, COLLECTIONS.cards), card);
    return response;
  },

  updateCard: async (id: string, card: CardModel) => {
    const cardRef = doc(db, COLLECTIONS.cards, id);
    await updateDoc(cardRef, card);
  },

  updateStatistics: async (id: string, action: STATISTICS_ACTIONS) => {
    const cardRef = doc(db, COLLECTIONS.cards, id);
    await updateDoc(cardRef, {
      [`statistics.${
        action === STATISTICS_ACTIONS.Correct ? "correct" : "wrong"
      }`]: increment(1),
    });
  },

  markLearned: async (id: string) => {
    const cardRef = doc(db, COLLECTIONS.cards, id);
    await updateDoc(cardRef, { isLearned: true });
  },

  deleteCard: async (id: string) => {
    const cardRef = doc(db, COLLECTIONS.cards, id);
    await deleteDoc(cardRef);
  },
};
