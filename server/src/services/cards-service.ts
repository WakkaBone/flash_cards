import { getDocs, addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import { CardModel } from "../models/card";

export const CardsService = {
  getCards: async () => {
    const { docs } = await getDocs(collection(db, "products"));
    return docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  addCard: async (card: CardModel) => {
    const response = await addDoc(collection(db, "cards"), card);
    return response;
  },
};
