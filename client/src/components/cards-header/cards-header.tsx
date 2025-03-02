import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { TableHeader } from "../table-header/table-header";

export const CardsHeader = () => {
  const navigate = useNavigate();
  const handleAdd = () => navigate(ROUTES.addCard);

  return (
    <TableHeader>
      <Button variant="contained" onClick={handleAdd}>
        Add Card
      </Button>
    </TableHeader>
  );
};
