import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { CardModelDto } from "../../models/card";
import { isValid } from "../../utils/validation-util";
import { Timestamp } from "firebase/firestore";

type UpdateCardParams = { id: string };
type UpdateCardBody = CardModelDto;
export const updateCardController = async (
  req: Request<UpdateCardParams, ApiResponse, UpdateCardBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { id } = req.params;
    const {
      category,
      english,
      hebrew,
      details,
      isLearned,
      statistics,
      createdAt,
    } = req.body;
    const card = {
      category: category.id,
      english,
      hebrew,
      details,
      statistics,
      isLearned,
      createdAt: Timestamp.fromDate(new Date(createdAt)),
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
