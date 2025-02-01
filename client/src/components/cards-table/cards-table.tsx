import { useEffect, useState } from "react";
import { GetCardsFilters } from "../../models/api";
import { useGetCards } from "../../hooks/use-get-cards";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { categoryMapper } from "../../utils/mappers";
import { CardsTableFilters } from "./cards-table-filters";
import { CardModel } from "../../models/card";
import { defaultFilters } from "../../hooks/use-cards-table-filters";
import { ActionsCell } from "./actions-cell";
import { ToastContainer } from "react-toastify";

const columns: GridColDef<CardsTableRowType>[] = [
  { field: "english", headerName: "English" },
  { field: "hebrew", headerName: "Hebrew" },
  { field: "category", headerName: "Category" },
  { field: "correct", headerName: "Correct" },
  { field: "wrong", headerName: "Wrong" },
  { field: "isLearned", headerName: "Is Learned" },
  { field: "createdAt", headerName: "Added At" },
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

const mapCardToTableRow = (item: CardModel): CardsTableRowType => ({
  ...item,
  category: categoryMapper[item.category],
  correct: item.statistics.correct,
  wrong: item.statistics.wrong,
  isLearned: item.isLearned ? "Yes" : "No",
  createdAt: new Date().toLocaleString(),
  actions: <ActionsCell card={item} />,
});

export const CardsTable = () => {
  const [filters, setFilters] = useState<GetCardsFilters>(defaultFilters);
  const { data, isLoading } = useGetCards(filters);
  const [rows, setRows] = useState<CardsTableRowType[]>([]);

  useEffect(() => {
    if (!data || !data.isSuccess || !data.data) return;
    setRows(data.data.map((item) => mapCardToTableRow(item)));
  }, [data]);

  return (
    <>
      <DataGrid
        loading={isLoading}
        slots={{
          toolbar: () => (
            <CardsTableFilters filters={filters} onChange={setFilters} />
          ),
        }}
        rows={rows}
        columns={columns}
      />
      <ToastContainer />
    </>
  );
};
