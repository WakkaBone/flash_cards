import { Request, Response } from "express";
import { ApiResponse } from "../models/api-response";
import { CardsService } from "../services/cards-service";

export const getCardsController = async (req: Request, res: Response) => {
  try {
    const result = await CardsService.getCards();
    const response: ApiResponse = { isSuccess: true, data: result };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      isSuccess: false,
      error: { message: "Failed to get cards", data: error },
    };
    res.json(response);
  }
};
