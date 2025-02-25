import { Request, Response } from "express";
import { PatchService } from "../services/patch-service";

export const patchDbController = async (req: Request, res: Response) => {
  try {
    //await PatchService.resetSrsProps()

    // await PatchService.resetPriority();

    // await PatchService.resetUserTimeline(req);

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to patch the db", data: error },
    });
  }
};
