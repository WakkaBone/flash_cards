import { Button, Tooltip } from "@mui/material";
import { DeleteForeverRounded, EditRounded } from "@mui/icons-material";
import { useCallback } from "react";
import { CategoryModel } from "../../models/category";
import { useDeleteCategory, useModal } from "../../hooks";
import { MAIN_CATEGORIES } from "../../constants";
import { EditCategoryModal } from "../edit-category-modal/edit-category-modal";

export const ActionsCell = ({ category }: { category: CategoryModel }) => {
  const editModal = useModal();

  const {
    deleteCategory,
    deleteCategoryRest: { isPending: isDeletePending },
  } = useDeleteCategory();
  const handleDeleteCategory = useCallback(
    () => deleteCategory(category.id),
    [deleteCategory, category]
  );

  const isReadonly = Object.values(MAIN_CATEGORIES).indexOf(category.id) !== -1;

  return (
    <>
      <Button
        size="small"
        disabled={isReadonly}
        onClick={handleDeleteCategory}
        loading={isDeletePending}
      >
        <Tooltip title="Delete category">
          <DeleteForeverRounded />
        </Tooltip>
      </Button>
      <Button onClick={editModal.onOpen} size="small" title="Edit">
        <Tooltip title="Edit category">
          <EditRounded />
        </Tooltip>
      </Button>
      <EditCategoryModal
        {...editModal}
        category={category}
        onSuccess={editModal.onClose}
        isReadonly={isReadonly}
      />
    </>
  );
};
