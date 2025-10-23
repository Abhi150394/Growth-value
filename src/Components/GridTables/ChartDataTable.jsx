import React, { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import Select from "react-select";
import { Pagination } from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { COLORS } from "../../constants";
import printAgGrid, { exportCSV } from "../../Pages/User/Sales/Utils.js"

const ChartDataGroupedTable = ({ data, categories=["all"] }) => {
  const gridApi = useRef(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

    const handlePrint = () => {
      if (gridApi.current) {
        printAgGrid(gridApi, "Sales Table");
      }
    };
  // transform JSON → table rows
  const { tableData, columnDefs } = useMemo(() => {
    if (!data?.detail) return { tableData: [], columnDefs: [] };

    // extract rows
    const periods = [...new Set(data.detail[categories[0]].map((d) => d.period))];

    const tableData = periods.map((date) => {
      const row = { date };

      categories.forEach((cat) => {
        const d = data.detail[cat]?.find((x) => x.period === date);
        if (!d) return;

        const sales = d.total || 0;
        const yoy = d.total_ly ? ((sales - d.total_ly) / d.total_ly) * 100 : 0;

        row[`${cat}_sales`] = sales;
        row[`${cat}_yoy`] = yoy.toFixed(1);
      });

      return row;
    });

    // dynamic columnDefs
    const columnDefs = [
      { headerName: "Date", field: "date", minWidth: 140 },
      ...categories.map((cat) => ({
        // headerName: cat?cat.charAt(0).toUpperCase() + cat.slice(1):cat,
        headerName:cat==='all'?'Overall':!cat.includes(" ")?cat.charAt(0).toUpperCase() + cat.slice(1):cat.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
        children: [
          { headerName: "Sales, $", field: `${cat}_sales` },
          {
            headerName: "YoY Growth %",
            field: `${cat}_yoy`,
            valueFormatter: (p) => (p.value !== undefined ? `${p.value}%` : ""),
          },
        ],
      })),
    ];

    return { tableData, columnDefs };
  }, [data, categories]);

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
    gridApi.current.setGridOption("paginationPageSize", newSize);
    setCurrentPage(0);
  };

  const goToPage = (page) => {
    gridApi.current.paginationGoToPage(page);
    setCurrentPage(page);
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
              <button onClick={handlePrint}>Print Table</button>
            </div>
            <button onClick={() => exportCSV(gridApi)}>Export CSV</button>
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
              // textAlign: "center",
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
              dropdownIndicator: (base) => ({
                ...base,
                padding: "2px 4px",
              }),
              valueContainer: (base) => ({
                ...base,
                padding: "0 6px",
              }),
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

export default ChartDataGroupedTable;
