import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";

export const checkAuthController = async (
  req: Request<null, ApiResponse>,
  res: Response<ApiResponse>
) => {
  try {
    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to check auth status", data: error },
    });
  }
};
