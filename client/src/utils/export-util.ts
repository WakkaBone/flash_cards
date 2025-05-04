export function createCSV<K extends string>(
  headers: readonly K[],
  data: Array<Record<K, any>>
) {
  const csvRows = [];
  csvRows.push(headers.join(","));
  data.forEach((row) =>
    csvRows.push(
      headers
        .map((header) => `"${row[header] === undefined ? "" : row[header]}"`)
        .join(",")
    )
  );
  const csvString = csvRows.join("\n");
  const csvBlob = new Blob(["\uFEFF" + csvString], {
    type: "text/csv;charset=utf-8;",
  });
  return csvBlob;
}

export function downloadCsv(csvBlob: Blob, filename: string) {
  const blobURL = window.URL.createObjectURL(csvBlob);
  // @ts-ignore
  if (typeof window.navigator.msSaveBlob !== "undefined") {
    // @ts-ignore
    window.navigator.msSaveBlob(blob, filename);
    return;
  }
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = blobURL;
  link.setAttribute("download", filename);
  if (typeof link.download === "undefined") {
    link.setAttribute("target", "_blank");
  }
  link.click();

  setTimeout(() => {
    window.URL.revokeObjectURL(blobURL);
  }, 100);
}
