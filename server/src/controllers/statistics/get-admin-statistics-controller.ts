import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { StatisticsService, UsersService } from "../../services";
import { StatisticsAdmin } from "../../models/statistics";

export const getAdminStatisticsController = async (
  req: Request,
  res: Response<ApiResponse<StatisticsAdmin>>
) => {
  try {
    const userId = UsersService.getUserFromToken(req).id;
    const statistics = await StatisticsService.getAdminStatistics(userId);
    res.status(200).json({ isSuccess: true, data: statistics });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get admin statistics", data: error },
    });
  }
};
