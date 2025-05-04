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
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { CardModel, CardModelDto, Priorities } from "../models/card";
import {
  COLLECTIONS,
  MAIN_CATEGORIES,
  MAX_EASE_COEFFICIENT,
  MIN_EASE_COEFFICIENT,
  STATISTICS_ACTIONS,
} from "../constants";
import {
  GetCardDynamicsFilters,
  GetCardsDynamicsDto,
  Statistics,
  StatisticsAdmin,
} from "../models/statistics";
import { CategoriesService } from "./categories-service";
import { UsersService } from "./users-service";
import { getNextReviewDate, getCountByDate } from "../utils/date-time";
import { searchFilterCallback } from "../utils/search-util";
import { UserModel } from "../models/user";
import { DateRange } from "../models/shared";

export type GetCardsFilters = DateRange & {
  category?: string;
  search?: string;
  searchExact?: string;
  includeLearned?: boolean;
  mistakesThreshold?: number;
  priority?: Priorities;
  page?: number;
  pageSize?: number;
  ownerId?: string;
};

export type GetPracticeTimelineFilters = DateRange & {
  action?: STATISTICS_ACTIONS;
};

const mapCardToCardDto = async (
  doc: QueryDocumentSnapshot
): Promise<CardModelDto> => {
  const cardData = doc.data() as CardModel;

  const category = await CategoriesService.getCategoryById(cardData.category);

  const cardDto: CardModelDto = {
    id: doc.id,
    ...cardData,
    category: { id: cardData.category, label: category.label },
    createdAt: cardData.createdAt.toDate().toISOString(),
  };

  return cardDto;
};

