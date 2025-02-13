import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";
import { CategoriesService } from "../../services/categories-service";

type UpdateUpdatedAtParams = { id: string };
export const updateUpdatedAtController = async (
  req: Request<UpdateUpdatedAtParams, ApiResponse>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { id } = req.params;
    await CategoriesService.updateUpdatedAt(id);
    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: {
        message: "Failed to update updated at of the category",
        data: error,
      },
    });
  }
};
