import { GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { UsersTableRowType } from "./users-table";
import { RoleCell } from "./role-cell";

export const usersTableColumns: GridColDef<UsersTableRowType>[] = [
  { field: "username", headerName: "Username" },
  { field: "numberOfCards", headerName: "Cards" },
  {
    field: "role",
    headerName: "Role",
    renderCell: (params) => <RoleCell role={params.row.role} />,
  },
  { field: "currentStreak", headerName: "Current Streak", flex: 1 },
  { field: "longestStreak", headerName: "Longest Streak", flex: 1 },
  {
    field: "lastPractice",
    headerName: "Last Practice",
    renderCell: ({ row }) =>
      row.lastPractice
        ? format(new Date(row.lastPractice), "dd/MM/yyyy HH:mm")
        : "",
    flex: 1,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    renderCell: ({ row }) =>
      row.lastPractice
        ? format(new Date(row.createdAt), "dd/MM/yyyy HH:mm")
        : "",
    flex: 1,
  },
  {
    field: "actions",
    headerName: "",
    flex: 1,
    renderCell: (params) => params.value,
  },
];
