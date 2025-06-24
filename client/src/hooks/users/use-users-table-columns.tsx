import { GridColDef } from "@mui/x-data-grid";
import { UsersTableRowType } from "../../components/users-table/users-table";
import { useScreenSize } from "../use-screen-size";
import { Roles } from "../../models/user";
import { Chip } from "@mui/material";
import { userRoleMapper } from "../../utils/mappers";
import { formatDateTime } from "../../utils/date-time";

type RoleCellPropsType = {
  role: Roles;
};
export const RoleCell = ({ role }: RoleCellPropsType) => (
  <Chip
    style={{ width: "100%" }}
    component={"span"}
    label={userRoleMapper[role] || "N/A"}
  />
);

export const useUsersTableColumns = () => {
  const { isMobile, isTablet } = useScreenSize();

  const usersTableColumns: GridColDef<UsersTableRowType>[] = [
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
      renderCell: ({ row }) => formatDateTime(row.lastPractice),
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      renderCell: ({ row }) => formatDateTime(row.createdAt),
      flex: 1,
    },
    {
      field: "actions",
      headerName: "",
      flex: 1,
      renderCell: (params) => params.value,
    },
  ];

  return isMobile
    ? usersTableColumns.slice(0, 3)
    : isTablet
    ? usersTableColumns.slice(0, 7)
    : usersTableColumns;
};
