import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { generateAuthCookie } from "../../utils/cookie-util";
import { AuthService } from "../../services/auth-service";
import { isValid } from "../../utils/validation-util";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt-util";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../../constants";

type LoginBody = {
  username: string;
  password: string;
};
export const loginController = async (
  req: Request<null, ApiResponse<string>, LoginBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { username, password } = req.body;

    const user = await AuthService.getUserByUsername(username);
    if (!user) {
      res.status(400).json({
        isSuccess: false,
        error: { message: "User not found" },
      });
      return;
    }

    if (username === user.username && password === user.password) {
      const payload = { username: user.username };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
      const accessCookie = generateAuthCookie(ACCESS_TOKEN_KEY, accessToken);
      const refreshCookie = generateAuthCookie(
        REFRESH_TOKEN_KEY,
        refreshToken,
        { maxAge: 43200 } //12 hours
      );

      res.setHeader("Set-Cookie", [accessCookie, refreshCookie]);

      res.status(200).json({ isSuccess: true });
    } else {
      res.status(401).json({
        isSuccess: false,
        error: { message: "Invalid credentials" },
      });
    }
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to authenticate", data: error },
    });
  }
};
