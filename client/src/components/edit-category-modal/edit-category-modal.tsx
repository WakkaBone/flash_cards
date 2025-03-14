import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { CategoryModel } from "../../models/category";
import { useUpdateCategory } from "../../hooks";
import { EditCategoryForm, EditCategoryFormType } from "./edit-category-form";
import { CategoryCards } from "./category-cards";

type EditCategoryModalPropsType = {
  open: boolean;
  category: CategoryModel;
  onClose: () => void;
  onSuccess?: (updatedData: CategoryModel) => void;
  isReadonly: boolean;
};
export const EditCategoryModal = ({
  open,
  category,
  onClose,
  onSuccess,
  isReadonly,
}: EditCategoryModalPropsType) => {
  const { updateCategory, isPending } = useUpdateCategory();

  const formProps = useForm<EditCategoryFormType>({
    defaultValues: { label: category.label },
    disabled: isReadonly,
  });

  const onSave = async (formValues: EditCategoryFormType) => {
    const payload = { ...category, ...formValues };
    updateCategory(payload, {
      onSuccess: (data) => {
        if (!data.isSuccess) return;
        formProps.reset(formValues);
        onClose();
        onSuccess?.(payload);
      },
      hideToast: true,
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Category</DialogTitle>
      <form onSubmit={formProps.handleSubmit(onSave)} style={{ width: "100%" }}>
        <DialogContent>
          <EditCategoryForm formProps={formProps} />
          <CategoryCards category={category} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            loading={isPending}
            disabled={!formProps.formState.isDirty}
            type="submit"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
