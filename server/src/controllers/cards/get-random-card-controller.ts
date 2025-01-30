import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";
import { CardModel } from "../../models/card";

export const getRandomCardController = async (
  req: Request,
  res: Response<ApiResponse<CardModel>>
) => {
  try {
    const cards = await CardsService.getCards();
    const randomIndex = Math.floor(Math.random() * cards.length);
    res.json({ isSuccess: true, data: cards[randomIndex] });
  } catch (error) {
    res.json({
      isSuccess: false,
      error: { message: "Failed to get a random card", data: error },
    });
  }
};
