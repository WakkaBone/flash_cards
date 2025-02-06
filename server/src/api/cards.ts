import { Router } from "express";
import {
  addCardController,
  deleteCardController,
  getCardsController,
  markLearnedController,
  updateCardController,
  updateStatisticsController,
  getRandomCardController,
  getStatisticsController,
  addCardPrecheckController,
} from "../controllers/cards";
import {
  addCardValidator,
  deleteCardValidator,
  getCardsValidator,
  markLearnedValidator,
  updateCardValidator,
  updateStatisticsValidator,
} from "../validators";

const router = Router();

router.get("/", getCardsValidator, getCardsController);
router.get("/random", getCardsValidator, getRandomCardController);
router.post("/check", addCardValidator, addCardPrecheckController);
router.post("/", addCardValidator, addCardController);
router.put("/:id", updateCardValidator, updateCardController);
router.delete("/:id", deleteCardValidator, deleteCardController);
router.patch(
  "/:id/statistics/:action",
  updateStatisticsValidator,
  updateStatisticsController
);
router.patch("/:id/learned", markLearnedValidator, markLearnedController);
router.get("/statistics", getStatisticsController);

export default router;
