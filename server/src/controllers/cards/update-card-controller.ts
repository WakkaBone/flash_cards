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
    const response: ApiResponse = { isSuccess: true };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      isSuccess: false,
      error: { message: "Failed to update the card", data: error },
    };
    res.json(response);
  }
};
