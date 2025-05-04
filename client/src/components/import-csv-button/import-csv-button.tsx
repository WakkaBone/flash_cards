import { Button } from "@mui/material";
import { useRef } from "react";
import { useImportCsv } from "../../hooks/cards/use-import-csv";
import { ImportExport } from "@mui/icons-material";

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
      <Button
        startIcon={<ImportExport />}
        disabled={isPending}
        loading={isPending}
        onClick={handleButtonClick}
      >
        Import CSV
      </Button>
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
