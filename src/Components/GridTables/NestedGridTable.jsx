import React, { useState, useRef, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { Input, Button, Pagination, Space, Select, Tooltip } from "antd";
import {
  SearchOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ChevronRight } from "@mui/icons-material";

const { Option } = Select;
// Dummy data
const locationData = [
  {
    location: "Boston",
    payments: 6164,
    details: [
      { date: "09/29/2025", tender: "Card", payments: 918 },
      { date: "09/29/2025", tender: "Cash", payments: 74 },
      { date: "09/29/2025", tender: "Deliveroo", payments: 251 },
      { date: "09/30/2025", tender: "Card", payments: 1263 },
      { date: "09/30/2025", tender: "Cash", payments: 86 },
    ],
  },
  {
    location: "Chicago",
    payments: 5281,
    details: [
      { date: "09/29/2025", tender: "Card", payments: 650 },
      { date: "09/30/2025", tender: "Cash", payments: 300 },
    ],
  },
  { location: "New York", payments: 8241, details: [] },
];
export default function DrilldownStyledGridTable({
  data = locationData, // expected top-level array (like locationData)
  locationCols: propLocationCols = null,
  detailCols: propDetailCols = null,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  gridHeight = 400,
  onRowClick = null, // optional callback
  showExport = true,
}) {
  // internal states
  const [breadcrumb, setBreadcrumb] = useState(["Top"]);
  const [isDetail, setIsDetail] = useState(false);
  const [masterRow, setMasterRow] = useState(null); // selected location row when in detail
  const [filterText, setFilterText] = useState("");
  const gridApi = useRef(null);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(0); // 0-based for grid
  const [displayRows, setDisplayRows] = useState([]); // rows currently shown in grid
  const [allRows, setAllRows] = useState(data || []);

  // default columns (override with props)
  const defaultLocationCols = useMemo(
    () => [
      {
        headerName: "Location",
        field: "location",
        flex: 1,
        sortable: true,
        resizable: true,
        cellRenderer: (params) => {
          const hasDetails = params.data?.details?.length > 0;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                  justifyContent: "start",
                width: "100%",
              }}
            >
              {hasDetails && (
                <span
                  style={{
                    color: "#2c2929ff",
                    fontWeight: 800,
                    marginLeft: 0,
                    marginTop:4
                  }}
                >
                  <ChevronRight />
                </span>
              )}
              <span>{params.value}</span>
            </div>
          );
        },
      },
      {
        headerName: "Payments",
        field: "payments",
        flex: 1,
        sortable: true,
        resizable: true,
        valueFormatter: (p) => (p.value ?? 0).toLocaleString(),
      },
    ],
    []
  );

  const defaultDetailCols = useMemo(
    () => [
      {
        headerName: "Date",
        field: "date",
        flex: 1,
        sortable: true,
        resizable: true,
      },
      {
        headerName: "Tender type",
        field: "tender",
        flex: 1,
        sortable: true,
        resizable: true,
      },
      {
        headerName: "Payments",
        field: "payments",
        flex: 1,
        sortable: true,
        resizable: true,
        valueFormatter: (p) => (p.value ?? 0).toLocaleString(),
      },
    ],
    []
  );

  const locationCols = propLocationCols || defaultLocationCols;
  const detailCols = propDetailCols || defaultDetailCols;

  // compute filtered rows when data/filter/isDetail changes
  useEffect(() => {
    // top-level rows are either `data` or the details of the selected master row
    let base = isDetail ? masterRow?.details || [] : data || [];
    // filter client-side by filterText (simple contains on joined values)
    if (filterText) {
      const q = filterText.toLowerCase();
      base = base.filter((r) =>
        Object.values(r).join(" ").toLowerCase().includes(q)
      );
    }
    setAllRows(base);
    // reset to first page when base changes
    setCurrentPage(0);
  }, [data, isDetail, masterRow, filterText]);

  // slice for pagination (client-side)
  useEffect(() => {
    const from = currentPage * pageSize;
    const to = from + pageSize;
    setDisplayRows(allRows.slice(from, to));
    // ensure grid jumps to correct page
    if (gridApi.current && gridApi.current.paginationGoToPage) {
      try {
        gridApi.current.paginationGoToPage(currentPage);
      } catch (e) {
        // ignore
      }
    }
  }, [allRows, currentPage, pageSize]);

  // On grid ready
  const onGridReady = (params) => {
    gridApi.current = params.api;
    // enable pagination in grid and set page size (ag-grid pagination still off, we handle slicing client-side,
    // but setPageSize will help if you prefer ag-grid to handle paging instead).
    if (params.api.paginationSetPageSize) {
      params.api.paginationSetPageSize(pageSize);
    }
  };

  const handleRowClicked = (params) => {
    if (!isDetail) {
      // top level: drilldown only if details exist
      const row = params.data;
      if (row && Array.isArray(row.details) && row.details.length > 0) {
        setIsDetail(true);
        setMasterRow(row);
        setBreadcrumb(["Top", row.location || "Details"]);
        setCurrentPage(0);
        if (onRowClick) onRowClick(row);
      } else {
        // show feedback — no details for this row
        // simple visual approach: flash a tooltip or console message
        // here we just call optional callback
        alert("No data present");
        if (onRowClick) onRowClick(row);
        // You may prefer a toaster notification here.
      }
    }
  };

  const goBack = () => {
    setIsDetail(false);
    setMasterRow(null);
    setBreadcrumb(["Top"]);
    setFilterText("");
    setCurrentPage(0);
  };

  const exportCsv = () => {
    if (gridApi.current && gridApi.current.exportDataAsCsv) {
      gridApi.current.exportDataAsCsv({
        fileName: isDetail
          ? `${masterRow?.location || "details"}-details.csv`
          : `locations.csv`,
      });
    }
  };

  // pagination handlers (Antd uses 1-based page)
  const handlePageChange = (page, size) => {
    setCurrentPage(page - 1);
    if (size && size !== pageSize) {
      setPageSize(size);
      // reset to first page when page size changes
      setCurrentPage(0);
      if (gridApi.current && gridApi.current.paginationSetPageSize) {
        try {
          gridApi.current.paginationSetPageSize(size);
        } catch (e) {}
      }
    }
  };

  const startIndex = allRows.length === 0 ? 0 : currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, allRows.length);

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        background: "#fff",
      }}
    >
      {/* Header: breadcrumb + controls */}
      <div
        style={{
          padding: 12,
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          background: "#fafafa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isDetail ? (
            <Tooltip title="Back">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={goBack}
                aria-label="Go back"
                size="small"
              />
            </Tooltip>
          ) : null}

          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {breadcrumb.join(" / ")}
          </div>
        </div>

        <Space>
          <Input
            prefix={<SearchOutlined />}
            placeholder={isDetail ? "Search details..." : "Search locations..."}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            allowClear
            style={{ width: 240 }}
            aria-label="Search table"
          />

          {showExport && (
            <Button
              icon={<DownloadOutlined />}
              onClick={exportCsv}
              size="small"
              aria-label="Export CSV"
            >
              Export CSV
            </Button>
          )}
        </Space>
      </div>

      {/* Grid */}
      <div
        className="ag-theme-quartz"
        style={{ height: gridHeight, width: "100%" }}
      >
        <AgGridReact
          rowData={displayRows}
          columnDefs={isDetail ? detailCols : locationCols}
          onRowClicked={handleRowClicked}
          onGridReady={onGridReady}
          rowHeight={50}
          headerHeight={55}
          defaultColDef={{ resizable: true, sortable: true, filter: false }}
          animateRows={true}
          frameworkComponents={{}}
          getRowStyle={(params) => ({
            backgroundColor:
              params.node.rowIndex % 2 === 0 ? "#fafafa" : "#fff",
            borderBottom: "1px solid #f0f0f0",
          })}
        />
      </div>

      {/* Footer: pagination + range */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderTop: "1px solid #eee",
          backgroundColor: "#fafafa",
        }}
      >
        <span style={{ fontSize: 12, color: "#666" }}>
          <Select
            value={pageSize}
            onChange={(val) => {
              setPageSize(val);
              setCurrentPage(0);
              if (gridApi.current && gridApi.current.paginationSetPageSize) {
                try {
                  gridApi.current.paginationSetPageSize(val);
                } catch (e) {}
              }
            }}
            size="small"
          >
            {pageSizeOptions.map((s) => (
              <Option key={s} value={s}>
                {s} / page
              </Option>
            ))}
          </Select>
        </span>

        <Pagination
          current={currentPage + 1}
          total={allRows.length}
          pageSize={pageSize}
          showSizeChanger={false} // we already provide a selector
          onChange={handlePageChange}
          pageSizeOptions={pageSizeOptions.map(String)}
        />
      </div>
    </div>
  );
}
