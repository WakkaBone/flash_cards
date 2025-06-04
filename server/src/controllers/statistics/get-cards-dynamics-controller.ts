import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import {
  GetCardDynamicsFilters,
  GetCardsDynamicsDto,
} from "../../models/statistics";
import { Priorities } from "../../models/card";
import { StatisticsService } from "../../services";

type GetCardsDynamicsQueryParams = {
  priority?: string;
  from?: string;
  to?: string;
};
export const getCardsDynamicsController = async (
  req: Request<null, ApiResponse, null, GetCardsDynamicsQueryParams>,
  res: Response<ApiResponse<GetCardsDynamicsDto>>
) => {
  try {
    const { priority, from, to } = req.query;

    const filters: GetCardDynamicsFilters = {
      priority: priority ? (Number(priority) as Priorities) : undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    };

    const dynamics = await StatisticsService.getCardsDynamics(filters);

    res.status(200).json({ isSuccess: true, data: dynamics });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get cards dynamics", data: error },
    });
  }
};
