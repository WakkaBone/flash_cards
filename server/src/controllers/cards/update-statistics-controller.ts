import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { STATISTICS_ACTIONS } from "../../constants";
import { isValid } from "../../utils/validation-util";

type UpdateStatisticsParams = { id: string; action: string };
export const updateStatisticsController = async (
  req: Request<UpdateStatisticsParams, ApiResponse>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { id, action } = req.params;
    await CardsService.updateStatistics(id, action as STATISTICS_ACTIONS);
    res.json({ isSuccess: true });
  } catch (error) {
    res.json({
      isSuccess: false,
      error: { message: "Failed to update statistics", data: error },
    });
  }
};
