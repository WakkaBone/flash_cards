import { Box } from "@mui/material";
import { PageTitle } from "../components/layout/page-title";
import { AddCardForm } from "../components/add-card-form/add-card-form";
import { AddCardHeader } from "../components/add-card-header/add-card-header";

export const AddCardPage = () => {
  return (
    <Box>
      <PageTitle>Add Card</PageTitle>
      <AddCardHeader />
      <AddCardForm />
    </Box>
  );
};
