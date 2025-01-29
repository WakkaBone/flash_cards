import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { ApiResponse } from "../models/api-response";
import { CardsService } from "../services/cards-service";

export const addCardController = async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.json({
      isSuccess: false,
      error: { code: "ValidationError", data: result.array() },
    });
    return;
  }

  try {
    const { category, english, hebrew } = req.body;
    const card = {
      category,
      english,
      hebrew,
      statistics: { wrong: 0, correct: 0 },
    };
    const result = await CardsService.addCard(card);
    const response: ApiResponse = { isSuccess: true, data: result };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      isSuccess: false,
      error: { message: "Failed to add card", data: error },
    };
    res.json(response);
  }
};
