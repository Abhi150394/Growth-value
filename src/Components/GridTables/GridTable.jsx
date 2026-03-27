import React, { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import Select from "react-select";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Pagination } from "antd";
import { COLORS } from "../../constants";

const DynamicTable = ({ data = [], columnOverrides = {}, options = {} }) => {
  const [columns, setColumns] = useState([]);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const gridApi = useRef(null);

  const pageSizeOptions = [
    { value: 5, label: "5" },
    { value: 8, label: "8" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
  ];

  useEffect(() => {
    if (data.length > 0) {
      const sample = data[0];
      const generatedCols = Object.keys(sample).map((key) => ({
        headerName: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (s) => s.toUpperCase()),
        field: key,
        flex: 1,
        minWidth: 120,
        ...(columnOverrides[key] || {}),
      }));
      setColumns(generatedCols);
    }
  }, [data]);

  const onGridReady = (params) => {
    gridApi.current = params.api;
    gridApi.current.setGridOption("paginationPageSize", pageSize);
    setTotalPages(params.api.paginationGetTotalPages());
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    gridApi.current.setGridOption("paginationPageSize", newSize);
    setTotalPages(gridApi.current.paginationGetTotalPages());
    setCurrentPage(0);
  };

  const goToPage = (page) => {
    gridApi.current.paginationGoToPage(page);
    setCurrentPage(page);
  };
  

  return (
    <div>
      <div
        className="ag-theme-quartz"
        style={{ height: options.height || 500, width: "100%" }} //,border:"1px solid",borderRadius:"5px"
      >
        <AgGridReact
          rowData={data}
          columnDefs={columns}
          pagination={true}
          suppressPaginationPanel={true}
          onGridReady={onGridReady}
          rowHeight={50}
          headerHeight={50}
          defaultColDef={{
            sortable: true,
            filter: options.enableFilter ?? false,
            resizable: options.enableResize ?? false,
            flex: 1,
            minWidth: 120,
            cellStyle: { fontSize: "14px", padding: "10px", fontWeight: 500 },
          }}
          icons={{
            sortAscending: `🔼`,
            sortDescending: `🔽`,
            sortUnSort: ``,
          }}
          {...options}
        />
      </div>

      {/* Custom Pagination Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
        }}
      >
        {/* Left Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {/* Page Size Selector */}
          <Select
            value={pageSizeOptions.find((opt) => opt.value === pageSize)}
            onChange={(selected) =>
              handlePageSizeChange({ target: { value: selected.value } })
            }
            options={pageSizeOptions}
            styles={{
              container: (base) => ({
                ...base,
                width: 80,
                fontSize: "14px",
              }),
              control: (base, state) => ({
                ...base,
                minHeight: "30px",
                borderColor: state.isFocused ? `${COLORS.bgSelected}` : "#ccc",
                boxShadow: state.isFocused
                  ? `0 0 0 1px ${COLORS.borderColor}`
                  : "initial",
                "&:hover": { borderColor: `${COLORS.borderColor}` },
              }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: "2px 4px",
              }),
              valueContainer: (base) => ({
                ...base,
                padding: "0 6px",
              }),
              option: (base, state) => ({
                ...base,
                fontSize: "14px",
                color: "#333",
                backgroundColor: state.isSelected
                  ? COLORS.bgSelected
                  : state.isFocused
                  ? COLORS.bgBase
                  : COLORS.bgLayout,
                color: state.isSelected ? "#000" : COLORS.textBase,
                "&:hover": { backgroundColor: COLORS.bgHoverColor },
              }),
            }}
            isSearchable={false}
          />

          {/* Record Count */}
          <span style={{ fontSize: "12px", color: "#555" }}>
            {data.length > 0
              ? `${currentPage * pageSize + 1} - ${Math.min(
                  (currentPage + 1) * pageSize,
                  data.length
                )} of ${data.length}`
              : "0 of 0"}
          </span>
        </div>

        {/* Page Navigation */}
        <Pagination
          current={currentPage + 1}
          total={data.length}
          pageSize={pageSize}
          showSizeChanger={false}
          onChange={(page) => goToPage(page - 1)}
        />
      </div>
    </div>
  );
};

export default DynamicTable;
