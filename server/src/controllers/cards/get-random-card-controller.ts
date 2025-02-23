import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";
import { CardModelDto } from "../../models/card";
import { UsersService } from "../../services/users-service";

type GetRandomCardQueryParams = {
  category?: string;
  includeLearned?: string;
  mistakesThreshold?: string;
  from?: string;
  to?: string;
};

let prevCardId = "";
export const getRandomCardController = async (
  req: Request<null, ApiResponse, null, GetRandomCardQueryParams>,
  res: Response<ApiResponse<CardModelDto>>
) => {
  if (!isValid(req, res)) return;
  try {
    const { category, includeLearned, mistakesThreshold, from, to } = req.query;

    const filters = {
      category: category ? category : undefined,
      includeLearned: includeLearned ? includeLearned === "true" : undefined,
      mistakesThreshold: mistakesThreshold
        ? Number(mistakesThreshold)
        : undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    };

    const cards = await CardsService.getCards(filters);
    if (!cards?.length) {
      res.status(200).json({ isSuccess: true, data: null });
      return;
    }
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

    const currentUser = UsersService.getCurrentUser(req);
    currentUser && (await UsersService.updateLastPractice(currentUser));

    res.status(200).json({ isSuccess: true, data: randomCard });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get a random card", data: error },
    });
  }
};
