import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import { CategoriesService } from "../../services/categories-service";
import { CardModel, Priorities } from "../../models/card";

type CreateCardBody = {
  category: string;
  english: string;
  hebrew: string;
  details?: string;
  priority: Priorities;
};
export const addCardController = async (
  req: Request<null, ApiResponse, CreateCardBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { category, english, hebrew, details, priority } = req.body;

    const initialSrsValues = {
      easinessFactor: 2.5,
      interval: 1,
      repetitions: 1,
      lastReviewDate: serverTimestamp(),
    };

    const card: CardModel = {
      category,
      english,
      hebrew,
      details,
      priority,
      statistics: { wrong: 0, correct: 0 },
      isLearned: false,
      createdAt: Timestamp.now(),
      ...initialSrsValues,
    };
    await CardsService.addCard(card);

    await CategoriesService.updateUpdatedAt(category);

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to add the card", data: error },
    });
  }
};
