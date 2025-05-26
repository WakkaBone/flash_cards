import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { TableHeader } from "../table-header/table-header";
import { useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { CardModel } from "../../models/card";
import { createCSV, downloadCsv } from "../../utils/export-util";
import { priorityMapper } from "../../utils/mappers";
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

    const headers = [
      "English",
      "Hebrew",
      "Priority",
      "Category",
      "Correct",
      "Wrong",
      "Is Learned",
    ];
    const mappedData = queryData.map((card) => ({
      [headers[0]]: card.english,
      [headers[1]]: card.hebrew,
      [headers[2]]: priorityMapper[card.priority],
      [headers[3]]: card.category.label,
      [headers[4]]: card.statistics.correct,
      [headers[5]]: card.statistics.wrong,
      [headers[6]]: card.isLearned ? "Yes" : "No",
    }));

    const csvBlob = createCSV(headers, mappedData);
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
