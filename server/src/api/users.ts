import { Router } from "express";
import {
  addUserController,
  deleteUserController,
  getUsersController,
} from "../controllers/users";
import {
  addUserValidator,
  deleteUserValidator,
  getUsersValidator,
} from "../validators";

const router = Router();

router.get("/", getUsersValidator, getUsersController);
router.post("/", addUserValidator, addUserController);
router.delete("/:id", deleteUserValidator, deleteUserController);

export default router;
