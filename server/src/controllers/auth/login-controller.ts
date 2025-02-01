import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import jwt from "jsonwebtoken";
import { AuthService } from "../../services/auth-service";
import { isValid } from "../../utils/validation-util";

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
      res.json({
        isSuccess: false,
        error: { message: "User not found" },
      });
      return;
    }
    if (username === user.username && password === user.password) {
      const payload = { username: user.username };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      const authCookie = `auth_token=${token}; Path=/; Max-Age=600; ${
        process.env.NODE_ENV === "production" ? "Secure" : ""
      }`;
      res.setHeader("Set-Cookie", authCookie);

      res.json({ isSuccess: true });
    } else {
      res.json({
        isSuccess: false,
        error: { message: "Invalid credentials" },
      });
    }
  } catch (error) {
    res.json({
      isSuccess: false,
      error: { message: "Failed to authenticate", data: error },
    });
  }
};
