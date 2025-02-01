import { Router } from "express";
import {
  addCardController,
  deleteCardController,
  getCardsController,
  markLearnedController,
  updateCardController,
  updateStatisticsController,
} from "../controllers/cards";
import {
  addCardValidator,
  deleteCardValidator,
  getCardsValidator,
  markLearnedValidator,
  updateCardValidator,
  updateStatisticsValidator,
} from "../validators";
import { getRandomCardController } from "../controllers/cards/get-random-card-controller";

const router = Router();

router.get("/", getCardsValidator, getCardsController);
router.get("/random", getCardsValidator, getRandomCardController);
router.post("/", addCardValidator, addCardController);
router.put("/:id", updateCardValidator, updateCardController);
router.delete("/:id", deleteCardValidator, deleteCardController);
router.patch(
  "/:id/statistics/:action",
  updateStatisticsValidator,
  updateStatisticsController
);
router.patch("/:id/learned", markLearnedValidator, markLearnedController);

export default router;
