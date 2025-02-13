import { Router } from "express";
import {
  addCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
  updateUpdatedAtValidator,
} from "../validators";
import {
  addCategoryController,
  deleteCategoryController,
  getCategoriesController,
  updateCategoryController,
  updateUpdatedAtController,
} from "../controllers/categories";

const router = Router();

router.get("/", getCategoriesController);
router.post("/", addCategoryValidator, addCategoryController);
router.put("/:id", updateCategoryValidator, updateCategoryController);
router.patch("/:id", updateUpdatedAtValidator, updateUpdatedAtController);
router.delete("/:id", deleteCategoryValidator, deleteCategoryController);

export default router;
