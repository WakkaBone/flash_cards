import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { isValid } from "../../utils/validation-util";
import { JwtPayload } from "../../utils/jwt-util";
import { AuthService, UsersService } from "../../services";
import bcrypt from "bcrypt";

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

    const user = await UsersService.getUserByUsername(username);
    if (!user) {
      res.status(400).json({
        isSuccess: false,
        error: { message: "User not found" },
      });
      return;
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (passwordCorrect) {
      const payload: JwtPayload = { id: user.id, username, role: user.role };
      const authCookies = AuthService.issueAuthCookies(payload);

      res.setHeader("Set-Cookie", authCookies);

      res.status(200).json({ isSuccess: true, data: payload });
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
