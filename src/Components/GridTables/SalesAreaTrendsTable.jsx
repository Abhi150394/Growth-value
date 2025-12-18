import React, { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import Select from "react-select";
import { Pagination } from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { COLORS } from "../../constants";
import printAgGrid, { exportCSV } from "../../Pages/User/Sales/Utils.js";

/**
 * DynamicSalesTrendsTable
 *
 * Props:
 *  - data: either
 *      a) flat array: [{ date, currentSales, lastSales, salesDiff, salesYOY, ... }, ...]
 *      b) nested: { detail: { <category>: [{ period, total, total_ly, count, count_ly, ...}, ...] } }
 *  - xKey: "date" (default)
 *  - barKey: "salesYOY"  (default)
 *  - lineKey: "lastSales" (default)
 *  - pageSize default 10
 */
const DynamicSalesTrendsTable = ({
  data = [],
  xKey = "date",
  barKey = "salesYOY",
  lineKey = "lastSales",
  pageSize: initialPageSize = 10,
}) => {
  const gridApi = useRef(null);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePrint = () => {
    if (gridApi.current) printAgGrid(gridApi, "Sales Table");
  };

  // Build table rows & columns from incoming data (supports flat array or nested `data.detail`)
  const { tableData, columnDefs } = useMemo(() => {
    // Helper to format header names (cap + handle spaces)
    const niceHeader = (key) => {
      if (!key) return "";
      if (key === "all") return "Overall";
      if (!key.includes(" ")) return key.charAt(0).toUpperCase() + key.slice(1);
      return key
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    };

    // If nested data.detail with categories (old template) - convert to flat rows grouped by period
    if (data && data.detail) {
      // assume categories come from object keys (use same pattern as template)
      const cats = Object.keys(data.detail);
      if (cats.length === 0) return { tableData: [], columnDefs: [] };

      const periods = [
        ...new Set((data.detail[cats[0]] || []).map((d) => d.period)),
      ];

      const tableData = periods.map((period) => {
        const row = { date: period };
        cats.forEach((cat) => {
          const d = (data.detail[cat] || []).find((x) => x.period === period);
          if (!d) return;
          const sales = d.total || 0;
          const yoY = d.total_ly
            ? ((sales - d.total_ly) / d.total_ly) * 100
            : 0;
          row[`${cat}_sales`] = sales;
          row[`${cat}_yoy`] = yoY;
        });
        return row;
      });

      const columnDefs = [
        { headerName: "Date", field: "date", minWidth: 140 },
        ...cats.map((cat) => ({
          headerName: niceHeader(cat),
          children: [
            { headerName: "Sales, $", field: `${cat}_sales` },
            {
              headerName: "YoY Growth %",
              field: `${cat}_yoy`,
              valueFormatter: (p) =>
                p.value !== undefined && p.value !== null
                  ? `${Number(p.value).toFixed(1)}%`
                  : "",
            },
          ],
        })),
      ];

      return { tableData, columnDefs };
    }

    // --- Otherwise assume flat array of daily objects (your provided array) ---
    const flat = Array.isArray(data) ? data : [];
    if (flat.length === 0) return { tableData: [], columnDefs: [] };

    // Build rows - normalise some known keys, but allow graceful missing keys
    const tableData = flat.map((d) => {
      return {
        date: d[xKey] ?? d.date ?? "",
        currentSales: d.currentSales ?? d.current_sales ?? null,
        lastSales: d[lineKey] ?? d.lastSales ?? d.last_sales ?? null,
        salesDiff: d.salesDiff ?? d.sales_diff ?? null,
        salesYOY: d[barKey] ?? d.salesYOY ?? d.sales_yoy ?? null,
        // items keys too (if present)
        currentItems: d.currentItems ?? d.current_items ?? null,
        lastItems: d.lastItems ?? d.last_items ?? null,
        itemsDiff: d.itemsDiff ?? d.items_diff ?? null,
        itemsYOY: d.itemsYOY ?? d.items_yoy ?? null,
      };
    });

    // Build column definitions using the same logical fields the chart uses
    const columnDefs = [
      { headerName: "Date", field: "date", minWidth: 140 },
      {
        headerName: "Current Sales",
        field: "currentSales",
        valueFormatter: (p) =>
          p.value == null ? "" : Number(p.value).toFixed(2),
      },
      {
        headerName: "Last Year Sales",
        field: "lastSales",
        valueFormatter: (p) =>
          p.value == null ? "" : Number(p.value).toFixed(2),
      },
      {
        headerName: "Sales Diff",
        field: "salesDiff",
        valueFormatter: (p) =>
          p.value == null ? "" : Number(p.value).toFixed(2),
      },
      {
        headerName: "Sales YoY %",
        field: "salesYOY",
        valueFormatter: (p) =>
          p.value == null || p.value === "N/A"
            ? p.value === "N/A"
              ? "N/A"
              : ""
            : `${Number(p.value).toFixed(2)}%`,
        cellStyle: (params) => {
          const v = params.value;
          if (v == null || v === "N/A") return {};
          const num = Number(v);
          if (Number.isNaN(num)) return {};
          return { color: num >= 0 ? "green" : "red", fontWeight: 600 };
        },
      },
    //   {
    //     headerName: "Current Items",
    //     field: "currentItems",
    //     valueFormatter: (p) => (p.value == null ? "" : p.value),
    //   },
    //   {
    //     headerName: "Last Items",
    //     field: "lastItems",
    //     valueFormatter: (p) => (p.value == null ? "" : p.value),
    //   },
    //   {
    //     headerName: "Items Diff",
    //     field: "itemsDiff",
    //     valueFormatter: (p) => (p.value == null ? "" : p.value),
    //   },
    //   {
    //     headerName: "Items YoY %",
    //     field: "itemsYOY",
    //     valueFormatter: (p) =>
    //       p.value == null || p.value === "N/A"
    //         ? p.value === "N/A"
    //           ? "N/A"
    //           : ""
    //         : `${Number(p.value).toFixed(2)}%`,
    //     cellStyle: (params) => {
    //       const v = params.value;
    //       if (v == null || v === "N/A") return {};
    //       const num = Number(v);
    //       if (Number.isNaN(num)) return {};
    //       return { color: num >= 0 ? "green" : "red", fontWeight: 600 };
    //     },
    //   },
    ];

    return { tableData, columnDefs };
  }, [data, xKey, barKey, lineKey]);

  // Page size options
  const pageSizeOptions = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
  ];

  const onGridReady = (params) => {
    gridApi.current = params.api;
    // Set initial page size
    try {
      gridApi.current.setPaginationPageSize(pageSize);
    } catch (e) {
      // older ag-grid versions use setGridOption
      if (gridApi.current.setGridOption) {
        gridApi.current.setGridOption("paginationPageSize", pageSize);
      }
    }
  };

  const handlePageSizeChange = (selected) => {
    const newSize = selected.value;
    setPageSize(newSize);
    if (gridApi.current) {
      if (gridApi.current.setPaginationPageSize)
        gridApi.current.setPaginationPageSize(newSize);
      else
        gridApi.current.setGridOption &&
          gridApi.current.setGridOption("paginationPageSize", newSize);
    }
    setCurrentPage(0);
  };

  const goToPage = (page) => {
    if (!gridApi.current) return;
    if (gridApi.current.paginationGoToPage)
      gridApi.current.paginationGoToPage(page);
    setCurrentPage(page);
  };

  return (
    <div>
      <div style={{ marginBottom: "10px", display: "flex", gap: 8 }}>
        <button onClick={handlePrint}>Print Table</button>
        <button onClick={() => exportCSV(gridApi)}>Export CSV</button>
      </div>

      <div
        className="ag-theme-quartz"
        style={{
          height: 460,
          width: "100%",
        }}
      >
        <AgGridReact
          rowData={tableData}
          columnDefs={columnDefs}
          pagination={true}
          suppressPaginationPanel={true}
          onGridReady={onGridReady}
          rowHeight={50}
          headerHeight={50}
          defaultColDef={{
            sortable: true,
            resizable: true,
            flex: 1,
            minWidth: 120,
            cellStyle: {
              fontSize: "14px",
              padding: "10px",
              fontWeight: 300,
            },
          }}
        />
      </div>

      {/* Custom Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <Select
            value={pageSizeOptions.find((opt) => opt.value === pageSize)}
            onChange={handlePageSizeChange}
            options={pageSizeOptions}
            styles={{
              container: (base) => ({ ...base, width: 80, fontSize: "14px" }),
              control: (base, state) => ({
                ...base,
                minHeight: "30px",
                borderColor: state.isFocused ? COLORS.bgSelected : "#ccc",
              }),
              dropdownIndicator: (base) => ({ ...base, padding: "2px 4px" }),
              valueContainer: (base) => ({ ...base, padding: "0 6px" }),
            }}
            isSearchable={false}
          />
          <span style={{ fontSize: "12px", color: "#555" }}>
            {tableData.length > 0
              ? `${currentPage * pageSize + 1} - ${Math.min(
                  (currentPage + 1) * pageSize,
                  tableData.length
                )} of ${tableData.length}`
              : "0 of 0"}
          </span>
        </div>

        <Pagination
          current={currentPage + 1}
          total={tableData.length}
          pageSize={pageSize}
          showSizeChanger={false}
          onChange={(page) => goToPage(page - 1)}
        />
      </div>
    </div>
  );
};

export default DynamicSalesTrendsTable;
