import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService, CategoriesService } from "../../services";
import { isValid } from "../../utils/validation-util";

type DeleteCardParams = { id: string };
export const deleteCardController = async (
  req: Request<DeleteCardParams, ApiResponse>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { id } = req.params;
    const card = await CardsService.getCardById(id);

    await CardsService.deleteCard(id);
    await CategoriesService.updateUpdatedAt(card.category);

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to delete the card", data: error },
    });
  }
};
