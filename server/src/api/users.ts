import { Router } from "express";
import { getUsersController } from "../controllers/users";
import { getUsersValidator } from "../validators";

const router = Router();

router.get("/", getUsersValidator, getUsersController);

export default router;
