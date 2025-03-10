import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService, GetCardsFilters } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";
import { CardModelDto } from "../../models/card";
import { UsersService } from "../../services/users-service";
import { getOwnershipFilter } from "../../utils/roles-util";

type GetRandomCardQueryParams = {
  category?: string;
  includeLearned?: string;
  mistakesThreshold?: string;
  priority?: string;
  from?: string;
  to?: string;
};

export const getRandomCardController = async (
  req: Request<null, ApiResponse, null, GetRandomCardQueryParams>,
  res: Response<ApiResponse<CardModelDto>>
) => {
  if (!isValid(req, res)) return;
  try {
    const { category, includeLearned, mistakesThreshold, priority, from, to } =
      req.query;

    const user = UsersService.getUserFromToken(req);

    const filters: GetCardsFilters = {
      ownerId: getOwnershipFilter(user),
      category: category ? category : undefined,
      includeLearned: includeLearned ? includeLearned === "true" : undefined,
      mistakesThreshold: mistakesThreshold
        ? Number(mistakesThreshold)
        : undefined,
      priority: priority ? Number(priority) : undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    };

    const cards = await CardsService.getCards(filters);
    const sortedCards = CardsService.sortBySRS(cards);

    if (!sortedCards?.length) {
      res.status(200).json({ isSuccess: true, data: null });
      return;
    }

    const card = sortedCards[0];
    await CardsService.updateLastReviewedDate(card.id);

    const userId = UsersService.getUserFromToken(req).id;
    userId && (await UsersService.updateLastPractice(userId));

    res.status(200).json({ isSuccess: true, data: card });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get a card", data: error },
    });
  }
};
