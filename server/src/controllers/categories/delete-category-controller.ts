import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { isValid } from "../../utils/validation-util";
import { CategoriesService } from "../../services/categories-service";
import { CardsService } from "../../services/cards-service";
import { MAIN_CATEGORIES } from "../../constants";
import { Timestamp } from "firebase/firestore";

type DeleteCategoryParams = { id: string };
export const deleteCategoryController = async (
  req: Request<DeleteCategoryParams, ApiResponse>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { id } = req.params;

    const allCardsWithCategory = await CardsService.getCards({ category: id });
    allCardsWithCategory.forEach(async (card) => {
      await CardsService.updateCard(card.id, {
        ...card,
        createdAt: Timestamp.fromDate(new Date(card.createdAt)),
        category: MAIN_CATEGORIES.other,
      });
    });

    await CategoriesService.deleteCategory(id);
    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to delete the category", data: error },
    });
  }
};
