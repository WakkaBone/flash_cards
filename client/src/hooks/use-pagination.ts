import { GridPaginationModel } from "@mui/x-data-grid";
import { useState } from "react";

export const useTablePagination = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
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
