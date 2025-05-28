import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { TableHeader } from "../table-header/table-header";
import { useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { CardModel } from "../../models/card";
import { createCSV, CSV_HEADERS, downloadCsv } from "../../utils/export-util";
import { mapCardToCsvEntry } from "../../utils/mappers";
import { Add, ImportExport } from "@mui/icons-material";
import { useScreenSize } from "../../hooks";

export const CardsHeader = () => {
  const { isMobile } = useScreenSize();
  const navigate = useNavigate();
  const handleAdd = () => navigate(ROUTES.addCard);
  const queryClient = useQueryClient();

  const handleExport = () => {
    const data = queryClient.getQueriesData({
      queryKey: ["cards"],
      exact: false,
    });
    const latestQuery = data[data.length - 1];
    if (!latestQuery) return;
    const { data: queryData } = latestQuery[1] as ApiResponse<CardModel[]>;
    if (!queryData) return;

    const mappedData = queryData.map((card) => mapCardToCsvEntry(card));
    const csvBlob = createCSV(CSV_HEADERS, mappedData);
    downloadCsv(csvBlob, "Cards");
  };

  return (
    <TableHeader>
      <Button
        startIcon={<ImportExport />}
        variant="contained"
        onClick={handleExport}
      >
        Export {isMobile ? "CSV" : "to CSV"}
      </Button>
      <Button startIcon={<Add />} variant="contained" onClick={handleAdd}>
        Add {isMobile ? "" : "Card"}
      </Button>
    </TableHeader>
  );
};
