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
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { CardModel, Categories } from "../models/card";
import { COLLECTIONS, STATISTICS_ACTIONS } from "../constants";
import { Statistics } from "../models/statistics";

type GetCardsFilters = {
  category?: number;
  search?: string;
  includeLearned?: boolean;
};
export const CardsService = {
  getCards: async (filters?: GetCardsFilters) => {
    let queryRef = query(collection(db, COLLECTIONS.cards));

    if (filters?.includeLearned === false) {
      queryRef = query(queryRef, where("isLearned", "==", false));
    }
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

  getStatistics: async () => {
    let queryRef = query(collection(db, COLLECTIONS.cards));
    const nounsQuery = query(
      queryRef,
      where("category", "==", Categories.Noun)
    );
    const adjectivesQuery = query(
      queryRef,
      where("category", "==", Categories.Adjective)
    );
    const verbsQuery = query(
      queryRef,
      where("category", "==", Categories.Verb)
    );
    const otherQuery = query(
      queryRef,
      where("category", "==", Categories.Other)
    );
    const allQuery = query(queryRef);
    const learnedQuery = query(queryRef, where("isLearned", "==", true));
    const lastAddedQuery = query(
      collection(db, COLLECTIONS.cards),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const mostMistakesQuery = query(
      collection(db, COLLECTIONS.cards),
      orderBy("statistics.wrong", "desc"),
      limit(1)
    );

    const lastAddedWordSnapshot = await getDocs(lastAddedQuery);
    const mostMistakesSnapshot = await getDocs(mostMistakesQuery);
    const lastAddedCard = lastAddedWordSnapshot.docs[0].data() as CardModel;
    const mostMistakesCard = mostMistakesSnapshot.docs[0].data() as CardModel;

    const statistics: Statistics = {
      totalCards: (await getDocs(allQuery)).size,
      totalLearnedCards: (await getDocs(learnedQuery)).size,
      lastAdded: lastAddedCard
        ? `${lastAddedCard.hebrew} - ${lastAddedCard.english}`
        : "",
      mostMistakes: mostMistakesCard
        ? `${mostMistakesCard.hebrew} - ${mostMistakesCard.english}`
        : "",
      totalNouns: (await getDocs(nounsQuery)).size,
      totalAdjectives: (await getDocs(adjectivesQuery)).size,
      totalVerbs: (await getDocs(verbsQuery)).size,
      totalOther: (await getDocs(otherQuery)).size,
    };

    return statistics;
  },
};
