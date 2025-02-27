import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService, GetCardsFilters } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";
import { CardModelDto } from "../../models/card";
import { UsersService } from "../../services/users-service";
import { getOwnershipFilter } from "../../utils/roles-util";

type GetCardsQueryParams = {
  search?: string;
  category?: string;
  includeLearned?: string;
  from?: string;
  to?: string;
  mistakesThreshold?: string;
  priority?: string;
  ownerId?: string;
  page?: string;
  pageSize?: string;
};
export const getCardsController = async (
  req: Request<null, ApiResponse, null, GetCardsQueryParams>,
  res: Response<ApiResponse<CardModelDto[]>>
) => {
  if (!isValid(req, res)) return;
  try {
    const {
      search,
      category,
      includeLearned,
      from,
      to,
      mistakesThreshold,
      priority,
      ownerId,
      page,
      pageSize,
    } = req.query;

    const user = UsersService.getUserFromToken(req);

    const filters: GetCardsFilters = {
      ownerId: ownerId || getOwnershipFilter(user),
      search,
      category: category ? category : undefined,
      includeLearned: includeLearned ? includeLearned === "true" : undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      mistakesThreshold: mistakesThreshold
        ? Number(mistakesThreshold)
        : undefined,
      priority: priority ? Number(priority) : undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    };

    const result = await CardsService.getCards(filters);
    res.status(200).json({ isSuccess: true, data: result });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get cards", data: error },
    });
  }
};
