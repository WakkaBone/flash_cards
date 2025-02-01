import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";
import { CardModel } from "../../models/card";

type GetRandomCardQueryParams = {
  category?: string;
  includeLearned?: string;
};
export const getRandomCardController = async (
  req: Request<null, ApiResponse, null, GetRandomCardQueryParams>,
  res: Response<ApiResponse<CardModel>>
) => {
  if (!isValid(req, res)) return;
  try {
    const { category, includeLearned } = req.query;
    const filters = {
      category: category && Number(category),
      includeLearned: includeLearned && includeLearned === "true",
    };
    const cards = await CardsService.getCards(filters);
    const randomIndex = Math.floor(Math.random() * cards.length);
    res.json({ isSuccess: true, data: cards[randomIndex] });
  } catch (error) {
    res.json({
      isSuccess: false,
      error: { message: "Failed to get a random card", data: error },
    });
  }
};
