import { Router } from "express";
import { getUsersController } from "../controllers/users";
import { addUserValidator, getUsersValidator } from "../validators";
import { addUserController } from "../controllers/users/add-user-controller";

const router = Router();

router.get("/", getUsersValidator, getUsersController);
router.post("/", addUserValidator, addUserController);

export default router;
