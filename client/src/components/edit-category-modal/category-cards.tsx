import { DataGrid } from "@mui/x-data-grid";
import { useGetCards, useScreenSize } from "../../hooks";
import { useEffect, useState } from "react";
import {
  cardsTableColumns,
  CardsTableRowType,
} from "../cards-table/cards-table";
import { mapCardToTableRow } from "../../utils/mappers";
import { IdLabel } from "../../models/shared";

type CategoryCardsPropsType = {
  category: IdLabel;
};
export const CategoryCards = ({ category }: CategoryCardsPropsType) => {
  const { isMobile, isTablet } = useScreenSize();
  const [rows, setRows] = useState<CardsTableRowType[]>([]);

  const { data, isLoading, isFetching } = useGetCards({ category });

  useEffect(() => {
    if (!data.data) return;
    setRows(data.data.map((card) => mapCardToTableRow(card)));
  }, [data]);

  return (
    <DataGrid
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
      columns={isMobile ? cardsTableColumns.slice(0, 3) : cardsTableColumns}
    />
  );
};
