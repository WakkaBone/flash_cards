import { useEffect, useState } from "react";
import { GetCategoriesFilters } from "../../models/filters";
import {
  useScreenSize,
  useTablePagination,
  useCategoriesTableColumns,
  useModal,
} from "../../hooks";
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { mapCategoryToTableRow } from "../../utils/mappers";
import { ToastContainer } from "react-toastify";
import { useGetCategories } from "../../hooks/categories/use-get-categories";
import { CategoriesFilters } from "./categories-filters";
import { BulkActions } from "./bulk-actions";
import { EditCategoryModal } from "../edit-category-modal/edit-category-modal";
import { CategoryModel } from "../../models/category";
import { MAIN_CATEGORIES } from "../../constants";

export type CategoriesTableRowType = {
  id: string;
  name: string;
  numberOfCards: number;
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

  const allowEditOnClick = isMobile || isTablet;

  const [category, setCategory] = useState<CategoryModel | undefined>();

  const editModal = useModal({ onClose: () => setCategory(undefined) });

  useEffect(() => {
    allowEditOnClick && !!category ? editModal.onOpen() : editModal.onClose();
  }, [allowEditOnClick, category, editModal]);

  const columns = useCategoriesTableColumns();

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
        columns={columns}
        disableRowSelectionOnClick
        onRowClick={({ row }) => {
          if (!allowEditOnClick) return;
          const selectedCategory = data.data?.find(({ id }) => row.id === id);
          selectedCategory && setCategory(selectedCategory);
        }}
      />
      {allowEditOnClick && category && (
        <EditCategoryModal
          {...editModal}
          category={category}
          isReadonly={
            Object.values(MAIN_CATEGORIES).indexOf(category.id) !== -1
          }
        />
      )}
      <ToastContainer />
    </>
  );
};
