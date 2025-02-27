import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { StatisticsAdmin } from "../../models/statistics";
import { UsersService } from "../../services/users-service";

export const getAdminStatisticsController = async (
  req: Request,
  res: Response<ApiResponse<StatisticsAdmin>>
) => {
  try {
    const userId = UsersService.getUserFromToken(req).id;
    const statistics = await CardsService.getAdminStatistics(userId);
    res.status(200).json({ isSuccess: true, data: statistics });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get admin statistics", data: error },
    });
  }
};
