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
import { getNextReviewDate } from "../utils/date-time";
import { searchFilterCallback } from "../utils/search-util";
import { mapCardToCardDto } from "../utils/mappers-util";
import { shuffleArray } from "../utils/array-util";
import { GetCardsFilters } from "../models/filters";

export class CardsService {
  static async getCards(
    filters: GetCardsFilters = {}
  ): Promise<CardModelDto[]> {
    let queryRef = query(collection(db, COLLECTIONS.cards));
    const queries = [];

    if (filters.ownerId)
      queries.push(where("ownerIds", "array-contains", filters.ownerId));

    if (filters.searchExact)
      queries.push(where("english", "==", filters.searchExact));

    if (filters.from)
      queries.push(where("createdAt", ">", Timestamp.fromDate(filters.from)));
    if (filters.to)
      queries.push(where("createdAt", "<", Timestamp.fromDate(filters.to)));

    if (filters.includeLearned === false)
      queries.push(where("isLearned", "==", false), orderBy("isLearned"));

    if (filters.category)
      queries.push(where("category", "==", filters.category));

    if (filters.mistakesThreshold)
      queries.push(where("statistics.wrong", ">=", filters.mistakesThreshold));

    if (filters.priority)
      queries.push(where("priority", "==", filters.priority));

    if (filters.page && filters.pageSize) queries.push(limit(filters.pageSize));

    const { docs } = await getDocs(query(queryRef, ...queries));

    const cards = await Promise.all(docs.map((doc) => mapCardToCardDto(doc)));

    if (filters.search) {
      const searchableFields = ["english", "hebrew"];
      return cards.filter((card) =>
        searchFilterCallback(filters.search!, card, searchableFields)
      );
    }

    const sortedCards = cards.sort((a, b) => {
      const createdAtA = new Date(a.createdAt);
      const createdAtB = new Date(b.createdAt);
      return createdAtB.getTime() - createdAtA.getTime();
    });

    if (filters.lastCards) return sortedCards.slice(0, filters.lastCards);

    return sortedCards;
  }

  static async getCardById(id: string): Promise<CardModel> {
    const cardRef = doc(db, COLLECTIONS.cards, id);
    const card = await getDoc(cardRef);
    return card.data() as CardModel;
  }

  static async addCard(card: CardModel): Promise<void> {
    await addDoc(collection(db, COLLECTIONS.cards), card);
  }

  static async updateCard(id: string, card: Partial<CardModel>): Promise<void> {
    const cardRef = doc(db, COLLECTIONS.cards, id);
    await updateDoc(cardRef, card);
  }

  static async updateStatistics(
    id: string,
    action: STATISTICS_ACTIONS
  ): Promise<void> {
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
  }

  static async updateLastReviewedDate(id: string): Promise<void> {
    const cardRef = doc(db, COLLECTIONS.cards, id);
    await updateDoc(cardRef, { lastReviewDate: serverTimestamp() });
  }

  static async markLearned(
    id: string,
    shouldMarkAsLearned: boolean
  ): Promise<void> {
    const cardRef = doc(db, COLLECTIONS.cards, id);
    await updateDoc(cardRef, { isLearned: shouldMarkAsLearned });
  }

  static async deleteCard(id: string): Promise<void> {
    const cardRef = doc(db, COLLECTIONS.cards, id);
    await deleteDoc(cardRef);
  }

  static async moveCardsToOtherCategory(categoryId: string): Promise<void> {
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
  }

  static async deleteUsersCards(userId: string): Promise<void> {
    const usersCards = await this.getCards({
      ownerId: userId,
    });
    usersCards.forEach(async (card: CardModelDto) => {
      //remove the card only if it belongs only to the deleted user
      if (card.ownerIds.length === 1) await this.deleteCard(card.id);
    });
  }

  static async getOptions(card: CardModelDto, eth: boolean): Promise<string[]> {
    const sameCategoryCards = await this.getCards({
      category: card.category.id,
    });
    const result = shuffleArray(sameCategoryCards)
      .filter(({ english }) => english !== card.english)
      .slice(0, 3)
      .map(({ hebrew, english }) => (eth ? hebrew : english));

    return result;
  }

  static sortBySRS(cards: CardModelDto[]): CardModelDto[] {
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
  }
}
