import { useEffect, useState } from "react";
import { GetCardsFilters } from "../../models/api";
import { useGetCards } from "../../hooks/use-get-cards";
import { DataGrid } from "@mui/x-data-grid";
import { categoryMapper } from "../../utils/mappers";
import { CardsTableFilters } from "./cards-table-filters";
import { CardModel } from "../../models/card";

const columns = [
  { field: "english", headerName: "English" },
  { field: "hebrew", headerName: "Hebrew" },
  { field: "category", headerName: "Category" },
  { field: "correct", headerName: "Correct" },
  { field: "wrong", headerName: "Wrong" },
  { field: "createdAt", headerName: "Added At" },
];

export type CardsTableRowType = {
  id: string;
  english: string;
  hebrew: string;
  category: string;
  correct: number;
  wrong: number;
  createdAt: string;
};

const mapCardToTableRow = (item: CardModel): CardsTableRowType => ({
  ...item,
  category: categoryMapper[item.category],
  correct: item.statistics.correct,
  wrong: item.statistics.wrong,
  createdAt: new Date().toLocaleString(),
});

export const CardsTable = () => {
  const [filters, setFilters] = useState<GetCardsFilters>({});
  const { data, isLoading } = useGetCards(filters);
  const [rows, setRows] = useState<CardsTableRowType[]>([]);

  useEffect(() => {
    if (!data || !data.isSuccess || !data.data) return;
    setRows(data.data.map((item) => mapCardToTableRow(item)));
  }, [data]);

  return (
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
  );
};
