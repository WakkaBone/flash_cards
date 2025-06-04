import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { isValid } from "../../utils/validation-util";
import { UserModel, UserModelDto } from "../../models/user";
import { UsersService } from "../../services";

type UpdateUserParams = { id: string };
type UpdateUserBody = UserModelDto;
export const updateUserController = async (
  req: Request<UpdateUserParams, ApiResponse, UpdateUserBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { id } = req.params;
    const { username, role } = req.body;
    const user = await UsersService.getUserById(id);

    const updatedUser: UserModel = {
      username,
      role,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      lastPractice: user.lastPractice,
      password: user.password,
      practiceTimeline: user.practiceTimeline,
      createdAt: user.createdAt,
    };

    await UsersService.updateUser(id, updatedUser);
    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to update the user", data: error },
    });
  }
};
