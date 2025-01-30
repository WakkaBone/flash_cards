import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";

type GetCardsQueryParams = {
  search?: string;
  category?: string;
};
export const getCardsController = async (
  req: Request<null, ApiResponse, null, GetCardsQueryParams>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { search, category } = req.query;
    const filters = {
      search: search && search.toString(),
      category: category && Number(category),
    };
    const result = await CardsService.getCards(filters);
    res.json({ isSuccess: true, data: result });
  } catch (error) {
    res.json({
      isSuccess: false,
      error: { message: "Failed to get cards", data: error },
    });
  }
};
