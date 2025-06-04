import { useEffect, useState } from "react";
import { GetUsersFilters } from "../../models/filters";
import { useGetUsers, useScreenSize, useTablePagination } from "../../hooks";
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { mapUserToTableRow } from "../../utils/mappers";
import { ToastContainer } from "react-toastify";
import { usersTableColumns } from "./columns";
import { Roles } from "../../models/user";
import { BulkActions } from "./bulk-actions";
import { UsersFilters } from "./users-filters";
import { defaultFilters } from "../../hooks/users/use-users-table-filters";

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
        columns={isMobile ? usersTableColumns.slice(0, 3) : usersTableColumns}
        disableRowSelectionOnClick
      />
      <ToastContainer />
    </>
  );
};
