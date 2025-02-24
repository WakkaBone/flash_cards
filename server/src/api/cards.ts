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
  bulkDeleteCardsController,
  bulkMarkLearnedController,
} from "../controllers/cards";
import {
  addCardValidator,
  bulkDeleteCardsValidator,
  bulkMarkLearnedValidator,
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
//bulk delete route needs to be before the delete by id route, otherwise the delete by id route will get called
router.delete(
  "/bulk/delete",
  bulkDeleteCardsValidator,
  bulkDeleteCardsController
);
router.patch(
  "/bulk/learned",
  bulkMarkLearnedValidator,
  bulkMarkLearnedController
);
router.delete("/:id", deleteCardValidator, deleteCardController);
router.patch(
  "/:id/statistics/:action",
  updateStatisticsValidator,
  updateStatisticsController
);
router.patch("/:id/learned", markLearnedValidator, markLearnedController);
router.get("/statistics", getStatisticsController);

export default router;
