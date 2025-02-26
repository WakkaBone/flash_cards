import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { isValid } from "../../utils/validation-util";
import { GetUsersFilters, UsersService } from "../../services/users-service";
import { Roles, UserModelDto } from "../../models/user";

type GetUsersQueryParams = {
  search?: string;
  role?: string;
  from?: string;
  to?: string;
  numberOfCards?: string;
  longestStreak?: string;
  currentStreak?: string;
  page?: string;
  pageSize?: string;
};
export const getUsersController = async (
  req: Request<null, ApiResponse, null, GetUsersQueryParams>,
  res: Response<ApiResponse<UserModelDto[]>>
) => {
  if (!isValid(req, res)) return;
  try {
    const {
      search,
      currentStreak,
      from,
      to,
      numberOfCards,
      longestStreak,
      role,
      page,
      pageSize,
    } = req.query;

    const filters: GetUsersFilters = {
      search,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      numberOfCards: numberOfCards ? Number(numberOfCards) : undefined,
      currentStreak: currentStreak ? Number(currentStreak) : undefined,
      longestStreak: longestStreak ? Number(longestStreak) : undefined,
      role: role ? (role as Roles) : undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    };

    const result = await UsersService.getUsers(filters);
    res.status(200).json({ isSuccess: true, data: result });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get users", data: error },
    });
  }
};
