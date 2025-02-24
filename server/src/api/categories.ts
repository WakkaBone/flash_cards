import { Router } from "express";
import {
  addCategoryValidator,
  bulkDeleteCategoriesValidator,
  deleteCategoryValidator,
  getCategoriesValidator,
  updateCategoryValidator,
} from "../validators";
import {
  addCategoryController,
  bulkDeleteCategoriesController,
  deleteCategoryController,
  getCategoriesController,
  updateCategoryController,
} from "../controllers/categories";

const router = Router();

router.get("/", getCategoriesValidator, getCategoriesController);
router.post("/", addCategoryValidator, addCategoryController);
router.put("/:id", updateCategoryValidator, updateCategoryController);
router.delete(
  "/bulk/delete",
  bulkDeleteCategoriesValidator,
  bulkDeleteCategoriesController
);
router.delete("/:id", deleteCategoryValidator, deleteCategoryController);

export default router;
