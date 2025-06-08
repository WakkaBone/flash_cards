import { useEffect, useState } from "react";
import { GetUsersFilters } from "../../models/filters";
import {
  useGetUsers,
  useScreenSize,
  useTablePagination,
  useUsersTableColumns,
} from "../../hooks";
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { mapUserToTableRow } from "../../utils/mappers";
import { ToastContainer } from "react-toastify";
import { Roles, UserModel } from "../../models/user";
import { BulkActions } from "./bulk-actions";
import { UsersFilters } from "./users-filters";
import { defaultFilters } from "../../hooks/users/use-users-table-filters";
import { EditUserModal } from "../edit-user-modal/edit-user-modal";

export type UsersTableRowType = {
  id: string;
  username: string;
  numberOfCards: number;
  currentStreak: number;
  longestStreak: number;
  role: Roles;
  lastPractice: string;
  createdAt: string;
  actions: JSX.Element;
};

export const UsersTable = () => {
  const { isMobile, isTablet } = useScreenSize();

  const [filters, setFilters] = useState<GetUsersFilters>(defaultFilters);
  const { data, isLoading, isFetching } = useGetUsers(filters);
  const [rows, setRows] = useState<UsersTableRowType[]>([]);

  useEffect(() => {
    if (!data || !data.isSuccess || !data.data) return;
    setRows(data.data.map((item) => mapUserToTableRow(item)));
  }, [data]);

  const paginationProps = useTablePagination();

  //TODO: make grid more responsive

  const [rowsSelected, setRowsSelected] = useState<GridRowSelectionModel>([]);

  const allowEditOnClick = isMobile || isTablet;
  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState<UserModel | undefined>();
  const onCloseEditModal = () => setUser(undefined);
  useEffect(() => {
    allowEditOnClick && setIsEdit(!!user);
  }, [allowEditOnClick, user]);

  const columns = useUsersTableColumns();

  return (
    <>
      <UsersFilters filters={filters} onChange={setFilters} />
      {rowsSelected.length > 0 && (
        <BulkActions
          rowsSelected={rowsSelected}
          setRowsSelected={setRowsSelected}
        />
      )}
      <DataGrid
        {...paginationProps}
        onRowSelectionModelChange={(e) => setRowsSelected(e)}
        checkboxSelection={!isMobile && !isTablet}
        disableColumnFilter={isMobile || isTablet}
        disableColumnSorting={isMobile || isTablet}
        disableColumnMenu={isMobile || isTablet}
        loading={isLoading || isFetching}
        initialState={{
          sorting: {
            sortModel: [{ field: "createdAt", sort: "desc" }],
          },
        }}
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        onRowClick={({ row }) => {
          if (!allowEditOnClick) return;
          const selectedCategory = data.data?.find(({ id }) => row.id === id);
          selectedCategory && setUser(selectedCategory);
        }}
      />
      {allowEditOnClick && user && (
        <EditUserModal open={isEdit} user={user} onClose={onCloseEditModal} />
      )}
      <ToastContainer />
    </>
  );
};
