import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { Statistics } from "../../models/statistics";
import { UsersService } from "../../services/users-service";

export const getStatisticsController = async (
  req: Request,
  res: Response<ApiResponse<Statistics>>
) => {
  try {
    const userId = UsersService.getUserFromToken(req).id;
    const statistics = await CardsService.getStatistics(userId);
    res.status(200).json({ isSuccess: true, data: statistics });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get statistics", data: error },
    });
  }
};
