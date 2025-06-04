import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { isValid } from "../../utils/validation-util";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import { UsersService, CategoriesService } from "../../services";
import { CategoryModel } from "../../models/category";

type CreateCategoryBody = {
  label: string;
};
export const addCategoryController = async (
  req: Request<null, ApiResponse, CreateCategoryBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { label } = req.body;

    const userId = UsersService.getUserFromToken(req).id;

    const category: CategoryModel = {
      label,
      createdAt: Timestamp.now(),
      updatedAt: serverTimestamp(),
      ownerIds: [userId],
    };

    await CategoriesService.addCategory(category);

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to add the category", data: error },
    });
  }
};
