import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { isValid } from "../../utils/validation-util";
import { Timestamp, serverTimestamp } from "firebase/firestore";
import { CategoryDto } from "../../models/category";
import { CategoriesService } from "../../services/categories-service";

type UpdateCategoryParams = { id: string };
type UpdateCategoryBody = CategoryDto;
export const updateCategoryController = async (
  req: Request<UpdateCategoryParams, ApiResponse, UpdateCategoryBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { id } = req.params;
    const { label, createdAt } = req.body;
    const category = {
      label,
      updatedAt: serverTimestamp(),
      createdAt: Timestamp.fromDate(new Date(createdAt)),
    };
    await CategoriesService.updateCategory(id, category);
    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to update the category", data: error },
    });
  }
};
