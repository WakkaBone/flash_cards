import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { UsersService } from "../../services/users-service";

export const checkAuthController = async (
  req: Request<null, ApiResponse>,
  res: Response<ApiResponse>
) => {
  try {
    const user = UsersService.getUserFromToken(req);
    res.status(200).json({ isSuccess: true, data: user });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to check auth status", data: error },
    });
  }
};
