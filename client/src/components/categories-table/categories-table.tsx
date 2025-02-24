import { useEffect, useState } from "react";
import { GetCategoriesFilters } from "../../models/api";
import { useScreenSize, useTablePagination } from "../../hooks";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { mapCategoryToTableRow } from "../../utils/mappers";
import { ToastContainer } from "react-toastify";
import { format } from "date-fns";
import { useGetCategories } from "../../hooks/use-get-categories";
import { CategoriesFilters } from "./categories-filters";
import { BulkActions } from "./bulk-actionts";

const columns: GridColDef<CategoriesTableRowType>[] = [
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

export type CategoriesTableRowType = {
  id: string;
  name: string;
  numberOfCards: string;
  updatedAt: string;
  createdAt: string;
  actions: JSX.Element;
};

export const CategoriesTable = () => {
  const { isMobile, isTablet } = useScreenSize();

  const [filters, setFilters] = useState<GetCategoriesFilters>({});
  const { data, isLoading, isFetching } = useGetCategories(filters);
  const [rows, setRows] = useState<CategoriesTableRowType[]>([]);

  useEffect(() => {
    if (!data || !data.isSuccess || !data.data) return;
    setRows(data.data.map((item) => mapCategoryToTableRow(item)));
  }, [data]);

  //TODO: implement server side pagination
  const paginationProps = useTablePagination();

  //TODO: make grid more responsive

  const [rowsSelected, setRowsSelected] = useState<GridRowSelectionModel>([]);

  return (
    <>
      <CategoriesFilters filters={filters} onChange={setFilters} />
      {rowsSelected.length > 0 && (
        <BulkActions
          rowsSelected={rowsSelected}
          setRowsSelected={setRowsSelected}
        />
      )}
      <DataGrid
        {...paginationProps}
        checkboxSelection={!isMobile && !isTablet}
        onRowSelectionModelChange={(e) => setRowsSelected(e)}
        disableColumnFilter={isMobile || isTablet}
        disableColumnSorting={isMobile || isTablet}
        disableColumnMenu={isMobile || isTablet}
        loading={isLoading || isFetching}
        initialState={{
          sorting: {
            sortModel: [{ field: "updatedAt", sort: "desc" }],
          },
        }}
        rows={rows}
        columns={isMobile ? columns.slice(0, 3) : columns}
      />
      <ToastContainer />
    </>
  );
};
