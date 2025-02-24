import { Button, Tooltip } from "@mui/material";
import { DeleteForeverRounded, EditRounded } from "@mui/icons-material";
import { useCallback, useState } from "react";
import { CategoryModel } from "../../models/category";
import { useDeleteCategory } from "../../hooks/use-delete-category";
import { MAIN_CATEGORIES } from "../../constants";
import { EditCategoryModal } from "../edit-category-modal/edit-category-modal";

export const ActionsCell = ({ category }: { category: CategoryModel }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const {
    deleteCategory,
    deleteCategoryRest: { isPending: isDeletePending },
  } = useDeleteCategory();
  const handleDeleteCategory = useCallback(
    () => deleteCategory(category.id),
    [deleteCategory, category]
  );

  const isReadonly = Object.values(MAIN_CATEGORIES).indexOf(category.id) !== -1;

  const onOpenEditModal = () => setIsEdit(true);
  const onCloseEditModal = () => setIsEdit(false);

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
      <Button
        disabled={isReadonly}
        onClick={onOpenEditModal}
        size="small"
        title="Edit"
      >
        <Tooltip title="Edit category">
          <EditRounded />
        </Tooltip>
      </Button>
      <EditCategoryModal
        open={isEdit}
        category={category}
        onClose={onCloseEditModal}
        onSuccess={onCloseEditModal}
      />
    </>
  );
};
