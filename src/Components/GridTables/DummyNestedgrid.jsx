import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { Pagination } from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

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

export default function DrilldownStyledGrid() {
  const [breadcrumb, setBreadcrumb] = useState(["Top"]);
  const [rowData, setRowData] = useState(locationData);
  const [isDetail, setIsDetail] = useState(false);
  const gridApi = useRef(null);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const locationCols = [
    { headerName: "Location", field: "location", flex: 1 },
    { headerName: "Payments", field: "payments", flex: 1 },
  ];

  const detailCols = [
    { headerName: "Date", field: "date", flex: 1 },
    { headerName: "Tender type", field: "tender", flex: 1 },
    { headerName: "Payments", field: "payments", flex: 1 },
  ];

  const onRowClicked = (params) => {
    if (!isDetail && params.data.details) {
      setRowData(params.data.details);
      setIsDetail(true);
      setBreadcrumb(["Top", params.data.location]);
      setCurrentPage(0);
    }
  };

  const goBack = () => {
    setRowData(locationData);
    setIsDetail(false);
    setBreadcrumb(["Top"]);
    setCurrentPage(0);
  };

  const onGridReady = (params) => {
    gridApi.current = params.api;
    params.api.setGridOption("paginationPageSize", pageSize);
  };

  const goToPage = (page) => {
    gridApi.current.paginationGoToPage(page);
    setCurrentPage(page);
  };

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
      {/* Breadcrumb */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #eee",
          fontSize: "14px",
          background: "#fafafa",
          fontWeight: 500,
        }}
      >
        {breadcrumb.map((b, idx) => (
          <span
            key={idx}
            style={{
              cursor: idx === breadcrumb.length - 1 ? "default" : "pointer",
              color: idx === breadcrumb.length - 1 ? "#333" : "#1677ff",
            }}
            onClick={idx === 0 ? goBack : undefined}
          >
            {b}
            {idx < breadcrumb.length - 1 && " / "}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div
        className="ag-theme-quartz"
        style={{
          height: 400,
          width: "100%",
        }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={isDetail ? detailCols : locationCols}
          onRowClicked={onRowClicked}
          pagination={true}
          suppressPaginationPanel={true}
          onGridReady={onGridReady}
          rowHeight={50}
          headerHeight={55}
          getRowStyle={(params) => ({
            backgroundColor: params.node.rowIndex % 2 === 0 ? "#fafafa" : "#fff",
            borderBottom: "1px solid #f0f0f0",
          })}
        />
      </div>

      {/* Pagination */}
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
        <span style={{ fontSize: "12px", color: "#666" }}>
          {rowData.length > 0
            ? `${currentPage * pageSize + 1} - ${Math.min(
                (currentPage + 1) * pageSize,
                rowData.length
              )} of ${rowData.length}`
            : "0 of 0"}
        </span>

        <Pagination
          current={currentPage + 1}
          total={rowData.length}
          pageSize={pageSize}
          showSizeChanger={false}
          onChange={(page) => goToPage(page - 1)}
        />
      </div>
    </div>
  );
}
