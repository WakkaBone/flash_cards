import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";
import { Timestamp } from "firebase/firestore";
import { CategoriesService } from "../../services/categories-service";

type CreateCardBody = {
  category: string;
  english: string;
  hebrew: string;
  details?: string;
};
export const addCardController = async (
  req: Request<null, ApiResponse, CreateCardBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { category, english, hebrew, details } = req.body;
    const card = {
      category,
      english,
      hebrew,
      details,
      statistics: { wrong: 0, correct: 0 },
      isLearned: false,
      createdAt: Timestamp.now(),
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
