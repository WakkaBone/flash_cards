import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";

export const logoutController = async (
  req: Request<null, ApiResponse>,
  res: Response<ApiResponse>
) => {
  try {
    const authCookie = `auth_token=; HttpOnly; Path=/; Max-Age=0; ${
      process.env.NODE_ENV === "production" ? "Secure" : ""
    }`;
    res.setHeader("Set-Cookie", authCookie);

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to logout", data: error },
    });
  }
};
