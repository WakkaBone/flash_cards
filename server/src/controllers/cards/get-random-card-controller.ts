import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService, UsersService } from "../../services";
import { isValid } from "../../utils/validation-util";
import { CardModelDto } from "../../models/card";
import { getOwnershipFilter } from "../../utils/roles-util";
import { GetCardsFilters } from "../../models/filters";

export enum PracticeModes {
  ethInput,
  hteInput,
  ethSelect,
  hteSelect,
  browse,
}

type GetRandomCardQueryParams = {
  category?: string;
  includeLearned?: string;
  mistakesThreshold?: string;
  priority?: string;
  from?: string;
  to?: string;
  mode?: string;
};

export const getRandomCardController = async (
  req: Request<null, ApiResponse, null, GetRandomCardQueryParams>,
  res: Response<ApiResponse<{ card: CardModelDto; options?: string[] }>>
) => {
  if (!isValid(req, res)) return;
  try {
    const {
      category,
      includeLearned,
      mistakesThreshold,
      priority,
      from,
      to,
      mode,
    } = req.query;

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

    const shouldIncludeOptions =
      mode !== undefined &&
      [PracticeModes.ethSelect, PracticeModes.hteSelect].includes(+mode);
    const options = shouldIncludeOptions
      ? await CardsService.getOptions(
          card,
          mode && +mode === PracticeModes.ethSelect
        )
      : undefined;

    res.status(200).json({
      isSuccess: true,
      data: {
        card,
        options,
      },
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get a card", data: error },
    });
  }
};
