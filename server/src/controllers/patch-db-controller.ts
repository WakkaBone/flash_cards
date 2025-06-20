import { Request, Response } from "express";
import { PatchService } from "../services";

export const patchDbController = async (req: Request, res: Response) => {
  try {
    //await PatchService.resetSrsProps()

    // await PatchService.resetPriority();

    // await PatchService.resetUserTimeline(req);

    // await PatchService.addOwnerIdToEntities(req);

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to patch the db", data: error },
    });
  }
};
