import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { isValid } from "../../utils/validation-util";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import { UsersService } from "../../services";
import { Roles, UserModel } from "../../models/user";
import { encrypt } from "../../utils/encryption-util";

type CreateUserBody = {
  username: string;
  password: string;
  role: Roles;
};
export const addUserController = async (
  req: Request<null, ApiResponse, CreateUserBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { username, password, role } = req.body;

    const passwordHash = await encrypt(password);

    const user: UserModel = {
      username,
      password: passwordHash,
      role,
      lastPractice: Timestamp.now(),
      createdAt: serverTimestamp(),
      currentStreak: 0,
      longestStreak: 0,
      practiceTimeline: [],
    };

    await UsersService.addUser(user);

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to add the user", data: error },
    });
  }
};
