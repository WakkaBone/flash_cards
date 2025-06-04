import { serverTimestamp, Timestamp } from "firebase/firestore";
import { CardsService } from "./cards-service";
import { CardModel, Priorities } from "../models/card";
import { UsersService } from "./users-service";
import { Request } from "express";
import { TimelinePoint } from "../models/user";
import { MAIN_CATEGORIES, STATISTICS_ACTIONS } from "../constants";
import { CategoriesService } from "./categories-service";

export class PatchService {
  static async resetSrsProps() {
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
          ownerIds: card.ownerIds,
        };

        await CardsService.updateCard(card.id, updatedCard);
      } catch (error) {
        throw new Error(`Failed to update the card ${card.id}`);
      }
    });
  }

  static async resetPriority() {
    const allCards = await CardsService.getCards({ includeLearned: true });

    allCards.forEach(async (card) => {
      try {
        await CardsService.updateCard(card.id, { priority: Priorities.Medium });
      } catch (error) {
        throw new Error(`Failed to update the card ${card.id}`);
      }
    });
  }

  static async resetUserTimeline(req: Request) {
    const userId = UsersService.getUserFromToken(req).id;
    try {
      const cards = await CardsService.getCards({});
      const practiceTimeline: TimelinePoint[] = [
        {
          dateTime: Timestamp.now(),
          cardId: cards[0].id || "",
          action: STATISTICS_ACTIONS.Correct,
        },
      ];
      await UsersService.updateUser(userId, { practiceTimeline });
    } catch (error) {
      throw new Error(`Failed to update the user ${userId}`);
    }
  }

  static async addOwnerIdToEntities(req: Request) {
    const userId = UsersService.getUserFromToken(req).id;
    const ownerIds = [userId];

    const cards = await CardsService.getCards({ includeLearned: true });
    cards.forEach(async (card) => {
      try {
        await CardsService.updateCard(card.id, { ownerIds });
      } catch (error) {
        throw new Error(`Failed to update the card ${card.id}`);
      }
    });

    const categories = await CategoriesService.getCategories({});
    categories.forEach(async (category) => {
      try {
        const isMainCategory = Object.values(MAIN_CATEGORIES).includes(
          category.id
        );
        await CategoriesService.updateCategory(category.id, {
          ownerIds: isMainCategory ? [] : ownerIds,
        });
      } catch (error) {
        throw new Error(`Failed to update the category ${category.id}`);
      }
    });
  }
}
