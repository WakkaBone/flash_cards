import { GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { useScreenSize, useTTS } from "../../hooks";
import { CardsTableRowType } from "../../components/cards-table/cards-table";

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
      renderCell: (params) => params.value,
      flex: !isMobile ? 0.7 : 0.5,
    },
    { field: "category", headerName: "Category", flex: 0.5 },
    { field: "correct", headerName: "Correct", flex: 0.5 },
    { field: "wrong", headerName: "Wrong", flex: 0.5 },
    {
      field: "",
      headerName: "Balance",
      flex: 0.5,
      renderCell({ row }) {
        const balance = row.correct - row.wrong;
        const isNegative = balance < 0;
        const isPositive = balance > 0;
        return (
          <span
            style={{
              fontWeight: "bold",
              color: isNegative ? "red" : isPositive ? "green" : "black",
            }}
          >
            {isNegative ? "-" : isPositive ? "+" : ""}
            {Math.abs(balance)}
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
      renderCell: ({ row }) =>
        row.createdAt
          ? format(new Date(row.createdAt), "dd/MM/yyyy HH:mm")
          : "",
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
