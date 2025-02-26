import { Router } from "express";
import {
  addUserController,
  deleteUserController,
  getUsersController,
  updateUserController,
} from "../controllers/users";
import {
  addUserValidator,
  deleteUserValidator,
  getUsersValidator,
  updateUserValidator,
} from "../validators";

const router = Router();

router.get("/", getUsersValidator, getUsersController);
router.post("/", addUserValidator, addUserController);
router.delete("/:id", deleteUserValidator, deleteUserController);
router.put("/:id", updateUserValidator, updateUserController);

export default router;
