import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService, CategoriesService } from "../../services";
import { CardModel, CardModelDto } from "../../models/card";
import { isValid } from "../../utils/validation-util";
import { serverTimestamp } from "firebase/firestore";

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
      priority,
    } = req.body;

    const cardBeforeUpdate = await CardsService.getCardById(id);

    const card: CardModel = {
      category: category.id,
      english,
      hebrew,
      details,
      statistics,
      isLearned,
      priority,
      ownerIds: cardBeforeUpdate.ownerIds,
      createdAt: cardBeforeUpdate.createdAt,
      easinessFactor: cardBeforeUpdate.easinessFactor,
      interval: cardBeforeUpdate.interval,
      repetitions: cardBeforeUpdate.repetitions,
      lastReviewDate: serverTimestamp(),
    };

    await CardsService.updateCard(id, card);

    const categoryChanged = cardBeforeUpdate.category !== card.category;
    if (categoryChanged) await CategoriesService.updateUpdatedAt(card.category);

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to update the card", data: error },
    });
  }
};
