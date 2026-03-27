import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AgGridReact } from "ag-grid-react";
import Select from "react-select";
import { Pagination } from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import printAgGrid, { exportCSV } from "./Utils"; // 🔁 adjust path
import PrintButton from "../../../Components/Buttons/PrintButton"; // 🔁 adjust path
import ExportButton from "../../../Components/Buttons/ExportToCSVButton"; // 🔁 adjust path

const DailySalesSummaryTable = forwardRef(
  (
    {
      data = [],
      COLORS = { green: "#2ecc71", red: "#e74c3c" },
      searchText = "",
      sectionName = "Date", // first column header
    },
    ref
  ) => {
    const gridApi = useRef(null);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);

    const handlePrint = () => {
      if (gridApi.current) {
        printAgGrid(gridApi, "Daily Sales Summary");
      }
    };

    useImperativeHandle(ref, () => ({
      handlePrint,
    }));

    // ---------- Build table data (with Total row) ----------
    const { tableData, columnDefs } = useMemo(() => {
      const rows = Array.isArray(data) ? data : [];

      if (!rows.length) {
        return { tableData: [], columnDefs: [] };
      }

      // Totals
      const totalCurrentSales = rows.reduce(
        (s, r) => s + (Number(r.currentSales) || 0),
        0
      );
      const totalLastSales = rows.reduce(
        (s, r) => s + (Number(r.lastSales) || 0),
        0
      );
      const totalCurrentItems = rows.reduce(
        (s, r) => s + (Number(r.currentItems) || 0),
        0
      );
      const totalLastItems = rows.reduce(
        (s, r) => s + (Number(r.lastItems) || 0),
        0
      );

      const totalRow = {
        identifier: "Total",
        currentSales: totalCurrentSales,
        lastSales: totalLastSales,
        currentItems: totalCurrentItems,
        lastItems: totalLastItems,
      };

      const tableData = [
        totalRow,
        ...rows.map((r) => ({
          identifier: r.date,
          currentSales: r.currentSales ?? 0,
          lastSales: r.lastSales ?? 0,
          currentItems: r.currentItems ?? 0,
          lastItems: r.lastItems ?? 0,
        })),
      ];

      const formatNumber = (v, fractionDigits = 2) =>
        v || v === 0
          ? Number(v).toLocaleString(undefined, {
              maximumFractionDigits: fractionDigits,
            })
          : "";

      // Column definitions
      const columnDefs = [
        { headerName: sectionName, field: "identifier", minWidth: 140 },
        {
          headerName: "Sales",
          children: [
            {
              headerName: "This Year",
              field: "currentSales",
              valueFormatter: (p) => formatNumber(p.value),
            },
            {
              headerName: "Last Year",
              field: "lastSales",
              valueFormatter: (p) => formatNumber(p.value),
            },
            {
              headerName: "YoY, %",
              valueGetter: (p) => {
                const curr = Number(p.data.currentSales ?? 0);
                const last = Number(p.data.lastSales ?? 0);
                if (!last) {
                //   return last === 0 && curr === 0 ? 0 : null;
                    return ((curr - last));
                }
                return ((curr - last) / last) * 100;
              },
              cellRenderer: (p) => {
                const raw = p.value;
                console.log("rawigiyfgkg",raw,p)
                if (raw === null || raw === undefined || Number.isNaN(raw)) {
                  return <span style={{ color: "#666" }}>N/A</span>;
                }
                const val = Math.round(raw);
                const isUp = val >= 0;
                return (
                  <span
                    style={{
                      color: isUp ? COLORS.green : COLORS.red,
                      fontWeight: 700,
                    }}
                  >
                    {val}% {isUp ? "↑" : "↓"}
                  </span>
                );
              },
            },
          ],
        },
        {
          headerName: "Items",
          children: [
            {
              headerName: "This Year",
              field: "currentItems",
              valueFormatter: (p) => formatNumber(p.value, 0),
            },
            {
              headerName: "Last Year",
              field: "lastItems",
              valueFormatter: (p) => formatNumber(p.value, 0),
            },
            {
              headerName: "YoY, %",
              valueGetter: (p) => {
                const curr = Number(p.data.currentItems ?? 0);
                const last = Number(p.data.lastItems ?? 0);
                if (!last) {
                //   return last === 0 && curr === 0 ? 0 : null;
                    return (curr - last)
                }
                return ((curr - last) / last) * 100;
              },
              cellRenderer: (p) => {
                const raw = p.value;
                if (raw === null || raw === undefined || Number.isNaN(raw)) {
                  return <span style={{ color: "#666" }}>N/A</span>;
                }
                const val = Math.round(raw);
                const isUp = val >= 0;
                return (
                  <span
                    style={{
                      color: isUp ? COLORS.green : COLORS.red,
                      fontWeight: 700,
                    }}
                  >
                    {val}% {isUp ? "↑" : "↓"}
                  </span>
                );
              },
            },
          ],
        },
      ];

      return { tableData, columnDefs };
    }, [data, sectionName, COLORS]);

    // ---------- AG Grid pagination ----------
    const pageSizeOptions = [
      { value: 5, label: "5" },
      { value: 10, label: "10" },
      { value: 20, label: "20" },
    ];

    const onGridReady = (params) => {
      gridApi.current = params.api;
      params.api.setGridOption("paginationPageSize", pageSize);
    };

    const handlePageSizeChange = (selected) => {
      const newSize = selected.value;
      setPageSize(newSize);
      if (gridApi.current) {
        gridApi.current.setGridOption("paginationPageSize", newSize);
      }
      setCurrentPage(0);
    };

    const goToPage = (page) => {
      if (!gridApi.current) return;
      gridApi.current.paginationGoToPage(page);
      setCurrentPage(page);
    };

    // ---------- Search filter ----------
    useEffect(() => {
      if (
        !gridApi.current ||
        typeof gridApi.current.setFilterModel !== "function"
      )
        return;

      if (searchText) {
        const model = {};
        columnDefs.forEach((col) => {
          if (!col.children) {
            if (col.field) {
              model[col.field] = {
                filterType: "text",
                type: "contains",
                filter: searchText,
              };
            }
          } else {
            col.children.forEach((child) => {
              if (child.field) {
                model[child.field] = {
                  filterType: "text",
                  type: "contains",
                  filter: searchText,
                };
              }
            });
          }
        });
        gridApi.current.setFilterModel(model);
      } else {
        gridApi.current.setFilterModel(null);
      }
      gridApi.current.onFilterChanged();
    }, [searchText, columnDefs]);

    return (
      <div>
        {/* Buttons */}
        <div style={{ marginBottom: "10px", display: "flex", gap: 8 }}>
          <PrintButton handlePrint={handlePrint} />
          <ExportButton handleCSV={() => exportCSV(gridApi)} />
        </div>

        {/* Grid */}
        <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
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
              filter: true,
              cellStyle: (params) =>
                params.node?.rowIndex === 0
                  ? { fontWeight: 700, background: "#fafafa" } // Total row
                  : { fontSize: "14px", padding: "10px", fontWeight: 500 },
            }}
          />
        </div>

        {/* Pagination */}
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
                control: (base) => ({ ...base, minHeight: "30px" }),
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
  }
);

export default DailySalesSummaryTable;
