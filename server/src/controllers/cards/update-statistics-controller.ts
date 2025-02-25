import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { STATISTICS_ACTIONS } from "../../constants";
import { isValid } from "../../utils/validation-util";
import { UsersService } from "../../services/users-service";
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

    const username = UsersService.getCurrentUser(req);
    await UsersService.addTimelinePoint(username, newTimelinePoint);

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to update statistics", data: error },
    });
  }
};
