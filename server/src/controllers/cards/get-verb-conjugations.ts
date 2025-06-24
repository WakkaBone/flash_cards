import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services";
import { isValid } from "../../utils/validation-util";
import { VerbConjugations } from "../../models/verb";

type GetVerbConjugationsQueryParams = {
  infinitive: string;
};
export const getVerbConjugationsController = async (
  req: Request<GetVerbConjugationsQueryParams, ApiResponse, null>,
  res: Response<ApiResponse<VerbConjugations | null>>
) => {
  if (!isValid(req, res)) return;
  try {
    const { infinitive } = req.params;

    const result = await CardsService.getVerbConjugations(infinitive);
    res.status(200).json({ isSuccess: true, data: result });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get verb conjugations", data: error },
    });
  }
};
