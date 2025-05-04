import { GridColDef } from "@mui/x-data-grid";
import { CardsTableRowType } from "./cards-table";
import { format } from "date-fns";

export const cardsTableColumns: GridColDef<CardsTableRowType>[] = [
  { field: "english", headerName: "English" },
  { field: "hebrew", headerName: "Hebrew" },
  {
    field: "priority",
    headerName: "Priority",
    renderCell: (params) => params.value,
  },
  { field: "category", headerName: "Category" },
  { field: "correct", headerName: "Correct" },
  { field: "wrong", headerName: "Wrong" },
  { field: "isLearned", headerName: "Is Learned" },
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
    flex: 2,
    renderCell: (params) => params.value,
  },
];
