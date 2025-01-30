import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";

type DeleteCardParams = { id: string };
export const deleteCardController = async (
  req: Request<DeleteCardParams, ApiResponse>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { id } = req.params;
    await CardsService.deleteCard(id);
    res.json({ isSuccess: true });
  } catch (error) {
    res.json({
      isSuccess: false,
      error: { message: "Failed to delete the card", data: error },
    });
  }
};
