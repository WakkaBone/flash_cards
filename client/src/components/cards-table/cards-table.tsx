import { useEffect, useState } from "react";
import { GetCardsFilters } from "../../models/api";
import { useGetCards, useScreenSize, useTablePagination } from "../../hooks";
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { mapCardToTableRow } from "../../utils/mappers";
import { defaultFilters } from "../../hooks/cards/use-cards-table-filters";
import { ToastContainer } from "react-toastify";
import { CardsFilters } from "../cards-filters/cards-filters";
import { cardsTableColumns } from "./columns";
import { BulkActions } from "./bulk-actions";
import { TOAST_CONTAINERS_IDS } from "../../constants";
import { EditCardModal } from "../edit-card-modal/edit-card-modal";
import { CardModel } from "../../models/card";

export type CardsTableRowType = {
  id: string;
  english: string;
  hebrew: string;
  category: string;
  priority: JSX.Element;
  correct: number;
  wrong: number;
  isLearned: string;
  createdAt: string;
  actions: JSX.Element;
};

export const CardsTable = () => {
  const { isMobile, isTablet } = useScreenSize();

  const [filters, setFilters] = useState<GetCardsFilters>(defaultFilters);
  const { data, isLoading, isFetching } = useGetCards(filters);
  const [rows, setRows] = useState<CardsTableRowType[]>([]);

  useEffect(() => {
    if (!data || !data.isSuccess || !data.data) return;
    setRows(data.data.map((item) => mapCardToTableRow(item)));
  }, [data]);

  const paginationProps = useTablePagination();

  const [rowsSelected, setRowsSelected] = useState<GridRowSelectionModel>([]);

  const columns = isMobile
    ? cardsTableColumns.slice(0, 3)
    : isTablet
    ? cardsTableColumns.slice(0, 7)
    : cardsTableColumns;

  const allowEditOnClick = isMobile || isTablet;
  const [isEdit, setIsEdit] = useState(false);
  const [card, setCard] = useState<CardModel | undefined>();
  const onCloseEditModal = () => setCard(undefined);
  useEffect(() => {
    allowEditOnClick && setIsEdit(!!card);
  }, [allowEditOnClick, card]);

  return (
    <>
      <CardsFilters filters={filters} onChange={setFilters} />
      {rowsSelected.length > 0 && (
        <BulkActions
          rowsSelected={rowsSelected}
          setRowsSelected={setRowsSelected}
        />
      )}
      <DataGrid
        {...paginationProps}
        onRowSelectionModelChange={(e) => setRowsSelected(e)}
        checkboxSelection={!isMobile && !isTablet}
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
        disableRowSelectionOnClick
        onRowClick={({ row }) => {
          if (!allowEditOnClick) return;
          const selectedCard = data.data?.find(({ id }) => row.id === id);
          selectedCard && setCard(selectedCard);
        }}
      />
      {allowEditOnClick && card && (
        <EditCardModal open={isEdit} card={card} onClose={onCloseEditModal} />
      )}
      <ToastContainer containerId={TOAST_CONTAINERS_IDS.cardsTable} />
    </>
  );
};
