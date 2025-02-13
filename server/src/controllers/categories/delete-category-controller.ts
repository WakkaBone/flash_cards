import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { isValid } from "../../utils/validation-util";
import { CategoriesService } from "../../services/categories-service";

type DeleteCategoryParams = { id: string };
export const deleteCategoryController = async (
  req: Request<DeleteCategoryParams, ApiResponse>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { id } = req.params;
    await CategoriesService.deleteCategory(id);
    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to delete the category", data: error },
    });
  }
};
