import { Stack } from "@mui/material";
import { ImportCsvButton } from "../import-csv-button/import-csv-button";

const AddCardHeader = () => (
  <Stack
    sx={{ width: "100%", mb: 2 }}
    flexDirection={"row"}
    justifyContent={"end"}
  >
    <ImportCsvButton />
  </Stack>
);

export { AddCardHeader };
