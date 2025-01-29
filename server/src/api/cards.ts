import { Router } from "express";
const router = Router();
import { addCardValidator } from "../validators/add-card-validator";
import { addCardController } from "../controllers/add-card-controller";
import { getCardsController } from "../controllers/get-cards-controller";

router.get("/", getCardsController);
router.post("/", addCardValidator, addCardController);

export default router;
