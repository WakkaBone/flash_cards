import { useEffect, useState } from "react";
import { GetCategoriesFilters } from "../../models/api";
import { useScreenSize, useTablePagination } from "../../hooks";
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { mapCategoryToTableRow } from "../../utils/mappers";
import { ToastContainer } from "react-toastify";
import { useGetCategories } from "../../hooks/categories/use-get-categories";
import { CategoriesFilters } from "./categories-filters";
import { BulkActions } from "./bulk-actions";
import { categoriesTableColumns } from "./columns";

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
        columns={
          isMobile ? categoriesTableColumns.slice(0, 3) : categoriesTableColumns
        }
        disableRowSelectionOnClick
      />
      <ToastContainer />
    </>
  );
};
