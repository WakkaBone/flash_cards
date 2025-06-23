import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useRef } from "react";
import { useImportCsv } from "../../hooks/cards/use-import-csv";
import { AttachFile, ImportExport } from "@mui/icons-material";
import { createCSV, downloadCsv } from "../../utils/export-util";

const TooltipContent = () => {
  const fileName = "sample.csv";
  const handleDownloadSample = () => {
    const CSV_FIELD_NAMES = {
      english: "English",
      hebrew: "Hebrew",
      category: "Category",
      details: "Details",
      priority: "Priority",
      isLearned: "Is Learned",
    };

    const sampleWord: Record<
      (typeof CSV_FIELD_NAMES)[keyof typeof CSV_FIELD_NAMES],
      string
    > = {
      [CSV_FIELD_NAMES.english]: "apple",
      [CSV_FIELD_NAMES.hebrew]: "תפוח",
      [CSV_FIELD_NAMES.category]: "Noun",
      [CSV_FIELD_NAMES.details]: "A fruit",
      [CSV_FIELD_NAMES.priority]: "Medium",
      [CSV_FIELD_NAMES.isLearned]: "FALSE",
    };

    const csv = createCSV(Object.keys(sampleWord), [sampleWord]);
    downloadCsv(csv, fileName);
  };

  const rules = [
    "English, Hebrew and Category fields are required!",
    "Category must be an existing category name",
    'Valid priorities are: "Low", "Medium" or "High"',
    'Is Learned valid values are "TRUE" or "FALSE"',
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Typography>Add new cards via CSV file</Typography>
      <Typography>CSV needs to follow this format:</Typography>
      <Typography sx={{ mb: 1 }}>
        <span style={{ cursor: "pointer" }} onClick={handleDownloadSample}>
          <AttachFile sx={{ height: "0.5em", mr: 0 }} />
          {fileName}
        </span>
      </Typography>
      <Typography color="warning" variant="caption">
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {rules.map((rule) => (
            <li key={rule}> *{rule}</li>
          ))}
        </ul>
      </Typography>
    </Box>
  );
};

const ImportCsvButton = () => {
  const { importCsv, isPending } = useImportCsv();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("csv", file);

    importCsv(formData);
  };

  return (
    <>
      <Tooltip title={<TooltipContent />}>
        <Button
          startIcon={<ImportExport />}
          disabled={isPending}
          loading={isPending}
          onClick={handleButtonClick}
        >
          Import CSV
        </Button>
      </Tooltip>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </>
  );
};

export { ImportCsvButton };
