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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { CardModel, CardModelDto } from "../models/card";
import {
  COLLECTIONS,
  MAIN_CATEGORIES,
  MAX_EASE_COEFFICIENT,
  MIN_EASE_COEFFICIENT,
  STATISTICS_ACTIONS,
} from "../constants";
import { Statistics } from "../models/statistics";
import { CategoriesService } from "./categories-service";
import { UsersService } from "./users-service";
import { getNextReviewDate } from "../utils/date-time";

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
  getCards: async (filters: GetCardsFilters = {}): Promise<CardModelDto[]> => {
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

  getCardById: async (id: string): Promise<CardModel> => {
    const cardRef = doc(db, COLLECTIONS.cards, id);
    const card = await getDoc(cardRef);
    return card.data() as CardModel;
  },

  addCard: async (card: CardModel): Promise<void> => {
    await addDoc(collection(db, COLLECTIONS.cards), card);
  },

  updateCard: async (id: string, card: CardModel): Promise<void> => {
    const cardRef = doc(db, COLLECTIONS.cards, id);
    await updateDoc(cardRef, card);
  },

  updateStatistics: async (
    id: string,
    action: STATISTICS_ACTIONS
  ): Promise<void> => {
    const cardRef = doc(db, COLLECTIONS.cards, id);
    const card = await CardsService.getCardById(id);

    const isCorrect = action === STATISTICS_ACTIONS.Correct;

    const updates: Partial<CardModel> = {
      [`statistics.${isCorrect ? "correct" : "wrong"}`]: increment(1),
      lastReviewDate: serverTimestamp(),
      interval: isCorrect
        ? card.repetitions === 1
          ? 1
          : Math.round(card.interval * card.easinessFactor)
        : 1,
      repetitions: isCorrect ? card.repetitions + 1 : 1,
      easinessFactor: Math.max(
        MIN_EASE_COEFFICIENT,
        Math.min(
          MAX_EASE_COEFFICIENT,
          card.easinessFactor + 0.1 - (5 - (isCorrect ? 4 : 0))
        )
      ),
    };
    updates.nextReviewDate = getNextReviewDate(
      Timestamp.now(),
      updates.interval
    );

    await updateDoc(cardRef, updates);
  },

  updateLastReviewedDate: async (id: string): Promise<void> => {
    const cardRef = doc(db, COLLECTIONS.cards, id);
    await updateDoc(cardRef, { lastReviewDate: serverTimestamp() });
  },

  markLearned: async (id: string): Promise<void> => {
    const cardRef = doc(db, COLLECTIONS.cards, id);
    await updateDoc(cardRef, { isLearned: true });
  },

  deleteCard: async (id: string): Promise<void> => {
    const cardRef = doc(db, COLLECTIONS.cards, id);
    await deleteDoc(cardRef);
  },

  getStatistics: async (username: string) => {
    let queryRef = query(collection(db, COLLECTIONS.cards));
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
      lastPractice: lastPractice ? lastPractice.toISOString() : "",
    };

    return statistics;
  },

  moveCardsToOtherCategory: async function (categoryId: string): Promise<void> {
    const allCardsWithCategory = await this.getCards({
      category: categoryId,
    });
    allCardsWithCategory.forEach(async (card: CardModelDto) => {
      await CardsService.updateCard(card.id, {
        ...card,
        createdAt: Timestamp.fromDate(new Date(card.createdAt)),
        category: MAIN_CATEGORIES.other,
      });
    });
  },

  sortBySRS: (cards: CardModelDto[]): CardModelDto[] => {
    return cards.sort((a, b) => {
      const nextReviewA = getNextReviewDate(
        a.lastReviewDate as Timestamp,
        a.interval
      );
      const nextReviewB = getNextReviewDate(
        b.lastReviewDate as Timestamp,
        b.interval
      );

      // First, prioritize cards that have a shorter interval (soonest nextReviewDate)
      if (nextReviewA < nextReviewB) return -1; // Card A needs to be reviewed sooner
      if (nextReviewA > nextReviewB) return 1; // Card B needs to be reviewed sooner

      // If intervals are the same, prioritize based on repetitions (fewest repetitions first)
      if (a.repetitions < b.repetitions) return -1; // Fewer repetitions means more troublesome
      if (a.repetitions > b.repetitions) return 1; // More repetitions means less troublesome

      // If repetitions are also the same, we can consider the easiness factor
      if (a.easinessFactor < b.easinessFactor) return -1; // Easier cards are less troublesome
      if (a.easinessFactor > b.easinessFactor) return 1; // Harder cards are more troublesome
      return 0;
    });
  },
};
