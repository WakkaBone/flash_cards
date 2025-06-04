import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { isValid } from "../../utils/validation-util";
import { CardsService, CategoriesService, UsersService } from "../../services";

type DeleteUserParams = { id: string };
export const deleteUserController = async (
  req: Request<DeleteUserParams, ApiResponse>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const { id } = req.params;

    await UsersService.deleteUser(id);
    await CardsService.deleteUsersCards(id);
    await CategoriesService.deleteUsersCategories(id);

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to delete the user", data: error },
    });
  }
};
