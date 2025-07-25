import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CategoriesService, CardsService } from "../../services";
import { isValid } from "../../utils/validation-util";

type BulkDeleteBody = { ids: string[] };
export const bulkDeleteCategoriesController = async (
  req: Request<{}, ApiResponse, BulkDeleteBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { ids } = req.body;

    ids.forEach(async (id) => {
      await CardsService.moveCardsToOtherCategory(id);
      await CategoriesService.deleteCategory(id);
    });

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to bulk delete the categories", data: error },
    });
  }
};
