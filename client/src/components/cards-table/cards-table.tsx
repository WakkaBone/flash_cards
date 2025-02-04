import { useEffect, useState } from "react";
import { GetCardsFilters } from "../../models/api";
import { useGetCards, useScreenSize, useTablePagination } from "../../hooks";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { mapCardToTableRow } from "../../utils/mappers";
import { CardsTableFilters } from "./cards-table-filters";
import { defaultFilters } from "../../hooks/use-cards-table-filters";
import { ToastContainer } from "react-toastify";
import { format } from "date-fns";

const columns: GridColDef<CardsTableRowType>[] = [
  { field: "english", headerName: "English" },
  { field: "hebrew", headerName: "Hebrew" },
  { field: "category", headerName: "Category" },
  { field: "correct", headerName: "Correct" },
  { field: "wrong", headerName: "Wrong" },
  { field: "isLearned", headerName: "Is Learned" },
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

export type CardsTableRowType = {
  id: string;
  english: string;
  hebrew: string;
  category: string;
  correct: number;
  wrong: number;
  isLearned: string;
  createdAt: string;
  actions: JSX.Element;
};

export const CardsTable = () => {
  const { isMobile, isTablet } = useScreenSize();

  const [filters, setFilters] = useState<GetCardsFilters>(defaultFilters);
  const { data, isLoading } = useGetCards(filters);
  const [rows, setRows] = useState<CardsTableRowType[]>([]);

  useEffect(() => {
    if (!data || !data.isSuccess || !data.data) return;
    setRows(data.data.map((item) => mapCardToTableRow(item)));
  }, [data]);

  //TODO implement server side pagination
  const paginationProps = useTablePagination();

  return (
    <>
      <CardsTableFilters filters={filters} onChange={setFilters} />
      <DataGrid
        {...paginationProps}
        disableColumnFilter={isMobile || isTablet}
        disableColumnSorting={isMobile || isTablet}
        disableColumnMenu={isMobile || isTablet}
        loading={isLoading}
        initialState={{
          sorting: {
            sortModel: [{ field: "createdAt", sort: "desc" }],
          },
        }}
        rows={rows}
        columns={isMobile ? columns.slice(0, 3) : columns}
      />
      <ToastContainer />
    </>
  );
};
