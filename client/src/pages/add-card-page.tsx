import { Box } from "@mui/material";
import { PageTitle } from "../components/layout/page-title";
import { AddCardForm } from "../components/add-card-form/add-card-form";

export const AddCardPage = () => {
  return (
    <Box>
      <PageTitle>Add Card</PageTitle>
      <AddCardForm />
    </Box>
  );
};
