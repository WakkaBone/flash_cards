import { GridColDef } from "@mui/x-data-grid";
import { CardsTableRowType } from "./cards-table";
import { format } from "date-fns";
import { useTTS } from "../../hooks/cards/use-tts";

const HebrewCell = ({ string }: { string: string }) => {
  const { supportsHebrew, tts } = useTTS();
  return <span onClick={() => supportsHebrew && tts(string)}>{string}</span>;
};

export const cardsTableColumns: GridColDef<CardsTableRowType>[] = [
  { field: "english", headerName: "English", flex: 0.5 },
  {
    field: "hebrew",
    headerName: "Hebrew",
    flex: 0.5,
    renderCell: (params) => <HebrewCell string={params.value} />,
  },
  {
    field: "priority",
    headerName: "Priority",
    renderCell: (params) => params.value,
    flex: 0.5,
  },
  { field: "category", headerName: "Category", flex: 0.5 },
  { field: "correct", headerName: "Correct", flex: 0.5 },
  { field: "wrong", headerName: "Wrong", flex: 0.5 },
  { field: "isLearned", headerName: "Is Learned", flex: 0.5 },
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
    flex: 2,
    renderCell: (params) => params.value,
  },
];
