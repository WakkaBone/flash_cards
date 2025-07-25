import { GridColDef } from "@mui/x-data-grid";
import { formatDateTime } from "../../utils/date-time";
import { useScreenSize, useTTS } from "../../hooks";
import { CardsTableRowType } from "../../components/cards-table/cards-table";
import { PriorityCell } from "../../components/cards-table/priority-cell";

const HebrewCell = ({ string }: { string: string }) => {
  const { supportsHebrew, tts } = useTTS();
  return <span onClick={() => supportsHebrew && tts(string)}>{string}</span>;
};

export const useCardsTableColumns = ({ isModal }: { isModal: boolean }) => {
  const { isMobile, isTablet } = useScreenSize();

  const cardsTableColumns: GridColDef<CardsTableRowType>[] = [
    { field: "english", headerName: "English", flex: !isMobile ? 1 : 0.5 },
    {
      field: "hebrew",
      headerName: "Hebrew",
      flex: !isMobile ? 0.7 : 0.5,
      renderCell: (params) => <HebrewCell string={params.value} />,
    },
    {
      field: "priority",
      headerName: "Priority",
      renderCell: (params) => <PriorityCell priority={params.value} />,
      flex: !isMobile ? 0.7 : 0.5,
    },
    { field: "category", headerName: "Category", flex: 0.5 },
    { field: "correct", headerName: "Correct", flex: 0.5 },
    { field: "wrong", headerName: "Wrong", flex: 0.5 },
    {
      field: "balance",
      headerName: "Balance",
      flex: 0.5,
      renderCell({ row }) {
        const isNegative = row.balance < 0;
        const isPositive = row.balance > 0;
        return (
          <span
            style={{
              fontWeight: "bold",
              color: isNegative ? "red" : isPositive ? "green" : "black",
            }}
          >
            {isNegative ? "-" : isPositive ? "+" : ""}
            {Math.abs(row.balance)}
          </span>
        );
      },
    },
    { field: "isLearned", headerName: "Learned", flex: 0.5 },
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
      flex: 1.5,
      renderCell: (params) => params.value,
    },
  ];

  const columns = isMobile
    ? cardsTableColumns.slice(0, 3)
    : isTablet
    ? cardsTableColumns.slice(0, 7)
    : cardsTableColumns;

  return isModal ? columns.slice(0, 3) : columns;
};
