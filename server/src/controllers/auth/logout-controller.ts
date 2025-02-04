import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { getExpiredAuthCookie } from "../../utils/cookie-util";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../../constants";

export const logoutController = async (
  req: Request<null, ApiResponse>,
  res: Response<ApiResponse>
) => {
  try {
    res.setHeader("Set-Cookie", [
      getExpiredAuthCookie(ACCESS_TOKEN_KEY),
      getExpiredAuthCookie(REFRESH_TOKEN_KEY),
    ]);

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to logout", data: error },
    });
  }
};
