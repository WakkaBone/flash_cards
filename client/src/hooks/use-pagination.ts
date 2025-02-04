import { GridPaginationModel } from "@mui/x-data-grid";
import { useState } from "react";

const DEFAULT_PAGE_SIZE = 10;

export const useTablePagination = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const onPaginationModelChange = (paginationModel: GridPaginationModel) =>
    setPaginationModel(paginationModel);

  const pageSizeOptions = [10, 20, 100];

  return {
    paginationModel,
    onPaginationModelChange,
    pageSizeOptions,
  };
};
