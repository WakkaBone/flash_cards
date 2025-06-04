import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { UsersService, StatisticsService } from "../../services";
import { Statistics } from "../../models/statistics";

export const getStatisticsController = async (
  req: Request,
  res: Response<ApiResponse<Statistics>>
) => {
  try {
    const userId = UsersService.getUserFromToken(req).id;
    const statistics = await StatisticsService.getStatistics(userId);
    res.status(200).json({ isSuccess: true, data: statistics });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get statistics", data: error },
    });
  }
};
