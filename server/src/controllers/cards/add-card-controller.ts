import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";

type CreateCardBody = {
  category: number;
  english: string;
  hebrew: string;
};
export const addCardController = async (
  req: Request<null, ApiResponse, CreateCardBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { category, english, hebrew } = req.body;
    const card = {
      category,
      english,
      hebrew,
      statistics: { wrong: 0, correct: 0 },
      isLearned: false,
      createdAt: new Date().toISOString(),
    };
    const result = await CardsService.addCard(card);
    res.json({ isSuccess: true, data: result });
  } catch (error) {
    res.json({
      isSuccess: false,
      error: { message: "Failed to add the card", data: error },
    });
  }
};
