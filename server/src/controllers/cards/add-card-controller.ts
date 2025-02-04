import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";
import { Timestamp } from "firebase/firestore";

type CreateCardBody = {
  category: number;
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
    const result = await CardsService.addCard(card);
    res.status(200).json({ isSuccess: true, data: result });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to add the card", data: error },
    });
  }
};