export const CardsService = {
  getCards: async (filters: GetCardsFilters = {}): Promise<CardModelDto[]> => {
    let queryRef = query(collection(db, COLLECTIONS.cards));
    const queries = [];

    if (filters.ownerId) {
      queries.push(where("ownerIds", "array-contains", filters.ownerId));
    }

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
    if (filters.priority) {
      queries.push(where("priority", "==", filters.priority));
    }

    //TODO: pagination
    if (filters.page && filters.pageSize) {
      queries.push(limit(filters.pageSize));
    }

    const { docs } = await getDocs(query(queryRef, ...queries));

    const cards = await Promise.all(
      docs.map(async (doc) => mapCardToCardDto(doc))
    );

    if (filters.search) {
      const searchableFields = ["english", "hebrew"];
      return cards.filter((card) =>
        searchFilterCallback(filters.search, card, searchableFields)
      );
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

  updateCard: async (id: string, card: Partial<CardModel>): Promise<void> => {
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

  getStatistics: async function (userId: string) {
    let queryRef = query(
      collection(db, COLLECTIONS.cards),
      where("ownerIds", "array-contains", userId)
    );

    const allQuery = query(queryRef);
    const learnedQuery = query(queryRef, where("isLearned", "==", true));
    const lastAddedQuery = query(
      queryRef,
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const mostMistakesQuery = query(
      queryRef,
      orderBy("statistics.wrong", "desc"),
      limit(1)
    );

    const lastAddedWordSnapshot = await getDocs(lastAddedQuery);
    const mostMistakesSnapshot = await getDocs(mostMistakesQuery);

    const lastAddedCard = lastAddedWordSnapshot.docs[0]
      ? (lastAddedWordSnapshot.docs[0].data() as CardModel)
      : undefined;
    const mostMistakesCard = mostMistakesSnapshot.docs[0]
      ? (mostMistakesSnapshot.docs[0].data() as CardModel)
      : undefined;

    const { currentStreak, lastPractice, longestStreak } =
      await UsersService.getStreakData(userId);

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

  getAdminStatistics: async (userId: string): Promise<StatisticsAdmin> => {
    let cardsQueryRef = query(collection(db, COLLECTIONS.cards));
    let usersQueryRef = query(collection(db, COLLECTIONS.users));

    const totalCards = (await getDocs(cardsQueryRef)).size;
    const totalLearnedCards = (
      await getDocs(query(cardsQueryRef, where("isLearned", "==", true)))
    ).size;
    const totalUsers = (await getDocs(usersQueryRef)).size;

    const lastAddedQuery = query(
      cardsQueryRef,
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const mostMistakesQuery = query(
      cardsQueryRef,
      orderBy("statistics.wrong", "desc"),
      limit(1)
    );
    const longestStreakQuery = query(
      usersQueryRef,
      orderBy("longestStreak", "desc"),
      limit(1)
    );
    const longestActiveStreakQuery = query(
      usersQueryRef,
      orderBy("currentStreak", "desc"),
      limit(1)
    );
    const lastPracticeQuery = query(
      usersQueryRef,
      orderBy("lastPractice", "desc"),
      limit(1)
    );

    const lastAddedWordSnapshot = await getDocs(lastAddedQuery);
    const mostMistakesSnapshot = await getDocs(mostMistakesQuery);
    const longestStreakSnapshot = await getDocs(longestStreakQuery);
    const longestActiveStreakSnapshot = await getDocs(longestActiveStreakQuery);
    const lastPracticeSnapshot = await getDocs(lastPracticeQuery);

    const lastAddedCard = lastAddedWordSnapshot.docs[0]
      ? (lastAddedWordSnapshot.docs[0].data() as CardModel)
      : undefined;
    const mostMistakesCard = mostMistakesSnapshot.docs[0]
      ? (mostMistakesSnapshot.docs[0].data() as CardModel)
      : undefined;
    const longestStreakUser = longestStreakSnapshot.docs[0]
      ? (longestStreakSnapshot.docs[0].data() as UserModel)
      : undefined;
    const longestActiveStreakUser = longestActiveStreakSnapshot.docs[0]
      ? (longestActiveStreakSnapshot.docs[0].data() as UserModel)
      : undefined;
    const lastPracticeUser = lastPracticeSnapshot.docs[0]
      ? (lastPracticeSnapshot.docs[0].data() as UserModel)
      : undefined;

    return {
      totalCards,
      totalLearnedCards,
      lastAdded: lastAddedCard
        ? `${lastAddedCard.hebrew} - ${lastAddedCard.english}`
        : "",
      mostMistakes: mostMistakesCard
        ? `${mostMistakesCard.hebrew} - ${mostMistakesCard.english}`
        : "",
      totalUsers,
      longestActiveStreak: longestActiveStreakUser
        ? `${longestActiveStreakUser.longestStreak} - ${longestActiveStreakUser.username}`
        : "",
      longestStreak: longestStreakUser
        ? `${longestStreakUser.longestStreak} - ${longestStreakUser.username}`
        : "",
      lastPractice: lastPracticeUser
        ? `${(lastPracticeUser.lastPractice as Timestamp)
            .toDate()
            .toISOString()} - ${lastPracticeUser.username}`
        : "",
    };
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

  deleteUsersCards: async function (userId: string) {
    const usersCards = await this.getCards({
      ownerId: userId,
    });
    usersCards.forEach(async (card: CardModelDto) => {
      //remove the card only if it belongs only to the deleted user
      if (card.ownerIds.length === 1) await this.deleteCard(card.id);
    });
  },

  getCardsDynamics: async function (
    filters: GetCardDynamicsFilters
  ): Promise<GetCardsDynamicsDto> {
    const cards = (
      await this.getCards({ ...filters, from: undefined, to: undefined })
    ).map((card: CardModelDto) => ({
      ...card,
      lastReviewDate:
        card.lastReviewDate &&
        (card.lastReviewDate as Timestamp).toDate().toISOString(),
    }));
    const range =
      filters.from && filters.to
        ? { from: filters.from, to: filters.to }
        : undefined;

    const groupedByCreationDate = getCountByDate(cards, "createdAt", range);
    const groupedByLastPracticeDate = getCountByDate(
      cards,
      "lastReviewDate",
      range
    );

    return {
      createdAt: groupedByCreationDate,
      lastPractice: groupedByLastPracticeDate,
    };
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

      // Finally, prioritize based on the priority (higher value means higher priority)
      if (a.priority < b.priority) return -1; // Lower priority, comes later
      if (a.priority > b.priority) return 1; // Higher priority, comes sooner

      return 0;
    });
  },
};
