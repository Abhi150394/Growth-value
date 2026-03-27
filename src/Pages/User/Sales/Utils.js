const handlePrint = (gridApi, title = "AG Grid Table") => {
  console.log("gridApigridApi", gridApi);
  if (!gridApi.current) return;

  const api = gridApi.current;

  // Get all rows
  const rows = [];
  api.forEachNode((node) => rows.push(node.data));

  // Get all displayed columns
  const columns = api.getAllDisplayedColumns();

  // Build table headers
  const headers = columns
    .map((col) => col.getColDef().headerName || col.getColDef().field)
    .join("</th><th>");

  // Build table rows
  const rowHtml = rows
    .map((row) => {
      return (
        "<tr>" +
        columns
          .map((col) => {
            const colDef = col.getColDef();
            let value = "";

            // If the column has a field, get it from row
            if (colDef.field) {
              value = row[colDef.field] !== undefined ? row[colDef.field] : "";
            }

            // If the column has a valueGetter, recalc it
            if (colDef.valueGetter) {
              value = colDef.valueGetter({ data: row }) ?? "";
            }

            // If you want, apply rounding or formatting for % columns
            if (colDef.headerName?.includes("YoY")) {
              value = Math.round(value) + "%";
            }
            if (colDef.headerName?.includes("Year")) {
              value = Math.round(value);
            }

            return `<td>${value}</td>`;
          })
          .join("") +
        "</tr>"
      );
    })
    .join("");

  // Full HTML
  const html = `
    <html>
      <head>
        <title>Sales Table</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #007BFF; color: white; }
        </style>
      </head>
      <body>
        <h2>Sales Table</h2>
        <table>
          <thead><tr><th>${headers}</th></tr></thead>
          <tbody>${rowHtml}</tbody>
        </table>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank", "width=800,height=800");
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

export const exportCSV = (gridApi, filename = "table.csv") => {
  if (!gridApi.current) return;

  const api = gridApi.current;

  // 1. Get all rows
  const rows = [];
  api.forEachNode((node) => rows.push(node.data));

  // 2. Get all displayed columns
  const columns = api.getAllDisplayedColumns();

  // 3. Build CSV header
  const headers = columns.map(
    (col) => col.getColDef().headerName || col.getColDef().field
  );
  let csvContent = headers.join(",") + "\n";

  // 4. Build CSV rows
  rows.forEach((row) => {
    const rowValues = columns.map((col) => {
      const colDef = col.getColDef();
      let value = "";

      // Field value
      if (colDef.field) {
        value = row[colDef.field] !== undefined ? row[colDef.field] : "";
      }

      // ValueGetter (e.g., YoY %)
      if (colDef.valueGetter) {
        value = colDef.valueGetter({ data: row }) ?? "";
      }

      // Formatting for % columns
      if (colDef.headerName?.includes("YoY")) {
        value = Math.round(value) + "%";
      }
      if (colDef.headerName?.includes("Year")) {
        value = Math.round(value);
      }

      // Escape commas/quotes in CSV
      if (typeof value === "string" && value.includes(",")) {
        value = `"${value}"`;
      }

      return value;
    });

    csvContent += rowValues.join(",") + "\n";
  });

  // 5. Trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  link.click();
};

export default handlePrint;
