import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { isValid } from "../../utils/validation-util";
import {
  CategoriesService,
  GetCategoriesFilters,
} from "../../services/categories-service";
import { CategoryDto } from "../../models/category";
import { UsersService } from "../../services/users-service";

type GetCategoriesQueryParams = {
  search?: string;
  from?: string;
  to?: string;
  numberOfCards: string;
  page?: string;
  pageSize?: string;
};
export const getCategoriesController = async (
  req: Request<null, ApiResponse, null, GetCategoriesQueryParams>,
  res: Response<ApiResponse<CategoryDto[]>>
) => {
  if (!isValid(req, res)) return;
  try {
    const { search, from, to, numberOfCards, page, pageSize } = req.query;

    const filters: GetCategoriesFilters = {
      search,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      numberOfCards: numberOfCards ? Number(numberOfCards) : undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      ownerId: UsersService.getUserFromToken(req).id,
    };

    const result = await CategoriesService.getCategories(filters);
    res.status(200).json({ isSuccess: true, data: result });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get categories", data: error },
    });
  }
};
