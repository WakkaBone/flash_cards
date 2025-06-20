import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService, UsersService, CategoriesService } from "../../services";
import { isValid } from "../../utils/validation-util";
import { Timestamp } from "firebase/firestore";
import { CardModel, Priorities } from "../../models/card";
import { getInitialSrsValues } from "../../utils/mappers-util";

type CreateCardBody = {
  category: string;
  english: string;
  hebrew: string;
  details?: string;
  priority: Priorities;
};
export const addCardController = async (
  req: Request<null, ApiResponse, CreateCardBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { category, english, hebrew, details, priority } = req.body;

    const user = UsersService.getUserFromToken(req);

    const card: CardModel = {
      category,
      english,
      hebrew,
      details,
      priority,
      statistics: { wrong: 0, correct: 0 },
      isLearned: false,
      createdAt: Timestamp.now(),
      ...getInitialSrsValues(),
      ownerIds: [user.id],
    };
    await CardsService.addCard(card);

    await CategoriesService.updateUpdatedAt(category);

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to add the card", data: error },
    });
  }
};
