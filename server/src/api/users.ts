import { Router } from "express";
import {
  addUserController,
  bulkDeleteUsersController,
  deleteUserController,
  getTimelineController,
  getUsersController,
  getUsersDynamicsController,
  updateUserController,
} from "../controllers/users";
import {
  addUserValidator,
  bulkDeleteUsersValidator,
  deleteUserValidator,
  getUsersValidator,
  updateUserValidator,
} from "../validators";
import { isAdminValidation } from "../validators/shared";

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
router.get("/timeline", getTimelineController);
router.get("/dynamics", isAdminValidation, getUsersDynamicsController);

export default router;
