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
  getDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { CardModel, CardModelDto } from "../models/card";
import { COLLECTIONS, MAIN_CATEGORIES, STATISTICS_ACTIONS } from "../constants";
import { Statistics } from "../models/statistics";
import { CategoriesService } from "./categories-service";
import { UsersService } from "./users-service";

export type GetCardsFilters = {
  category?: string;
  search?: string;
  searchExact?: string;
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

    if (filters.searchExact) {
      queries.push(where("english", "==", filters.searchExact));
    }

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

    //TODO: pagination
    if (filters.page && filters.pageSize) {
      queries.push(limit(filters.pageSize));
    }

    const { docs } = await getDocs(query(queryRef, ...queries));

    const cards = await Promise.all(
      docs.map(async (doc) => {
        const cardData = doc.data() as CardModel;
        const category = await CategoriesService.getCategoryById(
          cardData.category
        );

        const cardDto: CardModelDto = {
          id: doc.id,
          ...cardData,
          category: { id: cardData.category, label: category.label },
          createdAt: cardData.createdAt.toDate().toISOString(),
        };
        return cardDto;
      })
    );

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

  getCardById: async (id: string) => {
    const cardRef = doc(db, COLLECTIONS.cards, id);
    const card = await getDoc(cardRef);
    return card.data() as CardModel;
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

  getStatistics: async (username: string) => {
    let queryRef = query(collection(db, COLLECTIONS.cards));
    const nounsQuery = query(
      queryRef,
      where("category", "==", MAIN_CATEGORIES.noun)
    );
    const adjectivesQuery = query(
      queryRef,
      where("category", "==", MAIN_CATEGORIES.adjective)
    );
    const verbsQuery = query(
      queryRef,
      where("category", "==", MAIN_CATEGORIES.verb)
    );
    const otherQuery = query(
      queryRef,
      where("category", "==", MAIN_CATEGORIES.other)
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

    const { currentStreak, lastPractice, longestStreak } =
      await UsersService.getStreakData(username);

    const statistics: Statistics = {
      totalCards: (await getDocs(allQuery)).size,
      totalLearnedCards: (await getDocs(learnedQuery)).size,
      lastAdded: lastAddedCard
        ? `${lastAddedCard.hebrew} - ${lastAddedCard.english}`
        : "",
      mostMistakes: mostMistakesCard
        ? `${mostMistakesCard.hebrew} - ${mostMistakesCard.english}`
        : "",
      currentStreak,
      longestStreak,
      lastPractice: lastPractice.toISOString(),
    };

    return statistics;
  },
};
