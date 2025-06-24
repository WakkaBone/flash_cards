import { GridColDef } from "@mui/x-data-grid";
import { useScreenSize } from "../use-screen-size";
import { CategoriesTableRowType } from "../../components/categories-table/categories-table";
import { formatDateTime } from "../../utils/date-time";

export const useCategoriesTableColumns = () => {
  const { isMobile, isTablet } = useScreenSize();

  const categoriesTableColumns: GridColDef<CategoriesTableRowType>[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "numberOfCards", headerName: "Cards", flex: 1 },
    {
      field: "updatedAt",
      valueGetter: (value) => new Date(value),
      headerName: "Updated At",
      type: "dateTime",
      flex: 1,
      sortComparator: (v1, v2) => v1 - v2,
      renderCell: ({ row }) => formatDateTime(row.updatedAt),
    },
    {
      field: "createdAt",
      valueGetter: (value) => new Date(value),
      headerName: "Added At",
      type: "dateTime",
      flex: 1,
      sortComparator: (v1, v2) => v1 - v2,
      renderCell: ({ row }) => formatDateTime(row.createdAt),
    },
    {
      field: "actions",
      headerName: "",
      flex: 1,
      renderCell: (params) => params.value,
    },
  ];

  return isMobile
    ? categoriesTableColumns.slice(0, 3)
    : isTablet
    ? categoriesTableColumns.slice(0, 4)
    : categoriesTableColumns;
};
