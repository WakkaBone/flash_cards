import { Request, Response } from "express";
import { CardsService } from "../services/cards-service";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import { CardModel } from "../models/card";

export const patchDbController = async (req: Request, res: Response) => {
  try {
    //PATCH TO ADD SRS PROPS
    const allCards = await CardsService.getCards({ includeLearned: true });

    allCards.forEach(async (card) => {
      const defaultValues = {
        easinessFactor: 2.5,
        interval: 1,
        repetitions: 1,
        lastReviewDate: serverTimestamp(),
      };

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

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to patch the db", data: error },
    });
  }
};
