import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";
import { CategoriesService } from "../../services/categories-service";

type BulkMarkLearnedBody = { ids: string[] };
export const bulkMarkLearnedController = async (
  req: Request<{}, ApiResponse, BulkMarkLearnedBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { ids } = req.body;
    const affectedCategories = new Set<string>();

    ids.forEach(async (id) => {
      const card = await CardsService.getCardById(id);
      affectedCategories.add(card.category);
      await CardsService.markLearned(id);
    });

    affectedCategories.forEach(async (category) => {
      await CategoriesService.updateUpdatedAt(category);
    });

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to bulk mark the cards learned", data: error },
    });
  }
};
