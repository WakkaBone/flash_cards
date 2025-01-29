import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import { CardModel } from "../models/card";

export const CardsService = {
  addCard: async (card: CardModel) => {
    const response = await addDoc(collection(db, "cards"), card);
    return response;
  },
};
