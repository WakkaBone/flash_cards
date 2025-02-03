import { Response, Router } from "express";
import { ApiResponse } from "../models/api-response";

const { version } = require("../../package.json");

const router = Router();

router.get("/", (req, res: Response<ApiResponse>) => {
  try {
    res.status(200).json({ isSuccess: true, data: version });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to get app version", data: error },
    });
  }
});

export default router;
