import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { isValid } from "../../utils/validation-util";
import { AuthService, UsersService } from "../../services";
import { encrypt } from "../../utils/encryption-util";
import { UserModel } from "../../models/user";
import { JwtPayload } from "../../utils/jwt-util";
import bcrypt from "bcrypt";

type PatchAccountBody = {
  username: string;
  oldPassword: string;
  newPassword: string;
};
export const patchAccountController = async (
  req: Request<null, ApiResponse<string>, PatchAccountBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { id } = UsersService.getUserFromToken(req);
    const user = await UsersService.getUserById(id);

    const { username, oldPassword, newPassword } = req.body;

    const updatedUser: UserModel = {
      ...user,
      username: username || user.username,
    };

    if (oldPassword && newPassword) {
      const isOldPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!isOldPasswordCorrect) {
        res.status(400).json({
          isSuccess: false,
          error: { message: "Old password is incorrect" },
        });
        return;
      }

      const passwordHash = await encrypt(newPassword);

      updatedUser.password = passwordHash;
    }

    await UsersService.updateUser(id, updatedUser);

    //reissue tokens with updated data
    const payload: JwtPayload = {
      id,
      username: updatedUser.username,
      role: updatedUser.role,
    };

    const authCookies = AuthService.issueAuthCookies(payload);

    res.setHeader("Set-Cookie", authCookies);

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to patch user account", data: error },
    });
  }
};
