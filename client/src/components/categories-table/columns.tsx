import { GridColDef } from "@mui/x-data-grid";
import { CategoriesTableRowType } from "./categories-table";
import { format } from "date-fns";

export const categoriesTableColumns: GridColDef<CategoriesTableRowType>[] = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "numberOfCards", headerName: "Cards", flex: 1 },
  {
    field: "updatedAt",
    valueGetter: (value) => new Date(value),
    headerName: "Updated At",
    type: "dateTime",
    flex: 1,
    sortComparator: (v1, v2) => v1 - v2,
    renderCell: ({ row }) =>
      row.updatedAt ? format(new Date(row.updatedAt), "dd/MM/yyyy HH:mm") : "",
  },
  {
    field: "createdAt",
    valueGetter: (value) => new Date(value),
    headerName: "Added At",
    type: "dateTime",
    flex: 1,
    sortComparator: (v1, v2) => v1 - v2,
    renderCell: ({ row }) =>
      row.createdAt ? format(new Date(row.createdAt), "dd/MM/yyyy HH:mm") : "",
  },
  {
    field: "actions",
    headerName: "",
    flex: 1,
    renderCell: (params) => params.value,
  },
];
