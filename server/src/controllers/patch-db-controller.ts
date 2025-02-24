import { Request, Response } from "express";

export const patchDbController = async (req: Request, res: Response) => {
  try {
    //TODO: patch login here
    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to patch the db", data: error },
    });
  }
};
