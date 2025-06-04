import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { StatisticsService, UsersService } from "../../services";
import { TimelinePointDto } from "../../models/user";
import { STATISTICS_ACTIONS } from "../../constants";
import { GetPracticeTimelineFilters } from "../../models/filters";

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
    const timeline = await StatisticsService.getPracticeTimeline(
      userId,
      filters
    );

    res.status(200).json({ isSuccess: true, data: timeline });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get practice timeline", data: error },
    });
  }
};
