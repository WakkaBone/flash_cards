import { DataGrid } from "@mui/x-data-grid";
import {
  useGetCards,
  useScreenSize,
  useTablePagination,
  useCardsTableColumns,
} from "../../hooks";
import { useEffect, useState } from "react";
import { CardsTableRowType } from "../cards-table/cards-table";
import { mapCardToTableRow } from "../../utils/mappers";

type UserCardsPropsType = {
  userId: string;
};
export const UserCards = ({ userId }: UserCardsPropsType) => {
  const { isMobile, isTablet } = useScreenSize();
  const [rows, setRows] = useState<CardsTableRowType[]>([]);

  const { data, isLoading, isFetching } = useGetCards({ ownerId: userId });

  useEffect(() => {
    if (!data.data) return;
    setRows(data.data.map((card) => mapCardToTableRow(card)));
  }, [data]);

  const paginationProps = useTablePagination();

  const columns = useCardsTableColumns({ isModal: true });

  return (
    <DataGrid
      {...paginationProps}
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
      columns={columns}
    />
  );
};
