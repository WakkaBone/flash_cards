import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { Statistics } from "../../models/statistics";

export const getStatisticsController = async (
  req: Request,
  res: Response<ApiResponse<Statistics>>
) => {
  try {
    const statistics = await CardsService.getStatistics();
    res.status(200).json({ isSuccess: true, data: statistics });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get statistics", data: error },
    });
  }
};
