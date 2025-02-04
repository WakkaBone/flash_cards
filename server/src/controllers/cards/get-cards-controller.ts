import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";

type GetCardsQueryParams = {
  search?: string;
  category?: string;
  includeLearned?: string;
};
export const getCardsController = async (
  req: Request<null, ApiResponse, null, GetCardsQueryParams>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    //TODO implement server side pagination
    const { search, category, includeLearned } = req.query;
    const filters = {
      search: search && search.toString(),
      category: category && Number(category),
      includeLearned: includeLearned && includeLearned === "true",
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
