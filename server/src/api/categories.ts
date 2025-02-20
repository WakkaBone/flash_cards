import { Router } from "express";
import {
  addCategoryValidator,
  deleteCategoryValidator,
  getCategoriesValidator,
  updateCategoryValidator,
} from "../validators";
import {
  addCategoryController,
  deleteCategoryController,
  getCategoriesController,
  updateCategoryController,
} from "../controllers/categories";

const router = Router();

router.get("/", getCategoriesValidator, getCategoriesController);
router.post("/", addCategoryValidator, addCategoryController);
router.put("/:id", updateCategoryValidator, updateCategoryController);
router.delete("/:id", deleteCategoryValidator, deleteCategoryController);

export default router;
