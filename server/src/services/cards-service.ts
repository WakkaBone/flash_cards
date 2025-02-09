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
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { CardModel, CardModelDto, Categories } from "../models/card";
import { COLLECTIONS, STATISTICS_ACTIONS } from "../constants";
import { Statistics } from "../models/statistics";

export type GetCardsFilters = {
  category?: number;
  search?: string;
  includeLearned?: boolean;
  from?: Date;
  to?: Date;
  mistakesThreshold?: number;
  page?: number;
  pageSize?: number;
};

export const CardsService = {
  getCards: async (filters: GetCardsFilters = {}) => {
    let queryRef = query(collection(db, COLLECTIONS.cards));
    const queries = [];

    if (filters.from) {
      queries.push(where("createdAt", ">", Timestamp.fromDate(filters.from)));
    }
    if (filters.to) {
      queries.push(where("createdAt", "<", Timestamp.fromDate(filters.to)));
    }

    if (filters.includeLearned === false) {
      queries.push(where("isLearned", "==", false), orderBy("isLearned"));
    }
    if (filters.category) {
      queries.push(where("category", "==", filters.category));
    }
    if (filters.mistakesThreshold) {
      queries.push(where("statistics.wrong", ">=", filters.mistakesThreshold));
    }

    //pagination
    //TODO finish
    if (filters.page && filters.pageSize) {
      queries.push(limit(filters.pageSize));
    }

    const { docs } = await getDocs(query(queryRef, ...queries));

    const cards = docs.map((doc) => {
      const cardData = doc.data() as CardModel;
      const cardDto: CardModelDto = {
        id: doc.id,
        ...cardData,
        createdAt: cardData.createdAt.toDate().toISOString(),
      };
      return cardDto;
    });

    if (filters.search) {
      return cards.filter((card) => {
        const searchableFields = ["english", "hebrew"];
        return searchableFields.some((field) =>
          card[field]
            ? card[field]
                .trim()
                .toLowerCase()
                .includes(filters.search.trim().toLowerCase())
            : false
        );
      });
    }

    return cards;
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
