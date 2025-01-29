import { Router } from "express";
const router = Router();
import { addCardValidator } from "../validators/add-card-validator";
import { addCardController } from "../controllers/add-card-controller";

router.post("/add-card", addCardValidator, addCardController);

export default router;
