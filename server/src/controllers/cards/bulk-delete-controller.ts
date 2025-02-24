import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";
import { CategoriesService } from "../../services/categories-service";

type BulkDeleteBody = { ids: string[] };
export const bulkDeleteCardsController = async (
  req: Request<{}, ApiResponse, BulkDeleteBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { ids } = req.body;
    const affectedCategories = new Set<string>();

    ids.forEach(async (id) => {
      const card = await CardsService.getCardById(id);
      affectedCategories.add(card.category);
      await CardsService.deleteCard(id);
    });

    affectedCategories.forEach(async (category) => {
      await CategoriesService.updateUpdatedAt(category);
    });

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to bulk delete the cards", data: error },
    });
  }
};
