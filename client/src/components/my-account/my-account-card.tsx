import { Card, CardActions, CardContent } from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/auth-context";
import { MyAccountForm, MyAccountFormType } from "./my-account-form";
import { MyAccountCardActions } from "./my-account-card-actions";
import { usePatchAccount } from "../../hooks";
import { PatchAccountPayload } from "../../models/api";
import { ToastContainer } from "react-toastify";

export const MyAccountCard = () => {
  const { patchAccount, isPending } = usePatchAccount();

  const [isEdit, setIsEdit] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const { user } = useAuthContext();
  const form = useForm<MyAccountFormType>({
    disabled: !isEdit || isPending,
    defaultValues: {
      username: user?.username,
      confirmPassword: "",
      newPassword: "",
      oldPassword: "",
    },
  });

  useEffect(() => {
    if (!isEdit) {
      setChangePassword(false);
      form.reset();
    }
  }, [isEdit, form]);

  const handleSave = ({
    username,
    oldPassword,
    newPassword,
  }: MyAccountFormType) => {
    const payload: PatchAccountPayload = {
      username: user?.username !== username ? username : undefined,
      oldPassword: oldPassword || undefined,
      newPassword: newPassword || undefined,
    };
    patchAccount(payload, {
      onSettled: (data) => {
        if (!data?.isSuccess) return;
        setIsEdit(false);
        form.reset({
          username,
          confirmPassword: "",
          newPassword: "",
          oldPassword: "",
        });
      },
    });
  };

  const onSave = () => form.handleSubmit(handleSave)();

  return (
    <Card sx={{ padding: 3 }}>
      <CardActions
        sx={{
          justifyContent: "flex-end",
          padding: "0px 16px 10px",
          borderBottom: "1px solid #ccc",
          marginBottom: "16px",
        }}
      >
        <MyAccountCardActions
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          onSave={onSave}
          allowSave={form.formState.isDirty}
          isLoading={isPending}
        />
      </CardActions>
      <CardContent>
        <MyAccountForm
          isEdit={isEdit}
          form={form}
          isLoading={isPending}
          changePassword={changePassword}
          setChangePassword={setChangePassword}
        />
      </CardContent>
      <ToastContainer />
    </Card>
  );
};
