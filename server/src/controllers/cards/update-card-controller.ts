import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { CardModel } from "../../models/card";
import { isValid } from "../../utils/validation-util";

type UpdateCardParams = { id: string };
type UpdateCardBody = CardModel;
export const updateCardController = async (
  req: Request<UpdateCardParams, ApiResponse, UpdateCardBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { id } = req.params;
    const { category, english, hebrew, isLearned, statistics, createdAt } =
      req.body;
    const card = {
      category,
      english,
      hebrew,
      statistics,
      isLearned,
      createdAt,
    };
    await CardsService.updateCard(id, card);
    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to update the card", data: error },
    });
  }
};
