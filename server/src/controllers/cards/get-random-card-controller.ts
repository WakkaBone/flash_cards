import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";
import { CardModel } from "../../models/card";

type GetRandomCardQueryParams = {
  category?: string;
  includeLearned?: string;
};
let prevCardId = "";
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
    if (cards.length === 1) {
      res.status(200).json({ isSuccess: true, data: cards[0] });
      return;
    }

    const randomIndex = Math.floor(Math.random() * cards.length);
    let randomCard = cards[randomIndex];
    if (prevCardId) {
      while (randomCard.id === prevCardId) {
        randomCard = cards[Math.floor(Math.random() * cards.length)];
      }
    }
    prevCardId = randomCard.id;
    res.status(200).json({ isSuccess: true, data: randomCard });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get a random card", data: error },
    });
  }
};
