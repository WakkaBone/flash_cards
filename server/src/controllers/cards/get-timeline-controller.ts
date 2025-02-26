import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import {
  CardsService,
  GetPracticeTimelineFilters,
} from "../../services/cards-service";
import { UsersService } from "../../services/users-service";
import { TimelinePointDto } from "../../models/user";
import { STATISTICS_ACTIONS } from "../../constants";

type GetTimelineQueryParams = {
  action?: string;
  from?: string;
  to?: string;
};
export const getTimelineController = async (
  req: Request<null, ApiResponse, null, GetTimelineQueryParams>,
  res: Response<ApiResponse<TimelinePointDto[]>>
) => {
  try {
    const { action, from, to } = req.query;

    const filters: GetPracticeTimelineFilters = {
      action: action ? (action as STATISTICS_ACTIONS) : undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    };

    const userId = UsersService.getUserFromToken(req).id;
    const timeline = await CardsService.getPracticeTimeline(userId, filters);
    res.status(200).json({ isSuccess: true, data: timeline });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get practice timeline", data: error },
    });
  }
};
