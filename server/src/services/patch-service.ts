import { serverTimestamp, Timestamp } from "firebase/firestore";
import { CardsService } from "./cards-service";
import { CardModel, Priorities } from "../models/card";

export const PatchService = {
  resetSrsProps: async function () {
    const allCards = await CardsService.getCards({ includeLearned: true });

    const defaultValues = {
      easinessFactor: 2.5,
      interval: 1,
      repetitions: 1,
      lastReviewDate: serverTimestamp(),
    };

    allCards.forEach(async (card) => {
      try {
        const updatedCard: CardModel = {
          category: card.category.id,
          createdAt: card.createdAt
            ? Timestamp.fromDate(new Date(card.createdAt))
            : Timestamp.now(),
          easinessFactor: defaultValues.easinessFactor,
          english: card.english,
          hebrew: card.hebrew,
          interval: defaultValues.interval,
          isLearned: card.isLearned,
          priority: card.priority,
          repetitions: defaultValues.interval,
          statistics: card.statistics,
          details: card.details,
          lastReviewDate: defaultValues.lastReviewDate,
        };

        await CardsService.updateCard(card.id, updatedCard);
      } catch (error) {
        console.error("Failed to update the card", card, error);
      }
    });
  },

  resetPriority: async function () {
    const allCards = await CardsService.getCards({ includeLearned: true });

    allCards.forEach(async (card) => {
      try {
        await CardsService.updateCard(card.id, { priority: Priorities.Medium });
      } catch (error) {
        console.error("Failed to update the card", card, error);
      }
    });
  },
};
