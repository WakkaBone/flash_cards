import { serverTimestamp, Timestamp } from "firebase/firestore";
import { CardsService } from "./cards-service";
import { CardModel, Priorities } from "../models/card";
import { UsersService } from "./users-service";
import { Request } from "express";
import { TimelinePoint } from "../models/user";
import { STATISTICS_ACTIONS } from "../constants";

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
        throw new Error("Failed to update the card");
      }
    });
  },

  resetPriority: async function () {
    const allCards = await CardsService.getCards({ includeLearned: true });

    allCards.forEach(async (card) => {
      try {
        await CardsService.updateCard(card.id, { priority: Priorities.Medium });
      } catch (error) {
        throw new Error("Failed to update the card");
      }
    });
  },

  resetUserTimeline: async function (req: Request) {
    try {
      const username = UsersService.getCurrentUser(req);
      const cards = await CardsService.getCards({});
      const practiceTimeline: TimelinePoint[] = [
        {
          dateTime: Timestamp.now(),
          cardId: cards[0].id || "",
          action: STATISTICS_ACTIONS.Correct,
        },
      ];
      await UsersService.updateUser(username, { practiceTimeline });
    } catch (error) {
      throw new Error("Failed to update the user");
    }
  },
};
