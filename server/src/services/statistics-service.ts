import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "../constants";
import { db } from "../config/firebase";
import { CardModel, CardModelDto } from "../models/card";
import {
  GetCardDynamicsFilters,
  GetCardsDynamicsDto,
  GetUserDynamicsFilters,
  GetUsersDynamicsDto,
  Statistics,
  StatisticsAdmin,
} from "../models/statistics";
import {
  TimelinePoint,
  TimelinePointDto,
  UserModel,
  UserModelDto,
} from "../models/user";
import { calculateDaysDiff, getCountByDate } from "../utils/date-time";
import { GetPracticeTimelineFilters } from "../models/filters";
import { UsersService } from "./users-service";
import { CardsService } from "./cards-service";

export const StatisticsService = {
  addTimelinePoint: async function (userId: string, newPoint: TimelinePoint) {
    const userRef = doc(db, COLLECTIONS.users, userId);
    await updateDoc(userRef, { practiceTimeline: arrayUnion(newPoint) });
  },

  getStreakData: async function (userId: string) {
    const user: UserModel = await UsersService.getUserById(userId);
    const lastPractice = (user.lastPractice as Timestamp).toDate();
    const daysSinceLastPractice = calculateDaysDiff(new Date(), lastPractice);

    const streakExpired = daysSinceLastPractice > 1;
    if (streakExpired)
      await UsersService.updateUser(userId, { currentStreak: 0 });

    return {
      longestStreak: user.longestStreak,
      currentStreak: streakExpired ? 0 : user.currentStreak,
      lastPractice,
    };
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
      await this.getStreakData(userId);

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

  getCardsDynamics: async function (
    filters: GetCardDynamicsFilters
  ): Promise<GetCardsDynamicsDto> {
    const cards = (
      await CardsService.getCards({
        ...filters,
        from: undefined,
        to: undefined,
      })
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

  getPracticeTimeline: async function (
    userId: string,
    filters?: GetPracticeTimelineFilters
  ): Promise<TimelinePointDto[]> {
    let practiceTimeline: TimelinePoint[] = (
      await UsersService.getUserById(userId)
    ).practiceTimeline;

    if (filters.action) {
      practiceTimeline = practiceTimeline.filter(
        ({ action }) => action === filters.action
      );
    }

    if (filters.from) {
      practiceTimeline = practiceTimeline.filter(
        ({ dateTime }) => dateTime.toDate() >= filters.from
      );
    }
    if (filters.to) {
      practiceTimeline = practiceTimeline.filter(
        ({ dateTime }) => dateTime.toDate() <= filters.to
      );
    }

    return practiceTimeline.map((point) => ({
      ...point,
      dateTime: point.dateTime.toDate().toISOString(),
    }));
  },

  getUserDynamics: async function (
    filters: GetUserDynamicsFilters
  ): Promise<GetUsersDynamicsDto> {
    const users: UserModelDto[] = await UsersService.getUsers({
      ...filters,
      from: undefined,
      to: undefined,
    });
    const range =
      filters.from && filters.to
        ? { from: filters.from, to: filters.to }
        : undefined;

    const groupedByCreationDate = getCountByDate(users, "createdAt", range);
    const groupedByLastPracticeDate = getCountByDate(
      users,
      "lastPractice",
      range
    );

    return {
      createdAt: groupedByCreationDate,
      lastPractice: groupedByLastPracticeDate,
    };
  },
};
