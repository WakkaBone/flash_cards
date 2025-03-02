import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { UsersService } from "../../services/users-service";
import { Roles } from "../../models/user";
import {
  GetUsersDynamicsDto,
  UserAdditionDynamicsFilters,
} from "../../models/statistics";

type GetUsersDynamicsQueryParams = {
  role?: string;
  from?: string;
  to?: string;
};
export const getUsersDynamicsController = async (
  req: Request<null, ApiResponse, null, GetUsersDynamicsQueryParams>,
  res: Response<ApiResponse<GetUsersDynamicsDto>>
) => {
  try {
    const { role, from, to } = req.query;

    const filters: UserAdditionDynamicsFilters = {
      role: role ? (role as Roles) : undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    };

    const dynamics = await UsersService.getUserDynamics(filters);

    res.status(200).json({ isSuccess: true, data: dynamics });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get users addition dynamics", data: error },
    });
  }
};
