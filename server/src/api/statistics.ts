import { Router } from "express";
import {
  getAdminStatisticsController,
  getCardsDynamicsController,
  getStatisticsController,
  getTimelineController,
  getUsersDynamicsController,
} from "../controllers/statistics";
import { isAdminValidation } from "../validators/shared";

const router = Router();

router.get("/counters", getStatisticsController);
router.get(
  "/counters-admin",
  [isAdminValidation],
  getAdminStatisticsController
);
router.get("/cards-dynamics", isAdminValidation, getCardsDynamicsController);
router.get("/timeline", getTimelineController);
router.get("/users-dynamics", isAdminValidation, getUsersDynamicsController);

export default router;
