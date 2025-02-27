import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { isValid } from "../../utils/validation-util";
import { UsersService } from "../../services/users-service";
import { encrypt } from "../../utils/encryption-util";
import { Roles, UserModel } from "../../models/user";
import { serverTimestamp, Timestamp } from "firebase/firestore";

type SignupBody = {
  username: string;
  password: string;
};
export const signupController = async (
  req: Request<null, ApiResponse<string>, SignupBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { username, password } = req.body;

    const passwordHash = await encrypt(password);

    const user: UserModel = {
      username,
      password: passwordHash,
      role: Roles.user,
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
      error: { message: "Failed to sign up", data: error },
    });
  }
};
