import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService, UsersService, StatisticsService } from "../../services";
import { STATISTICS_ACTIONS } from "../../constants";
import { isValid } from "../../utils/validation-util";
import { TimelinePoint } from "../../models/user";
import { Timestamp } from "firebase/firestore";

type UpdateStatisticsParams = { id: string; action: string };
export const updateStatisticsController = async (
  req: Request<UpdateStatisticsParams, ApiResponse>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { id, action } = req.params;
    await CardsService.updateStatistics(id, action as STATISTICS_ACTIONS);

    const newTimelinePoint: TimelinePoint = {
      dateTime: Timestamp.now(),
      action: action as STATISTICS_ACTIONS,
      cardId: id,
    };

    const userId = UsersService.getUserFromToken(req).id;
    await StatisticsService.addTimelinePoint(userId, newTimelinePoint);

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to update statistics", data: error },
    });
  }
};
