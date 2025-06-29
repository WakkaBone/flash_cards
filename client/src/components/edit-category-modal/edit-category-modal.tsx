import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { CategoryModel } from "../../models/category";
import { useUpdateCategory } from "../../hooks";
import { EditCategoryForm, EditCategoryFormType } from "./edit-category-form";
import { CategoryCards } from "./category-cards";
import { Modal } from "../modal/modal";
import { FORM_IDS } from "../../constants";

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

  const Actions = () => (
    <Box>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button
        loading={isPending}
        disabled={!formProps.formState.isDirty}
        type="submit"
        color="primary"
        form={FORM_IDS.editCategory}
      >
        Save
      </Button>
    </Box>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      actions={<Actions />}
      title="Edit Category"
    >
      <form
        id={FORM_IDS.editCategory}
        onSubmit={formProps.handleSubmit(onSave)}
        style={{ marginTop: "1rem" }}
      >
        <EditCategoryForm formProps={formProps} />
        <CategoryCards category={category} />
      </form>
    </Modal>
  );
};
