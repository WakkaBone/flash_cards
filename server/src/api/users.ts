import { Router } from "express";
import {
  addUserController,
  bulkDeleteUsersController,
  deleteUserController,
  getUsersController,
  updateUserController,
} from "../controllers/users";
import {
  addUserValidator,
  bulkDeleteUsersValidator,
  deleteUserValidator,
  getUsersValidator,
  updateUserValidator,
} from "../validators";

const router = Router();

router.get("/", getUsersValidator, getUsersController);
router.post("/", addUserValidator, addUserController);
router.delete(
  "/bulk/delete",
  bulkDeleteUsersValidator,
  bulkDeleteUsersController
);
router.delete("/:id", deleteUserValidator, deleteUserController);
router.put("/:id", updateUserValidator, updateUserController);

export default router;
